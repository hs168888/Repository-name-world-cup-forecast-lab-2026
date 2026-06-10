const externalData = window.WORLD_CUP_DATA ?? {};
const groups = externalData.groups ?? {
  A: ["墨西哥", "南非", "韩国", "捷克"],
  B: ["加拿大", "瑞士", "卡塔尔", "波黑"],
  C: ["巴西", "摩洛哥", "海地", "苏格兰"],
  D: ["美国", "巴拉圭", "澳大利亚", "土耳其"],
  E: ["德国", "库拉索", "科特迪瓦", "厄瓜多尔"],
  F: ["荷兰", "日本", "突尼斯", "瑞典"],
  G: ["比利时", "埃及", "伊朗", "新西兰"],
  H: ["西班牙", "佛得角", "沙特阿拉伯", "乌拉圭"],
  I: ["法国", "塞内加尔", "挪威", "伊拉克"],
  J: ["阿根廷", "阿尔及利亚", "奥地利", "约旦"],
  K: ["葡萄牙", "乌兹别克斯坦", "哥伦比亚", "刚果民主共和国"],
  L: ["英格兰", "克罗地亚", "加纳", "巴拿马"]
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const fifaRanks = externalData.fifaRanks ?? {
  法国: 1,
  西班牙: 2,
  阿根廷: 3,
  英格兰: 4,
  葡萄牙: 5,
  巴西: 6,
  荷兰: 7,
  摩洛哥: 8,
  比利时: 9,
  德国: 10,
  克罗地亚: 11,
  哥伦比亚: 13,
  塞内加尔: 14,
  墨西哥: 15,
  美国: 16,
  乌拉圭: 17,
  日本: 18,
  瑞士: 19,
  伊朗: 21,
  土耳其: 22,
  厄瓜多尔: 23,
  奥地利: 24,
  韩国: 25,
  澳大利亚: 27,
  阿尔及利亚: 28,
  埃及: 29,
  加拿大: 30,
  挪威: 31,
  巴拿马: 33,
  科特迪瓦: 34,
  瑞典: 38,
  巴拉圭: 40,
  捷克: 41,
  苏格兰: 43,
  突尼斯: 44,
  刚果民主共和国: 46,
  乌兹别克斯坦: 50,
  卡塔尔: 55,
  伊拉克: 57,
  南非: 60,
  沙特阿拉伯: 61,
  约旦: 63,
  波黑: 65,
  佛得角: 69,
  加纳: 74,
  库拉索: 82,
  海地: 83,
  新西兰: 85
};

const hostTeams = new Set(externalData.hostTeams ?? ["墨西哥", "加拿大", "美国"]);
const countryCodes = externalData.countryCodes ?? {};
const fixtureTemplate = externalData.fixtureTemplate ?? [];
const teamOverrides = externalData.teamOverrides ?? {};
const confedMap = externalData.confedMap ?? {
  墨西哥: "CONCACAF",
  加拿大: "CONCACAF",
  美国: "CONCACAF",
  库拉索: "CONCACAF",
  海地: "CONCACAF",
  巴拿马: "CONCACAF",
  巴西: "CONMEBOL",
  阿根廷: "CONMEBOL",
  哥伦比亚: "CONMEBOL",
  乌拉圭: "CONMEBOL",
  厄瓜多尔: "CONMEBOL",
  巴拉圭: "CONMEBOL",
  韩国: "AFC",
  卡塔尔: "AFC",
  日本: "AFC",
  伊朗: "AFC",
  沙特阿拉伯: "AFC",
  伊拉克: "AFC",
  乌兹别克斯坦: "AFC",
  约旦: "AFC",
  澳大利亚: "AFC",
  摩洛哥: "CAF",
  南非: "CAF",
  科特迪瓦: "CAF",
  突尼斯: "CAF",
  埃及: "CAF",
  塞内加尔: "CAF",
  佛得角: "CAF",
  阿尔及利亚: "CAF",
  加纳: "CAF",
  刚果民主共和国: "CAF",
  新西兰: "OFC"
};

const knockoutMap = externalData.knockoutMap ?? [
  { match: 73, date: "6月28日", slotA: "A组第2", slotB: "B组第2", next: 90 },
  { match: 74, date: "6月29日", slotA: "E组第1", slotB: "A/B/C/D/F组第3", next: 89 },
  { match: 75, date: "6月29日", slotA: "F组第1", slotB: "C组第2", next: 90 },
  { match: 76, date: "6月29日", slotA: "C组第1", slotB: "F组第2", next: 91 },
  { match: 77, date: "6月30日", slotA: "I组第1", slotB: "C/D/F/G/H组第3", next: 89 },
  { match: 78, date: "6月30日", slotA: "E组第2", slotB: "I组第2", next: 91 },
  { match: 79, date: "6月30日", slotA: "A组第1", slotB: "C/E/F/H/I组第3", next: 92 },
  { match: 80, date: "7月1日", slotA: "L组第1", slotB: "E/H/I/J/K组第3", next: 92 },
  { match: 81, date: "7月1日", slotA: "D组第1", slotB: "B/E/F/I/J组第3", next: 94 },
  { match: 82, date: "7月1日", slotA: "G组第1", slotB: "A/E/H/I/J组第3", next: 94 },
  { match: 83, date: "7月2日", slotA: "K组第2", slotB: "L组第2", next: 93 },
  { match: 84, date: "7月2日", slotA: "H组第1", slotB: "J组第2", next: 93 },
  { match: 85, date: "7月2日", slotA: "B组第1", slotB: "E/F/G/I/J组第3", next: 96 },
  { match: 86, date: "7月3日", slotA: "J组第1", slotB: "H组第2", next: 95 },
  { match: 87, date: "7月3日", slotA: "K组第1", slotB: "D/E/I/J/L组第3", next: 96 },
  { match: 88, date: "7月3日", slotA: "D组第2", slotB: "G组第2", next: 95 }
];

function buildTeam(name, group) {
  const override = teamOverrides[name] ?? {};
  const fifaRank = fifaRanks[name] ?? 70;
  const rankScore = 100 - clamp(fifaRank * 1.05, 0, 95);
  const confed = confedMap[name] ?? "UEFA";
  const isHost = hostTeams.has(name);
  const eliteBoost = fifaRank <= 10 ? 8 : fifaRank <= 20 ? 4 : 0;
  const travelFatigue = isHost ? 12 : confed === "CONCACAF" ? 24 : confed === "CONMEBOL" ? 42 : confed === "UEFA" ? 46 : confed === "CAF" ? 50 : confed === "AFC" ? 58 : 65;
  const climateFit = isHost ? 92 : confed === "CONCACAF" ? 84 : confed === "CONMEBOL" ? 80 : confed === "CAF" ? 76 : confed === "AFC" ? 70 : 64;

  return {
    name,
    group,
    fifaRank: override.fifaRank ?? fifaRank,
    countryCode: countryCodes[name] ?? "",
    confed,
    elo: override.elo ?? Math.round(2050 - fifaRank * 7.1 + eliteBoost * 5),
    attack: override.attack ?? clamp(Math.round(58 + rankScore * 0.36 + eliteBoost), 48, 96),
    defense: override.defense ?? clamp(Math.round(57 + rankScore * 0.34 + eliteBoost * 0.8), 48, 94),
    form: override.form ?? clamp(Math.round(60 + rankScore * 0.26 + (fifaRank <= 25 ? 5 : 0)), 48, 90),
    injury: override.injury ?? clamp(Math.round(8 + fifaRank * 0.11), 6, 22),
    squadValue: override.squadValue ?? clamp(Math.round(50 + rankScore * 0.42 + eliteBoost), 42, 96),
    tournamentExperience: override.tournamentExperience ?? clamp(Math.round(45 + rankScore * 0.34 + (["巴西", "阿根廷", "德国", "法国", "英格兰", "西班牙", "葡萄牙", "荷兰", "克罗地亚", "乌拉圭"].includes(name) ? 16 : 0)), 36, 98),
    coachStability: override.coachStability ?? clamp(Math.round(62 + rankScore * 0.2), 50, 88),
    goalkeeper: override.goalkeeper ?? clamp(Math.round(58 + rankScore * 0.28 + (["巴西", "阿根廷", "法国", "英格兰", "德国", "葡萄牙"].includes(name) ? 6 : 0)), 48, 92),
    setPieces: override.setPieces ?? clamp(Math.round(58 + rankScore * 0.23 + (["英格兰", "德国", "瑞典", "苏格兰", "捷克", "克罗地亚"].includes(name) ? 8 : 0)), 48, 90),
    travelFatigue: override.travelFatigue ?? travelFatigue,
    restDays: override.restDays ?? (isHost ? 6 : fifaRank <= 20 ? 5 : 4),
    climateFit: override.climateFit ?? climateFit,
    marketOdds: override.marketOdds ?? Number((4 + fifaRank * 1.55).toFixed(1)),
    host: isHost
  };
}

function buildFixtures() {
  return Object.entries(groups).flatMap(([group, teams]) => {
    const pairings = [
      [teams[0], teams[1]],
      [teams[2], teams[3]],
      [teams[0], teams[2]],
      [teams[3], teams[1]],
      [teams[3], teams[0]],
      [teams[1], teams[2]]
    ];
    return pairings.map(([a, b], index) => ({
      group,
      a,
      b,
      matchday: index < 2 ? 1 : index < 4 ? 2 : 3,
      ...(fixtureTemplate[index] ?? {}),
      source: fixtureTemplate[index]?.source ?? "schedule-model"
    }));
  });
}

const sampleData = {
  sourceNote: externalData.sourceLabel ?? "2026 世界杯真实分组；球队评分为预测模型参数，不代表官方实力评级。",
  lastUpdated: externalData.lastUpdated ?? "2026-06-06",
  dataQuality: externalData.dataQuality ?? {
    confirmed: ["2026 A-L 分组", "48 队赛制", "32 强晋级规则"],
    estimated: ["Elo", "伤病影响", "赔率校准", "旅途疲劳", "气候适应"],
    nextFeeds: ["实时 FIFA 排名", "赔率", "伤病名单"]
  },
  teams: Object.entries(groups).flatMap(([group, teams]) => teams.map((name) => buildTeam(name, group))),
  fixtures: externalData.fixtures ?? buildFixtures()
};

let state = structuredClone(sampleData);
let latestSimulation = [];
let currentMode = "standard";
let currentLanguage = localStorage.getItem("forecastLanguage") ?? "zh";

const $ = (id) => document.getElementById(id);
const formatPct = (value) => `${Math.round(value * 100)}%`;
const formatProb = (value) => `${(value * 100).toFixed(value >= 0.1 ? 0 : 1)}%`;
const flagUrl = (team) => team?.countryCode ? `https://flagcdn.com/w40/${team.countryCode}.png` : "";
const teamTranslations = {
  墨西哥: "Mexico",
  南非: "South Africa",
  韩国: "South Korea",
  捷克: "Czechia",
  加拿大: "Canada",
  瑞士: "Switzerland",
  卡塔尔: "Qatar",
  波黑: "Bosnia and Herzegovina",
  巴西: "Brazil",
  摩洛哥: "Morocco",
  海地: "Haiti",
  苏格兰: "Scotland",
  美国: "United States",
  巴拉圭: "Paraguay",
  澳大利亚: "Australia",
  土耳其: "Turkey",
  德国: "Germany",
  库拉索: "Curacao",
  科特迪瓦: "Cote d'Ivoire",
  厄瓜多尔: "Ecuador",
  荷兰: "Netherlands",
  日本: "Japan",
  突尼斯: "Tunisia",
  瑞典: "Sweden",
  比利时: "Belgium",
  埃及: "Egypt",
  伊朗: "Iran",
  新西兰: "New Zealand",
  西班牙: "Spain",
  佛得角: "Cape Verde",
  沙特阿拉伯: "Saudi Arabia",
  乌拉圭: "Uruguay",
  法国: "France",
  塞内加尔: "Senegal",
  挪威: "Norway",
  伊拉克: "Iraq",
  阿根廷: "Argentina",
  阿尔及利亚: "Algeria",
  奥地利: "Austria",
  约旦: "Jordan",
  葡萄牙: "Portugal",
  乌兹别克斯坦: "Uzbekistan",
  哥伦比亚: "Colombia",
  刚果民主共和国: "DR Congo",
  英格兰: "England",
  克罗地亚: "Croatia",
  加纳: "Ghana",
  巴拿马: "Panama"
};
const placeTranslations = {
  阿灵顿: "Arlington",
  东拉瑟福德: "East Rutherford",
  多伦多: "Toronto",
  费城: "Philadelphia",
  福克斯伯勒: "Foxborough",
  瓜达拉哈拉: "Guadalajara",
  瓜达卢佩: "Guadalupe",
  堪萨斯城: "Kansas City",
  洛杉矶: "Los Angeles",
  迈阿密花园: "Miami Gardens",
  蒙特雷: "Monterrey",
  墨西哥城: "Mexico City",
  萨波潘: "Zapopan",
  圣克拉拉: "Santa Clara",
  温哥华: "Vancouver",
  西雅图: "Seattle",
  休斯敦: "Houston",
  亚特兰大: "Atlanta",
  英格尔伍德: "Inglewood"
};
const translateTextMap = {
  zh: {},
  en: {
    "世界杯预测工作台": "World Cup Forecast Lab",
    "2026 真实分组 · 单场 xG · 小组出线 · 淘汰赛路径 · 蒙特卡洛概率": "2026 real groups · single-match xG · group qualification · knockout routes · Monte Carlo probabilities",
    "在线演示版": "Online demo",
    "想要完整版工具包？首发测试价 19.9 元": "Want the full toolkit? Launch test price: RMB 19.9",
    "适合世界杯球迷、足球博主、公众号和短视频创作者。完整版支持离线使用、数据模板和更新脚本。": "Built for World Cup fans, football creators, newsletters, and short-video accounts. The full package supports offline use, data templates, and update scripts.",
    "先体验功能": "Try the demo",
    "微信联系：hms16888168": "WeChat: hms16888168",
    "仅用于球迷分析和内容创作，不是投注建议，不保证比赛结果。": "For fan analysis and content creation only. Not betting advice and no result is guaranteed.",
    "模型": "Model",
    "12 因素综合预测": "12-factor forecast",
    "模拟": "Simulation",
    "800 / 1500 次": "800 / 1500 runs",
    "预测逻辑": "Forecast logic",
    "球队强度 → 单场 xG/胜平负 → 小组排名 → 8 个最佳第三名 → 淘汰赛路径 → 蒙特卡洛概率": "Team strength -> single-match xG/W-D-L -> group table -> 8 best third-place teams -> knockout route -> Monte Carlo probability",
    "参考做法": "Reference method",
    "类似 FiveThirtyEight/Opta：用强度评分转单场概率，再跑大量赛事模拟。": "Similar to FiveThirtyEight/Opta: convert team ratings into match probabilities, then run tournament simulations.",
    "真实数据": "Real data",
    "2026 分组 / 赛制 / 32 强路径": "2026 groups / format / Round of 32 path",
    "模型估算": "Model estimates",
    "Elo、伤病、赔率、旅途、气候适应": "Elo, injuries, odds, travel, climate fit",
    "数据更新": "Data updated",
    "强度数据": "Strength data",
    "模型模式": "Model mode",
    "常规模型": "Standard model",
    "冷门模式": "Upset mode",
    "市场赔率模式": "Market-odds mode",
    "主办国加成模式": "Host boost mode",
    "平衡球队强度、攻防、赛程和赔率，适合默认预测。": "Balances team strength, attack/defense, schedule, and odds for the default forecast.",
    "提高平局和波动权重，更容易识别冷门和弱队不败。": "Raises draw and volatility weights to surface upsets and underdog non-loss spots.",
    "提高赔率校准权重，让结果更贴近市场共识。": "Raises market calibration weight to move results closer to market consensus.",
    "提高美国、墨西哥、加拿大等主办国加成。": "Raises host-nation boost for the United States, Mexico, and Canada.",
    "模型冠军热门": "Model title favorite",
    "火力上限": "Attack ceiling",
    "防守下限": "Defensive floor",
    "赛事规模": "Tournament size",
    "死亡小组": "Group of death",
    "等待计算": "Waiting for calculation",
    "进攻评分最高": "Highest attack rating",
    "防守评分最高": "Highest defense rating",
    "强队密度最高": "Highest elite-team density",
    "焦点比赛推荐": "Featured matches",
    "自动挑出最值得看的强强战、出线关键战和潜在冷门。": "Automatically highlights elite matchups, qualification swing games, and upset candidates.",
    "单场预测": "Single-match forecast",
    "交换主客队": "Swap teams",
    "A 队": "Team A",
    "B 队": "Team B",
    "B 队会自动切换为 A 队的小组赛对手。": "Team B is automatically filtered to Team A's group opponents.",
    "A 队主场加成": "Team A host boost",
    "平局倾向": "Draw tendency",
    "计算胜平负": "Calculate W-D-L",
    "信心": "Confidence",
    "冷门风险": "Upset risk",
    "比赛节奏": "Match tempo",
    "平局": "Draw",
    "展开单场依据": "Open match evidence",
    "赛前报告": "Pre-match report",
    "本场关键因素": "Key factors",
    "比分分布": "Score distribution",
    "冷门成因": "Upset drivers",
    "战术对位": "Tactical matchup",
    "模型结合的数据": "Model inputs",
    "当前球队前景": "Selected team outlook",
    "小组出线预测": "Group qualification forecast",
    "按已录入赛程计算预期积分和净胜球。": "Projects expected points and goal difference from the recorded fixtures.",
    "排名": "Rank",
    "球队": "Team",
    "预期积分": "Expected pts",
    "预期进球": "Expected GF",
    "预期失球": "Expected GA",
    "模型评分": "Model rating",
    "风险": "Risk",
    "小组赛程预测": "Group fixture forecast",
    "出线形势": "Qualification race",
    "小组真实变量": "Group reality signals",
    "把第三名压力、赛程压力和模型分歧放在一起看。": "Combines third-place pressure, schedule pressure, and model uncertainty.",
    "小组关键战": "Key group matches",
    "自动挑出争第一、争第二和第三名压力最大的比赛。": "Automatically finds first-place, second-place, and third-place pressure matches.",
    "球队小组路径": "Team group route",
    "跟随左侧 A 队选择自动更新。": "Updates with the Team A selection.",
    "冷门观察": "Upset watch",
    "按实力差、平局概率、伤病旅途和第三名压力综合判断。": "Ranks upset spots by strength gap, draw probability, injuries/travel, and third-place pressure.",
    "2026 真实分组": "2026 real groups",
    "A-L 组，每组前二名和 8 个最佳第三名进入 32 强。": "Groups A-L: top two in each group plus the eight best third-place teams reach the Round of 32.",
    "32 强晋级图": "Round of 32 bracket",
    "按 FIFA 公布的 2026 淘汰赛槽位展示，并用当前模型一路模拟到冠军。": "Shows the 2026 knockout slots and simulates the current model path to the champion.",
    "模型冠军路径": "Model champion path",
    "等待计算": "Waiting",
    "蒙特卡洛晋级概率": "Monte Carlo advancement probabilities",
    "随机模拟 1500 次完整赛事，比单一路径更接近真实预测。": "Runs 1,500 full tournament simulations for a more realistic view than one bracket path.",
    "全部小组": "All groups",
    "按夺冠": "Sort by champion",
    "按进32强": "Sort by Round of 32",
    "黑马榜": "Dark-horse ranking",
    "重新模拟": "Run simulation",
    "导出预测报告": "Export forecast report",
    "等待模拟": "Waiting for simulation",
    "小组第一": "Group winner",
    "进32强": "Round of 32",
    "进16强": "Round of 16",
    "进8强": "Quarterfinal",
    "进4强": "Semifinal",
    "进决赛": "Final",
    "夺冠": "Champion",
    "模型因素权重": "Model factor weights",
    "每项都能在 JSON 里修改，立刻影响预测。": "Every factor can be edited in JSON and immediately changes forecasts.",
    "冠军竞争力": "Title contender strength",
    "不是最终赔率，只是当前参数下的相对强度。": "Not final odds; this is relative strength under the current parameters.",
    "数据可信度": "Data credibility",
    "真实赛程和模型估算分开标注，方便判断预测可靠性。": "Separates real schedule data from model estimates for clearer trust.",
    "数据编辑": "Data editor",
    "导入/导出 JSON，默认收起避免影响成品展示": "Import/export JSON. Collapsed by default for a cleaner product view.",
    "导入文件": "Import file",
    "恢复内置数据": "Restore built-in data",
    "应用 JSON": "Apply JSON",
    "导出当前数据": "Export current data",
    "球队详情": "Team details",
    "详情报告": "report",
    "关闭": "Close"
  }
};
const t = (text) => currentLanguage === "en" ? (translateTextMap.en[text] ?? text) : text;
const tn = (name) => currentLanguage === "en" ? (teamTranslations[name] ?? name) : name;
const localizeSlot = (text) => {
  if (currentLanguage !== "en") return text;
  return String(text)
    .replace(/([A-L])组第1/g, "Group $1 winner")
    .replace(/([A-L])组第2/g, "Group $1 runner-up")
    .replace(/([A-L](?:\/[A-L])*)组第3/g, "Group $1 third-place")
    .replace(/（([A-L])组第3）/g, " (Group $1 third)")
    .replace(/32强/g, "Round of 32")
    .replace(/16强/g, "Round of 16")
    .replace(/8强/g, "Quarterfinal")
    .replace(/半决赛/g, "Semifinal")
    .replace(/决赛/g, "Final");
};
const richTranslate = (value) => {
  if (currentLanguage !== "en") return value;
  let text = translateTextMap.en[value] ?? value;
  Object.entries(teamTranslations)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([zh, en]) => {
      text = text.replaceAll(zh, en);
    });
  Object.entries(placeTranslations)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([zh, en]) => {
      text = text.replaceAll(zh, en);
    });
  const replacements = [
    ["组", " Group"],
    ["支球队", " teams"],
    ["场小组赛", " group matches"],
    ["综合评分", "rating"],
    ["晋级", "advance"],
    ["推荐", "pick"],
    ["冷门", "upset"],
    ["悬念", "uncertainty"],
    ["倾向", "lean"],
    ["潜在", "potential "],
    ["强强战", "elite matchup"],
    ["出线关键", "qualification swing"],
    ["五五开", "coin flip"],
    ["备选", "Alt "],
    ["胜面更清楚", "has the clearer edge"],
    ["小幅占优", "slightly favored"],
    ["胜负差距很小", "very close"],
    ["胜", " win"],
    ["平", "Draw"],
    ["预计", "projected"],
    ["直接出线区", "direct qualification"],
    ["最佳第三竞争", "best third-place race"],
    ["淘汰风险", "elimination risk"],
    ["官方", "official"],
    ["部分建模", "partly modeled"],
    ["日期待定", "date TBD"],
    ["城市待定", "city TBD"],
    ["球场待定", "stadium TBD"],
    ["待定", "TBD"],
    ["轮", "round"],
    ["天", "d"],
    ["分", " pts"],
    ["第 ", "#"],
    ["高", "High"],
    ["中", "Medium"],
    ["低", "Low"],
    ["均衡", "Balanced"],
    ["偏开放", "Open"],
    ["偏谨慎", "Cautious"]
  ];
  replacements.forEach(([zh, en]) => {
    text = text.replaceAll(zh, en);
  });
  return localizeSlot(text);
};

function applyLanguage() {
  document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-CN";
  document.title = currentLanguage === "en" ? "World Cup Forecast Lab" : "世界杯预测工作台";
  const selector = $("languageSelect");
  if (selector) selector.value = currentLanguage;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const parent = node.parentElement;
    if (!parent || ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) return;
    if (!node.nodeValue.trim()) return;
    if (!node.__zhText) node.__zhText = node.nodeValue;
    node.nodeValue = currentLanguage === "en" ? richTranslate(node.__zhText) : node.__zhText;
  });
  document.querySelectorAll("[title]").forEach((element) => {
    if (!element.dataset.zhTitle) element.dataset.zhTitle = element.getAttribute("title") ?? "";
    element.setAttribute("title", currentLanguage === "en" ? richTranslate(element.dataset.zhTitle) : element.dataset.zhTitle);
  });
  document.querySelectorAll("[aria-label]").forEach((element) => {
    if (!element.dataset.zhAriaLabel) element.dataset.zhAriaLabel = element.getAttribute("aria-label") ?? "";
    element.setAttribute("aria-label", currentLanguage === "en" ? richTranslate(element.dataset.zhAriaLabel) : element.dataset.zhAriaLabel);
  });
}
const teamBadge = (team) => `
  <button class="team-badge" type="button" data-team="${team?.name ?? ""}" title="${currentLanguage === "en" ? `View ${tn(team?.name ?? "")} details` : `查看${team?.name ?? ""}详情`}">
    ${flagUrl(team) ? `<img src="${flagUrl(team)}" alt="" loading="lazy" />` : ""}
    <span>${tn(team?.name ?? "")}</span>
  </button>
`;
const teamNameMarkup = (name) => {
  const team = findTeam(cleanTeamName(String(name)));
  return team ? teamBadge(team) : localizeSlot(String(name));
};
const factorWeights = [
  { key: "elo", label: "Elo 强度", weight: 0.28, normalize: (team) => (team.elo - 1450) / 6 },
  { key: "fifaRank", label: "FIFA 排名", weight: 0.09, normalize: (team) => 100 - clamp((team.fifaRank ?? 60) * 1.1, 0, 100) },
  { key: "attack", label: "进攻火力", weight: 0.13, normalize: (team) => team.attack },
  { key: "defense", label: "防守质量", weight: 0.13, normalize: (team) => team.defense },
  { key: "form", label: "近期状态", weight: 0.09, normalize: (team) => team.form },
  { key: "injury", label: "伤病影响", weight: 0.07, normalize: (team) => 100 - (team.injury ?? 12) * 3 },
  { key: "squadValue", label: "阵容深度", weight: 0.07, normalize: (team) => team.squadValue ?? 65 },
  { key: "experience", label: "大赛经验", weight: 0.05, normalize: (team) => team.tournamentExperience ?? 65 },
  { key: "coach", label: "教练稳定", weight: 0.04, normalize: (team) => team.coachStability ?? 70 },
  { key: "goalkeeper", label: "门将质量", weight: 0.04, normalize: (team) => team.goalkeeper ?? 70 },
  { key: "setPieces", label: "定位球", weight: 0.03, normalize: (team) => team.setPieces ?? 70 },
  { key: "schedule", label: "赛程体能", weight: 0.04, normalize: (team) => clamp((team.restDays ?? 5) * 13 - (team.travelFatigue ?? 45) * 0.55 + 35, 0, 100) },
  { key: "climate", label: "气候适应", weight: 0.02, normalize: (team) => team.climateFit ?? 70 },
  { key: "market", label: "赔率校准", weight: 0.02, normalize: (team) => clamp(110 - Math.log(team.marketOdds ?? 80) * 20, 0, 100) }
];
const modeConfig = {
  standard: { draw: 1, volatility: 1, market: 1, host: 1, label: "平衡球队强度、攻防、赛程和赔率，适合默认预测。" },
  upset: { draw: 1.18, volatility: 1.35, market: 0.85, host: 0.9, label: "提高平局和波动权重，更容易识别冷门和弱队不败。" },
  market: { draw: 0.95, volatility: 0.9, market: 1.45, host: 1, label: "提高赔率校准权重，让结果更贴近市场共识。" },
  host: { draw: 1, volatility: 1, market: 1, host: 1.55, label: "提高美国、墨西哥、加拿大等主办国加成。" }
};

function teamScore(team) {
  const weighted = factorWeights.reduce((total, factor) => total + factor.normalize(team) * factor.weight, 0);
  const marketBoost = (modeConfig[currentMode]?.market ?? 1) * clamp(110 - Math.log(team.marketOdds ?? 80) * 20, 0, 100) * 0.08;
  const hostBoost = team.host ? 28 * (modeConfig[currentMode]?.host ?? 1) : 0;
  return weighted * 12 + marketBoost + hostBoost;
}

function factorBreakdown(teamA, teamB, homeBoost = false) {
  return factorWeights
    .map((factor) => {
      const valueA = factor.normalize(teamA);
      const valueB = factor.normalize(teamB);
      return {
        label: factor.label,
        impact: (valueA - valueB) * factor.weight + (factor.key === "schedule" && homeBoost ? 2.1 : 0)
      };
    })
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
}

function riskScore(team) {
  const injuryRisk = (team.injury ?? 12) * 1.3;
  const travelRisk = (team.travelFatigue ?? 45) * 0.34;
  const restRisk = Math.max(0, 5 - (team.restDays ?? 5)) * 6;
  const coachRisk = Math.max(0, 72 - (team.coachStability ?? 72)) * 0.45;
  return clamp(injuryRisk + travelRisk + restRisk + coachRisk, 0, 100);
}

function expectedGoals(team, opponent, isHome = false) {
  const ratingEdge = (teamScore(team) - teamScore(opponent)) / 380;
  const attackEdge = (team.attack - opponent.defense) / 60;
  const keeperEdge = ((team.goalkeeper ?? 70) - (opponent.goalkeeper ?? 70)) / 260;
  const setPieceEdge = ((team.setPieces ?? 70) - (opponent.setPieces ?? 70)) / 240;
  const injuryDrag = (team.injury ?? 12) / 145;
  const scheduleEdge = ((team.restDays ?? 5) - (opponent.restDays ?? 5)) / 22;
  const homeEdge = isHome ? 0.15 : 0;
  return clamp(1.28 + ratingEdge + attackEdge + keeperEdge + setPieceEdge + scheduleEdge + homeEdge - injuryDrag, 0.25, 3.9);
}

function factorial(value) {
  if (value <= 1) return 1;
  let total = 1;
  for (let i = 2; i <= value; i += 1) total *= i;
  return total;
}

function poisson(lambda, goals) {
  return (Math.exp(-lambda) * lambda ** goals) / factorial(goals);
}

function scoreDistribution(goalsA, goalsB, maxGoals = 5) {
  const scores = [];
  for (let a = 0; a <= maxGoals; a += 1) {
    for (let b = 0; b <= maxGoals; b += 1) {
      scores.push({ a, b, probability: poisson(goalsA, a) * poisson(goalsB, b) });
    }
  }
  return scores.sort((x, y) => y.probability - x.probability);
}

function matchStory(teamA, teamB, result) {
  const favoriteProb = Math.max(result.winA, result.winB);
  const underdogProb = Math.min(result.winA, result.winB);
  const drawPressure = result.draw;
  const goalTotal = result.goalsA + result.goalsB;
  const confidence = clamp((favoriteProb - underdogProb) * 1.35 + (1 - drawPressure) * 0.28, 0, 1);
  const upsetRisk = clamp(underdogProb + drawPressure * 0.55 + (riskScore(teamA) + riskScore(teamB)) / 420, 0, 1);
  const tempo = goalTotal >= 3.2 ? "偏开放" : goalTotal <= 2.1 ? "偏谨慎" : "均衡";
  const favorite = result.winA >= result.winB ? teamA.name : teamB.name;

  return {
    favorite,
    confidence,
    upsetRisk,
    tempo,
    distribution: scoreDistribution(result.goalsA, result.goalsB)
  };
}

function marketImpliedChance(team) {
  const odds = Math.max(2.2, Number(team.marketOdds ?? 80));
  return clamp(1 / odds, 0.01, 0.45);
}

function matchupLabel(value, high, low = "均衡") {
  if (value >= high) return "明显优势";
  if (value <= -high) return "明显劣势";
  if (Math.abs(value) <= 2) return low;
  return value > 0 ? "小优" : "小劣";
}

function upsetProfile(teamA, teamB, result, story) {
  const favorite = result.winA >= result.winB ? teamA : teamB;
  const underdog = favorite.name === teamA.name ? teamB : teamA;
  const underdogWin = favorite.name === teamA.name ? result.winB : result.winA;
  const marketGap = marketImpliedChance(favorite) - marketImpliedChance(underdog);
  const modelGap = Math.max(result.winA, result.winB) - underdogWin;
  const points = [
    { label: "平局保护", value: result.draw, note: result.draw >= 0.27 ? "比赛更容易被拖进一分局" : "平局保护一般" },
    { label: "热门风险", value: clamp((riskScore(favorite) - riskScore(underdog) + 18) / 54, 0, 1), note: riskScore(favorite) > riskScore(underdog) ? `${favorite.name} 赛程/伤病风险更高` : `${favorite.name} 风险可控` },
    { label: "弱队武器", value: clamp(((underdog.setPieces ?? 70) - (favorite.setPieces ?? 70) + 12) / 28, 0, 1), note: (underdog.setPieces ?? 70) >= (favorite.setPieces ?? 70) ? "定位球可能制造波动" : "定位球优势不明显" },
    { label: "市场分歧", value: clamp((modelGap - marketGap + 0.22) / 0.55, 0, 1), note: modelGap < marketGap ? "模型比市场更看重弱队" : "市场与模型大致同向" }
  ];
  const level = story.upsetRisk >= 0.52 ? "高冷门风险" : story.upsetRisk >= 0.42 ? "中等冷门风险" : "低冷门风险";
  return { favorite, underdog, underdogWin, level, points };
}

function tacticalProfile(teamA, teamB, result) {
  const rows = [
    ["进攻打防线", teamA.attack - teamB.defense, teamB.attack - teamA.defense],
    ["门将稳定性", teamA.goalkeeper - teamB.goalkeeper, teamB.goalkeeper - teamA.goalkeeper],
    ["定位球威胁", teamA.setPieces - teamB.setPieces, teamB.setPieces - teamA.setPieces],
    ["体能与旅途", (teamA.restDays - teamB.restDays) * 7 - (teamA.travelFatigue - teamB.travelFatigue) * 0.25, (teamB.restDays - teamA.restDays) * 7 - (teamB.travelFatigue - teamA.travelFatigue) * 0.25]
  ];
  return rows.map(([label, aEdge, bEdge]) => ({
    label,
    aEdge,
    bEdge,
    aText: matchupLabel(aEdge, 7),
    bText: matchupLabel(bEdge, 7),
    lean: aEdge > bEdge + 3 ? teamA.name : bEdge > aEdge + 3 ? teamB.name : "接近"
  }));
}

function preMatchReport(teamA, teamB, result, story) {
  const favorite = result.winA >= result.winB ? teamA : teamB;
  const underdog = favorite.name === teamA.name ? teamB : teamA;
  const favoriteProb = Math.max(result.winA, result.winB);
  const marketDiff = Math.abs(marketImpliedChance(teamA) - marketImpliedChance(teamB));
  const xgGap = Math.abs(result.goalsA - result.goalsB);
  const modelCertainty = clamp((favoriteProb - result.draw) * 0.85 + xgGap * 0.16 + marketDiff * 0.55, 0, 1);
  const confidenceText = modelCertainty >= 0.58 ? "高" : modelCertainty >= 0.42 ? "中" : "低";
  const score = story.distribution[0];
  const alt = story.distribution[1];
  const drawUseful = result.draw >= 0.27 || story.upsetRisk >= 0.45;
  const lean = favoriteProb >= 0.58
    ? `${favorite.name} 胜面更清楚`
    : favoriteProb <= 0.44
      ? "胜负差距很小"
      : `${favorite.name} 小幅占优`;
  const bettingLean = drawUseful
    ? `${underdog.name} 不败/平局保护值得关注`
    : `${favorite.name} 方向更稳，但不建议忽略平局`;
  const upsetTrigger = [
    result.draw >= 0.27 ? "前30分钟没有进球" : "",
    (underdog.setPieces ?? 70) >= (favorite.setPieces ?? 70) ? `${underdog.name} 通过定位球先进球` : "",
    riskScore(favorite) > riskScore(underdog) + 8 ? `${favorite.name} 轮换、伤病或旅途消耗放大` : "",
    story.upsetRisk >= 0.45 ? "比赛节奏被压低，强队进攻效率下降" : ""
  ].filter(Boolean);

  return {
    lean,
    bettingLean,
    confidenceText,
    modelCertainty,
    scoreText: `${score.a}-${score.b}`,
    altScoreText: `${alt.a}-${alt.b}`,
    upsetTrigger: upsetTrigger.slice(0, 3).join(" / ") || "需要弱队防线保持低失误，并把比赛拖入低比分",
    riskNote: story.upsetRisk >= 0.5
      ? "冷门风险偏高，适合降低单场确定性。"
      : result.draw >= 0.27
        ? "平局概率不低，比分推荐要保留一档平局。"
        : "模型倾向较顺，但杯赛仍有红牌、点球和临场轮换波动。"
  };
}

function predictMatch(teamA, teamB, options = {}) {
  const mode = modeConfig[currentMode] ?? modeConfig.standard;
  const drawWeight = Number(options.drawWeight ?? $("drawWeight").value) * mode.draw;
  const goalsA = expectedGoals(teamA, teamB, options.homeBoost);
  const goalsB = expectedGoals(teamB, teamA, false);
  const edge = goalsA - goalsB;
  const strengthEdge = (teamScore(teamA) - teamScore(teamB)) / 1000;
  const volatility = ((riskScore(teamA) + riskScore(teamB)) / 520) * mode.volatility;
  const decisivePool = 1 - drawWeight;
  const winA = decisivePool / (1 + Math.exp(-1.75 * edge - strengthEdge));
  const winB = decisivePool - winA;
  const draw = clamp(drawWeight + (0.08 - Math.abs(edge) * 0.035) - volatility * 0.05, 0.1, 0.38);
  const scale = winA + winB + draw;

  return {
    goalsA,
    goalsB,
    winA: winA / scale,
    draw: draw / scale,
    winB: winB / scale,
    factors: factorBreakdown(teamA, teamB, options.homeBoost)
  };
}

function sampleOutcome(result) {
  const roll = Math.random();
  if (roll < result.winA) return "A";
  if (roll < result.winA + result.draw) return "D";
  return "B";
}

function simulateMatchResult(teamA, teamB) {
  const prediction = predictMatch(teamA, teamB, { drawWeight: 0.24, homeBoost: Boolean(teamA.host) });
  const outcome = sampleOutcome(prediction);
  const goalsA = Math.max(0, Math.round(prediction.goalsA + (Math.random() - 0.5) * 1.4));
  const goalsB = Math.max(0, Math.round(prediction.goalsB + (Math.random() - 0.5) * 1.4));
  if (outcome === "A") return { pointsA: 3, pointsB: 0, goalsA: Math.max(goalsA, goalsB + 1), goalsB };
  if (outcome === "B") return { pointsA: 0, pointsB: 3, goalsA, goalsB: Math.max(goalsB, goalsA + 1) };
  const drawGoals = Math.round((goalsA + goalsB) / 2);
  return { pointsA: 1, pointsB: 1, goalsA: drawGoals, goalsB: drawGoals };
}

function findTeam(name) {
  return state.teams.find((team) => team.name === name);
}

function fixtureOpponents(teamName) {
  return state.fixtures
    .filter((fixture) => fixture.a === teamName || fixture.b === teamName)
    .map((fixture) => fixture.a === teamName ? fixture.b : fixture.a);
}

function renderTeamOptions() {
  const options = state.teams
    .slice()
    .sort((a, b) => a.group.localeCompare(b.group) || a.fifaRank - b.fifaRank)
    .map((team) => `<option value="${team.name}">${currentLanguage === "en" ? `${tn(team.name)} (Group ${team.group})` : `${tn(team.name)}（${team.group}组）`}</option>`)
    .join("");
  $("teamA").innerHTML = options;
  $("teamA").value = state.teams[0]?.name ?? "";
  renderOpponentOptions();
}

function fixturePressure(fixture) {
  const matchdayPressure = fixture.matchday === 3 ? 12 : fixture.matchday === 2 ? 7 : 3;
  const sourcePenalty = fixture.source === "official" ? 0 : 3;
  const cityPressure = ["洛杉矶", "温哥华", "多伦多", "亚特兰大"].includes(fixture.city) ? 7 : 4;
  return matchdayPressure + sourcePenalty + cityPressure;
}

function renderOpponentOptions(preferredOpponent = "") {
  const teamA = findTeam($("teamA").value);
  const opponents = teamA ? fixtureOpponents(teamA.name).map(findTeam).filter(Boolean) : [];
  const fallback = state.teams.filter((team) => team.name !== $("teamA").value);
  const options = (opponents.length ? opponents : fallback)
    .map((team) => `<option value="${team.name}">${currentLanguage === "en" ? `${tn(team.name)} (Group ${team.group})` : `${tn(team.name)}（${team.group}组）`}</option>`)
    .join("");
  $("teamB").innerHTML = options;
  $("teamB").value = opponents.some((team) => team.name === preferredOpponent)
    ? preferredOpponent
    : opponents[0]?.name ?? fallback[0]?.name ?? "";
}

function renderGroups() {
  const groupKeys = [...new Set(state.teams.map((team) => team.group))].sort();
  $("groupSelect").innerHTML = groupKeys.map((group) => `<option value="${group}">${currentLanguage === "en" ? `Group ${group}` : `${group} 组`}</option>`).join("");
  $("simGroupFilter").innerHTML = `<option value="all">${t("全部小组")}</option>${groupKeys.map((group) => `<option value="${group}">${currentLanguage === "en" ? `Group ${group}` : `${group}组`}</option>`).join("")}`;
  $("groupOverview").innerHTML = groupKeys.map((group) => {
    const teams = state.teams
      .filter((team) => team.group === group)
      .sort((a, b) => a.fifaRank - b.fifaRank)
      .map((team) => `<span>${teamBadge(team)}<small>${team.fifaRank}</small></span>`)
      .join("");
    return `<article class="group-card"><strong>${currentLanguage === "en" ? `Group ${group}` : `${group}组`}</strong><div>${teams}</div></article>`;
  }).join("");
}

function calculateGroup(group) {
  const teams = state.teams.filter((team) => team.group === group);
  const table = Object.fromEntries(
    teams.map((team) => [team.name, { team, points: 0, goalsFor: 0, goalsAgainst: 0, rating: teamScore(team) }])
  );

  state.fixtures
    .filter((fixture) => fixture.group === group)
    .forEach((fixture) => {
      const a = findTeam(fixture.a);
      const b = findTeam(fixture.b);
      if (!a || !b || !table[a.name] || !table[b.name]) return;
      const result = predictMatch(a, b, { drawWeight: 0.24, homeBoost: Boolean(a.host) });
      table[a.name].points += result.winA * 3 + result.draw;
      table[b.name].points += result.winB * 3 + result.draw;
      table[a.name].goalsFor += result.goalsA;
      table[a.name].goalsAgainst += result.goalsB;
      table[b.name].goalsFor += result.goalsB;
      table[b.name].goalsAgainst += result.goalsA;
    });

  return Object.values(table).sort((a, b) => {
    const pointsEdge = b.points - a.points;
    if (Math.abs(pointsEdge) > 0.01) return pointsEdge;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (Math.abs(gdB - gdA) > 0.01) return gdB - gdA;
    return a.team.fifaRank - b.team.fifaRank;
  });
}

function allGroupTables() {
  return [...new Set(state.teams.map((team) => team.group))].sort().map((group) => ({ group, rows: calculateGroup(group) }));
}

function simulateGroupTables() {
  const groupKeys = [...new Set(state.teams.map((team) => team.group))].sort();
  return groupKeys.map((group) => {
    const teams = state.teams.filter((team) => team.group === group);
    const table = Object.fromEntries(
      teams.map((team) => [team.name, { team, points: 0, goalsFor: 0, goalsAgainst: 0 }])
    );

    state.fixtures
      .filter((fixture) => fixture.group === group)
      .forEach((fixture) => {
        const a = findTeam(fixture.a);
        const b = findTeam(fixture.b);
        if (!a || !b) return;
        const result = simulateMatchResult(a, b);
        table[a.name].points += result.pointsA;
        table[b.name].points += result.pointsB;
        table[a.name].goalsFor += result.goalsA;
        table[a.name].goalsAgainst += result.goalsB;
        table[b.name].goalsFor += result.goalsB;
        table[b.name].goalsAgainst += result.goalsA;
      });

    const rows = Object.values(table).sort((a, b) => {
      const pointEdge = b.points - a.points;
      if (pointEdge !== 0) return pointEdge;
      const gdEdge = (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
      if (gdEdge !== 0) return gdEdge;
      const gfEdge = b.goalsFor - a.goalsFor;
      if (gfEdge !== 0) return gfEdge;
      return a.team.fifaRank - b.team.fifaRank;
    });

    return { group, rows };
  });
}

function predictedSlot(slot, tables = allGroupTables()) {
  const direct = slot.match(/^([A-L])组第([12])$/);
  if (direct) {
    const table = tables.find((item) => item.group === direct[1]);
    return table?.rows[Number(direct[2]) - 1]?.team.name ?? slot;
  }
  if (slot.includes("第3")) {
    const candidates = tables
      .map((item) => ({ group: item.group, row: item.rows[2] }))
      .sort((a, b) => b.row.points - a.row.points || (b.row.goalsFor - b.row.goalsAgainst) - (a.row.goalsFor - a.row.goalsAgainst))
      .slice(0, 8);
    const allowed = slot.match(/([A-L](?:\/[A-L])*)组第3/)?.[1].split("/") ?? [];
    const match = candidates.find((candidate) => allowed.includes(candidate.group));
    return match ? `${match.row.team.name}（${match.group}组第3）` : slot;
  }
  return slot;
}

function cleanTeamName(slotValue) {
  return slotValue.replace(/（.*?）/g, "");
}

function pickWinner(nameA, nameB) {
  const teamA = findTeam(cleanTeamName(nameA));
  const teamB = findTeam(cleanTeamName(nameB));
  if (!teamA || !teamB) return nameA;
  const result = predictMatch(teamA, teamB, { drawWeight: 0.22, homeBoost: Boolean(teamA.host) });
  return result.winA >= result.winB ? teamA.name : teamB.name;
}

function sampleWinner(nameA, nameB) {
  const teamA = findTeam(cleanTeamName(nameA));
  const teamB = findTeam(cleanTeamName(nameB));
  if (!teamA || !teamB) return cleanTeamName(nameA);
  const result = predictMatch(teamA, teamB, { drawWeight: 0.2, homeBoost: Boolean(teamA.host) });
  const decisiveA = result.winA / (result.winA + result.winB);
  return Math.random() < decisiveA ? teamA.name : teamB.name;
}

function slotFromSim(slot, tables) {
  const direct = slot.match(/^([A-L])组第([12])$/);
  if (direct) {
    const table = tables.find((item) => item.group === direct[1]);
    return table?.rows[Number(direct[2]) - 1]?.team.name ?? slot;
  }
  if (slot.includes("第3")) {
    const candidates = tables
      .map((item) => ({ group: item.group, row: item.rows[2] }))
      .sort((a, b) => b.row.points - a.row.points || (b.row.goalsFor - b.row.goalsAgainst) - (a.row.goalsFor - a.row.goalsAgainst))
      .slice(0, 8);
    const allowed = slot.match(/([A-L](?:\/[A-L])*)组第3/)?.[1].split("/") ?? [];
    return candidates.find((candidate) => allowed.includes(candidate.group))?.row.team.name ?? candidates[0]?.row.team.name ?? slot;
  }
  return slot;
}

function simulateTournamentOnce() {
  const tables = simulateGroupTables();
  const stats = {
    groupWinner: new Set(),
    round32: new Set(),
    round16: new Set(),
    quarter: new Set(),
    semi: new Set(),
    final: new Set(),
    champion: ""
  };

  tables.forEach(({ rows }) => {
    stats.groupWinner.add(rows[0].team.name);
    rows.slice(0, 2).forEach((row) => stats.round32.add(row.team.name));
  });
  tables
    .map((item) => ({ group: item.group, row: item.rows[2] }))
    .sort((a, b) => b.row.points - a.row.points || (b.row.goalsFor - b.row.goalsAgainst) - (a.row.goalsFor - a.row.goalsAgainst))
    .slice(0, 8)
    .forEach((candidate) => stats.round32.add(candidate.row.team.name));

  const round32 = knockoutMap.map((match) => {
    const teamA = slotFromSim(match.slotA, tables);
    const teamB = slotFromSim(match.slotB, tables);
    const winner = sampleWinner(teamA, teamB);
    stats.round16.add(winner);
    return { match: match.match, winner };
  });
  const byMatch = Object.fromEntries(round32.map((match) => [match.match, match.winner]));
  const makeMatch = (match, a, b, targetSet) => {
    const winner = sampleWinner(byMatch[a], byMatch[b]);
    byMatch[match] = winner;
    targetSet.add(winner);
    return winner;
  };
  [makeMatch(89, 74, 77, stats.quarter), makeMatch(90, 73, 75, stats.quarter), makeMatch(91, 76, 78, stats.quarter), makeMatch(92, 79, 80, stats.quarter), makeMatch(93, 83, 84, stats.quarter), makeMatch(94, 81, 82, stats.quarter), makeMatch(95, 86, 88, stats.quarter), makeMatch(96, 85, 87, stats.quarter)];
  [makeMatch(97, 89, 90, stats.semi), makeMatch(98, 93, 94, stats.semi), makeMatch(99, 91, 92, stats.semi), makeMatch(100, 95, 96, stats.semi)];
  [makeMatch(101, 97, 98, stats.final), makeMatch(102, 99, 100, stats.final)];
  stats.champion = sampleWinner(byMatch[101], byMatch[102]);
  return stats;
}

function runMonteCarlo(iterations = 1500) {
  const stats = Object.fromEntries(
    state.teams.map((team) => [team.name, { team, groupWinner: 0, round32: 0, round16: 0, quarter: 0, semi: 0, final: 0, champion: 0 }])
  );

  for (let i = 0; i < iterations; i += 1) {
    const sim = simulateTournamentOnce();
    Object.keys(stats).forEach((name) => {
      if (sim.groupWinner.has(name)) stats[name].groupWinner += 1;
      if (sim.round32.has(name)) stats[name].round32 += 1;
      if (sim.round16.has(name)) stats[name].round16 += 1;
      if (sim.quarter.has(name)) stats[name].quarter += 1;
      if (sim.semi.has(name)) stats[name].semi += 1;
      if (sim.final.has(name)) stats[name].final += 1;
      if (sim.champion === name) stats[name].champion += 1;
    });
  }

  return Object.values(stats)
    .map((row) => ({
      ...row,
      groupWinner: row.groupWinner / iterations,
      round32: row.round32 / iterations,
      round16: row.round16 / iterations,
      quarter: row.quarter / iterations,
      semi: row.semi / iterations,
      final: row.final / iterations,
      champion: row.champion / iterations
    }))
    .sort((a, b) => b.champion - a.champion || b.final - a.final || b.round16 - a.round16);
}

function simulateKnockout() {
  const tables = allGroupTables();
  const round32 = knockoutMap.map((match) => {
    const teamA = predictedSlot(match.slotA, tables);
    const teamB = predictedSlot(match.slotB, tables);
    const winner = pickWinner(teamA, teamB);
    return { ...match, teamA, teamB, winner };
  });
  const byMatch = Object.fromEntries(round32.map((match) => [match.match, match.winner]));
  const makeMatch = (match, a, b) => {
    const teamA = byMatch[a] ?? a;
    const teamB = byMatch[b] ?? b;
    const winner = pickWinner(teamA, teamB);
    byMatch[match] = winner;
    return { match, teamA, teamB, winner };
  };

  const round16 = [
    makeMatch(89, 74, 77),
    makeMatch(90, 73, 75),
    makeMatch(91, 76, 78),
    makeMatch(92, 79, 80),
    makeMatch(93, 83, 84),
    makeMatch(94, 81, 82),
    makeMatch(95, 86, 88),
    makeMatch(96, 85, 87)
  ];
  const quarters = [
    makeMatch(97, 89, 90),
    makeMatch(98, 93, 94),
    makeMatch(99, 91, 92),
    makeMatch(100, 95, 96)
  ];
  const semis = [makeMatch(101, 97, 98), makeMatch(102, 99, 100)];
  const final = makeMatch(104, 101, 102);

  return { round32, round16, quarters, semis, final };
}

function renderGroupTable() {
  const group = $("groupSelect").value;
  const groupRows = calculateGroup(group);
  const rows = groupRows.map((row, index) => {
    const className = index < 2 ? "qualified" : index === 2 ? "third-watch" : "";
    return `
      <tr class="${className}">
        <td>${index + 1}</td>
        <td>${teamBadge(row.team)}</td>
        <td>${row.points.toFixed(2)}</td>
        <td>${row.goalsFor.toFixed(2)}</td>
        <td>${row.goalsAgainst.toFixed(2)}</td>
        <td>${Math.round(row.rating)}</td>
        <td>${Math.round(riskScore(row.team))}</td>
      </tr>
    `;
  });
  $("groupTable").innerHTML = rows.join("");
  $("groupFixtures").innerHTML = state.fixtures
    .filter((fixture) => fixture.group === group)
    .map((fixture) => {
      const a = findTeam(fixture.a);
      const b = findTeam(fixture.b);
      const result = predictMatch(a, b, { drawWeight: 0.24, homeBoost: Boolean(a.host) });
      const score = scoreDistribution(result.goalsA, result.goalsB)[0];
      const lean = result.winA >= result.winB && result.winA >= result.draw ? a.name : result.winB >= result.draw ? b.name : "平局";
      return `
        <div class="fixture-row">
          <strong>${teamBadge(a)} vs ${teamBadge(b)}</strong>
          <span>${fixture.match ?? ""} · ${score.a}-${score.b} · ${lean} · ${fixture.city ?? "待定"} · ${fixture.matchday}轮</span>
        </div>
      `;
    })
    .join("");
  $("groupRace").innerHTML = groupRows.map((row, index) => {
    const status = index < 2 ? "直接出线区" : index === 2 ? "最佳第三竞争" : "淘汰风险";
    const tone = index < 2 ? "safe" : index === 2 ? "watch" : "danger";
    return `
      <div class="race-row ${tone}">
        <span>${index + 1}. ${teamBadge(row.team)}</span>
        <strong>${status}</strong>
      </div>
    `;
  }).join("");
  renderTeamRoute();
  renderUpsetWatch(group);
  renderKeyMatches(group);
  renderGroupReality(group, groupRows);
}

function renderGroupReality(group, groupRows = calculateGroup(group)) {
  const fixtures = state.fixtures.filter((fixture) => fixture.group === group);
  const avgPressure = fixtures.reduce((total, fixture) => total + fixturePressure(fixture), 0) / Math.max(1, fixtures.length);
  const third = groupRows[2];
  const second = groupRows[1];
  const fourth = groupRows[3];
  const gapToSecond = second && third ? second.points - third.points : 0;
  const gapToFourth = third && fourth ? third.points - fourth.points : 0;
  const coinFlipMatches = fixtures
    .map((fixture) => {
      const a = findTeam(fixture.a);
      const b = findTeam(fixture.b);
      const result = predictMatch(a, b, { drawWeight: 0.24, homeBoost: Boolean(a.host) });
      const maxProb = Math.max(result.winA, result.draw, result.winB);
      return { fixture, uncertainty: 1 - maxProb, result };
    })
    .sort((a, b) => b.uncertainty - a.uncertainty);
  const swing = coinFlipMatches[0];
  const hostGames = fixtures.filter((fixture) => findTeam(fixture.a)?.host || findTeam(fixture.b)?.host).length;
  $("groupReality").innerHTML = [
    ["第三名边界", third ? `${third.team.name} ${third.points.toFixed(2)}分` : "-", gapToSecond <= 0.55 ? "第二/第三很近" : `距第二 ${gapToSecond.toFixed(2)}分`],
    ["淘汰线压力", gapToFourth <= 0.55 ? "非常紧" : "相对清楚", fourth ? `领先第四 ${gapToFourth.toFixed(2)}分` : "-"],
    ["最摇摆比赛", swing ? `${swing.fixture.a} vs ${swing.fixture.b}` : "-", swing ? `不确定度 ${formatProb(swing.uncertainty)}` : "-"],
    ["赛程压力", avgPressure.toFixed(1), hostGames ? `${hostGames} 场涉及东道主` : "无东道主场次"]
  ].map(([label, value, note]) => `
    <article class="reality-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${note}</small>
    </article>
  `).join("");
}

function focusMatchItems() {
  return state.fixtures
    .map((fixture) => {
      const a = findTeam(fixture.a);
      const b = findTeam(fixture.b);
      const result = predictMatch(a, b, { drawWeight: 0.24, homeBoost: Boolean(a.host) });
      const score = scoreDistribution(result.goalsA, result.goalsB)[0];
      const strength = (teamScore(a) + teamScore(b)) / 2;
      const uncertainty = 1 - Math.max(result.winA, result.draw, result.winB);
      const upset = matchStory(a, b, result).upsetRisk;
      const pressure = fixturePressure(fixture);
      const value = strength / 1200 + uncertainty * 1.15 + upset * 0.8 + pressure / 42;
      const type = strength >= 980 ? "强强战" : upset >= 0.45 ? "潜在冷门" : uncertainty >= 0.45 ? "五五开" : "出线关键";
      return { fixture, a, b, result, score, value, type, uncertainty, upset };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
}

function renderFocusMatches() {
  $("focusMatches").innerHTML = focusMatchItems().map((item) => {
    const lean = item.result.winA >= item.result.winB && item.result.winA >= item.result.draw
      ? item.a.name
      : item.result.winB >= item.result.draw
        ? item.b.name
        : "平局";
    return `
      <article class="focus-match-card">
        <div>
          <span>${item.type} · ${item.fixture.match ?? ""}</span>
          <strong>${teamBadge(item.a)} vs ${teamBadge(item.b)}</strong>
          <small>${item.fixture.date ?? "日期待定"} · ${item.fixture.city ?? "城市待定"} · ${item.fixture.stadium ?? "球场待定"}</small>
        </div>
        <b>${item.score.a}-${item.score.b}</b>
        <footer>
          <span>倾向 ${lean}</span>
          <span>冷门 ${formatProb(item.upset)}</span>
          <span>悬念 ${formatProb(item.uncertainty)}</span>
        </footer>
      </article>
    `;
  }).join("");
}

function renderKeyMatches(group) {
  const rows = calculateGroup(group);
  const fixtures = state.fixtures
    .filter((fixture) => fixture.group === group)
    .map((fixture) => {
      const a = findTeam(fixture.a);
      const b = findTeam(fixture.b);
      const result = predictMatch(a, b, { drawWeight: 0.24, homeBoost: Boolean(a.host) });
      const score = scoreDistribution(result.goalsA, result.goalsB)[0];
      const rankA = rows.findIndex((row) => row.team.name === a.name) + 1;
      const rankB = rows.findIndex((row) => row.team.name === b.name) + 1;
      const rankPressure = 1 / Math.max(1, Math.abs(rankA - rankB));
      const swing = 1 - Math.max(result.winA, result.winB, result.draw);
      const importance = swing + rankPressure + (rankA <= 3 || rankB <= 3 ? 0.35 : 0);
      const label = rankA <= 2 && rankB <= 2 ? "争第一" : rankA <= 3 || rankB <= 3 ? "出线关键" : "抢分战";
      return { fixture, score, importance, label };
    })
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 3);

  $("keyMatches").innerHTML = fixtures.map((item) => `
    <article class="key-match-row">
      <div>
        <strong>${item.fixture.a} vs ${item.fixture.b}</strong>
        <span>${item.fixture.match ?? ""} · ${item.label} · ${item.fixture.city ?? "待定"} · 压力 ${fixturePressure(item.fixture)}</span>
      </div>
      <b>${item.score.a}-${item.score.b}</b>
    </article>
  `).join("");
}

function upsetReason(favorite, underdog, result, upsetChance) {
  const reasons = [];
  if (result.draw >= 0.26) reasons.push("平局权重高");
  if (riskScore(favorite) - riskScore(underdog) > 8) reasons.push("热门风险更高");
  if ((underdog.setPieces ?? 70) - (favorite.setPieces ?? 70) > 4) reasons.push("弱队定位球有优势");
  if ((underdog.climateFit ?? 70) - (favorite.climateFit ?? 70) > 8) reasons.push("弱队气候更适应");
  if (upsetChance >= 0.36) reasons.push("胜平合计接近");
  return reasons.slice(0, 2).join(" / ") || "实力差距不算保险";
}

function renderUpsetWatch(group) {
  const items = state.fixtures
    .filter((fixture) => fixture.group === group)
    .map((fixture) => {
      const a = findTeam(fixture.a);
      const b = findTeam(fixture.b);
      const result = predictMatch(a, b, { drawWeight: 0.24, homeBoost: Boolean(a.host) });
      const favorite = result.winA >= result.winB ? a : b;
      const underdog = favorite.name === a.name ? b : a;
      const underdogWin = favorite.name === a.name ? result.winB : result.winA;
      const upsetChance = clamp(underdogWin + result.draw * 0.55 + (riskScore(favorite) - riskScore(underdog)) / 300, 0, 1);
      const level = upsetChance >= 0.42 ? "高" : upsetChance >= 0.32 ? "中" : "低";
      return {
        fixture,
        favorite,
        underdog,
        upsetChance,
        level,
        reason: upsetReason(favorite, underdog, result, upsetChance)
      };
    })
    .sort((a, b) => b.upsetChance - a.upsetChance)
    .slice(0, 4);

  $("upsetWatch").innerHTML = items.map((item) => `
    <article class="upset-row ${item.level === "高" ? "hot" : item.level === "中" ? "warm" : ""}">
      <div>
        <strong>${teamBadge(item.underdog)} 不败 ${formatProb(item.upsetChance)}</strong>
        <span>${item.fixture.a} vs ${item.fixture.b} · ${item.fixture.city ?? "待定"}</span>
      </div>
      <small>${item.level}风险 · ${item.reason}</small>
    </article>
  `).join("");
}

function renderTeamRoute() {
  const team = findTeam($("teamA").value);
  if (!team) return;
  const fixtures = state.fixtures.filter((fixture) => fixture.a === team.name || fixture.b === team.name);
  let expectedPoints = 0;
  let totalPressure = 0;
  let hardestMatch = null;
  $("teamRouteTitle").textContent = `${team.name} 小组路径`;
  $("teamRouteSubtitle").textContent = `${team.group}组 · FIFA排名 ${team.fifaRank} · 模型评分 ${Math.round(teamScore(team))}`;
  $("teamRoute").innerHTML = fixtures.map((fixture) => {
    const opponentName = fixture.a === team.name ? fixture.b : fixture.a;
    const opponent = findTeam(opponentName);
    const isA = fixture.a === team.name;
    const result = isA
      ? predictMatch(team, opponent, { drawWeight: 0.24, homeBoost: Boolean(team.host) })
      : predictMatch(opponent, team, { drawWeight: 0.24, homeBoost: Boolean(opponent.host) });
    const teamWin = isA ? result.winA : result.winB;
    const draw = result.draw;
    const teamGoals = isA ? result.goalsA : result.goalsB;
    const oppGoals = isA ? result.goalsB : result.goalsA;
    const score = scoreDistribution(result.goalsA, result.goalsB)[0];
    const shownScore = isA ? `${score.a}-${score.b}` : `${score.b}-${score.a}`;
    const points = teamWin * 3 + draw;
    const pressure = fixturePressure(fixture) + (teamScore(opponent) / 180);
    totalPressure += pressure;
    if (!hardestMatch || pressure > hardestMatch.pressure) hardestMatch = { name: opponent.name, pressure };
    expectedPoints += points;
    const difficulty = teamWin >= 0.62 ? "优势局" : teamWin >= 0.42 ? "五五开" : "硬仗";
    return `
      <article class="route-card">
        <span>${fixture.match ?? ""} · ${team.name} vs ${opponent.name} · ${fixture.date ?? "日期待定"} · ${fixture.city ?? "城市待定"}</span>
        <strong>${shownScore}</strong>
        <small>${difficulty} · 预期 ${points.toFixed(2)} 分 · xG ${teamGoals.toFixed(2)}-${oppGoals.toFixed(2)} · ${fixture.stadium ?? "球场待定"}</small>
      </article>
    `;
  }).join("") + `
    <article class="route-card route-total">
      <span>小组预期积分</span>
      <strong>${expectedPoints.toFixed(2)}</strong>
      <small>${expectedPoints >= 5.6 ? "出线非常稳" : expectedPoints >= 4.2 ? "出线机会较好" : "需要抢关键分"}</small>
    </article>
  `;
  $("scheduleStrength").innerHTML = `
    <div><span>赛程压力</span><strong>${(totalPressure / fixtures.length).toFixed(1)}</strong></div>
    <div><span>最难对手</span><strong>${hardestMatch?.name ?? "-"}</strong></div>
    <div><span>赛程数据</span><strong>${fixtures.every((fixture) => fixture.source === "official") ? "官方" : "部分建模"}</strong></div>
  `;
}

function renderSummary() {
  const ranked = state.teams.slice().sort((a, b) => teamScore(b) - teamScore(a));
  const bestAttack = state.teams.slice().sort((a, b) => b.attack - a.attack)[0];
  const bestDefense = state.teams.slice().sort((a, b) => b.defense - a.defense)[0];
  const groupStrength = allGroupTables()
    .map(({ group, rows }) => ({
      group,
      score: rows.reduce((total, row) => total + teamScore(row.team), 0) / rows.length,
      topThree: rows.slice(0, 3).map((row) => row.team.name).join(" / ")
    }))
    .sort((a, b) => b.score - a.score)[0];
  $("favoriteTeam").textContent = ranked[0]?.name ?? "-";
  $("favoriteReason").textContent = ranked[0] ? `综合评分 ${Math.round(teamScore(ranked[0]))}` : "等待数据";
  $("bestAttack").textContent = bestAttack ? `${bestAttack.name} ${bestAttack.attack}` : "-";
  $("bestDefense").textContent = bestDefense ? `${bestDefense.name} ${bestDefense.defense}` : "-";
  $("datasetSize").textContent = `${state.teams.length} 支球队`;
  $("fixtureCount").textContent = `${state.fixtures.length} 场小组赛`;
  $("dataUpdatedAt").textContent = `${state.lastUpdated ?? "未知"} · ${state.sourceNote ?? "本地数据"}`;
  $("strengthDataStatus").textContent = `Elo 每日同步 ${externalData.eloDate ?? "未接入"} · 排名 ${externalData.rankingDate ?? "未标注"} · 赔率静态参数 ${externalData.oddsDate ?? "估算"} · 风格模型 ${externalData.styleDate ?? "估算"}`;
  $("groupOfDeath").textContent = groupStrength ? `${groupStrength.group}组` : "-";
  $("groupOfDeathReason").textContent = groupStrength ? groupStrength.topThree : "强队密度最高";
  renderDataCredibility();
}

function renderDataCredibility() {
  const quality = state.dataQuality ?? sampleData.dataQuality ?? {};
  const officialFixtures = state.fixtures.filter((fixture) => fixture.source === "official").length;
  const confirmed = quality.confirmed ?? [];
  const estimated = quality.estimated ?? [];
  const nextFeeds = quality.nextFeeds ?? [];
  $("dataCredibility").innerHTML = `
    <article class="credibility-card solid">
      <span>真实数据</span>
      <strong>${officialFixtures}/${state.fixtures.length} 场赛程</strong>
      <small>${confirmed.slice(0, 3).join(" / ")}</small>
    </article>
    <article class="credibility-card">
      <span>模型估算</span>
      <strong>${estimated.length} 项</strong>
      <small>${estimated.join(" / ")}</small>
    </article>
    <article class="credibility-card">
      <span>赔率来源</span>
      <strong>${externalData.oddsDate ?? "估算"}</strong>
      <small>${externalData.oddsSource ?? "本地赔率参数，不是实时盘口"}</small>
    </article>
    <article class="credibility-card">
      <span>下一步可接入</span>
      <strong>${nextFeeds.length} 类数据源</strong>
      <small>${nextFeeds.join(" / ")}</small>
    </article>
  `;
}

function renderContenders() {
  const ranked = state.teams.slice().sort((a, b) => teamScore(b) - teamScore(a)).slice(0, 10);
  const max = teamScore(ranked[0] ?? { elo: 1, attack: 1, defense: 1, form: 1 });
  $("contenders").innerHTML = ranked
    .map((team) => {
      const score = teamScore(team);
      const width = Math.max(16, (score / max) * 100);
      return `
        <div class="contender-row">
          <strong>${team.name}</strong>
          <div class="rating-track"><span style="width:${width}%"></span></div>
          <small>${Math.round(score)}</small>
        </div>
      `;
    })
    .join("");
}

function renderFactorWeights() {
  $("factorWeights").innerHTML = factorWeights
    .map((factor) => `
      <div class="weight-item">
        <span>${factor.label}</span>
        <strong>${Math.round(factor.weight * 100)}%</strong>
      </div>
    `)
    .join("");
}

function renderPrediction() {
  const teamA = findTeam($("teamA").value);
  const teamB = findTeam($("teamB").value);
  if (!teamA || !teamB || teamA.name === teamB.name) return;

  const result = predictMatch(teamA, teamB, { homeBoost: $("homeBoost").checked });
  const story = matchStory(teamA, teamB, result);
  const topScore = story.distribution[0];
  $("scoreline").innerHTML = `${teamBadge(teamA)} <span>${topScore.a} : ${topScore.b}</span> ${teamBadge(teamB)}`;
  $("scoreAlternates").innerHTML = story.distribution.slice(1, 3).map((score, index) => `
    <span>备选${index + 1}：${teamA.name} ${score.a}-${score.b} ${teamB.name} · ${formatProb(score.probability)}</span>
  `).join("");
  $("xgLine").textContent = `${result.goalsA.toFixed(2)} - ${result.goalsB.toFixed(2)}`;
  $("confidenceLine").textContent = `${story.favorite} ${formatProb(story.confidence)}`;
  $("upsetRiskLine").textContent = formatProb(story.upsetRisk);
  $("tempoLine").textContent = story.tempo;
  $("labelWinA").textContent = `${teamA.name} 胜`;
  $("labelWinB").textContent = `${teamB.name} 胜`;
  $("probWinA").textContent = formatPct(result.winA);
  $("probDraw").textContent = formatPct(result.draw);
  $("probWinB").textContent = formatPct(result.winB);
  $("barWinA").style.width = formatPct(result.winA);
  $("barDraw").style.width = formatPct(result.draw);
  $("barWinB").style.width = formatPct(result.winB);
  $("matchFactors").innerHTML = result.factors.slice(0, 6).map((factor) => {
    const leader = factor.impact >= 0 ? teamA.name : teamB.name;
    const tone = factor.impact >= 0 ? "positive" : "negative";
    return `
      <div class="factor-row ${tone}">
        <span>${factor.label}</span>
        <strong>${leader} ${Math.abs(factor.impact).toFixed(1)}</strong>
      </div>
    `;
  }).join("");
  $("scoreDistribution").innerHTML = story.distribution.slice(0, 5).map((score) => `
    <div class="score-chip">
      <strong>${score.a}-${score.b}</strong>
      <span>${formatProb(score.probability)}</span>
    </div>
  `).join("");
  const report = preMatchReport(teamA, teamB, result, story);
  $("preMatchReport").innerHTML = `
    <article class="report-main">
      <span>预测倾向</span>
      <strong>${report.lean}</strong>
      <small>模型可信度 ${report.confidenceText} · ${formatProb(report.modelCertainty)}</small>
    </article>
    <article>
      <span>推荐比分</span>
      <strong>${report.scoreText} / ${report.altScoreText}</strong>
      <small>来自泊松比分分布前两档</small>
    </article>
    <article>
      <span>思路</span>
      <strong>${report.bettingLean}</strong>
      <small>${report.riskNote}</small>
    </article>
    <article>
      <span>爆冷条件</span>
      <strong>${upsetProfile(teamA, teamB, result, story).underdog.name}</strong>
      <small>${report.upsetTrigger}</small>
    </article>
  `;
  const upset = upsetProfile(teamA, teamB, result, story);
  $("upsetExplainer").innerHTML = `
    <div class="upset-headline">
      <strong>${upset.underdog.name} 爆冷/不败观察</strong>
      <span>${upset.level} · 弱队胜 ${formatProb(upset.underdogWin)}</span>
    </div>
    ${upset.points.map((point) => `
      <div class="upset-factor">
        <span>${point.label}</span>
        <i><b style="width:${formatPct(point.value)}"></b></i>
        <small>${point.note}</small>
      </div>
    `).join("")}
  `;
  $("tacticalMatchup").innerHTML = tacticalProfile(teamA, teamB, result).map((row) => `
    <article class="tactical-row">
      <span>${row.label}</span>
      <strong>${teamA.name}：${row.aText}</strong>
      <strong>${teamB.name}：${row.bText}</strong>
      <small>倾向 ${row.lean}</small>
    </article>
  `).join("");
  $("modelInputs").innerHTML = [
    ["FIFA排名", teamA.fifaRank, teamB.fifaRank],
    ["Elo强度", teamA.elo, teamB.elo],
    ["进攻/防守", `${teamA.attack}/${teamA.defense}`, `${teamB.attack}/${teamB.defense}`],
    ["近期状态", teamA.form, teamB.form],
    ["伤病影响", teamA.injury, teamB.injury],
    ["阵容深度", teamA.squadValue, teamB.squadValue],
    ["门将/定位球", `${teamA.goalkeeper}/${teamA.setPieces}`, `${teamB.goalkeeper}/${teamB.setPieces}`],
    ["休息/旅途", `${teamA.restDays}天/${teamA.travelFatigue}`, `${teamB.restDays}天/${teamB.travelFatigue}`],
    ["气候适应", teamA.climateFit, teamB.climateFit],
    ["赔率校准", teamA.marketOdds, teamB.marketOdds]
  ].map(([label, a, b]) => `
    <div class="input-row">
      <span>${label}</span>
      <strong>${teamA.name}: ${a}</strong>
      <strong>${teamB.name}: ${b}</strong>
    </div>
  `).join("");
  renderSelectedTeamOutlook();
}

function renderBracket() {
  const bracket = simulateKnockout();
  $("championPath").textContent = `${bracket.final.winner}：32强 → 16强 → 8强 → 半决赛 → 决赛`;
  const matchWinProb = (match) => {
    const teamA = findTeam(cleanTeamName(match.teamA));
    const teamB = findTeam(cleanTeamName(match.teamB));
    if (!teamA || !teamB) return "";
    const result = predictMatch(teamA, teamB, { drawWeight: 0.2, homeBoost: Boolean(teamA.host) });
    const winnerProb = match.winner === teamA.name ? result.winA : result.winB;
    return `<small>晋级 ${formatProb(winnerProb)}</small>`;
  };
  const renderMatch = (match, compact = false) => `
    <article class="tree-match ${compact ? "compact-match" : ""}">
      <span class="tree-id">M${match.match}</span>
      <div class="tree-team ${match.winner === cleanTeamName(match.teamA) ? "winner" : ""}">
        <span>${teamNameMarkup(match.teamA)}</span>
      </div>
      <div class="tree-team ${match.winner === cleanTeamName(match.teamB) ? "winner" : ""}">
        <span>${teamNameMarkup(match.teamB)}</span>
      </div>
      <footer>
        <strong>${match.winner}</strong>
        ${matchWinProb(match)}
      </footer>
    </article>
  `;
  const columns = [
    ["32强", bracket.round32, false],
    ["16强", bracket.round16, false],
    ["8强", bracket.quarters, false],
    ["半决赛", bracket.semis, true],
    ["决赛", [bracket.final], true]
  ];
  $("bracketTree").innerHTML = columns.map(([title, matches, compact]) => `
    <section class="tree-round">
      <h3>${title}</h3>
      <div class="tree-matches">${matches.map((match) => renderMatch(match, compact)).join("")}</div>
    </section>
  `).join("");
}

function renderSimulation(iterations = 1500) {
  if (iterations) {
    $("simStatus").textContent = `正在模拟 ${iterations} 次...`;
    latestSimulation = runMonteCarlo(iterations);
  }
  const groupFilter = $("simGroupFilter")?.value ?? "all";
  const sortMode = $("simSort")?.value ?? "champion";
  let results = latestSimulation.slice();
  if (groupFilter !== "all") results = results.filter((row) => row.team.group === groupFilter);
  if (sortMode === "round32") {
    results.sort((a, b) => b.round32 - a.round32 || b.round16 - a.round16);
  } else if (sortMode === "darkhorse") {
    results.sort((a, b) => (b.champion / Math.max(1, b.team.fifaRank)) - (a.champion / Math.max(1, a.team.fifaRank)));
  } else {
    results.sort((a, b) => b.champion - a.champion || b.final - a.final || b.round16 - a.round16);
  }
  const champion = latestSimulation[0];
  $("simStatus").textContent = iterations ? `已完成 ${iterations} 次随机模拟` : "已按当前筛选更新";
  $("simChampion").textContent = champion ? `最高夺冠概率：${champion.team.name} ${formatProb(champion.champion)}` : "-";
  $("simulationTable").innerHTML = results.slice(0, 24).map((row) => `
    <tr>
      <td>${teamBadge(row.team)}</td>
      <td>${row.team.group}</td>
      <td>${formatProb(row.groupWinner)}</td>
      <td>${formatProb(row.round32)}</td>
      <td>${formatProb(row.round16)}</td>
      <td>${formatProb(row.quarter)}</td>
      <td>${formatProb(row.semi)}</td>
      <td>${formatProb(row.final)}</td>
      <td><strong>${formatProb(row.champion)}</strong></td>
    </tr>
  `).join("");
  renderSelectedTeamOutlook();
}

function currentReportText() {
  const teamA = findTeam($("teamA").value);
  const teamB = findTeam($("teamB").value);
  const result = predictMatch(teamA, teamB, { homeBoost: $("homeBoost").checked });
  const story = matchStory(teamA, teamB, result);
  const score = story.distribution[0];
  const group = $("groupSelect").value;
  const groupRows = calculateGroup(group);
  const champion = latestSimulation[0];
  const focus = focusMatchItems();
  const isEn = currentLanguage === "en";
  return [
    isEn ? "2026 World Cup Forecast Report" : "2026世界杯预测报告",
    `${isEn ? "Generated" : "生成时间"}：${new Date().toLocaleString(isEn ? "en-US" : "zh-CN")}`,
    "",
    isEn ? "[Single-match forecast]" : "【单场预测】",
    `${tn(teamA.name)} vs ${tn(teamB.name)}`,
    `${isEn ? "Recommended score" : "推荐比分"}：${score.a}-${score.b}`,
    `${isEn ? "W-D-L" : "胜平负"}：${tn(teamA.name)} ${formatProb(result.winA)} / ${isEn ? "Draw" : "平"} ${formatProb(result.draw)} / ${tn(teamB.name)} ${formatProb(result.winB)}`,
    `xG：${result.goalsA.toFixed(2)} - ${result.goalsB.toFixed(2)}，${isEn ? "upset risk" : "冷门风险"}：${formatProb(story.upsetRisk)}`,
    "",
    isEn ? `[Group ${group} qualification]` : `【${group}组出线】`,
    ...groupRows.map((row, index) => `${index + 1}. ${tn(row.team.name)} ${row.points.toFixed(2)}${isEn ? " pts" : "分"} GF ${row.goalsFor.toFixed(2)} GA ${row.goalsAgainst.toFixed(2)}`),
    "",
    isEn ? "[Featured matches]" : "【焦点比赛】",
    ...focus.map((item, index) => `${index + 1}. ${tn(item.fixture.a)} vs ${tn(item.fixture.b)} · ${richTranslate(item.type)} · ${isEn ? "pick" : "推荐"} ${item.score.a}-${item.score.b} · ${isEn ? "upset" : "冷门"} ${formatProb(item.upset)}`),
    "",
    isEn ? "[Champion probability]" : "【冠军概率】",
    champion ? `${isEn ? "Highest champion probability" : "最高夺冠概率"}：${tn(champion.team.name)} ${formatProb(champion.champion)}` : (isEn ? "Waiting for simulation" : "等待模拟"),
    "",
    isEn
      ? "Note: groups, schedule, and qualification format are structured data; Elo, injuries, odds, travel, and climate are model parameters."
      : "说明：分组、赛程、晋级规则为真实数据；Elo、伤病、赔率、旅途、气候等为模型参数。"
  ].join("\n");
}

function exportPredictionReport() {
  const blob = new Blob([currentReportText()], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `world-cup-forecast-${new Date().toISOString().slice(0, 10)}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function renderSelectedTeamOutlook() {
  const team = findTeam($("teamA").value);
  if (!team || !latestSimulation.length || !$("selectedTeamOutlook")) return;
  const row = latestSimulation.find((item) => item.team.name === team.name);
  if (!row) return;
  const items = [
    ["小组第一", row.groupWinner],
    ["进32强", row.round32],
    ["进16强", row.round16],
    ["进8强", row.quarter],
    ["进4强", row.semi],
    ["进决赛", row.final],
    ["夺冠", row.champion]
  ];
  $("selectedTeamOutlook").innerHTML = items.map(([label, value]) => `
    <div class="outlook-row">
      <span>${label}</span>
      <strong>${formatProb(value)}</strong>
      <i><b style="width:${Math.max(2, value * 100)}%"></b></i>
    </div>
  `).join("");
}

function teamFixtures(team) {
  return state.fixtures.filter((fixture) => fixture.a === team.name || fixture.b === team.name);
}

function teamOutlook(team) {
  return latestSimulation.find((item) => item.team.name === team.name);
}

function teamArchetype(team) {
  const tags = [];
  if (team.attack >= team.defense + 5) tags.push("主动进攻");
  if (team.defense >= team.attack + 5) tags.push("防守稳健");
  if ((team.setPieces ?? 70) >= 78) tags.push("定位球强");
  if ((team.goalkeeper ?? 70) >= 78) tags.push("门将托底");
  if ((team.form ?? 70) >= 78) tags.push("状态热");
  if ((team.climateFit ?? 70) >= 82) tags.push("环境适应好");
  if (team.host) tags.push("东道主加成");
  return tags.slice(0, 4).join(" / ") || "均衡型球队";
}

function teamRoleProfile(team) {
  return [
    {
      label: "核心攻击点",
      value: team.attack >= 82 ? "能持续制造高质量机会" : team.attack >= 70 ? "需要把握转换和定位球" : "进攻效率是上限关键",
      score: team.attack
    },
    {
      label: "中场控制",
      value: team.form >= 78 && team.coachStability >= 72 ? "比赛节奏和执行稳定" : team.form >= 68 ? "稳定性中等，容易受比分影响" : "需要降低失误率",
      score: Math.round((team.form + team.coachStability) / 2)
    },
    {
      label: "防线/门将",
      value: team.defense >= 78 || team.goalkeeper >= 78 ? "低比分抗压能力较强" : "防线容错率一般",
      score: Math.round((team.defense + team.goalkeeper) / 2)
    }
  ];
}

function groupProjection(team) {
  const rows = calculateGroup(team.group);
  const index = rows.findIndex((row) => row.team.name === team.name);
  const row = rows[index];
  const status = index < 2 ? "预计直接晋级32强" : index === 2 ? "预计竞争最佳第三" : "预计处在淘汰边缘";
  return { rows, index, row, status };
}

function possibleRound32Match(team) {
  const projection = groupProjection(team);
  const slot = projection.index === 0 ? `${team.group}组第1` : projection.index === 1 ? `${team.group}组第2` : `${team.group}组第3`;
  const tables = allGroupTables();
  const match = knockoutMap.find((item) => {
    const candidates = [item.slotA, item.slotB];
    return candidates.some((candidate) => {
      if (projection.index < 2) return candidate === slot;
      return candidate.includes("第3") && candidate.includes(team.group);
    });
  });
  if (!match) return { label: "32强路径", value: "仍取决于最佳第三分配", note: projection.status };
  const opponentSlot = match.slotA === slot || (projection.index === 2 && match.slotA.includes("第3") && match.slotA.includes(team.group)) ? match.slotB : match.slotA;
  const opponent = predictedSlot(opponentSlot, tables);
  return {
    label: `M${match.match} · ${match.date ?? "待定"}`,
    value: `${slot} vs ${opponent}`,
    note: projection.index < 2 ? "按当前小组预测槽位" : "第三名路径存在组合变化"
  };
}

function teamThreats(team) {
  const fixtures = teamFixtures(team);
  const groupThreat = fixtures
    .map((fixture) => {
      const opponent = findTeam(fixture.a === team.name ? fixture.b : fixture.a);
      return { name: opponent.name, score: teamScore(opponent), fixture };
    })
    .sort((a, b) => b.score - a.score)[0];
  const knockout = simulateKnockout();
  const allMatches = [...knockout.round32, ...knockout.round16, ...knockout.quarters, ...knockout.semis, knockout.final];
  const pathMatch = allMatches.find((match) => [cleanTeamName(match.teamA), cleanTeamName(match.teamB), match.winner].includes(team.name));
  const pathOpponent = pathMatch
    ? cleanTeamName(pathMatch.teamA) === team.name ? cleanTeamName(pathMatch.teamB) : cleanTeamName(pathMatch.teamA)
    : "";
  return {
    groupThreat: groupThreat?.name ?? "-",
    pathOpponent: pathOpponent || "取决于小组排名",
    upsetPath: team.fifaRank > 35
      ? "低比分、防守纪律、定位球先进球"
      : "避免早失球，保持主力健康和比赛控制"
  };
}

function renderTeamDialog(teamName) {
  const team = findTeam(teamName);
  if (!team) return;
  const outlook = teamOutlook(team);
  const fixtures = teamFixtures(team);
  const projection = groupProjection(team);
  const round32 = possibleRound32Match(team);
  const threats = teamThreats(team);
  const roles = teamRoleProfile(team);
  const strengths = [
    ["进攻", team.attack],
    ["防守", team.defense],
    ["门将", team.goalkeeper],
    ["定位球", team.setPieces],
    ["阵容", team.squadValue],
    ["气候", team.climateFit]
  ].sort((a, b) => b[1] - a[1]);
  const risks = [
    ["伤病", team.injury],
    ["旅途", team.travelFatigue],
    ["赛程压力", fixtures.reduce((total, fixture) => total + fixturePressure(fixture), 0) / fixtures.length]
  ].sort((a, b) => b[1] - a[1]);

  $("dialogTeamName").innerHTML = `${teamBadge(team)} 详情报告`;
  $("dialogTeamMeta").textContent = `${team.group}组 · FIFA ${team.fifaRank} · Elo ${team.elo} · 夺冠赔率 ${team.marketOdds}`;
  $("teamDialogBody").innerHTML = `
    <section class="team-profile-hero">
      <article>
        <span>球队画像</span>
        <strong>${teamArchetype(team)}</strong>
        <small>${projection.status} · 预计小组第 ${projection.index + 1} · ${projection.row?.points.toFixed(2) ?? "-"} 分</small>
      </article>
      <article>
        <span>32强路径</span>
        <strong>${round32.value}</strong>
        <small>${round32.label} · ${round32.note}</small>
      </article>
      <article>
        <span>最怕的点</span>
        <strong>${threats.groupThreat}</strong>
        <small>潜在淘汰赛压力：${threats.pathOpponent}</small>
      </article>
    </section>
    <section class="dialog-grid">
      <article>
        <h3>晋级概率</h3>
        <div class="outlook-list">
          ${[
            ["小组第一", outlook?.groupWinner ?? 0],
            ["进32强", outlook?.round32 ?? 0],
            ["进16强", outlook?.round16 ?? 0],
            ["进8强", outlook?.quarter ?? 0],
            ["进4强", outlook?.semi ?? 0],
            ["进决赛", outlook?.final ?? 0],
            ["夺冠", outlook?.champion ?? 0]
          ].map(([label, value]) => `
            <div class="outlook-row">
              <span>${label}</span>
              <strong>${formatProb(value)}</strong>
              <i><b style="width:${Math.max(2, value * 100)}%"></b></i>
            </div>
          `).join("")}
        </div>
      </article>
      <article>
        <h3>关键位置</h3>
        <div class="role-list">
          ${roles.map((role) => `
            <div class="role-row">
              <span>${role.label}</span>
              <strong>${role.score}</strong>
              <small>${role.value}</small>
            </div>
          `).join("")}
        </div>
      </article>
      <article>
        <h3>强项</h3>
        <div class="factor-list">
          ${strengths.slice(0, 4).map(([label, value]) => `<div class="factor-row positive"><span>${label}</span><strong>${value}</strong></div>`).join("")}
        </div>
      </article>
      <article>
        <h3>风险</h3>
        <div class="factor-list">
          ${risks.map(([label, value]) => `<div class="factor-row negative"><span>${label}</span><strong>${Math.round(value)}</strong></div>`).join("")}
        </div>
      </article>
    </section>
    <section class="dialog-section">
      <h3>晋级路线判断</h3>
      <div class="route-scout-grid">
        <article>
          <span>小组排名</span>
          <strong>第 ${projection.index + 1}</strong>
          <small>${projection.status}</small>
        </article>
        <article>
          <span>可能32强对手</span>
          <strong>${round32.value}</strong>
          <small>${round32.note}</small>
        </article>
        <article>
          <span>爆冷/突围路径</span>
          <strong>${team.fifaRank > 35 ? "低比分路线" : "控制力路线"}</strong>
          <small>${threats.upsetPath}</small>
        </article>
      </div>
    </section>
    <section class="dialog-section">
      <h3>小组赛程</h3>
      <div class="fixture-list">
        ${fixtures.map((fixture) => {
          const opponent = findTeam(fixture.a === team.name ? fixture.b : fixture.a);
          const isA = fixture.a === team.name;
          const result = isA ? predictMatch(team, opponent, { drawWeight: 0.24, homeBoost: Boolean(team.host) }) : predictMatch(opponent, team, { drawWeight: 0.24, homeBoost: Boolean(opponent.host) });
          const score = scoreDistribution(result.goalsA, result.goalsB)[0];
          const shownScore = isA ? `${score.a}-${score.b}` : `${score.b}-${score.a}`;
          return `
            <div class="fixture-row">
              <strong>${fixture.match} · ${team.name} vs ${opponent.name}</strong>
              <span>${fixture.date} · ${fixture.city} · ${shownScore}</span>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
  $("teamDialog").showModal();
  applyLanguage();
}

function renderEditor() {
  $("dataEditor").value = JSON.stringify(state, null, 2);
}

function renderAll() {
  renderTeamOptions();
  renderGroups();
  renderSummary();
  renderFocusMatches();
  renderContenders();
  renderFactorWeights();
  renderGroupTable();
  renderPrediction();
  renderBracket();
  renderSimulation(800);
  renderEditor();
  applyLanguage();
}

function applyEditorData() {
  try {
    const next = JSON.parse($("dataEditor").value);
    if (!Array.isArray(next.teams) || !Array.isArray(next.fixtures)) {
      throw new Error("JSON 必须包含 teams 和 fixtures 数组");
    }
    state = next;
    renderAll();
    $("dataMessage").textContent = "数据已应用。";
  } catch (error) {
    $("dataMessage").textContent = `数据格式有问题：${error.message}`;
  }
}

function importDataFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const next = JSON.parse(String(reader.result));
      if (!Array.isArray(next.teams) || !Array.isArray(next.fixtures)) {
        throw new Error("JSON 必须包含 teams 和 fixtures 数组");
      }
      state = {
        ...next,
        lastUpdated: next.lastUpdated ?? new Date().toISOString().slice(0, 10),
        sourceNote: next.sourceNote ?? `导入文件：${file.name}`
      };
      renderAll();
      $("dataMessage").textContent = `已导入 ${file.name}`;
    } catch (error) {
      $("dataMessage").textContent = `导入失败：${error.message}`;
    }
  };
  reader.readAsText(file, "utf-8");
}

$("predictButton").addEventListener("click", renderPrediction);
$("languageSelect").addEventListener("change", () => {
  currentLanguage = $("languageSelect").value;
  localStorage.setItem("forecastLanguage", currentLanguage);
  renderAll();
});
$("teamA").addEventListener("change", () => {
  renderOpponentOptions();
  const team = findTeam($("teamA").value);
  if (team) $("groupSelect").value = team.group;
  renderGroupTable();
  renderPrediction();
  renderFocusMatches();
  applyLanguage();
});
$("teamB").addEventListener("change", () => {
  renderPrediction();
  applyLanguage();
});
$("drawWeight").addEventListener("input", () => {
  renderPrediction();
  applyLanguage();
});
$("homeBoost").addEventListener("change", () => {
  renderPrediction();
  applyLanguage();
});
$("groupSelect").addEventListener("change", () => {
  renderGroupTable();
  applyLanguage();
});
$("modelMode").addEventListener("change", () => {
  currentMode = $("modelMode").value;
  $("modeDescription").textContent = modeConfig[currentMode].label;
  renderSummary();
  renderFocusMatches();
  renderGroupTable();
  renderPrediction();
  renderBracket();
  renderSimulation(800);
  applyLanguage();
});
$("simGroupFilter").addEventListener("change", () => {
  renderSimulation(0);
  applyLanguage();
});
$("simSort").addEventListener("change", () => {
  renderSimulation(0);
  applyLanguage();
});
$("swapTeams").addEventListener("click", () => {
  const a = $("teamA").value;
  const b = $("teamB").value;
  $("teamA").value = b;
  renderOpponentOptions(a);
  renderPrediction();
  applyLanguage();
});
$("applyData").addEventListener("click", applyEditorData);
$("runSimulation").addEventListener("click", () => renderSimulation(1500));
$("exportReport").addEventListener("click", exportPredictionReport);
$("importDataFile").addEventListener("change", (event) => importDataFile(event.target.files[0]));
$("closeTeamDialog").addEventListener("click", () => $("teamDialog").close());
$("teamDialog").addEventListener("click", (event) => {
  if (event.target === $("teamDialog")) $("teamDialog").close();
});
document.addEventListener("click", (event) => {
  const badge = event.target.closest(".team-badge");
  if (!badge || badge.closest("#teamDialog")) return;
  renderTeamDialog(badge.dataset.team);
});
$("loadSample").addEventListener("click", () => {
  state = structuredClone(sampleData);
  renderAll();
  $("dataMessage").textContent = "已恢复 2026 真实分组数据。";
});
$("exportData").addEventListener("click", async () => {
  const text = JSON.stringify(state, null, 2);
  $("dataEditor").value = text;
  try {
    await navigator.clipboard.writeText(text);
    $("dataMessage").textContent = "当前数据已复制到剪贴板。";
  } catch {
    $("dataMessage").textContent = "当前数据已写入编辑框。";
  }
});

renderAll();
