import { convert, getUnitKeys } from './utils/convert.js';
import { lengthUnits, lengthLabels } from './categories/length.js';
import { weightUnits, weightLabels } from './categories/weight.js';
import { areaUnits, areaLabels, areaUnitAliases } from './categories/area.js';
import { volumeUnits, volumeLabels } from './categories/volume.js';
import {
  temperatureToBase,
  temperatureFromBase,
  temperatureLabels,
} from './categories/temperature.js';
import { thicknessUnits, thicknessLabels } from './categories/thickness.js';
import { speedUnits, speedLabels } from './categories/speed.js';
import { pressureUnits, pressureLabels } from './categories/pressure.js';

export const CATEGORIES = {
  length: {
    units: lengthUnits,
    labels: lengthLabels,
    name: '길이',
  },
  weight: {
    units: weightUnits,
    labels: weightLabels,
    name: '무게',
  },
  area: {
    units: areaUnits,
    labels: areaLabels,
    aliases: areaUnitAliases,
    name: '넓이',
  },
  volume: {
    units: volumeUnits,
    labels: volumeLabels,
    name: '부피',
  },
  temperature: {
    units: temperatureToBase,
    labels: temperatureLabels,
    name: '온도',
    special: true,
  },
  thickness: {
    units: thicknessUnits,
    labels: thicknessLabels,
    name: '두께 / 평량',
  },
  speed: {
    units: speedUnits,
    labels: speedLabels,
    name: '속도',
  },
  pressure: {
    units: pressureUnits,
    labels: pressureLabels,
    name: '압력',
  },
};

/**
 * @param {string} category
 * @param {string} unit
 * @returns {string}
 */
function resolveUnit(category, unit) {
  const config = CATEGORIES[category];
  return config?.aliases?.[unit] ?? unit;
}

/**
 * Convert a numeric value between units in a given category.
 * @param {string} category - Category key (length, weight, area, etc.)
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 * @returns {number}
 */
export function convertUnit(category, value, fromUnit, toUnit) {
  const config = CATEGORIES[category];
  if (!config) {
    throw new RangeError(`Unknown category: ${category}`);
  }

  fromUnit = resolveUnit(category, fromUnit);
  toUnit = resolveUnit(category, toUnit);

  if (category === 'temperature') {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new TypeError('Value must be a valid number');
    }
    if (fromUnit === toUnit) return value;

    const toBase = temperatureToBase[fromUnit];
    const fromBase = temperatureFromBase[toUnit];
    if (!toBase || !fromBase) {
      throw new RangeError(`Unknown temperature unit: ${fromUnit} or ${toUnit}`);
    }
    return fromBase(toBase(value));
  }

  return convert(value, fromUnit, toUnit, config.units);
}

/**
 * @param {string} category
 * @returns {string[]}
 */
export function getUnits(category) {
  const config = CATEGORIES[category];
  if (!config) {
    throw new RangeError(`Unknown category: ${category}`);
  }
  return getUnitKeys(config.units);
}

/**
 * @param {string} category
 * @param {string} unit
 * @returns {string}
 */
export function getUnitLabel(category, unit) {
  const config = CATEGORIES[category];
  if (!config) {
    throw new RangeError(`Unknown category: ${category}`);
  }
  unit = resolveUnit(category, unit);
  return config.labels[unit] ?? unit;
}

/**
 * @returns {{ key: string, name: string }[]}
 */
export function getCategories() {
  return Object.entries(CATEGORIES).map(([key, { name }]) => ({ key, name }));
}

/**
 * Format a converted result for display.
 * @param {number} value
 * @param {{ maxDecimals?: number, minDecimals?: number }} [options]
 * @returns {string}
 */
export function formatResult(value, options = {}) {
  const { maxDecimals = 10, minDecimals = 0 } = options;

  if (!Number.isFinite(value)) {
    return '—';
  }

  const abs = Math.abs(value);
  let decimals = maxDecimals;

  if (abs >= 1000) decimals = Math.min(decimals, 2);
  else if (abs >= 1) decimals = Math.min(decimals, 6);
  else if (abs >= 0.001) decimals = Math.min(decimals, 8);
  else decimals = maxDecimals;

  return value.toLocaleString('ko-KR', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: decimals,
  });
}

export {
  convert,
  lengthUnits,
  weightUnits,
  areaUnits,
  volumeUnits,
  thicknessUnits,
  speedUnits,
  pressureUnits,
};

export default {
  convertUnit,
  getUnits,
  getUnitLabel,
  getCategories,
  formatResult,
  CATEGORIES,
};
