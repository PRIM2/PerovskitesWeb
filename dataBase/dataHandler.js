

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://slcmugpuaomtuucyaiia.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY211Z3B1YW9tdHV1Y3lhaWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTgxNDAsImV4cCI6MjA1NDkzNDE0MH0.f4NAhJuzBK-inQZEYi90if7pFtpHWKCuHtsea5X7g_w"
);

// --------- COMPROBAR ERRORES en CONSOLA ---------
async function comprobarError(tipo, error) {
    if (error) {
        console.error("❌ Error:" + tipo, error.message);
    } else {
        console.log("✅ Todo funciona correctamente: "+ tipo);
    }
}

// --------- COMPROBAR INICIO de SESION ---------
async function comprobarSesion() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        alert("Inicia sesión para continuar.");
        console.error("❌ No se pudo obtener el usuario:", error?.message);
        return null; // Devolvemos null en lugar de salir sin valor
    }

    return data.user.id;
}



// ---------- REGISTRO ----------
export async function registrarUsuario(Name, Surname, email, password) {
    const output = document.getElementById('output');

    // REGISTRO DENTRO DE USUARIOS de SUPABASE
    const { data, error: authError } = await supabase.auth.signUp({ email, password });
    comprobarError("Registro en Auth", authError)


    const userId = data?.user?.id;

    // INSERTAR USUARIO EN TABLA DE DATOS
    const { error: dbError } = await supabase
        .from("tol_table")
        .insert([
            {
                id: userId, // ID en formato UUID
                email: email,
                name: Name,
                surname: Surname
            }
        ]);

    comprobarError("Registro en tol_table", dbError)
    if (!dbError){
        return true
    }

}

// ---------- INICIAR SESION ----------
export async function iniciarSesion(email, password) {
    // const email = 'prueba@gmail.com';
    // const password = 'vamosquesepuede';

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    comprobarError("Inicio de sesion", error)
    if (error){
        return error.message
    } else {return "nada"}
}

export async function getUser() {
    const userId = await comprobarSesion();

    const { data, error } = await supabase
        .from('tol_table')
        .select('name , surname')
        .eq('id', userId);

    comprobarError("Obtencion del nombre y apellido", error)

    return data[0].name + " " + data[0].surname
}


// ---------- AGREGAR un TOL_DATA ---------
async function agregarTolData(valor1, valor2, valor3) {

    // OBTENGO EL USUARIO ID 
    const userId = await comprobarSesion();


    const nameCalc = (valor1);
    const numero1 = Number(valor2);
    const numero2 = Number(valor3);


    // Creamos el objeto JSON con los dos valores
    const nuevoObjeto = {
        NameCalc: nameCalc,
        Tolerance: numero1, 
        Globularity: numero2
    };

    // AÑADIR DATOS CON ARRAY_APPEND_JSON
    const {data, error } = await supabase
        .rpc("array_append_json", {
            column_name: "tol_data", 
            record_id: userId, 
            value: nuevoObjeto 
        });
        comprobarError("Agregar tol_data", error)
}

// ---------- ELIMINAR un TOL_DATA ---------
async function deleteTolData(NameCalc) {
    const userId = await comprobarSesion();

    // FUNCION SQL DE SUPABASE para eliminar
    const { data, error } = await supabase.rpc("remove_json_from_jsonb_array", {
        record_id: userId,
        name_calc: NameCalc
    });
    comprobarError("Eliminar << " + NameCalc + " >> en tol_data", error)
}

// ---------- ELIMINAR TODAS LAS TOL_DATA ---------
async function deleteEveryThingTolData() {
    const userId = await comprobarSesion();

    const { data, error } = await supabase
    .from('tol_table')
    .update({ tol_data: [] }) // Borra el contenido de la columna
    .eq('id', userId); // Filtra la fila específica

    comprobarError("Reseteo de tol_data", error)
}

// ---------- OBTENER TOL_DATA ---------
export async function uploadTolData() {
    const userId = await comprobarSesion();

    const { data, error } = await supabase
        .from('tol_table')
        .select('tol_data')
        .eq('id', userId);

    comprobarError("Obtencion tol_table", error);
    console.log(data[0]?.tol_data);
    return data[0]?.tol_data || []
}







