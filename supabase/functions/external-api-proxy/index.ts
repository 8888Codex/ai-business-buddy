const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-external-auth-token',
};

const EXTERNAL_API_BASE_URL = Deno.env.get('EXTERNAL_API_URL') ?? 'https://funcionario.cognitaai.com.br/v1';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestUrl = new URL(req.url);
    const path = requestUrl.pathname.split('/external-api-proxy')[1] || '/';
    const targetUrl = `${EXTERNAL_API_BASE_URL}${path}${requestUrl.search}`;
    console.log('[external-api-proxy]', method, targetUrl);

    const upstreamHeaders = new Headers();
    upstreamHeaders.set('Content-Type', req.headers.get('content-type') ?? 'application/json');

    const externalToken = req.headers.get('x-external-auth-token');
    if (externalToken) {
      upstreamHeaders.set('Authorization', `Bearer ${externalToken}`);
    }

    const method = req.method.toUpperCase();
    const shouldSendBody = !['GET', 'HEAD'].includes(method);

    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers: upstreamHeaders,
      body: shouldSendBody ? await req.text() : undefined,
    });

    const responseText = await upstreamResponse.text();
    const responseHeaders = new Headers(corsHeaders);
    responseHeaders.set('Content-Type', upstreamResponse.headers.get('content-type') ?? 'application/json');

    return new Response(responseText, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado no proxy';

    return new Response(
      JSON.stringify({ error: 'proxy_error', message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
