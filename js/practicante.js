import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Monitoreo de autenticación
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const emailEl = document.getElementById('user-email');
            if (emailEl) emailEl.textContent = user.email;
        } else {
            window.location.href = "login.html";
        }
    });

    // 2. Cerrar sesión
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            try {
                btnLogout.textContent = "Saliendo...";
                await signOut(auth);
                window.location.href = "login.html";
            } catch (error) {
                console.error("Error al salir:", error);
                btnLogout.textContent = "Salir";
            }
        });
    }

    // 3. Navegación centralizada
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