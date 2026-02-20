<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <div class="container text-center py-5 my-5">
        
        <div class="display-1 text-danger mb-4 opacity-75">
            <i class="bi bi-compass"></i>
        </div>
        
        <h1 class="fw-bold display-4 text-dark">Error 404</h1>
        <h3 class="text-muted mb-4">¡Ups! Parece que te has salido del mapa.</h3>
        
        <p class="text-secondary mb-5 fs-5">
            La página que estás buscando no existe, ha cambiado de nombre o está temporalmente inaccesible.
        </p>
        
        <button @click="router.push('/')" class="btn btn-primary btn-lg px-4 shadow-sm">
            <i class="bi bi-house-door me-2"></i> Volver al Inicio
        </button>
        
    </div>
</template>