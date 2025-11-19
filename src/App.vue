<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
</script>

<template>
    {{ authStore.user?.email || 'anonymous' }}
    <v-app>
        <RouterView />
    </v-app>
</template>

<style scoped></style>
