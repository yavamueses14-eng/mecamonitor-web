import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { initCharts, updateCharts } from "./charts.js";

// Verificar autenticación
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    document.getElementById("user-email").textContent = user.email;
    initApp();
  }
});

// Cerrar sesión
document.getElementById("btn-logout").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

function calcularEficiencia(vel, corriente, vibracion) {
  if (!corriente || !vibracion || corriente === 0 || vibracion === 0) return null;
  return (vel / (corriente * vibracion)).toFixed(4);
}

function initApp() {
  initCharts();

  const q = query(collection(db, "sensores"), orderBy("fecha", "desc"), limit(20));
  onSnapshot(q, (snapshot) => {
    const registros = [];
    snapshot.forEach(doc => registros.push({ id: doc.id, ...doc.data() }));

    actualizarCards(registros[0]);
    actualizarTabla(registros);
    updateCharts(registros.slice().reverse());
  });

  document.getElementById("btn-guardar").addEventListener("click", guardarDatos);
}

function actualizarCards(dato) {
  if (!dato) return;
  document.getElementById("card-temp").textContent = dato.temperatura + " °C";
  document.getElementById("card-vel").textContent = dato.velocidadMotor + " RPM";
  document.getElementById("card-corriente").textContent = dato.corriente + " A";
  document.getElementById("card-vibracion").textContent = dato.vibracion + " mm/s";

  const ef = calcularEficiencia(dato.velocidadMotor, dato.corriente, dato.vibracion);
  const efDiv = document.getElementById("eficiencia-valor");
  const efEstado = document.getElementById("eficiencia-estado");

  if (ef !== null) {
    efDiv.textContent = ef;
    const val = parseFloat(ef);
    if (val >= 50) {
      efEstado.className = "badge badge-success";
      efEstado.textContent = "✅ Alta Eficiencia";
    } else if (val >= 20) {
      efEstado.className = "badge badge-warning";
      efEstado.textContent = "⚠️ Eficiencia Media";
    } else {
      efEstado.className = "badge badge-danger";
      efEstado.textContent = "❌ Baja Eficiencia";
    }
  }
}

function actualizarTabla(registros) {
  const tbody = document.getElementById("tabla-body");
  if (registros.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Sin registros aún.</td></tr>';
    return;
  }
  tbody.innerHTML = registros.map(d => {
    const ef = calcularEficiencia(d.velocidadMotor, d.corriente, d.vibracion);
    const fecha = d.fecha ? new Date(d.fecha.seconds * 1000).toLocaleString("es-CO") : "—";
    return `
      <tr>
        <td>${fecha}</td>
        <td>${d.temperatura}</td>
        <td>${d.velocidadMotor}</td>
        <td>${d.corriente}</td>
        <td>${d.vibracion}</td>
        <td><span class="badge badge-primary">${ef ?? "—"}</span></td>
      </tr>
    `;
  }).join("");
}

async function guardarDatos() {
  const temp = parseFloat(document.getElementById("f-temp").value);
  const vel = parseFloat(document.getElementById("f-vel").value);
  const corriente = parseFloat(document.getElementById("f-corriente").value);
  const vibracion = parseFloat(document.getElementById("f-vibracion").value);
  const msgDiv = document.getElementById("form-msg");

  if (isNaN(temp) || isNaN(vel) || isNaN(corriente) || isNaN(vibracion)) {
    msgDiv.className = "alert alert-danger";
    msgDiv.textContent = "⚠️ Todos los campos son obligatorios y deben ser números válidos.";
    msgDiv.classList.remove("d-none");
    return;
  }

  if (temp < 0 || vel < 0 || corriente <= 0 || vibracion <= 0) {
    msgDiv.className = "alert alert-warning";
    msgDiv.textContent = "⚠️ Los valores deben ser positivos. Corriente y vibración deben ser > 0.";
    msgDiv.classList.remove("d-none");
    return;
  }

  try {
    await addDoc(collection(db, "sensores"), {
      temperatura: temp,
      velocidadMotor: vel,
      corriente: corriente,
      vibracion: vibracion,
      fecha: serverTimestamp()
    });

    msgDiv.className = "alert alert-success";
    msgDiv.textContent = "✅ Datos guardados correctamente en Firebase.";
    msgDiv.classList.remove("d-none");

    ["f-temp", "f-vel", "f-corriente", "f-vibracion"].forEach(id => {
      document.getElementById(id).value = "";
    });

    setTimeout(() => msgDiv.classList.add("d-none"), 3000);
  } catch (err) {
    msgDiv.className = "alert alert-danger";
    msgDiv.textContent = "❌ Error al guardar: " + err.message;
    msgDiv.classList.remove("d-none");
  }
}