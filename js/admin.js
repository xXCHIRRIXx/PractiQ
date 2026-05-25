import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    // 1. Proteger Ruta
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const emailEl = document.getElementById('user-email');
            if (emailEl) emailEl.textContent = user.email;
        } else {
            // CORREGIDO: Redirige al index.html de la raíz si no hay sesión
            window.location.href = "../index.html";
        }
    });

    // 2. Cerrar Sesión
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            // CORREGIDO: Redirige al index.html de la raíz tras cerrar sesión
            signOut(auth).then(() => window.location.href = "../index.html");
        });
    }

    // 3. Botón de Regresar (Nueva funcionalidad para volver al index raíz)
    const btnRegresar = document.getElementById('btn-regresar'); // Asegúrate de tener este ID en tu admin.html
    if (btnRegresar) {
        btnRegresar.addEventListener('click', () => {
            window.location.href = "../index.html";
        });
    }

    // 4. Lógica del Modal de Asignación
    const modal = document.getElementById('modal-asignacion');
    const btnAsignar = document.getElementById('card-asignar-admin');
    const btnClose = document.querySelector('.close-modal');

    if (btnAsignar) {
        btnAsignar.addEventListener('click', async () => {
            modal.style.display = "block";
            await cargarUsuariosParaAsignar();
        });
    }

    if (btnClose) {
        btnClose.onclick = () => modal.style.display = "none";
    }
    
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

    async function cargarUsuariosParaAsignar() {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const practicantes = [];
        const lideres = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.rol === 'practicante') practicantes.push({ id: doc.id, ...data });
            if (data.rol === 'lider') lideres.push({ id: doc.id, ...data });
        });

        const tbody = document.getElementById('lista-asignaciones');
        if (tbody) {
            tbody.innerHTML = practicantes.map(p => `
                <tr>
                    <td><strong>${p.nombre}</strong><br><small>${p.correo}</small></td>
                    <td>
                        <select id="select-${p.id}">
                            <option value="">Seleccionar Líder...</option>
                            ${lideres.map(l => `<option value="${l.id}" ${p.liderId === l.id ? 'selected' : ''}>${l.nombre}</option>`).join('')}
                        </select>
                    </td>
                    <td><button class="btn-save" onclick="guardarAsignacion('${p.id}')">Guardar</button></td>
                </tr>
            `).join('');
        }
    }

    window.guardarAsignacion = async (practicanteId) => {
        const liderId = document.getElementById(`select-${practicanteId}`).value;
        try {
            await updateDoc(doc(db, "usuarios", practicanteId), { liderId: liderId });
            alert("Asignación guardada correctamente");
        } catch (e) {
            alert("Error al guardar: " + e.message);
        }
    };

    // 5. Navegación Interna (Se quedan igual porque comparten la carpeta html)
    const cardStats = document.getElementById('card-stats');
    if (cardStats) cardStats.onclick = () => window.location.href = "dashboard.html";

    const cardNovedades = document.getElementById('card-novedades');
    if (cardNovedades) cardNovedades.onclick = () => window.location.href = "novedades.html";

    const cardChatAdmin = document.getElementById('card-chat-admin');
    if (cardChatAdmin) cardChatAdmin.onclick = () => window.location.href = "chat.html";
    
    // Opcional por si usas el clic desde JS para incidentes:
    // const cardIncidentes = document.getElementById('card-incidentes-global');
    // if (cardIncidentes) cardIncidentes.onclick = () => window.location.href = "ver_incidentes.html";
});