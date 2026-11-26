// Cloudflare Worker: busca a cifra de um link (Cifra Club, Cifras.com.br, Letras) para o Portal de Cifras.
// O navegador não deixa o portal ler outros sites direto; este Worker lê e devolve só a cifra.
// Só aceita pedidos vindos do portal e só abre sites de cifra da lista abaixo.
const PERMITIDOS = ['cifraclub.com.br', 'www.cifraclub.com.br', 'm.cifraclub.com.br', 'cifras.com.br', 'www.cifras.com.br', 'letras.mus.br', 'www.letras.mus.br', 'musicasparamissa.com.br', 'www.musicasparamissa.com.br'];
const ORIGENS = ['https://dal-antunes.github.io'];

function texto(html) {
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, '&');
}

export default {
  async fetch(req) {
    const origem = req.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': ORIGENS.includes(origem) ? origem : ORIGENS[0], 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Vary': 'Origin' };
    const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (origem && !ORIGENS.includes(origem)) return json({ erro: 'origem não permitida' }, 403);
    let u;
    try { u = new URL(new URL(req.url).searchParams.get('url') || ''); } catch (e) { return json({ erro: 'link inválido' }, 400); }
    if (u.protocol !== 'https:' || !PERMITIDOS.includes(u.hostname)) return json({ erro: 'site não permitido' }, 400);
    const r = await fetch(u.toString(), { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36', 'Accept-Language': 'pt-BR,pt;q=0.9' } });
    if (!r.ok) return json({ erro: 'não encontrei a página', status: r.status }, 404);
    const html = await r.text();
    // a cifra costuma vir num <pre>; se não, tenta um bloco com "cifra" na classe (Músicas para Missa e outros)
    const pre = (html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i) || [])[1]
      || (html.match(/<div[^>]*class="[^"]*cifra[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<\/div>|<div[^>]*class="[^"]*(?:compartilh|share|autor|coment)[^"]*")/i) || [])[1];
    if (!pre) return json({ erro: 'não encontrei a cifra nesta página' }, 404);
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
    const h2 = (html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || [])[1] || '';
    const tom = (html.match(/id="cifra_tom"[\s\S]{0,200}?>\s*([A-G][#b]?m?[^<\s]{0,6})\s*</i) || [])[1] || '';
    return json({ titulo: texto(h1).trim(), artista: texto(h2).trim(), tom, cifra: texto(pre).replace(/\r/g, ''), fonte: u.toString() });
  }
};
