"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

// Define the shape of the context data
interface SelectedButtonContextType {
  selectedButton: string | null;
  setSelectedButton: (button: string) => void;
}

// Create the context with default values
export const SelectedButtonContext = createContext<
  SelectedButtonContextType | undefined
>(undefined);

// Create a provider component
export const SelectedButtonProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  return (
    <SelectedButtonContext.Provider
      value={{ selectedButton, setSelectedButton }}
    >
      {children}
    </SelectedButtonContext.Provider>
  );
};

// Custom hook to use the SelectedButtonContext
export const useSelectedButton = () => {
  const context = useContext(SelectedButtonContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedButton must be used within a SelectedButtonProvider"
    );
  }
  return context;
};
