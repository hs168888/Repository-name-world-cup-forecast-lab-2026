const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "worldcup-data.js");
const updatePath = path.resolve(process.argv[2] || path.join(root, "data-updates", "latest.json"));

const teamNameMap = {
  Mexico: "墨西哥",
  "South Africa": "南非",
  "South Korea": "韩国",
  Korea: "韩国",
  Czechia: "捷克",
  "Czech Republic": "捷克",
  Canada: "加拿大",
  Switzerland: "瑞士",
  Qatar: "卡塔尔",
  "Bosnia and Herzegovina": "波黑",
  Bosnia: "波黑",
  Brazil: "巴西",
  Morocco: "摩洛哥",
  Haiti: "海地",
  Scotland: "苏格兰",
  "United States": "美国",
  USA: "美国",
  Paraguay: "巴拉圭",
  Australia: "澳大利亚",
  Turkey: "土耳其",
  Turkiye: "土耳其",
  Germany: "德国",
  Curacao: "库拉索",
  "Cote d'Ivoire": "科特迪瓦",
  "Ivory Coast": "科特迪瓦",
  Ecuador: "厄瓜多尔",
  Netherlands: "荷兰",
  Japan: "日本",
  Tunisia: "突尼斯",
  Sweden: "瑞典",
  Belgium: "比利时",
  Egypt: "埃及",
  Iran: "伊朗",
  "New Zealand": "新西兰",
  Spain: "西班牙",
  "Cape Verde": "佛得角",
  "Saudi Arabia": "沙特阿拉伯",
  Uruguay: "乌拉圭",
  France: "法国",
  Senegal: "塞内加尔",
  Norway: "挪威",
  Iraq: "伊拉克",
  Argentina: "阿根廷",
  Algeria: "阿尔及利亚",
  Austria: "奥地利",
  Jordan: "约旦",
  Portugal: "葡萄牙",
  Uzbekistan: "乌兹别克斯坦",
  Colombia: "哥伦比亚",
  "DR Congo": "刚果民主共和国",
  "Congo DR": "刚果民主共和国",
  England: "英格兰",
  Croatia: "克罗地亚",
  Ghana: "加纳",
  Panama: "巴拿马"
};

const cityMap = {
  "Mexico City": "墨西哥城",
  Guadalajara: "瓜达拉哈拉",
  Atlanta: "亚特兰大",
  "Los Angeles": "洛杉矶",
  Monterrey: "蒙特雷",
  Toronto: "多伦多",
  Vancouver: "温哥华",
  Seattle: "西雅图",
  "East Rutherford": "东拉瑟福德",
  Philadelphia: "费城",
  "Kansas City": "堪萨斯城",
  Houston: "休斯敦",
  "Miami Gardens": "迈阿密花园",
  Arlington: "阿灵顿",
  "Santa Clara": "圣克拉拉",
  Foxborough: "福克斯伯勒",
  Inglewood: "英格尔伍德",
  Guadalupe: "瓜达卢佩",
  Zapopan: "萨波潘"
};

function readCurrentData() {
  const raw = fs.readFileSync(dataPath, "utf8");
  const jsonText = raw
    .replace(/^\s*window\.WORLD_CUP_DATA\s*=\s*/, "")
    .replace(/;\s*$/, "");
  return JSON.parse(jsonText);
}

function normalizeTeamName(name) {
  return teamNameMap[name] || name;
}

function normalizeCity(city) {
  return cityMap[city] || city;
}

function normalizeTeamObjectMap(input = {}) {
  return Object.fromEntries(
    Object.entries(input).map(([name, value]) => [normalizeTeamName(name), value])
  );
}

function mergeTeamOverrides(base = {}, update = {}) {
  const normalized = normalizeTeamObjectMap(update);
  const next = { ...base };
  Object.entries(normalized).forEach(([name, fields]) => {
    next[name] = { ...(next[name] || {}), ...fields };
  });
  return next;
}

function mergeFifaRanks(base = {}, update = {}) {
  const normalized = normalizeTeamObjectMap(update);
  return { ...base, ...normalized };
}

function mergeFixtures(base = [], updates = []) {
  if (!Array.isArray(updates) || !updates.length) return base;
  const byMatch = new Map(base.map((fixture) => [fixture.match, { ...fixture }]));
  updates.forEach((fixture) => {
    if (!fixture.match) return;
    const existing = byMatch.get(fixture.match) || {};
    byMatch.set(fixture.match, {
      ...existing,
      ...fixture,
      a: fixture.a ? normalizeTeamName(fixture.a) : existing.a,
      b: fixture.b ? normalizeTeamName(fixture.b) : existing.b,
      city: fixture.city ? normalizeCity(fixture.city) : existing.city
    });
  });
  return Array.from(byMatch.values());
}

function writeData(data) {
  const output = `window.WORLD_CUP_DATA = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(dataPath, output, "utf8");
}

function main() {
  if (!fs.existsSync(updatePath)) {
    throw new Error(`Update file not found: ${updatePath}`);
  }

  const current = readCurrentData();
  const update = JSON.parse(fs.readFileSync(updatePath, "utf8"));
  const next = { ...current };

  [
    "lastUpdated",
    "sourceLabel",
    "rankingDate",
    "eloDate",
    "oddsDate",
    "styleDate",
    "oddsSource",
    "styleSource"
  ].forEach((key) => {
    if (update[key] !== undefined) next[key] = update[key];
  });

  if (update.dataQuality) {
    next.dataQuality = {
      ...(next.dataQuality || {}),
      ...update.dataQuality
    };
  }

  next.fifaRanks = mergeFifaRanks(next.fifaRanks, update.fifaRanks);
  next.teamOverrides = mergeTeamOverrides(next.teamOverrides, update.teamOverrides);
  next.fixtures = mergeFixtures(next.fixtures, update.fixtures);

  writeData(next);

  console.log(`Updated ${path.relative(root, dataPath)}`);
  console.log(`Update source: ${path.relative(root, updatePath)}`);
  console.log(`Teams with overrides: ${Object.keys(next.teamOverrides || {}).length}`);
  console.log(`Fixtures: ${(next.fixtures || []).length}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

