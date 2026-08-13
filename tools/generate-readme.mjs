import fs from "node:fs";

const base = "https://marcmayol.com/exercise-api";
const catalog = await fetch(`${base}/v1/dataset.json`).then((r) => r.json());
const bySlug = new Map(catalog.exercises.map((x) => [x.slug, x]));

const medical = {
  "三角肌前束": { ids:["FMA34677"], view:"front" },
  "三角肌中束": { ids:["FMA34678"], view:"front" },
  "三角肌后束": { ids:["FMA34679"], view:"back" },
  "胸大肌锁骨部（上胸）": { ids:["FMA34687"], view:"front" },
  "胸大肌胸肋部（整体／中部偏重）": { ids:["FMA34696"], view:"front" },
  "胸大肌胸肋部下方纤维偏重": { ids:["FMA34699"], view:"front" },
  "肱二头肌": { ids:["FMA37682","FMA37683"], view:"front" },
  "肱肌／肱桡肌": { ids:["FMA37667","FMA38485"], view:"front" },
  "肱三头长头": { ids:["FMA37692"], view:"back" },
  "肱三头外侧头／内侧头": { ids:["FMA37693","FMA37694"], view:"back" },
  "斜方肌中下束／菱形肌（背厚）": { ids:["FMA32555","FMA32556","FMA13379","FMA13380"], view:"back" },
  "斜方肌上束": { ids:["FMA32557"], view:"back" },
  "股四头肌": { ids:["FMA22430","FMA22431","FMA22432","FMA22433"], view:"front" },
  "腘绳肌": { ids:["FMA22357","FMA22438","FMA45887","FMA45890"], view:"back" },
  "臀大肌": { ids:["FMA22314"], view:"back" },
  "臀中肌／髋外展肌群": { ids:["FMA22315","FMA22317"], view:"back" },
  "髋内收肌群": { ids:["FMA22441","FMA22442","FMA22443"], view:"front" },
  "腓肠肌": { ids:["FMA45956","FMA45959"], view:"back" },
  "比目鱼肌": { ids:["FMA22542"], view:"back" },
  "腹斜肌／抗旋转": { ids:["FMA13335"], view:"front" },
};

const anatomyDir = "assets/anatomy-medical";
fs.mkdirSync(anatomyDir, { recursive: true });
const safeName = (s) => [...s].map((c) => /[A-Za-z0-9]/.test(c) ? c : `u${c.codePointAt(0).toString(16)}`).join("-");
for (const [group, spec] of Object.entries(medical)) {
  const config = {
    Window:{ImageWidth:900,ImageHeight:900,BackgroundColor:"FFFFFF",BackgroundOpacity:100},
    Camera:{CameraMode:spec.view},
    Part:spec.ids.map((PartID) => ({PartID,PartColor:"DC2626",PartOpacity:1})),
  };
  const url = `https://lifesciencedb.jp/bp3d/API/image?${encodeURIComponent(JSON.stringify(config))}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Anatomography ${response.status}: ${group}`);
  fs.writeFileSync(`${anatomyDir}/${safeName(group)}.png`, Buffer.from(await response.arrayBuffer()));
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
const cards = (actions, group) => `<table><tbody><tr>${actions.map(([slug, zh], i) => {
  const ex = bySlug.get(slug); if (!ex) throw new Error(`Missing exercise: ${slug}`);
  const pri = ex.primaryMuscles.map((m) => m.en).join("、");
  const sec = ex.secondaryMuscles.map((m) => m.en).join("、") || "—";
  const anatomy = medical[group] ? `${anatomyDir}/${safeName(group)}.png` : ex.muscleMaps.male;
  return `<td width="25%" valign="top"><table><tbody><tr><th>#${i+1} ${esc(zh)}<br><sub>${esc(ex.name.en)}</sub></th></tr><tr><td align="center"><img src="${ex.images.male}" width="250" alt="${esc(zh)}动作起止位"></td></tr><tr><td align="center"><img src="${anatomy}" width="160" alt="${esc(group)}医学解剖图"></td></tr><tr><td><b>主要：</b>${esc(pri)}<br><b>次要：</b>${esc(sec)}</td></tr></tbody></table></td>`;
}).join("")}</tr></tbody></table>`;

let out = `# FIT：按精确肌群选择动作\n\n> 每个外层表格的一行对应一个精确肌群；行内动作按推荐优先级从左到右排列。每张动作图已经同时展示起始位与结束位，下方肌肉图用深色表示主要刺激、浅色表示次要参与。\n\n`;
for (const [section, groups] of sections) {
  out += `<h2>${section}</h2>\n<table><thead><tr><th width="15%">精确肌群</th><th>动作（按优先级）</th></tr></thead><tbody>\n`;
  for (const [group, actions] of groups) out += `<tr><th valign="top">${group}</th><td>${cards(actions, group)}</td></tr>\n`;
  out += `</tbody></table>\n\n`;
}
out += `<h2>图片与许可</h2>\n<p>动作插画与动作数据来自 <a href="https://marcmayol.com/exercise-api/">Exercise API by Marc Mayol</a>。医学解剖图由 <a href="https://lifesciencedb.jp/bp3d/">BodyParts3D / Anatomography</a> 渲染，并根据 FMA 解剖标识将目标肌肉标红；BodyParts3D © The Database Center for Life Science，按 CC BY-SA 2.1 Japan 使用。源模型暂不具备的结构保留 Exercise API 肌肉图。图片仅用于动作辨认与训练规划，不替代医疗建议或现场技术指导。</p>\n`;
fs.writeFileSync("README.md", out);
