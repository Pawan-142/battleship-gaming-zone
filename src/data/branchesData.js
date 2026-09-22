// Scalable Hierarchy: Country -> State -> City -> Branch
export const locationsHierarchy = [
  {
    country: "India",
    countryCode: "IN",
    states: [
      {
        stateName: "Telangana",
        stateCode: "TS",
        cities: [
          {
            cityName: "Hyderabad",
            citySlug: "hyderabad",
            isActive: true,
            branches: [
              {
                id: "hyd-hitech",
                name: "Battleship Flagship - Hitech City",
                shortName: "Hitech City",
                city: "Hyderabad",
                state: "Telangana",
                address: "Level 4 & 5, Inorbit Mall, Mindspace Madhapur, Hitech City, Hyderabad - 500081",
                landmark: "Opposite Durgam Cheruvu Lake View Deck",
                phone: "+91 40 4859 9000",
                whatsapp: "+91 98490 88221",
                email: "hitech@battleshiparena.in",
                openingHours: "11:00 AM - 11:30 PM (Mon-Sun)",
                coordinates: { lat: 17.4339, lng: 78.3869 },
                googleMapsUrl: "https://maps.google.com/?q=Inorbit+Mall+Hitech+City+Hyderabad",
                image: "/images/venue-entrance.jpg",
                badge: "Flagship Arena (35,000 sq.ft)",
                facilities: [
                  { name: "Free Valet Parking", icon: "Car" },
                  { name: "Electric Bumper Arena (8 Stations)", icon: "Zap" },
                  { name: "2-Tier Laser Blast Arena", icon: "Crosshair" },
                  { name: "8 UV Glow Bowling Lanes", icon: "Disc" },
                  { name: "9D VR Motion Pods", icon: "Glasses" },
                  { name: "Neon Cyber Cafe & Diner", icon: "Coffee" },
                  { name: "Private Birthday Suites", icon: "Gift" },
                  { name: "Secure Electronic Lockers", icon: "Lock" }
                ],
                stationCapacities: {
                  "bumper-cars": 8,
                  "laser-blast": 16,
                  "hyper-bowling": 6,
                  "vr-pods": 4,
                  "arcade-pass": 30,
                  "kids-zone": 20
                },
                pricingMultiplier: 1.0,
                advancePercent: 20, // 20% advance or minimum ₹100
                minAdvance: 100
              },
              {
                id: "hyd-gachibowli",
                name: "Battleship Arena - Gachibowli",
                shortName: "Gachibowli / Kondapur",
                city: "Hyderabad",
                state: "Telangana",
                address: "4th Floor, Sarath City Capital Mall, Gachibowli - Miyapur Rd, Kondapur, Hyderabad - 500084",
                landmark: "Near Kothaguda Junction",
                phone: "+91 40 4920 7700",
                whatsapp: "+91 98490 88222",
                email: "gachibowli@battleshiparena.in",
                openingHours: "11:00 AM - 11:00 PM (Mon-Sun)",
                coordinates: { lat: 17.4578, lng: 78.3638 },
                googleMapsUrl: "https://maps.google.com/?q=Sarath+City+Capital+Mall+Kondapur+Hyderabad",
                image: "/images/bumper-cars.jpg",
                badge: "Mega Zone (40,000 sq.ft)",
                facilities: [
                  { name: "Mall Multi-level Parking", icon: "Car" },
                  { name: "Dual-track Bumper Cars", icon: "Zap" },
                  { name: "3-Tier Laser Tag Combat Zone", icon: "Crosshair" },
                  { name: "10 Full-length Bowling Lanes", icon: "Disc" },
                  { name: "VR Flight & Race Simulators", icon: "Glasses" },
                  { name: "Fuel & Bite Restro-Bar", icon: "Coffee" },
                  { name: "Corporate Conference Hall", icon: "Briefcase" },
                  { name: "Wheelchair Accessible", icon: "HeartPulse" }
                ],
                stationCapacities: {
                  "bumper-cars": 10,
                  "laser-blast": 20,
                  "hyper-bowling": 10,
                  "vr-pods": 6,
                  "arcade-pass": 40,
                  "kids-zone": 25
                },
                pricingMultiplier: 1.0,
                advancePercent: 20,
                minAdvance: 100
              }
            ]
          }
        ]
      },
      {
        stateName: "Karnataka",
        stateCode: "KA",
        cities: [
          {
            cityName: "Bengaluru",
            citySlug: "bengaluru",
            isActive: false,
            comingSoon: true,
            launchDate: "Late 2026",
            branches: []
          }
        ]
      },
      {
        stateName: "Tamil Nadu",
        stateCode: "TN",
        cities: [
          {
            cityName: "Chennai",
            citySlug: "chennai",
            isActive: false,
            comingSoon: true,
            launchDate: "Early 2027",
            branches: []
          }
        ]
      }
    ]
  }
];

export const getAllBranches = () => {
  const branches = [];
  locationsHierarchy.forEach(country => {
    country.states.forEach(state => {
      state.cities.forEach(city => {
        if (city.branches) {
          branches.push(...city.branches);
        }
      });
    });
  });
  return branches;
};

export const branchesData = getAllBranches();

export const getBranchById = (id) => {
  return getAllBranches().find(b => b.id === id) || getAllBranches()[0];
};
