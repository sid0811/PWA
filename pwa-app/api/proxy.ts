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

    // Map custom headers to actual header names (browser blocks some header names like 'Date')
    const headerMapping: Record<string, string> = {
      'x-custom-date': 'Date',
      'x-custom-parentuserid': 'ParentUserID',
      'x-custom-commandtype': 'CommandType',
      'x-custom-userid': 'UserID',
      'x-custom-collectiontype': 'CollectionType',
      'x-custom-loginid': 'loginId',
    };

    for (const [key, value] of Object.entries(req.headers)) {
      const lowerKey = key.toLowerCase();
      if (!skipHeaders.includes(lowerKey) && typeof value === 'string') {
        // Check if this header needs to be mapped to a different name
        const mappedKey = headerMapping[lowerKey];
        if (mappedKey) {
          forwardHeaders[mappedKey] = value;
        } else if (!lowerKey.startsWith('x-custom-')) {
          forwardHeaders[key] = value;
        }
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

    // Get response data - always try JSON first since some APIs return JSON with wrong content-type
    const contentType = response.headers.get('content-type') || '';
    let data;
    const responseText = await response.text();

    // Try to parse as JSON first, regardless of content-type
    try {
      data = JSON.parse(responseText);
      console.log('Response parsed as JSON');
    } catch {
      // If JSON parse fails, use as text
      data = responseText;
      console.log('Response kept as text');
    }

    console.log('Response data type:', typeof data);
    console.log('Response content-type:', contentType);

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
