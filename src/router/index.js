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
            component: Login,
            beforeEnter: (to, from, next) => {
                const usuarioRaw = localStorage.getItem('sesion');

                const ruta = to.name === 'login';

                //Si el usuario ya tiene sesión y quiere ir a login lo mandamos al home
                if (usuarioRaw && ruta) {
                    next({ name: 'home' }); 
                } else {
                    next();
                }
            }
        },
        {
            path: '/register',
            name: 'register',
            component: Registro,
            beforeEnter: (to, from, next) => {
                const usuarioRaw = localStorage.getItem('sesion');

                const ruta = to.name === 'register';

                //Si el usuario ya tiene sesión y quiere ir al registro lo mandamos al home
                if (usuarioRaw && ruta) {
                    next({ name: 'home' }); 
                } else {
                    next();
                }
            }
        },
        {
            path: '/micuenta/:email?',
            name: 'micuenta',
            component: HomeLogueado,
            beforeEnter: (to, from, next) => {
                const usuarioRaw = localStorage.getItem('sesion');

                if (usuarioRaw === null) {
                    alert("Debes iniciar sesión para acceder a esta página.");
                    return next({ name: 'login' }); 
                }

                const usuario = JSON.parse(usuarioRaw);
                
                // Comparamos el email de su sesión con el email que ha escrito en la URL (to.params.email)
                if (usuario.email === to.params.email || usuario.rol === 'admin') {
                    next();
                } else {
                    alert("No tienes permiso para ver el perfil de otro usuario.");
                    next({ path: '/' });
                }
            }
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin,
            beforeEnter: (to, from, next) => {
                const usuarioRaw = localStorage.getItem('sesion');

                if (!usuarioRaw) {
                    alert("Debes ser administrador para acceder.");
                    return next({ name: 'login' }); 
                }

                const usuario = JSON.parse(usuarioRaw);

                if (usuario.rol === 'admin') {
                    next();
                } else {
                    alert("Debes ser administrador para acceder.");
                    next({ path: '/' });
                }
            }
        },
        {
            path: '/nuevaruta',
            name: 'nuevaruta',
            component: CrearRuta,
            beforeEnter: (to, from, next) => {
                const usuarioRaw = localStorage.getItem('sesion');

                if (!usuarioRaw) {
                    alert("Debes ser administrador para acceder.");
                    return next({ name: 'login' }); 
                }

                const usuario = JSON.parse(usuarioRaw);

                if (usuario.rol === 'admin') {
                    next();
                } else {
                    alert("Debes ser administrador para acceder.");
                    next({ path: '/' });
                }
            }
        },
        {
            path: '/rutas',
            name: 'rutas',
            component: VerRutas,
            beforeEnter: (to, from, next) => {
                const usuarioRaw = localStorage.getItem('sesion');

                if (!usuarioRaw) {
                    alert("Debes ser administrador para acceder.");
                    return next({ name: 'login' }); 
                }

                const usuario = JSON.parse(usuarioRaw);

                if (usuario.rol === 'admin') {
                    next();
                } else {
                    alert("Debes ser administrador para acceder.");
                    next({ path: '/' });
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

export default router
