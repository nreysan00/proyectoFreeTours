import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import HomeLogueado from '@/views/HomeLogueado.vue'
import Registro from '@/views/Registro.vue'


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
            path: '/micuenta/:email',
            name: 'micuenta',
            component: HomeLogueado
        }
    ],
})

export default router
