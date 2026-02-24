import { ref } from 'vue';

export const toastData = ref({
    mostrar: false,
    mensaje: '',
    tipo: 'success'
});

export function mostrarToast(mensaje, tipo = 'success') {
    toastData.value.mensaje = mensaje;
    toastData.value.tipo = tipo;
    toastData.value.mostrar = true;

    setTimeout(() => {
        toastData.value.mostrar = false;
    }, 3000);
}