import { createRouter, createWebHistory } from 'vue-router'
import {ref} from 'vue';
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import HomeLogueado from '@/views/HomeLogueado.vue'
import Registro from '@/views/Registro.vue'
import Admin from '@/views/Admin.vue'
import CrearRuta from '@/views/CrearRuta.vue'
import VerRutas from '@/views/VerRutas.vue'
import DetalleRuta from '@/views/DetalleRuta.vue'
import NotFound from '@/views/NotFound.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/login',
            name: 'login',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Registro
        },
        {
            path: '/micuenta/:email?',
            name: 'micuenta',
            component: HomeLogueado,
            beforeEnter: (to, from, next) => {
                // 1. Leemos el "carnet" (el localStorage)
                const usuarioRaw = localStorage.getItem('sesion');

                // 2. Si no hay sesión (es null), lo echamos al login
                if (usuarioRaw === null) {
                    alert("Debes iniciar sesión para acceder a esta página.");
                    return next({ name: 'login' }); 
                }

                // 3. ¡Bonus de seguridad extra! 
                // Ya sabemos que está logueado, pero... ¿es SU cuenta?
                const usuario = JSON.parse(usuarioRaw);
                
                // Comparamos el email de su sesión con el email que ha escrito en la URL (to.params.email)
                if (usuario.email === to.params.email || usuario.rol === 'admin') {
                    next(); // Todo coincide. ¡Adelante, abre la puerta!
                } else {
                    // Intentó espiar la cuenta de otro
                    alert("No tienes permiso para ver el perfil de otro usuario.");
                    next({ path: '/' }); // Lo mandamos al inicio
                }
            }
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin,
            beforeEnter: (to, from, next) => {
                const usuarioRaw = localStorage.getItem('sesion');

                // 2. Si NO está logueado, puerta cerrada. Al login.
                if (!usuarioRaw) {
                    alert("Debes ser administrador para acceder.");
                    return next({ name: 'login' }); 
                }

                const usuario = JSON.parse(usuarioRaw);

                // 4. Si SÍ puso un email en la URL, comprobamos que sea el suyo (o sea admin)
                if (usuario.rol === 'admin') {
                    next(); // Es su cuenta, le dejamos pasar
                } else {
                    alert("Debes ser administrador para acceder.");
                    next({ path: '/' }); // Intenta ver la de otro, al inicio
                }
            }
        },
        {
            path: '/nuevaruta',
            name: 'nuevaruta',
            component: CrearRuta,
            beforeEnter: (to, from, next) => {
                const usuarioRaw = localStorage.getItem('sesion');

                // 2. Si NO está logueado, puerta cerrada. Al login.
                if (!usuarioRaw) {
                    alert("Debes ser administrador para acceder.");
                    return next({ name: 'login' }); 
                }

                const usuario = JSON.parse(usuarioRaw);

                // 4. Si SÍ puso un email en la URL, comprobamos que sea el suyo (o sea admin)
                if (usuario.rol === 'admin') {
                    next(); // Es su cuenta, le dejamos pasar
                } else {
                    alert("Debes ser administrador para acceder.");
                    next({ path: '/' }); // Intenta ver la de otro, al inicio
                }
            }
        },
        {
            path: '/rutas',
            name: 'rutas',
            component: VerRutas,
            beforeEnter: (to, from, next) => {
                const usuarioRaw = localStorage.getItem('sesion');

                // 2. Si NO está logueado, puerta cerrada. Al login.
                if (!usuarioRaw) {
                    alert("Debes ser administrador para acceder.");
                    return next({ name: 'login' }); 
                }

                const usuario = JSON.parse(usuarioRaw);

                // 4. Si SÍ puso un email en la URL, comprobamos que sea el suyo (o sea admin)
                if (usuario.rol === 'admin') {
                    next(); // Es su cuenta, le dejamos pasar
                } else {
                    alert("Debes ser administrador para acceder.");
                    next({ path: '/' }); // Intenta ver la de otro, al inicio
                }
            }
        },
        {
            path: '/ruta/:id',
            name: 'detalleRuta',
            component: DetalleRuta
        },
        {
            path: '/:pathMatch(.*)*', 
            name: 'NotFound',
            component: NotFound
        }
    ],
})

/*
router.beforeEach(async (to, from) => {
    if(
        !usuarioAuntenticado && 
        to.name !== 'login'
    ) {
        return {name: 'login'}
    }
})
*/
export default router
