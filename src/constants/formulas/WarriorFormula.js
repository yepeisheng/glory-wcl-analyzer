import { FORMULA_TYPE } from "./FormulaConstants";

export const WARRIOR_FORMULAS = {
  classType: "Warrior",
  formulas: [
    {
      displayName: "熟练度",
      edit: false,
      weight: 0.7,
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
      weight: 0.2,
      subGroups: [
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
          tableIds: [{ id: "27-BUGS-WARRIOR", amplifier: 1 }],
          weight: 0.1,
          type: FORMULA_TYPE.RELATIVE_TO_MAX,
          max: 2
        },
        {
          tableIds: [{ id: "27-BUGS-NAIL", amplifier: 1 }],
          type: FORMULA_TYPE.UNITARY,
          weight: 0.05
        },
        {
          tableIds: [{ id: "BEE-ROOM-NAIL", amplifier: 1 }],
          type: FORMULA_TYPE.UNITARY,
          weight: 0.05
        },
        {
          tableIds: [{ id: "BOOM-BOX", amplifier: 1 }],
          type: FORMULA_TYPE.UNITARY,
          weight: 0.05
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
          tableIds: [{ id: "WORLD-BUFFS-MELEE", amplifier: 1 }],
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
