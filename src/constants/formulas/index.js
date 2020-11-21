import { WARRIOR_FORMULAS } from "./WarriorFormula";
import { SHAMAN_FORMULAS } from "./ShamanFormula";
import { MAGE_FORMULAS } from "./MageFormula";
import { WARLOCK_FORMULAS } from "./WarlockFormula";
import { PRIEST_FORMULAS } from "./PriestFormula";
import { ROGUE_FORMULAS } from "./RogueFormula";
import { DRUID_FORMULAS } from "./DruidFormula";

const TANK_FORMULAS = {
  classType: "Tank",
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
