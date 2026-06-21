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

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  try {
    const { imgBase64, metaBase64, imgFilename, metaFilename } = await req.json();

    const ghHeaders = {
      'Authorization': `Bearer ${GH_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    };
    const base = `https://api.github.com/repos/${GH_USER}/${GH_REPO}/contents/`;

    // ensure photos folder exists
    try {
      await fetch(base + 'photos/.gitkeep', { headers: ghHeaders });
    } catch {}
    const chk = await fetch(base + 'photos/.gitkeep', { headers: ghHeaders });
    if (!chk.ok) {
      await fetch(base + 'photos/.gitkeep', {
        method: 'PUT',
        headers: ghHeaders,
        body: JSON.stringify({ message: 'init photos folder', content: btoa('') })
      });
    }

    // upload image
    const imgRes = await fetch(base + imgFilename, {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify({ message: 'photo upload', content: imgBase64 })
    });
    if (!imgRes.ok) {
      const e = await imgRes.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: e.message || 'Image upload failed' }), { status: imgRes.status, headers: corsHeaders });
    }

    // upload meta
    const metaRes = await fetch(base + metaFilename, {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify({ message: 'photo meta', content: metaBase64 })
    });
    if (!metaRes.ok) {
      const e = await metaRes.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: e.message || 'Meta upload failed' }), { status: metaRes.status, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
}
