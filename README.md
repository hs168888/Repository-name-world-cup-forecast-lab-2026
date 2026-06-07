# 世界杯预测工作台

一个可直接打开的 2026 世界杯预测 MVP。当前版本是静态网页，不需要安装依赖。

## 使用

直接双击 `index.html`，或在浏览器中打开它。

功能：

- 单场胜平负概率预测
- 预期比分
- 本场关键影响因素解释
- 模型模式切换：常规、冷门、市场赔率、主办国加成
- 2026 世界杯真实 A-L 分组总览
- 小组预期积分表
- 小组排名风险分
- 小组关键战和冷门观察
- 国旗标识、赛程城市、球场和赛程压力
- 32 强淘汰赛晋级图
- 蒙特卡洛晋级概率、筛选和排序
- 冠军竞争力排序
- 模型因素权重展示
- JSON 数据编辑、文件导入、恢复内置数据和导出
- 中英文切换
- 半自动数据更新脚本

## 数据说明

当前数据源优先读取 `data/worldcup-data.js`，页面仍可直接双击打开，不依赖本地服务器。球队评分、伤病、赔率、旅途疲劳等是模型参数，用来做预测，不代表 FIFA 官方实力评级。

`data/worldcup-data.js` 已包含 72 场小组赛 fixtures，字段包括日期、城市和球场；当前均标记为 `source: "official"`。球队评分、伤病、赔率、旅途疲劳等仍是模型参数。

页面也支持导入 JSON 文件。导入文件需要包含：

- `teams`: 球队数组
- `fixtures`: 小组赛赛程数组
- `lastUpdated`: 数据更新时间，可选
- `sourceNote`: 数据来源说明，可选

`data/worldcup-data.js` 还支持：

- `countryCodes`: 球队对应国旗代码
- `fixtureTemplate`: 小组赛轮次模板，含日期、城市、球场、来源
- `dataQuality`: 已确认数据、模型估算数据和后续可接入数据说明
- `teamOverrides`: 覆盖球队模型参数，例如 `elo`、`marketOdds`、`attack`、`defense`、`injury`
- `rankingDate` / `eloDate` / `oddsDate` / `styleDate`: 排名、Elo、赔率和风格参数日期

当前 `teamOverrides` 已覆盖 48 队的夺冠赔率和风格参数；热门队包含 Elo 覆盖值。Elo 日期仍标为 `model-estimate`，表示还没有接入完整真实 Elo 表。

## 数据更新

当前应用是静态离线网页，不会自动联网更新 FIFA 排名、赔率、伤病、赛果或实时新闻。

如果要更新数据，可以使用半自动脚本：

1. 复制 `data-updates/update-template.json`，例如复制成 `data-updates/2026-06-10.json`
2. 在 JSON 里填入要更新的 `fifaRanks`、`teamOverrides`、`fixtures` 或日期字段
3. 运行：

```bash
node scripts/update-data.js data-updates/2026-06-10.json
```

脚本会自动合并进 `data/worldcup-data.js`。它支持常见英文队名，例如 `France`、`Brazil`、`United States`，会自动映射成内部中文队名。

这比直接抓取网页更稳定，适合做售卖版或定期数据包。

2026 赛制：

- 12 个小组，A-L 组
- 每组 4 队
- 小组前 2 名直接晋级
- 12 个小组第 3 名里，成绩最好的 8 队晋级
- 32 强开始淘汰赛

`teams` 字段：

- `name`: 球队名
- `group`: 小组
- `elo`: 球队强度评分
- `fifaRank`: FIFA 排名
- `attack`: 进攻评分，0-100
- `defense`: 防守评分，0-100
- `form`: 近期状态，0-100
- `injury`: 伤病影响，数值越高越不利
- `squadValue`: 阵容身价/深度，0-100
- `tournamentExperience`: 大赛经验，0-100
- `coachStability`: 教练稳定性，0-100
- `goalkeeper`: 门将质量，0-100
- `setPieces`: 定位球能力，0-100
- `travelFatigue`: 旅途疲劳，数值越高越不利
- `restDays`: 赛前休息天数
- `climateFit`: 气候适应，0-100
- `marketOdds`: 市场夺冠赔率，用于校准
- `host`: 是否主办国，可选

`fixtures` 字段：

- `match`: 比赛编号
- `group`: 小组
- `a`: A 队
- `b`: B 队
- `date`: 比赛日期，可选
- `city`: 城市，可选
- `stadium`: 球场，可选
- `matchday`: 小组赛第几轮，可选
- `source`: `official` 或 `schedule-model`，可选

## 后续方向

- 接入实时 FIFA 排名和 World Football Elo
- 接入市场赔率和伤病名单
- 做自动联网更新版本
