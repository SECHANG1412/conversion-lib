/** Temperature conversion via Celsius base */
export const temperatureToBase = {
  c: (v) => v,
  f: (v) => (v - 32) * (5 / 9),
  k: (v) => v - 273.15,
};

export const temperatureFromBase = {
  c: (v) => v,
  f: (v) => v * (9 / 5) + 32,
  k: (v) => v + 273.15,
};

export const temperatureLabels = {
  c: '섭씨 (°C)',
  f: '화씨 (°F)',
  k: '켈빈 (K)',
};
