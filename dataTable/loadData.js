import { uploadData } from '../dataBase/dataHandler.js';

/* ------------------------------------------------------------------
   1. Carga Única de Datos (con control de error)
   ------------------------------------------------------------------ */
export async function loadAllData() {
  const container = document.getElementById('tablaDatos');
  container.innerHTML = '';

  const perovs  = await uploadData('perovsData', 'refPapeRaro, doiLink, year, tolFactor, smilesA, smilesB, smilesAnion, spinStateB');
  const cationA = await uploadData('cationA',     'smiles, textName, globularity');
  const cationB = await uploadData('cationB',     'smiles, spinState, ion');
  const anion   = await uploadData('anion',       'smiles, textName');

  if (!perovs || !cationA || !cationB || !anion) {
    /* —‑ Renderizado de error con estilo coherente —‑ */
    const table = document.createElement('table');
    table.className = 'errorTabla'; // reutiliza tu CSS

    const tbody = document.createElement('tbody');
    ['Error uploading data …', 'Please contact: ferran.gb.04@gmail.com / ferran.gberenguer@udc.es']
      .forEach(msg => {
        const tr  = document.createElement('tr');
        const td  = document.createElement('td');
        td.colSpan = 5;
        td.textContent = msg;
        tr.appendChild(td);
        tbody.appendChild(tr);
      });
    table.appendChild(tbody);
    container.appendChild(table);
    return null;
  }

  return { perovs, cationA, cationB, anion };
}

/* ------------------------------------------------------------------
   2. Paginación – botones ✱flex✱ horizontales
   ------------------------------------------------------------------ */
function createPagination(container, totalPages, currentPage, onPageChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'pagination';          // tu CSS controla el diseño

  // helper para subir al principio con scroll suave
  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* ⬅ Botón INICIO */
  const first = document.createElement('button');
  first.innerHTML  = '«';                    // o 'First'
  first.disabled   = currentPage === 1;
  first.onclick    = () => { onPageChange(1); goTop(); };
  wrapper.appendChild(first);

  /* Botón «Anterior» */
  const prev = document.createElement('button');
  prev.innerHTML  = '❮';
  prev.disabled   = currentPage === 1;
  prev.onclick    = () => { onPageChange(currentPage - 1); goTop(); };
  wrapper.appendChild(prev);

  /* Botones de página */
  for (let i = 1; i <= totalPages; i++) {
    const btn   = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick  = () => { onPageChange(i); goTop(); };
    wrapper.appendChild(btn);
  }

  /* Botón «Siguiente» */
  const next = document.createElement('button');
  next.innerHTML  = '❯';
  next.disabled   = currentPage === totalPages;
  next.onclick    = () => { onPageChange(currentPage + 1); goTop(); };
  wrapper.appendChild(next);

  container.appendChild(wrapper);
}

/* ------------------------------------------------------------------
   3. Construcción de la tabla (con paginado)
   ------------------------------------------------------------------ */
export function createTable(data, page = 1, pageSize = 16) {
  const tableContainer = document.getElementById('tablaDatos');
  const paginationContainer = document.getElementById('pagination');
  tableContainer.innerHTML = '';
  paginationContainer.innerHTML = '';

  const { perovs, cationA, cationB, anion } = data;

  /* —‑ Mapas rápidos —‑ */
  const anionMap   = new Map(anion.map(a    => [a.smiles, a]));
  const cationAMap = new Map(cationA.map(a => [a.smiles, a]));
  const cationBMap = new Map(cationB.map(b => [b.smiles, b]));

  /* —‑ Paginado —‑ */
  const totalPages      = Math.ceil(perovs.length / pageSize);
  const start           = (page - 1) * pageSize;
  const currentPageData = perovs.slice(start, start + pageSize);

  /* —‑ Tabla —‑ */
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom   = '2rem';
  table.style.width          = '100%';

  // Encabezados
  const thead      = document.createElement('thead');
  const headerRow  = document.createElement('tr');
  const headers    = ['Perovskite', 'TF', 'Globularity', 'Year', 'Reference'];
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent   = h;
    th.style.padding = '6px';
    th.style.border  = '1px solid #ccc';
    th.style.background = '#f0f0f0';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  currentPageData.forEach(p => {
    const row = document.createElement('tr');

    const an  = anionMap.get(p.smilesAnion) || {};
    const catA = cationAMap.get(p.smilesA) || {};
    const catB = cationBMap.get(p.smilesB) || {};

    const composedName = `${cleanFormula(catA.textName) || '?'}(${catB.ion || '?'})${cleanFormula(an.textName) || '?'}`;

    const cells = [
      composedName,
      p.tolFactor?.toFixed(4) || '',
      catA.globularity || '',
      p.year || '',
      p.refPapeRaro || ''
    ];

    cells.forEach((val, idx) => {
      const td = document.createElement('td');
      td.style.padding = '6px';
      td.style.textAlign = 'center';
      td.style.border = '1px solid #ccc';

      if (idx === 4 && p.doiLink) {
        const cut = val.indexOf('https');
        const txt = cut !== -1 ? val.slice(0, cut).trim() : val;
        td.innerHTML = `${txt}<br><a href="${p.doiLink}" target="_blank" style="color:blue;">${p.doiLink}</a>`;
      } else {
        td.textContent = val;
      }
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  /* —‑ Insertamos tabla y botones —‑ */
  tableContainer.appendChild(table);
  createPagination(paginationContainer, totalPages, page, (newPage) => createTable(data, newPage, pageSize));
}

/* ------------------------------------------------------------------
   4. Helper para fórmulas químicas
   ------------------------------------------------------------------ */
function cleanFormula(text) {
  if (!text) return '';
  const sub = { '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','+':'₊','-':'₋','=':'₌','(':'₍',')':'₎' };
  const toSub = s => s.replace(/[0-9+\-=()]/g, d => sub[d] || d);
  let t = text.replace(/\\text{([^}]*)}/g, '$1');
  t = t.replace(/_([0-9]+)/g, (_, d) => toSub(d));
  t = t.replace(/([A-Za-z)])([0-9]+)/g, (_, l, d) => l + toSub(d));
  return t;
}

/* ------------------------------------------------------------------
   5. Bootstrap al cargar la página
   ------------------------------------------------------------------ */
window.addEventListener('DOMContentLoaded', async () => {
  const data = await loadAllData();
  if (data) createTable(data);
});
