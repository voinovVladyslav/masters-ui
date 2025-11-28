<script setup lang="ts">
import { authenticateApi } from '@/services/api'
import { authService } from '@/services/auth'
import { setToken } from '@/services/token'
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const email = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const router = useRouter()

const isFormValid = computed(() => {
    return email.value.trim() !== '' && password.value.trim() !== ''
})

const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
}

const onLogin = async () => {
    error.value = null

    // Validation
    if (!email.value.trim()) {
        error.value = 'Please enter your email address'
        return
    }

    if (!validateEmail(email.value)) {
        error.value = 'Please enter a valid email address'
        return
    }

    if (!password.value.trim()) {
        error.value = 'Please enter your password'
        return
    }

    loading.value = true

    try {
        const response = await authService.login(email.value, password.value)
        if (response.error) {
            error.value = response.error.message || 'Invalid email or password. Please try again.'
            loading.value = false
            return
        }

        const token = response.result?.token
        if (!token) {
            error.value = 'Login failed. Please try again.'
            loading.value = false
            return
        }

        setToken(token)
        authenticateApi(token)
        await authStore.loadUser()
        router.push({ name: 'home' })
    } catch (err) {
        error.value = 'An unexpected error occurred. Please try again.'
        loading.value = false
        console.error('Login error:', err)
    }
}

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && isFormValid.value && !loading.value) {
        onLogin()
    }
}
</script>

<template>
    <div class="login-container">
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center" class="fill-height">
                <v-col cols="12" sm="8" md="6" lg="4" xl="3">
                    <v-card class="login-card" rounded="xl" elevation="8">
                        <!-- Header Section -->
                        <div class="login-header">
                            <div class="logo-wrapper">
                                <v-icon color="white" size="40">mdi-school</v-icon>
                            </div>
                            <v-card-title class="login-title">
                                Welcome Back
                            </v-card-title>
                            <v-card-subtitle class="login-subtitle">
                                Sign in to continue to MATEDU Platform
                            </v-card-subtitle>
                        </div>

                        <v-divider></v-divider>

                        <v-card-text class="login-content">
                            <!-- Error Alert -->
                            <v-alert
                                v-if="error"
                                type="error"
                                variant="tonal"
                                rounded="lg"
                                class="mb-6"
                                density="compact"
                                closable
                                @click:close="error = null"
                            >
                                <v-alert-title class="text-body-2 font-weight-medium">
                                    Login Failed
                                </v-alert-title>
                                <div class="text-body-2">{{ error }}</div>
                            </v-alert>

                            <!-- Login Form -->
                            <v-form @submit.prevent="onLogin">
                                <v-text-field
                                    v-model="email"
                                    type="email"
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    variant="outlined"
                                    density="comfortable"
                                    prepend-inner-icon="mdi-email-outline"
                                    :disabled="loading"
                                    :error-messages="
                                        email && !validateEmail(email)
                                            ? 'Please enter a valid email address'
                                            : ''
                                    "
                                    class="mb-4"
                                    autocomplete="email"
                                    @keypress="handleKeyPress"
                                ></v-text-field>

                                <v-text-field
                                    v-model="password"
                                    :type="showPassword ? 'text' : 'password'"
                                    label="Password"
                                    placeholder="Enter your password"
                                    variant="outlined"
                                    density="comfortable"
                                    prepend-inner-icon="mdi-lock-outline"
                                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                    :disabled="loading"
                                    class="mb-6"
                                    autocomplete="current-password"
                                    @click:append-inner="showPassword = !showPassword"
                                    @keypress="handleKeyPress"
                                ></v-text-field>

                                <v-btn
                                    type="submit"
                                    :loading="loading"
                                    :disabled="!isFormValid || loading"
                                    block
                                    size="large"
                                    rounded="lg"
                                    class="login-button text-body-1 font-weight-bold"
                                    elevation="2"
                                >
                                    <span v-if="!loading">Sign In</span>
                                    <span v-else>Signing In...</span>
                                </v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>

                    <!-- Footer -->
                    <div class="login-footer text-center mt-6">
                        <p class="text-body-2 text-grey">
                            © 2024 MATEDU Platform. All rights reserved.
                        </p>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>
.login-container {
    min-height: 100vh;
    
    position: relative;
    overflow: hidden;
}

.login-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
}

.login-card {
    background: #ffffff;
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 1;
    overflow: hidden;
}

.login-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 48px 32px 32px;
    text-align: center;
    color: white;
}

.logo-wrapper {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-title {
    color: white !important;
    font-size: 28px !important;
    font-weight: 700 !important;
    line-height: 1.2;
    margin-bottom: 8px;
    padding: 0 !important;
}

.login-subtitle {
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 14px !important;
    opacity: 0.95;
    padding: 0 !important;
}

.login-content {
    padding: 32px !important;
}

.login-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: white !important;
    text-transform: none !important;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
}

.login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4) !important;
}

.login-button:active:not(:disabled) {
    transform: translateY(0);
}

.login-button:disabled {
    opacity: 0.6;
}

.login-footer {
    position: relative;
    z-index: 1;
}

.login-footer p {
    color: rgba(255, 255, 255, 0.9) !important;
}

/* Form field styling */
:deep(.v-field) {
    border-radius: 12px;
}

:deep(.v-field__input) {
    padding-top: 12px;
    padding-bottom: 12px;
}

:deep(.v-label) {
    font-size: 14px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .login-header {
        padding: 32px 24px 24px;
    }

    .logo-wrapper {
        width: 64px;
        height: 64px;
        margin-bottom: 20px;
    }

    .login-title {
        font-size: 24px !important;
    }

    .login-content {
        padding: 24px !important;
    }
}

/* Animation for card entrance */
.login-card {
    animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
