export const offersData = [
  {
    code: "WEEKENDPLAY",
    title: "Weekend Play More Bonanza",
    discountType: "percentage",
    discountValue: 15,
    description: "Get flat 15% OFF on all individual experiences and packs when booking for 3 or more people on Friday, Saturday & Sunday.",
    validity: "Valid until 31 Dec 2026",
    minSpend: 900,
    badge: "Trending Weekend",
    applicableFor: "All Experiences & Packs",
    terms: "Applicable on online advance bookings only. Cannot be clubbed with corporate invoice rates."
  },
  {
    code: "STUDENT50",
    title: "College & Student Rush Hours",
    discountType: "fixed",
    discountValue: 150,
    description: "Flat ₹150 OFF per person on Laser Blast & Bowling between 11 AM - 5 PM on weekdays (Mon-Thu). Just flash your valid college ID card at the desk!",
    validity: "Monday to Thursday (11 AM - 5 PM)",
    minSpend: 500,
    badge: "Student Special",
    applicableFor: "Laser Blast & Bowling",
    terms: "Must show student ID card at physical counter check-in."
  },
  {
    code: "HYPERGANG",
    title: "Squad / Group Power Discount",
    discountType: "percentage",
    discountValue: 20,
    description: "Bringing your entire gang? Enjoy flat 20% OFF on group bookings of 6 or more players across any attraction.",
    validity: "Valid all days",
    minSpend: 1800,
    badge: "Squad Savings",
    applicableFor: "6+ Players",
    terms: "Automatically calculated at checkout when player count is 6 or higher."
  },
  {
    code: "NIGHTOWL",
    title: "After-Dark Neon Rush (9 PM - 11:30 PM)",
    discountType: "fixed",
    discountValue: 100,
    description: "Late night gaming under full neon arena lighting with live DJ tracks. Get flat ₹100 instant cashback on your game card.",
    validity: "Daily after 9:00 PM",
    minSpend: 600,
    badge: "Night Life",
    applicableFor: "All Night Slots",
    terms: "Applicable for slots starting 9:00 PM onwards."
  }
];

export const validateCoupon = (code, subtotal, playersCount = 1) => {
  if (!code) return { valid: false, message: "No coupon provided" };
  const cleanCode = code.trim().toUpperCase();
  const offer = offersData.find(o => o.code === cleanCode);

  if (!offer) {
    return { valid: false, message: "Invalid promo coupon code." };
  }

  if (subtotal < offer.minSpend) {
    return { valid: false, message: `Minimum booking value of ₹${offer.minSpend} required for this coupon.` };
  }

  if (offer.code === "HYPERGANG" && playersCount < 6) {
    return { valid: false, message: "HYPERGANG coupon requires a squad of at least 6 people." };
  }

  let discountAmount = 0;
  if (offer.discountType === "percentage") {
    discountAmount = Math.round((subtotal * offer.discountValue) / 100);
  } else {
    discountAmount = offer.discountValue;
  }

  return {
    valid: true,
    offer,
    discountAmount: Math.min(discountAmount, subtotal - 50)
  };
};
