<script setup>
import {ref, onMounted} from "vue"
import router from "@/router";
import {apiURL} from "@/main";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const emit = defineEmits(["registroUsu"]);
const form = ref({ titulo: '', localidad: '', descripcion: '', foto: '', fecha: '', hora: '', latitud: '', longitud: '', guia_id: ''});
const error = ref('');

//Variables para el buscador
const busqueda = ref(''); // Lo que el usuario escribe en el buscador
const buscando = ref(false); // Para mostrar un spinner mientras busca
const errorBusqueda = ref(''); // Si no encuentra el lugar

//Variables e iniciador del mapa al enter en CrearRuta
const mapContainer = ref(null);
let map = null;
let marker = null;

onMounted(() => {
    // Si no has puesto tu clave de Google Maps, Leaflet usa OpenStreetMap (Gratis)
    // Centramos el mapa inicialmente en España (Madrid) con un zoom de 6
    map = L.map(mapContainer.value).setView([40.4168, -3.7038], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 3. Detectar el clic en el mapa
    map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // Actualizamos los campos del formulario reactivamente (redondeado a 6 decimales)
        form.value.latitud = lat.toFixed(6);
        form.value.longitud = lng.toFixed(6);

        // Si ya hay un marcador, lo borramos antes de poner uno nuevo
        if (marker) {
            map.removeLayer(marker);
        }

        // Añadimos el nuevo marcador en la posición del clic
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
        // Usamos la API gratuita de Nominatim (OpenStreetMap)
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(busqueda.value)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
            // Cogemos el primer resultado
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            
            // Actualizamos form y mapa
            actualizarCoordenadas(lat, lng);
            
            // Hacemos zoom al lugar encontrado (15 es un buen nivel de zoom para calles)
            map.setView([lat, lng], 15);
        } else {
            errorBusqueda.value = 'No se encontró la ubicación. Prueba a ser más específico.';
        }
    } catch (error) {
        errorBusqueda.value = 'Error al conectar con el buscador.';
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
    router.push({ name: "rutas" });


})
.catch(error => console.error('Error:', error));
}

/*
async function asignarRuta(id) {
    
}
*/
</script>
<template>
    <div class="container d-flex justify-content-center py-5"  style="overflow-y: scroll;">
        
        <div class="card shadow p-4" style="width: 100%; max-width: 450px;">
            <div class="card-body">
                
                <h3 class="text-center mb-4">Crear Ruta</h3>

                <form @submit.prevent="nuevaRuta">
                    
                    <div class="mb-3">
                        <label for="titulo" class="form-label">Título Ruta</label>
                        <input 
                            id="titulo"
                            v-model="form.titulo" 
                            type="text" 
                            class="form-control" 
                            placeholder="Nombre de la ruta"
                            required
                        />
                    </div>


                    <div class="mb-3">
                        <label for="localidad" class="form-label">Localidad</label>
                        <input 
                            id="localidad"
                            v-model="form.localidad" 
                            type="text" 
                            class="form-control" 
                            placeholder="Jaén"
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="descripcion" class="form-label">Descripción</label>
                        <input 
                            id="descripcion"
                            v-model="form.descripcion" 
                            type="text" 
                            class="form-control"
                            placeholder="En esta ruta veremos..."
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="foto" class="form-label">Foto general de la ruta</label>
                        <input 
                            id="foto"
                            v-model="form.foto" 
                            type="text"
                            class="form-control" 
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="fecha" class="form-label">Fecha</label>
                        <input 
                            id="fecha"
                            v-model="form.fecha" 
                            type="date"
                            class="form-control"
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="hora" class="form-label">Hora</label>
                        <input 
                            id="hora"
                            v-model="form.hora" 
                            type="time"
                            class="form-control"
                            required
                        />
                    </div>
                    <!-- Div para la ubicación por Google Maps -->
                    <div class="mb-3">
                        <label class="form-label fw-bold text-primary">Busca la ubicación o haz clic en el mapa:</label>
                        
                        <div class="input-group mb-2">
                            <input 
                                v-model="busqueda" 
                                @keyup.enter.prevent="buscarDireccion" 
                                type="text" 
                                class="form-control" 
                                placeholder="Ej: Catedral de Jaén, Madrid, Plaza Mayor..."
                            >
                            <button @click.prevent="buscarDireccion" class="btn btn-primary" :disabled="buscando">
                                <span v-if="buscando">Buscando...</span>
                                <span v-else><i class="bi bi-search"></i> Buscar</span>
                            </button>
                        </div>
                        
                        <div v-if="errorBusqueda" class="text-danger small mb-2">
                            {{ errorBusqueda }}
                        </div>

                        <div ref="mapContainer" class="mapa-leaflet" style="height: 300px; width: 100%; border-radius: 8px; border: 1px solid #ccc;"></div>
                    </div>
                    <!-- Al hacer click en el mapa se pone automáticamente la ubicación en los cuadros del formulario de Latitud y Longitud-->
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label for="latitud" class="form-label">Latitud</label>
                            <input 
                                id="latitud"
                                v-model="form.latitud"
                                type="text"
                                class="form-control bg-light"
                                readonly
                                required
                            />
                        </div>
                        <div class="col-6 mb-3">
                            <label for="longitud" class="form-label">Longitud</label>
                            <input 
                                id="longitud"
                                v-model="form.longitud"
                                type="text"
                                class="form-control bg-light"
                                readonly
                                required
                            />
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="guiaId" class="form-label">ID GUIA</label>
                        <input
                            id="guiaId"
                            v-model="form.guia_id"
                            type="text"
                            class="form-control"
                        />
                    </div>

                    <div v-if="error" class="alert alert-danger text-center" role="alert">
                        {{ error }}
                    </div>

                    <button type="submit" class="btn btn-success w-100 mt-2">
                        Crear Ruta
                    </button>

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