export const FORMULA_TYPE = {
  RELATIVE_TO_TOP: "to_top",
  RELATIVE_TO_MAX: "to_max",
  RELATIVE_TO_AVG: "to_avg",
  RELATIVE_TO_TOTAL: "to_total",
  UNITARY: "unitary"
};

export const FORMULA_TYPE_TEXT = {
  to_top: "相对于第一名",
  to_max: "相对于预设值",
  to_avg: "相对于平均",
  to_total: "相对于总数",
  unitary: "转换成0或1"
};

const WARRIOR_FORMULAS = {
  classType: "Warrior",
  formulas: [
    {
      displayName: "熟练度",
      edit: false,
      weight: 0.5,
      subGroups: [
        {
          tableIds: [
            {
              id: "DAMAGE",
              amplifier: 1
            },
            {
              id: "TEAMMATE-DAMAGE",
              amplifier: -10
            }
          ],
          weight: 0.67,
          type: FORMULA_TYPE.RELATIVE_TO_TOP
        },
        {
          tableIds: [{ id: "TRUE-SHOT-AURA", amplifier: 1 }],
          weight: 0.03,
          type: FORMULA_TYPE.UNITARY,
          reverse: true
        },
        {
          tableIds: [{ id: "HEALING", amplifier: 1 }],
          type: FORMULA_TYPE.RELATIVE_TO_TOP,
          weight: 0.1
        },
        {
          tableIds: [{ id: "SUNDERS", amplifier: 1 }],
          weight: 0.2,
          type: FORMULA_TYPE.RELATIVE_TO_TOP
        }
      ]
    },
    {
      displayName: "战术",
      edit: false,
      weight: 0.3,
      subGroups: [
        /*
        {
          tableIds: [{ id: "DUMMY-TARGET", amplifier: 1 }],
          weight: 0.25,
          type: FORMULA_TYPE.RELATIVE_TO_MAX,
          max: 3
        },
        {
          tableIds: [{ id: "VIS", amplifier: 1 }],
          weight: 0.25,
          type: FORMULA_TYPE.RELATIVE_TO_AVG
        },*/
        {
          tableIds: [{ id: "death-wish-1", amplifier: 1 }],
          weight: 0.2,
          type: FORMULA_TYPE.RELATIVE_TO_MAX,
          max: 2
        },
        {
          tableIds: [{ id: "death-wish-2", amplifier: 1 }],
          weight: 0.1,
          type: FORMULA_TYPE.RELATIVE_TO_MAX,
          max: 1
        },
        {
          tableIds: [{ id: "death-wish-3", amplifier: 1 }],
          weight: 0.1,
          type: FORMULA_TYPE.RELATIVE_TO_MAX,
          max: 1
        },
        {
          tableIds: [{ id: "death-wish-4", amplifier: 1 }],
          weight: 0.1,
          type: FORMULA_TYPE.RELATIVE_TO_MAX,
          max: 1
        },
        {
          tableIds: [{ id: "death-wish-5", amplifier: 1 }],
          weight: 0.2,
          type: FORMULA_TYPE.RELATIVE_TO_MAX,
          max: 2
        },
        {
          tableIds: [{ id: "27-BUGS", amplifier: 1 }],
          weight: 0.1,
          type: FORMULA_TYPE.RELATIVE_TO_MAX,
          max: 2
        },
        {
          tableIds: [{ id: "TRAP-ROOM-ACCELERATE", amplifier: 1 }],
          weight: 0.1,
          type: FORMULA_TYPE.RELATIVE_TO_MAX,
          max: 2
        },
        {
          tableIds: [{ id: "BEE-ROOM-POTION", amplifier: 1 }],
          weight: 0.1,
          type: FORMULA_TYPE.RELATIVE_TO_MAX,
          max: 1
        }
      ]
    },
    {
      displayName: "投入",
      edit: false,
      weight: 0.2,
      subGroups: [
        {
          tableIds: [{ id: "WORLD-BUFFS", amplifier: 1 }],
          type: FORMULA_TYPE.RELATIVE_TO_MAX,
          max: 6,
          weight: 0.8
        },
        {
          tableIds: [{ id: "petrification", amplifier: 1 }],
          type: FORMULA_TYPE.UNITARY,
          weight: 0.1
        },
        {
          tableIds: [{ id: "poison", amplifier: 1 }],
          type: FORMULA_TYPE.RELATIVE_TO_TOP,
          weight: 0.1
        }
      ]
    }
  ]
};

const TANK_FORMULAS = {
  classType: "Tank",
  formulas: []
};

const SHAMAN_FORMULAS = {
  classType: "Shaman",
  formulas: []
};

const MAGE_FORMULAS = {
  classType: "Mage",
  formulas: []
};
const WARLOCK_FORMULAS = {
  classType: "Warlock",
  formulas: []
};
const PRIEST_FORMULAS = {
  classType: "Priest",
  formulas: []
};
const DRUID_FORMULAS = {
  classType: "Druid",
  formulas: []
};
const HUNTER_FORMULAS = {
  classType: "Hunter",
  formulas: []
};
const PALADIN_FORMULAS = {
  classType: "Paladin",
  formulas: []
};
const ROGUE_FORMULAS = {
  classType: "Rogue",
  formulas: []
};

export const defaultFormulas = [
  WARRIOR_FORMULAS,
  TANK_FORMULAS,
  SHAMAN_FORMULAS,
  MAGE_FORMULAS,
  WARLOCK_FORMULAS,
  PRIEST_FORMULAS,
  DRUID_FORMULAS,
  HUNTER_FORMULAS,
  PALADIN_FORMULAS,
  ROGUE_FORMULAS
];

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
