import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import os from "node:os";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = process.cwd();
const outputDir = path.join(root, "output", "pdf");
fs.mkdirSync(outputDir, { recursive: true });

const jobs = [
  { source: "README.md", output: "FIT-Training-Guide-en.pdf", title: "FIT Training Guide" },
  { source: "README.zh-CN.md", output: "FIT-Training-Guide-zh-CN.pdf", title: "FIT 训练指南" },
];

const css = `
  @page { size: A4; margin: 14mm 12mm 16mm; }
  * { box-sizing: border-box; }
  body { color: #172033; font-family: Inter, "Noto Sans CJK SC", "Microsoft YaHei", Arial, sans-serif; font-size: 9.5pt; line-height: 1.45; }
  h1, h2, h3 { color: #111827; break-after: avoid; }
  h1 { font-size: 22pt; margin: 12mm 0 5mm; }
  h2 { font-size: 17pt; margin: 10mm 0 4mm; border-bottom: 1px solid #cbd5e1; padding-bottom: 2mm; }
  h3 { font-size: 13pt; margin: 7mm 0 2mm; }
  p { margin: 2mm 0 4mm; }
  a { color: #175cd3; text-decoration: none; }
  table { width: 100%; border-collapse: collapse; margin: 2mm 0 5mm; }
  th, td { border: 0.35mm solid #cbd5e1; padding: 2.2mm; vertical-align: top; }
  th { background: #eef2f7; color: #111827; }
  tr, td > table { break-inside: avoid; }
  td > table { margin: 0; }
  img { max-width: 100%; height: auto; object-fit: contain; }
  td img { max-height: 58mm; }
  p[align="center"] img { width: 42mm !important; max-height: 56mm; }
  ul { padding-left: 6mm; }
  li { margin: 1.5mm 0; }
  b { margin-right: 0.3em; }
`;

const inlineLocalImages = (body) => body.replace(/src="((?:assets\/)[^"]+)"/g, (_match, relativePath) => {
  const file = path.join(root, ...relativePath.split("/"));
  const extension = path.extname(file).toLowerCase();
  const mime = extension === ".svg" ? "image/svg+xml" : extension === ".png" ? "image/png" : "application/octet-stream";
  return `src="data:${mime};base64,${fs.readFileSync(file).toString("base64")}"`;
});

const installedBrowserRoot = path.join(os.homedir(), "AppData", "Local", "ms-playwright");
const installedChromium = fs.readdirSync(installedBrowserRoot)
  .filter((name) => name.startsWith("chromium-"))
  .map((name) => path.join(installedBrowserRoot, name, "chrome-win64", "chrome.exe"))
  .find((candidate) => fs.existsSync(candidate));
if (!installedChromium) throw new Error("No installed Chromium executable was found");
const browser = await chromium.launch({ headless: true, executablePath: installedChromium });
try {
  for (const job of jobs) {
    const body = inlineLocalImages(fs.readFileSync(path.join(root, job.source), "utf8"));
    const base = pathToFileURL(`${root}${path.sep}`).href;
    const html = `<!doctype html><html><head><meta charset="utf-8"><base href="${base}"><style>${css}</style></head><body>${body}</body></html>`;
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.evaluate(async () => {
      const images = [...document.images];
      await Promise.all(images.map((img) => img.complete ? Promise.resolve() : new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      })));
      await document.fonts.ready;
    });
    await page.pdf({
      path: path.join(outputDir, job.output),
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="width:100%;font-size:8px;color:#64748b;padding:0 12mm;text-align:right">${job.title}</div>`,
      footerTemplate: '<div style="width:100%;font-size:8px;color:#64748b;padding:0 12mm;text-align:center"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
      margin: { top: "17mm", right: "12mm", bottom: "18mm", left: "12mm" },
    });
    await page.close();
  }
} finally {
  await browser.close();
}
