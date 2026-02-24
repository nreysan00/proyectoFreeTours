<script setup>
import {ref, computed} from "vue"
import router from "@/router";
import {apiURL} from "@/main";

const emit = defineEmits(["registroUsu"]);
const form = ref({ nombre: '', email: '', contraseña: '' });
const error = ref('');
const usuarioRegistrado = ref(false);

const mostrarPassword = ref(false);

const formatoEmailValido = computed(() => {
    /* Si está vacío, no lo evaluamos todavía como "formato inválido" para la vista, 
    pero el botón de registro sí estará bloqueado.*/
    if (form.value.email.length === 0) return true; 
    
    // Expresión regular controlar formato de email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(form.value.email);
});

const inputActivo = ref(false);

const faltaMail = computed(() => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email));
const faltaLongitud = computed(() => form.value.contraseña.length < 8);
const faltaMayuscula = computed(() => !/[A-Z]/.test(form.value.contraseña));
const faltaMinuscula = computed(() => !/[a-z]/.test(form.value.contraseña));
const faltaNumero = computed(() => !/[0-9]/.test(form.value.contraseña));

const faltaAlgo = computed(() => 
    form.value.nombre.trim() === '' ||
    form.value.email === '' ||
    !formatoEmailValido.value ||
    faltaLongitud.value || 
    faltaMayuscula.value || 
    faltaMinuscula.value || 
    faltaNumero.value
);

async function registroUsuario(){
    if (faltaAlgo.value) {
        error.value = "La contraseña no cumple con los requisitos mínimos de seguridad.";
        return;
    }

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
        setTimeout(() => {
                router.push({ name: "login" });
            }, 2000);
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
                            aria-required="true"
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
                            :class="{ 'is-invalid': !formatoEmailValido }"
                            placeholder="nombre@ejemplo.com"
                            aria-required="true"
                            required
                        />
                        <div class="invalid-feedback fw-bold">
                            <i class="bi bi-exclamation-circle"></i> Por favor, introduce un correo válido.
                        </div>
                    </div>

                    <div class="mb-3 position-relative">
                        <label for="password" class="form-label">Contraseña</label>
                        
                        <div 
                            v-if="inputActivo && (faltaLongitud || faltaMayuscula || faltaMinuscula || faltaNumero)" 
                            class="position-absolute bottom-100 start-0 w-100 p-3 mb-2 bg-white border border-danger rounded shadow z-3"
                        >
                            <p class="text-danger fw-bold mb-2 fs-6">
                                <i class="bi bi-shield-exclamation"></i> Tu contraseña debe incluir:
                            </p>
                            <ul class="mb-0 text-danger small" style="padding-left: 20px;">
                                <li v-if="faltaLongitud">Al menos 8 caracteres</li>
                                <li v-if="faltaMayuscula">Una letra mayúscula</li>
                                <li v-if="faltaMinuscula">Una letra minúscula</li>
                                <li v-if="faltaNumero">Al menos un número</li>
                            </ul>
                        </div>

                        <div class="input-group">
                            <input 
                                id="password"
                                v-model="form.contraseña" 
                                :type="mostrarPassword ? 'text' : 'password'" 
                                class="form-control" 
                                placeholder="******"
                                @focus="inputActivo = true"
                                @blur="inputActivo = false"
                                aria-required="true"
                                required
                            />
                            <button 
                                class="btn btn-outline-secondary" 
                                type="button" 
                                @click="mostrarPassword = !mostrarPassword"
                                tabindex="-1"
                            >
                                <i :class="mostrarPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                            </button>
                        </div>
                    </div>

                    <div v-if="error" class="alert alert-danger text-center" role="alert">
                        {{ error }}
                    </div>

                    <div v-if="usuarioRegistrado" class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>¡Cuenta creada!</strong> Bienvenido/a {{ form.nombre || 'usuario' }}.
                        <button type="button" class="btn-close" @click="usuarioRegistrado = false" aria-label="Close"></button>
                    </div>

                    <button type="submit" class="btn btn-success w-100 mt-2" :disabled="faltaAlgo">
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