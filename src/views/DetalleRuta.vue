<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { apiURL } from "@/main";
import router from "@/router";

const route = useRoute();
const ruta = ref(null);
const cargando = ref(true);

const sesionIniciada = ref(localStorage.getItem('sesion') !== null);
const usuarioSesion = ref(sesionIniciada.value ? JSON.parse(localStorage.getItem('sesion')) : null);
const mostrarModal = ref(false);
const numPlazas = ref(1);
const errorReserva = ref('');
const yaReservado = ref(false);

onMounted(() => {
    const idRuta = route.params.id;
    comprobarSiYaReservo();
    fetch(apiURL + 'rutas?id=' + idRuta)
        .then(response => response.json())
        .then(data => {
            console.log('Ruta cargada:', data);
            ruta.value = data;
            cargando.value = false;
        })
        .catch(error => {
            console.error('Error al cargar la ruta:', error);
            cargando.value = false;
        });
});

// Comprobar si el usuario ya ha reservado esta ruta para mostrar un mensaje o deshabilitar el botón de reserva
function comprobarSiYaReservo() {
    if (!usuarioSesion.value) return; 

    yaReservado.value = false;
    const emailUsuario = usuarioSesion.value.email;
  
    const idRutaActual = route.params.id; 

    fetch(`${apiURL}reservas?email=${emailUsuario}`)
    .then(response => response.json())
    .then(data => {
        console.log('Reservas del usuario:', data);
        if (Array.isArray(data) && data.length > 0) {            
            const existeReserva = data.some(reserva => 
                String(reserva.ruta_id) === String(idRutaActual)
            );
            
            if (existeReserva) {
                yaReservado.value = true;
            }
        }
    })
    .catch(error => console.error('Error comprobando reservas:', error));
}

function abrirModal() {
    mostrarModal.value = true;
    errorReserva.value = '';
    numPlazas.value = 1;
}

function cerrarModal() {
    mostrarModal.value = false;
}

function confirmarReserva() {
    if (numPlazas.value < 1 || numPlazas.value > 8) {
        errorReserva.value = "Debes reservar al menos 1 plaza y como máximo 8.";
        return;
    }

    const reservaData = {
        email: usuarioSesion.value.email,
        ruta_id: route.params.id,
        num_personas: numPlazas.value
    };

    fetch(apiURL + 'reservas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservaData)
    })
    .then(response => response.json())
    .then(data => console.log('Respuesta:', data))
    .catch(error => console.error('Error:', error));
    console.log(`Reservando ${numPlazas.value} plazas para la ruta ${ruta.value.id}`);
    
    alert("¡Reserva confirmada con éxito!");
    cerrarModal();
}

</script>

<template>
    <div class="container py-5">
        
        <div class="text-end mt-5">
            <button class="btn btn-secondary" @click="router.push({ name: 'home' })" aria-label="Volver al inicio">
                <i class="bi bi-arrow-left-circle"></i> Volver al inicio
            </button>
        </div>
        
        <div v-if="cargando" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Cargando detalles de la ruta...</p>
        </div>

        <div v-else-if="ruta" class="row mt-4">
            
            <div class="col-md-6 mb-4">
                <img 
                    :src="ruta.foto || 'https://via.placeholder.com/800x600?text=Sin+Imagen'" 
                    class="img-fluid rounded shadow" 
                    alt="Foto de la ruta"
                    style="width: 100%; max-height: 450px; object-fit: cover;"
                >
            </div>

            <div class="col-md-6 d-flex flex-column">
                <h1 class="fw-bold text-primary">{{ ruta.titulo }}</h1>
                <h4 class="text-muted mb-4">
                    <i class="bi bi-geo-alt-fill text-danger"></i> {{ ruta.localidad }}
                </h4>

                <p class="fs-5 flex-grow-1">{{ ruta.descripcion }}</p>

                <ul class="list-group list-group-flush mb-4 mt-2 border-top border-bottom">
                    <li class="list-group-item bg-transparent px-0 py-3">
                        <i class="bi bi-calendar-event me-2 text-primary"></i> 
                        <strong>Fecha:</strong> {{ ruta.fecha }}
                    </li>
                    <li class="list-group-item bg-transparent px-0 py-3">
                        <i class="bi bi-clock me-2 text-primary"></i> 
                        <strong>Hora:</strong> {{ ruta.hora }}
                    </li>
                    <li class="list-group-item bg-transparent px-0 py-3">
                        <i class="bi bi-people-fill me-2 text-primary"></i> 
                        <strong>Plazas ya reservadas:</strong> {{ ruta.asistentes }}
                    </li>
                </ul>

                <button 
                    v-if="sesionIniciada" 
                    @click="abrirModal" 
                    class="btn btn-lg w-100 shadow text-white fw-bold transition-all"
                    :class="yaReservado ? 'btn-secondary' : 'btn-success'"
                    :disabled="yaReservado"
                >
                    <i v-if="yaReservado" class="bi bi-check-circle-fill me-2"></i>
                    <i v-else class="bi bi-calendar-plus me-2"></i>
                    {{ yaReservado ? 'Ya tienes plaza reservada' : 'Reservar Plaza' }}
                </button>

                <button
                    v-else-if="ruta.asistentes.length == 8"
                    class="btn btn-danger btn-lg w-100 shadow text-white fw-bold"
                >
                    <i class="bi bi-exclamation-triangle me-2"></i> Ruta completa
                </button>

                <button 
                    v-else 
                    @click="router.push({ name: 'login' })" 
                    class="btn btn-warning btn-lg w-100 shadow text-dark fw-bold"
                >
                    <i class="bi bi-box-arrow-in-right me-2"></i> Loguéate para reservar
                </button>
            </div>

            <div class="col-12 mt-5">
                <h3 class="mb-4 border-bottom pb-2 text-primary"><i class="bi bi-map"></i> Punto de Encuentro</h3>
                <div class="alert alert-secondary p-1 rounded shadow-sm">
                    <iframe 
                        width="100%" 
                        height="400px" 
                        frameborder="0" 
                        style="border:0; border-radius: 5px;" 
                        :src="`https://maps.google.com/maps?q=${ruta.latitud},${ruta.longitud}&z=16&output=embed`" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>

        </div>

        <div v-else class="text-center py-5 mt-5">
            <h1 class="text-danger display-1"><i class="bi bi-exclamation-triangle-fill"></i></h1>
            <h2 class="mt-3">Ruta no encontrada</h2>
            <p class="text-muted fs-5">La ruta que buscas no existe o ha sido eliminada.</p>
            <RouterLink to="/" class="btn btn-primary mt-3 px-4">Volver al inicio</RouterLink>
        </div>

        <div v-if="mostrarModal" class="modal-backdrop fade show" style="opacity: 0.5;"></div>

        <div v-if="mostrarModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow-lg border-0 rounded-4">
                    
                    <div class="modal-header bg-light border-bottom-0 pb-0">
                        <h5 class="modal-title fw-bold text-primary">Confirmar Reserva</h5>
                        <button type="button" class="btn-close" @click="cerrarModal" aria-label="Cerrar"></button>
                    </div>
                    
                    <div class="modal-body p-4 pt-3">
                        <p class="text-muted mb-4">Estás a punto de reservar plazas para: <br><strong class="fs-5 text-dark">{{ ruta.titulo }}</strong></p>
                        
                        <div class="mb-3 bg-light p-3 rounded border">
                            <label for="plazas" class="form-label fw-bold text-secondary">¿Cuántas personas vais a ser?</label>
                            <input 
                                type="number" 
                                id="plazas" 
                                v-model="numPlazas" 
                                class="form-control form-control-lg text-center fw-bold text-primary" 
                                min="1" 
                                max="8"
                            >
                            <div class="form-text mt-2 text-center">Puedes reservar un máximo de 8 plazas a la vez.</div>
                        </div>

                        <div v-if="errorReserva" class="alert alert-danger mt-3 py-2 text-center shadow-sm">
                            <i class="bi bi-exclamation-circle-fill me-1"></i> {{ errorReserva }}
                        </div>
                    </div>
                    
                    <div class="modal-footer bg-light border-top-0 pt-0 justify-content-center pb-4">
                        <button type="button" class="btn btn-outline-secondary px-4 rounded-pill" @click="cerrarModal">Cancelar</button>
                        <button type="button" class="btn btn-success px-4 rounded-pill shadow-sm" @click="confirmarReserva(numPlazas)">
                            Confirmar Reserva
                        </button>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>
