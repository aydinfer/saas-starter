'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface SherlockContextType {
  isOpen: boolean;
  openSherlock: () => void;
  closeSherlock: () => void;
}

const SherlockContext = createContext<SherlockContextType | undefined>(undefined);

export function SherlockProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SherlockContext.Provider
      value={{
        isOpen,
        openSherlock: () => setIsOpen(true),
        closeSherlock: () => setIsOpen(false),
      }}
    >
      {children}
    </SherlockContext.Provider>
  );
}

export function useSherlock() {
  const context = useContext(SherlockContext);
  if (!context) {
    throw new Error('useSherlock must be used within SherlockProvider');
  }
  return context;
}
