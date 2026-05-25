import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

// Función para marcar como completada
window.marcarCompletada = async (tareaId) => {
    try {
        await updateDoc(doc(db, "tareas", tareaId), { completada: true });
        location.reload(); // Recarga para ver el cambio visual
    } catch (e) {
        alert("Error al actualizar la tarea");
    }
};

onAuthStateChanged(auth, async (user) => {
    if (!user) return window.location.href = "login.html";
    
    const emailEl = document.getElementById('user-email');
    if(emailEl) emailEl.textContent = user.email;

    const contenedor = document.getElementById('lista-tareas');
    const q = query(collection(db, "tareas"), where("practicanteId", "==", user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        contenedor.innerHTML = "<p style='text-align:center;'>No tienes tareas pendientes.</p>";
        return;
    }

    contenedor.innerHTML = "";
    for (const docSnap of snapshot.docs) {
        const t = docSnap.data();
        const liderSnap = await getDoc(doc(db, "usuarios", t.liderId));
        const nombreLider = liderSnap.exists() ? liderSnap.data().nombre : "Líder";
        const esCompletada = t.completada === true;

        contenedor.innerHTML += `
            <div class="card-tarea ${esCompletada ? 'completada' : ''}">
                <h3>${esCompletada ? '<s>' + t.titulo + '</s>' : t.titulo}</h3>
                <p>${t.descripcion}</p>
                <div class="meta">
                    <span><i class='bx bx-user'></i> ${nombreLider}</span>
                    <span><i class='bx bx-calendar'></i> ${new Date(t.fechaCreacion).toLocaleDateString()}</span>
                    <span style="color: #e11d48;"><i class='bx bx-hourglass'></i> Límite: ${t.fechaLimite}</span>
                </div>
                ${!esCompletada ? `
                    <button onclick="marcarCompletada('${docSnap.id}')" class="btn-check">
                        <i class='bx bx-check'></i> Marcar como cumplida
                    </button>` : `<span class="status-badge"><i class='bx bx-check-double'></i> Completada</span>`}
            </div>
        `;
    }
});