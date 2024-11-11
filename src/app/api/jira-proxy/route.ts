import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_SB_USER}:${process.env.NEXT_PUBLIC_SB_PASS}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
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
    console.error('Erro ao acessar o Jira:', error);
    return NextResponse.json({ error: 'Erro ao acessar o recurso do Jira' }, { status: 500 });
  }
}