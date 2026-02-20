<script setup>
    import { useRoute } from 'vue-router';
    import {ref} from 'vue'
    import { apiURL } from '@/main';
    import router from "@/router";

    const route = useRoute()
    const nombreUsuario = ref(route.params.email)
    const reservas = ref([]);
    const asignaciones = ref([]);

    //Variables para pasar lista
    const mostrarModalLista = ref(false);
    const rutaActiva = ref(null);
    const asistentesEsperados = ref(0);
    const asistentesReales = ref(0);
    const guardando = ref(false);

    const sesionIniciada = ref(localStorage.getItem('sesion') !== null);
    if(sesionIniciada.value.rol){
        const datosSesion = JSON.parse(localStorage.getItem('sesion'));
        nombreUsuario.value = datosSesion.nombre;
    }
    const datosSesion = JSON.parse(localStorage.getItem('sesion'));
    const rol = datosSesion.rol;
    const idGuia = datosSesion.id;

    async function verReservas() {
        fetch(apiURL + 'reservas', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => console.log('Reservas:', data))
        .catch(error => console.error('Error:', error));
    }
    console.log(verReservas())
    
    async function reservasUsuario(email) {
        fetch(apiURL + `reservas?email=${email}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            asignaciones.value = data;
            console.log('Reservas del usuario:', data)
        })
        .catch(error => console.error('Error:', error));
    }

    async function cancelarReserva(id) {
        if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;
        fetch(apiURL + `reservas?id=${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Reserva cancelada:', data);
            reservasUsuario(nombreUsuario.value);
        })
        .catch(error => console.error('Error:', error));
    }

    async function asignacionesGuia(idGuia) {
        fetch(apiURL + `asignaciones?guia_id=${idGuia}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            asignaciones.value = data;
            console.log('Asignaciones del guía:', data)
        })
        .catch(error => console.error('Error:', error));
    }

    rol == 'guia' ? asignacionesGuia(idGuia) : reservasUsuario(nombreUsuario.value);

    //Funciones para pasar lsita
    function abrirModalLista(ruta) {
    rutaActiva.value = ruta;
    
    // Obtenemos cuántos deberían venir según la base de datos
    asistentesEsperados.value = ruta.asistentes || 0;
    
    // Por comodidad para el guía, pre-rellenamos el input asumiendo que han venido todos.
    // Si falta alguien, solo tiene que darle al botón de restar.
    asistentesReales.value = ruta.asistentes || 0; 
    
    mostrarModalLista.value = true;
}

function cerrarModalLista() {
    mostrarModalLista.value = false;
    rutaActiva.value = null;
}

function sumarAsistente() {
    asistentesReales.value++;
}

function restarAsistente() {
    if (asistentesReales.value > 0) {
        asistentesReales.value--;
    }
}

async function guardarAsistencia() {
    guardando.value = true;
    
    console.log(`Guardando en BD: La ruta ${rutaActiva.value.id} tuvo ${asistentesReales.value} asistentes reales.`);

    // Aquí harías el POST a tu API (PHP) para actualizar el número final
    /*
    fetch(apiURL + 'guardar_asistencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ruta_id: rutaActiva.value.id,
            asistentes_reales: asistentesReales.value
        })
    }).then(...)
    */

    // Simulamos que tarda 1 segundo en guardar
    setTimeout(() => {
        alert("¡Asistencia guardada! Que vaya genial el tour.");
        guardando.value = false;
        cerrarModalLista();
    }, 1000);
}

</script>

<template>
    <div class="container mb-4 main-container">
    <div class="row">
        <div class="col-lg-4 pb-5">
            <!-- Account Sidebar-->
            <div v-if="rol === 'admin'" class="author-card pb-3">
                <div class="author-card-cover" style="background-image: url(https://t4.ftcdn.net/jpg/02/55/77/03/360_F_255770374_rbmJO9gkkIhMBcyVPc3iW016BCLDvcWc.jpg);"></div>
                <div class="author-card-profile">
                    <div class="author-card-avatar"><img src="https://p7.hiclipart.com/preview/9/763/803/computer-icons-login-user-system-administrator-image-admin-thumbnail.jpg" alt="Daniel Adams">
                    </div>
                    <div class="author-card-details">
                        <h5 class="author-card-name text-lg">{{ nombreUsuario }}</h5><span class="author-card-position">Bienvenido, {{ rol.toUpperCase() }}</span>
                    </div>
                </div>
            </div>
            <div v-else-if="rol === 'guia'" class="author-card pb-3">
                <div class="author-card-cover" style="background-image: url(https://www.freetour.com/images/tours/1341/free-tour-madrid-basico-23.jpg);"></div>
                <div class="author-card-profile">
                    <div class="author-card-avatar"><img src="https://e7.pngegg.com/pngimages/790/2/png-clipart-tourism-travel-vacation-tour-guide-backpacker-hostel-travel-text-logo-thumbnail.png" alt="Daniel Adams">
                    </div>
                    <div class="author-card-details">
                        <h5 class="author-card-name text-lg">{{ nombreUsuario }}</h5><span class="author-card-position">Bienvenido, {{ rol.toUpperCase() }}</span>
                    </div>
                </div>
            </div>
            <div v-else class="author-card pb-3">
                <div class="author-card-cover" style="background-image: url(https://bootdey.com/img/Content/flores-amarillas-wallpaper.jpeg);"></div>
                <div class="author-card-profile">
                    <div class="author-card-avatar"><img src="https://www.freeiconspng.com/uploads/customers-icon-3.png" alt="Daniel Adams">
                    </div>
                    <div class="author-card-details">
                        <h5 class="author-card-name text-lg">{{ nombreUsuario }}</h5><span class="author-card-position">{{ rol.toUpperCase() }}</span>
                    </div>
                </div>
            </div>
            <div class="wizard">
                <nav class="list-group list-group-flush">
                    <a class="list-group-item active" href="#">
                        <div class="d-flex justify-content-between align-items-center">
                            <div><i class="fa fa-shopping-bag mr-1 text-muted"></i>
                                <div class="d-inline-block font-weight-medium text-uppercase">Mis Reservas</div>
                            </div><span class="badge badge-secondary">6</span>
                        </div>
                    </a><a class="list-group-item" href="https://www.bootdey.com/snippets/view/bs4-profile-settings-page" target="__blank"><i class="fa fa-user text-muted"></i>Profile Settings</a><a class="list-group-item" href="#"><i class="fa fa-map-marker text-muted"></i>Addresses</a>
                    <a class="list-group-item" href="https://www.bootdey.com/snippets/view/bs4-wishlist-profile-page" tagert="__blank">
                        <div class="d-flex justify-content-between align-items-center">
                            <div><i class="fa fa-heart mr-1 text-muted"></i>
                                <div class="d-inline-block font-weight-medium text-uppercase">My Wishlist</div>
                            </div><span class="badge badge-secondary">3</span>
                        </div>
                    </a>
                    <a class="list-group-item" href="#">
                        <div class="d-flex justify-content-between align-items-center">
                            <div><i class="fa fa-tag mr-1 text-muted"></i>
                                <div class="d-inline-block font-weight-medium text-uppercase">My Tickets</div>
                            </div><span class="badge badge-secondary">4</span>
                        </div>
                    </a>
                </nav>
            </div>
        </div>
        <!-- Orders Table-->
        <div v-if="rol == 'cliente'" class="col-lg-8 pb-5">
            <div class="d-flex justify-content-end pb-3">
                <div class="form-inline">
                    <label class="text-muted mr-3" for="order-sort">Sort Orders</label>
                    <select class="form-control" id="order-sort">
                        <option>All</option>
                        <option>Delivered</option>
                        <option>In Progress</option>
                        <option>Delayed</option>
                        <option>Canceled</option>
                    </select>
                </div>
            </div>
            <div class="table-responsive">
                <caption>Mis Reservas</caption>
                <thead>
                <tr>
                <th scope="col">Ruta</th>
                <th scope="col">Localidad</th>
                <th scope="col">Fecha</th>
                <th scope="col">Hora</th>
                <th scope="col">Ubicación</th>
                <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="reserva in reservas" :key="reserva.id">
                    <td>{{ reserva.ruta_titulo }}</td>
                    <td>{{ reserva.ruta_localidad }}</td>
                    <td>{{ reserva.ruta_fecha }}</td>
                    <td>{{ reserva.ruta_hora }}</td>
                    <td>{{ reserva.ruta_latitud }} - {{ reserva.ruta_longitud }}</td>
                    <td>
                        <button @click="cancelarReserva(reserva.reserva_id)" class="btn-danger">Cancelar Reserva</button>
                    </td>
                </tr>
            </tbody>
            </div>
        </div>
        <div v-else-if="rol == 'guia'" class="col-lg-8 pb-5">
            <div class="d-flex justify-content-end pb-3">
                <div class="form-inline">
                    <label class="text-muted mr-3" for="order-sort">Sort Orders</label>
                    <select class="form-control" id="order-sort">
                        <option>All</option>
                        <option>Delivered</option>
                        <option>In Progress</option>
                        <option>Delayed</option>
                        <option>Canceled</option>
                    </select>
                </div>
            </div>
            <div class="table-responsive">
                <caption>Mis Rutas</caption>
                <thead>
                <tr>
                <th scope="col">Ruta</th>
                <th scope="col">Localidad</th>
                <th scope="col">Fecha</th>
                <th scope="col">Hora</th>
                <th scope="col">Ubicación</th>
                <th scope="col">Num Reservas</th>
                <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="asignacion in asignaciones" :key="asignacion.id">
                    <td>{{ asignacion.ruta_titulo }}</td>
                    <td>{{ asignacion.ruta_localidad }}</td>
                    <td>{{ asignacion.ruta_fecha }}</td>
                    <td>{{ asignacion.ruta_hora }}</td>
                    <td>{{ asignacion.ruta_latitud }} - {{ asignacion.ruta_longitud }}</td>
                    <td>{{ asignacion.reservas[0].num_personas }}</td>
                    <td>
                        boton
                        <button @click="abrirModalLista(asignacion)" class="btn btn-success">Pasar Lista</button>
                    </td>
                    
                </tr>
            </tbody>
            </div>
        </div>
    </div>
    <div v-if="mostrarModalLista" class="modal-backdrop fade show" style="opacity: 0.5;"></div>

<div v-if="mostrarModalLista" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg border-0">
            
            <div class="modal-header bg-light">
                <div>
                    <h5 class="modal-title fw-bold text-primary mb-0">Pasar Lista</h5>
                    <small class="text-muted">{{ rutaActiva.titulo }} - {{ rutaActiva.fecha }}</small>
                </div>
                <button type="button" class="btn-close" @click="cerrarModalLista" aria-label="Cerrar"></button>
            </div>
            
            <div class="modal-body text-center p-4">
                
                <h6 class="text-muted mb-4">
                    Personas esperadas: <span class="badge bg-secondary fs-6 ms-2">{{ asistentesEsperados }}</span>
                </h6>

                <h4 class="fw-bold text-dark mb-4">¿Cuántas personas han venido finalmente?</h4>

                <div class="d-flex justify-content-center align-items-center gap-3 my-3">
                    
                    <button class="btn btn-outline-danger rounded-circle shadow-sm d-flex justify-content-center align-items-center" 
                            style="width: 60px; height: 60px;" 
                            @click="restarAsistente">
                        <i class="bi bi-dash fs-2"></i>
                    </button>

                    <input 
                        type="number" 
                        class="form-control text-center border bg-light text-primary fw-bold shadow-sm" 
                        style="width: 120px; height: 80px; font-size: 3rem; border-radius: 15px;" 
                        v-model.number="asistentesReales" 
                        min="0"
                    >

                    <button class="btn btn-outline-success rounded-circle shadow-sm d-flex justify-content-center align-items-center" 
                            style="width: 60px; height: 60px;" 
                            @click="sumarAsistente">
                        <i class="bi bi-plus fs-2"></i>
                    </button>

                </div>
            </div>
            
            <div class="modal-footer bg-light border-0 justify-content-center pb-4">
                <button type="button" class="btn btn-primary btn-lg px-5 shadow-sm rounded-pill" @click="guardarAsistencia" :disabled="guardando">
                    <span v-if="guardando" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <i v-else class="bi bi-check-circle me-2"></i> 
                    Confirmar Asistentes
                </button>
            </div>

        </div>
    </div>
</div>
</div>
</template>

<style scoped>
    body{
    background:#eee;    
}
.main-container{
    margin-top:40px;    
}
.widget-author {
  margin-bottom: 58px;
}
.author-card {
  position: relative;
  padding-bottom: 48px;
  background-color: #fff;
  box-shadow: 0 12px 20px 1px rgba(64, 64, 64, .09);
}
.author-card .author-card-cover {
  position: relative;
  width: 100%;
  height: 100px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.author-card .author-card-cover::after {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  opacity: 0.5;
}
.author-card .author-card-cover > .btn {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0 10px;
}
.author-card .author-card-profile {
  display: table;
  position: relative;
  margin-top: -22px;
  padding-right: 15px;
  padding-bottom: 16px;
  padding-left: 20px;
  z-index: 5;
}
.author-card .author-card-profile .author-card-avatar, .author-card .author-card-profile .author-card-details {
  display: table-cell;
  vertical-align: middle;
}
.author-card .author-card-profile .author-card-avatar {
  width: 85px;
  border-radius: 50%;
  box-shadow: 0 8px 20px 0 rgba(0, 0, 0, .15);
  overflow: hidden;
}
.author-card .author-card-profile .author-card-avatar > img {
  display: block;
  width: 100%;
}
.author-card .author-card-profile .author-card-details {
  padding-top: 20px;
  padding-left: 15px;
}
.author-card .author-card-profile .author-card-name {
  margin-bottom: 2px;
  font-size: 14px;
  font-weight: bold;
}
.author-card .author-card-profile .author-card-position {
  display: block;
  color: #8c8c8c;
  font-size: 12px;
  font-weight: 600;
}
.author-card .author-card-info {
  margin-bottom: 0;
  padding: 0 25px;
  font-size: 13px;
}
.author-card .author-card-social-bar-wrap {
  position: absolute;
  bottom: -18px;
  left: 0;
  width: 100%;
}
.author-card .author-card-social-bar-wrap .author-card-social-bar {
  display: table;
  margin: auto;
  background-color: #fff;
  box-shadow: 0 12px 20px 1px rgba(64, 64, 64, .11);
}
.btn-style-1.btn-white {
    background-color: #fff;
}
.list-group-item i {
    display: inline-block;
    margin-top: -1px;
    margin-right: 8px;
    font-size: 1.2em;
    vertical-align: middle;
}
.mr-1, .mx-1 {
    margin-right: .25rem !important;
}

.list-group-item.active:not(.disabled) {
    border-color: #e7e7e7;
    background: #fff;
    color: #ac32e4;
    cursor: default;
    pointer-events: none;
}
.list-group-flush:last-child .list-group-item:last-child {
    border-bottom: 0;
}

.list-group-flush .list-group-item {
    border-right: 0 !important;
    border-left: 0 !important;
}

.list-group-flush .list-group-item {
    border-right: 0;
    border-left: 0;
    border-radius: 0;
}
.list-group-item.active {
    z-index: 2;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}
.list-group-item:last-child {
    margin-bottom: 0;
    border-bottom-right-radius: .25rem;
    border-bottom-left-radius: .25rem;
}
a.list-group-item, .list-group-item-action {
    color: #404040;
    font-weight: 600;
}
.list-group-item {
    padding-top: 16px;
    padding-bottom: 16px;
    -webkit-transition: all .3s;
    transition: all .3s;
    border: 1px solid #e7e7e7 !important;
    border-radius: 0 !important;
    color: #404040;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    text-decoration: none;
}
.list-group-item {
    position: relative;
    display: block;
    padding: .75rem 1.25rem;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,0.125);
}
</style>