import { FORMULA_TYPE } from "./FormulaConstants";

export const SHAMAN_FORMULAS = {
  classType: "Shaman",
  formulas: [
    {
      displayName: "熟练度",
      edit: false,
      weight: 0.7,
      subGroups: [
        {
          tableIds: [
            { id: "HEALING", amplifier: 1 },
            { id: "CTHUN-HEALING", amplifier: -1 }
          ],
          type: FORMULA_TYPE.RELATIVE_TO_TOP,
          weight: 0.7
        },
        {
          tableIds: [{ id: "WIND-TOTEM", amplifier: 1 }],
          type: FORMULA_TYPE.RELATIVE_TO_TOP,
          checkShamanInRangeTeam: true,
          inRangeTeamThreshold: 10,
          weight: 0.1
        },
        {
          tableIds: [{ id: "EARTH-TOTEM", amplifier: 1 }],
          type: FORMULA_TYPE.RELATIVE_TO_TOP,
          checkShamanInRangeTeam: true,
          inRangeTeamThreshold: 10,
          weight: 0.1
        },
        {
          tableIds: [{ id: "DAMAGE", amplifier: 1 }],
          type: FORMULA_TYPE.RELATIVE_TO_MIN,
          min: 50000,
          weight: 0.1
        }
      ]
    },
    {
      displayName: "战术",
      edit: false,
      weight: 0.2,
      subGroups: [
        {
          tableIds: [{ id: "AOE-TOTEM", amplifier: 1 }],
          type: FORMULA_TYPE.RELATIVE_TO_MIN,
          weight: 0.1,
          min: 2
        },
        {
          tableIds: [{ id: "27-BUGS-NAIL", amplifier: 1 }],
          type: FORMULA_TYPE.UNITARY,
          weight: 0.1
        },
        {
          tableIds: [{ id: "BEE-ROOM-NAIL", amplifier: 1 }],
          type: FORMULA_TYPE.UNITARY,
          weight: 0.1
        },
        {
          tableIds: [{ id: "BOOM-BOX", amplifier: 1 }],
          type: FORMULA_TYPE.UNITARY,
          weight: 0.1
        },

        {
          tableIds: [{ id: "VIS-FROST-SHOCK", amplifier: 1 }],
          type: FORMULA_TYPE.RELATIVE_TO_MIN,
          min: 5,
          weight: 0.1
        },
        {
          tableIds: [{ id: "BOSS-ONE-TOTEM", amplifier: 1 }],
          type: FORMULA_TYPE.UNITARY,
          weight: 0.1
        },
        {
          tableIds: [{ id: "BEFORE-TWO-TOTEM", amplifier: 1 }],
          type: FORMULA_TYPE.UNITARY,
          weight: 0.1
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
      weight: 0.1,
      subGroups: [
        {
          tableIds: [{ id: "WORLD-BUFFS-RANGE", amplifier: 1 }],
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
          tableIds: [{ id: "MANA-POISON", amplifier: 1 }],
          type: FORMULA_TYPE.RELATIVE_TO_TOP,
          weight: 0.1
        }
      ]
    }
  ]
};
