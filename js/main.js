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

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function cargarExperiencias() {
    const experiencias = JSON.parse(localStorage.getItem('experiencias') || '[]');
    const container = document.getElementById('experienciasContainer');
    const listaStats = document.getElementById('listaStats');

    if (!container) return;

    if (experiencias.length === 0) {
        container.innerHTML = '<div class="experiencia-vacia">✨ Sé el primero en compartir tu experiencia. Tu historia puede inspirar a otros trabajadores sociales.</div>';
        if (listaStats) listaStats.innerHTML = '0 experiencias';
        return;
    }

    const ultimasExperiencias = [...experiencias].reverse().slice(0, 3);

    container.innerHTML = ultimasExperiencias.map(exp => `
        <div class="experiencia-card" data-id="${exp.id}">
            <div class="experiencia-header">
                <div class="experiencia-usuario">
                    <span class="avatar">${exp.nombre ? exp.nombre.charAt(0).toUpperCase() : 'A'}</span>
                    <strong>${escapeHTML(exp.nombre) || 'Anónimo'}</strong>
                </div>
                <div class="experiencia-fecha">${exp.fecha}</div>
            </div>
            <div class="experiencia-categoria">
                <span class="categoria-badge">${escapeHTML(exp.categoria)}</span>
            </div>
            <div class="experiencia-contenido">${escapeHTML(exp.contenido)}</div>
            <div class="experiencia-footer">
                <button class="btn-like" onclick="darLike(${exp.id})">❤️ ${exp.likes || 0}</button>
            </div>
        </div>
    `).join('');

    if (listaStats) {
        listaStats.innerHTML = `${experiencias.length} experiencia${experiencias.length !== 1 ? 's' : ''} compartidas`;
    }
}

function darLike(id) {
    const experiencias = JSON.parse(localStorage.getItem('experiencias') || '[]');
    const index = experiencias.findIndex(exp => exp.id === id);

    if (index !== -1) {
        experiencias[index].likes = (experiencias[index].likes || 0) + 1;
        localStorage.setItem('experiencias', JSON.stringify(experiencias));
        cargarExperiencias();
    }
}

function agregarExperiencia() {
    const nombre = document.getElementById('nombreUsuario')?.value.trim() || '';
    const categoria = document.getElementById('categoriaExperiencia')?.value || '';
    const contenido = document.getElementById('contenidoExperiencia')?.value.trim() || '';

    if (!categoria) {
        alert('Por favor selecciona una categoría');
        return;
    }

    if (!contenido) {
        alert('Por favor escribe tu experiencia');
        return;
    }

    const experiencias = JSON.parse(localStorage.getItem('experiencias') || '[]');

    const nuevaExperiencia = {
        id: Date.now(),
        nombre: nombre || 'Anónimo',
        categoria: categoria,
        contenido: contenido,
        fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
        likes: 0
    };

    experiencias.push(nuevaExperiencia);
    localStorage.setItem('experiencias', JSON.stringify(experiencias));

    const nombreInput = document.getElementById('nombreUsuario');
    const categoriaSelect = document.getElementById('categoriaExperiencia');
    const contenidoTextarea = document.getElementById('contenidoExperiencia');

    if (nombreInput) nombreInput.value = '';
    if (categoriaSelect) categoriaSelect.value = '';
    if (contenidoTextarea) contenidoTextarea.value = '';

    cargarExperiencias();

    alert('¡Gracias por compartir tu experiencia!');
}

document.addEventListener('DOMContentLoaded', () => {
    cargarExperiencias();
});