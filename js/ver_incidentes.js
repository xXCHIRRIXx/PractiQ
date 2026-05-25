import { db, auth } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const contenedor = document.getElementById('lista-incidentes');
    
    try {
        // 1. Aseguramos que la consulta apunte exactamente a "incidentes"
        const q = query(collection(db, "incidentes"), orderBy("fecha", "desc"));
        const snapshot = await getDocs(q);

        console.log("Documentos encontrados:", snapshot.size); // MIRA ESTO EN LA CONSOLA

        if (snapshot.empty) {
            contenedor.innerHTML = "<p style='text-align:center;'>No hay incidentes reportados actualmente.</p>";
            return;
        }

        contenedor.innerHTML = ""; // Limpiar mensaje de carga

        snapshot.forEach((doc) => {
            const inc = doc.data();
            const div = document.createElement('div');
            div.className = "card-incidente-admin";
            
            // 2. Renderizado seguro con valores por defecto
            div.innerHTML = `
                <div class="incidente-info">
                    <span class="badge-asunto">${inc.asunto || 'Sin categoría'}</span>
                    <h3>${inc.titulo || 'Sin título'}</h3>
                    <p>${inc.descripcion || 'Sin descripción'}</p>
                    <div class="incidente-meta">
                        <i class='bx bx-calendar'></i> ${inc.fecha ? new Date(inc.fecha).toLocaleDateString() : 'Fecha no disponible'}
                    </div>
                </div>
                <button class="btn-check" onclick="alert('Resuelto')">
                    <i class='bx bx-check'></i>
                </button>
            `;
            contenedor.appendChild(div);
        });

    } catch (error) {
        console.error("Error al cargar incidentes:", error);
        contenedor.innerHTML = "<p>Error al cargar reportes. Revisa la consola.</p>";
    }
});