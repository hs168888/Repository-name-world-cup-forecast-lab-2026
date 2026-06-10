const fs = require("fs");
const https = require("https");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "worldcup-data.js");
const updatePath = path.join(root, "data-updates", "latest.json");
const eloUrl = "https://eloratings.net/latest.tsv";

const eloCodeMap = {
  MX: "墨西哥",
  ZA: "南非",
  KR: "韩国",
  CZ: "捷克",
  CA: "加拿大",
  CH: "瑞士",
  QA: "卡塔尔",
  BA: "波黑",
  BR: "巴西",
  MA: "摩洛哥",
  HT: "海地",
  SQ: "苏格兰",
  US: "美国",
  PY: "巴拉圭",
  AU: "澳大利亚",
  TR: "土耳其",
  DE: "德国",
  CW: "库拉索",
  CI: "科特迪瓦",
  EC: "厄瓜多尔",
  NL: "荷兰",
  JP: "日本",
  TN: "突尼斯",
  SE: "瑞典",
  BE: "比利时",
  EG: "埃及",
  IR: "伊朗",
  NZ: "新西兰",
  ES: "西班牙",
  CV: "佛得角",
  SA: "沙特阿拉伯",
  UY: "乌拉圭",
  FR: "法国",
  SN: "塞内加尔",
  NO: "挪威",
  IQ: "伊拉克",
  AR: "阿根廷",
  DZ: "阿尔及利亚",
  AT: "奥地利",
  JO: "约旦",
  PT: "葡萄牙",
  UZ: "乌兹别克斯坦",
  CO: "哥伦比亚",
  CD: "刚果民主共和国",
  EN: "英格兰",
  HR: "克罗地亚",
  GH: "加纳",
  PA: "巴拿马"
};

function readJsonData(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(
    raw
      .replace(/^\s*window\.WORLD_CUP_DATA\s*=\s*/, "")
      .replace(/;\s*$/, "")
  );
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      { headers: { "User-Agent": "WorldCupForecastLab/1.0 (+https://github.com/hs168888)" } },
      (response) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          response.resume();
          reject(new Error(`HTTP ${response.statusCode} from ${url}`));
          return;
        }

        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => resolve(body));
      }
    );

    request.setTimeout(30000, () => {
      request.destroy(new Error(`Timeout fetching ${url}`));
    });
    request.on("error", reject);
  });
}

function toIsoDate(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseEloRows(tsv) {
  const latestByCode = new Map();

  tsv
    .trim()
    .split(/\r?\n/)
    .forEach((line) => {
      const columns = line.split("\t");
      if (columns.length < 16) return;

      const [year, month, day, codeA, codeB, , , , , , eloA, eloB, , , rankA, rankB] = columns;
      const date = toIsoDate(year, month, day);
      [
        [codeA, eloA, rankA],
        [codeB, eloB, rankB]
      ].forEach(([code, elo, rank]) => {
        if (!code || latestByCode.has(code)) return;
        latestByCode.set(code, {
          elo: Number(elo),
          eloRank: Number(rank),
          eloUpdated: date
        });
      });
    });

  return latestByCode;
}

function buildUpdate(currentData, latestByCode) {
  const worldCupTeams = new Set(Object.values(currentData.groups || {}).flat());
  const teamOverrides = {};
  const fifaRanks = {};
  const dates = [];
  const missing = [];

  Object.entries(eloCodeMap).forEach(([code, teamName]) => {
    if (!worldCupTeams.has(teamName)) return;

    const elo = latestByCode.get(code);
    if (!elo || !Number.isFinite(elo.elo)) {
      missing.push(teamName);
      return;
    }

    teamOverrides[teamName] = {
      elo: elo.elo,
      eloRank: elo.eloRank,
      eloUpdated: elo.eloUpdated
    };
    fifaRanks[teamName] = elo.eloRank;
    dates.push(elo.eloUpdated);
  });

  if (missing.length) {
    throw new Error(`Missing Elo rows for: ${missing.join(", ")}`);
  }

  const newestDate = dates.sort().at(-1);
  const oldConfirmed = currentData.dataQuality?.confirmed || [];
  const oldEstimated = currentData.dataQuality?.estimated || [];
  const oldNextFeeds = currentData.dataQuality?.nextFeeds || [];

  return {
    lastUpdated: newestDate,
    rankingDate: newestDate,
    eloDate: newestDate,
    sourceLabel: `2026 真实分组与赛程；球队 Elo 与强弱排名每日自动同步 World Football Elo（${newestDate}）`,
    dataQuality: {
      confirmed: Array.from(new Set([...oldConfirmed, "World Football Elo 自动同步"])),
      estimated: oldEstimated.filter((item) => item !== "Elo" && item !== "Elo 未接完整真实表时使用模型估算"),
      nextFeeds: oldNextFeeds.filter((item) => item !== "World Football Elo" && item !== "实时 FIFA 排名")
    },
    fifaRanks,
    teamOverrides
  };
}

async function main() {
  const currentData = readJsonData(dataPath);
  const latestByCode = parseEloRows(await fetchText(eloUrl));
  const update = buildUpdate(currentData, latestByCode);

  fs.writeFileSync(updatePath, `${JSON.stringify(update, null, 2)}\n`, "utf8");

  console.log(`Fetched World Football Elo: ${Object.keys(update.teamOverrides).length} teams`);
  console.log(`Elo date: ${update.eloDate}`);
  console.log(`Wrote ${path.relative(root, updatePath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
