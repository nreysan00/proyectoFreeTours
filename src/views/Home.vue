<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";
//Esta página incluirá una barra de búsqueda

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
    <div class="container py-4">
        
        <div class="card shadow border-0 mb-5 bg-light">
            <div class="card-body p-4 p-md-5">
                <h2 class="text-center mb-4 text-primary fw-bold">Encuentra tu próxima aventura</h2>
                
                <form @submit.prevent="buscarRuta(fecha, localidad)" class="row g-3 justify-content-center">
                    <div class="col-12 col-md-4">
                        <div class="form-floating">
                            <input v-model="localidad" id="inputLocalidad" class="form-control" type="text" placeholder="Ej. Jaén">
                            <label for="inputLocalidad"><i class="bi bi-geo-alt text-danger"></i> ¿A dónde quieres ir?</label>
                        </div>
                    </div>
                    
                    <div class="col-12 col-md-4">
                        <div class="form-floating">
                            <input v-model="fecha" id="inputFecha" class="form-control" type="date" placeholder="Fecha">
                            <label for="inputFecha"><i class="bi bi-calendar text-primary"></i> ¿Cuándo?</label>
                        </div>
                    </div>
                    
                    <div class="col-12 col-md-2 d-flex">
                        <button class="btn btn-primary w-100 fw-bold fs-5 shadow-sm" type="submit">
                            <i class="bi bi-search"></i> Buscar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="listaRutas.length === 0">
            
            <div class="row mb-5 justify-content-center">
                <div class="col-12 col-lg-10">
                    <h3 class="text-center mb-4">Descubre la experiencia FreeTour</h3>
                    <div class="ratio ratio-16x9 shadow-lg rounded overflow-hidden border">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/2NLlFpKgwcw?si=XpP2JWuYByayeaOC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </div>
                </div>
            </div>

            <div class="row mb-5 justify-content-center">
                <div class="col-12 col-lg-8">
                    <h3 class="text-center mb-4 border-bottom pb-2">Preguntas Frecuentes</h3>
                    
                    <div class="accordion shadow-sm" id="accordionFAQ">
                        
                        <div class="accordion-item border-0 border-bottom">
                            <h2 class="accordion-header" id="headingOne">
                                <button class="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <i class="bi bi-question-circle text-primary me-2"></i> ¿Qué es un Free Tour?
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionFAQ">
                                <div class="accordion-body text-secondary">
                                    Un Free Tour es una visita guiada donde <strong>tú decides el precio</strong>. Al finalizar el recorrido, valoras el trabajo del guía y le entregas la cantidad que consideres justa en función de tu satisfacción y presupuesto.
                                </div>
                            </div>
                        </div>

                        <div class="accordion-item border-0 border-bottom">
                            <h2 class="accordion-header" id="headingTwo">
                                <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    <i class="bi bi-calendar-check text-primary me-2"></i> ¿Necesito reservar con antelación?
                                </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionFAQ">
                                <div class="accordion-body text-secondary">
                                    <strong>Sí, es muy recomendable.</strong> Los grupos tienen un límite de plazas para garantizar la calidad del tour. Al reservar tu plaza (que es totalmente gratis) te aseguras de no quedarte fuera el día de la visita.
                                </div>
                            </div>
                        </div>

                        <div class="accordion-item border-0">
                            <h2 class="accordion-header" id="headingThree">
                                <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    <i class="bi bi-geo-alt text-primary me-2"></i> ¿Cómo encuentro al guía?
                                </button>
                            </h2>
                            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionFAQ">
                                <div class="accordion-body text-secondary">
                                    Al hacer click en los detalles de la ruta podrás ver el punto exacto de encuentro en el mapa. Además, nuestros guías siempre llevan un <strong>paraguas o acreditación de color azul</strong> para que puedas reconocerlos fácilmente.
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>

        <div v-else>
            
            <h3 class="mb-4 border-bottom pb-2">Resultados de tu búsqueda</h3>

            <div class="row g-4">
                <div class="col-12 col-md-6 col-lg-4" v-for="ruta in listaRutas" :key="ruta.id || ruta.key">
                    <div class="card h-100 shadow-sm border-0 transition-hover">
                        
                        <img 
                            :src="ruta.foto ? ruta.foto : 'https://www.elmesondespeñaperros.es/wp-content/uploads/catedral-ja-e1423836657491.jpg'" 
                            class="card-img-top" 
                            alt="Imagen de la ruta"
                            style="height: 220px; object-fit: cover;" 
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
                            <hr class="mt-0 mb-3">
                            <div class="d-flex justify-content-between align-items-center text-muted small mb-3">
                                <span><i class="bi bi-calendar-event text-primary me-1"></i> {{ formatearFecha(ruta.fecha) }}</span>
                                <span><i class="bi bi-clock text-primary me-1"></i> {{ ruta.hora }}</span>
                            </div>
                            <RouterLink 
                                :to="{ name: 'detalleRuta', params: { id: ruta.id } }" 
                                class="btn btn-outline-primary w-100 fw-bold"
                            >
                                Ver Detalles
                            </RouterLink>
                        </div>

                    </div>
                </div>
            </div>

            <div class="text-center mt-5">
                <button class="btn btn-secondary" @click="listaRutas = []; fecha = ''; localidad = ''">
                    <i class="bi bi-arrow-left-circle"></i> Volver al inicio
                </button>
            </div>

        </div>

    </div>
</template>