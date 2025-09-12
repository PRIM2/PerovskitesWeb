

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://slcmugpuaomtuucyaiia.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY211Z3B1YW9tdHV1Y3lhaWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTgxNDAsImV4cCI6MjA1NDkzNDE0MH0.f4NAhJuzBK-inQZEYi90if7pFtpHWKCuHtsea5X7g_w"
);  

// --------- COMPROBAR ERRORES en CONSOLA ---------
async function comprobarError(tipo, error) {
    if (error) {
        console.log("❌ Comprobacion Error: " + tipo, error.message);
    } else {
        console.log("✅ Todo funciona correctamente: "+ tipo);
    }
}



export async function uploadData(table, column) {
    const { data, error } = await supabase
        .from(table)
        .select(column)

    comprobarError("Obtencion tol_table", error);
    return data
}








