'use client'
import { AuthContextType } from "@/shared/types/auth";
import { createContext } from "react";

export const AuthContext = createContext({} as AuthContextType)
