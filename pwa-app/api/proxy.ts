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

    // Forward all headers except host and x-target-url
    const forwardHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey !== 'host' &&
        lowerKey !== 'x-target-url' &&
        lowerKey !== 'content-length' &&
        typeof value === 'string'
      ) {
        forwardHeaders[key] = value;
      }
    }

    // Make the request to target URL
    const response = await fetch(targetUrl, {
      method: req.method || 'GET',
      headers: forwardHeaders,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Get response data
    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Forward response headers
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy request failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
