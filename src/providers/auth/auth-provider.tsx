'use client'
import { UserDTO } from "@/dtos/responses/user-dto";
import { jiraAPI } from "@/lib/fetch/jira-api";
import { AuthProviderProps, UserAuthentication } from "@/shared/interfaces/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { ROUTES_VARIABLES } from "@/config/constants/route-variables";
import { toast } from "sonner";
import { COOKIES } from "@/config/constants/cookies";
import { AuthContext } from "@/contexts/auth/auth-context";

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const isAuthenticated: boolean = !!user;

  const fetchUserData = useCallback(async (token: string, username: string) => {
    const currentUserInformations = await jiraAPI(`/user/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${token}`,
      }
    });
    const userData = await currentUserInformations.json();
    return UserDTO.fromUser(userData);
  }, []);

  const currentUser = useCallback(async () => {
    const { '@valkyrie:auth-token': token } = parseCookies();
    if (token) {
      try {
        const result = await jiraAPI('/auth', {
          method: 'GET',
          headers: { 'Authorization': `Basic ${token}` }
        });
        const user = await result.json();
        const userInformations = await fetchUserData(token, user.name);
        setUser(userInformations);
        return user;
      } catch (error) {
        await signOut();
      }
    }
  }, [fetchUserData]);

  useEffect(() => {
    if (!user) {
      currentUser();
    }
  }, [currentUser, user]);

  async function signIn({ username, password }: UserAuthentication): Promise<void> {
    if (!username || !password) {
      toast.warning('Insira suas credenciais para acessar sua conta.');
      return;
    }

    try {
      const logged = await jiraAPI("/auth", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (logged.status === HttpStatus.CREATED) {
        const token = Buffer.from(`${username}:${password}`).toString("base64");
        const userInformations = await fetchUserData(token, username);

        setCookie(undefined, `${COOKIES.AUTH_TOKEN}`, token, {
          maxAge: keepMeLoggedIn ? 5 * 24 * 60 * 60 : 8 * 60 * 60
        });

        setUser(userInformations);
        router.push(`${ROUTES_VARIABLES.DASHBOARD}`);
      } else {
        toast.error('Usuário e senha inválidos.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro durante o login. Tente novamente.');
    }
  }

  async function signOut() {
    destroyCookie(undefined, `${COOKIES.AUTH_TOKEN}`);
    setUser(null);
    router.replace(ROUTES_VARIABLES.HOME);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated, keepMeLoggedIn, setKeepMeLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

