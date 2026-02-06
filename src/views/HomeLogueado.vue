<script setup>
    import { useRoute } from 'vue-router';
    import {ref} from 'vue'
    const route = useRoute()
    const nombreUsuario = ref(route.params.email)

</script>

<template>
    ESTA ES MI CUENTA Y SOY {{ nombreUsuario }}
</template>