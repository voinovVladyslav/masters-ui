<script setup lang="ts">
import { authService } from '@/services/auth'
import { ref } from 'vue'
const email = ref<string>('')
const password = ref<string>('')
const onLogin = async () => {
    const token = await authService.login(email.value, password.value)
    console.log(token)
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
