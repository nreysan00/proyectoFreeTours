<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";
//import { CModal, CModalHeader, CModalFooter, CModalTitle, CModalBody, CButton, } from "@coreui/vue";
const route = useRoute();
console.log(route)
import { useRoute } from 'vue-router';

if(route.params.rol == 'cliente'){
    alert('¡No puedes estar!')
    router.push({ name: "home" });
}

const error = ref('');
const rutas = ref([]);
const guiaAsigEdicion = ref(null)

async function listarRutas() {

  fetch(apiURL + 'rutas', {
    method: 'GET',
    })
.then(response => response.json())
.then(data => {
    rutas.value = data;
    console.log('Rutas:', data)
})
.catch(error => console.error('Error:', error));
}
listarRutas();

async function editarGuia(id, guia) {
const asignacionData = {
    ruta_id: id, // ID de la ruta
    guia_id: guia  // ID del guía
};

fetch(apiURL + 'asignaciones', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(asignacionData)
})
.then(response => response.json())
.then(data => console.log('Respuesta:', data))
.catch(error => console.error('Error:', error));

}

function habilitarEdicion(id){
    guiaAsigEdicion.value = id
}

async function borrarRuta(id) {
    console.log(id)
    fetch(apiURL + 'usuarios?id=' + id, {
    method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => console.log('Respuesta:', data))
    .catch(error => console.error('Error:', error));

    window.location.reload();
}

</script>

<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Titulo</th>
                <th scope="col">Localidad</th>
                <th scope="col">Descripcion</th>
                <th scope="col">Foto</th>
                <th scope="col">Fecha</th>
                <th scope="col">Hora</th>
                <th scope="col">Latitud</th>
                <th scope="col">Longitud</th>
                <th scope="col">Guia</th>
                <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ruta in rutas" :key="ruta.id">
                    <td>{{ ruta.id }}</td>
                    <td>{{ ruta.titulo }}</td>
                    <td>{{ ruta.localidad }}</td>
                    <td>{{ ruta.descripcion }}</td>
                    <td>{{ ruta.foto }}</td>
                    <td>{{ ruta.fecha }}</td>
                    <td>{{ ruta.hora }}</td>
                    <td>{{ ruta.latitud }}</td>
                    <td>{{ ruta.longitud }}</td>
                    <td v-if="guiaAsigEdicion === ruta.id"><input v-model="ruta.guia_id" type="text"></td>
                    <td v-else>{{ ruta.guia_id }}</td>
                    <td>
                        <button v-if="guiaAsigEdicion === ruta.id" @click="editarGuia(ruta.id, ruta.guia_id)" class="btn-success">Guardar</button>
                        <button v-else @click="habilitarEdicion(ruta.id)" class="btn-warning">Edition</button>
                        <button @click="borrarRuta(ruta.id)" class="btn-danger">Borrar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>