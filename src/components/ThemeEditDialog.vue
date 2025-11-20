<script setup lang="ts">
import type { Theme } from '@/types/theme'
import { ref, watch } from 'vue'

const props = defineProps<{
    modelValue: boolean
    theme: Theme | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'save': [data: { name: string; description: string; order: number }]
}>()

const name = ref<string>('')
const description = ref<string>('')
const order = ref<number>(0)

watch(
    () => props.theme,
    (theme) => {
        if (theme) {
            name.value = theme.name
            description.value = theme.description || ''
            order.value = theme.order
        }
    },
    { immediate: true }
)

const handleSave = () => {
    if (!name.value.trim()) {
        return
    }
    emit('save', {
        name: name.value.trim(),
        description: description.value.trim(),
        order: order.value,
    })
    emit('update:modelValue', false)
}

const handleClose = () => {
    emit('update:modelValue', false)
}
</script>

<template>
    <v-dialog :model-value="modelValue" max-width="600" @update:model-value="handleClose" persistent>
        <v-card rounded="lg" class="dialog-card">
            <v-card-title class="dialog-header">
                <v-icon color="secondary" class="mr-2">mdi-folder-edit</v-icon>
                <span class="text-h6 font-weight-bold">Edit Theme</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
                <v-text-field
                    v-model="name"
                    label="Theme Name"
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
                <v-text-field
                    v-model.number="order"
                    label="Order"
                    type="number"
                    min="0"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-sort-numeric"
                ></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="handleClose" class="mr-2">Cancel</v-btn>
                <v-btn color="primary" variant="flat" :disabled="!name.trim()" @click="handleSave" prepend-icon="mdi-content-save">
                    Save
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
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(255, 255, 255, 1) 100%);
    padding: 20px 24px;
}
</style>

