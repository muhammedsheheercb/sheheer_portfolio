"use client";
import { createContext } from "react";
export const InteractionContext = createContext<
  ((index: number) => void) | null
>(null);
