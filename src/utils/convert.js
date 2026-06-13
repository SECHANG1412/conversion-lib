/**
 * Convert a value between units within the same category.
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 * @param {Record<string, number|((v: number) => number)>} units - factors to base unit, or custom converters
 * @returns {number}
 */
export function convert(value, fromUnit, toUnit, units) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError('Value must be a valid number');
  }

  const from = units[fromUnit];
  const to = units[toUnit];

  if (from === undefined) {
    throw new RangeError(`Unknown source unit: ${fromUnit}`);
  }
  if (to === undefined) {
    throw new RangeError(`Unknown target unit: ${toUnit}`);
  }

  if (fromUnit === toUnit) {
    return value;
  }

  const toBase = typeof from === 'function' ? from : (v) => v * from;
  const fromBase = typeof to === 'function' ? to : (v) => v / to;

  return fromBase(toBase(value));
}

/**
 * @param {Record<string, number|((v: number) => number)>} units
 * @returns {string[]}
 */
export function getUnitKeys(units) {
  return Object.keys(units);
}

/**
 * @param {Record<string, Record<string, number|((v: number) => number)>>} categories
 * @param {string} category
 * @returns {string[]}
 */
export function getUnitsForCategory(categories, category) {
  const units = categories[category];
  if (!units) {
    throw new RangeError(`Unknown category: ${category}`);
  }
  return getUnitKeys(units);
}
