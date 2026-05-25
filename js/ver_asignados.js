import { db, auth } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

let listaAsignados = [];

// --- 1. Autenticación ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        const emailEl = document.getElementById('user-email');
        if (emailEl) emailEl.innerText = user.email;
    } else {
        window.location.href = '../html/login.html';
    }
});

document.getElementById('btn-logout')?.addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = '../html/login.html');
});

// --- 2. Navegación ---
window.retroceder = () => window.history.back();

// --- 3. Carga y Unión de datos (Join) ---
async function cargarAsignados() {
    const contenedor = document.getElementById('lista-gestion');
    try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const todos = [];
        const mapaLideres = {};

        querySnapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            todos.push(data);
            if (data.rol?.toLowerCase() === 'lider') {
                mapaLideres[data.id] = data.nombre;
            }
        });

        listaAsignados = todos
            .filter(u => u.rol?.toLowerCase() === 'practicante' && u.liderId)
            .map(p => ({
                ...p,
                nombreLider: mapaLideres[p.liderId] || "Líder no asignado"
            }));

        render(listaAsignados);
    } catch (error) {
        contenedor.innerHTML = `<p style="text-align:center; color:red;">Error al cargar datos: ${error.message}</p>`;
    }
}

// --- 4. Renderizado ---
function render(lista) {
    const contenedor = document.getElementById('lista-gestion');
    if (lista.length === 0) {
        contenedor.innerHTML = `<p style="text-align:center;">No hay asignaciones registradas.</p>`;
        return;
    }

    contenedor.innerHTML = lista.map(p => {
        const fecha = p.fechaAsignacion ? new Date(p.fechaAsignacion).toLocaleDateString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }) : 'Sin fecha';

        return `
            <div class="card">
                <div class="card-info">
                    <strong>👤 ${p.nombre}</strong>
                    <small>👔 Líder: ${p.nombreLider}</small>
                </div>
                <div style="text-align: right;">
                    <small class="badge">📅 ${fecha}</small>
                </div>
            </div>
        `;
    }).join('');
}

// --- 5. Buscador y Ordenamiento ---
document.getElementById('buscador')?.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    render(listaAsignados.filter(p => p.nombre.toLowerCase().includes(termino)));
});

window.ordenar = (dir) => {
    const ordenados = [...listaAsignados].sort((a, b) => 
        dir === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
    );
    render(ordenados);
};

document.addEventListener('DOMContentLoaded', cargarAsignados);