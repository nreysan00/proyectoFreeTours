<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";

const emit = defineEmits(["registroUsu"]);
const form = ref({ nombre: '', email: '', contraseña: '' });
const error = ref('');


async function registroUsuario(){
    const userData = {
        nombre: form.value.nombre,
        email: form.value.email,
        contraseña: form.value.contraseña
    };

    fetch(apiURL + 'usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta:', data);
    })
    .catch(error => console.error('Error:', error));
}

</script>
<template>
    <form> 
        <label>Nombre</label>
        <input v-model="form.nombre" type="text" />
        <label>Email</label>
        <input v-model="form.email"  type="text" />
        <label>Contraseña</label>
        <input v-model="form.contraseña" type="password" />
        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
        <button @click.prevent="registroUsuario">Registrate</button>
    </form>
</template>