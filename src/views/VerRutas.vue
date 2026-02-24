<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";
import { mostrarToast } from "@/toast";

//Comprobar que el usuario es admin
const datosSesion= ref(JSON.parse(localStorage.getItem('sesion')));
if(datosSesion.value == null ||datosSesion.value.rol != 'admin'){
    alert('No puedes entrar aquí');
    router.push({ name: "home" });
}

const error = ref('');
const rutas = ref([]);
const guiaAsigEdicion = ref(null)
const guias = ref([]);

async function listarRutas() {

  fetch(apiURL + 'rutas', {
    method: 'GET',
    })
.then(response => response.json())
.then(data => {
    rutas.value = data
    console.log('Rutas:', data)
})
.catch(error => console.error('Error:', error));
}
listarRutas();

async function asignarRuta(id, guia) {
    const updatedGuia = {
        ruta_id: id,
        guia_id: guia
    };

    fetch(apiURL + 'asignaciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedGuia)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta:', data);
        mostrarToast('Guía asignado correctamente', 'success');
        setInterval(() => {
            location.reload();
        }, 500);
        
    })
    .catch(error => console.error('Error:', error));

    asignarRuta.value = null;
}


function habilitarEdicion(id){
    guiaAsigEdicion.value = id
}
//Para editar el guia asignado
function listarGuias() {
    fetch(apiURL + 'usuarios', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        guias.value = data.filter(usuario => usuario.rol === 'guia');
        console.log('Guías cargados:', guias.value);
    })
    .catch(error => console.error('Error cargando guías:', error));
}
listarGuias();

async function borrarRuta(id) {
    if (!confirm("¿Seguro que quieres borrar esta ruta?")) return;
    fetch(apiURL + 'rutas?id=' + id, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta:', data);
        mostrarToast('Ruta eliminada correctamente', 'success');
        location.reload();
    })
    .catch(error => console.error('Error:', error));
}

</script>

<template>
    <div class="container-fluid py-5 px-lg-5">
        
        <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
            
            <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h3 class="mb-0 text-primary fw-bold">
                    <i class="bi bi-map me-2"></i> Gestión de Rutas
                </h3>
                <span class="badge bg-primary rounded-pill fs-6">{{ rutas.length }} rutas en total</span>
            </div>

            <div class="table-responsive">
                <table class="table table-hover table-striped align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col" class="text-center">#</th>
                            <th scope="col">Foto</th>
                            <th scope="col">Ruta y Localidad</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Horario</th>
                            <th scope="col">Ubicación (Lat/Lng)</th>
                            <th scope="col" class="text-center">Guía Asignado</th>
                            <th scope="col" class="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <tr v-for="ruta in rutas" :key="ruta.id">
                            
                            <td class="text-center fw-bold text-secondary">{{ ruta.id }}</td>
                            
                            <td>
                                <div v-if="ruta.foto && ruta.foto.length > 30" class="ratio ratio-1x1 shadow-sm rounded" style="width: 50px;">
                                    <img :src="ruta.foto" alt="Imagen de la ruta" class="rounded object-fit-cover">
                                </div>
                                <div v-else class="text-muted small"><i class="bi bi-image-fill fs-3"></i></div>
                            </td>
                            
                            <td>
                                <p class="mb-0 fw-bold text-primary">{{ ruta.titulo }}</p>
                                <small class="text-muted"><i class="bi bi-geo-alt-fill text-danger"></i> {{ ruta.localidad }}</small>
                            </td>
                            
                            <td class="text-truncate text-secondary" style="max-width: 200px;" :title="ruta.descripcion">
                                {{ ruta.descripcion }}
                            </td>
                            
                            <td>
                                <div class="small fw-bold">{{ ruta.fecha }}</div>
                                <div class="small text-muted"><i class="bi bi-clock"></i> {{ ruta.hora }}</div>
                            </td>
                            
                            <td class="small text-muted">
                                <div>{{ ruta.latitud }}</div>
                                <div>{{ ruta.longitud }}</div>
                            </td>
                            
                            <td class="text-center">
                                <div v-if="guiaAsigEdicion === ruta.id" class="d-flex justify-content-center">
                                    <select v-model="ruta.guia_id" class="form-select form-select-sm shadow-sm" style="min-width: 140px;">
                                        <option :value="null" disabled>Elige un guía...</option>
                                        
                                        <option v-for="guia in guias" :key="guia.id" :value="guia.id">
                                            {{ guia.nombre }}
                                        </option>
                                    </select>
                                </div>
                                
                                <div v-else>
                                    <span v-if="ruta.guia_id == null" class="badge bg-warning text-dark border"><i class="bi bi-exclamation-circle"></i> Sin asignar</span>
                                    <span v-else class="badge bg-success border"><i class="bi bi-person-badge"></i> {{ ruta.guia_nombre }}</span>
                                </div>
                            </td>
                            
                            <td class="text-center">
                                <div class="btn-group shadow-sm">
                                    <button v-if="guiaAsigEdicion === ruta.id" @click="asignarRuta(ruta.id, ruta.guia_id)" class="btn btn-sm btn-success" title="Guardar">
                                        <i class="bi bi-check-circle-fill"></i>
                                    </button>
                                    
                                    <button v-else @click="habilitarEdicion(ruta.id)" class="btn btn-sm btn-outline-primary" title="Asignar Guía">
                                        <i class="bi bi-person-plus-fill"></i>
                                    </button>

                                    <button @click="borrarRuta(ruta.id)" class="btn btn-sm btn-outline-danger" title="Borrar Ruta">
                                        <i class="bi bi-trash-fill"></i>
                                    </button>
                                </div>
                            </td>

                        </tr>

                        <tr v-if="rutas.length === 0">
                            <td colspan="8" class="text-center py-5 text-muted">
                                <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                                No hay rutas registradas en la base de datos.
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>