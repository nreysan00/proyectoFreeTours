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
const usuarioEdicion = ref(null)

async function listarRutas() {

  fetch(apiURL + 'rutas', {
    method: 'GET',
    })
.then(response => response.json())
.then(data => console.log('Rutas:', data))
.catch(error => console.error('Error:', error));
}
listarRutas();

async function editarRol(id, rol) {
const updatedRole = {
    rol: rol
};
fetch(apiURL + 'usuarios?id=' + id, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedRole)
    })
    .then(response => response.json())
    .then(data => console.log('Respuesta:', data))
    .catch(error => console.error('Error:', error));

    usuarioEdicion.value = null;
}

function habilitarEdicion(id){
    usuarioEdicion.value = id
}

async function borrarUsu(id) {
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
                </tr>
            </thead>
            <tbody>
                <tr v-for="ruta in rutas" :key="usuario.id">
                    <td>{{ ruta.id }}</td>
                    <td>{{ ruta.nombre }}</td>
                    <td>{{ ruta.email }}</td>
                    <td>******</td>
                    <td v-if="usuarioEdicion === usuario.id"><input v-model="usuario.rol" type="text"></td>
                    <td v-else>{{ usuario.rol }}</td>
                    <td>
                        <button v-if="usuarioEdicion === usuario.id" @click="editarRol(usuario.id, usuario.rol)" class="btn-success">Guardar</button>
                        <button v-else @click="habilitarEdicion(usuario.id)" class="btn-warning">Edition</button>
                        <button @click="borrarUsu(usuario.id)" class="btn-danger">Borrar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>