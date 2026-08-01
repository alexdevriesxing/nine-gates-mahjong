const origin = (process.env.NGM_BASE_URL || 'https://ninegatesmahjong.com').replace(/\/$/, '');
const endpoint = process.env.NGM_INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const key = 'a4e28bc3d69f41bb826c17f5909ce753';
const keyLocation = `${origin}/${key}.txt`;

const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Unable to read sitemap: ${sitemapResponse.status}`);

const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urlList.length) throw new Error('Sitemap contains no canonical URLs.');
if (urlList.some((url) => !url.startsWith(`${origin}/`) && url !== `${origin}/`)) {
  throw new Error('Sitemap contains a URL outside the canonical origin.');
}

const payload = {
  host: new URL(origin).hostname,
  key,
  keyLocation,
  urlList,
};

if (process.env.NGM_INDEXNOW_DRY_RUN === '1') {
  console.log(JSON.stringify({ dryRun: true, endpoint, keyLocation, submitted: urlList.length }));
  process.exit(0);
}

const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow rejected the submission: ${response.status} ${await response.text()}`);
}

console.log(JSON.stringify({ endpoint, status: response.status, keyLocation, submitted: urlList.length }));
