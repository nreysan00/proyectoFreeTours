<script setup>
import Content from './components/Content.vue';
import Card from './components/Card.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import NavBar from './components/NavBar.vue';
import { toastData } from '@/toast.js'
import router from "@/router";


import {ref} from 'vue'

//Habría que controlar cuando se inicia sesión y se cierra con un emit desde el hijo y tener un dato
// de sesión reactivo para pasarlo a la barra de navegación como props
const datosSesion= ref(JSON.parse(localStorage.getItem('sesion')));
const emit = defineEmits("usuarioAutenticado", datosSesion);

function actualizaDatosSesion(usuario){
 
  datosSesion.value=usuario;
  if(usuario ){
    localStorage.setItem("sesion", JSON.stringify(usuario));
  }
    

  else
    localStorage.removeItem("sesion");

}




</script>

<template>
  <div class="layout">

    <Header :usuarioAutenticado="datosSesion" @sesionCerrada="actualizaDatosSesion" title="FreeTours" />
    <NavBar :usuarioAutenticado="datosSesion"/>
    <main class="main-content">
      <RouterView @sesionIniciada="actualizaDatosSesion" ></RouterView>
    </main>
    <Footer/>
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100;">
      
      <div class="toast align-items-center text-white border-0 transition-fade" 
           :class="[`bg-${toastData.tipo}`, { show: toastData.mostrar }]" 
           role="alert" aria-live="assertive" aria-atomic="true">
          
          <div class="d-flex">
              <div class="toast-body fw-bold">
                  <i v-if="toastData.tipo === 'success'" class="bi bi-check-circle-fill me-2"></i>
                  <i v-if="toastData.tipo === 'danger'" class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ toastData.mensaje }}
              </div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="toastData.mostrar = false" aria-label="Cerrar"></button>
          </div>

      </div>
  </div>
  </div>
</template>

<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .main-content {
  flex-grow: 1; /* Rellena todo el hueco entre el Navbar y el Footer */
  overflow-y: auto; /* Hace que SOLO esta parte tenga scroll */
  background-color: #f8f9fa; /* (Opcional) un color de fondo suavito */
  }
  
  .transition-fade {
    transition: opacity 0.3s ease-in-out;
  }
</style>