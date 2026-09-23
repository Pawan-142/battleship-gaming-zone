export const cancellationPolicyTiers = [
  {
    timeWindow: "More than 24 hours prior to scheduled slot",
    refundPercentage: 100,
    refundText: "100% Full Refund",
    description: "Cancel anytime up to 24 hours before your booking time for an immediate full refund to your original payment method.",
    badge: "Free Cancellation"
  },
  {
    timeWindow: "Between 6 hours to 24 hours prior",
    refundPercentage: 75,
    refundText: "75% Refund (or 100% Free Rescheduling)",
    description: "Receive 75% refund or reschedule your date/time slot free of charge to any date within 30 days.",
    badge: "Flexible"
  },
  {
    timeWindow: "Between 2 hours to 6 hours prior",
    refundPercentage: 50,
    refundText: "50% Arena Wallet Credit",
    description: "50% of your advance payment is credited to your Battleship smart card wallet for your next visit.",
    badge: "Wallet Credit"
  },
  {
    timeWindow: "Less than 2 hours or No-Show",
    refundPercentage: 0,
    refundText: "Non-refundable",
    description: "Due to physical station holds and staff reservation, bookings cancelled under 2 hours or missed cannot be refunded.",
    badge: "No Refund"
  }
];

export const venueRules = [
  "Closed-toe athletic shoes required for Bumper Cars, Laser Combat, and Bowling.",
  "Children under 10 years must have an accompanying adult present on the premises.",
  "Outside food and beverages are not permitted inside the gaming arenas (permitted in private party suites with catering packages).",
  "Smoking, e-cigarettes, and alcohol are strictly prohibited across all arena premises.",
  "Arrive at the counter at least 15 minutes before your scheduled slot time for ticket check-in & briefing."
];

export const faqData = [
  {
    category: "Bookings & Payments",
    items: [
      {
        q: "Why do I only pay an advance online instead of full price?",
        a: "We only charge a small advance (approx. ₹100 or 20%) to guarantee your physical lane or arena slot without charging you the entire amount upfront. The remaining balance can be settled easily via UPI, Card, or Cash when you check in at the venue desk."
      },
      {
        q: "How does the 5-minute temporary slot hold work?",
        a: "When you select a time slot and proceed to checkout, our central inventory locks that specific station for 5 minutes. No other online customer or offline counter agent can take your slot while you complete your payment. If not completed within 5 minutes, the slot is released back to live availability."
      },
      {
        q: "What happens if our group size changes before we arrive?",
        a: "You can add more players at the venue counter subject to capacity, or call the branch support desk in advance. If your squad reduces, our cancellation tier rules apply to the excess advance."
      }
    ]
  },
  {
    category: "Venue & Experiences",
    items: [
      {
        q: "Are the bumper cars and laser tag safe for children?",
        a: "Yes! Our electric bumper cars use shock-absorbing pneumatic rings and 4-point harness belts. Our laser combat equipment uses Class 1 eye-safe infrared beams with soft padded vests and certified safety marshals constantly supervising the floor."
      },
      {
        q: "Do you have parking available at the branches?",
        a: "Yes. Both our Hitech City and Gachibowli locations have dedicated multi-level covered parking and complimentary valet assistance for Battleship guests."
      },
      {
        q: "Can we organize corporate tournaments or private birthday parties?",
        a: "Absolutely! We offer dedicated party suites, private arena rentals, custom tournament brackets, catering menus, and audio-visual setups. Browse our Packages page or submit an inquiry through our Contact page."
      }
    ]
  },
  {
    category: "Arrival & Check-in",
    items: [
      {
        q: "How do I check in upon arrival at the gaming zone?",
        a: "Simply show the digital QR code from your booking confirmation screen (or SMS/WhatsApp message) at the Express Check-in desk. Our marshals will scan your pass, issue your wristbands/cards, and guide you directly to your game station."
      },
      {
        q: "What if we are running late?",
        a: "We hold your slot for up to 15 minutes past the start time. If delayed further, our floor marshals will do their best to accommodate you in the next available open slot without forfeiture."
      }
    ]
  }
];
