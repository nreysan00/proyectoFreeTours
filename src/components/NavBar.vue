<script setup>

const props = defineProps({
    usuarioAutenticado: Object,
});

</script>

<template>
    <nav class="navbar navbar-expand navbar-light bg-light px-3">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/">Index</RouterLink>
                </li>

                <template v-if="!usuarioAutenticado">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/register">Registro</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/login">Login</RouterLink>
                    </li>
                </template>

                <template v-if="usuarioAutenticado">
                    <li class="nav-item">
                        <RouterLink class="nav-link" :to="`/micuenta/${usuarioAutenticado.email}`">
                            Mi Cuenta
                        </RouterLink>
                    </li>
                    <li v-if="usuarioAutenticado.rol === 'admin'" class="nav-item">
                        <RouterLink class="nav-link" to="/admin">Admin</RouterLink>
                    </li>
                    <li v-if="usuarioAutenticado.rol === 'admin'" class="nav-item">
                        <RouterLink class="nav-link" to="/nuevaruta">Crea Ruta</RouterLink>
                    </li>
                    <li v-if="usuarioAutenticado.rol === 'admin' || usuarioAutenticado.rol === 'guia'" class="nav-item">
                        <RouterLink class="nav-link" to="/rutas">Rutas</RouterLink>
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