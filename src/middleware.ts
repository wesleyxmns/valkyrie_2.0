import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { COOKIES } from './config/constants/cookies';
import { ROUTES_VARIABLES } from './config/constants/route-variables';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get(COOKIES.AUTH_TOKEN);
  const token = tokenCookie ? tokenCookie.value : null;

  // Defina uma lista de rotas públicas, que devem estar acessíveis sem autenticação
  const publicRoutes = [
    ROUTES_VARIABLES.AUTH, // A página de login
    ROUTES_VARIABLES.FORGOT_PASSWORD, // A página de recuperação de senha
    ROUTES_VARIABLES.RESET_PASWORD,  // A página de redefinição de senha, se existir
    ROUTES_VARIABLES.EXPIRES_LINK,    // A página de link expirado, se existir
  ];

  // Verifique se a rota atual é uma das rotas públicas
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Se o usuário não está autenticado e a rota não é pública, redirecione para a página de login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL(`${ROUTES_VARIABLES.AUTH}`, request.url));
  }

  // Se o usuário está autenticado e tenta acessar a rota de login, redirecione para o dashboard
  if (token && pathname === ROUTES_VARIABLES.AUTH) {
    return NextResponse.redirect(new URL(`${ROUTES_VARIABLES.DASHBOARD}`, request.url));
  }

  return NextResponse.next();
}

// Configuração do matcher para incluir as rotas de autenticação e ignorar rotas estáticas e public
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)', // Intercepta todas as rotas exceto as estáticas e a pasta public
  ]
};
