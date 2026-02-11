<script setup>
import {ref} from "vue"
import router from "@/router";
import {apiURL} from "@/main";

const emit = defineEmits(["registroUsu"]);
const form = ref({ nombre: '', email: '', contraseña: '' });
const error = ref('');
const usuarioRegistrado = ref(false);

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
        usuarioRegistrado.value = true;

    })
    .catch(error => console.error('Error:', error));
}

</script>
<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        
        <div class="card shadow p-4" style="width: 100%; max-width: 450px;">
            <div class="card-body">
                
                <h3 class="text-center mb-4">Crear Cuenta</h3>

                <form @submit.prevent="registroUsuario">
                    
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input 
                            id="nombre"
                            v-model="form.nombre" 
                            type="text" 
                            class="form-control" 
                            placeholder="Tu nombre completo"
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input 
                            id="email"
                            v-model="form.email" 
                            type="email" 
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
                        {{ error }}
                    </div>

                    <div v-if="usuarioRegistrado" class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>¡Cuenta creada!</strong> Bienvenido/a {{ form.nombre || 'usuario' }}.
                        <button type="button" class="btn-close" @click="usuarioRegistrado = false" aria-label="Close"></button>
                    </div>

                    <button type="submit" class="btn btn-success w-100 mt-2">
                        Registrarse
                    </button>

                    <div class="text-center mt-3">
                        <small>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></small>
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>