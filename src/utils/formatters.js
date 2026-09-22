// Formatter utilities for Indian Currency, Dates, and Time Slots

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

// Generate standard venue daily time slots from 11:00 AM to 10:30 PM (every 30 mins)
export const generateDailyTimeSlots = () => {
  return [
    { id: "1100", time: "11:00 AM", period: "Morning", peak: false },
    { id: "1130", time: "11:30 AM", period: "Morning", peak: false },
    { id: "1200", time: "12:00 PM", period: "Afternoon", peak: false },
    { id: "1230", time: "12:30 PM", period: "Afternoon", peak: false },
    { id: "1300", time: "01:00 PM", period: "Afternoon", peak: false },
    { id: "1330", time: "01:30 PM", period: "Afternoon", peak: false },
    { id: "1400", time: "02:00 PM", period: "Afternoon", peak: false },
    { id: "1430", time: "02:30 PM", period: "Afternoon", peak: false },
    { id: "1500", time: "03:00 PM", period: "Afternoon", peak: false },
    { id: "1530", time: "03:30 PM", period: "Afternoon", peak: false },
    { id: "1600", time: "04:00 PM", period: "Evening", peak: true },
    { id: "1630", time: "04:30 PM", period: "Evening", peak: true },
    { id: "1700", time: "05:00 PM", period: "Evening", peak: true },
    { id: "1730", time: "05:30 PM", period: "Evening", peak: true },
    { id: "1800", time: "06:00 PM", period: "Evening", peak: true },
    { id: "1830", time: "06:30 PM", period: "Evening", peak: true },
    { id: "1900", time: "07:00 PM", period: "Prime Night", peak: true },
    { id: "1930", time: "07:30 PM", period: "Prime Night", peak: true },
    { id: "2000", time: "08:00 PM", period: "Prime Night", peak: true },
    { id: "2030", time: "08:30 PM", period: "Prime Night", peak: true },
    { id: "2100", time: "09:00 PM", period: "Prime Night", peak: true },
    { id: "2130", time: "09:30 PM", period: "Late Night", peak: false },
    { id: "2200", time: "10:00 PM", period: "Late Night", peak: false },
    { id: "2230", time: "10:30 PM", period: "Late Night", peak: false }
  ];
};

export const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const getFutureDateString = (daysAhead = 1) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
};
