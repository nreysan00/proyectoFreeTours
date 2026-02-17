<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";
//import { CModal, CModalHeader, CModalFooter, CModalTitle, CModalBody, CButton, } from "@coreui/vue";
//Comprobar que el usuario es admin
const datosSesion= ref(JSON.parse(localStorage.getItem('sesion')));
console.log(datosSesion.value.rol)
if(datosSesion.value.rol != 'admin'){
    alert('No puedes entrar aquí');
    router.push({ name: "home" });
}
const error = ref('');
const usuarios = ref([]);
const usuarioEdicion = ref(null)

async function listaUsuarios() {

  fetch(apiURL + 'usuarios', {
    method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        usuarios.value = data;
        console.log('Usuarios:', data)
    })
    .catch(error => console.error('Error:', error));
}
listaUsuarios();

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
    if (!confirm("¿Seguro que quieres borrar a este usuario?")) return;
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
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Contraseña</th>
                <th scope="col">Rol</th>
                <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="usuario in usuarios" :key="usuario.id">
                    <td>{{ usuario.id }}</td>
                    <td>{{ usuario.nombre }}</td>
                    <td>{{ usuario.email }}</td>
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