import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Monitoreo de autenticación
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const emailEl = document.getElementById('user-email');
            if (emailEl) emailEl.textContent = user.email;
        } else {
            // Corregido: Sale de la carpeta para ir al index en la raíz
            window.location.href = "../index.html";
        }
    });

    // 2. Cerrar sesión
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            try {
                btnLogout.textContent = "Saliendo...";
                await signOut(auth);
                // Corregido: Sale de la carpeta para ir al index en la raíz
                window.location.href = "../index.html";
            } catch (error) {
                console.error("Error al salir:", error);
                btnLogout.textContent = "Salir";
            }
        });
    }

    // 3. Botón de Regresar (Nueva funcionalidad para volver al index raíz)
    const btnRegresar = document.getElementById('btn-regresar'); // Asegúrate de que el ID en tu HTML sea 'btn-regresar'
    if (btnRegresar) {
        btnRegresar.addEventListener('click', () => {
            window.location.href = "../index.html";
        });
    }

    // 4. Navegación centralizada (Se quedan igual porque están en la misma carpeta html)
    const mapNavigation = {
        'card-tareas': 'ver_mis_tareas.html',
        'card-control': 'control.html',
        'card-incidente': 'reportar_incidente.html',
        'btn-chat': 'chat.html'
    };

    Object.keys(mapNavigation).forEach(id => {
        const card = document.getElementById(id);
        if (card) {
            card.addEventListener('click', () => {
                window.location.href = mapNavigation[id];
            });
        }
    });
});