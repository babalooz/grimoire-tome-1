// Renderiza vários quadros de uma composição com UM bundle só (npx remotion still refaz o bundle a cada quadro).
// Uso: node scripts/stills.mjs <Composicao> <props.json> <pasta-saida> <frame> [frame...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, readFileSync } from "fs";
import path from "path";

const [comp, propsPath, outDir, ...frames] = process.argv.slice(2);
const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browserExecutable = existsSync(BROWSER) ? BROWSER : null;
const inputProps = JSON.parse(readFileSync(propsPath, "utf8"));
mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: comp, inputProps, browserExecutable });
console.error(`${comp}: ${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(1)} s)`);
let n = 1;
for (const f of frames) {
  const output = path.join(outDir, `${n}-f${f}.png`);
  await renderStill({ serveUrl, composition, inputProps, frame: Number(f), output, browserExecutable });
  console.log(output);
  n++;
}
