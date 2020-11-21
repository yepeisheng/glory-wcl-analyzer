const apiKey = "2dd31d65c33dabb5d269c9d24c4a14ed";
const fixedQueries = `api_key=${apiKey}&translate=true`;
const wcl = "https://cn.classic.warcraftlogs.com/v1";

export const TABLE_TYPE = {
  SUMMARY: "summary",
  DAMAGE: "damage-done",
  DAMAGE_TAKEN: "damage-taken",
  HEALING: "healing",
  CASTS: "casts",
  SUMMONS: "summons",
  BUFFS: "buffs",
  DEBUFFS: "debuffs",
  DEATHS: "deaths",
  SURVIVABILITY: "survivability",
  RESOURCES: "resources",
  RESOURCE_GAINS: "resources-gains"
};

export const FIGHT_NAME = {
  OVERALL: "全程",
  BEFORE_ONE: "四狗+三鸡",
  ONE: "预言者斯克拉姆",
  BEFORE_TWO: "三宝前",
  TWO: "安其拉三宝",
  BEFORE_THREE: "通道虫",
  THREE: "沙尔图拉",
  BEFORE_FOUR: "陷阱房",
  FOUR: "顽强的范克瑞斯",
  FIVE: "维希度斯",
  BEFORE_SIX: "蜜蜂房",
  SIX: "哈霍兰公主",
  BEFORE_SEVEN: "五狗",
  SEVEN: "双子皇帝",
  BEFORE_EIGHT: "天堂之路",
  EIGHT: "奥罗",
  NINE: "克苏恩"
};

export const COLUMN = {
  TOTAL: "total",
  HIT: "hitCount",
  BUFF_TOTAL: "totalUses",
  BUFF_UPTIME: "totalUptime"
};

export const COLUMN_TEXT = {
  total: "总数值",
  hitCount: "命中数",
  totalUses: "BUFF数"
};

export async function fetchReport(reportId) {
  const res = await fetch(`${wcl}/report/fights/${reportId}?${fixedQueries}`);
  return await res.json();
}

export async function fetchTable(
  reportId,
  tableType,
  startTime,
  endTime,
  column,
  options
) {
  let extraQuery = fixedQueries;
  if (options["abilityId"]) {
    extraQuery = `${extraQuery}&abilityid=${options["abilityId"]}`;
  }
  if (options["customQuery"]) {
    extraQuery = `${extraQuery}&${options["customQuery"]}`;
  }
  const res = await fetch(
    `${wcl}/report/tables/${tableType}/${reportId}?start=${startTime}&end=${endTime}&${extraQuery}`
  );
  const data = await res.json();

  if (tableType === TABLE_TYPE.DEBUFFS) {
    return data;
  }

  return (tableType === TABLE_TYPE.BUFFS
    ? data["auras"]
    : data["entries"]
  ).map(e => ({ ...e, total: e[column] }));
}

export function summaryEntries(tables) {
  return Object.values(
    [].concat(...tables).reduce((entries, entry) => {
      if (entries[entry.id] === undefined) {
        entries[entry.id] = entry;
      } else {
        entries[entry.id].total += entry.total;
      }
      return entries;
    }, {})
  );
}

export function summaryForWorldBuffs(tables) {
  return Object.values(
    [].concat(...tables).reduce((entries, entry) => {
      if (entries[entry.id] === undefined) {
        entries[entry.id] = { ...entry, total: 1 };
      } else {
        entries[entry.id].total += 1;
      }
      return entries;
    }, {})
  );
}

export function summaryForDebuffs(abilityIds, allData, fights) {
  const total = fights
    .map(f => f["end_time"] - f["start_time"])
    .reduce((t1, t2) => t1 + t2, 0);
  const result = abilityIds.map((abilityId, idx) => ({
    id: abilityId,
    total:
      allData[idx]["auras"]
        .map(target =>
          target.bands
            .map(b => b["endTime"] - b["startTime"])
            .reduce((t1, t2) => t1 + t2, 0)
        )
        .reduce((t1, t2) => t1 + t2, 0) / total
  }));
  return result;
}

export async function fetchOverallDamage(reportId, startTime, endTime) {
  const res = await fetch(
    `${wcl}/report/tables/damage-done/${reportId}?start=${startTime}&end=${endTime}&${fixedQueries}`
  );
  const data = await res.json();
  return data["entries"];
}

export async function fetchSunderArmor(reportId, startTime, endTime) {
  let nextPageTimestamp = startTime;
  let res = [];
  while (nextPageTimestamp !== -1) {
    const nextRes = await fetch(
      `${wcl}/report/events/casts/${reportId}?abilityid=11597&start=${nextPageTimestamp}&end=${endTime}&${fixedQueries}`
    );
    const data = await nextRes.json();
    res = res.concat(data["events"]);
    nextPageTimestamp =
      data["nextPageTimestamp"] !== undefined ? data["nextPageTimestamp"] : -1;
  }
  return res;
}
