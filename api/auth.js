export default async function handler(req, res) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return res.status(500).json({ 
      error: 'GitHub OAuth not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Vercel.' 
    });
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
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <body>
            <script>
              window.opener.postMessage(
                'authorization:github:error:${JSON.stringify({ error: data.error_description || data.error })}',
                '*'
              );
              window.close();
            </script>
            <p>Authentication failed: ${data.error_description || data.error}</p>
          </body>
          </html>
        `);
      }

      // Return the token to the CMS via postMessage
      const content = `
        <!DOCTYPE html>
        <html>
        <body>
          <script>
            (function() {
              function receiveMessage(e) {
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
          <p>Completing authentication...</p>
        </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(content);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to exchange code for token' });
    }
  }

  // Initial auth request - redirect to GitHub
  const scope = 'repo,user';
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${scope}`;
  return res.redirect(307, authUrl);
}
