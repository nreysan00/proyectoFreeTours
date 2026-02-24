<script setup>
import {ref, onMounted} from "vue"
import router from "@/router";
import {apiURL} from "@/main";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mostrarToast } from "@/toast";

//Comprobar que el usuario es admin
const datosSesion= ref(JSON.parse(localStorage.getItem('sesion')));
if(datosSesion.value == null ||datosSesion.value.rol != 'admin'){
    alert('No puedes entrar aquí');
    router.push({ name: "home" });
}

const emit = defineEmits(["registroUsu"]);
const form = ref({ titulo: '', localidad: '', descripcion: '', foto: '', fecha: '', hora: '', latitud: '', longitud: '', guia_id: ''});
const guias = ref([]);
const error = ref('');

//Variables para el buscador
const busqueda = ref(''); 
const buscando = ref(false); 
const errorBusqueda = ref('');

//Variables e iniciador del mapa al enter en CrearRuta
const mapContainer = ref(null);
let map = null;
let marker = null;

onMounted(() => {
    map = L.map(mapContainer.value).setView([40.4168, -3.7038], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        form.value.latitud = lat.toFixed(6);
        form.value.longitud = lng.toFixed(6);

        if (marker) {
            map.removeLayer(marker);
        }

        marker = L.marker([lat, lng]).addTo(map);
    });
});
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

async function buscarDireccion() {
    if (!busqueda.value) return;
    
    buscando.value = true;
    errorBusqueda.value = '';

    try {
        const email = "1smrnrs2000@gmail.com";
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(busqueda.value)}&limit=1&email=${email}`;
        
        const response = await fetch(url, {
            headers: { 'Accept-Language': 'es' }
        });

        const data = await response.json();

        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            
            actualizarCoordenadas(lat, lng);
            map.setView([lat, lng], 15);
        } else {
            errorBusqueda.value = 'No se encontró la ubicación. Prueba a ser más específico.';
        }
    } catch (error) {
        errorBusqueda.value = 'Error al conectar con el buscador del mapa.';
        console.error('Error geocoding:', error);
    } finally {
        buscando.value = false;
    }
}

function actualizarCoordenadas(lat, lng) {
    form.value.latitud = lat.toFixed(6);
    form.value.longitud = lng.toFixed(6);

    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(map);
}
// Función para procesar la foto seleccionada por el usuario
function procesarFoto(evento) {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
        form.value.foto = e.target.result; 
        console.log("Imagen convertida a texto lista para enviar!");
    };
    
    reader.readAsDataURL(archivo);
}

async function nuevaRuta(){
    const rutaData = {
    titulo: form.value.titulo,
    localidad: form.value.localidad,
    descripcion: form.value.descripcion,
    foto: form.value.foto,
    fecha: form.value.fecha,
    hora: form.value.hora,
    latitud: form.value.latitud,
    longitud: form.value.longitud,
    guia_id: form.value.guia_id
};

fetch(apiURL + 'rutas', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(rutaData)
})
.then(response => response.json())
.then(data => {
    console.log('Respuesta:', data)
    mostrarToast('Ruta creada correctamente', 'success');
    setInterval(() => {
        router.push({ name: "rutas" });
    }, 1500);
    

})
.catch(error => console.error('Error:', error));
}

//Para cargar la lista de guias en el select al crear ruta
function cargarGuias() {
    fetch(apiURL + 'usuarios', { method: 'GET' })
    .then(response => response.json())
    .then(data => {
        guias.value = data.filter(usuario => usuario.rol === 'guia');
    })
    .catch(error => console.error('Error cargando guías:', error));
}

cargarGuias();
</script>
<template>
    <div class="container py-5">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden max-w-800 mx-auto">
            
            <div class="card-header bg-primary text-white text-center py-4">
                <h2 class="mb-0 fw-bold"><i class="bi bi-map-fill me-2"></i>Crear Nueva Ruta</h2>
                <p class="mb-0 text-white-50 mt-1">Completa los datos para publicar tu próximo Free Tour</p>
            </div>

            <div class="card-body p-4 p-md-5 bg-light">
                <form @submit.prevent="nuevaRuta">
                    
                    <div class="row g-4 mb-5">
                        
                        <div class="col-12 col-lg-6">
                            <h5 class="text-primary border-bottom pb-2 mb-4">
                                <i class="bi bi-info-circle"></i> Información General
                            </h5>
                            
                            <div class="mb-3">
                                <label for="titulo" class="form-label fw-bold">Título del Tour</label>
                                <input v-model="form.titulo" type="text" id="titulo" class="form-control" placeholder="Ej. Misterios de Madrid" required aria-required="true">
                            </div>

                            <div class="mb-3">
                                <label for="localidad" class="form-label fw-bold">Localidad</label>
                                <input v-model="form.localidad" type="text" id="localidad" class="form-control" placeholder="Ej. Madrid" required aria-required="true">
                            </div>

                            <div class="row">
                                <div class="col-6 mb-3">
                                    <label for="fecha" class="form-label fw-bold">Fecha</label>
                                    <input v-model="form.fecha" type="date" id="fecha" class="form-control" required aria-required="true">
                                </div>
                                <div class="col-6 mb-3">
                                    <label for="hora" class="form-label fw-bold">Hora</label>
                                    <input v-model="form.hora" type="time" id="hora" class="form-control" required aria-required="true">
                                </div>
                            </div>

                            <div class="mb-3 p-3 bg-white border rounded shadow-sm">
                                <label for="guiaSelect" class="form-label fw-bold text-secondary mb-1">
                                    <i class="bi bi-person-badge"></i> Asignar Guía (Opcional)
                                </label>
                                <small class="d-block text-muted mb-2">Puedes asignarlo más tarde desde el panel de rutas.</small>
                                <select v-model="form.guia_id" id="guiaSelect" class="form-select border-secondary">
                                    <option value="">Dejar sin asignar por ahora</option>
                                    <option v-for="guia in guias" :key="guia.id" :value="guia.id">
                                        {{ guia.nombre }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="col-12 col-lg-6">
                            <h5 class="text-primary border-bottom pb-2 mb-4">
                                <i class="bi bi-card-text"></i> Detalles y Multimedia
                            </h5>

                            <div class="mb-3">
                                <label for="descripcion" class="form-label fw-bold">Descripción de la ruta</label>
                                <textarea v-model="form.descripcion" id="descripcion" class="form-control" rows="4" placeholder="Explica qué lugares visitaréis y qué hace especial a este tour..." required aria-required="true"></textarea>
                            </div>

                            <div class="mb-3">
                                <label for="foto" class="form-label fw-bold">Foto de portada</label>
                                <input @change="procesarFoto" type="file" id="foto" class="form-control" accept="image/png, image/jpeg, image/webp">
                            </div>

                            <div v-if="form.foto" class="text-center mt-3 p-2 border rounded bg-white shadow-sm">
                                <small class="text-muted d-block mb-2"><i class="bi bi-eye"></i> Previsualización:</small>
                                <img :src="form.foto" alt="Previsualización" class="img-fluid rounded" style="max-height: 150px; object-fit: cover; width: 100%;">
                            </div>
                        </div>
                    </div>

                    <div class="row border-top pt-4">
                        <div class="col-12">
                            <h5 class="text-primary mb-4">
                                <i class="bi bi-geo-alt-fill"></i> Punto de Encuentro
                            </h5>

                            <div class="input-group mb-3 shadow-sm">
                                <input v-model="busqueda" @keyup.enter.prevent="buscarDireccion" type="text" class="form-control" placeholder="Busca una calle o monumento para centrar el mapa...">
                                <button @click.prevent="buscarDireccion" class="btn btn-secondary" type="button" :disabled="buscando">
                                    <span v-if="buscando" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                    <i v-else class="bi bi-search"></i> Buscar
                                </button>
                            </div>
                            
                            <div v-if="errorBusqueda" class="alert alert-warning py-2 mb-3">
                                <i class="bi bi-exclamation-triangle"></i> {{ errorBusqueda }}
                            </div>

                            <div ref="mapContainer" class="mapa-leaflet rounded shadow-sm border mb-3" style="height: 350px; width: 100%;"></div>

                            <div class="d-flex justify-content-between align-items-center bg-white p-3 border rounded shadow-sm">
                                <span class="text-muted small">Haz clic en el mapa para fijar el punto de encuentro exacto.</span>
                                <div>
                                    <span class="badge bg-light text-dark border me-2">Lat: {{ form.latitud || '---' }}</span>
                                    <span class="badge bg-light text-dark border">Lng: {{ form.longitud || '---' }}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <hr class="my-5 text-muted">
                    
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary btn-lg px-5 shadow-sm rounded-pill fw-bold">
                            <i class="bi bi-cloud-arrow-up-fill me-2"></i> Publicar Ruta
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .mapa-leaflet {
    position: relative;
    z-index: 1; /* Lo mantenemos muy bajo */
}

/* 2. Forzamos a los elementos internos de Leaflet a bajar su z-index */
/* Usamos :deep() porque Leaflet inyecta este HTML de forma dinámica */
:deep(.leaflet-pane) {
    z-index: 10 !important;
}

:deep(.leaflet-top),
:deep(.leaflet-bottom) {
    z-index: 10 !important;
}

/* Opcional: Si el propio panel flotante de la tarjeta toca tu navbar superior al hacer scroll */
.container {
    /* Asegura que haya espacio suficiente arriba si tu Navbar es 'fixed-top' */
    padding-top: 80px !important; 
}
</style>