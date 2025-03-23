import { uploadData } from '../dataBase/dataHandler.js';

async function createTable() {
    console.log('Loading data...');
    const perovs = await uploadData('perovsData', 'refPapeRaro, doiLink, year, tolFactor, smilesA, smilesB, smilesAnion, spinStateB'); 
    const cationA = await uploadData('cationA',  'smiles, textName, globularity'); 
    const cationB = await uploadData('cationB', 'smiles, spinState, ion');
    const anion = await uploadData('anion', 'smiles, textName');
  
    const anionMap = new Map(anion.map(a => [a.smiles, a]));
    const cationAMap = new Map(cationA.map(a => [a.smiles, a]));
    const cationBMap = new Map(cationB.map(b => [b.smiles, b]));
  
    const container = document.getElementById('tablaDatos');
    container.innerHTML = '';
  
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '2rem';
    table.style.width = '100%';
  
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Perovkite', 'TF', 'Globularity', 'Year', 'Reference'];
  
    headers.forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.border = '1px solid #ccc';
      th.style.padding = '6px';
      th.style.background = '#f0f0f0';
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    const tbody = document.createElement('tbody');
    perovs.forEach(p => {
      const an = anionMap.get(p.smilesAnion) || {};
      const catA = cationAMap.get(p.smilesA) || {};
      const catB = cationBMap.get(p.smilesB) || {};
        
      const catAName = cleanFormula(catA.textName);
      const anionName = cleanFormula(an.textName);
      const composedName = `${catAName || '?'}(${catB.ion || '?'})${anionName || '?'}`;
    
      const row = document.createElement('tr');
      const values = [
        composedName,
        p.tolFactor.toFixed(4) || '',
        catA.globularity || '',
        p.year || '',
        p.refPapeRaro || ''
      ];
  
      values.forEach((val, index) => {
        const td = document.createElement('td');
        td.style.border = '1px solid #ccc';
        td.style.padding = '6px';
        td.style.textAlign = 'center';
      
        const doi = p.doiLink;
      
        // Si es la columna de refPapeRaro
        if (index === 4 && val && doi) {
          // Eliminar desde el DOI hacia el final
          const cutIndex = val.indexOf('https');
          const cleanedText = cutIndex !== -1 ? val.slice(0, cutIndex).trim() : val;
      
          // Insertar salto de línea y luego el link
          td.innerHTML = `${cleanedText}<br><a href="${doi}" target="_blank" style="color:blue;">${doi}</a>`;
        } else {
          td.textContent = val;
        }
      
        row.appendChild(td);
      });
  
      tbody.appendChild(row);
    });
  
    table.appendChild(tbody);
    container.appendChild(table);
}


window.addEventListener('DOMContentLoaded', () => {
    createTable();
  });



// Limpia LaTeX y convierte subíndices a Unicode
function cleanFormula(text) {
    if (!text) return '';
  
    const subMap = {
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
      '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
      '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
    };
  
    const toSubscript = (str) => str.replace(/[0-9+\-=\(\)]/g, d => subMap[d] || d);
  
    let plain = text.replace(/\\text{([^}]*)}/g, '$1');
    plain = plain.replace(/_([0-9]+)/g, (_, d) => toSubscript(d));
    plain = plain.replace(/([A-Za-z\)])([0-9]+)/g, (_, l, d) => l + toSubscript(d));
  
    return plain;
  }