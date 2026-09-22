import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth, ROLES } from '../context/AdminAuthContext';
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
  Zap
} from 'lucide-react';

export const AdminLoginPage = () => {
  const { login, ROLES, DEFAULT_ACCOUNTS } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeRole, setActiveRole] = useState(ROLES.OWNER);
  const [email, setEmail] = useState('owner@battleship.com');
  const [password, setPassword] = useState('owner123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="admin-portal-login-page">
      {/* Ambient Cyber Light Glows */}
      <div className="admin-login-glow-bg">
        <div className="admin-glow-orb orb-1" />
        <div className="admin-glow-orb orb-2" />
        <div className="admin-grid-lines" />
      </div>

      <div className="container admin-login-container">
        <motion.div 
          className="admin-login-card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
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
      </div>
    </div>
  );
};
