import { FORMULA_TYPE } from "./FormulaConstants";

export const WARLOCK_FORMULAS = {
  classType: "Warlock",
  formulas: [
    {
      displayName: "熟练度",
      edit: false,
      weight: 0.8,
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
          weight: 0.7,
          type: FORMULA_TYPE.RELATIVE_TO_TOP
        },
        {
          specialFormula: "WARLOCK-CURSE",
          tableIds: [{ id: "WARLOCK-CURSE", amplifier: 1 }],
          type: FORMULA_TYPE.DEBUFF,
          weight: 0.2
        },
        {
          tableIds: [{ id: "vis-shoot", amplifier: 1 }],
          type: FORMULA_TYPE.RELATIVE_TO_TOP,
          weight: 0.1
        }
      ]
    },
    {
      displayName: "战术",
      edit: false,
      weight: 0.1,
      subGroups: [
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
          tableIds: [{ id: "poison", amplifier: 1 }],
          type: FORMULA_TYPE.RELATIVE_TO_TOP,
          weight: 0.1
        }
      ]
    }
  ]
};
