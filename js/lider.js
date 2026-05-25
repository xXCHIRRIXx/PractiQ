import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

/**
 * Lógica principal del Panel de Líder
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Proteger la ruta del Líder
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const emailElement = document.getElementById('user-email');
            if (emailElement) {
                emailElement.textContent = user.email;
            }
        } else {
            // CORREGIDO: Si no está logueado, va al index de la raíz (tu login)
            window.location.href = "../index.html";
        }
    });

    // 2. Cerrar sesión
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            try {
                btnLogout.textContent = "Saliendo...";
                btnLogout.disabled = true;
                await signOut(auth);
                // CORREGIDO: Al salir, va al index de la raíz
                window.location.href = "../index.html";
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                alert("No se pudo cerrar sesión.");
                btnLogout.textContent = "Salir";
                btnLogout.disabled = false;
            }
        });
    }

    // 3. Botón de Regresar
    const btnRegresar = document.getElementById('btn-regresar');
    if (btnRegresar) {
        btnRegresar.addEventListener('click', () => {
            window.location.href = "../index.html";
        });
    }

    // 4. Navegación centralizada (Páginas internas)
    const navItems = [
        { id: 'card-dashboard', url: 'dashboard.html' },
        { id: 'card-asignar', url: 'asignar_tarea.html' },
        { id: 'card-practicantes', url: 'mis_practicantes.html' },
        { id: 'card-sin-resolver', url: 'gestionar_tareas.html' }, 
        { id: 'card-incidente-lider', url: 'reportar_incidente.html' },
        { id: 'btn-chat-lider', url: 'chat.html' }
    ];

    navItems.forEach(item => {
        const btn = document.getElementById(item.id);
        if (btn) {
            btn.addEventListener('click', () => {
                window.location.href = item.url;
            });
        }
    });

    // 5. Animaciones
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});