// Fetch only when a visitor chooses a recording. The audio stays in the browser.
window.loadDotlineSpeechAssets = async function (objectURLs, signal) {
  if (!window.DecompressionStream) {
    throw new Error('请使用新版 Chrome、Edge 或 Safari 加载语音模型。');
  }
  async function readFile(name) {
    const response = await fetch(new URL('./speech/' + name, document.baseURI), {signal});
    if (!response.ok) throw new Error('语音模型未能下载，请检查网络后重试。');
    return response;
  }
  const manifest = await (await readFile('manifest.json')).json();
  const assets = {};
  const scripts = {};
  await Promise.all(manifest.map(async ({name, mime, parts}) => {
    const chunks = await Promise.all(parts.map(async part => (await readFile(part)).blob()));
    const stream = new Blob(chunks).stream().pipeThrough(new DecompressionStream('gzip'));
    const blob = await new Response(stream, {headers: {'Content-Type': mime}}).blob();
    if (name.endsWith('.js')) scripts[name] = blob;
    else assets[name] = blob;
  }));
  signal?.throwIfAborted();
  const worker = new Blob([scripts['transformers.js'], ';\n', scripts['simplify.js'], ';\n',
    scripts['recognizer-worker.js']], {type: 'text/javascript'});
  const workerURL = URL.createObjectURL(worker);
  objectURLs.push(workerURL);
  assets['recognizer-worker.js'] = workerURL;
  return assets;
};
