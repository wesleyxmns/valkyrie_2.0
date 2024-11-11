import { UserDTO } from "@/dtos/responses/user-dto";
import { Dispatch } from "react";
import { UserAuthentication } from "../interfaces/auth";

export type AuthContextType = {
  isAuthenticated: boolean;
  keepMeLoggedIn: boolean;
  setKeepMeLoggedIn: Dispatch<boolean>
  user: UserDTO | null;
  signIn: ({ username, password }: UserAuthentication) => Promise<void>;
  signOut: () => Promise<void>;
}