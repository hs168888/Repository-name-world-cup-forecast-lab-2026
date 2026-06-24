const fs = require("fs");
const https = require("https");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputPath = path.join(root, "data", "live-matches.json");
const apiKey = process.env.API_FOOTBALL_KEY;
const apiHost = "v3.football.api-sports.io";
const league = process.env.API_FOOTBALL_LEAGUE || "1";
const season = process.env.API_FOOTBALL_SEASON || "2026";
const publicWorldCupApi = "worldcup26.ir";

const teamNameMap = {
  Mexico: "墨西哥",
  "South Africa": "南非",
  "South Korea": "韩国",
  "Czech Republic": "捷克",
  Canada: "加拿大",
  "Bosnia and Herzegovina": "波黑",
  "United States": "美国",
  Paraguay: "巴拉圭",
  Haiti: "海地",
  Scotland: "苏格兰",
  Australia: "澳大利亚",
  Turkey: "土耳其",
  Brazil: "巴西",
  Morocco: "摩洛哥",
  Qatar: "卡塔尔",
  Switzerland: "瑞士",
  "Ivory Coast": "科特迪瓦",
  Ecuador: "厄瓜多尔",
  Germany: "德国",
  "Curaçao": "库拉索",
  Netherlands: "荷兰",
  Japan: "日本",
  Sweden: "瑞典",
  Tunisia: "突尼斯",
  Iran: "伊朗",
  "New Zealand": "新西兰",
  Spain: "西班牙",
  "Cape Verde": "佛得角",
  Belgium: "比利时",
  Egypt: "埃及",
  "Saudi Arabia": "沙特阿拉伯",
  Uruguay: "乌拉圭",
  France: "法国",
  Senegal: "塞内加尔",
  Iraq: "伊拉克",
  Norway: "挪威",
  Argentina: "阿根廷",
  Algeria: "阿尔及利亚",
  Austria: "奥地利",
  Jordan: "约旦",
  Portugal: "葡萄牙",
  "Democratic Republic of the Congo": "刚果民主共和国",
  England: "英格兰",
  Croatia: "克罗地亚",
  Uzbekistan: "乌兹别克斯坦",
  Colombia: "哥伦比亚",
  Ghana: "加纳",
  Panama: "巴拿马"
};

function writePayload(payload) {
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function todayPublicDate() {
  const value = process.env.LIVE_MATCH_DATE || todayIso();
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

function requestJson(pathname) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      {
        hostname: apiHost,
        path: pathname,
        headers: {
          "x-apisports-key": apiKey,
          "User-Agent": "WorldCupForecastLab/1.0"
        }
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`API-Football HTTP ${response.statusCode}: ${body.slice(0, 240)}`));
            return;
          }

          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(new Error(`Invalid API-Football JSON: ${error.message}`));
          }
        });
      }
    );

    request.setTimeout(30000, () => {
      request.destroy(new Error("API-Football request timed out"));
    });
    request.on("error", reject);
  });
}

function requestPublicJson(pathname) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      {
        hostname: publicWorldCupApi,
        path: pathname,
        headers: { "User-Agent": "WorldCupForecastLab/1.0" }
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`WorldCup26 public API HTTP ${response.statusCode}: ${body.slice(0, 240)}`));
            return;
          }

          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(new Error(`Invalid WorldCup26 public API JSON: ${error.message}`));
          }
        });
      }
    );

    request.setTimeout(30000, () => {
      request.destroy(new Error("WorldCup26 public API request timed out"));
    });
    request.on("error", reject);
  });
}

function normalizeFixture(item) {
  const fixture = item.fixture || {};
  const teams = item.teams || {};
  const goals = item.goals || {};
  const status = fixture.status || {};

  return {
    id: fixture.id,
    date: fixture.date,
    venue: fixture.venue?.name || "",
    city: fixture.venue?.city || "",
    status: {
      short: status.short || "NS",
      long: status.long || "Not Started",
      elapsed: status.elapsed ?? null
    },
    home: {
      name: teams.home?.name || "",
      logo: teams.home?.logo || "",
      winner: teams.home?.winner ?? null
    },
    away: {
      name: teams.away?.name || "",
      logo: teams.away?.logo || "",
      winner: teams.away?.winner ?? null
    },
    goals: {
      home: goals.home,
      away: goals.away
    }
  };
}

function publicStatus(game) {
  const elapsed = String(game.time_elapsed || "").toLowerCase();
  if (String(game.finished).toUpperCase() === "TRUE" || elapsed === "finished") {
    return { short: "FT", long: "Finished", elapsed: null };
  }

  if (elapsed === "notstarted") {
    return { short: "NS", long: "Not Started", elapsed: null };
  }

  const minute = Number.parseInt(elapsed, 10);
  return {
    short: Number.isFinite(minute) ? "LIVE" : "NS",
    long: Number.isFinite(minute) ? "Live" : elapsed || "Not Started",
    elapsed: Number.isFinite(minute) ? minute : null
  };
}

function normalizePublicGame(game) {
  const homeName = game.home_team_name_en || game.home_team_label || "Home";
  const awayName = game.away_team_name_en || game.away_team_label || "Away";
  const homeScore = Number.parseInt(game.home_score, 10);
  const awayScore = Number.parseInt(game.away_score, 10);

  return {
    id: game.id,
    date: game.local_date,
    venue: "",
    city: "",
    group: game.group,
    matchday: game.matchday,
    status: publicStatus(game),
    home: {
      name: teamNameMap[homeName] || homeName,
      logo: "",
      winner: null
    },
    away: {
      name: teamNameMap[awayName] || awayName,
      logo: "",
      winner: null
    },
    goals: {
      home: Number.isFinite(homeScore) ? homeScore : null,
      away: Number.isFinite(awayScore) ? awayScore : null
    }
  };
}

async function fetchPublicWorldCupMatches() {
  const payload = await requestPublicJson("/get/games");
  const games = payload.games || [];
  const groupGames = games
    .filter((game) => game.type === "group")
    .map(normalizePublicGame);
  const today = todayPublicDate();
  const todayMatches = groupGames.filter((match) => String(match.date || "").startsWith(today));

  if (todayMatches.length) {
    return todayMatches.sort(comparePublicMatchTime).slice(0, 8);
  }

  return groupGames
    .filter((match) => parsePublicDate(match.date) >= todayIso())
    .sort(comparePublicMatchTime)
    .slice(0, 8);
}

function parsePublicDate(value = "") {
  const [datePart] = value.split(" ");
  const [month, day, year] = datePart.split("/");
  if (!year || !month || !day) return "9999-12-31";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function comparePublicMatchTime(a, b) {
  return String(a.date || "").localeCompare(String(b.date || ""));
}

async function main() {
  if (!apiKey) {
    const matches = await fetchPublicWorldCupMatches();
    writePayload({
      lastUpdated: new Date().toISOString(),
      provider: "WorldCup26 public API",
      status: "ok_public",
      message: "Using a no-key public World Cup 2026 feed. Add API_FOOTBALL_KEY later for commercial live events.",
      matches
    });
    console.log(`API_FOOTBALL_KEY is not set; fetched ${matches.length} matches from public WorldCup26 API`);
    return;
  }

  const date = process.env.LIVE_MATCH_DATE || todayIso();
  const pathname = `/fixtures?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}&date=${encodeURIComponent(date)}`;
  const payload = await requestJson(pathname);
  const matches = (payload.response || []).map(normalizeFixture);

  writePayload({
    lastUpdated: new Date().toISOString(),
    provider: "API-Football",
    status: "ok",
    date,
    league,
    season,
    matches
  });

  console.log(`Fetched ${matches.length} live fixtures for ${date}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
