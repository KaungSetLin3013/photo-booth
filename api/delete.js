export const config = { runtime: 'edge' };

export default async function handler(req) {
  const GH_USER  = process.env.GH_USER;
  const GH_REPO  = process.env.GH_REPO;
  const GH_TOKEN = process.env.GH_TOKEN;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });

  try {
    const { filename, sha } = await req.json();
    const ghHeaders = {
      'Authorization': `Bearer ${GH_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    };
    const res = await fetch(
      `https://api.github.com/repos/${GH_USER}/${GH_REPO}/contents/photos/${filename}`,
      { method: 'DELETE', headers: ghHeaders, body: JSON.stringify({ message: 'admin: delete ' + filename, sha }) }
    );
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: e.message || 'Delete failed' }), { status: res.status, headers: corsHeaders });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
}
