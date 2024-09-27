"use client";
import React, { createContext, useState, ReactNode } from "react";

interface StoryTypeContextProps {
  storyType: string;
  setStoryType: (type: string) => void;
}

export const StoryTypeContext = createContext<
  StoryTypeContextProps | undefined
>(undefined);

export const StoryTypeProvider = ({ children }: { children: ReactNode }) => {
  const [storyType, setStoryType] = useState<string>("top");

  return (
    <StoryTypeContext.Provider value={{ storyType, setStoryType }}>
      {children}
    </StoryTypeContext.Provider>
  );
};
