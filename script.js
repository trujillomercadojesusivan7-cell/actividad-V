const SUPABASE_URL = "https://hypxybgvxvpwfqflijty.supabase.co";
const SUPABASE_KEY = "sb_publishable_x6A2XiGzM9F2Qlk9xwBUvA_UK3HoJJz";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const inputUsuario = document.getElementById("usuario");
const inputContrasena = document.getElementById("contrasena");
const btn = document.getElementById("btnEnviar");
const msg = document.getElementById("mensaje");

function mostrarError(texto) {
  msg.textContent = texto;
  msg.classList.add("visible");
}

async function login() {
  const usuario = inputUsuario.value.trim();
  const password = inputContrasena.value;

  msg.classList.remove("visible");

  if (!usuario || !password) {
    mostrarError("Escribe tu usuario y contraseña");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Validando...";

  const { data, error } = await sb.functions.invoke("login-aunar", {
    body: {
      usuario: usuario,
      password: password
    }
  });

  console.log("data:", data, "error:", error);

  // --- PRUEBA: muestra la respuesta real de la función (borrar después) ---
  try {
    const r = await fetch(SUPABASE_URL + "/functions/v1/login-aunar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY
      },
      body: JSON.stringify({ usuario: usuario, password: password })
    });
    console.log("status:", r.status, "respuesta:", await r.text());
  } catch (e) {
    console.log("fetch error:", e);
  }
  // --- FIN PRUEBA ---

  btn.disabled = false;
  btn.textContent = "Enviar";

  if (error) {
    const status = error.context && error.context.status;
    if (status === 400 || status === 401 || status === 403 || status === 404) {
      mostrarError("Usuario inválido");
    } else {
      mostrarError("Error: " + error.message);
    }
    return;
  }

  // Ajusta esta condición según lo que responda la función
  const valido = data && (data.success || data.ok || data.valido || data.existe || data.usuario || data.user);

  if (valido) {
    localStorage.setItem("usuario", usuario);
    window.location.href = "bienvenida.html";
  } else {
    mostrarError("Usuario inválido");
  }
}

btn.addEventListener("click", login);
[inputUsuario, inputContrasena].forEach((el) =>
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
  })
);
