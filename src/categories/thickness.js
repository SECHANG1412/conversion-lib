/**
 * Paper thickness / grammage units.
 * Base unit: micrometer (μm) for physical thickness.
 * GSM (g/m²) is converted via standard 80 gsm ≈ 100 μm approximation for typical paper.
 */
export const thicknessUnits = {
  um: 1,
  mm: 1000,
  mil: 25.4,
  pt: 352.777777778,
  gsm: 0.8,
};

export const thicknessLabels = {
  um: '마이크로미터 (μm)',
  mm: '밀리미터 (mm)',
  mil: '밀 (mil)',
  pt: '포인트 (pt)',
  gsm: '평량 (gsm, g/m²)',
};
