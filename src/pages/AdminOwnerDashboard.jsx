import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth, ROLES } from '../context/AdminAuthContext';
import { useAdminStore } from '../context/AdminStoreContext';
import { useBooking } from '../context/BookingContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/formatters';
import { 
  ShieldCheck, 
  Gamepad2, 
  Tag, 
  Package, 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  X, 
  Save, 
  Sparkles, 
  DollarSign, 
  Layers, 
  Eye, 
  Search, 
  Filter, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Zap,
  Flame,
  AlertCircle,
  Video,
  Image as ImageIcon,
  RotateCcw,
  MapPin,
  Building2,
  Phone,
  Mail,
  Navigation,
  Sun,
  Moon
} from 'lucide-react';

export const AdminOwnerDashboard = () => {
  const { currentAdmin, logout, isOwner } = useAdminAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { 
    branches,
    addBranch,
    updateBranch,
    deleteBranch,
    games, 
    offers, 
    packages, 
    addGame, 
    updateGame, 
    deleteGame, 
    addOffer, 
    updateOffer, 
    deleteOffer, 
    addPackage, 
    updatePackage, 
    deletePackage,
    resetToFactoryDefaults 
  } = useAdminStore();
  const { allBookings } = useBooking();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'branches' | 'games' | 'offers' | 'packages' | 'bookings'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  // Modals state
  const [editingBranch, setEditingBranch] = useState(null);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);

  // Helper show toast
  const showToast = (msg, type = 'success') => {
    setToastMsg({ text: msg, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Redirect if not logged in as owner
  if (!currentAdmin || currentAdmin.role !== ROLES.OWNER) {
    return (
      <div className="admin-access-denied-container">
        <div className="denied-box">
          <ShieldCheck size={48} className="text-warning" />
          <h2>Owner Access Restricted</h2>
          <p>You must be authenticated as an Owner or Super Admin to access the operational command center.</p>
          <div className="btn-row">
            <Link to="/admin/login" className="btn-primary">Go to Login Terminal</Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Financial & Operations Metrics
  const totalRevenue = allBookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const onlineBookingsCount = allBookings.filter(b => b.source === 'ONLINE_PORTAL').length;
  const walkinBookingsCount = allBookings.filter(b => b.source === 'OFFLINE_WALKIN').length;
  const totalPlayersCount = allBookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.playersCount || 0), 0);

  return (
    <div className="admin-owner-dashboard-root">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            className={`admin-floating-toast ${toastMsg.type}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CheckCircle2 size={18} />
            <span>{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Owner Header Bar */}
      <header className="owner-top-nav">
        <div className="container owner-nav-container">
          <div className="owner-brand-info">
            <div className="owner-brand-logo">
              <Zap size={20} />
            </div>
            <div>
              <div className="owner-portal-badge">
                <span className="owner-pulse-dot" />
                <span>OWNER COMMAND SUITE</span>
              </div>
              <h1 className="owner-brand-heading">Battleship Central Control</h1>
            </div>
          </div>

          <div className="owner-nav-actions">
            <Link to="/admin/staff" className="nav-desk-link">
              <Users size={16} />
              <span>Switch to Staff POS Desk</span>
            </Link>
            <Link to="/" target="_blank" className="nav-preview-link">
              <ExternalLink size={16} />
              <span>Live Website</span>
            </Link>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="admin-header-theme-btn"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={15} className="text-cyan" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={15} className="text-amber" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="owner-user-pill">
              <img src={currentAdmin.avatar} alt={currentAdmin.name} className="owner-avatar" />
              <div className="owner-meta-text">
                <span className="owner-user-name">{currentAdmin.name}</span>
                <span className="owner-role-tag">OWNER / CEO</span>
              </div>
            </div>
            <button 
              onClick={() => { logout(); navigate('/admin/login'); }} 
              className="owner-logout-btn"
              title="Logout session"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Secondary Subnav Navigation Tabs */}
      <div className="owner-subnav-bar">
        <div className="container owner-tabs-container">
          <button 
            className={`owner-tab-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={17} />
            <span>Executive Overview</span>
          </button>
          <button 
            className={`owner-tab-link ${activeTab === 'branches' ? 'active' : ''}`}
            onClick={() => setActiveTab('branches')}
          >
            <MapPin size={17} />
            <span>Arenas & Branches ({branches.length})</span>
          </button>
          <button 
            className={`owner-tab-link ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            <Gamepad2 size={17} />
            <span>Games & Rates ({games.length})</span>
          </button>
          <button 
            className={`owner-tab-link ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            <Tag size={17} />
            <span>Offers & Promos ({offers.length})</span>
          </button>
          <button 
            className={`owner-tab-link ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            <Package size={17} />
            <span>Squad Packages ({packages.length})</span>
          </button>
          <button 
            className={`owner-tab-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Layers size={17} />
            <span>Master Bookings ({allBookings.length})</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Content Area */}
      <main className="owner-main-body container">

        {/* -------------------------------------------------------------------------
            TAB 1: EXECUTIVE OVERVIEW & REVENUE ANALYTICS
            ------------------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="owner-overview-view">
            {/* KPI Cards Row */}
            <div className="owner-kpi-grid">
              <div className="kpi-card highlight-cyan">
                <div className="kpi-icon-wrap">
                  <DollarSign size={22} />
                </div>
                <div className="kpi-content">
                  <span className="kpi-label">Gross Arena Revenue</span>
                  <h3 className="kpi-value">{formatCurrency(totalRevenue)}</h3>
                  <span className="kpi-subtext">Online Portal + Offline Counter</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap">
                  <Building2 size={22} />
                </div>
                <div className="kpi-content">
                  <span className="kpi-label">Active Venues</span>
                  <h3 className="kpi-value">{branches.length} Arenas</h3>
                  <span className="kpi-subtext">Across Inorbit, Sarath City & More</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap">
                  <Layers size={22} />
                </div>
                <div className="kpi-content">
                  <span className="kpi-label">Total Bookings</span>
                  <h3 className="kpi-value">{allBookings.length}</h3>
                  <span className="kpi-subtext">{onlineBookingsCount} Online | {walkinBookingsCount} Walk-in</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap">
                  <Gamepad2 size={22} />
                </div>
                <div className="kpi-content">
                  <span className="kpi-label">Active Attractions</span>
                  <h3 className="kpi-value">{games.length} Games</h3>
                  <span className="kpi-subtext">{offers.filter(o => o.isActive !== false).length} Active promo offers</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Live Summary */}
            <div className="owner-split-grid">
              {/* Left: Quick Actions */}
              <div className="owner-panel-card">
                <div className="panel-card-head">
                  <h3>⚡ Instant Owner Actions</h3>
                  <p>Quick operational shortcuts to update branches, rates and promotions</p>
                </div>
                <div className="quick-actions-list">
                  <button 
                    className="quick-action-item"
                    onClick={() => { setActiveTab('branches'); setIsAddingBranch(true); }}
                  >
                    <div className="action-icon-circle"><MapPin size={18} /></div>
                    <div className="action-item-text">
                      <strong>Add New Arena / Branch</strong>
                      <span>Open new venue locations, configure stations, address and map</span>
                    </div>
                    <ChevronRight size={18} />
                  </button>

                  <button 
                    className="quick-action-item"
                    onClick={() => { setActiveTab('games'); setIsAddingGame(true); }}
                  >
                    <div className="action-icon-circle"><Plus size={18} /></div>
                    <div className="action-item-text">
                      <strong>Add New Game / Attraction</strong>
                      <span>Set pricing, duration, upload media and video links</span>
                    </div>
                    <ChevronRight size={18} />
                  </button>

                  <button 
                    className="quick-action-item"
                    onClick={() => { setActiveTab('offers'); setIsAddingOffer(true); }}
                  >
                    <div className="action-icon-circle"><Tag size={18} /></div>
                    <div className="action-item-text">
                      <strong>Create Discount Promo Code</strong>
                      <span>Launch percentage or flat flash discounts for squads</span>
                    </div>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Right: Live Bookings Stream */}
              <div className="owner-panel-card">
                <div className="panel-card-head">
                  <div className="flex-between">
                    <div>
                      <h3>Recent Activity Stream</h3>
                      <p>Real-time booking confirmations and status</p>
                    </div>
                    <button 
                      className="btn-text" 
                      onClick={() => setActiveTab('bookings')}
                    >
                      View All ({allBookings.length})
                    </button>
                  </div>
                </div>

                <div className="recent-activity-list">
                  {allBookings.slice(0, 5).map(b => (
                    <div key={b.id} className="activity-item">
                      <div className={`activity-pill-badge ${b.source === 'ONLINE_PORTAL' ? 'online' : 'walkin'}`}>
                        {b.source === 'ONLINE_PORTAL' ? 'WEB' : 'POS'}
                      </div>
                      <div className="activity-details">
                        <div className="activity-title-row">
                          <span className="activity-id">#{b.id}</span>
                          <span className="activity-customer">{b.customer?.name} ({b.playersCount}P)</span>
                        </div>
                        <span className="activity-game">{b.itemName} • {b.date} @ {b.timeSlotText}</span>
                      </div>
                      <div className="activity-amount-col">
                        <span className="activity-price">{formatCurrency(b.totalAmount)}</span>
                        <span className={`status-badge-mini ${b.status?.toLowerCase()}`}>{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 2: ARENAS & BRANCHES MANAGER (FULL CRUD)
            ------------------------------------------------------------------------- */}
        {activeTab === 'branches' && (
          <div className="owner-branches-manager-view">
            <div className="manager-toolbar">
              <div>
                <h2>Arena Locations & Branch Management</h2>
                <p>Add new entertainment centres, update venue addresses, station capacities, phone numbers, and maps.</p>
              </div>
              <div className="toolbar-actions">
                <button 
                  className="btn-primary-cyan"
                  onClick={() => setIsAddingBranch(true)}
                >
                  <Plus size={18} />
                  <span>Add New Arena Branch</span>
                </button>
              </div>
            </div>

            {/* Branches Grid */}
            <div className="owner-branches-grid">
              {branches.map(branch => (
                <div key={branch.id} className="owner-branch-card">
                  <div className="branch-card-media">
                    <img 
                      src={branch.image || '/images/venue-entrance.jpg'} 
                      alt={branch.name} 
                      className="branch-thumb-img"
                    />
                    {branch.badge && (
                      <span className="branch-badge-chip">{branch.badge}</span>
                    )}
                    <div className="branch-city-pill">
                      <MapPin size={12} />
                      <span>{branch.city || 'Hyderabad'}</span>
                    </div>
                  </div>

                  <div className="branch-card-body">
                    <h3 className="branch-name">{branch.name}</h3>
                    <p className="branch-addr">{branch.address}</p>

                    <div className="branch-meta-box">
                      <div className="branch-meta-line">
                        <Phone size={13} className="text-cyan" />
                        <span>{branch.phone}</span>
                      </div>
                      <div className="branch-meta-line">
                        <Clock size={13} className="text-cyan" />
                        <span>{branch.openingHours || '11:00 AM - 11:30 PM'}</span>
                      </div>
                      <div className="branch-meta-line">
                        <DollarSign size={13} className="text-cyan" />
                        <span>Online Advance Deposit: {branch.advancePercent || 20}%</span>
                      </div>
                    </div>

                    <div className="branch-facilities-row">
                      {branch.facilities?.slice(0, 3).map((f, i) => (
                        <span key={i} className="facility-chip">✓ {f.name}</span>
                      ))}
                    </div>

                    <div className="branch-card-actions">
                      <button 
                        className="btn-edit-action"
                        onClick={() => setEditingBranch(branch)}
                      >
                        <Edit2 size={16} />
                        <span>Edit Details & Capacity</span>
                      </button>
                      <button 
                        className="btn-delete-action"
                        onClick={() => {
                          if (branches.length <= 1) {
                            showToast('Cannot delete the last remaining branch', 'error');
                            return;
                          }
                          if (window.confirm(`Are you sure you want to delete branch "${branch.name}"?`)) {
                            deleteBranch(branch.id);
                            showToast(`Deleted branch "${branch.name}"`);
                          }
                        }}
                        title="Delete branch"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 3: GAMES & RATES MANAGER (FULL CRUD)
            ------------------------------------------------------------------------- */}
        {activeTab === 'games' && (
          <div className="owner-games-manager-view">
            <div className="manager-toolbar">
              <div>
                <h2>Attractions & Pricing Management</h2>
                <p>Modify game rates per person, update media/video links, badges, and operational capacity.</p>
              </div>
              <div className="toolbar-actions">
                <button 
                  className="btn-primary-cyan"
                  onClick={() => setIsAddingGame(true)}
                >
                  <Plus size={18} />
                  <span>Add New Attraction</span>
                </button>
              </div>
            </div>

            {/* Games Grid */}
            <div className="owner-games-grid">
              {games.map(game => (
                <div key={game.id} className="owner-game-card">
                  <div className="game-card-media">
                    <img 
                      src={game.heroImage || '/images/bumper-cars.jpg'} 
                      alt={game.name} 
                      className="game-thumb-img"
                    />
                    {game.badge && (
                      <span className="game-badge-chip">{game.badge}</span>
                    )}
                    <div className="game-rate-overlay">
                      <span className="rate-num">₹{game.pricePerPerson}</span>
                      <span className="rate-lbl">/ person</span>
                    </div>
                  </div>

                  <div className="game-card-body">
                    <div className="game-cat-tag">{game.category}</div>
                    <h3 className="game-name">{game.name}</h3>
                    <p className="game-desc">{game.shortDesc || game.tagline}</p>

                    <div className="game-meta-row">
                      <span className="meta-pill"><Clock size={13} /> {game.durationMinutes || 10} Mins</span>
                      <span className="meta-pill"><Users size={13} /> {game.playersMin || 1}-{game.playersMax || 8} Players</span>
                      {game.videoUrl && (
                        <span className="meta-pill video"><Video size={13} /> Video Ready</span>
                      )}
                    </div>

                    <div className="game-card-actions">
                      <button 
                        className="btn-edit-action"
                        onClick={() => setEditingGame(game)}
                      >
                        <Edit2 size={16} />
                        <span>Edit Rates & Media</span>
                      </button>
                      <button 
                        className="btn-delete-action"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to remove "${game.name}" from catalog?`)) {
                            deleteGame(game.id);
                            showToast(`Removed "${game.name}" from live catalog`);
                          }
                        }}
                        title="Delete game"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 4: OFFERS & PROMOS MANAGER (FULL CRUD)
            ------------------------------------------------------------------------- */}
        {activeTab === 'offers' && (
          <div className="owner-offers-manager-view">
            <div className="manager-toolbar">
              <div>
                <h2>Promo Codes & Squad Discount Offers</h2>
                <p>Create flash discount promo codes that customers can apply during online or offline booking.</p>
              </div>
              <div className="toolbar-actions">
                <button 
                  className="btn-primary-cyan"
                  onClick={() => setIsAddingOffer(true)}
                >
                  <Plus size={18} />
                  <span>Create New Promo Code</span>
                </button>
              </div>
            </div>

            <div className="owner-offers-grid">
              {offers.map(offer => (
                <div key={offer.code} className={`owner-offer-card ${offer.isActive === false ? 'inactive' : ''}`}>
                  <div className="offer-card-top">
                    <div className="offer-code-badge">
                      <Tag size={16} />
                      <span>{offer.code}</span>
                    </div>
                    <div className="offer-toggle-wrap">
                      <button
                        className={`status-toggle-pill ${offer.isActive !== false ? 'active' : 'disabled'}`}
                        onClick={() => {
                          const newState = offer.isActive === false ? true : false;
                          updateOffer(offer.code, { isActive: newState });
                          showToast(`Promo ${offer.code} is now ${newState ? 'ACTIVE' : 'PAUSED'}`);
                        }}
                      >
                        {offer.isActive !== false ? '● ACTIVE' : '○ PAUSED'}
                      </button>
                    </div>
                  </div>

                  <h3 className="offer-title">{offer.title}</h3>
                  <p className="offer-desc">{offer.desc}</p>

                  <div className="offer-details-box">
                    <div className="detail-stat">
                      <span className="stat-lbl">Discount</span>
                      <strong className="stat-val">
                        {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} FLAT`}
                      </strong>
                    </div>
                    {offer.minPlayers && (
                      <div className="detail-stat">
                        <span className="stat-lbl">Min Squad</span>
                        <strong className="stat-val">{offer.minPlayers} Players</strong>
                      </div>
                    )}
                    {offer.minAmount && (
                      <div className="detail-stat">
                        <span className="stat-lbl">Min Spend</span>
                        <strong className="stat-val">₹{offer.minAmount}</strong>
                      </div>
                    )}
                  </div>

                  <div className="offer-card-bottom">
                    <span className="offer-expiry-text">Valid: {offer.validityText || 'Ongoing Promo'}</span>
                    <div className="offer-btn-group">
                      <button 
                        className="icon-action-btn edit" 
                        onClick={() => setEditingOffer(offer)}
                        title="Edit Offer"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="icon-action-btn delete" 
                        onClick={() => {
                          if (window.confirm(`Delete promo code ${offer.code}?`)) {
                            deleteOffer(offer.code);
                            showToast(`Deleted promo code ${offer.code}`);
                          }
                        }}
                        title="Delete Offer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 5: SQUAD PACKAGES MANAGER (FULL CRUD)
            ------------------------------------------------------------------------- */}
        {activeTab === 'packages' && (
          <div className="owner-packages-manager-view">
            <div className="manager-toolbar">
              <div>
                <h2>Squad Passes & Combo Packages</h2>
                <p>Bundle multi-activity packages with VIP perks and special rates per person.</p>
              </div>
              <div className="toolbar-actions">
                <button 
                  className="btn-primary-cyan"
                  onClick={() => setIsAddingPackage(true)}
                >
                  <Plus size={18} />
                  <span>Add Squad Package</span>
                </button>
              </div>
            </div>

            <div className="owner-packages-grid">
              {packages.map(pkg => (
                <div key={pkg.id} className="owner-pkg-card">
                  <div className="pkg-card-head">
                    {pkg.tag && <span className="pkg-tag-badge">{pkg.tag}</span>}
                    <h3 className="pkg-title">{pkg.name}</h3>
                    <div className="pkg-rate-row">
                      <span className="pkg-price">₹{pkg.pricePerPerson}</span>
                      <span className="pkg-per-lbl">/ person</span>
                    </div>
                  </div>

                  <p className="pkg-desc">{pkg.description}</p>

                  <div className="pkg-inclusions-box">
                    <span className="inclusions-heading">INCLUDES:</span>
                    <ul className="inclusions-list">
                      {pkg.inclusions?.map((inc, i) => (
                        <li key={i}><CheckCircle2 size={14} className="text-cyan" /> {inc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pkg-actions-footer">
                    <button 
                      className="btn-edit-action"
                      onClick={() => setEditingPackage(pkg)}
                    >
                      <Edit2 size={16} />
                      <span>Edit Package</span>
                    </button>
                    <button 
                      className="btn-delete-action"
                      onClick={() => {
                        if (window.confirm(`Delete package ${pkg.name}?`)) {
                          deletePackage(pkg.id);
                          showToast(`Package "${pkg.name}" deleted`);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 6: MASTER BOOKINGS AUDIT LOG
            ------------------------------------------------------------------------- */}
        {activeTab === 'bookings' && (
          <div className="owner-bookings-audit-view">
            <div className="manager-toolbar">
              <div>
                <h2>Central Master Bookings Ledger</h2>
                <p>Real-time audit log of all online and counter bookings across all venues.</p>
              </div>
              <div className="search-bar-wrap">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Filter by Booking ID, phone, customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="audit-search-input"
                />
              </div>
            </div>

            <div className="audit-table-wrapper">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Source</th>
                    <th>Customer</th>
                    <th>Attraction / Package</th>
                    <th>Date & Slot</th>
                    <th>Squad</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings
                    .filter(b => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        b.id?.toLowerCase().includes(q) ||
                        b.customer?.name?.toLowerCase().includes(q) ||
                        b.customer?.phone?.includes(q) ||
                        b.itemName?.toLowerCase().includes(q)
                      );
                    })
                    .map(b => (
                      <tr key={b.id} className="audit-row">
                        <td className="font-mono font-bold text-cyan">#{b.id}</td>
                        <td>
                          <span className={`source-pill ${b.source === 'ONLINE_PORTAL' ? 'web' : 'pos'}`}>
                            {b.source === 'ONLINE_PORTAL' ? 'ONLINE WEB' : 'OFFLINE POS'}
                          </span>
                        </td>
                        <td>
                          <div className="customer-cell">
                            <strong>{b.customer?.name || 'Walk-in Guest'}</strong>
                            <span className="customer-phone">{b.customer?.phone}</span>
                          </div>
                        </td>
                        <td>
                          <div className="item-cell">
                            <span>{b.itemName}</span>
                            <small className="text-dim">{b.branchName || 'HiTech City'}</small>
                          </div>
                        </td>
                        <td>
                          <div className="slot-cell">
                            <span>{b.date}</span>
                            <span className="slot-time-text">{b.timeSlotText}</span>
                          </div>
                        </td>
                        <td>{b.playersCount} Guests</td>
                        <td className="font-bold">{formatCurrency(b.totalAmount)}</td>
                        <td>
                          <div className="payment-cell">
                            <span className="paid-amount text-success">Paid: {formatCurrency(b.advancePaid)}</span>
                            {b.balanceDue > 0 ? (
                              <span className="due-amount text-warning">Due: {formatCurrency(b.balanceDue)}</span>
                            ) : (
                              <span className="settled-text text-dim">Settled</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`audit-status-badge ${b.status?.toLowerCase()}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODALS: BRANCH EDIT / ADD MODAL
          ========================================================================= */}
      {(editingBranch || isAddingBranch) && (
        <BranchFormModal
          branch={editingBranch}
          isNew={isAddingBranch}
          onClose={() => { setEditingBranch(null); setIsAddingBranch(false); }}
          onSave={(data) => {
            if (isAddingBranch) {
              addBranch(data);
              showToast(`Added new arena location "${data.name}"`);
            } else {
              updateBranch(editingBranch.id, data);
              showToast(`Updated branch "${data.name}"`);
            }
            setEditingBranch(null);
            setIsAddingBranch(false);
          }}
        />
      )}

      {/* =========================================================================
          MODALS: GAME EDIT / ADD MODAL
          ========================================================================= */}
      {(editingGame || isAddingGame) && (
        <GameFormModal
          game={editingGame}
          isNew={isAddingGame}
          onClose={() => { setEditingGame(null); setIsAddingGame(false); }}
          onSave={(data) => {
            if (isAddingGame) {
              addGame(data);
              showToast(`Added new attraction "${data.name}"`);
            } else {
              updateGame(editingGame.id, data);
              showToast(`Updated "${data.name}" rates and details`);
            }
            setEditingGame(null);
            setIsAddingGame(false);
          }}
        />
      )}

      {/* =========================================================================
          MODALS: OFFER EDIT / ADD MODAL
          ========================================================================= */}
      {(editingOffer || isAddingOffer) && (
        <OfferFormModal
          offer={editingOffer}
          isNew={isAddingOffer}
          onClose={() => { setEditingOffer(null); setIsAddingOffer(false); }}
          onSave={(data) => {
            if (isAddingOffer) {
              addOffer(data);
              showToast(`Created promo code ${data.code}`);
            } else {
              updateOffer(editingOffer.code, data);
              showToast(`Updated promo code ${data.code}`);
            }
            setEditingOffer(null);
            setIsAddingOffer(false);
          }}
        />
      )}

      {/* =========================================================================
          MODALS: PACKAGE EDIT / ADD MODAL
          ========================================================================= */}
      {(editingPackage || isAddingPackage) && (
        <PackageFormModal
          pkg={editingPackage}
          isNew={isAddingPackage}
          onClose={() => { setEditingPackage(null); setIsAddingPackage(false); }}
          onSave={(data) => {
            if (isAddingPackage) {
              addPackage(data);
              showToast(`Created package "${data.name}"`);
            } else {
              updatePackage(editingPackage.id, data);
              showToast(`Updated package "${data.name}"`);
            }
            setEditingPackage(null);
            setIsAddingPackage(false);
          }}
        />
      )}
    </div>
  );
};

// --- BRANCH FORM MODAL COMPONENT ---
const BranchFormModal = ({ branch, isNew, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: branch?.name || '',
    shortName: branch?.shortName || '',
    city: branch?.city || 'Hyderabad',
    state: branch?.state || 'Telangana',
    address: branch?.address || '',
    landmark: branch?.landmark || '',
    phone: branch?.phone || '+91 40 4859 9000',
    email: branch?.email || 'arena@battleshiparena.in',
    openingHours: branch?.openingHours || '11:00 AM - 11:30 PM (Mon-Sun)',
    googleMapsUrl: branch?.googleMapsUrl || 'https://maps.google.com',
    image: branch?.image || '/images/venue-entrance.jpg',
    badge: branch?.badge || 'Flagship Arena',
    advancePercent: branch?.advancePercent || 20,
    minAdvance: branch?.minAdvance || 100
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      advancePercent: Number(formData.advancePercent),
      minAdvance: Number(formData.minAdvance)
    });
  };

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal-box">
        <div className="modal-header">
          <h3>{isNew ? '🏢 Add New Arena Location' : `Edit Arena: ${branch.name}`}</h3>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="form-row-2">
            <div className="form-group">
              <label>Arena Name</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g. Battleship Arena - Banjara Hills" 
              />
            </div>
            <div className="form-group">
              <label>Short Display Name</label>
              <input 
                type="text" 
                required 
                value={formData.shortName} 
                onChange={e => setFormData({ ...formData, shortName: e.target.value })} 
                placeholder="e.g. Banjara Hills" 
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>City</label>
              <input 
                type="text" 
                required 
                value={formData.city} 
                onChange={e => setFormData({ ...formData, city: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input 
                type="text" 
                required 
                value={formData.state} 
                onChange={e => setFormData({ ...formData, state: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Full Address</label>
            <textarea 
              rows="2" 
              required
              value={formData.address} 
              onChange={e => setFormData({ ...formData, address: e.target.value })} 
              placeholder="e.g. Level 3, GVK One Mall, Road No. 1, Banjara Hills, Hyderabad - 500034"
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Phone Contact</label>
              <input 
                type="tel" 
                required 
                value={formData.phone} 
                onChange={e => setFormData({ ...formData, phone: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Opening Hours</label>
              <input 
                type="text" 
                value={formData.openingHours} 
                onChange={e => setFormData({ ...formData, openingHours: e.target.value })} 
                placeholder="11:00 AM - 11:30 PM (Mon-Sun)"
              />
            </div>
            <div className="form-group">
              <label>Badge Highlight</label>
              <input 
                type="text" 
                value={formData.badge} 
                onChange={e => setFormData({ ...formData, badge: e.target.value })} 
                placeholder="e.g. Premier Arena (40,000 sq.ft)"
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Venue Image URL</label>
              <input 
                type="text" 
                value={formData.image} 
                onChange={e => setFormData({ ...formData, image: e.target.value })} 
                placeholder="/images/venue-entrance.jpg or https://..."
              />
            </div>
            <div className="form-group">
              <label>Google Maps Direction URL</label>
              <input 
                type="text" 
                value={formData.googleMapsUrl} 
                onChange={e => setFormData({ ...formData, googleMapsUrl: e.target.value })} 
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Online Advance Deposit Required (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100"
                value={formData.advancePercent} 
                onChange={e => setFormData({ ...formData, advancePercent: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Minimum Advance / Player (₹)</label>
              <input 
                type="number" 
                min="0"
                value={formData.minAdvance} 
                onChange={e => setFormData({ ...formData, minAdvance: e.target.value })} 
              />
            </div>
          </div>

          <div className="modal-footer-btns">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary-cyan">
              <Save size={16} />
              <span>{isNew ? 'Create Arena Location' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- GAME FORM MODAL COMPONENT ---
const GameFormModal = ({ game, isNew, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: game?.name || '',
    category: game?.category || 'High Adrenaline',
    pricePerPerson: game?.pricePerPerson || 299,
    durationMinutes: game?.durationMinutes || 10,
    playersMin: game?.playersMin || 1,
    playersMax: game?.playersMax || 8,
    badge: game?.badge || '',
    tagline: game?.tagline || '',
    shortDesc: game?.shortDesc || '',
    heroImage: game?.heroImage || '/images/bumper-cars.jpg',
    videoUrl: game?.videoUrl || '',
    ageRequirement: game?.ageRequirement || 'Ages 6+',
    heightRequirement: game?.heightRequirement || 'Min. 105 cm'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      pricePerPerson: Number(formData.pricePerPerson),
      durationMinutes: Number(formData.durationMinutes),
      playersMin: Number(formData.playersMin),
      playersMax: Number(formData.playersMax)
    });
  };

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal-box">
        <div className="modal-header">
          <h3>{isNew ? '⚡ Add New Attraction' : `Edit Attraction: ${game.name}`}</h3>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="form-row-2">
            <div className="form-group">
              <label>Attraction Name</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g. Electric Bumper Drift Arena" 
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="High Adrenaline">High Adrenaline</option>
                <option value="Group Battle">Group Battle</option>
                <option value="Family & Social">Family & Social</option>
                <option value="Virtual Reality">Virtual Reality</option>
                <option value="Arcade & Gaming">Arcade & Gaming</option>
              </select>
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Rate Per Person (₹)</label>
              <input 
                type="number" 
                required 
                min="0"
                value={formData.pricePerPerson} 
                onChange={e => setFormData({ ...formData, pricePerPerson: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Duration (Minutes)</label>
              <input 
                type="number" 
                required 
                min="1"
                value={formData.durationMinutes} 
                onChange={e => setFormData({ ...formData, durationMinutes: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Max Players / Slot</label>
              <input 
                type="number" 
                required 
                min="1"
                value={formData.playersMax} 
                onChange={e => setFormData({ ...formData, playersMax: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Hero Image URL</label>
              <input 
                type="text" 
                value={formData.heroImage} 
                onChange={e => setFormData({ ...formData, heroImage: e.target.value })} 
                placeholder="/images/bumper-cars.jpg or https://..." 
              />
            </div>
            <div className="form-group">
              <label>Video Showcase URL (Optional)</label>
              <input 
                type="text" 
                value={formData.videoUrl} 
                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} 
                placeholder="https://... (mp4 or embed)" 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Badge Highlight (e.g. Crowd Favorite, Bestseller)</label>
            <input 
              type="text" 
              value={formData.badge} 
              onChange={e => setFormData({ ...formData, badge: e.target.value })} 
              placeholder="e.g. Top Rated for Groups" 
            />
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <textarea 
              rows="3" 
              value={formData.shortDesc} 
              onChange={e => setFormData({ ...formData, shortDesc: e.target.value })} 
              placeholder="Exciting description for booking page..."
            />
          </div>

          <div className="modal-footer-btns">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary-cyan">
              <Save size={16} />
              <span>{isNew ? 'Create Attraction' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- OFFER FORM MODAL COMPONENT ---
const OfferFormModal = ({ offer, isNew, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: offer?.code || '',
    title: offer?.title || '',
    desc: offer?.desc || '',
    discountType: offer?.discountType || 'percentage',
    discountValue: offer?.discountValue || 15,
    maxDiscount: offer?.maxDiscount || 500,
    minPlayers: offer?.minPlayers || 1,
    minAmount: offer?.minAmount || 0,
    validityText: offer?.validityText || 'Valid for all bookings',
    isActive: offer?.isActive !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      code: formData.code.trim().toUpperCase(),
      discountValue: Number(formData.discountValue),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      minPlayers: Number(formData.minPlayers),
      minAmount: Number(formData.minAmount)
    });
  };

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal-box">
        <div className="modal-header">
          <h3>{isNew ? '🏷️ Create Promo Code' : `Edit Promo: ${offer.code}`}</h3>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="form-row-2">
            <div className="form-group">
              <label>Coupon Promo Code</label>
              <input 
                type="text" 
                required 
                value={formData.code} 
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} 
                placeholder="e.g. SQUAD20" 
              />
            </div>
            <div className="form-group">
              <label>Discount Type</label>
              <select 
                value={formData.discountType} 
                onChange={e => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Discount Value ({formData.discountType === 'percentage' ? '%' : '₹'})</label>
              <input 
                type="number" 
                required 
                min="1"
                value={formData.discountValue} 
                onChange={e => setFormData({ ...formData, discountValue: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Max Discount Cap (₹)</label>
              <input 
                type="number" 
                min="0"
                value={formData.maxDiscount || ''} 
                onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })} 
                placeholder="e.g. 500"
              />
            </div>
            <div className="form-group">
              <label>Min Squad Count</label>
              <input 
                type="number" 
                min="1"
                value={formData.minPlayers} 
                onChange={e => setFormData({ ...formData, minPlayers: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Promo Title</label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
              placeholder="e.g. Squad Adrenaline Discount" 
            />
          </div>

          <div className="form-group">
            <label>Offer Description / Terms</label>
            <input 
              type="text" 
              value={formData.desc} 
              onChange={e => setFormData({ ...formData, desc: e.target.value })} 
              placeholder="e.g. Get 20% off on all squad bookings of 4+ players" 
            />
          </div>

          <div className="modal-footer-btns">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary-cyan">
              <Save size={16} />
              <span>{isNew ? 'Create Promo Code' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- PACKAGE FORM MODAL COMPONENT ---
const PackageFormModal = ({ pkg, isNew, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    tag: pkg?.tag || '',
    pricePerPerson: pkg?.pricePerPerson || 799,
    description: pkg?.description || '',
    inclusionsText: pkg?.inclusions ? pkg.inclusions.join('\n') : 'Electric Bumper Drift (1 Session)\nLaser Blast Tactical Match\n100 Arcade Credits'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const inclusions = formData.inclusionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    onSave({
      name: formData.name,
      tag: formData.tag,
      pricePerPerson: Number(formData.pricePerPerson),
      description: formData.description,
      inclusions
    });
  };

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal-box">
        <div className="modal-header">
          <h3>{isNew ? '📦 Add Squad Package' : `Edit Package: ${pkg.name}`}</h3>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="form-row-2">
            <div className="form-group">
              <label>Package Name</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g. Adrenaline Surge Pack" 
              />
            </div>
            <div className="form-group">
              <label>Rate Per Person (₹)</label>
              <input 
                type="number" 
                required 
                min="0"
                value={formData.pricePerPerson} 
                onChange={e => setFormData({ ...formData, pricePerPerson: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tag / Badge (e.g. Most Popular, Corporate Favorite)</label>
            <input 
              type="text" 
              value={formData.tag} 
              onChange={e => setFormData({ ...formData, tag: e.target.value })} 
              placeholder="e.g. VIP Squad Favorite" 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input 
              type="text" 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Short description of this combo pack" 
            />
          </div>

          <div className="form-group">
            <label>Inclusions (One item per line)</label>
            <textarea 
              rows="4" 
              value={formData.inclusionsText} 
              onChange={e => setFormData({ ...formData, inclusionsText: e.target.value })} 
            />
          </div>

          <div className="modal-footer-btns">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary-cyan">
              <Save size={16} />
              <span>{isNew ? 'Create Package' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
