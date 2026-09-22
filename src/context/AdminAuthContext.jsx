import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

const STORAGE_KEY_AUTH = 'battleship_admin_auth_session_v1';

export const ROLES = {
  OWNER: 'OWNER',
  STAFF: 'STAFF'
};

const DEFAULT_ACCOUNTS = [
  {
    id: 'usr_owner_01',
    email: 'owner@battleship.com',
    password: 'owner123',
    name: 'Aryan Varma',
    role: ROLES.OWNER,
    designation: 'Owner & Managing Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    permissions: ['all', 'manage_games', 'manage_rates', 'manage_offers', 'manage_media', 'view_analytics', 'manage_staff', 'manage_bookings']
  },
  {
    id: 'usr_staff_01',
    email: 'staff@battleship.com',
    password: 'staff123',
    name: 'Karan Mehra',
    role: ROLES.STAFF,
    designation: 'Senior Arena Marshal & POS Lead',
    assignedBranch: 'hyd-hitech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    permissions: ['cross_check_bookings', 'mark_checkin', 'create_walkin', 'collect_payment', 'view_slot_matrix']
  }
];

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, [currentAdmin]);

  const login = (email, password, intendedRole = null) => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = DEFAULT_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === cleanEmail && acc.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: 'Invalid credentials. Please check your email and password.'
      };
    }

    if (intendedRole && foundUser.role !== intendedRole) {
      return {
        success: false,
        message: `This account does not have ${intendedRole} access privileges.`
      };
    }

    const sessionUser = {
      ...foundUser,
      loginTimestamp: new Date().toISOString()
    };

    setCurrentAdmin(sessionUser);
    return {
      success: true,
      user: sessionUser
    };
  };

  const logout = () => {
    setCurrentAdmin(null);
  };

  const isOwner = currentAdmin?.role === ROLES.OWNER;
  const isStaff = currentAdmin?.role === ROLES.STAFF;
  const isAuthenticated = !!currentAdmin;

  return (
    <AdminAuthContext.Provider
      value={{
        currentAdmin,
        isAuthenticated,
        isOwner,
        isStaff,
        login,
        logout,
        ROLES,
        DEFAULT_ACCOUNTS
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
