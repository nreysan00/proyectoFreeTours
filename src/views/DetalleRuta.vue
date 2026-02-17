<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"; // <-- Importante: useRoute lee la URL actual
import { apiURL } from "@/main";
import router from "@/router";

const route = useRoute(); // Instanciamos la ruta actual
const ruta = ref(null);   // Aquí guardaremos los datos de la ruta
const cargando = ref(true);

const sesionIniciada = ref(localStorage.getItem('sesion') !== null);
const mostrarModal = ref(false);
const numPlazas = ref(1); // Por defecto reserva 1 plaza
const errorReserva = ref('');

onMounted(() => {
    // 1. Capturamos el ID de la URL (ej: si la URL es /ruta/5, esto vale 5)
    const idRuta = route.params.id;

    // 2. Llamamos a tu API de PHP pasándole ese ID
    fetch(apiURL + 'rutas?id=' + idRuta)
        .then(response => response.json())
        .then(data => {
            ruta.value = data;
            cargando.value = false;
        })
        .catch(error => {
            console.error('Error al cargar la ruta:', error);
            cargando.value = false;
        });
});

function abrirModal() {
    mostrarModal.value = true;
    errorReserva.value = '';
    numPlazas.value = 1; // Reseteamos el contador cada vez que abre
}

function cerrarModal() {
    mostrarModal.value = false;
}

function confirmarReserva() {
    if (numPlazas.value < 1) {
        errorReserva.value = "Debes reservar al menos 1 plaza.";
        return;
    }

    // Aquí irá tu fetch (POST) a la API para guardar la reserva en base de datos.
    // Necesitarás enviar: ruta.value.id, numPlazas.value, y el ID del usuario logueado.
    const reservaData = {
        email: route.params.email, // Email del cliente
        ruta_id: ruta.value.id,                   // ID de la ruta
        num_personas: numPlazas.value              // Número de personas para la reserva
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

async function reservarTour(params) {
    

    
    }
</script>

<template>
    <div class="container py-5">
        
        <div v-if="cargando" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Cargando detalles de la ruta...</p>
        </div>

        <div v-else-if="ruta" class="row">
            
            <div class="col-md-6 mb-4">
                <img 
                    :src="ruta.foto || 'https://via.placeholder.com/800x600?text=Sin+Imagen'" 
                    class="img-fluid rounded shadow" 
                    alt="Foto de la ruta"
                    style="width: 100%; max-height: 400px; object-fit: cover;"
                >
            </div>

            <div class="col-md-6">
                <h1 class="fw-bold text-primary">{{ ruta.titulo }}</h1>
                <h4 class="text-muted mb-4">
                    <i class="bi bi-geo-alt-fill text-danger"></i> {{ ruta.localidad }}
                </h4>

                <p class="fs-5">{{ ruta.descripcion }}</p>

                <ul class="list-group list-group-flush mb-4 mt-4">
                    <li class="list-group-item bg-transparent">
                        <i class="bi bi-calendar-event me-2 text-primary"></i> 
                        <strong>Fecha:</strong> {{ ruta.fecha }}
                    </li>
                    <li class="list-group-item bg-transparent">
                        <i class="bi bi-clock me-2 text-primary"></i> 
                        <strong>Hora:</strong> {{ ruta.hora }}
                    </li>
                    <li class="list-group-item bg-transparent">
                        <i class="bi bi-people-fill me-2 text-primary"></i> 
                        <strong>Plazas Reservadas:</strong> {{ ruta.asistentes }}
                    </li>
                </ul>

                <button v-if="sesionIniciada" class="btn btn-success btn-lg w-100 shadow">
                    <i class="bi bi-check-circle"></i> Reservar Plaza
                </button>
                <button v-else @click="router.push({name:'login'})" class="btn btn-outline-warning btn-lg w-100 shadow">
                    <i class="bi bi-exclamation-triangle-fill"></i> Inicia sesión para reservar
                </button>
            </div>

            <div class="col-12 mt-5">
                <h3 class="mb-3">Punto de Encuentro</h3>
                <div class="alert alert-info">
                    Latitud: {{ ruta.latitud }} | Longitud: {{ ruta.longitud }}
                    </div>
            </div>

        </div>

        <div v-else class="text-center text-danger py-5">
            <h2>Error 404</h2>
            <p>La ruta que buscas no existe o ha sido eliminada.</p>
            <RouterLink to="/" class="btn btn-primary mt-3">Volver al inicio</RouterLink>
        </div>

    </div>
</template>