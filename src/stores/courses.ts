import { CoursesService } from '@/services/courses'
import type { Course } from '@/types/course'
import type { Theme } from '@/types/theme'
import type { Material } from '@/types/material'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCoursesStore = defineStore('courses', () => {
    const courses = ref<Course[]>([])
    const selectedCourseId = ref<number | null>(null)
    const selectedThemeId = ref<number | null>(null)
    const selectedMaterialId = ref<number | null>(null)
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)

    const currentCourse = computed<Course | null>(() => {
        if (!selectedCourseId.value) return null
        return courses.value.find((c) => c.id === selectedCourseId.value) || null
    })

    const currentTheme = computed<Theme | null>(() => {
        if (!selectedThemeId.value || !currentCourse.value) return null
        return (
            currentCourse.value.themes.find((t) => t.id === selectedThemeId.value) || null
        )
    })

    const currentMaterial = computed<Material | null>(() => {
        if (!selectedMaterialId.value || !currentTheme.value) return null
        return (
            currentTheme.value.materials.find((m) => m.id === selectedMaterialId.value) ||
            null
        )
    })

    const fetchCourses = async (): Promise<boolean> => {
        loading.value = true
        error.value = null
        const response = await CoursesService.getCourses()
        if (response.error) {
            error.value = response.error.message
            loading.value = false
            return false
        }
        if (response.result) {
            courses.value = response.result.results
        }
        loading.value = false
        return true
    }

    const selectCourse = (courseId: number | null) => {
        selectedCourseId.value = courseId
        selectedThemeId.value = null
        selectedMaterialId.value = null
    }

    const selectTheme = (themeId: number | null) => {
        selectedThemeId.value = themeId
        selectedMaterialId.value = null
    }

    const selectMaterial = (materialId: number | null) => {
        selectedMaterialId.value = materialId
    }

    return {
        courses,
        selectedCourseId,
        selectedThemeId,
        selectedMaterialId,
        loading,
        error,
        currentCourse,
        currentTheme,
        currentMaterial,
        fetchCourses,
        selectCourse,
        selectTheme,
        selectMaterial,
    }
})

