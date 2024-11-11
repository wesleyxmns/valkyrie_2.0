import { ReactNode } from "react";

export interface AuthProviderProps {
  children: ReactNode
}

export interface UserAuthentication {
  username: string;
  password: string;
}
