import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (!user) return window.location.href = "login.html";

    try {
        // Obtener datos del usuario actual para definir el alcance
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : { rol: 'practicante' };
        
        // Ajustar títulos según el rol
        const title = document.getElementById('dashboard-title');
        const subtitle = document.getElementById('dashboard-subtitle');

        if (userData.rol === 'admin') {
            title.textContent = "Dashboard Global (Admin)";
            subtitle.textContent = "Visualización total de métricas del sistema y rendimiento de todos los líderes.";
        } else {
            title.textContent = "Balance de Gestión";
            subtitle.textContent = "Resumen ejecutivo del rendimiento de tu equipo de calidad.";
        }

        cargarEstadisticas(user.uid, userData.rol);
    } catch (e) {
        console.error("Error al identificar usuario:", e);
    }
});

async function cargarEstadisticas(uid, rol) {
    try {
        let qPracticantes, qTareas;

        // Lógica de alcance: Admin ve todo, Líder ve lo suyo
        if (rol === 'admin') {
            qPracticantes = collection(db, "usuarios");
            qTareas = collection(db, "tareas");
        } else {
            qPracticantes = query(collection(db, "usuarios"), where("liderId", "==", uid));
            qTareas = query(collection(db, "tareas"), where("liderId", "==", uid));
        }

        const [snapPracticantes, snapTareas] = await Promise.all([
            getDocs(qPracticantes),
            getDocs(qTareas)
        ]);

        let completadas = 0;
        let pendientes = 0;

        snapTareas.forEach(d => {
            d.data().estado === 'pendiente' ? pendientes++ : completadas++;
        });

        // Filtrado de practicantes para conteo (en caso de Admin)
        const totalPracticantes = rol === 'admin' 
            ? snapPracticantes.docs.filter(d => d.data().rol === 'practicante').length 
            : snapPracticantes.size;

        document.getElementById('count-practicantes').textContent = totalPracticantes;
        document.getElementById('count-tareas').textContent = completadas;
        document.getElementById('count-pendientes').textContent = pendientes;
        
        const total = completadas + pendientes;
        const eficiencia = total > 0 ? Math.round((completadas / total) * 100) : 0;
        document.getElementById('porcentaje-eficiencia').textContent = `${eficiencia}%`;

    } catch (error) {
        console.error("Error al calcular estadísticas:", error);
    }
}