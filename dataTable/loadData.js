import { uploadData } from '../dataBase/dataHandler.js';

/* ------------------------------------------------------------------
  1. Carga Única de Datos (con control de error)
  ------------------------------------------------------------------ */
export async function loadAllData() {
  const container = document.getElementById('tablaDatos');
  container.innerHTML = '';

  const perovs = await uploadData('perovsData', 'refPapeRaro, doiLink, year, tolFactor, smilesA, smilesB, smilesAnion, spinStateB');
  const cationA = await uploadData('cationA', 'smiles, textName, globularity');
  const cationB = await uploadData('cationB', 'smiles, spinState, ion');
  const anion = await uploadData('anion', 'smiles, textName');

  if (!perovs || !cationA || !cationB || !anion) {
    /* — Renderizado de error con estilo coherente — */
    const table = document.createElement('table');
    table.className = 'errorTabla'; // reutiliza tu CSS

    const tbody = document.createElement('tbody');
    ['Error uploading data …', 'Please contact: ferran.gb.04@gmail.com ']
      .forEach(msg => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
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
  wrapper.className = 'pagination'; // tu CSS controla el diseño

  // helper para subir al principio con scroll suave
  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* ⬅ Botón INICIO */
  const first = document.createElement('button');
  first.innerHTML = '«'; // o 'First'
  first.disabled = currentPage === 1;
  first.onclick = () => { onPageChange(1); goTop(); };
  wrapper.appendChild(first);

  /* Botón «Anterior» */
  const prev = document.createElement('button');
  prev.innerHTML = '❮';
  prev.disabled = currentPage === 1;
  prev.onclick = () => { onPageChange(currentPage - 1); goTop(); };
  wrapper.appendChild(prev);

  /* Botones de página */
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => { onPageChange(i); goTop(); };
    wrapper.appendChild(btn);
  }

  /* Botón «Siguiente» */
  const next = document.createElement('button');
  next.innerHTML = '❯';
  next.disabled = currentPage === totalPages;
  next.onclick = () => { onPageChange(currentPage + 1); goTop(); };
  wrapper.appendChild(next);

  container.appendChild(wrapper);
}

/* ------------------------------------------------------------------
  3. Construcción de la tabla (con paginado)
  ------------------------------------------------------------------ */
// Variable global para mantener el foco del input
let activeElementInfo = null;
// 1. Función para generar la fila de filtros
function createFilterRow(headers, filters, onFilterChange) {
  const row = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.style.border = '1px solid #ccc';
    // ¡Elimina el padding aquí, lo manejaremos en el div!
    // th.style.padding = '4px'; // <-- ELIMINAR O COMENTAR ESTA LÍNEA

    // Crear un div para envolver el input y facilitar el centrado
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'filter-input-wrapper'; // Añadir una clase para estilizarlo

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Filter by ${h}`;
    input.value = filters[h] || '';
    // input.style.width = '90%'; // <-- ELIMINAR ESTA LÍNEA, lo haremos con CSS
    input.dataset.header = h; // Para identificar el input
    input.oninput = (event) => {
      activeElementInfo = {
        header: h,
        selectionStart: event.target.selectionStart,
        selectionEnd: event.target.selectionEnd
      };
      filters[h] = event.target.value;
      onFilterChange(filters);
    };

    inputWrapper.appendChild(input); // Añadir el input al div
    th.appendChild(inputWrapper);    // Añadir el div a la celda th
    row.appendChild(th);
  });
  return row;
}

// 2. createTable con llamada a createFilterRow
export function createTable(data, page = 1, pageSize = 16, filters = {}) {
  const tableContainer = document.getElementById('tablaDatos');
  const paginationContainer = document.getElementById('pagination');
  tableContainer.innerHTML = '';
  paginationContainer.innerHTML = '';

  const { perovs, cationA, cationB, anion } = data;
  const anionMap = new Map(anion.map(a => [a.smiles, a]));
  const cationAMap = new Map(cationA.map(a => [a.smiles, a]));
  const cationBMap = new Map(cationB.map(b => [b.smiles, b]));

  // 2.1 Filtrado
  const filtered = perovs.filter(p => {
    const an = anionMap.get(p.smilesAnion) || {};
    const catA = cationAMap.get(p.smilesA) || {};
    const catB = cationBMap.get(p.smilesB) || {};
    const composed = `(${cleanFormula(catA.textName) || ''})${catB.ion || ''}(${cleanFormula(an.textName) || ''})`.toLowerCase();

    return Object.entries(filters).every(([key, val]) => {
      if (!val) return true;

      // Aplicar cleanFormula al valor del filtro para permitir subíndices
      const cleanedVal = cleanFormula(val).toLowerCase();

      switch (key) {
        case 'Perovskite': return composed.includes(cleanedVal);
        case 'TF': return (p.tolFactor?.toFixed(4) || '').includes(val); // TF y Year no necesitan subíndices
        case 'Globularity': return (catA.globularity || '').includes(val);
        case 'Year': return (String(p.year) || '').includes(val);
        case 'Reference': return (p.refPapeRaro || '').toLowerCase().includes(val.toLowerCase());
        default: return true;
      }
    });
  });

  // 2.2 Paginado
  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (page - 1) * pageSize;
  const currentPageData = filtered.slice(start, start + pageSize);

  // 2.3 Construcción de tabla
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '2rem';
  table.style.width = '100%';

  // Encabezados
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['Perovskite', 'TF', 'Globularity', 'Year', 'Reference'];

  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    th.style.padding = '6px';
    th.style.border = '1px solid #ccc';
    th.style.background = '#f0f0f0';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Fila de filtros (modular)
  const filterRow = createFilterRow(headers, filters, (newFilters) => {
    createTable(data, 1, pageSize, newFilters);
    // Restaurar el foco después de la actualización
    if (activeElementInfo) {
      const inputToFocus = tableContainer.querySelector(`input[data-header="${activeElementInfo.header}"]`);
      if (inputToFocus) {
        inputToFocus.focus();
        inputToFocus.selectionStart = activeElementInfo.selectionStart;
        inputToFocus.selectionEnd = activeElementInfo.selectionEnd;
        activeElementInfo = null; // Limpiar después de usar
      }
    }
  });
  thead.appendChild(filterRow);

  table.appendChild(thead);

  // Cuerpo
  const tbody = document.createElement('tbody');
  currentPageData.forEach(p => {
    const row = document.createElement('tr');
    const an = anionMap.get(p.smilesAnion) || {};
    const catA = cationAMap.get(p.smilesA) || {};
    const catB = cationBMap.get(p.smilesB) || {};
    const composedName = `[${cleanFormula(catA.textName) || '?'}]${catB.ion || '?'}(${cleanFormula(an.textName) || '?'})₃`;

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

  // Insertar tabla y paginación
  tableContainer.appendChild(table);
  createPagination(paginationContainer, totalPages, page, np => createTable(data, np, pageSize, filters));
}

/* ------------------------------------------------------------------
  4. Helper para fórmulas químicas
  ------------------------------------------------------------------ */
function cleanFormula(text) {
  if (!text) return '';
  const sub = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎' };
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
