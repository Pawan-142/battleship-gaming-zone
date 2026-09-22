import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllBranches, getBranchById, locationsHierarchy } from '../data/branchesData';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const branches = getAllBranches();
  
  // Default to Hyderabad Hitech City
  const [selectedBranchId, setSelectedBranchId] = useState(() => {
    return localStorage.getItem('hyperdrive_branch_id') || 'hyd-hitech';
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('hyperdrive_branch_id', selectedBranchId);
  }, [selectedBranchId]);

  const currentBranch = getBranchById(selectedBranchId) || branches[0];

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
