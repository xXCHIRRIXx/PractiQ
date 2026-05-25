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
            window.location.href = "login.html";
        }
    });

    // 2. Cerrar Sesión
    document.getElementById('btn-logout').addEventListener('click', () => {
        signOut(auth).then(() => window.location.href = "login.html");
    });

    // 3. Lógica del Modal de Asignación
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

    // 4. Navegación (Se eliminan los alerts que no necesitas)
    document.getElementById('card-stats').onclick = () => window.location.href = "dashboard.html";
    document.getElementById('card-novedades').onclick = () => window.location.href = "novedades.html";
    document.getElementById('card-chat-admin').onclick = () => window.location.href = "chat.html";
    
    // NOTA: 'card-incidentes-global' ya redirige desde el HTML, 
    // pero si prefieres el JS, puedes quitar el onclick del HTML y poner:
    // document.getElementById('card-incidentes-global').onclick = () => window.location.href = "ver_incidentes.html";
});