import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const selectPracticante = document.getElementById('select-practicante');
const btnEnviar = document.getElementById('btn-enviar-tarea');

// 1. Cargar practicantes vinculados al líder
async function cargarPracticantes(liderId) {
    try {
        const q = query(collection(db, "usuarios"), where("rol", "==", "practicante"), where("liderId", "==", liderId));
        const snapshot = await getDocs(q);
        
        selectPracticante.innerHTML = '<option value="">Seleccione un practicante...</option>';
        
        if (snapshot.empty) {
            selectPracticante.innerHTML = '<option value="">No tienes practicantes asignados</option>';
            return;
        }

        snapshot.forEach(doc => {
            const p = doc.data();
            selectPracticante.innerHTML += `<option value="${doc.id}">${p.nombre}</option>`;
        });
    } catch (error) {
        console.error("Error al cargar practicantes:", error);
    }
}

// 2. Verificar autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        cargarPracticantes(user.uid);
    } else {
        window.location.href = "../html/login.html";
    }
});

// 3. Lógica de guardado
btnEnviar.addEventListener('click', async () => {
    const practicanteId = selectPracticante.value;
    const titulo = document.getElementById('titulo-tarea').value;
    const desc = document.getElementById('desc-tarea').value;
    const fechaLimite = document.getElementById('fecha-limite').value;

    if(!practicanteId || !titulo || !desc || !fechaLimite) {
        return alert("Por favor, completa todos los campos, incluyendo la fecha límite.");
    }

    try {
        await addDoc(collection(db, "tareas"), {
            titulo: titulo,
            descripcion: desc,
            practicanteId: practicanteId,
            liderId: auth.currentUser.uid,
            fechaLimite: fechaLimite,
            fechaCreacion: new Date().toISOString(),
            estado: "pendiente"
        });
        
        alert("¡Tarea asignada correctamente!");
        
        // Limpiar
        document.getElementById('titulo-tarea').value = "";
        document.getElementById('desc-tarea').value = "";
        document.getElementById('fecha-limite').value = "";
        selectPracticante.selectedIndex = 0;

    } catch (error) {
        console.error("Error al guardar tarea:", error);
        alert("Error al asignar tarea. Asegúrate de tener permisos.");
    }
});