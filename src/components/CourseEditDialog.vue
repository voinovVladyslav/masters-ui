<script setup lang="ts">
import type { Course } from '@/types/course'
import { ref, watch } from 'vue'

const props = defineProps<{
    modelValue: boolean
    course: Course | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'save': [data: { name: string; description: string }]
}>()

const name = ref<string>('')
const description = ref<string>('')

watch(
    () => props.course,
    (course) => {
        if (course) {
            name.value = course.name
            description.value = ''
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
                <v-icon color="primary" class="mr-2">mdi-book-edit</v-icon>
                <span class="text-h6 font-weight-bold">Edit Course</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
                <v-text-field
                    v-model="name"
                    label="Course Name"
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
                    prepend-inner-icon="mdi-text-subject"
                ></v-textarea>
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
    background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(255, 255, 255, 1) 100%);
    padding: 20px 24px;
}
</style>

