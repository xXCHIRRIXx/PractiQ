import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const radioPracticante = document.getElementById('rol-practicante');
    const radioLider = document.getElementById('rol-lider');
    const dynamicLabel = document.getElementById('dynamic-label');
    const dynamicInput = document.getElementById('dinamico');
    const dynamicWrapper = document.getElementById('dynamic-wrapper');
    const btnSubmit = document.getElementById('btn-submit');
    const form = document.getElementById('register-form');
    const roleSelector = document.querySelector('.role-selector');

    // --- LÓGICA DE MODO ADMINISTRADOR SECRETO ---
    window.addEventListener('keydown', (e) => {
        // Combinación: Ctrl + Shift + A
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            if (document.getElementById('rol-admin')) return; // Ya existe

            const div = document.createElement('div');
            div.innerHTML = `
                <input type="radio" id="rol-admin" name="rol" value="admin">
                <label for="rol-admin" style="color: red; font-weight: bold;">Administrador</label>
            `;
            roleSelector.appendChild(div);

            document.getElementById('rol-admin').addEventListener('change', actualizarFormulario);
            alert("Modo Administrador activado");
        }
    });

    // --- LÓGICA DE ACTUALIZACIÓN VISUAL ---
    function actualizarFormulario() {
        const rolSeleccionado = document.querySelector('input[name="rol"]:checked').value;
        
        dynamicWrapper.style.opacity = '0';
        setTimeout(() => {
            if (rolSeleccionado === 'practicante') {
                dynamicLabel.textContent = 'Enfoque (Área de práctica)';
                dynamicInput.placeholder = 'Ej. Desarrollo, Testing, Diseño UX...';
                btnSubmit.textContent = 'Registrar Practicante';
            } else if (rolSeleccionado === 'lider') {
                dynamicLabel.textContent = 'Cargo del Líder';
                dynamicInput.placeholder = 'Ej. Jefe de QA, Scrum Master, PM...';
                btnSubmit.textContent = 'Registrar Líder';
            } else if (rolSeleccionado === 'admin') {
                dynamicLabel.textContent = 'Código Secreto';
                dynamicInput.placeholder = 'Ingrese clave maestra...';
                btnSubmit.textContent = 'Registrar Administrador';
            }
            dynamicWrapper.style.opacity = '1';
        }, 250);
    }

    radioPracticante.addEventListener('change', actualizarFormulario);
    radioLider.addEventListener('change', actualizarFormulario);

    // --- LÓGICA DE REGISTRO ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const correo = document.getElementById('correo').value;
        const password = document.getElementById('password').value;
        const dinamico = document.getElementById('dinamico').value;
        
        // Obtenemos el rol seleccionado dinámicamente
        const rol = document.querySelector('input[name="rol"]:checked').value;
        
        const textoOriginal = btnSubmit.textContent;
        btnSubmit.textContent = 'Guardando datos...';

        createUserWithEmailAndPassword(auth, correo, password)
            .then((userCredential) => {
                const user = userCredential.user;

                return setDoc(doc(db, "usuarios", user.uid), {
                    nombre: nombre,
                    correo: correo,
                    rol: rol,
                    detalleRol: dinamico,
                    fechaRegistro: new Date().toISOString()
                });
            })
            .then(() => {
                btnSubmit.style.background = '#10B981';
                btnSubmit.textContent = '¡Cuenta Guardada!';
                setTimeout(() => {
                    alert(`Registro completado con rol: ${rol}`);
                    window.location.href = "login.html"; 
                }, 1000);
            })
            .catch((error) => {
                console.error("Error completo:", error);
                alert('Error: ' + error.message);
                btnSubmit.textContent = textoOriginal;
            });
    });
});