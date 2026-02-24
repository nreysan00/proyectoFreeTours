<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <footer class="bg-dark text-white pt-5 pb-3 mt-auto shadow-lg">
        <div class="container">
            
            <div class="row gy-4">
                
                <div class="col-12 col-md-4 text-center text-md-start">
                    <h5 class="fw-bold text-success mb-3">
                        <i class="bi bi-geo-alt-fill"></i> FreeTours
                    </h5>
                    <p class="text-white-50 small">
                        Descubre las mejores ciudades paso a paso con nuestros guías locales expertos. ¡Tu próxima aventura te espera!
                    </p>
                </div>

                <div class="col-12 col-md-4 text-center">
                    <h5 class="fw-bold mb-3">Navegación</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2">
                            <RouterLink :to="{ name: 'home' }" class="text-white-50 text-decoration-none transition-link">
                                <i class="bi bi-house-door me-1"></i> Inicio
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink :to="{ name: 'micuenta' }" class="text-white-50 text-decoration-none transition-link">
                                <i class="bi bi-person-circle me-1"></i> Mi Cuenta
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <div class="col-12 col-md-4 text-center text-md-end">
                    <h5 class="fw-bold mb-3">Síguenos</h5>
                    <div class="d-flex justify-content-center justify-content-md-end gap-3">
                        <a href="#" class="text-white-50 fs-4 transition-link" title="Instagram">
                            <i class="bi bi-instagram"></i>
                        </a>
                        <a href="#" class="text-white-50 fs-4 transition-link" title="Facebook">
                            <i class="bi bi-facebook"></i>
                        </a>
                        <a href="#" class="text-white-50 fs-4 transition-link" title="X / Twitter">
                            <i class="bi bi-twitter-x"></i>
                        </a>
                    </div>
                </div>

            </div>

            <hr class="border-secondary my-4">
            <div class="text-center text-white-50 small">
                <p class="mb-0">&copy; {{ new Date().getFullYear() }} FreeTours - Todos los derechos reservados.</p>
            </div>

        </div>
    </footer>
</template>

<style scoped>
.transition-link {
    transition: all 0.3s ease;
    display: inline-block;
}

.transition-link:hover {
    color: #ffffff !important;
    transform: translateY(-3px);
}
</style>