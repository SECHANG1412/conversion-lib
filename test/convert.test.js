import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { convertUnit, getUnits, getCategories, formatResult } from '../src/index.js';

describe('convertUnit', () => {
  it('converts length', () => {
    assert.equal(convertUnit('length', 1, 'km', 'm'), 1000);
    assert.ok(Math.abs(convertUnit('length', 12, 'inch', 'cm') - 30.48) < 1e-10);
  });

  it('converts weight', () => {
    assert.equal(convertUnit('weight', 1, 'kg', 'g'), 1000);
    assert.ok(Math.abs(convertUnit('weight', 1, 'lb', 'kg') - 0.45359237) < 1e-8);
  });

  it('converts area including pyeong', () => {
    assert.ok(Math.abs(convertUnit('area', 1, '평', 'm2') - 3.305785) < 1e-5);
    assert.ok(Math.abs(convertUnit('area', 1, 'pyeong', 'm2') - 3.305785) < 1e-5);
  });

  it('converts volume including doe', () => {
    assert.ok(Math.abs(convertUnit('volume', 1, 'doe', 'l') - 1.8039) < 1e-6);
  });

  it('converts temperature', () => {
    assert.equal(convertUnit('temperature', 0, 'c', 'f'), 32);
    assert.equal(convertUnit('temperature', 100, 'c', 'f'), 212);
    assert.equal(convertUnit('temperature', 273.15, 'k', 'c'), 0);
  });

  it('converts thickness / gsm', () => {
    assert.equal(convertUnit('thickness', 100, 'gsm', 'um'), 80);
  });

  it('throws on invalid category', () => {
    assert.throws(() => convertUnit('invalid', 1, 'm', 'km'), RangeError);
  });
});

describe('getUnits', () => {
  it('returns units for a category', () => {
    const units = getUnits('length');
    assert.ok(units.includes('m'));
    assert.ok(units.includes('km'));
  });
});

describe('getCategories', () => {
  it('returns all categories', () => {
    const cats = getCategories();
    assert.ok(cats.some((c) => c.key === 'length'));
    assert.ok(cats.some((c) => c.key === 'thickness'));
  });
});

describe('formatResult', () => {
  it('formats numbers', () => {
    assert.equal(formatResult(1234.5), '1,234.5');
  });
});
