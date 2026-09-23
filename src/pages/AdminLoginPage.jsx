import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth, ROLES } from '../context/AdminAuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Gamepad2,
  Building2,
  Zap,
  Clock,
  Activity,
  Radio,
  Server,
  Calendar,
  Sun,
  Moon,
  Compass,
  Flame,
  ArrowLeft
} from 'lucide-react';

export const AdminLoginPage = () => {
  const { login, ROLES, DEFAULT_ACCOUNTS } = useAdminAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeRole, setActiveRole] = useState(ROLES.OWNER);
  const [email, setEmail] = useState('owner@battleship.com');
  const [password, setPassword] = useState('owner123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreetingData = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) {
      return { text: 'Good Morning', icon: <Sun size={24} className="greeting-icon sun" />, subtitle: 'Start your arena operational day with full command over rates and live bookings.' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon', icon: <Sun size={24} className="greeting-icon sun" />, subtitle: 'Peak gaming hours are active. Review real-time visitor throughput and counter desk traffic.' };
    } else if (hour >= 17 && hour < 22) {
      return { text: 'Good Evening', icon: <Flame size={24} className="greeting-icon flame" />, subtitle: 'Prime evening laser battles and drift racing sessions in progress across Hyderabad.' };
    } else {
      return { text: 'Good Night', icon: <Moon size={24} className="greeting-icon moon" />, subtitle: 'Late-night operations and reconciliation mode. All central slot holds monitored.' };
    }
  };

  const greeting = getGreetingData();

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setErrorMsg('');
    if (role === ROLES.OWNER) {
      setEmail('owner@battleship.com');
      setPassword('owner123');
    } else {
      setEmail('staff@battleship.com');
      setPassword('staff123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(email, password, activeRole);
      setIsLoading(false);

      if (result.success) {
        if (result.user.role === ROLES.OWNER) {
          navigate('/admin/owner');
        } else {
          navigate('/admin/staff');
        }
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  const fillCredentials = (role) => {
    handleRoleChange(role);
  };

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="admin-portal-login-page">
      {/* Ambient Cyber Light Glows */}
      <div className="admin-login-glow-bg">
        <div className="admin-glow-orb orb-1" />
        <div className="admin-glow-orb orb-2" />
        <div className="admin-grid-lines" />
      </div>

      {/* Top Floating Control Strip */}
      <div className="admin-portal-top-bar">
        <Link to="/" className="admin-portal-back-btn">
          <ArrowLeft size={14} />
          <span>BATTLESHIP HOME</span>
        </Link>

        {/* Interactive Dark/Light Theme Toggle Pill */}
        <button
          type="button"
          onClick={toggleTheme}
          className="admin-theme-toggle-btn"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="theme-icon-inner"
              >
                <Moon size={15} className="text-cyan" />
                <span className="theme-toggle-label">DARK</span>
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="theme-icon-inner"
              >
                <Sun size={15} className="text-amber" />
                <span className="theme-toggle-label">LIGHT</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="container admin-split-container">
        {/* Left Column: Interactive Login Card */}
        <motion.div 
          className="admin-login-card"
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="admin-card-header">
            <div className="admin-badge-pill">
              <span className="live-dot" />
              <span>BATTLESHIP COMMAND OS v3.4</span>
            </div>
            
            <h1 className="admin-card-title">Enterprise Arena Portal</h1>
            <p className="admin-card-subtitle">
              Secure role-gated access for Venue Owners, General Managers, and Floor Staff Marshals.
            </p>

            {/* Role Switcher Tabs */}
            <div className="admin-role-tabs">
              <button
                type="button"
                className={`role-tab-btn ${activeRole === ROLES.OWNER ? 'active' : ''}`}
                onClick={() => handleRoleChange(ROLES.OWNER)}
              >
                <ShieldCheck size={18} />
                <div className="tab-text-wrap">
                  <span className="tab-title">Owner / Super Admin</span>
                  <span className="tab-sub">Catalog, Rates, Media & Finance</span>
                </div>
              </button>

              <button
                type="button"
                className={`role-tab-btn ${activeRole === ROLES.STAFF ? 'active' : ''}`}
                onClick={() => handleRoleChange(ROLES.STAFF)}
              >
                <UserCheck size={18} />
                <div className="tab-text-wrap">
                  <span className="tab-title">Staff / Operations Desk</span>
                  <span className="tab-sub">Check-in, POS & Walk-ins</span>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Demo Pre-fill helper banner */}
          <div className="demo-credentials-banner">
            <span className="demo-tag">DEMO SHORTCUT:</span>
            <button 
              type="button" 
              className={`demo-chip ${activeRole === ROLES.OWNER ? 'chip-active' : ''}`}
              onClick={() => fillCredentials(ROLES.OWNER)}
            >
              👑 Fill Owner Credentials
            </button>
            <button 
              type="button" 
              className={`demo-chip ${activeRole === ROLES.STAFF ? 'chip-active' : ''}`}
              onClick={() => fillCredentials(ROLES.STAFF)}
            >
              ⚡ Fill Staff Credentials
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="admin-form">
            {errorMsg && (
              <motion.div 
                className="admin-form-alert error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <div className="form-group">
              <label htmlFor="admin-email">Staff ID / Work Email</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@battleship.com"
                  className="admin-text-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">Secure Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="admin-text-input"
                />
              </div>
            </div>

            <div className="role-permissions-preview">
              <span className="preview-label">Access Level:</span>
              {activeRole === ROLES.OWNER ? (
                <span className="perm-badge owner">
                  <ShieldCheck size={13} /> Full Owner Privileges (CRUD Rates, Games, Videos, Offers & Revenue)
                </span>
              ) : (
                <span className="perm-badge staff">
                  <UserCheck size={13} /> Staff POS Desk (Ticket Cross-check, Check-In, Counter Walk-in Booking)
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="admin-submit-btn"
            >
              {isLoading ? (
                <span>Authenticating Terminal...</span>
              ) : (
                <>
                  <span>Launch {activeRole === ROLES.OWNER ? 'Owner Command Suite' : 'Staff Operations Desk'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="admin-card-footer">
            <Link to="/" className="back-to-site-link">
              ← Return to Public Arena Website
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Dynamic Time Greeting & Arena Telemetry Showcase */}
        <motion.div 
          className="admin-telemetry-showcase"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Real-time Time & Greeting Box */}
          <div className="telemetry-greeting-card glass-card">
            <div className="greeting-top-bar">
              <div className="greeting-role-badge">
                {activeRole === ROLES.OWNER ? 'COMMANDER CONSOLE' : 'OPERATIONS DESK'}
              </div>
              <div className="live-clock-pill">
                <Clock size={13} className="clock-icon-anim" />
                <span className="clock-digits">{formattedTime}</span>
              </div>
            </div>

            <div className="greeting-main-block">
              <div className="greeting-title-row">
                <div className="greeting-icon-wrapper">
                  {greeting.icon}
                </div>
                <div>
                  <h2 className="greeting-heading">
                    {greeting.text}, {activeRole === ROLES.OWNER ? 'Owner' : 'Marshal'}
                  </h2>
                  <span className="greeting-date-tag">
                    <Calendar size={13} />
                    {formattedDate} • Hyderabad Arena (IST)
                  </span>
                </div>
              </div>

              <p className="greeting-description">
                {greeting.subtitle}
              </p>
            </div>

            {/* Quick KPI Stat Chips */}
            <div className="telemetry-kpi-row">
              <div className="tele-kpi-box">
                <span className="tk-num">6</span>
                <span className="tk-lbl">ACTIVE ZONES</span>
              </div>
              <div className="tele-kpi-box">
                <span className="tk-num">2</span>
                <span className="tk-lbl">HYD BRANCHES</span>
              </div>
              <div className="tele-kpi-box">
                <span className="tk-num">100%</span>
                <span className="tk-lbl">INVENTORY SYNC</span>
              </div>
            </div>
          </div>

          {/* Live Arena Status Widget */}
          <div className="telemetry-status-card glass-card">
            <div className="status-header">
              <div className="status-title-group">
                <Radio size={18} className="radar-pulse-icon" />
                <h3>Arena Telemetry & Grid Status</h3>
              </div>
              <span className="status-tag-live">
                <span className="pulse-dot-green"></span> ALL SYSTEMS ONLINE
              </span>
            </div>

            <div className="arena-nodes-list">
              <div className="node-item">
                <div className="node-left">
                  <Building2 size={18} className="node-icon icon-branch" />
                  <div>
                    <strong>Hitech City Flagship</strong>
                    <span>Electric Drift, Laser Combat, UV Bowling & VR Pods</span>
                  </div>
                </div>
                <span className="node-status-pill ready">READY</span>
              </div>

              <div className="node-item">
                <div className="node-left">
                  <Building2 size={18} className="node-icon icon-branch" />
                  <div>
                    <strong>Gachibowli Entertainment Hub</strong>
                    <span>Full Arena Repertoire, Party Suites & Food Diner</span>
                  </div>
                </div>
                <span className="node-status-pill ready">READY</span>
              </div>

              <div className="node-item">
                <div className="node-left">
                  <Server size={18} className="node-icon icon-server" />
                  <div>
                    <strong>Central 5-Min Hold Engine</strong>
                    <span>Zero double-booking guarantee active across web & desk</span>
                  </div>
                </div>
                <span className="node-status-pill active">SYNCED</span>
              </div>
            </div>
          </div>

          {/* Quick Motivational Command Motto */}
          <div className="telemetry-motto-box">
            <Sparkles size={18} className="motto-icon" />
            <span>
              "Physical gaming precision engineered for Hyderabad's ultimate entertainment battlegrounds."
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
