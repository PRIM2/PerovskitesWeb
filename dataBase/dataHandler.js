// --------- COMPROBAR ERRORES en CONSOLA ---------
async function comprobarError(tipo, error) {
  if (error) {
    console.log("❌ Comprobacion Error: " + tipo, error.message || error);
  } else {
    console.log("✅ Todo funciona correctamente: " + tipo);
  }
}

// Carga y cachea el JSON (para no pedirlo cada vez)
let __dbCache = null;

async function loadLocalDB() {
  if (__dbCache) return __dbCache;

  try {
    const res = await fetch("./dataBase/dataBase.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`No se pudo cargar dataBase.json (${res.status})`);
    __dbCache = await res.json();
    await comprobarError("Carga dataBase.json", null);
    return __dbCache;
  } catch (e) {
    await comprobarError("Carga dataBase.json", e);
    throw e;
  }
}

// Simula tu antigua función: table + column
export async function uploadData(table, column) {
  const db = await loadLocalDB();

  // Tu JSON tiene pinta de: { exported_at, source, tables: { perovsData: [...] } }
  const rows = db?.tables?.[table];

  if (!Array.isArray(rows)) {
    const e = new Error(`Tabla "${table}" no existe en dataBase.json (db.tables.${table})`);
    await comprobarError("Lectura tabla", e);
    return [];
  }

  // column puede ser "*" o una columna o varias
  if (column === "*" || column === undefined || column === null) {
    await comprobarError(`Obtencion ${table}.*`, null);
    return rows;
  }

  // Permite "a,b,c" o ["a","b","c"]
  const cols = Array.isArray(column)
    ? column
    : String(column).split(",").map(s => s.trim()).filter(Boolean);

  const projected = rows.map(r => {
    const obj = {};
    for (const c of cols) obj[c] = r?.[c];
    return obj;
  });

  await comprobarError(`Obtencion ${table}.${cols.join(",")}`, null);
  return projected;
}
