// Modal de pago
let planSeleccionado = null;

const planesInfo = {
    individual: {
        nombre: "Plan Individual",
        precio: 5000,
        precioFormateado: "$5.000 COP",
        moneda: "COP"
    },
    universidad: {
        nombre: "Plan Universidad",
        precio: 7000,
        precioFormateado: "$7.000 COP por usuario",
        moneda: "COP"
    },
    premium: {
        nombre: "Plan Premium + Asesoría",
        precio: 15000,
        precioFormateado: "$15.000 COP por taller",
        moneda: "COP"
    }
};

// Datos de cuentas bancarias para Colombia
const cuentasColombia = {
    bancolombia: {
        nombre: "Bancolombia",
        tipo: "Cuenta de Ahorros",
        numero: "123-456789-01",
        titular: "SimuIntervención 360° SAS",
        cedulaNit: "901.234.567-8",
        email: "pagos@simuintervencion.com",
        instrucciones: "Transferencia desde cualquier banco aliado a Bancolombia o usa PSE"
    },
    nequi: {
        nombre: "Nequi",
        tipo: "Billetera Digital",
        numero: "3123456789",
        titular: "SimuIntervención 360°",
        cedulaNit: "901.234.567-8",
        email: "pagos@simuintervencion.com",
        instrucciones: "Abre la app de Nequi → Transferir → Ingresa el número 3123456789"
    },
    daviplata: {
        nombre: "Daviplata",
        tipo: "Billetera Digital",
        numero: "3219876543",
        titular: "SimuIntervención 360°",
        cedulaNit: "901.234.567-8",
        email: "pagos@simuintervencion.com",
        instrucciones: "Abre la app de Daviplata → Enviar dinero → Ingresa el número 3219876543"
    }
};

function abrirModalPago(plan) {
    planSeleccionado = plan;
    const info = planesInfo[plan];
    if (!info) return;

    const modal = document.getElementById('modalPago');
    const modalTitulo = document.getElementById('modalTitulo');
    const planNombreSpan = document.getElementById('planNombre');
    const precioSpan = document.getElementById('precioMostrar');

    modalTitulo.innerHTML = info.nombre === "Plan Universidad" ? "🏛️" : (info.nombre === "Plan Premium + Asesoría" ? "🎓" : "👤");
    modalTitulo.innerHTML += ` ${info.nombre}`;
    planNombreSpan.textContent = info.nombre;
    precioSpan.textContent = info.precioFormateado;

    // Limpiar formulario
    document.getElementById('nombreCompleto').value = '';
    document.getElementById('cedulaCliente').value = '';
    document.getElementById('emailCliente').value = '';
    document.getElementById('telefonoCliente').value = '';
    document.getElementById('metodoPago').value = '';
    
    // Limpiar y ocultar datos de cuenta (vacío al inicio)
    limpiarDatosCuenta();

    modal.classList.add('visible');
}

function limpiarDatosCuenta() {
    const cuentaInfo = document.getElementById('cuentaInfo');
    cuentaInfo.innerHTML = `
        <div class="cuenta-vacia">
            <p>🔘 Selecciona un método de pago para ver los datos de la cuenta</p>
        </div>
    `;
}

function actualizarDatosCuenta() {
    const metodo = document.getElementById('metodoPago').value;
    const cuentaInfo = document.getElementById('cuentaInfo');
    
    // Si no hay método seleccionado, mostrar vacío
    if (!metodo) {
        limpiarDatosCuenta();
        return;
    }
    
    const cuenta = cuentasColombia[metodo];
    if (!cuenta) return;
    
    let icono = "";
    switch(metodo) {
        case 'bancolombia':
            icono = "🏦";
            break;
        case 'nequi':
            icono = "💚";
            break;
        case 'daviplata':
            icono = "💜";
            break;
        default:
            icono = "💰";
    }
    
    cuentaInfo.innerHTML = `
        <div class="cuenta-bancaria">
            <p><strong>${icono} Entidad:</strong> ${cuenta.nombre}</p>
            <p><strong>📋 Tipo:</strong> ${cuenta.tipo}</p>
            <p><strong>🔢 Número de cuenta:</strong> ${cuenta.numero}</p>
            <p><strong>👤 Titular:</strong> ${cuenta.titular}</p>
            <p><strong>📌 NIT/Cédula:</strong> ${cuenta.cedulaNit}</p>
            <p><strong>✉️ Correo:</strong> ${cuenta.email}</p>
            <p><strong>ℹ️ Instrucciones:</strong> ${cuenta.instrucciones}</p>
        </div>
    `;
}

function cerrarModalPago() {
    const modal = document.getElementById('modalPago');
    modal.classList.remove('visible');
    planSeleccionado = null;
}

function formatearNumeroTelefono(telefono) {
    let limpio = telefono.replace(/\D/g, '');
    if (limpio.length === 10) {
        return `${limpio.substring(0, 3)} ${limpio.substring(3, 6)} ${limpio.substring(6, 10)}`;
    }
    return telefono;
}

function formatearCedula(cedula) {
    let limpio = cedula.replace(/\D/g, '');
    if (limpio.length >= 10) {
        return `${limpio.substring(0, 3)}.${limpio.substring(3, 6)}.${limpio.substring(6, 10)}`;
    } else if (limpio.length >= 8) {
        return `${limpio.substring(0, 2)}.${limpio.substring(2, 5)}.${limpio.substring(5, 9)}`;
    }
    return cedula;
}

function procesarPago() {
    const nombre = document.getElementById('nombreCompleto').value.trim();
    const cedula = document.getElementById('cedulaCliente').value.trim();
    const email = document.getElementById('emailCliente').value.trim();
    const telefono = document.getElementById('telefonoCliente').value.trim();
    const metodo = document.getElementById('metodoPago').value;

    if (!nombre) {
        alert('❌ Por favor ingresa tu nombre completo.');
        return;
    }
    if (!cedula) {
        alert('❌ Por favor ingresa tu cédula o NIT.');
        return;
    }
    if (!email) {
        alert('❌ Por favor ingresa tu correo electrónico.');
        return;
    }
    if (!telefono) {
        alert('❌ Por favor ingresa tu número de teléfono.');
        return;
    }
    if (!metodo) {
        alert('❌ Por favor selecciona un método de pago.');
        return;
    }

    const info = planesInfo[planSeleccionado];
    const cuenta = cuentasColombia[metodo];
    if (!info || !cuenta) return;

    const metodoTexto = metodo === 'bancolombia' ? 'Transferencia Bancolombia' : 
                        (metodo === 'nequi' ? 'Nequi' : 'Daviplata');
    
    const telefonoFormateado = formatearNumeroTelefono(telefono);
    const cedulaFormateada = formatearCedula(cedula);

    let mensaje = `✅ ¡Solicitud de pago registrada!\n\n` +
        `📋 Plan: ${info.nombre}\n` +
        `💰 Monto: ${info.precioFormateado}\n` +
        `👤 Nombre: ${nombre}\n` +
        `📌 Cédula/NIT: ${cedulaFormateada}\n` +
        `✉️ Email: ${email}\n` +
        `📱 Teléfono: ${telefonoFormateado}\n` +
        `💳 Método: ${metodoTexto}\n\n` +
        `📌 DATOS PARA EL PAGO:\n` +
        `🏦 Entidad: ${cuenta.nombre}\n` +
        `🔢 Número: ${cuenta.numero}\n` +
        `👤 Titular: ${cuenta.titular}\n` +
        `📌 NIT: ${cuenta.cedulaNit}\n\n` +
        `📋 Instrucciones: ${cuenta.instrucciones}\n\n` +
        `📧 Te enviaremos un comprobante a ${email} dentro de 24 horas hábiles.\n` +
        `¡Gracias por confiar en SimuIntervención 360°!`;

    alert(mensaje);
    cerrarModalPago();

    // Guardar en localStorage
    const pagosRegistrados = JSON.parse(localStorage.getItem('pagosSimu') || '[]');
    pagosRegistrados.push({
        plan: info.nombre,
        precio: info.precio,
        moneda: "COP",
        nombre: nombre,
        cedula: cedulaFormateada,
        email: email,
        telefono: telefonoFormateado,
        metodo: metodoTexto,
        cuentaDestino: cuenta.numero,
        fecha: new Date().toISOString()
    });
    localStorage.setItem('pagosSimu', JSON.stringify(pagosRegistrados));
}

// Cerrar modal al hacer clic fuera del contenido
document.addEventListener('click', function(event) {
    const modal = document.getElementById('modalPago');
    const contenido = modal?.querySelector('.modal-contenido');
    if (event.target === modal) {
        cerrarModalPago();
    }
});

// Cerrar con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModalPago();
    }
});