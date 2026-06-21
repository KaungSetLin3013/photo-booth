export const config = { runtime: 'edge' };

export default async function handler(req) {
  const GH_USER  = process.env.GH_USER;
  const GH_REPO  = process.env.GH_REPO;
  const GH_TOKEN = process.env.GH_TOKEN;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GH_USER}/${GH_REPO}/contents/photos`,
      {
        headers: {
          'Authorization': `Bearer ${GH_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: err.message || 'GitHub error ' + res.status }), { status: res.status, headers });
    }

    const files = await res.json();
    return new Response(JSON.stringify(files), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
