import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get target URL from header
    const targetUrl = req.headers['x-target-url'] as string;

    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing x-target-url header' });
    }

    console.log('Proxy request to:', targetUrl);
    console.log('Method:', req.method);

    // Forward all headers except host, x-target-url, and connection-related
    const forwardHeaders: Record<string, string> = {};
    const skipHeaders = ['host', 'x-target-url', 'content-length', 'connection', 'keep-alive', 'transfer-encoding'];

    for (const [key, value] of Object.entries(req.headers)) {
      const lowerKey = key.toLowerCase();
      if (!skipHeaders.includes(lowerKey) && typeof value === 'string') {
        forwardHeaders[key] = value;
      }
    }

    console.log('Forward headers:', Object.keys(forwardHeaders));

    // Prepare body - only include if not null/undefined
    let bodyToSend: string | undefined = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body !== null && req.body !== undefined) {
      bodyToSend = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    // Make the request to target URL
    const response = await fetch(targetUrl, {
      method: req.method || 'GET',
      headers: forwardHeaders,
      body: bodyToSend,
    });

    console.log('Target response status:', response.status);

    // Get response data
    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log('Response data type:', typeof data);

    // Forward response headers (skip problematic ones)
    const skipResponseHeaders = ['content-encoding', 'transfer-encoding', 'connection'];
    response.headers.forEach((value, key) => {
      if (!skipResponseHeaders.includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
