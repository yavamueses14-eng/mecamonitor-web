import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Si ya está logueado, redirige al dashboard
onAuthStateChanged(auth, (user) => {
  if (user) window.location.href = "dashboard.html";
});

document.getElementById("btn-login").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorDiv = document.getElementById("error-msg");

  if (!email || !password) {
    errorDiv.textContent = "Por favor completa todos los campos.";
    errorDiv.classList.remove("d-none");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    errorDiv.textContent = "Credenciales incorrectas. Verifica tu correo y contraseña.";
    errorDiv.classList.remove("d-none");
  }
});