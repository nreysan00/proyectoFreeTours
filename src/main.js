import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
export const apiURL = 'http://localhost/freetours/api.php/'
//export const apiURL = 'http://localhost:8001/api.php/'

createApp(App).use(router).mount('#app')
