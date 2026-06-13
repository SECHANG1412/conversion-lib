import {
  convertUnit,
  getUnits,
  getUnitLabel,
  getCategories,
  formatResult,
} from '../src/index.js';

const QUICK_PAIRS = {
  length: [
    ['1', 'km', 'm'],
    ['1', 'inch', 'cm'],
    ['1', 'mile', 'km'],
  ],
  weight: [
    ['1', 'kg', 'lb'],
    ['1', 'oz', 'g'],
  ],
  area: [
    ['1', 'pyeong', 'm2'],
    ['1', 'acre', 'ha'],
  ],
  volume: [
    ['1', 'l', 'gallon'],
    ['250', 'ml', 'cup'],
  ],
  temperature: [
    ['0', 'c', 'f'],
    ['100', 'c', 'f'],
    ['37', 'c', 'f'],
  ],
  thickness: [
    ['80', 'gsm', 'um'],
    ['1', 'mm', 'um'],
  ],
  speed: [
    ['100', 'km/h', 'mph'],
    ['1', 'm/s', 'km/h'],
  ],
  pressure: [
    ['1', 'atm', 'kpa'],
    ['1', 'bar', 'psi'],
  ],
};

const state = {
  category: 'length',
  value: '1',
  fromUnit: 'm',
  toUnit: 'cm',
};

const els = {
  tabs: document.getElementById('category-tabs'),
  inputValue: document.getElementById('input-value'),
  fromUnit: document.getElementById('from-unit'),
  toUnit: document.getElementById('to-unit'),
  swapBtn: document.getElementById('swap-btn'),
  resultValue: document.getElementById('result-value'),
  resultFormula: document.getElementById('result-formula'),
  resultPanel: document.getElementById('result-panel'),
  quickReference: document.getElementById('quick-reference'),
};

function renderTabs() {
  els.tabs.innerHTML = '';
  getCategories().forEach(({ key, name }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab';
    btn.role = 'tab';
    btn.dataset.category = key;
    btn.textContent = name;
    btn.setAttribute('aria-selected', key === state.category ? 'true' : 'false');
    btn.addEventListener('click', () => selectCategory(key));
    els.tabs.appendChild(btn);
  });
}

function populateUnitSelects() {
  const units = getUnits(state.category);

  [els.fromUnit, els.toUnit].forEach((select) => {
    select.innerHTML = '';
    units.forEach((unit) => {
      const option = document.createElement('option');
      option.value = unit;
      option.textContent = getUnitLabel(state.category, unit);
      select.appendChild(option);
    });
  });

  if (!units.includes(state.fromUnit)) {
    state.fromUnit = units[0];
  }
  if (!units.includes(state.toUnit)) {
    state.toUnit = units[1] ?? units[0];
  }
  if (state.fromUnit === state.toUnit && units.length > 1) {
    state.toUnit = units[1];
  }

  els.fromUnit.value = state.fromUnit;
  els.toUnit.value = state.toUnit;
}

function selectCategory(category) {
  state.category = category;
  renderTabs();
  populateUnitSelects();
  updateConversion();
  renderQuickReference();
}

function updateConversion() {
  const raw = els.inputValue.value.trim();

  if (raw === '' || raw === '-') {
    els.resultPanel.classList.remove('result--error');
    els.resultValue.textContent = '—';
    els.resultFormula.textContent = '값을 입력하세요';
    return;
  }

  const value = Number(raw);
  if (Number.isNaN(value)) {
    els.resultPanel.classList.add('result--error');
    els.resultValue.textContent = '유효하지 않은 숫자';
    els.resultFormula.textContent = '';
    return;
  }

  state.value = raw;
  state.fromUnit = els.fromUnit.value;
  state.toUnit = els.toUnit.value;

  try {
    const result = convertUnit(state.category, value, state.fromUnit, state.toUnit);
    const fromLabel = getUnitLabel(state.category, state.fromUnit);
    const toLabel = getUnitLabel(state.category, state.toUnit);

    els.resultPanel.classList.remove('result--error');
    els.resultValue.textContent = formatResult(result);
    els.resultFormula.textContent = `${formatResult(value)} ${fromLabel} = ${formatResult(result)} ${toLabel}`;
  } catch (err) {
    els.resultPanel.classList.add('result--error');
    els.resultValue.textContent = err.message;
    els.resultFormula.textContent = '';
  }
}

function renderQuickReference() {
  const pairs = QUICK_PAIRS[state.category] ?? [];
  els.quickReference.innerHTML = '';

  pairs.forEach(([val, from, to]) => {
    const result = convertUnit(state.category, Number(val), from, to);
    const li = document.createElement('li');
    li.className = 'quick__item';
    li.innerHTML = `
      <span class="quick__pair">
        ${formatResult(Number(val))} ${getUnitLabel(state.category, from)}
        <span class="quick__arrow">→</span>
        ${getUnitLabel(state.category, to)}
      </span>
      <span class="quick__value">${formatResult(result)}</span>
    `;
    els.quickReference.appendChild(li);
  });
}

function swapUnits() {
  const temp = els.fromUnit.value;
  els.fromUnit.value = els.toUnit.value;
  els.toUnit.value = temp;
  updateConversion();
}

els.inputValue.addEventListener('input', updateConversion);
els.fromUnit.addEventListener('change', updateConversion);
els.toUnit.addEventListener('change', updateConversion);
els.swapBtn.addEventListener('click', swapUnits);

renderTabs();
populateUnitSelects();
updateConversion();
renderQuickReference();
