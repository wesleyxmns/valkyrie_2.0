import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { COOKIES } from './config/constants/cookies';
import { ROUTES_VARIABLES } from './config/constants/route-variables';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get(COOKIES.AUTH_TOKEN);
  const token = tokenCookie ? tokenCookie.value : null;

  // Verifica se a rota faz parte das rotas de autenticação
  const isAuthRoute = pathname.startsWith(ROUTES_VARIABLES.AUTH);

  // Se o usuário não está autenticado e não está em uma rota de autenticação, redireciona para o login
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL(`${ROUTES_VARIABLES.AUTH}`, request.url));
  }

  // Se o usuário autenticado tenta acessar a página de login, redireciona para o dashboard
  if (token && pathname === ROUTES_VARIABLES.AUTH) {
    return NextResponse.redirect(new URL(`${ROUTES_VARIABLES.DASHBOARD}`, request.url));
  }

  return NextResponse.next();
}

// Configuração do matcher para incluir as rotas de autenticação
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)', // Intercepta todas as rotas exceto as estáticas e a pasta public
  ]
};
