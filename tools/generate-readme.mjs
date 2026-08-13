import fs from "node:fs";

const base = "https://marcmayol.com/exercise-api";
const catalog = await fetch(`${base}/v1/dataset.json`).then((r) => r.json());
const bySlug = new Map(catalog.exercises.map((x) => [x.slug, x]));

const upper = "65 0 457 650", torso = "65 90 457 650", legs = "65 400 457 737";
const medical = {
  "三角肌前束": { ids:["anterior_deltoid"], view:"front", box:upper },
  "三角肌中束": { ids:["lateral_deltoid"], view:"front", box:upper },
  "三角肌后束": { ids:["posterior_deltoid"], view:"back", box:upper },
  "胸大肌锁骨部（上胸）": { ids:["pectoralis_major"], view:"front", box:upper },
  "胸大肌胸肋部（整体／中部偏重）": { ids:["pectoralis_major"], view:"front", box:upper },
  "胸大肌胸肋部下方纤维偏重": { ids:["pectoralis_major"], view:"front", box:upper },
  "肱二头肌": { ids:["biceps_brachii"], view:"front", box:upper },
  "肱肌／肱桡肌": { ids:["brachioradialis"], view:"front", box:upper },
  "肱三头长头": { ids:["triceps_brachii_caput_longum"], view:"back", box:upper },
  "肱三头外侧头／内侧头": { ids:["triceps_brachii_caput_laterale","triceps_brachii_caput_mediale"], view:"back", box:upper },
  "背阔肌／大圆肌（背宽）": { ids:["latissimus_dorsi"], view:"back", box:torso },
  "斜方肌中下束／菱形肌（背厚）": { ids:["trapezius_middle","trapezius_lower"], view:"back", box:upper },
  "斜方肌上束": { ids:["trapezius_upper"], view:"back", box:upper },
  "竖脊肌／腰背稳定肌": { ids:["latissimus_dorsi"], view:"back", box:torso },
  "股四头肌": { ids:["vastus_","rectus_femoris"], view:"front", box:legs },
  "腘绳肌": { ids:["semimembranosus","semitendinosus","biceps_femoris"], view:"back", box:legs },
  "臀大肌": { ids:["gluteus_maximus"], view:"back", box:legs },
  "臀中肌／髋外展肌群": { ids:["gluteus_medius"], view:"back", box:legs },
  "髋内收肌群": { ids:["adductor_","gracilis","pectineus"], view:"front", box:legs },
  "腓肠肌": { ids:["gastrocnemius"], view:"back", box:legs },
  "比目鱼肌": { ids:["gastrocnemius"], view:"back", box:legs },
  "腹直肌": { ids:["rectus_abdominis"], view:"front", box:torso },
  "腹斜肌／抗旋转": { ids:["external_oblique"], view:"front", box:torso },
  "深层核心／抗伸展": { ids:["rectus_abdominis","external_oblique"], view:"front", box:torso },
};

const anatomyDir = "assets/anatomy-atlas";
fs.mkdirSync(anatomyDir, { recursive: true });
const safeName = (s) => [...s].map((c) => /[A-Za-z0-9]/.test(c) ? c : `u${c.codePointAt(0).toString(16)}`).join("-");
for (const [group, spec] of Object.entries(medical)) {
  let svg = fs.readFileSync(`assets/anatomy-atlas-${spec.view}.svg`, "utf8");
  svg = svg
    .replace(/width="[^"]+"/, 'width="600"')
    .replace(/height="[^"]+"/, 'height="600"')
    .replace(/viewBox="[^"]+"/, `viewBox="${spec.box}"`)
    .replace(/<svg /, '<svg preserveAspectRatio="xMidYMid meet" ');
  const selectors = spec.ids.flatMap((id) => [`[id^="${id}"]`, `[id*="_${id}"]`]).join(",");
  svg = svg.replace("</svg>", `<style>${selectors}{fill:#dc2626!important;stroke:#991b1b!important;stroke-width:1.2}</style></svg>`);
  fs.writeFileSync(`${anatomyDir}/${safeName(group)}.svg`, svg);
}

const sections = [
  ["肩膀", [
    ["三角肌前束", [["seated-dumbbell-overhead-shoulder-press","坐姿哑铃推举"],["barbell-overhead-press","杠铃推举"],["machine-shoulder-press","器械肩推"],["cable-front-raise","绳索前平举"]]],
    ["三角肌中束", [["cable-lateral-raises","绳索侧平举"],["dumbbell-lateral-raises","哑铃侧平举"],["machine-shoulder-press","器械肩推"],["cable-upright-row","绳索直立划船"]]],
    ["三角肌后束", [["reverse-fly","反向飞鸟"],["face-pull","绳索面拉"],["y-t-w-raise","上斜凳 Y-T-W 举"],["inverted-row","宽肘反向划船"]]],
  ]],
  ["胸", [
    ["胸大肌锁骨部（上胸）", [["incline-dumbbell-press","上斜哑铃卧推"],["incline-barbell-bench-press","上斜杠铃卧推"],["low-cable-fly","低位绳索夹胸"],["incline-chest-press-machine","上斜器械推胸"]]],
    ["胸大肌胸肋部（整体／中部偏重）", [["barbell-bench-press","杠铃平板卧推"],["dumbbell-bench-press","哑铃平板卧推"],["butterflies","蝴蝶机夹胸"],["cable-chest-press","绳索推胸"]]],
    ["胸大肌胸肋部下方纤维偏重", [["chest-dips","前倾双杠臂屈伸"],["decline-bench-press","下斜杠铃卧推"],["cable-crossover","高位绳索夹胸"],["push-ups","俯卧撑"]]],
  ]],
  ["手臂", [
    ["肱二头肌", [["preacher-curl","牧师凳弯举"],["incline-dumbbell-curl","上斜哑铃弯举"],["cable-curl","绳索弯举"],["barbell-biceps-curl","杠铃弯举"]]],
    ["肱肌／肱桡肌", [["dumbbell-hammer-biceps-curl","哑铃锤式弯举"],["alternating-dumbbell-biceps-curl","交替哑铃弯举"],["farmers-walk","农夫走"]]],
    ["肱三头长头", [["cable-overhead-triceps-extension","绳索过头臂屈伸"],["overhead-triceps-extension","哑铃过头臂屈伸"],["skull-crusher","仰卧臂屈伸"],["close-grip-bench-press","窄距卧推"]]],
    ["肱三头外侧头／内侧头", [["triceps-pushdown","绳索下压"],["close-grip-bench-press","窄距卧推"],["dips-machine","器械臂屈伸"],["diamond-push-up","钻石俯卧撑"]]],
  ]],
  ["背", [
    ["背阔肌／大圆肌（背宽）", [["pull-ups","引体向上"],["neutral-grip-pulldown","中立握高位下拉"],["straight-arm-pulldown","直臂下拉"],["cable-pullover","绳索屈臂上拉"]]],
    ["斜方肌中下束／菱形肌（背厚）", [["seated-cable-back-rows","坐姿绳索划船"],["t-bar-row","T 杠划船"],["seated-row-machine","器械划船"],["barbell-row","杠铃俯身划船"]]],
    ["斜方肌上束", [["dumbbell-shrug","哑铃耸肩"],["barbell-shrug","杠铃耸肩"],["farmers-walk","农夫走"],["deadlift","传统硬拉"]]],
    ["竖脊肌／腰背稳定肌", [["romanian-deadlift","罗马尼亚硬拉"],["back-extension","山羊挺身"],["good-morning","杠铃早安式"],["deadlift","传统硬拉"]]],
  ]],
  ["腿与臀", [
    ["股四头肌", [["barbell-squat","杠铃深蹲"],["seated-leg-extensions","腿屈伸"],["sled-hack-squat","45° 哈克深蹲"],["leg-press","倒蹬机"]]],
    ["腘绳肌", [["seated-leg-curl","坐姿腿弯举"],["romanian-deadlift","罗马尼亚硬拉"],["nordic-curl","北欧腿弯举"],["lying-leg-curls","俯卧腿弯举"]]],
    ["臀大肌", [["barbell-hip-thrust","杠铃臀推"],["barbell-squat","深幅杠铃深蹲"],["bulgarian-split-squat","保加利亚分腿蹲"],["cable-glute-kickback","绳索后踢腿"]]],
    ["臀中肌／髋外展肌群", [["cable-hip-abduction","绳索髋外展"],["hip-abduction","器械髋外展"],["bulgarian-split-squat","保加利亚分腿蹲"],["side-plank","侧桥"]]],
    ["髋内收肌群", [["hip-adduction","器械髋内收"],["sumo-deadlift","相扑硬拉"],["barbell-squat","深幅杠铃深蹲"],["goblet-squats","高脚杯深蹲"]]],
    ["腓肠肌", [["standing-calf-raises","站姿提踵"],["jump-rope","跳绳"],["stair-climber","登阶机"]]],
    ["比目鱼肌", [["seated-calf-raises","坐姿提踵"],["stair-climber","登阶机"],["calf-stretch-wall","靠墙小腿拉伸（辅助）"]]],
  ]],
  ["核心", [
    ["腹直肌", [["cable-crunch","绳索卷腹"],["ab-wheel-rollout","健腹轮"],["hanging-leg-raise","悬垂举腿"],["crunch","卷腹"]]],
    ["腹斜肌／抗旋转", [["pallof-press","Pallof press"],["cable-woodchopper","绳索伐木"],["side-plank","侧桥"],["russian-twist","俄罗斯转体"]]],
    ["深层核心／抗伸展", [["dead-bug","死虫式"],["ab-wheel-rollout","健腹轮"],["plank","平板支撑"],["bird-dog","鸟狗式"]]],
  ]],
];

const esc = (s) => String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const compounds = new Set(["seated-dumbbell-overhead-shoulder-press","barbell-overhead-press","machine-shoulder-press","incline-dumbbell-press","incline-barbell-bench-press","incline-chest-press-machine","barbell-bench-press","dumbbell-bench-press","cable-chest-press","chest-dips","decline-bench-press","push-ups","close-grip-bench-press","dips-machine","diamond-push-up","pull-ups","neutral-grip-pulldown","inverted-row","seated-cable-back-rows","t-bar-row","seated-row-machine","barbell-row","deadlift","romanian-deadlift","good-morning","barbell-squat","sled-hack-squat","leg-press","nordic-curl","barbell-hip-thrust","bulgarian-split-squat","sumo-deadlift","goblet-squats","hanging-leg-raise","ab-wheel-rollout"]);
const prescriptions = {
  deadlift:["2–3","3–6","3–4 分钟"],
  "barbell-squat":["3–4","5–10","2–3 分钟"],
  "barbell-bench-press":["3–4","5–10","2–3 分钟"],
  "barbell-overhead-press":["3–4","6–10","2–3 分钟"],
  "romanian-deadlift":["3–4","6–10","2–3 分钟"],
  "nordic-curl":["2–3","4–8","2–3 分钟"],
  "farmers-walk":["3","30–60 秒","90–120 秒"],
  "jump-rope":["3","45–90 秒","45–60 秒"],
  "stair-climber":["3","60–120 秒","60 秒"],
  "plank":["3","30–60 秒","45–60 秒"],
  "side-plank":["3","每侧 30–60 秒","45–60 秒"],
  "dead-bug":["3","每侧 8–15","45–60 秒"],
  "bird-dog":["3","每侧 8–15","45–60 秒"],
  "pallof-press":["3","每侧 10–15","45–60 秒"],
};
const prescription = (slug) => prescriptions[slug] ?? (compounds.has(slug) ? ["3–4","6–12","90–180 秒"] : ["2–4","10–20","60–90 秒"]);
const reasons = ["综合首选：稳定、易渐进且目标肌肉受力明确", "优先替代：兼顾刺激与训练舒适度", "器械或动作偏好不同时的可靠选择", "用于补充不同阻力曲线或训练角度"];
const pairRows = (cells) => cells.reduce((rows, cell, i) => {
  if (i % 2 === 0) rows.push([]);
  rows.at(-1).push(cell);
  return rows;
}, []).map((row) => `<tr>${row.join("")}${row.length === 1 ? '<td width="50%"></td>' : ""}</tr>`).join("");
const cards = (actions, group) => {
  const cells = actions.map(([slug, zh], i) => {
  const ex = bySlug.get(slug); if (!ex) throw new Error(`Missing exercise: ${slug}`);
  const pri = ex.primaryMuscles.map((m) => m.en).join("、");
  const sec = ex.secondaryMuscles.map((m) => m.en).join("、") || "—";
  const [sets,reps,rest] = prescription(slug);
  return `<td width="50%" valign="top"><table><tbody><tr><th>#${i+1} ${esc(zh)}<br><sub>${esc(ex.name.en)}</sub></th></tr><tr><td align="center"><img src="${ex.images.male}" width="300" alt="${esc(zh)}动作起止位"></td></tr><tr><td><b>建议：</b>${sets} 组 × ${reps}<br><b>组间休息：</b>${rest}<br><b>主要：</b>${esc(pri)}<br><b>次要：</b>${esc(sec)}<br><b>定位：</b>${reasons[i] ?? reasons[3]}</td></tr></tbody></table></td>`;
  });
  return `<table><tbody>${pairRows(cells)}</tbody></table>`;
};

const warmupGroups = [
  ["胸椎／上背", "斜方肌中下束／菱形肌（背厚）", [["thoracic-extension-bench","卧推凳胸椎伸展","瑜伽垫／卧推凳","1–2 × 8–12"],["open-book-stretch","侧卧开书式","瑜伽垫","1 × 每侧 8–12"],["quadruped-thoracic-rotation","四点跪姿胸椎旋转","瑜伽垫","1 × 每侧 8–12"],["cat-cow","猫牛式","瑜伽垫","1 × 8–12"]]],
  ["肩胛／肩袖", "三角肌后束", [["face-pull","单片重量绳索面拉","龙门架","1–2 × 12–20"],["y-t-w-raise","Y-T-W 肩胛控制","瑜伽垫／上斜凳","1 × 每形态 6–10"],["reverse-fly","单片重量反向飞鸟","龙门架／反向蝴蝶机","1 × 12–20"],["cable-lateral-raises","单片重量侧平举","龙门架","1 × 每侧 12–15"]]],
  ["胸肩前侧", "胸大肌锁骨部（上胸）", [["doorway-chest-stretch","门框动态扩胸","门框／立柱","1 × 每侧 8–12"],["low-cable-fly","单片重量低位夹胸","龙门架","1 × 12–15"],["cable-shoulder-press","单片重量绳索肩推","龙门架","1 × 10–15"],["push-ups","慢速俯卧撑","瑜伽垫","1 × 6–12"]]],
  ["背阔／肩胛下沉", "背阔肌／大圆肌（背宽）", [["straight-arm-pulldown","单片重量直臂下压","龙门架","1–2 × 12–15"],["cable-pullover","单片重量绳索上拉","龙门架","1 × 12–15"],["neutral-grip-pulldown","轻重量肩胛下沉下拉","高位下拉器","1 × 10–12"],["seated-cable-back-rows","单片重量坐姿划船","龙门架","1 × 12–15"]]],
  ["髋关节／臀部", "臀中肌／髋外展肌群", [["hip-90-90","90/90 髋切换","瑜伽垫","1 × 每侧 6–10"],["figure-4-stretch","动态 4 字臀部活动","瑜伽垫","1 × 每侧 8–12"],["glute-bridge","臀桥激活","瑜伽垫／弹力带","1–2 × 10–15"],["cable-hip-abduction","单片重量髋外展","龙门架","1 × 每侧 12–15"]]],
  ["股四头／膝关节", "股四头肌", [["custom:foam-quad","泡沫轴滚股四头","泡沫轴＋瑜伽垫","每侧 30–45 秒","assets/warmup/foam-roll-quadriceps.png"],["seated-leg-extensions","单片重量腿屈伸","腿屈伸机","1 × 12–15"],["goblet-squats","轻高脚杯深蹲","哑铃／壶铃","1 × 8–12"],["barbell-squat","空杆深蹲","深蹲架","1 × 8–12"]]],
  ["腘绳肌／髋铰链", "腘绳肌", [["supine-hamstring-stretch","仰卧动态腘绳肌活动","瑜伽垫／弹力带","1 × 每侧 8–12"],["hip-hinge-dowel","木棍三点髋铰链","木棍／PVC 杆","1 × 8–12"],["seated-leg-curl","单片重量坐姿腿弯举","腿弯举机","1 × 12–15"],["romanian-deadlift","空杆罗马尼亚硬拉","空杆","1 × 8–10"]]],
  ["踝关节／小腿", "腓肠肌", [["ankle-dorsiflexion-wall","墙前踝背屈","墙面／弹力带","1 × 每侧 10–15"],["calf-stretch-wall","动态靠墙小腿活动","墙面","1 × 每侧 8–12"],["standing-calf-raises","慢速徒手提踵","台阶／地面","1 × 12–15"],["custom:foot-ball","足底筋膜球滚动","筋膜球／网球","每侧 30–45 秒","assets/warmup/massage-ball-plantar-fascia.png"]]],
  ["核心／腰椎稳定", "深层核心／抗伸展", [["dead-bug","死虫式","瑜伽垫","1 × 每侧 6–10"],["bird-dog","鸟狗式","瑜伽垫","1 × 每侧 6–10"],["pallof-press","单片重量 Pallof Press","龙门架／弹力带","1 × 每侧 8–12"],["plank","短时平板支撑","瑜伽垫","1 × 20–30 秒"]]],
];
const warmupCards = (actions) => {
  const cells = actions.map(([slug,zh,equipment,dose,customImage],i) => {
  const ex = slug.startsWith("custom:") ? null : bySlug.get(slug);
  if (!ex && !customImage) throw new Error(`Missing warm-up: ${slug}`);
  const image = customImage ?? ex.images.male;
  return `<td width="50%" valign="top"><table><tbody><tr><th>#${i+1} ${esc(zh)}${ex ? `<br><sub>${esc(ex.name.en)}</sub>` : ""}</th></tr><tr><td align="center"><img src="${image}" width="300" alt="${esc(zh)}动作示意图"></td></tr><tr><td><b>器材：</b>${esc(equipment)}<br><b>剂量：</b>${esc(dose)}<br><b>强度：</b>全程轻松，不出现力竭或明显灼烧<br><b>作用：</b>改善该区域活动度、控制或主动作感觉</td></tr></tbody></table></td>`;
  });
  return `<table><tbody>${pairRows(cells)}</tbody></table>`;
};

let out = `<h1 align="center">FIT：肌群动作库、热身与五练 PPL</h1>

<h1 align="center">肌群与对应动作</h1>

`;
for (const [section, groups] of sections) {
  out += `<h2 align="center">${section}</h2>\n`;
  for (const [group, actions] of groups) {
    const anatomy = medical[group] ? `${anatomyDir}/${safeName(group)}.svg` : bySlug.get(actions[0][0]).muscleMaps.male;
    out += `<h3 align="center">${group}</h3>\n<p align="center"><img src="${anatomy}" width="180" alt="${esc(group)}解剖定位图"></p>\n${cards(actions, group)}\n`;
  }
  out += `\n`;
}
out += `<h1 align="center">第二节：专项准备动作库</h1>
<p>本节只用于按区域查动作：优先收录瑜伽垫动态活动、泡沫轴／筋膜球、弹力带、龙门架单片重量和空杆动作。一次训练从相关行选择少量动作即可，不需要整行全部完成。</p>
`;
for (const [region, anatomyGroup, actions] of warmupGroups) {
  const first = actions.find(([slug]) => !slug.startsWith("custom:"));
  const anatomy = medical[anatomyGroup] ? `${anatomyDir}/${safeName(anatomyGroup)}.svg` : bySlug.get(first[0]).muscleMaps.male;
  out += `<h3 align="center">${esc(region)}</h3>\n<p align="center"><img src="${anatomy}" width="180" alt="${esc(region)}关联肌群图"></p>\n${warmupCards(actions)}\n`;
}
out += `<h1 align="center">第三节：五练 PPL 计划</h1>
<p>周结构为 Push A / Pull A / Legs / 休息 / Push B / Pull B / 休息。两个 Push 和两个 Pull 保留必要的高收益重复动作，不为追求花样强行完全错开。</p>
<table><thead><tr><th>日程</th><th>训练</th><th>重点</th></tr></thead><tbody>
<tr><td>周一</td><td>Push A</td><td>平板卧推＋肩中束＋三头长头</td></tr><tr><td>周二</td><td>Pull A</td><td>垂直拉＋背厚＋二头</td></tr><tr><td>周三</td><td>Legs</td><td>股四、腘绳、臀、小腿完整覆盖</td></tr><tr><td>周四</td><td>休息</td><td>恢复、散步或轻度活动</td></tr><tr><td>周五</td><td>Push B</td><td>上胸＋肩推＋三头</td></tr><tr><td>周六</td><td>Pull B</td><td>背阔肌＋上背＋后束＋二头</td></tr><tr><td>周日</td><td>休息</td><td>恢复</td></tr>
</tbody></table>

<h2 align="center">腹部／核心收尾安排</h2>
<p>五个训练日均在力量动作之后训练核心，每次只做一个方向，避免把腹部训练堆成影响复合动作恢复的高疲劳模块。</p>
<table><thead><tr><th>训练日</th><th>核心动作</th><th>训练方向</th><th>建议</th></tr></thead><tbody>
<tr><td>Push A</td><td>绳索卷腹</td><td>负重脊柱屈曲</td><td>3 × 10–15</td></tr>
<tr><td>Pull A</td><td>Pallof Press</td><td>抗旋转</td><td>3 × 每侧 10–15</td></tr>
<tr><td>Legs</td><td>死虫式</td><td>低疲劳抗伸展</td><td>2 × 每侧 8–12</td></tr>
<tr><td>Push B</td><td>悬垂举腿</td><td>骨盆后倾／髋屈控制</td><td>3 × 8–15</td></tr>
<tr><td>Pull B</td><td>健腹轮</td><td>高张力抗伸展</td><td>3 × 6–12</td></tr>
</tbody></table>

<h2 align="center">Push A</h2>
<table><thead><tr><th colspan="4">专项准备（约 8–12 分钟）</th></tr><tr><th>#</th><th>动作</th><th>剂量</th><th>目的</th></tr></thead><tbody><tr><td>1</td><td>卧推凳胸椎伸展</td><td>1 × 8–12</td><td>打开胸椎伸展位</td></tr><tr><td>2</td><td>单片重量绳索面拉</td><td>1 × 15–20</td><td>肩袖与肩胛控制</td></tr><tr><td>3</td><td>单片重量低位夹胸</td><td>1 × 12–15</td><td>建立胸肌收缩感觉</td></tr><tr><td>4</td><td>杠铃卧推递增组</td><td>空杆 10–15；50% × 6–8；70% × 3–5；需要时 80% × 1–3</td><td>排练正式动作，均远离力竭</td></tr></tbody></table>
<table><thead><tr><th>#</th><th>动作</th><th>正式组 × 次数</th><th>休息</th><th>RIR</th></tr></thead><tbody>
<tr><td>1</td><td>杠铃平板卧推</td><td>4 × 5–8</td><td>2–3 分钟</td><td>2</td></tr><tr><td>2</td><td>上斜哑铃卧推</td><td>3 × 8–12</td><td>2 分钟</td><td>1–2</td></tr><tr><td>3</td><td>绳索侧平举</td><td>4 × 12–20</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>4</td><td>绳索过头臂屈伸</td><td>3 × 10–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>5</td><td>绳索下压</td><td>2 × 10–15</td><td>60–90 秒</td><td>0–1</td></tr><tr><td>6</td><td>绳索卷腹</td><td>3 × 10–15</td><td>60 秒</td><td>1–2</td></tr>
</tbody></table>
<h2 align="center">Pull A</h2>
<table><thead><tr><th colspan="4">专项准备（约 8–12 分钟）</th></tr><tr><th>#</th><th>动作</th><th>剂量</th><th>目的</th></tr></thead><tbody><tr><td>1</td><td>四点跪姿胸椎旋转</td><td>1 × 每侧 8–10</td><td>恢复胸椎旋转</td></tr><tr><td>2</td><td>单片重量直臂下压</td><td>1 × 12–15</td><td>背阔与肩胛下沉</td></tr><tr><td>3</td><td>单片重量坐姿划船</td><td>1 × 12–15</td><td>上背后缩控制</td></tr><tr><td>4</td><td>引体／下拉递增组</td><td>轻重量 12；约 60% × 6–8；约 75% × 3–5</td><td>正式组前保持二头和握力新鲜</td></tr></tbody></table>
<table><thead><tr><th>#</th><th>动作</th><th>正式组 × 次数</th><th>休息</th><th>RIR</th></tr></thead><tbody>
<tr><td>1</td><td>引体向上／中立握下拉</td><td>4 × 6–10</td><td>2 分钟</td><td>1–2</td></tr><tr><td>2</td><td>胸托划船／T 杠划船</td><td>4 × 6–12</td><td>2 分钟</td><td>1–2</td></tr><tr><td>3</td><td>直臂下拉</td><td>3 × 10–15</td><td>60–90 秒</td><td>1–2</td></tr><tr><td>4</td><td>反向飞鸟</td><td>3 × 12–20</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>5</td><td>牧师凳弯举</td><td>3 × 8–12</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>6</td><td>锤式弯举</td><td>2 × 10–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>7</td><td>Pallof Press</td><td>3 × 每侧 10–15</td><td>45–60 秒</td><td>2</td></tr>
</tbody></table>
<h2 align="center">Legs</h2>
<table><thead><tr><th colspan="4">专项准备（约 10–15 分钟）</th></tr><tr><th>#</th><th>动作</th><th>剂量</th><th>目的</th></tr></thead><tbody><tr><td>1</td><td>泡沫轴滚股四头</td><td>每侧 30–45 秒</td><td>仅处理明显紧张区域，不长时间碾压</td></tr><tr><td>2</td><td>90/90 髋切换</td><td>1 × 每侧 6–10</td><td>髋内外旋准备</td></tr><tr><td>3</td><td>墙前踝背屈</td><td>1 × 每侧 10–15</td><td>为深蹲深度准备踝关节</td></tr><tr><td>4</td><td>单片重量坐姿腿弯举</td><td>1 × 12–15</td><td>腘绳肌与膝后侧升温</td></tr><tr><td>5</td><td>杠铃深蹲递增组</td><td>空杆 10–15；50% × 6–8；70% × 3–5；需要时 80% × 1–3</td><td>排练站距、深度与腹压</td></tr></tbody></table>
<table><thead><tr><th>#</th><th>动作</th><th>正式组 × 次数</th><th>休息</th><th>RIR</th></tr></thead><tbody>
<tr><td>1</td><td>杠铃深蹲</td><td>4 × 5–8</td><td>2–3 分钟</td><td>2</td></tr><tr><td>2</td><td>罗马尼亚硬拉</td><td>3 × 6–10</td><td>2–3 分钟</td><td>1–2</td></tr><tr><td>3</td><td>腿屈伸</td><td>3 × 10–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>4</td><td>坐姿腿弯举</td><td>3 × 8–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>5</td><td>杠铃臀推</td><td>3 × 8–12</td><td>90–120 秒</td><td>1–2</td></tr><tr><td>6</td><td>站姿提踵</td><td>3 × 8–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>7</td><td>坐姿提踵</td><td>3 × 12–20</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>8</td><td>死虫式</td><td>2 × 每侧 8–12</td><td>45–60 秒</td><td>动作始终可控</td></tr>
</tbody></table>
<h2 align="center">Push B</h2>
<table><thead><tr><th colspan="4">专项准备（约 8–12 分钟）</th></tr><tr><th>#</th><th>动作</th><th>剂量</th><th>目的</th></tr></thead><tbody><tr><td>1</td><td>侧卧开书式</td><td>1 × 每侧 8–10</td><td>胸椎与胸肩前侧活动</td></tr><tr><td>2</td><td>Y-T-W 肩胛控制</td><td>1 × 每形态 6–8</td><td>下斜方肌、后束与肩袖准备</td></tr><tr><td>3</td><td>单片重量绳索肩推</td><td>1 × 10–15</td><td>轻负荷寻找肩胛上旋轨迹</td></tr><tr><td>4</td><td>上斜哑铃卧推递增组</td><td>轻哑铃 10–12；约 60% × 6–8；约 75% × 3–5</td><td>排练第一正式动作</td></tr></tbody></table>
<table><thead><tr><th>#</th><th>动作</th><th>正式组 × 次数</th><th>休息</th><th>RIR</th></tr></thead><tbody>
<tr><td>1</td><td>上斜哑铃卧推</td><td>4 × 6–10</td><td>2–3 分钟</td><td>1–2</td></tr><tr><td>2</td><td>坐姿哑铃推举</td><td>3 × 6–10</td><td>2 分钟</td><td>1–2</td></tr><tr><td>3</td><td>器械夹胸／绳索夹胸</td><td>3 × 10–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>4</td><td>哑铃侧平举</td><td>4 × 12–20</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>5</td><td>仰卧臂屈伸</td><td>3 × 8–12</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>6</td><td>绳索下压</td><td>2 × 12–20</td><td>60 秒</td><td>0–1</td></tr><tr><td>7</td><td>悬垂举腿</td><td>3 × 8–15</td><td>60–90 秒</td><td>1–2</td></tr>
</tbody></table>
<h2 align="center">Pull B</h2>
<table><thead><tr><th colspan="4">专项准备（约 8–12 分钟）</th></tr><tr><th>#</th><th>动作</th><th>剂量</th><th>目的</th></tr></thead><tbody><tr><td>1</td><td>猫牛式</td><td>1 × 8–12</td><td>脊柱分节活动</td></tr><tr><td>2</td><td>单片重量绳索面拉</td><td>1 × 15–20</td><td>后束、肩袖与上背准备</td></tr><tr><td>3</td><td>单片重量直臂下压</td><td>1 × 12–15</td><td>建立背阔发力感觉</td></tr><tr><td>4</td><td>中立握下拉递增组</td><td>轻重量 12；约 60% × 6–8；约 75% × 3–5</td><td>正式组前保持握力和二头新鲜</td></tr></tbody></table>
<table><thead><tr><th>#</th><th>动作</th><th>正式组 × 次数</th><th>休息</th><th>RIR</th></tr></thead><tbody>
<tr><td>1</td><td>中立握高位下拉</td><td>4 × 8–12</td><td>2 分钟</td><td>1–2</td></tr><tr><td>2</td><td>坐姿绳索划船</td><td>3 × 8–12</td><td>2 分钟</td><td>1–2</td></tr><tr><td>3</td><td>单臂哑铃／绳索划船</td><td>3 × 8–12</td><td>90–120 秒</td><td>1–2</td></tr><tr><td>4</td><td>绳索面拉</td><td>3 × 12–20</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>5</td><td>上斜哑铃弯举</td><td>3 × 8–12</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>6</td><td>锤式弯举</td><td>2 × 10–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>7</td><td>健腹轮</td><td>3 × 6–12</td><td>60–90 秒</td><td>1–2</td></tr>
</tbody></table>

<h2 align="center">执行与优化</h2>
<ul><li><b>递增：</b>先在同一重量下把所有组做到次数上限；仍达到目标 RIR 时，再增加最小重量。加重后从次数下限重新开始。</li><li><b>训练量：</b>胸、背每周约 14–18 个直接工作组；肩和手臂还会从复合动作得到额外刺激，因此不继续盲目加组。</li><li><b>核心：</b>五个训练日都把腹肌放在最后，各做 2–3 组；屈曲、抗旋转、抗伸展和髋屈曲动作轮换。</li><li><b>腿日恢复：</b>一周只练一次腿，当前约 22 个腿臀小腿工作组已经足够。若训练超过 100 分钟，先删臀推 1 组以及两种提踵各 1 组。</li><li><b>时间不足：</b>始终保留当天前两个复合动作；随后优先保留侧平举／后束、手臂各一个动作。先删同功能的第二个孤立动作，但保留末尾腹肌。</li><li><b>传统硬拉：</b>若目标包含硬拉专项力量，可在 Pull A 开头做 2–3 × 3–5，并删除当天一个划船动作；纯增肌不强制加入。</li><li><b>减量：</b>连续两周表现下降、关节持续不适或睡眠与疲劳明显恶化时，用一周把正式组减半、重量降低约 10–15%，并保留 3–4 RIR。</li><li><b>替换：</b>疼痛、器械缺失或连续 3–4 周无法渐进时，换成“肌群与对应动作”中同一肌群的下一优先级动作；不要同时增加动作数量。</li></ul>
`;
const planImages = new Map([
  ["卧推凳胸椎伸展","thoracic-extension-bench"],["单片重量绳索面拉","face-pull"],["单片重量低位夹胸","low-cable-fly"],["杠铃卧推递增组","barbell-bench-press"],
  ["四点跪姿胸椎旋转","quadruped-thoracic-rotation"],["单片重量直臂下压","straight-arm-pulldown"],["单片重量坐姿划船","seated-cable-back-rows"],["引体／下拉递增组","neutral-grip-pulldown"],
  ["泡沫轴滚股四头","custom:foam"],["90/90 髋切换","hip-90-90"],["墙前踝背屈","ankle-dorsiflexion-wall"],["单片重量坐姿腿弯举","seated-leg-curl"],["杠铃深蹲递增组","barbell-squat"],
  ["侧卧开书式","open-book-stretch"],["Y-T-W 肩胛控制","y-t-w-raise"],["单片重量绳索肩推","cable-shoulder-press"],["上斜哑铃卧推递增组","incline-dumbbell-press"],
  ["猫牛式","cat-cow"],["中立握下拉递增组","neutral-grip-pulldown"],
  ["杠铃平板卧推","barbell-bench-press"],["上斜哑铃卧推","incline-dumbbell-press"],["绳索侧平举","cable-lateral-raises"],["绳索过头臂屈伸","cable-overhead-triceps-extension"],["绳索下压","triceps-pushdown"],["绳索卷腹","cable-crunch"],
  ["引体向上／中立握下拉","pull-ups"],["胸托划船／T 杠划船","t-bar-row"],["直臂下拉","straight-arm-pulldown"],["反向飞鸟","reverse-fly"],["牧师凳弯举","preacher-curl"],["锤式弯举","dumbbell-hammer-biceps-curl"],
  ["杠铃深蹲","barbell-squat"],["罗马尼亚硬拉","romanian-deadlift"],["腿屈伸","seated-leg-extensions"],["坐姿腿弯举","seated-leg-curl"],["杠铃臀推","barbell-hip-thrust"],["站姿提踵","standing-calf-raises"],["坐姿提踵","seated-calf-raises"],["死虫式","dead-bug"],
  ["坐姿哑铃推举","seated-dumbbell-overhead-shoulder-press"],["器械夹胸／绳索夹胸","butterflies"],["哑铃侧平举","dumbbell-lateral-raises"],["仰卧臂屈伸","skull-crusher"],
  ["中立握高位下拉","neutral-grip-pulldown"],["坐姿绳索划船","seated-cable-back-rows"],["单臂哑铃／绳索划船","dumbbell-row"],["绳索面拉","face-pull"],["上斜哑铃弯举","incline-dumbbell-curl"],["健腹轮","ab-wheel-rollout"],["Pallof Press","pallof-press"],["悬垂举腿","hanging-leg-raise"],
]);
out = out.replaceAll('<th colspan="4">专项准备', '<th colspan="5">专项准备')
  .replaceAll('<th>动作</th><th>剂量</th>', '<th>动作</th><th>示意图</th><th>剂量</th>')
  .replaceAll('<th>动作</th><th>正式组 × 次数</th>', '<th>动作</th><th>示意图</th><th>正式组 × 次数</th>');
for (const [name, slug] of planImages) {
  const image = slug === "custom:foam" ? "assets/warmup/foam-roll-quadriceps.png" : bySlug.get(slug)?.images.male;
  if (!image) throw new Error(`Missing plan image: ${name} / ${slug}`);
  out = out.replaceAll(`<td>${name}</td><td>`, `<td>${name}</td><td align="center"><img src="${image}" width="180" alt="${name}动作示意图"></td><td>`);
}
out += `<h2 align="center">图片与许可</h2>\n<p>动作插画与动作数据主要来自 <a href="https://marcmayol.com/exercise-api/">Exercise API by Marc Mayol</a>；图库缺少的泡沫轴与筋膜球动作使用同一视觉规范补绘并保存在本项目。解剖定位图统一基于 Ryan Graves 绘制的 <a href="https://github.com/kit-g/flutter-body-atlas">flutter_body_atlas</a> 高精度 SVG 肌肉图谱制作，按 CC BY 4.0 使用；本项目仅改变取景、灰度与目标肌肉高亮。图片仅用于动作辨认与训练规划，不替代医疗建议或现场技术指导。</p>\n`;

const zhNav = `<p align="center"><a href="README.md">English</a> | <b>简体中文</b></p>\n<p align="center"><a href="output/pdf/FIT-Training-Guide-zh-CN.pdf">下载简体中文 PDF</a></p>\n`;
const enNav = `<p align="center"><b>English</b> | <a href="README.zh-CN.md">简体中文</a></p>\n<p align="center"><a href="output/pdf/FIT-Training-Guide-en.pdf">Open / download the English PDF</a></p>\n`;
const chinese = out.replace("<h1 align=\"center\">", `${zhNav}<h1 align="center">`);

const translations = new Map(Object.entries({
  "FIT：肌群动作库、热身与五练 PPL":"FIT: Muscle Exercise Library, Warm-ups, and 5-Day PPL",
  "肌群与对应动作":"Muscles and Recommended Exercises",
  "肩膀":"Shoulders","胸":"Chest","手臂":"Arms","背":"Back","腿与臀":"Legs and Glutes","核心":"Core",
  "三角肌前束":"Anterior Deltoid","三角肌中束":"Lateral Deltoid","三角肌后束":"Posterior Deltoid",
  "胸大肌锁骨部（上胸）":"Clavicular Pectoralis Major (Upper Chest)","胸大肌胸肋部（整体／中部偏重）":"Sternocostal Pectoralis Major (Mid Chest Bias)","胸大肌胸肋部下方纤维偏重":"Lower Sternocostal Pectoralis Major",
  "肱二头肌":"Biceps Brachii","肱肌／肱桡肌":"Brachialis / Brachioradialis","肱三头长头":"Triceps Long Head","肱三头外侧头／内侧头":"Triceps Lateral / Medial Heads",
  "背阔肌／大圆肌（背宽）":"Latissimus Dorsi / Teres Major (Back Width)","斜方肌中下束／菱形肌（背厚）":"Mid-Lower Trapezius / Rhomboids (Back Thickness)","斜方肌上束":"Upper Trapezius","竖脊肌／腰背稳定肌":"Erector Spinae / Lumbar Stabilizers",
  "股四头肌":"Quadriceps","腘绳肌":"Hamstrings","臀大肌":"Gluteus Maximus","臀中肌／髋外展肌群":"Gluteus Medius / Hip Abductors","髋内收肌群":"Hip Adductors","腓肠肌":"Gastrocnemius","比目鱼肌":"Soleus",
  "腹直肌":"Rectus Abdominis","腹斜肌／抗旋转":"Obliques / Anti-Rotation","深层核心／抗伸展":"Deep Core / Anti-Extension",
  "第二节：专项准备动作库":"Section 2: Targeted Warm-up Library","第三节：五练 PPL 计划":"Section 3: 5-Day PPL Plan",
  "胸椎／上背":"Thoracic Spine / Upper Back","肩胛／肩袖":"Scapula / Rotator Cuff","胸肩前侧":"Anterior Chest / Shoulder","背阔／肩胛下沉":"Lats / Scapular Depression","髋关节／臀部":"Hips / Glutes","股四头／膝关节":"Quadriceps / Knees","腘绳肌／髋铰链":"Hamstrings / Hip Hinge","踝关节／小腿":"Ankles / Calves","核心／腰椎稳定":"Core / Lumbar Stability",
  "综合首选：稳定、易渐进且目标肌肉受力明确":"Top choice: stable, easy to progress, and clear target-muscle loading","优先替代：兼顾刺激与训练舒适度":"Preferred alternative: balances stimulus and comfort","器械或动作偏好不同时的可靠选择":"Reliable option when equipment or exercise preference differs","用于补充不同阻力曲线或训练角度":"Adds a different resistance curve or training angle",
  "建议：":"Prescription: ","组间休息：":"Rest: ","主要：":"Primary: ","次要：":"Secondary: ","定位：":"Why: ",
  "器材：":"Equipment: ","剂量：":"Dose: ","强度：":"Intensity: ","作用：":"Purpose: ",
  "全程轻松，不出现力竭或明显灼烧":"Keep it easy; no failure or significant burn","改善该区域活动度、控制或主动作感觉":"Improve mobility, control, or movement feel in this region",
  "本节只用于按区域查动作：优先收录瑜伽垫动态活动、泡沫轴／筋膜球、弹力带、龙门架单片重量和空杆动作。一次训练从相关行选择少量动作即可，不需要整行全部完成。":"Use this section to find warm-ups by region. It prioritizes mat-based dynamic work, foam rollers or massage balls, bands, single-plate cable work, and empty-bar drills. Select only a few relevant movements per session.",
  "周结构为 Push A / Pull A / Legs / 休息 / Push B / Pull B / 休息。两个 Push 和两个 Pull 保留必要的高收益重复动作，不为追求花样强行完全错开。":"Weekly structure: Push A / Pull A / Legs / Rest / Push B / Pull B / Rest. The two Push and Pull sessions intentionally retain productive overlap instead of forcing unnecessary variation.",
  "图片与许可":"Images and Licensing",
  "动作插画与动作数据主要来自 ":"Exercise illustrations and exercise data primarily come from ","；图库缺少的泡沫轴与筋膜球动作使用同一视觉规范补绘并保存在本项目。解剖定位图统一基于 Ryan Graves 绘制的 ":". Missing foam-roller and massage-ball illustrations were added locally using the same visual conventions. Anatomy maps are consistently based on Ryan Graves' "," 高精度 SVG 肌肉图谱制作，按 CC BY 4.0 使用；本项目仅改变取景、灰度与目标肌肉高亮。图片仅用于动作辨认与训练规划，不替代医疗建议或现场技术指导。":" high-detail SVG muscle atlas under CC BY 4.0; this project changes only framing, grayscale treatment, and target-muscle highlighting. Images support exercise recognition and planning and do not replace medical advice or in-person coaching.",
  "执行与优化":"Execution and Progression","专项准备（约 8–12 分钟）":"Targeted warm-up (about 8-12 min)","专项准备（约 10–15 分钟）":"Targeted warm-up (about 10-15 min)",
  "腹部／核心收尾安排":"Ab / Core Finisher Rotation","五个训练日均在力量动作之后训练核心，每次只做一个方向，避免把腹部训练堆成影响复合动作恢复的高疲劳模块。":"Train core after the strength work on all five training days. Use one emphasis per session to avoid turning ab work into a high-fatigue block that interferes with compound-lift recovery.",
  "训练日":"Training Day","核心动作":"Core Exercise","训练方向":"Training Emphasis","负重脊柱屈曲":"Loaded spinal flexion","抗旋转":"Anti-rotation","低疲劳抗伸展":"Low-fatigue anti-extension","骨盆后倾／髋屈控制":"Posterior pelvic tilt / hip-flexion control","高张力抗伸展":"High-tension anti-extension",
  "动作":"Exercise","示意图":"Illustration","剂量":"Dose","目的":"Purpose","正式组 × 次数":"Working Sets x Reps","休息":"Rest","重点":"Focus","训练":"Training","日程":"Day","建议":"Prescription","Leg extension机":"Leg extension machine"
  ,"周一":"Monday","周二":"Tuesday","周三":"Wednesday","周四":"Thursday","周五":"Friday","周六":"Saturday","周日":"Sunday","恢复":"Recovery","恢复、散步或轻度活动":"Recovery, walking, or light activity"
  ,"平板卧推＋肩中束＋三头长头":"Flat bench press + lateral delts + triceps long head","垂直拉＋背厚＋二头":"Vertical pull + back thickness + biceps","股四、腘绳、臀、小腿完整覆盖":"Complete quadriceps, hamstring, glute, and calf coverage","上胸＋肩推＋三头":"Upper chest + shoulder press + triceps","背阔肌＋上背＋后束＋二头":"Lats + upper back + rear delts + biceps"
  ,"瑜伽垫":"Exercise mat","瑜伽垫／卧推凳":"Exercise mat / bench","瑜伽垫／上斜凳":"Exercise mat / incline bench","瑜伽垫／弹力带":"Exercise mat / resistance band","泡沫轴＋瑜伽垫":"Foam roller + exercise mat","龙门架":"Cable station","龙门架／弹力带":"Cable station / resistance band","龙门架／反向蝴蝶机":"Cable station / reverse pec deck","门框／立柱":"Doorframe / upright","高位下拉器":"Lat pulldown machine","腿屈伸机":"Leg extension machine","腿弯举机":"Leg curl machine","哑铃／壶铃":"Dumbbell / kettlebell","深蹲架":"Squat rack","空杆":"Empty bar","木棍／PVC 杆":"Dowel / PVC pipe","墙面":"Wall","墙面／弹力带":"Wall / resistance band","台阶／地面":"Step / floor","筋膜球／网球":"Massage ball / tennis ball"
  ,"打开胸椎伸展位":"Open thoracic extension","肩袖与肩胛控制":"Rotator-cuff and scapular control","建立胸肌收缩感觉":"Establish chest contraction","排练正式动作，均远离力竭":"Practice the working movement well away from failure","恢复胸椎旋转":"Restore thoracic rotation","背阔与肩胛下沉":"Lat engagement and scapular depression","上背后缩控制":"Upper-back retraction control","正式组前保持二头和握力新鲜":"Keep biceps and grip fresh before working sets","仅处理明显紧张区域，不长时间碾压":"Address only clearly tight areas; do not roll for long periods","髋内外旋准备":"Prepare hip internal and external rotation","为深蹲深度准备踝关节":"Prepare ankle mobility for squat depth","腘绳肌与膝后侧升温":"Warm the hamstrings and posterior knee","排练站距、深度与腹压":"Practice stance, depth, and bracing","胸椎与胸肩前侧活动":"Mobilize the thoracic spine and anterior chest/shoulder","下斜方肌、后束与肩袖准备":"Prepare lower traps, rear delts, and rotator cuff","轻负荷寻找肩胛上旋轨迹":"Find a smooth scapular upward-rotation path under light load","排练第一正式动作":"Practice the first working exercise","脊柱分节活动":"Segmental spinal mobility","后束、肩袖与上背准备":"Prepare rear delts, rotator cuff, and upper back","建立背阔发力感觉":"Establish lat engagement","正式组前保持握力和二头新鲜":"Keep grip and biceps fresh before working sets","动作始终可控":"Keep every rep controlled"
  ,"空杆 10–15；50% × 6–8；70% × 3–5；需要时 80% × 1–3":"Empty bar 10-15; 50% x 6-8; 70% x 3-5; if needed, 80% x 1-3","轻重量 12；约 60% × 6–8；约 75% × 3–5":"Light load x 12; about 60% x 6-8; about 75% x 3-5","轻哑铃 10–12；约 60% × 6–8；约 75% × 3–5":"Light dumbbells x 10-12; about 60% x 6-8; about 75% x 3-5","1 × 每形态 6–10":"1 x 6-10 per position","1 × 每形态 6–8":"1 x 6-8 per position"
  ,"递增：":"Progression:","训练量：":"Training volume:","核心：":"Core:","腿日恢复：":"Leg-day recovery:","时间不足：":"When short on time:","传统硬拉：":"Conventional deadlift:","减量：":"Deload:","替换：":"Substitutions:"
  ,"先在同一重量下把所有组做到次数上限；仍达到目标 RIR 时，再增加最小重量。加重后从次数下限重新开始。":"First reach the top of the rep range on every set at the same load. If you still meet the target RIR, add the smallest available increment and restart at the bottom of the range.","胸、背每周约 14–18 个直接工作组；肩和手臂还会从复合动作得到额外刺激，因此不继续盲目加组。":"Chest and back receive about 14-18 direct working sets per week. Shoulders and arms also receive compound-exercise stimulus, so do not add volume blindly.","五个训练日都把腹肌放在最后，各做 2–3 组；屈曲、抗旋转、抗伸展和髋屈曲动作轮换。":"Finish all five training days with 2-3 core sets, rotating flexion, anti-rotation, anti-extension, and hip-flexion patterns.","一周只练一次腿，当前约 22 个腿臀小腿工作组已经足够。若训练超过 100 分钟，先删臀推 1 组以及两种提踵各 1 组。":"With one leg day per week, about 22 current leg, glute, and calf sets are enough. If the session exceeds 100 minutes, remove one hip-thrust set and one set from each calf exercise.","始终保留当天前两个复合动作；随后优先保留侧平举／后束、手臂各一个动作。先删同功能的第二个孤立动作，但保留末尾腹肌。":"Always retain the first two compound exercises. Then keep one lateral-delt or rear-delt movement and one arm movement. Remove the second isolation exercise with the same function first, but keep the final core exercise.","若目标包含硬拉专项力量，可在 Pull A 开头做 2–3 × 3–5，并删除当天一个划船动作；纯增肌不强制加入。":"For deadlift-specific strength, perform 2-3 x 3-5 at the start of Pull A and remove one rowing exercise that day. It is optional for a hypertrophy-only goal.","连续两周表现下降、关节持续不适或睡眠与疲劳明显恶化时，用一周把正式组减半、重量降低约 10–15%，并保留 3–4 RIR。":"After two weeks of declining performance, persistent joint discomfort, or clearly worse sleep and fatigue, take one week at half the working sets, about 10-15% less load, and 3-4 RIR.","疼痛、器械缺失或连续 3–4 周无法渐进时，换成“肌群与对应动作”中同一肌群的下一优先级动作；不要同时增加动作数量。":"When pain, unavailable equipment, or 3-4 weeks without progression occurs, switch to the next-ranked exercise for the same muscle in the exercise library. Do not increase the number of exercises at the same time."
}));

let english = out;
english = english.replace(/<th>#(\d+) [^<]+<br><sub>([^<]+)<\/sub><\/th>/g, "<th>#$1 $2</th>");
english = english.replace(/alt="[^"]+"/g, 'alt="Exercise or anatomy illustration"');
for (const [name, slug] of planImages) {
  const en = slug === "custom:foam" ? "Foam-roll quadriceps" : bySlug.get(slug)?.name.en;
  if (en) english = english.replaceAll(name, en);
}
for (const [from, to] of [...translations].sort((a,b) => b[0].length - a[0].length)) english = english.replaceAll(from, to);
english = english
  .replaceAll("泡沫轴滚股四头", "Foam-roll quadriceps")
  .replaceAll("足底筋膜球滚动", "Massage-ball plantar fascia roll")
  .replace(/(\d+(?:–\d+)?) 组/g, "$1 sets")
  .replaceAll(" 秒", " sec").replaceAll(" 分钟", " min").replaceAll("每侧", "each side").replaceAll("约 ", "about ")
  .replace("<h1 align=\"center\">", `${enNav}<h1 align="center">`);

fs.writeFileSync("README.zh-CN.md", chinese);
fs.writeFileSync("README.md", english);
