import { uploadData } from '../../dataBase/dataHandler.js';

const $ = (s) => document.querySelector(s);

// ------------------ Helpers ------------------
function cleanFormula(text) {
  if (!text) return '';
  const sub = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃',
    '4': '₄', '5': '₅', '6': '₆', '7': '₇',
    '8': '₈', '9': '₉', '+': '₊', '-': '₋',
    '=': '₌', '(': '₍', ')': '₎'
  };
  const toSub = s => s.replace(/[0-9+\-=()]/g, d => sub[d] || d);
  let t = text.replace(/\\text{([^}]*)}/g, '$1');
  t = t.replace(/_([0-9]+)/g, (_, d) => toSub(d));
  t = t.replace(/([A-Za-z)])([0-9]+)/g, (_, l, d) => l + toSub(d));
  return t;
}

function cleanNameForCompound(name) {
  if (!name) return '';
  let cleaned = name.replace(/[⁺⁻+-]/g, '');
  cleaned = cleaned.replace(/[²³⁴⁵⁶⁷⁸⁹]/g, '');
  return cleaned;
}

function formatAnionName(name) {
  const base = cleanNameForCompound(name);
  return base ? '(' + base + ')₃' : '';
}

function parseNumOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function computeTF(rA, rB, xR, xH) {
  if ([rA, rB, xR, xH].some((x) => !Number.isFinite(x))) return null;
  return (rA + xR) / ((rB + xH / 2) * Math.SQRT2);
}

// ------------------ Normalizadores de datos ------------------
function getFixedCatA() {
  const rA = parseNumOrNull($('#cationA')?.value);
  if (rA !== null) return rA;
  const vA = parseNumOrNull($('#volumenCationManualA')?.value);
  if (vA !== null) return Math.pow((3 * vA) / (4 * Math.PI), 1 / 3);
  return null;
}

function getFixedCatB() {
  const rB = parseNumOrNull($('#cationB')?.value);
  if (rB !== null) return rB;
  return parseNumOrNull($('#cationManualB')?.value);
}

function getFixedAnion() {
  const sel = $('#anion');
  if (sel && sel.value) {
    const opt = sel.options[sel.selectedIndex];
    const xr = parseNumOrNull(opt.getAttribute("xr")) || parseNumOrNull($('#anionManualR')?.value);
    const xh = parseNumOrNull(opt.getAttribute("xh")) || parseNumOrNull($('#anionManualH')?.value);
    return { name: opt.getAttribute("data-nombre"), xr, xh };
  }
  return {
    xr: parseNumOrNull($('#anionManualR')?.value),
    xh: parseNumOrNull($('#anionManualH')?.value)
  };
}

// ------------------ Datos globales ------------------
let cationAData = [];
let cationBData = [];
let anionData = [];
let sortOrder = "asc"; // estado inicial de ordenación

// ------------------ Enumeradores ------------------
function enumCatAOptions() {
  const sel = $('#cationA');
  if (!sel) return [];
  return [...sel.options]
    .map(opt => {
      const name = opt.getAttribute("data-nombre") || opt.textContent || opt.value;
      const rA   = parseNumOrNull(opt.getAttribute("data-radio"));
      const glob = parseNumOrNull(opt.getAttribute("data-glob")); // 👈 globularity
      return { name, rA, glob };
    })
    .filter(x => x.rA !== null && x.rA !== 0);
}

function enumCatBOptions() {
  const sel = $('#cationB');
  if (!sel) return [];
  return [...sel.options]
    .map(opt => {
      const name = opt.getAttribute("data-nombre") || opt.textContent || opt.value;
      const rB   = parseNumOrNull(opt.getAttribute("data-radio"));
      return { name, rB };
    })
    .filter(x => x.rB !== null && x.rB !== 0);
}

function enumAnionOptions() {
  const sel = $('#anion');
  if (!sel) return [];
  return [...sel.options]
    .map(opt => {
      const name = opt.getAttribute("data-nombre") || opt.value;
      const xr   = parseNumOrNull(opt.getAttribute("xr"));
      const xh   = parseNumOrNull(opt.getAttribute("xh"));
      return { name, xr, xh };
    })
    .filter(x => x.xr !== null && x.xh !== null);
}

// ------------------ Render tabla ------------------
function renderTable(rows, missing) {
  const el = $('#resultado');
  const downloadBtn = $('#downloadTable');
  const plotBtn = $('#plotTable');

  if (!el) return;
  if (!rows.length) {
    el.innerHTML = '<p>No combinations found.</p>';
    if (downloadBtn) downloadBtn.disabled = true;
    if (plotBtn) plotBtn.disabled = true;
    return;
  }

  const normalizedRows = rows.map(r => ({
    ...r,
    compoundDisplay: cleanNameForCompound(r.compound)
  }));

  const header =
    missing === 'A'
      ? '<th>Perovskite</th><th>Cation A</th><th>rA (Å)</th><th>TF</th><th>Globularity</th>'
      : missing === 'B'
      ? '<th>Perovskite</th><th>Cation B</th><th>rB (Å)</th><th>TF</th><th>Globularity</th>'
      : '<th>Perovskite</th><th>Anion</th><th>rX (Å)</th><th>hX (Å)</th><th>TF</th><th>Globularity</th>';

  const body = normalizedRows
    .map((r) =>
      missing === 'A'
        ? `<tr><td>${r.compoundDisplay}</td><td>${r.name}</td><td>${r.rA.toFixed(3)}</td><td>${r.tf.toFixed(4)}</td><td>${r.glob?.toFixed(4) ?? ''}</td></tr>`
        : missing === 'B'
        ? `<tr><td>${r.compoundDisplay}</td><td>${r.name}</td><td>${r.rB.toFixed(3)}</td><td>${r.tf.toFixed(4)}</td><td>${r.glob?.toFixed(4) ?? ''}</td></tr>`
        : `<tr><td>${r.compoundDisplay}</td><td>${r.name}</td><td>${r.xr.toFixed(3)}</td><td>${r.xh.toFixed(3)}</td><td>${r.tf.toFixed(4)}</td><td>${r.glob?.toFixed(4) ?? ''}</td></tr>`
    )
    .join('');

  el.innerHTML = `
    <table class="styledTable">
      <thead>
        <tr>${header}</tr>
      </thead>
      <tbody>${body}</tbody>
    </table>`;

  if (downloadBtn) downloadBtn.disabled = false;
  if (plotBtn) plotBtn.disabled = false;

  window.currentResults = { rows: normalizedRows, missing };
}

// ------------------ Mutua exclusión select/input ------------------
function setupMutualExclusion(selectId, manualIds) {
  const sel = document.getElementById(selectId);
  const manuals = manualIds.map((id) => document.getElementById(id));

  sel?.addEventListener('change', () => {
    const hasVal = sel.value !== '' && !isNaN(parseFloat(sel.value));
    manuals.forEach((m) => (m.disabled = hasVal));
  });

  manuals.forEach((m) => {
    m?.addEventListener('input', () => {
      const anyVal = manuals.some((x) => x.value.trim() !== '');
      sel.disabled = anyVal;
      if (!anyVal) sel.disabled = false;
    });
  });
}

// ------------------ Toggle según dato faltante ------------------
function toggleDisabled(missing) {
  const disableA = ['#cationA', '#volumenCationManualA'];
  const disableB = ['#cationB', '#cationManualB'];
  const disableX = ['#anion', '#anionManualR', '#anionManualH'];
  [...disableA, ...disableB, ...disableX].forEach((s) => {
    const el = $(s);
    if (el) el.disabled = false;
  });
  (missing === 'A' ? disableA : missing === 'B' ? disableB : disableX).forEach(
    (s) => {
      const el = $(s);
      if (el) el.disabled = true;
    }
  );
}

// ------------------ Lógica principal ------------------
function calculo(ev) {
  if (ev) ev.preventDefault();
  $('#errorInput').textContent = '';
  $('#resultado').innerHTML = '';
  $('#rango').textContent = '';

  let tfMin = parseNumOrNull($('#tfMin')?.value) ?? 0.8;
  let tfMax = parseNumOrNull($('#tfMax')?.value) ?? 1.0;
  if (tfMin > tfMax) [tfMin, tfMax] = [tfMax, tfMin];

  const missing = $('#missingKind')?.value;
  const fixedA = getFixedCatA();
  const fixedB = getFixedCatB();
  const fixedX = getFixedAnion();

  const faltaA = fixedA === null || fixedA === 0 || isNaN(fixedA);
  const faltaB = fixedB === null || fixedB === 0 || isNaN(fixedB);
  const faltaXr = !fixedX || fixedX.xr === null || fixedX.xr === 0 || isNaN(fixedX.xr);
  const faltaXh = !fixedX || fixedX.xh === null || fixedX.xh === 0 || isNaN(fixedX.xh);

  if (
    (missing === 'A' && (faltaB || faltaXr || faltaXh)) ||
    (missing === 'B' && (faltaA || faltaXr || faltaXh)) ||
    (missing === 'X' && (faltaA || faltaB))
  ) {
    $('#errorInput').textContent = 'Inner data error, complete all fields.';
    return;
  }

  const catASelect = document.getElementById("cationA");
  let catAName = catASelect?.options[catASelect.selectedIndex]?.getAttribute("data-nombre") || '';
  const globFixed = parseNumOrNull(catASelect?.options[catASelect.selectedIndex]?.getAttribute("data-glob"));

  const catBSelect = document.getElementById("cationB");
  let catBName = catBSelect?.options[catBSelect.selectedIndex]?.getAttribute("data-nombre") || '';

  let anionName = formatAnionName(fixedX?.name || '');

  let rows = [];

  if (missing === 'A') {
    rows = enumCatAOptions()
      .map(({ name, rA, glob }) => ({
        name,
        rA,
        glob,
        tf: computeTF(rA, fixedB, fixedX.xr, fixedX.xh),
        compound: `[${name}]${catBName}${anionName}`
      }))
      .filter(r => r.tf >= tfMin && r.tf <= tfMax);

  } else if (missing === 'B') {
    rows = enumCatBOptions()
      .map(({ name, rB }) => ({
        name,
        rB,
        glob: globFixed,
        tf: computeTF(fixedA, rB, fixedX.xr, fixedX.xh),
        compound: `[${catAName}]${name}${anionName}`
      }))
      .filter(r => r.tf >= tfMin && r.tf <= tfMax);

  } else {
    rows = enumAnionOptions()
      .map(({ name, xr, xh }) => ({
        name,
        xr,
        xh,
        glob: globFixed,
        tf: computeTF(fixedA, fixedB, xr, xh),
        compound: `[${catAName}]${catBName}(${name})₃`
      }))
      .filter(r => r.tf >= tfMin && r.tf <= tfMax);
  }

  rows.sort((a, b) => sortOrder === "asc" ? a.tf - b.tf : b.tf - a.tf);

  $('#rango').textContent = `Found ${rows.length} combinations in range: [${tfMin}, ${tfMax}]`;
  renderTable(rows, missing);
}

// ------------------ Poblar aniones ------------------
function populateAnionSelect() {
  const select = document.getElementById("anion");
  if (!select) return;

  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "-- Selecciona un anión --";
  placeholder.disabled = true;
  select.appendChild(placeholder);

  Object.values(anionData).forEach(anion => {
    const option = document.createElement("option");
    const nombreLimpio = cleanFormula(anion.textName || anion.name) + "⁻";

    option.value = anion.abbreviature;
    option.setAttribute("data-nombre", nombreLimpio);
    option.setAttribute("data-abreviatura", anion.abbreviature);
    option.setAttribute("data-smiles", anion.smiles);
    option.setAttribute("xr", anion.radiusA || "");
    option.setAttribute("xh", anion.lengthA || anion.lenghtA || "");

    option.textContent = nombreLimpio;
    select.appendChild(option);
  });

  select.selectedIndex = 0;
}

// ------------------ Inicialización ------------------
document.addEventListener('DOMContentLoaded', async () => {
  cationAData = await uploadData('cationA', '*');
  cationBData = await uploadData('cationB', '*');
  anionData   = await uploadData('anion', '*');

  populateAnionSelect();

  $('#datosForm')?.addEventListener('submit', calculo);

  setupMutualExclusion('cationA', ['volumenCationManualA']);
  setupMutualExclusion('cationB', ['cationManualB']);
  setupMutualExclusion('anion', ['anionManualR', 'anionManualH']);

  toggleDisabled($('#missingKind').value);
  $('#missingKind').addEventListener('change', (e) => toggleDisabled(e.target.value));

  // Botón de orden
  $('#toggleSortOrder')?.addEventListener('click', (e) => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    $('#toggleSortOrder').textContent = sortOrder === "asc"
      ? "↑ Ascending TF ↑"
      : "↓ Descending TF ↓";
    calculo(e);
  });

  // Botón descargar tabla
  $('#downloadTable')?.addEventListener('click', () => {
    if (!window.currentResults) return;
    const { rows, missing } = window.currentResults;

    let headers = [];
    if (missing === 'A') headers = ['Perovskite', 'Cation A', 'rA (Å)', 'TF', 'Globularity'];
    else if (missing === 'B') headers = ['Perovskite', 'Cation B', 'rB (Å)', 'TF', 'Globularity'];
    else headers = ['Perovskite', 'Anion', 'rX (Å)', 'hX (Å)', 'TF', 'Globularity'];

    const csvRows = [];
    csvRows.push(headers.join(','));
    rows.forEach(r => {
      if (missing === 'A') csvRows.push([r.compoundDisplay, r.name, r.rA, r.tf, r.glob].join(','));
      else if (missing === 'B') csvRows.push([r.compoundDisplay, r.name, r.rB, r.tf, r.glob].join(','));
      else csvRows.push([r.compoundDisplay, r.name, r.xr, r.xh, r.tf, r.glob].join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Botón plot
  $('#plotTable')?.addEventListener('click', () => {
    if (!window.currentResults) return;
    localStorage.removeItem('plotData');
    localStorage.setItem('plotData', JSON.stringify(window.currentResults));
    window.location.href = 'graf.html';
  });
});
