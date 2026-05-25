document.addEventListener('DOMContentLoaded', () => {
    const btnVolver = document.getElementById('btn-volver');
    
    if(btnVolver) {
        btnVolver.addEventListener('click', () => {
            btnVolver.style.opacity = '0.5';
            btnVolver.textContent = 'Volviendo...';
            
            setTimeout(() => {
                window.history.back();
            }, 300);
        });
    }
});