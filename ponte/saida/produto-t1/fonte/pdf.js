const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const n of ['isca', 'apostila']) {
    await p.goto('file://' + __dirname + '/' + n + '.html');
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: __dirname + '/' + n + '.raw.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  }
  await b.close();
})();
