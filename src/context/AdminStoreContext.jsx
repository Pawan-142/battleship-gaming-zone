import { createContext, useContext, useState, useEffect } from 'react';
import { gamesData as initialGames } from '../data/gamesData';
import { offersData as initialOffers } from '../data/offersData';
import { packagesData as initialPackages } from '../data/packagesData';
import { getAllBranches } from '../data/branchesData';

const AdminStoreContext = createContext();

const STORAGE_KEY_GAMES = 'battleship_dynamic_games_v1';
const STORAGE_KEY_OFFERS = 'battleship_dynamic_offers_v1';
const STORAGE_KEY_PACKAGES = 'battleship_dynamic_packages_v1';
const STORAGE_KEY_BRANCHES = 'battleship_dynamic_branches_v1';

export const AdminStoreProvider = ({ children }) => {
  // Dynamic Branches Store
  const [branches, setBranches] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRANCHES);
      return saved ? JSON.parse(saved) : getAllBranches();
    } catch {
      return getAllBranches();
    }
  });

  // Dynamic Games Store
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GAMES);
      return saved ? JSON.parse(saved) : initialGames;
    } catch {
      return initialGames;
    }
  });

  // Dynamic Offers & Coupons Store
  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OFFERS);
      return saved ? JSON.parse(saved) : initialOffers;
    } catch {
      return initialOffers;
    }
  });

  // Dynamic Packages Store
  const [packages, setPackages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PACKAGES);
      return saved ? JSON.parse(saved) : initialPackages;
    } catch {
      return initialPackages;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BRANCHES, JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(packages));
  }, [packages]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY_BRANCHES && e.newValue) {
        setBranches(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEY_GAMES && e.newValue) {
        setGames(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEY_OFFERS && e.newValue) {
        setOffers(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEY_PACKAGES && e.newValue) {
        setPackages(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // --- BRANCHES CRUD (Owner Operations) ---
  const addBranch = (newBranch) => {
    const id = newBranch.id || `branch-${Date.now()}`;
    const item = {
      ...newBranch,
      id,
      shortName: newBranch.shortName || newBranch.name,
      city: newBranch.city || 'Hyderabad',
      state: newBranch.state || 'Telangana',
      advancePercent: Number(newBranch.advancePercent) || 20,
      minAdvance: Number(newBranch.minAdvance) || 100,
      image: newBranch.image || '/images/venue-entrance.jpg',
      stationCapacities: newBranch.stationCapacities || {
        'bumper-cars': 8,
        'laser-blast': 16,
        'hyper-bowling': 6,
        'vr-escape': 4,
        'arcade-unlimited': 20
      },
      facilities: newBranch.facilities || [
        { name: "Free Valet Parking", icon: "Car" },
        { name: "Electric Bumper Arena", icon: "Zap" },
        { name: "Laser Blast Arena", icon: "Crosshair" },
        { name: "UV Glow Bowling", icon: "Disc" },
        { name: "Neon Cyber Diner", icon: "Coffee" }
      ]
    };
    setBranches(prev => [...prev, item]);
    return { success: true, branch: item };
  };

  const updateBranch = (branchId, updatedFields) => {
    setBranches(prev =>
      prev.map(b => (b.id === branchId ? { ...b, ...updatedFields } : b))
    );
    return { success: true };
  };

  const deleteBranch = (branchId) => {
    setBranches(prev => prev.filter(b => b.id !== branchId));
    return { success: true };
  };

  const getBranchById = (branchId) => {
    return branches.find(b => b.id === branchId) || branches[0];
  };

  // --- GAMES CRUD (Owner Operations) ---
  const addGame = (newGame) => {
    const id = newGame.id || newGame.slug || `game-${Date.now()}`;
    const slug = newGame.slug || id;
    const item = {
      ...newGame,
      id,
      slug,
      rating: newGame.rating || 4.9,
      reviewsCount: newGame.reviewsCount || 1,
      gallery: newGame.gallery?.length ? newGame.gallery : [newGame.heroImage || '/images/bumper-cars.jpg'],
      branchesAvailable: newGame.branchesAvailable || ['hyd-hitech', 'hyd-gachibowli']
    };
    setGames(prev => [item, ...prev]);
    return { success: true, game: item };
  };

  const updateGame = (gameId, updatedFields) => {
    setGames(prev =>
      prev.map(g => (g.id === gameId || g.slug === gameId ? { ...g, ...updatedFields } : g))
    );
    return { success: true };
  };

  const deleteGame = (gameId) => {
    setGames(prev => prev.filter(g => g.id !== gameId && g.slug !== gameId));
    return { success: true };
  };

  const getGameBySlug = (slug) => {
    return games.find(g => g.slug === slug || g.id === slug) || games[0];
  };

  // --- OFFERS CRUD (Owner Operations) ---
  const addOffer = (newOffer) => {
    const code = newOffer.code.trim().toUpperCase();
    const item = {
      ...newOffer,
      code,
      isActive: newOffer.isActive !== false
    };
    setOffers(prev => [item, ...prev.filter(o => o.code !== code)]);
    return { success: true, offer: item };
  };

  const updateOffer = (offerCode, updatedFields) => {
    setOffers(prev =>
      prev.map(o => (o.code === offerCode ? { ...o, ...updatedFields } : o))
    );
    return { success: true };
  };

  const deleteOffer = (offerCode) => {
    setOffers(prev => prev.filter(o => o.code !== offerCode));
    return { success: true };
  };

  const validateDynamicCoupon = (code, subtotal, playersCount = 1) => {
    if (!code) return { valid: false, message: 'Please enter a coupon code' };
    const cleanCode = code.trim().toUpperCase();
    const offer = offers.find(o => o.code === cleanCode);

    if (!offer) {
      return { valid: false, message: 'Invalid promo code' };
    }

    if (offer.isActive === false) {
      return { valid: false, message: 'This promo offer is currently inactive or expired' };
    }

    if (offer.minPlayers && playersCount < offer.minPlayers) {
      return {
        valid: false,
        message: `This coupon requires a minimum of ${offer.minPlayers} players`
      };
    }

    if (offer.minAmount && subtotal < offer.minAmount) {
      return {
        valid: false,
        message: `Minimum order amount of ₹${offer.minAmount} required for this coupon`
      };
    }

    let discountAmount = 0;
    if (offer.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * offer.discountValue) / 100);
      if (offer.maxDiscount) {
        discountAmount = Math.min(discountAmount, offer.maxDiscount);
      }
    } else {
      discountAmount = Math.min(offer.discountValue || 0, subtotal);
    }

    return {
      valid: true,
      offer,
      discountAmount,
      message: `Coupon ${offer.code} applied! Saved ₹${discountAmount}`
    };
  };

  // --- PACKAGES CRUD (Owner Operations) ---
  const addPackage = (newPackage) => {
    const id = newPackage.id || `pkg-${Date.now()}`;
    const item = { ...newPackage, id };
    setPackages(prev => [item, ...prev]);
    return { success: true, package: item };
  };

  const updatePackage = (packageId, updatedFields) => {
    setPackages(prev =>
      prev.map(p => (p.id === packageId ? { ...p, ...updatedFields } : p))
    );
    return { success: true };
  };

  const deletePackage = (packageId) => {
    setPackages(prev => prev.filter(p => p.id !== packageId));
    return { success: true };
  };

  const getPackageById = (packageId) => {
    return packages.find(p => p.id === packageId) || packages[0];
  };

  // Reset to default sample factory state
  const resetToFactoryDefaults = () => {
    setGames(initialGames);
    setOffers(initialOffers);
    setPackages(initialPackages);
    localStorage.removeItem(STORAGE_KEY_GAMES);
    localStorage.removeItem(STORAGE_KEY_OFFERS);
    localStorage.removeItem(STORAGE_KEY_PACKAGES);
  };

  return (
    <AdminStoreContext.Provider
      value={{
        branches,
        addBranch,
        updateBranch,
        deleteBranch,
        getBranchById,
        games,
        offers,
        packages,
        addGame,
        updateGame,
        deleteGame,
        getGameBySlug,
        addOffer,
        updateOffer,
        deleteOffer,
        validateDynamicCoupon,
        addPackage,
        updatePackage,
        deletePackage,
        getPackageById,
        resetToFactoryDefaults
      }}
    >
      {children}
    </AdminStoreContext.Provider>
  );
};

export const useAdminStore = () => {
  const context = useContext(AdminStoreContext);
  if (!context) {
    throw new Error('useAdminStore must be used within an AdminStoreProvider');
  }
  return context;
};
