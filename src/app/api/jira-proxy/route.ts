// app/api/jira-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    console.log('URL recebida:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 });
    }

    const username = process.env.NEXT_PUBLIC_SB_USER;
    const password = process.env.NEXT_PUBLIC_SB_PASS;

    if (!username || !password) {
      return NextResponse.json({ error: 'Credenciais não configuradas' }, { status: 500 });
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      console.error('Erro na resposta do Jira:', response.status, response.statusText);
      throw new Error(`Falha na requisição ao Jira: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
      },
    });
  } catch (error) {
    console.error('Erro completo:', error);
    return NextResponse.json({
      error: 'Erro ao acessar o recurso do Jira',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}