const fs = require("fs");
const https = require("https");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputPath = path.join(root, "data", "live-matches.json");
const apiKey = process.env.API_FOOTBALL_KEY;
const apiHost = "v3.football.api-sports.io";
const league = process.env.API_FOOTBALL_LEAGUE || "1";
const season = process.env.API_FOOTBALL_SEASON || "2026";

function writePayload(payload) {
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
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

async function main() {
  if (!apiKey) {
    writePayload({
      lastUpdated: new Date().toISOString(),
      provider: "API-Football",
      status: "needs_api_key",
      message: "Set API_FOOTBALL_KEY in GitHub Secrets to enable live World Cup fixtures.",
      matches: []
    });
    console.log("API_FOOTBALL_KEY is not set; wrote placeholder live-matches.json");
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
