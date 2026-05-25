import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const contenedor = document.getElementById('lista-practicantes');

onAuthStateChanged(auth, async (user) => {
    if (!user) return window.location.href = "../html/login.html";

    const q = query(collection(db, "usuarios"), where("rol", "==", "practicante"), where("liderId", "==", user.uid));
    const snapshot = await getDocs(q);

    contenedor.innerHTML = "";
    snapshot.forEach((doc) => {
        const p = doc.data();
        const div = document.createElement('div');
        div.className = 'card-practicante';
        div.innerHTML = `
            <div class="header-p" onclick="toggleTareas('${doc.id}')">
                <strong>👤 ${p.nombre}</strong>
                <span id="badge-${doc.id}" class="badge">Consultar tareas...</span>
            </div>
            <div id="tareas-${doc.id}" class="tareas-container" style="display:none;"></div>
        `;
        contenedor.appendChild(div);
    });
});

window.toggleTareas = async (practicanteId) => {
    const contenedorTareas = document.getElementById(`tareas-${practicanteId}`);
    const badge = document.getElementById(`badge-${practicanteId}`);
    
    if (contenedorTareas.style.display === 'block') {
        contenedorTareas.style.display = 'none';
        return;
    }

    contenedorTareas.innerHTML = "Cargando...";
    contenedorTareas.style.display = 'block';

    const q = query(collection(db, "tareas"), where("practicanteId", "==", practicanteId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        contenedorTareas.innerHTML = "<p style='padding:10px;'>No tiene tareas asignadas.</p>";
        badge.innerText = "0 tareas";
    } else {
        badge.innerText = `${snapshot.size} tarea(s)`;
        contenedorTareas.innerHTML = snapshot.docs.map(t => {
            const data = t.data();
            const taskId = t.id;
            return `
                <div class="tarea-item">
                    <div class="tarea-header" onclick="toggleDescripcion('${taskId}')">
                        <i class='bx bx-chevron-right'></i> ${data.titulo}
                    </div>
                    <div id="desc-${taskId}" class="tarea-desc" style="display:none;">
                        <p>${data.descripcion}</p>
                        <small>📅 Creada: ${new Date(data.fechaCreacion).toLocaleDateString()}</small>
                    </div>
                </div>
            `;
        }).join('');
    }
};

window.toggleDescripcion = (taskId) => {
    const descEl = document.getElementById(`desc-${taskId}`);
    descEl.style.display = descEl.style.display === 'none' ? 'block' : 'none';
};