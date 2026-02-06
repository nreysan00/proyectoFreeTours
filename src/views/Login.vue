<script setup>
import {ref} from "vue"
import router from "@/router";

const emit = defineEmits(["sesionIniciada"]);
const form = ref({ email: '', contraseña: '' });
const error = ref('');

async function iniciarSesion() {
  const loginData = form.value;

  fetch('http://localhost/api.php/usuarios?login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
          console.log('Login exitoso:', data.user);
      } else {
          console.log('Error de login:', data.message);
      }
  })
  .catch(error => console.error('Error:', error));
}
</script>
<template>
    <form> 
        <label>Nombre</label>
        <input v-model="form.usuario" type="text" />
        <label>Contraseña</label>
        <input v-model="form.contraseña"  type="contraseña" />
        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
        <button @click.prevent="iniciarSesion">Iniciar sesión</button> 
    </form>
</template>