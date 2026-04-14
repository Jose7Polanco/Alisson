const reveals = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
reveals.forEach(el => io.observe(el));

function selectChoice(btn, correct) {
    document.querySelectorAll('.choice').forEach(b => {
        b.classList.remove('selected');
        b.disabled = true;
    });
    btn.classList.add('selected');
    const fb = document.getElementById('feedback');
    if (correct) {
        fb.style.display = 'block';
        fb.innerHTML = '<p>✅ <strong>Buena elección.</strong> Crear un espacio privado con la usuaria permite una comunicación más honesta y reduce el riesgo de represalia. Esto se alinea con el principio de no revictimización.</p>';
        fb.style.background = 'rgba(45,106,79,0.25)';
        fb.style.borderColor = 'var(--accent2)';
    } else {
        fb.innerHTML = '<p>⚠️ <strong>Reflexiona.</strong> Esta acción podría comprometer la seguridad de la usuaria o generar una segunda victimización. Intenta de nuevo con una nueva sesión.</p>';
        fb.style.background = 'rgba(200,75,47,0.2)';
        fb.style.borderColor = 'var(--accent)';
        fb.style.display = 'block';
    }
    setTimeout(() => {
        document.querySelectorAll('.choice').forEach(b => b.disabled = false);
    }, 2500);
}