<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";

//Comprobar que el usuario es admin
const datosSesion= ref(JSON.parse(localStorage.getItem('sesion')));
if(datosSesion.value == null ||datosSesion.value.rol != 'admin'){
    alert('No puedes entrar aquí');
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
    })
    .catch(error => console.error('Error:', error));

    asignarRuta.value = null;
}


function habilitarEdicion(id){
    guiaAsigEdicion.value = id
}

async function borrarRuta(id) {
    fetch(apiURL + 'rutas?id=' + id, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => console.log('Respuesta:', data))
    .catch(error => console.error('Error:', error));
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
                    <td v-else-if="ruta.guia_id == null">N/A</td>
                    <td v-else>{{ ruta.guia_nombre }}</td>
                    <td>
                        <button v-if="guiaAsigEdicion === ruta.id" @click="asignarRuta(ruta.id, ruta.guia_id)" class="btn-success">Guardar</button>
                        <button v-else @click="habilitarEdicion(ruta.id)" class="btn-warning">Edition</button>
                        <button @click="borrarRuta(ruta.id)" class="btn-danger">Borrar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>