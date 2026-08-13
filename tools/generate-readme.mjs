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
    Part:[
      {PartID:"FMA5018",PartColor:"CBD5E1",PartOpacity:0.22},
      {PartID:"FMA5022",PartColor:"D1D5DB",PartOpacity:0.18},
      ...spec.ids.map((PartID) => ({PartID,PartColor:"DC2626",PartOpacity:1})),
    ],
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
const cards = (actions, group) => `<table><tbody><tr>${actions.map(([slug, zh], i) => {
  const ex = bySlug.get(slug); if (!ex) throw new Error(`Missing exercise: ${slug}`);
  const pri = ex.primaryMuscles.map((m) => m.en).join("、");
  const sec = ex.secondaryMuscles.map((m) => m.en).join("、") || "—";
  const [sets,reps,rest] = prescription(slug);
  return `<td width="25%" valign="top"><table><tbody><tr><th>#${i+1} ${esc(zh)}<br><sub>${esc(ex.name.en)}</sub></th></tr><tr><td align="center"><img src="${ex.images.male}" width="250" alt="${esc(zh)}动作起止位"></td></tr><tr><td><b>建议：</b>${sets} 组 × ${reps}<br><b>组间休息：</b>${rest}<br><b>主要：</b>${esc(pri)}<br><b>次要：</b>${esc(sec)}<br><b>定位：</b>${reasons[i] ?? reasons[3]}</td></tr></tbody></table></td>`;
}).join("")}</tr></tbody></table>`;

let out = `# FIT：肌群动作库、热身与五练 PPL

## 第零节：怎么看这份计划

| 标记 | 含义 |
|---|---|
| 解剖图红色 | 当前行的目标肌肉 |
| 解剖图灰色 | 骨骼与周围肌肉的位置参照 |
| #1 → #4 | 动作综合推荐顺序；按需选用，不是把同行全部做完 |
| 工作组 | 真正用于记录和渐进的正式组；递增热身组不计算在内 |
| RIR | 一组结束时估计还能规范完成的次数；例如 2 RIR 表示还能再做约 2 次 |

# 第一节：精确肌群与动作库

`;
for (const [section, groups] of sections) {
  out += `<h2>${section}</h2>\n<table><thead><tr><th width="12%">精确肌群</th><th width="14%">解剖定位</th><th>动作（按优先级）</th></tr></thead><tbody>\n`;
  for (const [group, actions] of groups) {
    const anatomy = medical[group] ? `${anatomyDir}/${safeName(group)}.png` : bySlug.get(actions[0][0]).muscleMaps.male;
    out += `<tr><th valign="top">${group}</th><td valign="top" align="center"><img src="${anatomy}" width="190" alt="${esc(group)}解剖定位图"></td><td>${cards(actions, group)}</td></tr>\n`;
  }
  out += `</tbody></table>\n\n`;
}
out += `<h1>第二节：热身动作库与每日热身</h1>
<p>热身目标是升温、活动当天关节并排练第一个主动作，不是提前练到疲劳。全程约 8–15 分钟；出现疼痛时停止并更换动作。</p>
<table><thead><tr><th>区域／目的</th><th>动作与器械</th><th>剂量</th><th>休息与要点</th></tr></thead><tbody>
<tr><th>全身升温</th><td>自行车、划船机、椭圆机或坡度走</td><td>1 轮 × 4–6 分钟</td><td>无需休息；逐渐加速，到身体发热但仍能完整说话</td></tr>
<tr><th>肩袖</th><td>弹力带或绳索外旋</td><td>1–2 × 每侧 12–15</td><td>30–45 秒；肘部固定，不追求大重量</td></tr>
<tr><th>肩胛控制</th><td>肩胛俯卧撑、轻重量面拉</td><td>各 1 × 10–15</td><td>30–45 秒；主动完成前伸、后缩和上旋</td></tr>
<tr><th>胸肩推举</th><td>轻重量夹胸或空杆推举</td><td>1 × 12–15</td><td>约 45 秒；只用于寻找轨迹</td></tr>
<tr><th>背部拉力</th><td>轻重量直臂下压、轻重量划船</td><td>各 1 × 12–15</td><td>约 45 秒；先做肩胛动作，再屈肘</td></tr>
<tr><th>髋部</th><td>髋外展机、髋内收机、臀桥</td><td>各 1 × 12–15</td><td>30–45 秒；轻重量、完整可控幅度</td></tr>
<tr><th>膝部</th><td>轻重量腿屈伸、腿弯举、徒手深蹲</td><td>各 1 × 10–15</td><td>30–45 秒；不做到灼烧或力竭</td></tr>
<tr><th>踝部</th><td>负重踝背屈、慢速徒手提踵</td><td>各 1 × 每侧 10–15</td><td>30 秒；脚跟不离地完成踝背屈</td></tr>
<tr><th>专项递增组</th><td>当天第一个复合动作</td><td>极轻重量 10–15；40–50% × 6–8；60–70% × 3–5；需要时 75–85% × 1–3</td><td>45–120 秒；百分比按当天工作重量估算，所有组都远离力竭</td></tr>
</tbody></table>

<h2>五个训练日的热身流程</h2>
<table><thead><tr><th>训练日</th><th>顺序</th><th>完成标准</th></tr></thead><tbody>
<tr><th>Push A</th><td>自行车／椭圆机 4–5 分钟 → 绳索外旋 1–2 × 12–15／侧 → 肩胛俯卧撑 1 × 10–15 → 杠铃卧推递增 3–4 组</td><td>肩关节活动顺畅，卧推工作重量前无局部疲劳</td></tr>
<tr><th>Pull A</th><td>划船机 4–5 分钟 → 轻直臂下压 1 × 15 → 肩胛下沉 1–2 × 8–12 → 引体或下拉递增 2–3 组</td><td>能够先下沉肩胛，再开始屈肘拉动</td></tr>
<tr><th>Legs</th><td>自行车 5 分钟 → 髋内收、外展机各 1 × 15 → 轻腿弯举 1 × 15 → 踝背屈 1 × 10／侧 → 深蹲递增 3–4 组</td><td>髋、膝、踝均无卡顿，深蹲深度自然稳定</td></tr>
<tr><th>Push B</th><td>椭圆机 4–5 分钟 → 绳索外旋 1–2 × 12–15／侧 → 轻侧平举 1 × 15 → 上斜哑铃卧推递增 2–3 组</td><td>肩袖已激活但侧平举不产生灼烧感</td></tr>
<tr><th>Pull B</th><td>划船机 4–5 分钟 → 轻划船 1 × 15 → 轻面拉 1 × 15 → 中立握下拉递增 2–3 组</td><td>上背发热，正式组前握力和肱二头保持新鲜</td></tr>
</tbody></table>

<h1>第三节：五练 PPL 计划</h1>
<p>周结构为 Push A / Pull A / Legs / 休息 / Push B / Pull B / 休息。先完成上方对应热身；下表只记录正式工作组。</p>
<table><thead><tr><th>日程</th><th>训练</th><th>重点</th></tr></thead><tbody>
<tr><td>周一</td><td>Push A</td><td>平板卧推＋肩中束＋三头长头</td></tr><tr><td>周二</td><td>Pull A</td><td>垂直拉＋背厚＋二头</td></tr><tr><td>周三</td><td>Legs</td><td>股四、腘绳、臀、小腿完整覆盖</td></tr><tr><td>周四</td><td>休息</td><td>恢复、散步或轻度活动</td></tr><tr><td>周五</td><td>Push B</td><td>上胸＋肩推＋三头</td></tr><tr><td>周六</td><td>Pull B</td><td>背阔肌＋上背＋后束＋二头</td></tr><tr><td>周日</td><td>休息</td><td>恢复</td></tr>
</tbody></table>

<h2>Push A</h2>
<table><thead><tr><th>#</th><th>动作</th><th>正式组 × 次数</th><th>休息</th><th>RIR</th></tr></thead><tbody>
<tr><td>1</td><td>杠铃平板卧推</td><td>4 × 5–8</td><td>2–3 分钟</td><td>2</td></tr><tr><td>2</td><td>上斜哑铃卧推</td><td>3 × 8–12</td><td>2 分钟</td><td>1–2</td></tr><tr><td>3</td><td>绳索侧平举</td><td>4 × 12–20</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>4</td><td>绳索过头臂屈伸</td><td>3 × 10–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>5</td><td>绳索下压</td><td>2 × 10–15</td><td>60–90 秒</td><td>0–1</td></tr><tr><td>6</td><td>绳索卷腹</td><td>3 × 10–15</td><td>60 秒</td><td>1–2</td></tr>
</tbody></table>
<h2>Pull A</h2>
<table><thead><tr><th>#</th><th>动作</th><th>正式组 × 次数</th><th>休息</th><th>RIR</th></tr></thead><tbody>
<tr><td>1</td><td>引体向上／中立握下拉</td><td>4 × 6–10</td><td>2 分钟</td><td>1–2</td></tr><tr><td>2</td><td>胸托划船／T 杠划船</td><td>4 × 6–12</td><td>2 分钟</td><td>1–2</td></tr><tr><td>3</td><td>直臂下拉</td><td>3 × 10–15</td><td>60–90 秒</td><td>1–2</td></tr><tr><td>4</td><td>反向飞鸟</td><td>3 × 12–20</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>5</td><td>牧师凳弯举</td><td>3 × 8–12</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>6</td><td>锤式弯举</td><td>2 × 10–15</td><td>60–90 秒</td><td>0–2</td></tr>
</tbody></table>
<h2>Legs</h2>
<table><thead><tr><th>#</th><th>动作</th><th>正式组 × 次数</th><th>休息</th><th>RIR</th></tr></thead><tbody>
<tr><td>1</td><td>杠铃深蹲</td><td>4 × 5–8</td><td>2–3 分钟</td><td>2</td></tr><tr><td>2</td><td>罗马尼亚硬拉</td><td>3 × 6–10</td><td>2–3 分钟</td><td>1–2</td></tr><tr><td>3</td><td>腿屈伸</td><td>3 × 10–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>4</td><td>坐姿腿弯举</td><td>3 × 8–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>5</td><td>杠铃臀推</td><td>3 × 8–12</td><td>90–120 秒</td><td>1–2</td></tr><tr><td>6</td><td>站姿提踵</td><td>3 × 8–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>7</td><td>坐姿提踵</td><td>3 × 12–20</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>8</td><td>死虫式</td><td>2 × 每侧 8–12</td><td>45–60 秒</td><td>动作始终可控</td></tr>
</tbody></table>
<h2>Push B</h2>
<table><thead><tr><th>#</th><th>动作</th><th>正式组 × 次数</th><th>休息</th><th>RIR</th></tr></thead><tbody>
<tr><td>1</td><td>上斜哑铃卧推</td><td>4 × 6–10</td><td>2–3 分钟</td><td>1–2</td></tr><tr><td>2</td><td>坐姿哑铃推举</td><td>3 × 6–10</td><td>2 分钟</td><td>1–2</td></tr><tr><td>3</td><td>器械夹胸／绳索夹胸</td><td>3 × 10–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>4</td><td>哑铃侧平举</td><td>4 × 12–20</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>5</td><td>仰卧臂屈伸</td><td>3 × 8–12</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>6</td><td>绳索下压</td><td>2 × 12–20</td><td>60 秒</td><td>0–1</td></tr>
</tbody></table>
<h2>Pull B</h2>
<table><thead><tr><th>#</th><th>动作</th><th>正式组 × 次数</th><th>休息</th><th>RIR</th></tr></thead><tbody>
<tr><td>1</td><td>中立握高位下拉</td><td>4 × 8–12</td><td>2 分钟</td><td>1–2</td></tr><tr><td>2</td><td>坐姿绳索划船</td><td>3 × 8–12</td><td>2 分钟</td><td>1–2</td></tr><tr><td>3</td><td>单臂哑铃／绳索划船</td><td>3 × 8–12</td><td>90–120 秒</td><td>1–2</td></tr><tr><td>4</td><td>绳索面拉</td><td>3 × 12–20</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>5</td><td>上斜哑铃弯举</td><td>3 × 8–12</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>6</td><td>锤式弯举</td><td>2 × 10–15</td><td>60–90 秒</td><td>0–2</td></tr><tr><td>7</td><td>健腹轮</td><td>3 × 6–12</td><td>60–90 秒</td><td>1–2</td></tr>
</tbody></table>

<h2>执行与优化</h2>
<ul><li><b>递增：</b>先在同一重量下把所有组做到次数上限；仍达到目标 RIR 时，再增加最小重量。加重后从次数下限重新开始。</li><li><b>训练量：</b>胸、背每周约 14–18 个直接工作组；肩和手臂还会从复合动作得到额外刺激，因此不继续盲目加组。</li><li><b>核心：</b>固定安排在 Push A、Legs、Pull B 末尾；不需要每天高量训练腹部。</li><li><b>腿日恢复：</b>一周只练一次腿，当前约 22 个腿臀小腿工作组已经足够。若训练超过 100 分钟，先删臀推 1 组以及两种提踵各 1 组。</li><li><b>时间不足：</b>始终保留当天前两个复合动作；随后优先保留侧平举／后束、手臂各一个动作。先删同功能的第二个孤立动作。</li><li><b>传统硬拉：</b>若目标包含硬拉专项力量，可在 Pull A 开头做 2–3 × 3–5，并删除当天一个划船动作；纯增肌不强制加入。</li><li><b>减量：</b>连续两周表现下降、关节持续不适或睡眠与疲劳明显恶化时，用一周把正式组减半、重量降低约 10–15%，并保留 3–4 RIR。</li><li><b>替换：</b>疼痛、器械缺失或连续 3–4 周无法渐进时，换成第一节同一肌群的下一优先级动作；不要同时增加动作数量。</li></ul>
`;
out += `<h2>图片与许可</h2>\n<p>动作插画与动作数据来自 <a href="https://marcmayol.com/exercise-api/">Exercise API by Marc Mayol</a>。医学解剖图由 <a href="https://lifesciencedb.jp/bp3d/">BodyParts3D / Anatomography</a> 渲染，并根据 FMA 解剖标识将目标肌肉标红；BodyParts3D © The Database Center for Life Science，按 CC BY-SA 2.1 Japan 使用。源模型暂不具备的结构保留 Exercise API 肌肉图。图片仅用于动作辨认与训练规划，不替代医疗建议或现场技术指导。</p>\n`;
fs.writeFileSync("README.md", out);
