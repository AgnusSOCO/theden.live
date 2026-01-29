/**
 * GitHub OAuth handler for Decap CMS
 * 
 * This serverless function handles the OAuth flow for Decap CMS.
 * 
 * Required environment variables (set in Vercel):
 * - GITHUB_CLIENT_ID: Your GitHub OAuth App Client ID
 * - GITHUB_CLIENT_SECRET: Your GitHub OAuth App Client Secret
 */

export default async function handler(req, res) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return res.status(500).json({ 
      error: 'GitHub OAuth credentials not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Vercel environment variables.' 
    });
  }

  // Handle the initial auth request - redirect to GitHub
  if (req.method === 'GET' && !req.query.code) {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo,user`;
    return res.redirect(authUrl);
  }

  // Handle the callback from GitHub with the code
  if (req.query.code) {
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: req.query.code,
        }),
      });

      const data = await response.json();

      if (data.error) {
        return res.status(400).json({ error: data.error_description || data.error });
      }

      // Return the token to Decap CMS via postMessage
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authenticating...</title>
        </head>
        <body>
          <script>
            (function() {
              function receiveMessage(e) {
                console.log("receiveMessage %o", e);
                window.opener.postMessage(
                  'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}',
                  e.origin
                );
                window.close();
              }
              window.addEventListener("message", receiveMessage, false);
              window.opener.postMessage("authorizing:github", "*");
            })();
          </script>
          <p>Authenticating with GitHub...</p>
        </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(content);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to exchange code for token' });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
}
