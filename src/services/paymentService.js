/**
 * Razorpay Payment Gateway Service
 * Handles Razorpay Standard Checkout SDK lifecycle, Sandbox Testing & Live Keys.
 */

// Configured from your MockGateway.com Dashboard
const DEFAULT_RAZORPAY_TEST_KEY = "rzp_test_ZtZZQ7Ujq5TPLA";
const DEFAULT_RAZORPAY_TEST_SECRET = "eL0LTbbT5gRs9xeoRPue";

export const getRazorpayKey = () => {
  return localStorage.getItem('hyperdrive_rzp_key') || DEFAULT_RAZORPAY_TEST_KEY;
};

export const getRazorpaySecret = () => {
  return localStorage.getItem('hyperdrive_rzp_secret') || DEFAULT_RAZORPAY_TEST_SECRET;
};

export const setRazorpayKey = (newKey, newSecret = "") => {
  if (newKey && newKey.trim()) {
    localStorage.setItem('hyperdrive_rzp_key', newKey.trim());
  } else {
    localStorage.removeItem('hyperdrive_rzp_key');
  }
  if (newSecret && newSecret.trim()) {
    localStorage.setItem('hyperdrive_rzp_secret', newSecret.trim());
  }
};

/**
 * Initializes and opens Razorpay Standard Checkout Popup
 * @param {Object} options Payment Configuration
 * @returns {Promise<Object>} Resolves on successful payment response, rejects on dismissal/error
 */
export const initiateRazorpayPayment = ({
  amount, // in INR (e.g. 100 or 500)
  itemName = "BATTLESHIP Arena Session Pass",
  bookingId,
  customer = {},
  themeColor = "#00f0ff"
}) => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay SDK script is loaded on window
    if (typeof window.Razorpay === 'undefined') {
      console.warn("Razorpay script not found on window. Launching interactive Sandbox Simulator.");
      // Provide simulated test gateway response
      setTimeout(() => {
        const mockPaymentId = `pay_mock_${Date.now()}`;
        resolve({
          razorpay_payment_id: mockPaymentId,
          razorpay_order_id: `order_mock_${Date.now()}`,
          razorpay_signature: `sig_mock_${Math.random().toString(36).substring(2)}`,
          mode: 'SANDBOX_SIMULATOR'
        });
      }, 1200);
      return;
    }

    const key = getRazorpayKey();
    const amountInPaise = Math.round(amount * 100);

    const rzpOptions = {
      key: key,
      amount: amountInPaise,
      currency: "INR",
      name: "BATTLESHIP ARENA",
      description: `Advance Pass Reservation (${itemName})`,
      image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%230a0d14'/><path d='M20 50 L50 20 L80 50 L50 80 Z' fill='none' stroke='%2300f0ff' stroke-width='8'/><circle cx='50' cy='50' r='14' fill='%2300f0ff'/></svg>",
      prefill: {
        name: customer.name || "Arena Guest",
        email: customer.email || "guest@battleshipgaming.com",
        contact: customer.phone || "9876543210"
      },
      notes: {
        booking_ref: bookingId || `BS-${Date.now()}`,
        venue: "Hyderabad Flagship Arena",
        item: itemName
      },
      theme: {
        color: themeColor,
        backdrop_color: "rgba(3, 5, 8, 0.95)"
      },
      handler: function (response) {
        if (response && response.razorpay_payment_id) {
          resolve({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id || null,
            razorpay_signature: response.razorpay_signature || null,
            mode: 'RAZORPAY_GATEWAY'
          });
        } else {
          reject(new Error("Invalid payment response from Razorpay."));
        }
      },
      modal: {
        ondismiss: function () {
          reject(new Error("Payment modal was closed by user."));
        },
        escape: true,
        backdropclose: false
      }
    };

    try {
      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', function (response) {
        console.error("Razorpay Payment Failed:", response.error);
        reject(new Error(response.error.description || "Payment transaction failed."));
      });
      rzp.open();
    } catch (err) {
      console.error("Failed to open Razorpay modal:", err);
      reject(err);
    }
  });
};
