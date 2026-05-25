import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const btnSubmit = loginForm.querySelector('.btn');

    // 1. LÓGICA DE LOGIN Y REDIRECCIÓN
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const correo = document.getElementById('correo').value;
        const password = document.getElementById('password').value;
        const originalText = btnSubmit.textContent;

        btnSubmit.textContent = 'Verificando rol...';
        btnSubmit.style.opacity = '0.8';

        signInWithEmailAndPassword(auth, correo, password)
            .then((userCredential) => {
                return getDoc(doc(db, "usuarios", userCredential.user.uid));
            })
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    btnSubmit.textContent = '¡Ingreso Exitoso!';
                    btnSubmit.style.background = '#10B981';
                    
                    setTimeout(() => {
                        // Redirección dinámica según rol
                        if (userData.rol === 'admin') {
                            window.location.href = "/html/admin.html";
                        } else if (userData.rol === 'lider') {
                            window.location.href = "/html/lider.html";
                        } else {
                            window.location.href = "/html/practicante.html";
                        }
                    }, 1000);
                } else {
                    throw new Error("Perfil no encontrado en la base de datos.");
                }
            })
            .catch((error) => {
                console.error("Error de autenticación:", error);
                btnSubmit.style.background = '#EF4444';
                btnSubmit.textContent = 'Error de acceso';
                alert('Error: ' + error.message);
                setTimeout(() => {
                    btnSubmit.textContent = originalText;
                    btnSubmit.style.background = '';
                    btnSubmit.style.opacity = '1';
                }, 2500);
            });
    });

    // 2. "EASTER EGG": COMBINACIÓN DE TECLAS PARA REGISTRO ADMIN
    // Escucha Ctrl + Shift + A
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            const adminModal = document.getElementById('admin-secret-register');
            if (adminModal) adminModal.style.display = 'block';
        }
    });

    // Manejador del formulario secreto de registro Admin
    const adminForm = document.getElementById('admin-register-form');
    if (adminForm) {
        adminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('admin-nombre').value;
            const correo = document.getElementById('admin-correo').value;
            const password = document.getElementById('admin-password').value;

            try {
                const cred = await createUserWithEmailAndPassword(auth, correo, password);
                await setDoc(doc(db, "usuarios", cred.user.uid), {
                    nombre: nombre,
                    correo: correo,
                    rol: 'admin',
                    fechaRegistro: new Date().toISOString()
                });
                alert("Administrador creado correctamente.");
                window.location.reload();
            } catch (error) {
                alert("Error al registrar admin: " + error.message);
            }
        });
    }
});