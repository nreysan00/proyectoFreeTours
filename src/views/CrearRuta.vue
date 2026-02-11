<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";

const emit = defineEmits(["registroUsu"]);
const form = ref({ titulo: '', localidad: '', descripcion: '', foto: '', fecha: '', hora: '', latitud: '', longitud: '', guia_id: ''});
const error = ref('');
const usuarioRegistrado = ref(false);

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
.then(data => console.log('Respuesta:', data))
.catch(error => console.error('Error:', error));
}

</script>
<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        
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
                        <label for="email" class="form-label">Localidad</label>
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

                    <div class="mb-3">
                        <label for="latitud" class="form-label">Latitud</label>
                        <input 
                            id="latitud"
                            v-model="form.latitud"
                            type="text"
                            class="form-control"
                            required
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