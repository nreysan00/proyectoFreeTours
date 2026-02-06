<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";

const emit = defineEmits(["sesionIniciada"]);
const form = ref({ email: '', contraseña: '' });
const error = ref('');

async function iniciarSesion() {
  const loginData = form.value;

  fetch(apiURL + 'usuarios?login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
        if (data.status === 'success') {
            console.log('Login exitoso:', data.email);

        } else {
            console.log('Error de login:', data.message);
        }
      } else {
        error.value = data.message
        console.log('Error de login:', data.message);
      }
  })
  .catch(error => console.error('Error:', error));
}
</script>
<template>
    <form> 
        <label>Email</label>
        <input v-model="form.email" type="text" />
        <label>Contraseña</label>
        <input v-model="form.contraseña"  type="password" />
        <p v-if="error" class="text-danger mt-2">{{ error }} {{ usuario }}</p>
        <button @click.prevent="iniciarSesion">Iniciar sesión</button> 
    </form>
</template>