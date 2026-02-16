<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";
//Esta página incluirá una barra de búsqueda
//La barra de búsqueda hará un fetch y el resultado se guardará en el localstorage
//Los datos del localstorage de la búsqueda se pasarán a la vista de búsqueda
//Se debe eliminar la búsqueda para que no se quede almacenada

const fecha = ref('');
const localidad = ref('');
const listaRutas = ref([]);

async function buscarRuta(fecha, localidad) {
    fetch(apiURL + `/rutas?fecha=${fecha.value}&localidad=${localidad.value}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        listaRutas.value = data;
        console.log('Rutas filtradas:', data)
    })
    .catch(error => console.error('Error:', error)); 
}
</script>
<template>
    <h1>BIENVENIDO A FREETOURS</h1>
    <form class="d-flex" role="search">
        <input v-model="fecha" class="form-control me-6" type="date" placeholder="Fecha" aria-label="Search" required>
        <input v-model="localidad" class="form-control me-6" type="text" placeholder="Localidad" aria-label="Search">
        <button @click="buscarRuta" class="btn btn-outline-success" type="submit">Buscar</button>
    </form>

    <div>
        <div v-for="ruta in listaRutas" :key="ruta.key">
            <p>{{ ruta.descripcion }}</p>
        </div>
    </div>
</template>