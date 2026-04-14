function initCaso(preguntasData) {
    let respuestas = new Array(preguntasData.length).fill(null);
    let currentPregunta = 0;
    let todasRespondidas = false;

    function actualizarProgreso() {
        const respondidas = respuestas.filter(r => r !== null).length;
        const porcentaje = (respondidas / preguntasData.length) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${porcentaje}%`;
        }
        if (!todasRespondidas) {
            const progresoTexto = document.getElementById('progresoTexto');
            if (progresoTexto) {
                progresoTexto.innerHTML = `Pregunta ${currentPregunta + 1} de ${preguntasData.length} · ${respondidas} de ${preguntasData.length} respondidas`;
            }
        }
    }

    function mostrarRevision() {
        let correctas = 0;
        let revisionHtml = '<div class="caso-revision"><h3>📋 Revisión final del caso</h3>';

        preguntasData.forEach((p, idx) => {
            const esCorrecta = respuestas[idx] === p.correcta;
            if (esCorrecta) correctas++;
            const letraUsuario = respuestas[idx] !== null ? String.fromCharCode(65 + respuestas[idx]) : 'No respondida';
            const respuestaUsuarioTexto = respuestas[idx] !== null ? p.opciones[respuestas[idx]] : 'No seleccionaste respuesta';
            const letraCorrecta = String.fromCharCode(65 + p.correcta);

            revisionHtml += `
                <div class="revision-item ${esCorrecta ? 'correcta' : 'incorrecta'}">
                    <div class="revision-pregunta"><strong>Pregunta ${idx + 1}:</strong> ${p.texto}</div>
                    <div class="revision-respuesta">📌 <strong>Tu respuesta:</strong> ${letraUsuario}. ${respuestaUsuarioTexto}</div>
                    <div class="revision-respuesta">✅ <strong>Respuesta correcta:</strong> ${letraCorrecta}. ${p.opciones[p.correcta]}</div>
                    <div class="revision-explicacion">💡 <strong>Explicación:</strong> ${p.explicacion}</div>
                </div>
            `;
        });

        const porcentaje = Math.round(correctas / preguntasData.length * 100);
        let mensajeFinal = '';
        if (correctas === preguntasData.length) {
            mensajeFinal = '🏆 ¡Excelente! Dominas este caso. Tienes un enfoque profesional adecuado.';
        } else if (correctas >= 2) {
            mensajeFinal = '📚 Buen trabajo. Revisa las explicaciones para fortalecer tu intervención.';
        } else {
            mensajeFinal = '📖 Te recomendamos estudiar más sobre este tema. Revisa las explicaciones con atención.';
        }

        revisionHtml += `
            <div class="caso-puntaje">
                🎯 <strong>Puntaje final:</strong> ${correctas} de ${preguntasData.length} (${porcentaje}%)
                <br>${mensajeFinal}
            </div>
        </div>`;

        const revisionContainer = document.getElementById('revisionContainer');
        if (revisionContainer) {
            revisionContainer.innerHTML = revisionHtml;
            revisionContainer.classList.remove('oculto');
        }

        const progresoTexto = document.getElementById('progresoTexto');
        if (progresoTexto) {
            progresoTexto.innerHTML = `✅ Completado - ${correctas} de ${preguntasData.length} correctas (${porcentaje}%)`;
        }

        const btnReiniciar = document.getElementById('btnReiniciar');
        if (btnReiniciar) {
            btnReiniciar.style.display = 'inline-block';
        }
    }

    function reiniciarCaso() {
        respuestas = new Array(preguntasData.length).fill(null);
        currentPregunta = 0;
        todasRespondidas = false;

        const finalizadoDiv = document.getElementById('finalizado');
        if (finalizadoDiv) finalizadoDiv.style.display = 'none';

        const revisionContainer = document.getElementById('revisionContainer');
        if (revisionContainer) revisionContainer.classList.add('oculto');

        const btnReiniciar = document.getElementById('btnReiniciar');
        if (btnReiniciar) btnReiniciar.style.display = 'none';

        renderPregunta(0);
        actualizarProgreso();
    }

    function renderPregunta(index) {
        if (todasRespondidas) return;

        const container = document.getElementById('preguntasContainer');
        if (!container) return;

        const p = preguntasData[index];
        const yaRespondida = respuestas[index] !== null;

        container.innerHTML = `
            <div class="pregunta-card">
                <div class="pregunta-header">
                    <div class="pregunta-icono">${p.icono}</div>
                    <div class="pregunta-texto">
                        <div class="numero">PREGUNTA ${index + 1}</div>
                        <h3>${p.texto}</h3>
                    </div>
                </div>
                <div class="opciones" id="opciones-${index}">
                    ${p.opciones.map((op, i) => `
                        <div class="opcion ${respuestas[index] === i ? 'selected' : ''} ${yaRespondida ? 'disabled' : ''}" data-opcion="${i}">
                            <div class="opcion-letra">${String.fromCharCode(65 + i)}</div>
                            <div>${op}</div>
                        </div>
                    `).join('')}
                </div>
                <div id="feedback-${index}" class="feedback ${yaRespondida ? (respuestas[index] === p.correcta ? 'correcto' : 'incorrecto') : ''}">
                    ${yaRespondida ? `
                        <div class="feedback-icono">${respuestas[index] === p.correcta ? '✅' : '⚠️'}</div>
                        <div>${respuestas[index] === p.correcta ?
                    `<strong>Correcto.</strong> ${p.explicacion}` :
                    `<strong>Incorrecto.</strong> La opción correcta era ${String.fromCharCode(65 + p.correcta)}. ${p.explicacion}`}</div>
                    ` : ''}
                </div>
            </div>
        `;

        if (!yaRespondida) {
            document.querySelectorAll(`#opciones-${index} .opcion`).forEach(el => {
                el.addEventListener('click', () => {
                    if (respuestas[index] !== null) return;

                    const opcion = parseInt(el.dataset.opcion);
                    respuestas[index] = opcion;
                    const feedbackDiv = document.getElementById(`feedback-${index}`);

                    if (opcion === p.correcta) {
                        feedbackDiv.className = 'feedback correcto';
                        feedbackDiv.innerHTML = `<div class="feedback-icono">✅</div><div><strong>Correcto.</strong> ${p.explicacion}</div>`;
                    } else {
                        feedbackDiv.className = 'feedback incorrecto';
                        const letraCorrecta = String.fromCharCode(65 + p.correcta);
                        feedbackDiv.innerHTML = `<div class="feedback-icono">⚠️</div><div><strong>Incorrecto.</strong> La opción correcta era ${letraCorrecta}. ${p.explicacion}</div>`;
                    }

                    document.querySelectorAll(`#opciones-${index} .opcion`).forEach(opt => {
                        opt.classList.add('disabled');
                    });

                    actualizarProgreso();

                    if (currentPregunta < preguntasData.length - 1) {
                        setTimeout(() => {
                            currentPregunta++;
                            renderPregunta(currentPregunta);
                            actualizarProgreso();
                        }, 1800);
                    } else {
                        todasRespondidas = true;
                        const finalizadoDiv = document.getElementById('finalizado');
                        if (finalizadoDiv) finalizadoDiv.style.display = 'block';
                        actualizarProgreso();
                        mostrarRevision();
                    }
                });
            });
        }
    }

    renderPregunta(0);
    actualizarProgreso();

    const btnReiniciar = document.getElementById('btnReiniciar');
    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', reiniciarCaso);
    }
}