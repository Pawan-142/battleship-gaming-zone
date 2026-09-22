import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTodayDateString, getFutureDateString } from '../utils/formatters';
import { getBranchById } from '../data/branchesData';
import { getGameBySlug } from '../data/gamesData';
import { getPackageById } from '../data/packagesData';
import { validateCoupon } from '../data/offersData';
import { cancellationPolicyTiers } from '../data/policiesData';

const BookingContext = createContext();

const STORAGE_KEY_BOOKINGS = 'hyperdrive_central_bookings_v1';
const STORAGE_KEY_SLOT_HOLDS = 'hyperdrive_central_slot_holds_v1';
const STORAGE_KEY_ACTIVE_HOLD = 'hyperdrive_user_active_hold_v1';

// Seed initial realistic bookings for today and tomorrow to demonstrate live slot occupancy
const getInitialSeedBookings = () => {
  const today = getTodayDateString();
  const tomorrow = getFutureDateString(1);

  return [
    {
      id: "HD-HYD-948102",
      source: "OFFLINE_WALKIN", // Walk-in booking by desk staff
      branchId: "hyd-hitech",
      itemType: "game",
      itemId: "bumper-cars",
      itemName: "Electric Bumper Drift Arena",
      date: today,
      timeSlotId: "1800",
      timeSlotText: "06:00 PM",
      playersCount: 4,
      totalAmount: 1196,
      advancePaid: 1196,
      balanceDue: 0,
      customer: { name: "Aditi Rao", phone: "9876543210", email: "aditi@gmail.com" },
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      qrToken: "HYPERDRIVE-TICKET-HD-HYD-948102"
    },
    {
      id: "HD-HYD-839211",
      source: "ONLINE_PORTAL",
      branchId: "hyd-hitech",
      itemType: "game",
      itemId: "laser-blast",
      itemName: "Laser Blast: Sci-Fi Tactical Arena",
      date: today,
      timeSlotId: "1900",
      timeSlotText: "07:00 PM",
      playersCount: 8,
      totalAmount: 3192,
      advancePaid: 638,
      balanceDue: 2554,
      customer: { name: "Vikram Malhotra", phone: "9849012345", email: "vikram@techfirm.com" },
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      qrToken: "HYPERDRIVE-TICKET-HD-HYD-839211"
    },
    {
      id: "HD-HYD-773820",
      source: "OFFLINE_WALKIN",
      branchId: "hyd-gachibowli",
      itemType: "package",
      itemId: "adrenaline-pack",
      itemName: "Adrenaline Surge Pack",
      date: tomorrow,
      timeSlotId: "1730",
      timeSlotText: "05:30 PM",
      playersCount: 6,
      totalAmount: 4794,
      advancePaid: 1000,
      balanceDue: 3794,
      customer: { name: "Rahul Sharma", phone: "9848099887", email: "rahul@outlook.com" },
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      qrToken: "HYPERDRIVE-TICKET-HD-HYD-773820"
    }
  ];
};

export const BookingProvider = ({ children }) => {
  // Central bookings database
  const [allBookings, setAllBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      return saved ? JSON.parse(saved) : getInitialSeedBookings();
    } catch {
      return getInitialSeedBookings();
    }
  });

  // Central active slot holds (holds from any user or counter)
  const [slotHolds, setSlotHolds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLOT_HOLDS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Current client's active hold session
  const [activeHold, setActiveHold] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_HOLD);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(allBookings));
  }, [allBookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SLOT_HOLDS, JSON.stringify(slotHolds));
  }, [slotHolds]);

  useEffect(() => {
    if (activeHold) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_HOLD, JSON.stringify(activeHold));
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_HOLD);
    }
  }, [activeHold]);

  // Clean expired slot holds every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      const updatedHolds = { ...slotHolds };

      Object.keys(updatedHolds).forEach(key => {
        if (updatedHolds[key].expiresAt <= now) {
          delete updatedHolds[key];
          changed = true;
        }
      });

      if (changed) {
        setSlotHolds(updatedHolds);
      }

      if (activeHold && activeHold.expiresAt <= now) {
        setActiveHold(null);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [slotHolds, activeHold]);

  // Listen for storage changes across tabs for live sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY_BOOKINGS && e.newValue) {
        setAllBookings(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEY_SLOT_HOLDS && e.newValue) {
        setSlotHolds(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Check live slot capacity and availability
  const checkSlotAvailability = (branchId, itemId, date, timeSlotId) => {
    const branch = getBranchById(branchId);
    const maxCapacity = branch.stationCapacities[itemId] || 10;

    // Count confirmed players in this slot
    const confirmedPlayers = allBookings
      .filter(b => b.branchId === branchId && b.itemId === itemId && b.date === date && b.timeSlotId === timeSlotId && b.status === "CONFIRMED")
      .reduce((sum, b) => sum + (b.playersCount || 1), 0);

    // Count players in active temporary hold (unexpired)
    const holdKey = `${branchId}_${itemId}_${date}_${timeSlotId}`;
    const hold = slotHolds[holdKey];
    let heldPlayers = 0;
    if (hold && hold.expiresAt > Date.now()) {
      heldPlayers = hold.playersCount || 0;
    }

    const availableSeats = Math.max(0, maxCapacity - confirmedPlayers - heldPlayers);

    return {
      maxCapacity,
      confirmedPlayers,
      heldPlayers,
      availableSeats,
      isAvailable: availableSeats > 0,
      isSoldOut: availableSeats <= 0
    };
  };

  // Acquire a 5-minute temporary slot hold
  const acquireSlotHold = ({ branchId, itemType, itemId, date, timeSlotId, timeSlotText, playersCount, customerInfo }) => {
    const availability = checkSlotAvailability(branchId, itemId, date, timeSlotId);
    
    // Guard against race condition
    if (availability.availableSeats < playersCount) {
      return {
        success: false,
        message: `Sorry, this slot only has ${availability.availableSeats} spot(s) remaining. Please choose another slot or time.`
      };
    }

    const holdKey = `${branchId}_${itemId}_${date}_${timeSlotId}`;
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const holdData = {
      holdKey,
      holdId: `HOLD-${Date.now()}`,
      branchId,
      itemType,
      itemId,
      date,
      timeSlotId,
      timeSlotText,
      playersCount,
      customerInfo: customerInfo || {},
      expiresAt
    };

    setSlotHolds(prev => ({
      ...prev,
      [holdKey]: holdData
    }));

    setActiveHold(holdData);

    return {
      success: true,
      holdData
    };
  };

  // Release temporary hold
  const releaseSlotHold = () => {
    if (activeHold && activeHold.holdKey) {
      setSlotHolds(prev => {
        const next = { ...prev };
        delete next[activeHold.holdKey];
        return next;
      });
      setActiveHold(null);
    }
  };

  // Confirm booking & simulate server-side idempotent payment verification
  const confirmBookingPayment = ({ paymentMethod, couponCode, customNotes = "" }) => {
    if (!activeHold) {
      return { success: false, message: "No active slot hold session found. Please select your slot again." };
    }

    if (activeHold.expiresAt < Date.now()) {
      releaseSlotHold();
      return { success: false, message: "Your 5-minute slot hold has expired. Please re-select your preferred slot." };
    }

    const branch = getBranchById(activeHold.branchId);
    let itemDetails = null;
    let basePricePerPerson = 299;

    if (activeHold.itemType === "package") {
      itemDetails = getPackageById(activeHold.itemId);
      basePricePerPerson = itemDetails.pricePerPerson;
    } else {
      itemDetails = getGameBySlug(activeHold.itemId);
      basePricePerPerson = itemDetails.pricePerPerson;
    }

    const subtotal = basePricePerPerson * activeHold.playersCount;
    
    // Apply coupon if valid
    let discount = 0;
    if (couponCode) {
      const couponCheck = validateCoupon(couponCode, subtotal, activeHold.playersCount);
      if (couponCheck.valid) {
        discount = couponCheck.discountAmount;
      }
    }

    const finalTotal = Math.max(0, subtotal - discount);

    // Calculate advance payable online (e.g. 20% or ₹100 min)
    let advanceAmount = Math.round((finalTotal * branch.advancePercent) / 100);
    advanceAmount = Math.max(branch.minAdvance * activeHold.playersCount, advanceAmount);
    advanceAmount = Math.min(advanceAmount, finalTotal); // Cannot exceed total

    const balanceDue = finalTotal - advanceAmount;

    const bookingId = `HD-HYD-${Math.floor(100000 + Math.random() * 900000)}`;
    const qrToken = `HYPERDRIVE-PASS-${bookingId}-${activeHold.branchId}-${activeHold.date}-${activeHold.timeSlotId}-${activeHold.playersCount}`;

    const newBooking = {
      id: bookingId,
      source: "ONLINE_PORTAL",
      branchId: activeHold.branchId,
      branchName: branch.name,
      branchAddress: branch.address,
      branchPhone: branch.phone,
      itemType: activeHold.itemType,
      itemId: activeHold.itemId,
      itemName: itemDetails.name,
      itemImage: itemDetails.heroImage || itemDetails.image,
      date: activeHold.date,
      timeSlotId: activeHold.timeSlotId,
      timeSlotText: activeHold.timeSlotText,
      playersCount: activeHold.playersCount,
      subtotal,
      discount,
      couponCode: couponCode || null,
      totalAmount: finalTotal,
      advancePaid: advanceAmount,
      balanceDue,
      paymentMethod,
      paymentStatus: "SUCCESS",
      paymentTransactionId: `TXN-IN-UPI-${Date.now()}`,
      customer: activeHold.customerInfo,
      customNotes,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      qrToken
    };

    // Save to central state
    setAllBookings(prev => [newBooking, ...prev]);

    // Release temporary hold key
    setSlotHolds(prev => {
      const next = { ...prev };
      delete next[activeHold.holdKey];
      return next;
    });

    setActiveHold(null);

    return {
      success: true,
      booking: newBooking
    };
  };

  // Staff / Admin Walk-in Booking Simulator (Instant shared central inventory lock)
  const createStaffWalkinBooking = ({ branchId, itemId, itemType = "game", date, timeSlotId, timeSlotText, playersCount, customerName, customerPhone }) => {
    const branch = getBranchById(branchId);
    const itemDetails = itemType === "package" ? getPackageById(itemId) : getGameBySlug(itemId);
    const subtotal = itemDetails.pricePerPerson * playersCount;

    const bookingId = `HD-WALKIN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking = {
      id: bookingId,
      source: "OFFLINE_WALKIN",
      branchId,
      branchName: branch.name,
      branchAddress: branch.address,
      branchPhone: branch.phone,
      itemType,
      itemId,
      itemName: itemDetails.name,
      itemImage: itemDetails.heroImage || itemDetails.image,
      date,
      timeSlotId,
      timeSlotText,
      playersCount,
      subtotal,
      discount: 0,
      totalAmount: subtotal,
      advancePaid: subtotal,
      balanceDue: 0,
      paymentMethod: "COUNTER_CASH_UPI",
      paymentStatus: "SUCCESS",
      paymentTransactionId: `COUNTER-POS-${Date.now()}`,
      customer: {
        name: customerName || "Walk-in Guest",
        phone: customerPhone || "9999999999",
        email: "walkin@hyperdrivearena.com"
      },
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      qrToken: `HYPERDRIVE-WALKIN-${bookingId}`
    };

    setAllBookings(prev => [newBooking, ...prev]);

    return {
      success: true,
      booking: newBooking
    };
  };

  // Lookup booking by ID and Mobile
  const lookupBooking = (bookingId, phone) => {
    const cleanId = bookingId.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\D/g, "");

    return allBookings.find(b => {
      const idMatch = b.id.toUpperCase() === cleanId;
      const phoneMatch = b.customer?.phone?.replace(/\D/g, "").includes(cleanPhone);
      return idMatch && phoneMatch;
    });
  };

  // Cancel booking with dynamic policy tiers
  const cancelBooking = (bookingId, reason = "Customer Request") => {
    const bookingIndex = allBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) return { success: false, message: "Booking not found" };

    const booking = allBookings[bookingIndex];
    if (booking.status === "CANCELLED") {
      return { success: false, message: "This booking is already cancelled." };
    }

    // Calculate hours until slot
    const slotDateTime = new Date(`${booking.date}T${booking.timeSlotText.includes("PM") && !booking.timeSlotText.startsWith("12") ? parseInt(booking.timeSlotText.slice(0, 2)) + 12 : booking.timeSlotText.slice(0, 2)}:00:00`);
    const diffHours = (slotDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    let refundPercent = 0;
    let refundTierDesc = "Less than 2 hours - Non refundable";

    if (diffHours >= 24) {
      refundPercent = 100;
      refundTierDesc = "Full 100% Refund (>24 hours prior)";
    } else if (diffHours >= 6) {
      refundPercent = 75;
      refundTierDesc = "75% Refund (6-24 hours prior)";
    } else if (diffHours >= 2) {
      refundPercent = 50;
      refundTierDesc = "50% Arena Wallet Credit (2-6 hours prior)";
    }

    const refundAmount = Math.round((booking.advancePaid * refundPercent) / 100);

    const updatedBooking = {
      ...booking,
      status: "CANCELLED",
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason,
      refundPercent,
      refundAmount,
      refundTierDesc
    };

    const updatedList = [...allBookings];
    updatedList[bookingIndex] = updatedBooking;
    setAllBookings(updatedList);

    return {
      success: true,
      booking: updatedBooking,
      refundAmount,
      refundTierDesc
    };
  };

  // Staff Check-In Function (Mark customer arrived & game ready)
  const markBookingCheckedIn = (bookingId, marshalNotes = "") => {
    const bookingIndex = allBookings.findIndex(b => b.id.toUpperCase() === bookingId.trim().toUpperCase());
    if (bookingIndex === -1) return { success: false, message: "Booking not found." };

    const booking = allBookings[bookingIndex];
    if (booking.status === "CHECKED_IN") {
      return { success: false, message: "Customer is already checked in." };
    }
    if (booking.status === "CANCELLED") {
      return { success: false, message: "Cannot check in a cancelled booking." };
    }

    const updatedBooking = {
      ...booking,
      status: "CHECKED_IN",
      checkedInAt: new Date().toISOString(),
      marshalNotes: marshalNotes || booking.marshalNotes || "Checked in at reception desk"
    };

    const updatedList = [...allBookings];
    updatedList[bookingIndex] = updatedBooking;
    setAllBookings(updatedList);

    return {
      success: true,
      booking: updatedBooking,
      message: `Booking #${booking.id} checked in successfully!`
    };
  };

  // Staff Collect Remaining Balance Due
  const collectBalancePayment = (bookingId, paymentMethod = "COUNTER_UPI") => {
    const bookingIndex = allBookings.findIndex(b => b.id.toUpperCase() === bookingId.trim().toUpperCase());
    if (bookingIndex === -1) return { success: false, message: "Booking not found." };

    const booking = allBookings[bookingIndex];
    if (booking.balanceDue <= 0) {
      return { success: false, message: "No balance due on this booking." };
    }

    const updatedBooking = {
      ...booking,
      advancePaid: booking.totalAmount,
      balanceDue: 0,
      balanceSettledAt: new Date().toISOString(),
      balancePaymentMethod: paymentMethod,
      balanceTxnId: `BAL-SETTLE-${Date.now()}`
    };

    const updatedList = [...allBookings];
    updatedList[bookingIndex] = updatedBooking;
    setAllBookings(updatedList);

    return {
      success: true,
      booking: updatedBooking,
      message: `Balance of ₹${booking.balanceDue} collected via ${paymentMethod}!`
    };
  };

  return (
    <BookingContext.Provider
      value={{
        allBookings,
        slotHolds,
        activeHold,
        checkSlotAvailability,
        acquireSlotHold,
        releaseSlotHold,
        confirmBookingPayment,
        createStaffWalkinBooking,
        lookupBooking,
        cancelBooking,
        markBookingCheckedIn,
        collectBalancePayment
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
