<script setup lang="ts">
import { authenticateApi } from '@/services/api'
import { authService } from '@/services/auth'
import { setToken } from '@/services/token'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const authStore = useAuthStore()
const email = ref<string>('')
const password = ref<string>('')

const onLogin = async () => {
    const response = await authService.login(email.value, password.value)
    if (response.error) {
        console.log('invalid login')
        return
    }
    const token = response.result.token
    setToken(token)
    authenticateApi(token)
    await authStore.loadUser()
}
</script>
<template>
    <v-card>
        <v-card-title> Login here </v-card-title>
        <v-card-text>
            <v-text-field v-model="email" type="email" label="Email"></v-text-field>
            <v-text-field v-model="password" type="password" label="Password"></v-text-field>
            <v-btn type="submit" @click="onLogin">Login</v-btn>
        </v-card-text>
    </v-card>
</template>
