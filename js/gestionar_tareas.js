import { db, auth } from './firebase-config.js';
import { collection, getDocs, doc, getDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    document.getElementById('user-email').textContent = user.email;

    const contenedor = document.getElementById('lista-tareas-lider');
    
    try {
        // Traer todas las tareas ordenadas por fecha de creación
        const q = query(collection(db, "tareas"), orderBy("fechaCreacion", "desc"));
        const snapshot = await getDocs(q);
        
        document.getElementById('total-tareas').textContent = snapshot.size;

        if (snapshot.empty) {
            contenedor.innerHTML = `<div class="empty-state"><i class='bx bx-coffee-togo'></i><p>No has asignado tareas aún.</p></div>`;
            return;
        }

        contenedor.innerHTML = ""; // Limpiar el loader

        // Usamos un bucle para procesar cada tarea y obtener el nombre del practicante
        for (const docSnap of snapshot.docs) {
            const t = docSnap.data();
            const esCompletada = t.completada === true;

            // Obtener el nombre del practicante desde la colección 'usuarios'
            let nombrePrac = "Practicante";
            if (t.practicanteId) {
                const userRef = doc(db, "usuarios", t.practicanteId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    nombrePrac = userSnap.data().nombre || "Sin nombre";
                }
            }

            const card = document.createElement('div');
            card.className = `card-task ${esCompletada ? 'done' : 'pending'}`;
            
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <span class="task-badge">${esCompletada ? 'Completada' : 'Pendiente'}</span>
                    <span class="task-date">${t.fechaLimite ? 'Vence: ' + t.fechaLimite : ''}</span>
                </div>
                <h3>${t.titulo}</h3>
                <p>${t.descripcion}</p>
                <div class="task-footer">
                    <div class="practicante-info">
                        <i class='bx bx-user-circle'></i>
                        <span>${nombrePrac}</span>
                    </div>
                    <div class="task-date" title="Fecha de asignación">
                        <i class='bx bx-calendar-check'></i> ${new Date(t.fechaCreacion).toLocaleDateString()}
                    </div>
                </div>
            `;
            contenedor.appendChild(card);
        }

    } catch (error) {
        console.error("Error cargando tareas:", error);
        contenedor.innerHTML = "<p>Hubo un error al sincronizar las tareas. Revisa tu conexión.</p>";
    }
});