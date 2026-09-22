export const gamesData = [
  {
    id: "bumper-cars",
    slug: "bumper-cars",
    name: "Electric Bumper Drift Arena",
    category: "High Adrenaline",
    tagline: "Spin, bump, and drift in 360-degree LED electric bumper pods!",
    shortDesc: "High-voltage electric bumper cars with responsive 360-degree dual joy controls, pneumatic impact rings, and reactive arena soundscapes.",
    heroImage: "/images/bumper-cars.jpg",
    gallery: [
      "/images/bumper-cars.jpg",
      "/images/arcade-pass.jpg",
      "/images/venue-entrance.jpg"
    ],
    pricePerPerson: 299,
    durationMinutes: 10,
    durationDisplay: "10 Mins (6 min active drift)",
    playersMin: 1,
    playersMax: 8,
    playersDisplay: "1 - 8 Players",
    ageRequirement: "Ages 6+",
    heightRequirement: "Min. 105 cm",
    safetyGear: "Pneumatic 4-point seat harness & padded headrest",
    branchesAvailable: ["hyd-hitech", "hyd-gachibowli"],
    rating: 4.9,
    reviewsCount: 428,
    badge: "Crowd Favorite",
    overview: "Step into the most exhilarating electric bumper ring in South India. Our state-of-the-art vehicles feature dual-stick 360-degree spinning capabilities, surround-sound bass engines, and illuminated LED chassis that react to every thrilling impact.",
    howItWorks: [
      { step: "1", title: "Safety Briefing", desc: "Our trained marshals assist you into your vehicle and lock the 4-point safety harness." },
      { step: "2", title: "Dual Joystick Controls", desc: "Push both sticks forward to accelerate, pull back to reverse, or push oppositely to execute full 360° spins." },
      { step: "3", title: "Arena Battle", desc: "Battle your friends to score spin points and trigger audio bumper reaction pulses." },
      { step: "4", title: "Automated Docking", desc: "Safe remote cut-off system guides all cars gracefully to their docking charging bays." }
    ],
    safetyRules: [
      "Closed-toe footwear mandatory (no loose slippers/flip-flops).",
      "Seatbelts must remain firmly fastened for the entire duration.",
      "Hands and arms must remain inside the vehicle perimeter.",
      "Not recommended for expectant mothers or guests with recent neck/back injuries."
    ],
    faqs: [
      { q: "Can a parent ride with a small child?", a: "Yes! We have dual-seater parent-child cars equipped with secondary safety locks." },
      { q: "Do the cars run on ceiling power grids with sparks?", a: "No, our arena uses 100% floor-induction and high-density battery pods—completely spark-free, odorless, and eco-friendly." }
    ]
  },
  {
    id: "laser-blast",
    slug: "laser-blast",
    name: "Laser Blast: Sci-Fi Tactical Arena",
    category: "Group Battle",
    tagline: "2-Tier futuristic combat arena with phasers, smoke effects & glowing targets.",
    shortDesc: "Equip sensor-haptic vests and precision phasers. Navigate fog-filled corridors, elevated sniper bridges, and team bases in tactical battle.",
    heroImage: "/images/laser-blast.jpg",
    gallery: [
      "/images/laser-blast.jpg",
      "/images/hyper-bowling.jpg",
      "/images/venue-entrance.jpg"
    ],
    pricePerPerson: 399,
    durationMinutes: 15,
    durationDisplay: "15 Mins (Mission Brief + Match)",
    playersMin: 2,
    playersMax: 16,
    playersDisplay: "2 - 16 Players (Team / Free-for-All)",
    ageRequirement: "Ages 7+",
    heightRequirement: "Min. 115 cm",
    safetyGear: "Ultralight Haptic Sensor Vest & Precision Infrared Phaser",
    branchesAvailable: ["hyd-hitech", "hyd-gachibowli"],
    rating: 5.0,
    reviewsCount: 612,
    badge: "Top Rated for Groups",
    overview: "HyperDrive's Laser Blast is a multi-level cyberpunk arena powered by infrared targeting technology. Score points by tagging opponents' chest, back, and phaser sensors while defending your team base from enemy incursions.",
    howItWorks: [
      { step: "1", title: "Vesting Room", desc: "Enter the decontamination airlock and suit up in your illuminated LED tactical vest." },
      { step: "2", title: "Mission Briefing", desc: "Choose Team Deathmatch, Base Conquest, or Solo Survivor mode with the arena commander." },
      { step: "3", title: "Tactical Engagement", desc: "Use wall covers, ramps, and elevated platforms with real-time audio scoring in your ear." },
      { step: "4", title: "Live Scorecards", desc: "Review detailed individual accuracy, kill/death ratios, and MVP rankings on the big screens." }
    ],
    safetyRules: [
      "No running, physical contact, or climbing on arena partitions.",
      "Two-handed phaser operation required at all times.",
      "Follow field marshals' whistle signals immediately."
    ],
    faqs: [
      { q: "Is the laser beam harmful to the eyes?", a: "Not at all. We utilize safe, certified Class 1 low-energy infrared beams with visible guide LEDs—100% eye-safe." },
      { q: "Can we book a private battle for our team?", a: "Yes! Minimum 10 players reserves the entire laser tag arena exclusively for your group." }
    ]
  },
  {
    id: "hyper-bowling",
    slug: "hyper-bowling",
    name: "Hyper Bowling & UV Glow Lanes",
    category: "Family & Social",
    tagline: "Next-gen bowling with animated projection scoring & bumper challenge games.",
    shortDesc: "Synthetic polished hardwood lanes illuminated by ultraviolet blacklights, responsive bumper lighting, and custom lounge seating with table service.",
    heroImage: "/images/hyper-bowling.jpg",
    gallery: [
      "/images/hyper-bowling.jpg",
      "/images/arcade-pass.jpg",
      "/images/venue-entrance.jpg"
    ],
    pricePerPerson: 349,
    durationMinutes: 45,
    durationDisplay: "1 Game (10 Frames) / ~45 Mins",
    playersMin: 1,
    playersMax: 6,
    playersDisplay: "1 - 6 Players per Lane",
    ageRequirement: "All Ages",
    heightRequirement: "No restriction (kids lightweight balls & ramps available)",
    safetyGear: "Sanitized Bowling Shoes included free of charge",
    branchesAvailable: ["hyd-hitech", "hyd-gachibowli"],
    rating: 4.8,
    reviewsCount: 520,
    badge: "Popular for Couples & Families",
    overview: "Hyper Bowling revolutionizes classic ten-pin bowling. Bounce your ball off dynamic colorful LED bumpers to multiply your score, or play traditional tournament-spec ten-pin bowling with real-time avatar animations.",
    howItWorks: [
      { step: "1", title: "Shoe & Ball Fitting", desc: "Pick sanitized performance bowling shoes and choose your ball weight (6 lbs to 14 lbs)." },
      { step: "2", title: "Interactive Setup", desc: "Add player photos or avatars on the touchscreen console and select game rules." },
      { step: "3", title: "Roll & Strike", desc: "Enjoy smooth high-speed ball returns, UV reactive pins, and celebratory strike light shows." },
      { step: "4", title: "Food & Drinks", desc: "Order hot pizza, nachos, and cold beverages delivered directly to your lane lounge." }
    ],
    safetyRules: [
      "Bowling shoes mandatory past the approach line.",
      "One bowler on the approach at a time.",
      "Do not step past the foul line (lanes are oiled)."
    ],
    faqs: [
      { q: "Are bowling shoes provided?", a: "Yes! High-grade sanitized bowling shoes with fresh disposable socks are included in every ticket." }
    ]
  },
  {
    id: "vr-pods",
    slug: "vr-pods",
    name: "9D VR Motion Simulator Pods",
    category: "Immersive VR",
    tagline: "Feel 360° motion, wind, and hyper-realistic gravity in futuristic immersion eggs.",
    shortDesc: "Dynamic multi-axis hydraulic motion seats synced with ultra-high resolution VR headsets, wind blowers, and haptic leg-sweepers for wild virtual adventures.",
    heroImage: "/images/vr-pods.jpg",
    gallery: [
      "/images/vr-pods.jpg",
      "/images/laser-blast.jpg",
      "/images/venue-entrance.jpg"
    ],
    pricePerPerson: 249,
    durationMinutes: 10,
    durationDisplay: "10 Mins (2 Full Ride Scenarios)",
    playersMin: 1,
    playersMax: 4,
    playersDisplay: "1 - 4 Simultaneous Pods",
    ageRequirement: "Ages 8+",
    heightRequirement: "Min. 120 cm",
    safetyGear: "Sanitized 4K VR Headset with hygiene mask & safety lap bar",
    branchesAvailable: ["hyd-hitech", "hyd-gachibowli"],
    rating: 4.9,
    reviewsCount: 390,
    badge: "Mind-Blowing Immersion",
    overview: "Choose from over 30 cinematic simulator experiences: from supersonic orbital space coaster drops to jurassic dinosaur chases and deep ocean abyssal expeditions.",
    howItWorks: [
      { step: "1", title: "Experience Selection", desc: "Browse thrilling roller coasters, sci-fi battles, haunted mines, or kid-friendly fantasy flights." },
      { step: "2", title: "Headset Fitting", desc: "Staff fits sterile disposable eye masks and adjusts crystal-clear 4K binocular lenses." },
      { step: "3", title: "Total Immersion", desc: "Pod tilts, drops, and vibrates in exact synchronization with what you see and hear." }
    ],
    safetyRules: [
      "Keep hands gripping side handle bars throughout the motion simulation.",
      "Emergency stop button available at easy reach for any user request."
    ],
    faqs: [
      { q: "Does it cause motion sickness?", a: "Our 90Hz low-latency high frame rate headsets and synchronized pneumatic pitch eliminate standard VR lag." }
    ]
  },
  {
    id: "arcade-pass",
    slug: "arcade-pass",
    name: "Hyper Arcade & Redemption Alley",
    category: "Family & Social",
    tagline: "Over 60+ classic, rhythm, racing, air hockey & ticket redemption machines.",
    shortDesc: "Tap-and-play RFID cards with access to Raw Thrills Superbike racers, Jurassic Park shooters, Dance Rush, Halo Fireteam, claw machines, and prize redemption counters.",
    heroImage: "/images/arcade-pass.jpg",
    gallery: [
      "/images/arcade-pass.jpg",
      "/images/bumper-cars.jpg",
      "/images/venue-entrance.jpg"
    ],
    pricePerPerson: 499,
    durationMinutes: 60,
    durationDisplay: "Unlimited / Preloaded Credits (₹700 Value)",
    playersMin: 1,
    playersMax: 20,
    playersDisplay: "1 - 20+ Players",
    ageRequirement: "All Ages",
    heightRequirement: "No restriction",
    safetyGear: "Contactless Smart Tap Game Card",
    branchesAvailable: ["hyd-hitech", "hyd-gachibowli"],
    rating: 4.8,
    reviewsCount: 780,
    badge: "Best Value for Kids & Friends",
    overview: "From retro arcade nostalgia to the latest blockbuster arcade simulators. Collect digital redemption tickets on your game card and claim premium prizes at our redemption boutique.",
    howItWorks: [
      { step: "1", title: "Collect Smart Card", desc: "Pick up your NFC smart card at the concierge with preloaded game credits & bonus play." },
      { step: "2", title: "Tap & Play", desc: "Simply tap any machine's luminous reader to start playing immediately." },
      { step: "3", title: "Redeem Big", desc: "Win tickets to redeem giant plushies, gaming peripherals, LEGO sets, and electronics." }
    ],
    safetyRules: [
      "Please respect shared arcade machines and queue courteously.",
      "Food and open drinks not allowed on arcade machine cabinets."
    ],
    faqs: [
      { q: "Do the card credits expire?", a: "Arcade card credits remain valid for 12 months from your booking date." }
    ]
  },
  {
    id: "kids-zone",
    slug: "kids-zone",
    name: "Kids Cyber Adventure & Foam Arena",
    category: "Family & Kids",
    tagline: "Multi-level soft play obstacle maze, ninja slides & interactive ball blasters.",
    shortDesc: "A safe, heavily padded multi-level indoor playground designed for children. Features giant spiral slides, trampoline zones, ball pits, and monitored entry gates.",
    heroImage: "/images/kids-zone.jpg",
    gallery: [
      "/images/kids-zone.jpg",
      "/images/arcade-pass.jpg",
      "/images/venue-entrance.jpg"
    ],
    pricePerPerson: 299,
    durationMinutes: 60,
    durationDisplay: "60 Mins Play Time",
    playersMin: 1,
    playersMax: 15,
    playersDisplay: "Kids ages 2 - 12 (1 Parent Free)",
    ageRequirement: "Ages 2 - 12",
    heightRequirement: "Max. 140 cm",
    safetyGear: "Anti-skid grip socks & sanitized foam play area",
    branchesAvailable: ["hyd-hitech", "hyd-gachibowli"],
    rating: 4.9,
    reviewsCount: 340,
    badge: "Family Favorite",
    overview: "Built with certified non-toxic high-density foam, soft obstacles, climbing tubes, and interactive wall projections to give young champions hours of safe, active physical exercise.",
    howItWorks: [
      { step: "1", title: "Security Wristband", desc: "Matching RFID parent-child safety wristbands issued at entry." },
      { step: "2", title: "Free Exploration", desc: "Kids explore 3 storeys of cushioned tunnels, slides, and trampoline pods under marshal supervision." },
      { step: "3", title: "Parents Lounge", desc: "Parents can supervise from the adjacent cafe with complimentary high-speed Wi-Fi." }
    ],
    safetyRules: [
      "Anti-skid grip socks mandatory for all children and accompanying adults.",
      "Strict sanitization cycles conducted every 90 minutes."
    ],
    faqs: [
      { q: "Is parent entry charged separately?", a: "One accompanying adult enters completely FREE with every child ticket." }
    ]
  }
];

export const getGameBySlug = (slug) => {
  return gamesData.find(g => g.slug === slug || g.id === slug) || gamesData[0];
};
