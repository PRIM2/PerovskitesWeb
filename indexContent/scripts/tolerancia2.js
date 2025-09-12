// indexContent/tolerancia2.js

const $ = (s) => document.querySelector(s)

function parseNumOrNull(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function computeTF(rA, rB, xR, xH) {
  if ([rA, rB, xR, xH].some((x) => !Number.isFinite(x))) return null
  return (rA + xR) / ((rB + xH / 2) * Math.SQRT2)
}

// --- Valores fijos ---
function getFixedCatA() {
  const rA = parseNumOrNull($('#cationA')?.value)
  if (rA !== null) return rA
  const vA = parseNumOrNull($('#volumenCationManualA')?.value)
  if (vA !== null) return Math.pow((3 * vA) / (4 * Math.PI), 1 / 3)
  return null
}
function getFixedCatB() {
  const rB = parseNumOrNull($('#cationB')?.value)
  if (rB !== null) return rB
  return parseNumOrNull($('#cationManualB')?.value)
}
function getFixedAnion() {
  const opt = $('#anion')?.selectedOptions?.[0]
  let xr = opt ? parseNumOrNull(opt.getAttribute('xr')) : null
  let xh = opt ? parseNumOrNull(opt.getAttribute('xh')) : null
  if (xr === null) xr = parseNumOrNull($('#anionManualR')?.value)
  if (xh === null) xh = parseNumOrNull($('#anionManualH')?.value)
  return { xr, xh }
}

// --- Enumeradores ---
function enumCatAOptions() {
  return [...($('#cationA')?.options || [])]
    .map((o) => ({ name: o.textContent, rA: parseNumOrNull(o.value) }))
    .filter((x) => x.rA !== null)
}
function enumCatBOptions() {
  return [...($('#cationB')?.options || [])]
    .map((o) => ({ name: o.textContent, rB: parseNumOrNull(o.value) }))
    .filter((x) => x.rB !== null)
}
function enumAnionOptions() {
  return [...($('#anion')?.options || [])]
    .map((o) => ({
      name: o.textContent,
      xr: parseNumOrNull(o.getAttribute('xr')),
      xh: parseNumOrNull(o.getAttribute('xh'))
    }))
    .filter((x) => x.xr !== null && x.xh !== null)
}

// --- Render tabla ---
function renderTable(rows, missing) {
  const el = $('#resultados')
  if (!el) return
  if (!rows.length) {
    el.innerHTML = '<p>No combinations found.</p>'
    return
  }
  const header =
    missing === 'A'
      ? '<th>Catión A</th><th>rA (Å)</th>'
      : missing === 'B'
      ? '<th>Catión B</th><th>rB (Å)</th>'
      : '<th>Anión</th><th>rX (Å)</th><th>hX (Å)</th>'
  const body = rows
    .map((r) =>
      missing === 'A'
        ? `<tr><td>${r.name}</td><td>${r.rA.toFixed(
            3
          )}</td><td>${r.tf.toFixed(4)}</td></tr>`
        : missing === 'B'
        ? `<tr><td>${r.name}</td><td>${r.rB.toFixed(
            3
          )}</td><td>${r.tf.toFixed(4)}</td></tr>`
        : `<tr><td>${r.name}</td><td>${r.xr.toFixed(
            3
          )}</td><td>${r.xh.toFixed(3)}</td><td>${r.tf.toFixed(
            4
          )}</td></tr>`
    )
    .join('')
  el.innerHTML = `<table border="1"><thead><tr>${header}<th>TF</th></tr></thead><tbody>${body}</tbody></table>`
}

// --- Mutua exclusión select/input ---
function setupMutualExclusion(selectId, manualIds) {
  const sel = document.getElementById(selectId)
  const manuals = manualIds.map((id) => document.getElementById(id))

  sel?.addEventListener('change', () => {
    const hasVal = sel.value !== '' && !isNaN(parseFloat(sel.value))
    manuals.forEach((m) => (m.disabled = hasVal))
  })

  manuals.forEach((m) => {
    m?.addEventListener('input', () => {
      const anyVal = manuals.some((x) => x.value.trim() !== '')
      sel.disabled = anyVal
      if (!anyVal) sel.disabled = false
    })
  })
}

// --- Toggle según dato faltante ---
function toggleDisabled(missing) {
  const disableA = ['#cationA', '#volumenCationManualA']
  const disableB = ['#cationB', '#cationManualB']
  const disableX = ['#anion', '#anionManualR', '#anionManualH']
  ;[...disableA, ...disableB, ...disableX].forEach((s) => {
    const el = $(s)
    if (el) el.disabled = false
  })
  ;(missing === 'A' ? disableA : missing === 'B' ? disableB : disableX).forEach(
    (s) => {
      const el = $(s)
      if (el) el.disabled = true
    }
  )
}

// --- Lógica principal ---
function calculo(ev) {
  ev.preventDefault()
  $('#errorInput').textContent = ''
  $('#resultados').innerHTML = ''
  $('#rango').textContent = ''

  let tfMin = parseNumOrNull($('#tfMin')?.value) ?? 0.8
  let tfMax = parseNumOrNull($('#tfMax')?.value) ?? 1.0
  if (tfMin > tfMax) [tfMin, tfMax] = [tfMax, tfMin]

  const missing = $('#missingKind')?.value
  const fixedA = getFixedCatA()
  const fixedB = getFixedCatB()
  const fixedX = getFixedAnion()

  const faltaA = fixedA === null || fixedA === 0 || isNaN(fixedA)
  const faltaB = fixedB === null || fixedB === 0 || isNaN(fixedB)
  const faltaXr = !fixedX || fixedX.xr === null || fixedX.xr === 0 || isNaN(fixedX.xr)
  const faltaXh = !fixedX || fixedX.xh === null || fixedX.xh === 0 || isNaN(fixedX.xh)

  if (
    (missing === 'A' && (faltaB || faltaXr || faltaXh)) ||
    (missing === 'B' && (faltaA || faltaXr || faltaXh)) ||
    (missing === 'X' && (faltaA || faltaB))
  ) {
    $('#errorInput').textContent = 'Inner data error, complete all fields.'
    return
  }

  // --- Aquí sigue tu cálculo normal ---
  let rows = []
  if (missing === 'A') {
    rows = enumCatAOptions()
      .map(({ name, rA }) => ({ name, rA, tf: computeTF(rA, fixedB, fixedX.xr, fixedX.xh) }))
      .filter((r) => r.tf >= tfMin && r.tf <= tfMax)
  } else if (missing === 'B') {
    rows = enumCatBOptions()
      .map(({ name, rB }) => ({ name, rB, tf: computeTF(fixedA, rB, fixedX.xr, fixedX.xh) }))
      .filter((r) => r.tf >= tfMin && r.tf <= tfMax)
  } else {
    rows = enumAnionOptions()
      .map(({ name, xr, xh }) => ({ name, xr, xh, tf: computeTF(fixedA, fixedB, xr, xh) }))
      .filter((r) => r.tf >= tfMin && r.tf <= tfMax)
  }

  $('#rango').textContent = `Found ${rows.length} combinations in range: [${tfMin}, ${tfMax}]`
  renderTable(rows, missing)
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  $('#datosForm')?.addEventListener('submit', calculo)

  // Mutua exclusión select ↔ input manual
  setupMutualExclusion('cationA', ['volumenCationManualA'])
  setupMutualExclusion('cationB', ['cationManualB'])
  setupMutualExclusion('anion', ['anionManualR', 'anionManualH'])

  // Manejo de dato faltante
  toggleDisabled($('#missingKind').value)
  $('#missingKind').addEventListener('change', (e) => toggleDisabled(e.target.value))
})
