<script setup>

const props = defineProps({
    datos: Object,
});




</script>

<template>
    <nav class="navbar navbar-expand navbar-light bg-light px-3">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            
            <ul class="navbar-nav mr-auto mb-2 mb-lg-0">
                
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/">Index</RouterLink>
                </li>

                <template v-if="!datos">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/register">Registro</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/login">Login</RouterLink>
                    </li>
                </template>

                <template v-else>
                    <li class="nav-item">
                        <RouterLink class="nav-link" :to="`/micuenta/${datos.email}`">Mi Cuenta</RouterLink>
                    </li>

                    <li v-if="datos.rol === 'admin'" class="nav-item">
                        <RouterLink class="nav-link text-primary fw-bold" to="/admin">
                            <i class="bi bi-shield-lock"></i> Admin
                        </RouterLink>
                    </li>
                    <li v-if="datos.rol === 'admin'" class="nav-item">
                        <RouterLink class="nav-link text-success fw-bold" to="/nuevaruta">
                            + Crea Ruta
                        </RouterLink>
                    </li>
                </template>
                
            </ul>
        </div>
    </nav>
</template>

<style scoped>
/* Opcional: Separación extra entre los enlaces */
.nav-item {
    margin-right: 10px;
}
</style>