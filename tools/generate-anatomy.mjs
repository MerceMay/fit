import fs from "node:fs";
import path from "node:path";

const source = process.argv[2];
if (!source) throw new Error("Usage: node tools/generate-anatomy.mjs <body-muscles checkout>");

const parse = (file, view) => {
  const text = fs.readFileSync(path.join(source, "src", "data", file), "utf8");
  return [...text.matchAll(/id:\s*"([^"]+)"[\s\S]*?path:\s*"([^"]+)"/g)].map((m) => ({ id: m[1], d: m[2], view }));
};
const muscles = [...parse("muscles.front.ts", "front"), ...parse("muscles.back.ts", "back")];
const charts = {
  "shoulder-anterior": ["shoulder-front"], "shoulder-lateral": ["shoulder-side"], "shoulder-posterior": ["deltoid-rear"],
  "biceps": ["biceps"], "triceps-long": ["triceps-long"], "triceps-lateral": ["triceps-lateral"],
  "chest-clavicular": ["chest-upper"], "chest-sternocostal": ["chest-lower"],
  "latissimus": ["lats-"], "trapezius-upper": ["traps-upper"], "trapezius-middle": ["traps-mid"], "trapezius-lower": ["traps-lower"],
  "erector-spinae": ["lower-back-erectors", "spine"], "quadratus-lumborum": ["lower-back-ql"],
  "quadriceps": ["quads-"], "hamstrings-medial": ["hamstrings-medial"], "hamstrings-lateral": ["hamstrings-lateral"], "adductors": ["adductors-"],
  "gluteus-maximus": ["gluteus-maximus"], "gluteus-medius": ["gluteus-medius"],
  "gastrocnemius-medial": ["calves-gastroc-medial"], "gastrocnemius-lateral": ["calves-gastroc-lateral"], "soleus": ["calves-soleus"], "tibialis-anterior": ["tibialis-anterior"],
  "rectus-abdominis": ["abs-upper", "abs-lower"], "obliques": ["obliques-"], "serratus-anterior": ["serratus-anterior"], "hip-flexors": ["hip-flexor"]
};

const out = path.join(process.cwd(), "assets", "anatomy");
fs.mkdirSync(out, { recursive: true });
for (const [name, needles] of Object.entries(charts)) {
  const target = muscles.filter((m) => needles.some((n) => m.id.startsWith(n)));
  const view = target.some((m) => m.view === "back") ? "back" : "front";
  const shown = muscles.filter((m) => m.view === view);
  const box = view === "front" ? "0 0 35 93" : "37 0 35 93";
  const body = shown.map((m) => `<path d="${m.d}" fill="${target.includes(m) ? "#dc2626" : "#d1d5db"}" stroke="#ffffff" stroke-width="0.12"/>`).join("\n  ");
  fs.writeFileSync(path.join(out, `${name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" role="img" aria-label="${name}">\n  <rect x="${view === "front" ? 0 : 37}" width="35" height="93" fill="#ffffff"/>\n  ${body}\n</svg>\n`);
}
