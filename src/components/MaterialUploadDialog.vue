<script setup lang="ts">
import type { Theme } from '@/types/theme'
import { ref, computed } from 'vue'

const props = defineProps<{
    modelValue: boolean
    theme: Theme | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'upload': [data: { name: string; description: string; file: File }]
}>()

const name = ref<string>('')
const description = ref<string>('')
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const reset = () => {
    name.value = ''
    description.value = ''
    file.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        const selectedFile = target.files[0]
        if (selectedFile) {
            file.value = selectedFile
            if (!name.value) {
                name.value = selectedFile.name.replace(/\.[^/.]+$/, '')
            }
        }
    }
}

const handleUpload = () => {
    if (!file.value || !name.value.trim()) {
        return
    }
    emit('upload', {
        name: name.value.trim(),
        description: description.value.trim(),
        file: file.value,
    })
    reset()
    emit('update:modelValue', false)
}

const handleClose = () => {
    reset()
    emit('update:modelValue', false)
}

const getFileType = (fileName: string): 'docx' | 'pdf' | 'pptx' | null => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'docx') return 'docx'
    if (ext === 'pdf') return 'pdf'
    if (ext === 'pptx') return 'pptx'
    return null
}

const isValidFile = computed(() => {
    if (!file.value) return false
    return getFileType(file.value.name) !== null
})
</script>

<template>
    <v-dialog :model-value="modelValue" max-width="600" @update:model-value="handleClose" persistent>
        <v-card rounded="lg" class="dialog-card">
            <v-card-title class="dialog-header">
                <v-icon color="primary" class="mr-2">mdi-file-upload</v-icon>
                <span class="text-h6 font-weight-bold">Upload Material</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
                <v-text-field
                    v-model="name"
                    label="Material Name"
                    required
                    variant="outlined"
                    density="comfortable"
                    class="mb-4"
                    prepend-inner-icon="mdi-text"
                ></v-text-field>
                <v-textarea
                    v-model="description"
                    label="Description"
                    rows="3"
                    variant="outlined"
                    density="comfortable"
                    class="mb-4"
                    prepend-inner-icon="mdi-text-subject"
                ></v-textarea>
                <v-file-input
                    ref="fileInput"
                    label="File"
                    accept=".docx,.pdf,.pptx"
                    @change="handleFileSelect"
                    required
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-file"
                >
                    <template v-slot:prepend>
                        <v-icon>mdi-file-upload</v-icon>
                    </template>
                </v-file-input>
                <v-alert
                    v-if="file && !isValidFile"
                    type="warning"
                    variant="tonal"
                    rounded="lg"
                    class="mt-4"
                    density="compact"
                >
                    Only .docx, .pdf, and .pptx files are supported
                </v-alert>
                <v-card
                    v-if="file && isValidFile"
                    variant="tonal"
                    color="success"
                    class="mt-4"
                    rounded="lg"
                >
                    <v-card-text class="d-flex align-center">
                        <v-icon class="mr-2">mdi-check-circle</v-icon>
                        <span class="text-body-2">{{ file.name }}</span>
                    </v-card-text>
                </v-card>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="handleClose" class="mr-2">Cancel</v-btn>
                <v-btn
                    color="primary"
                    variant="flat"
                    :disabled="!name.trim() || !file || !isValidFile"
                    @click="handleUpload"
                    prepend-icon="mdi-upload"
                >
                    Upload
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.dialog-card {
    border: 1px solid #e0e0e0;
}

.dialog-header {
    background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(255, 255, 255, 1) 100%);
    padding: 20px 24px;
}
</style>

