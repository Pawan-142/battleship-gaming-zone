import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllBranches, getBranchById as defaultGetBranchById, locationsHierarchy } from '../data/branchesData';
import { useAdminStore } from './AdminStoreContext';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const { branches: storeBranches, getBranchById: storeGetBranchById } = useAdminStore();
  const branches = storeBranches?.length ? storeBranches : getAllBranches();
  
  // Default to first branch
  const [selectedBranchId, setSelectedBranchId] = useState(() => {
    return localStorage.getItem('hyperdrive_branch_id') || branches[0]?.id || 'hyd-hitech';
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('hyperdrive_branch_id', selectedBranchId);
  }, [selectedBranchId]);

  const currentBranch = (storeGetBranchById ? storeGetBranchById(selectedBranchId) : defaultGetBranchById(selectedBranchId)) || branches[0];

  const selectBranch = (branchId) => {
    setSelectedBranchId(branchId);
    setIsLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        currentBranch,
        selectedBranchId,
        selectBranch,
        branches,
        locationsHierarchy,
        isLocationModalOpen,
        setIsLocationModalOpen
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
