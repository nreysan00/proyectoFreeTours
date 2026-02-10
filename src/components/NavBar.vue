<script setup>

const props = defineProps({
    datos: Object,
});




</script>

<template>
    <nav class="navbar navbar-expand navbar-light bg-light">
        

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li>
                    <RouterLink to="/">Index</RouterLink>&nbsp;
                </li>
                <li v-if="datos == null" class="nav-item">
                    <RouterLink to="/register">Registro</RouterLink>
                </li>
                <li v-if="datos == null" class="nav-item">
                    <RouterLink to="/login">Login</RouterLink>
                </li>
                <li v-else class="nav-item">
                    <RouterLink class="nav-link" :to="`/micuenta/${datos.email}`">Mi Cuenta</RouterLink>
                </li>

            </ul>
            
        </div>
    </nav>

</template>