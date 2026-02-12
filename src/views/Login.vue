<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";

const emit = defineEmits(["sesionIniciada"]);
const form = ref({ email: '', contraseña: '' });
const error = ref('');
const usuarioLogueado = ref(false);

async function iniciarSesion() {
  const loginData = {
    email: form.value.email,
    contraseña: form.value.contraseña,
  };

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
            usuarioLogueado.value = true;
            error.value = '';
            console.log('Login exitoso:', data.email);
            localStorage.setItem("sesion", JSON.stringify(loginData));
            emit('sesionIniciada', {email: form.value.email, contraseña: form.value.contraseña, rol: data.rol})
            
            setTimeout(() => {
                router.push({ name: "home" });
            }, 2000);

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
    <div class="container d-flex justify-content-center align-items-center vh-100">
    
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      <div class="card-body">
        
        <h3 class="text-center mb-4">Login</h3>

        <form @submit.prevent="iniciarSesion">
          
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email"
              v-model="form.email" 
              type="text" 
              class="form-control" 
              placeholder="nombre@ejemplo.com"
              required 
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input 
              id="password"
              v-model="form.contraseña" 
              type="password" 
              class="form-control" 
              placeholder="******"
              required 
            />
          </div>

          <div v-if="error" class="alert alert-danger text-center" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ error }}
          </div>

          <div v-if="usuarioLogueado" class="alert alert-success alert-dismissible fade show text-center" role="alert">
            <strong>¡Login correcto!</strong><br>
            Redirigiendo...
            <button type="button" class="btn-close" @click="usuarioLogueado = false" aria-label="Close"></button>
          </div>

          <button type="submit" class="btn btn-primary w-100 mt-2">
            Iniciar sesión
          </button>
          
        </form>
      </div>
    </div>
  </div>
</template>