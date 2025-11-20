<script setup lang="ts">
import { useCoursesStore } from '@/stores/courses'
import type { Course } from '@/types/course'
import { ref, watch } from 'vue'
import { getFileTypeIcon, getFileTypeColor, getFileTypeFromUrl } from '@/utils/fileUtils'

const coursesStore = useCoursesStore()

const expandedCourses = ref<Set<number>>(new Set())
const expandedThemes = ref<Set<number>>(new Set())

// Auto-expand selected course and theme
const updateExpanded = () => {
    if (coursesStore.selectedCourseId) {
        expandedCourses.value.add(coursesStore.selectedCourseId)
    }
    if (coursesStore.selectedThemeId) {
        expandedThemes.value.add(coursesStore.selectedThemeId)
    }
}

// Watch for selection changes and auto-expand
watch(
    () => coursesStore.selectedCourseId,
    () => {
        updateExpanded()
    }
)
watch(
    () => coursesStore.selectedThemeId,
    () => {
        updateExpanded()
    }
)

// Initialize expanded state
updateExpanded()

const isExpanded = (id: number, type: 'course' | 'theme') => {
    if (type === 'course') {
        return expandedCourses.value.has(id)
    }
    return expandedThemes.value.has(id)
}

const isCourseSelected = (courseId: number) => {
    return coursesStore.selectedCourseId === courseId && !coursesStore.selectedThemeId
}

const isThemeSelected = (themeId: number) => {
    return coursesStore.selectedThemeId === themeId && !coursesStore.selectedMaterialId
}

const isMaterialSelected = (materialId: number) => {
    return coursesStore.selectedMaterialId === materialId
}

const selectCourse = (course: Course) => {
    coursesStore.selectCourse(course.id)
}

const selectTheme = (themeId: number) => {
    coursesStore.selectTheme(themeId)
}

const selectMaterial = (materialId: number) => {
    coursesStore.selectMaterial(materialId)
}
</script>

<template>
    <v-navigation-drawer permanent width="280" class="course-sidebar" location="left" elevation="0">
        <div class="sidebar-content">
            <div class="sidebar-section">
                <div class="section-header">MAIN MENU</div>
                <v-list density="compact" nav class="menu-list">
                    <v-list-item
                        value="dashboard"
                        class="menu-item"
                        rounded="lg"
                        :class="{ 'menu-item-active': !coursesStore.selectedCourseId }"
                        @click="coursesStore.selectCourse(null)"
                    >
                        <template v-slot:prepend>
                            <v-icon>mdi-view-dashboard</v-icon>
                        </template>
                        <v-list-item-title>Dashboard</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                        value="courses"
                        class="menu-item"
                        rounded="lg"
                        :class="{ 'menu-item-active': coursesStore.selectedCourseId }"
                        @click="coursesStore.selectCourse(null); coursesStore.selectTheme(null); coursesStore.selectMaterial(null)"
                    >
                        <template v-slot:prepend>
                            <v-icon>mdi-play-circle</v-icon>
                        </template>
                        <v-list-item-title>My Courses</v-list-item-title>
                    </v-list-item>
                </v-list>
            </div>

            <div class="sidebar-section">
                <div class="section-header">COURSES</div>
                <v-list density="compact" nav class="courses-list">
            <v-list-group
                v-for="course in coursesStore.courses"
                :key="course.id"
                :value="isExpanded(course.id, 'course')"
                class="course-group"
            >
                <template v-slot:activator="{ props: groupProps }">
                    <v-list-item
                        v-bind="groupProps"
                        :active="isCourseSelected(course.id)"
                        @click.stop="selectCourse(course)"
                        class="course-header"
                        rounded="lg"
                    >
                        <template v-slot:prepend>
                            <v-icon color="primary" size="24">mdi-book-open-variant</v-icon>
                        </template>
                        <v-list-item-title class="font-weight-medium">{{ course.name }}</v-list-item-title>
                    </v-list-item>
                </template>

                <v-list-group
                    v-for="theme in course.themes"
                    :key="theme.id"
                    :value="isExpanded(theme.id, 'theme')"
                    sub-group
                    class="theme-group"
                >
                    <template v-slot:activator="{ props: themeProps }">
                        <v-list-item
                            v-bind="themeProps"
                            :active="isThemeSelected(theme.id)"
                            @click.stop="selectTheme(theme.id)"
                            class="theme-header"
                            rounded="lg"
                        >
                            <template v-slot:prepend>
                                <v-icon size="20" color="secondary">mdi-folder</v-icon>
                            </template>
                            <v-list-item-title class="text-body-2">{{ theme.name }}</v-list-item-title>
                            <v-list-item-subtitle v-if="theme.description" class="text-caption">
                                {{ theme.description }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </template>

                    <v-list-item
                        v-for="material in theme.materials"
                        :key="material.id"
                        :active="isMaterialSelected(material.id)"
                        @click.stop="selectMaterial(material.id)"
                        class="material-item"
                        rounded="lg"
                    >
                        <template v-slot:prepend>
                            <v-icon
                                size="18"
                                :icon="getFileTypeIcon(getFileTypeFromUrl(material.file))"
                                :color="getFileTypeColor(getFileTypeFromUrl(material.file))"
                            ></v-icon>
                        </template>
                        <v-list-item-title class="text-caption font-weight-regular">
                            {{ material.name }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list-group>
            </v-list-group>
                </v-list>
            </div>
        </div>

        <div v-if="coursesStore.courses.length === 0" class="empty-state">
            <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-book-open-page-variant</v-icon>
            <p class="text-body-2 text-grey">No courses available</p>
        </div>
    </v-navigation-drawer>
</template>

<style scoped>
.course-sidebar {
    background: #f8f9fa;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
    position: fixed;
    left: 0;
    top: 72px;
    height: calc(100vh - 72px);
    z-index: 100;
}

.sidebar-content {
    padding: 24px 16px;
}

.sidebar-section {
    margin-bottom: 32px;
}

.section-header {
    font-size: 11px;
    font-weight: 600;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
    padding: 0 12px;
}

.menu-list,
.courses-list {
    padding: 0;
}

.menu-item {
    margin-bottom: 4px;
    transition: all 0.2s ease;
}

.menu-item:hover {
    background-color: rgba(102, 126, 234, 0.08);
}

.menu-item-active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
    color: #667eea;
    font-weight: 600;
}

.menu-item-active .v-icon {
    color: #667eea;
}

.course-header,
.theme-header,
.material-item {
    margin-bottom: 4px;
    transition: all 0.2s ease;
    border-radius: 12px;
}

.course-header:hover,
.theme-header:hover,
.material-item:hover {
    background-color: rgba(102, 126, 234, 0.08);
    transform: translateX(4px);
}

.course-header.v-list-item--active,
.theme-header.v-list-item--active,
.material-item.v-list-item--active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
    color: #667eea;
    font-weight: 600;
}

.course-header.v-list-item--active .v-icon,
.theme-header.v-list-item--active .v-icon,
.material-item.v-list-item--active .v-icon {
    color: #667eea;
}

.theme-group {
    margin-left: 8px;
}

.material-item {
    margin-left: 16px;
    padding-left: 12px !important;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
}
</style>

