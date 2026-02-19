<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";

const sesionIniciada = ref(localStorage.getItem('sesion') !== null);
const fecha = ref('');
const localidad = ref('');
const listaRutas = ref([]);
const emit = defineEmits(["sesionIniciada"]);

async function buscarRuta(fecha, localidad) {
    if(fecha === '' && localidad === ''){
        fetch(apiURL + 'rutas', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            listaRutas.value = data;
            console.log('Rutas:', data)

        })
        .catch(error => console.error('Error:', error));
    }

    fetch(apiURL + `rutas?fecha=${fecha}&localidad=${localidad}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        listaRutas.value = data;
        console.log('Rutas filtradas:', data)
    })
    .catch(error => console.error('Error:', error)); 
}

function formatearFecha(fechaSql) {
    if (!fechaSql) return '';
    // Convierte 2026-02-17 en 17/02/2026
    const partes = fechaSql.split('-');
    if(partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return fechaSql;
}
</script>
<template>
    <form @submit.prevent="buscarRuta(fecha, localidad)" class="d-flex" role="search">
        <input v-model="fecha" class="form-control me-6" type="date" placeholder="Fecha" aria-label="Search">
        <input v-model="localidad" class="form-control me-6" type="text" placeholder="Localidad" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Buscar</button>
    </form>

    <div class="container py-5">
        
        <h2 class="mb-4 text-center">Rutas Disponibles</h2>

        <div class="row g-4">
            
            <div class="col-12 col-md-6 col-lg-4" v-for="ruta in listaRutas" :key="ruta.id || ruta.key">
                
                <div class="card h-100 shadow-sm border-0">
                    
                    <img 
                        :src="ruta.foto ? ruta.foto : 'https://www.elmesondespeñaperros.es/wp-content/uploads/catedral-ja-e1423836657491.jpg'" 
                        class="card-img-top" 
                        alt="Imagen de la ruta"
                        style="height: 200px; object-fit: cover;" 
                    >
                    <div class="card-body">
                        <h5 class="card-title text-primary fw-bold">{{ ruta.titulo }}</h5>
                        <h6 class="card-subtitle mb-3 text-muted">
                            <i class="bi bi-geo-alt-fill text-danger"></i> {{ ruta.localidad }}
                        </h6>
                        
                        <p class="card-text text-secondary">
                            {{ ruta.descripcion }}
                        </p>
                    </div>

                    <div class="card-footer bg-white border-top-0 pt-0">
                        <hr class="mt-0 mb-2">
                        <div class="d-flex justify-content-between align-items-center text-muted small">
                            <span>
                                <i class="bi bi-calendar-event me-1"></i> {{ formatearFecha(ruta.fecha) }}
                            </span>
                            <span>
                                <i class="bi bi-clock me-1"></i> {{ ruta.hora }}
                            </span>
                        </div>
                        <RouterLink 
                            :to="{ name: 'detalleRuta', params: { id: ruta.id } }" 
                            class="btn btn-outline-primary w-100 mt-3"
                        >
                            Ver Detalles
                        </RouterLink>
                    </div>

                </div>
            </div>

        </div>

        <div v-if="listaRutas.length === 0" class="text-center text-muted mt-5">
            <i class="bi bi-search display-1"></i>
            <p class="mt-3">No hemos encontrado ninguna ruta.</p>
        </div>

    </div>
</template>