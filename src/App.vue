<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { removeToken } from './services/token'
import { unauthenticateApi } from './services/api'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
    removeToken()
    unauthenticateApi()
    router.push({ name: 'login' })
}
</script>

<template>
    <v-app>
        <v-app-bar color="white" elevation="0" class="app-bar-modern" height="72">
            <v-container class="d-flex align-center pa-0" fluid>
                <div class="d-flex align-center logo-section ml-4">
                    <div class="logo-icon mr-4">
                        <v-icon color="primary" size="28">mdi-school</v-icon>
                    </div>
                    <v-app-bar-title class="text-h6 font-weight-bold">
                        MATEDU Platform
                    </v-app-bar-title>
                </div>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <div v-if="authStore.user" class="d-flex align-center header-actions">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <div v-bind="props" class="profile-section">
                                <v-avatar size="36" class="mr-2">
                                    <v-icon color="white" size="20">mdi-account</v-icon>
                                </v-avatar>
                                <div class="d-flex flex-column">
                                    <span class="text-body-2 font-weight-medium">
                                        {{ authStore.user.first_name }}
                                        {{ authStore.user.last_name }}
                                    </span>
                                    <span class="text-caption text-grey">
                                        {{
                                            authStore.user.role.charAt(0).toUpperCase() +
                                            authStore.user.role.slice(1)
                                        }}
                                    </span>
                                </div>
                                <v-icon size="small" class="ml-2">mdi-chevron-down</v-icon>
                            </div>
                        </template>
                        <v-list>
                            <v-list-item @click="handleLogout">
                                <template v-slot:prepend>
                                    <v-icon>mdi-logout</v-icon>
                                </template>
                                <v-list-item-title>Logout</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </v-container>
        </v-app-bar>
        <v-main class="main-content">
            <RouterView />
        </v-main>
    </v-app>
</template>

<style scoped>
.app-bar-modern {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    background: #ffffff !important;
}

.logo-section {
    min-width: 200px;
}

.logo-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-icon :deep(.v-icon) {
    color: white !important;
}

.search-section {
    flex: 1;
    max-width: 500px;
    margin: 0 24px;
}

.search-field {
    background: #f5f7fa;
}

.search-field :deep(.v-field) {
    background: #f5f7fa;
}

.header-actions {
    min-width: 300px;
    justify-content: flex-end;
}

.action-btn {
    margin-right: 8px;
}

.profile-section {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 12px;
    transition: background 0.2s;
}

.profile-section:hover {
    background: rgba(0, 0, 0, 0.04);
}

.profile-section .v-avatar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
    background: #f5f7fa;
    min-height: calc(100vh - 72px);
}
</style>
