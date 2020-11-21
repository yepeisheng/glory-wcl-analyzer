export const FORMULA_TYPE = {
  DEBUFF: "special_debuff",
  RELATIVE_TO_TOP: "to_top",
  RELATIVE_TO_MAX: "to_max",
  RELATIVE_TO_MIN: "to_min",
  RELATIVE_TO_AVG: "to_avg",
  RELATIVE_TO_TOTAL: "to_total",
  UNITARY: "unitary"
};

export const FORMULA_TYPE_TEXT = {
  special_debuff: "DEBUFF覆盖率",
  to_top: "相对于第一名",
  to_max: "相对于最大值",
  to_min: "达到最小值与否",
  to_avg: "相对于平均",
  to_total: "相对于总数",
  unitary: "转换成0或1"
};

export function normalizeWeight(formulas) {
  const groupsTotalWeight = formulas.reduce(
    (total, group) => (group.weight > 0 ? total + group.weight : total),
    0
  );
  const weightNormalized = formulas.map(g => {
    const subGroupsTotalWeight = g.subGroups.reduce(
      (total, sub) => (sub.weight > 0 ? total + sub.weight : total),
      0
    );
    return {
      ...g,
      weight: g.weight / groupsTotalWeight,
      subGroups: g.subGroups.map(sub => ({
        ...sub,
        weight: sub.weight / subGroupsTotalWeight
      }))
    };
  });
  return weightNormalized;
}
