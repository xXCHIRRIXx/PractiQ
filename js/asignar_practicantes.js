import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { db } from './firebase-config.js';

/**
 * Guarda la asignación del líder y la fecha actual en formato ISO
 * @param {string} practicanteId - ID del documento del practicante
 * @param {string} liderId - ID del líder seleccionado
 */
export async function guardarAsignacion(practicanteId, liderId) {
    try {
        const docRef = doc(db, "usuarios", practicanteId);
        
        await updateDoc(docRef, {
            liderId: liderId,
            fechaAsignacion: new Date().toISOString() // Guarda fecha como string ISO
        });
        
        console.log("Asignación exitosa");
        alert("¡Asignación realizada correctamente!");
        return true;
    } catch (error) {
        console.error("Error al asignar:", error);
        alert("Hubo un error al guardar: " + error.message);
        return false;
    }
}