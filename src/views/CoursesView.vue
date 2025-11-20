<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useCoursesStore } from '@/stores/courses'
import CourseSidebar from '@/components/CourseSidebar.vue'
import MaterialPreviewView from '@/components/MaterialPreviewView.vue'
import MaterialUploadDialog from '@/components/MaterialUploadDialog.vue'
import MaterialEditDialog from '@/components/MaterialEditDialog.vue'
import ThemeEditDialog from '@/components/ThemeEditDialog.vue'
import CourseEditDialog from '@/components/CourseEditDialog.vue'
import { onMounted, ref, computed } from 'vue'
import { getFileTypeFromUrl, getFileTypeIcon, getFileTypeColor } from '@/utils/fileUtils'

const authStore = useAuthStore()
const coursesStore = useCoursesStore()

const showUploadDialog = ref<boolean>(false)
const showMaterialEditDialog = ref<boolean>(false)
const showThemeEditDialog = ref<boolean>(false)
const showCourseEditDialog = ref<boolean>(false)

const isTeacher = computed(() => authStore.user?.role === 'teacher')

// Calculate statistics
const totalCourses = computed(() => coursesStore.courses.length)
const totalThemes = computed(() => {
    return coursesStore.courses.reduce((sum, course) => sum + course.themes.length, 0)
})
const totalMaterials = computed(() => {
    return coursesStore.courses.reduce(
        (sum, course) =>
            sum + course.themes.reduce((themeSum, theme) => themeSum + theme.materials.length, 0),
        0
    )
})
const completedCourses = computed(() => {
    // Placeholder - would need completion tracking
    return 0
})

onMounted(async () => {
    await coursesStore.fetchCourses()
})

const handleUploadMaterial = (data: { name: string; description: string; file: File }) => {
    console.log('Upload material:', data)
    coursesStore.fetchCourses()
}

const handleEditMaterial = (data: { name: string; file?: File }) => {
    console.log('Edit material:', data)
    coursesStore.fetchCourses()
}

const handleEditTheme = (data: { name: string; description: string; order: number }) => {
    console.log('Edit theme:', data)
    coursesStore.fetchCourses()
}

const handleEditCourse = (data: { name: string; description: string }) => {
    console.log('Edit course:', data)
    coursesStore.fetchCourses()
}
</script>

<template>
    <div class="courses-view">
        <CourseSidebar />
        <div class="content-area">
            <v-container fluid class="pa-4">
                <!-- Dashboard View (when nothing selected) -->
                <div v-if="!coursesStore.currentCourse && !coursesStore.currentTheme && !coursesStore.currentMaterial">
                    <!-- Welcome Banner -->
                    <v-card class="welcome-banner mb-6" rounded="xl">
                        <div class="banner-content">
                            <div class="banner-text">
                                <h1 class="banner-title">Ready to keep learning?</h1>
                                <p class="banner-subtitle">
                                    Let's keep your learning journey going. You're just one step closer to your goals.
                                </p>
                                <div class="banner-actions">
                                    <v-btn
                                        v-if="coursesStore.courses.length > 0 && coursesStore.courses[0]"
                                        color="white"
                                        variant="flat"
                                        size="large"
                                        rounded="lg"
                                        class="banner-btn"
                                        @click="coursesStore.selectCourse(coursesStore.courses[0]!.id)"
                                    >
                                        Start Learning
                                    </v-btn>
                                    <v-btn
                                        variant="outlined"
                                        size="large"
                                        rounded="lg"
                                        class="banner-btn"
                                        color="white"
                                    >
                                        Explore Courses
                                    </v-btn>
                                </div>
                            </div>
                            <div class="banner-decoration">
                                <v-icon size="64" color="white" opacity="0.3">mdi-code-braces</v-icon>
                                <v-icon size="48" color="white" opacity="0.3">mdi-database</v-icon>
                                <v-icon size="56" color="white" opacity="0.3">mdi-pencil</v-icon>
                                <v-icon size="52" color="white" opacity="0.3">mdi-chart-line</v-icon>
                                <v-icon size="60" color="white" opacity="0.3">mdi-play-circle</v-icon>
                            </div>
                        </div>
                    </v-card>

                    <!-- Statistics Cards -->
                    <v-row class="mb-6">
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="stat-card" rounded="lg">
                                <v-card-text class="d-flex align-center">
                                    <div class="stat-icon stat-icon-primary">
                                        <v-icon size="28" color="white">mdi-book-check</v-icon>
                                    </div>
                                    <div class="ml-4">
                                        <div class="stat-value">{{ totalCourses }}</div>
                                        <div class="stat-label">Total Courses</div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="stat-card" rounded="lg">
                                <v-card-text class="d-flex align-center">
                                    <div class="stat-icon stat-icon-success">
                                        <v-icon size="28" color="white">mdi-certificate</v-icon>
                                    </div>
                                    <div class="ml-4">
                                        <div class="stat-value">{{ completedCourses }}</div>
                                        <div class="stat-label">Completed</div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="stat-card" rounded="lg">
                                <v-card-text class="d-flex align-center">
                                    <div class="stat-icon stat-icon-info">
                                        <v-icon size="28" color="white">mdi-folder-multiple</v-icon>
                                    </div>
                                    <div class="ml-4">
                                        <div class="stat-value">{{ totalThemes }}</div>
                                        <div class="stat-label">Themes</div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-card class="stat-card" rounded="lg">
                                <v-card-text class="d-flex align-center">
                                    <div class="stat-icon stat-icon-warning">
                                        <v-icon size="28" color="white">mdi-file-document-multiple</v-icon>
                                    </div>
                                    <div class="ml-4">
                                        <div class="stat-value">{{ totalMaterials }}</div>
                                        <div class="stat-label">Materials</div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Courses Grid -->
                    <div class="section-header mb-4">
                        <h2 class="section-title">My Courses</h2>
                        <v-btn
                            variant="text"
                            size="small"
                            @click="coursesStore.selectCourse(null); coursesStore.selectTheme(null); coursesStore.selectMaterial(null)"
                        >
                            See All
                        </v-btn>
                    </div>
                    <v-row v-if="coursesStore.courses.length > 0">
                        <v-col
                            v-for="course in coursesStore.courses"
                            :key="course.id"
                            cols="12"
                            sm="6"
                            md="4"
                            lg="3"
                        >
                            <v-card
                                class="course-card-modern"
                                rounded="xl"
                                @click="coursesStore.selectCourse(course.id)"
                            >
                                <div class="course-card-image">
                                    <div class="course-tag">COURSE</div>
                                    <div class="course-image-placeholder">
                                        <v-icon size="64" color="white" opacity="0.8">mdi-book-open-variant</v-icon>
                                    </div>
                                </div>
                                <v-card-text class="pa-4">
                                    <h3 class="course-card-title">{{ course.name }}</h3>
                                    <div class="course-card-footer">
                                        <v-chip size="x-small" variant="flat" color="primary">
                                            {{ course.themes.length }} theme(s)
                                        </v-chip>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-card v-else class="empty-courses" rounded="lg">
                        <v-card-text class="text-center pa-12">
                            <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-book-open-page-variant</v-icon>
                            <h3 class="text-h6 font-weight-medium mb-2">No courses available</h3>
                            <p class="text-body-2 text-grey">Start by creating your first course</p>
                        </v-card-text>
                    </v-card>
                </div>

                <!-- Material Preview -->
                <div v-else-if="coursesStore.currentMaterial" class="material-container">
                    <v-card class="material-card" rounded="xl">
                        <v-card-title class="material-header">
                            <div class="d-flex align-center flex-grow-1">
                                <v-icon
                                    :icon="getFileTypeIcon(getFileTypeFromUrl(coursesStore.currentMaterial.file))"
                                    :color="getFileTypeColor(getFileTypeFromUrl(coursesStore.currentMaterial.file))"
                                    size="32"
                                    class="mr-4"
                                ></v-icon>
                                <div class="flex-grow-1">
                                    <h2 class="text-h5 font-weight-bold mb-2">
                                        {{ coursesStore.currentMaterial.name }}
                                    </h2>
                                    <v-chip
                                        size="small"
                                        :color="getFileTypeColor(getFileTypeFromUrl(coursesStore.currentMaterial.file))"
                                        variant="flat"
                                    >
                                        {{ getFileTypeFromUrl(coursesStore.currentMaterial.file).toUpperCase() }}
                                    </v-chip>
                                </div>
                            </div>
                            <v-btn
                                v-if="isTeacher"
                                icon="mdi-pencil"
                                variant="text"
                                size="small"
                                @click="showMaterialEditDialog = true"
                            ></v-btn>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="pa-0">
                            <MaterialPreviewView :material="coursesStore.currentMaterial" />
                        </v-card-text>
                    </v-card>
                </div>

                <!-- Theme Overview -->
                <div v-else-if="coursesStore.currentTheme" class="theme-container">
                    <v-card class="theme-card" rounded="xl">
                        <v-card-title class="theme-header">
                            <div class="d-flex align-center flex-grow-1">
                                <v-icon color="secondary" size="32" class="mr-4">mdi-folder</v-icon>
                                <div>
                                    <h2 class="text-h5 font-weight-bold mb-1">{{ coursesStore.currentTheme.name }}</h2>
                                    <span class="text-caption text-grey">
                                        {{ coursesStore.currentTheme.materials.length }} material(s)
                                    </span>
                                </div>
                            </div>
                            <div v-if="isTeacher" class="d-flex">
                                <v-btn
                                    icon="mdi-pencil"
                                    variant="text"
                                    size="small"
                                    @click="showThemeEditDialog = true"
                                    class="mr-2"
                                ></v-btn>
                                <v-btn
                                    icon="mdi-plus"
                                    variant="text"
                                    size="small"
                                    color="primary"
                                    @click="showUploadDialog = true"
                                ></v-btn>
                            </div>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text v-if="coursesStore.currentTheme.description" class="pt-4">
                            <p class="text-body-1 text-grey-darken-1 mb-4">
                                {{ coursesStore.currentTheme.description }}
                            </p>
                        </v-card-text>
                        <v-card-text class="pt-0">
                            <v-row>
                                <v-col
                                    v-for="material in [...coursesStore.currentTheme.materials].sort((a, b) => a.order - b.order)"
                                    :key="material.id"
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-card
                                        class="material-card-item"
                                        rounded="lg"
                                        @click="coursesStore.selectMaterial(material.id)"
                                        :class="{
                                            'material-selected': coursesStore.selectedMaterialId === material.id,
                                        }"
                                    >
                                        <v-card-text>
                                            <div class="d-flex align-center mb-3">
                                                <v-avatar
                                                    size="48"
                                                    :color="getFileTypeColor(getFileTypeFromUrl(material.file))"
                                                    variant="flat"
                                                >
                                                    <v-icon
                                                        :icon="getFileTypeIcon(getFileTypeFromUrl(material.file))"
                                                        color="white"
                                                        size="24"
                                                    ></v-icon>
                                                </v-avatar>
                                                <v-chip
                                                    size="x-small"
                                                    :color="getFileTypeColor(getFileTypeFromUrl(material.file))"
                                                    variant="flat"
                                                    class="ml-auto"
                                                >
                                                    {{ getFileTypeFromUrl(material.file).toUpperCase() }}
                                                </v-chip>
                                            </div>
                                            <h3 class="text-subtitle-1 font-weight-bold mb-1">{{ material.name }}</h3>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col v-if="coursesStore.currentTheme.materials.length === 0" cols="12">
                                    <v-card class="empty-materials">
                                        <v-card-text class="text-center py-8">
                                            <v-icon size="64" color="grey-lighten-1" class="mb-2">
                                                mdi-file-document-outline
                                            </v-icon>
                                            <p class="text-body-1 text-grey">No materials in this theme</p>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </div>

                <!-- Course Overview -->
                <div v-else-if="coursesStore.currentCourse" class="course-container">
                    <v-card class="course-card" rounded="xl">
                        <v-card-title class="course-header">
                            <div class="d-flex align-center flex-grow-1">
                                <v-icon color="primary" size="36" class="mr-4">mdi-book-open-variant</v-icon>
                                <div>
                                    <h2 class="text-h4 font-weight-bold mb-1">
                                        {{ coursesStore.currentCourse.name }}
                                    </h2>
                                    <span class="text-body-2 text-grey">
                                        {{ coursesStore.currentCourse.themes.length }} theme(s)
                                    </span>
                                </div>
                            </div>
                            <v-btn
                                v-if="isTeacher"
                                icon="mdi-pencil"
                                variant="text"
                                size="small"
                                @click="showCourseEditDialog = true"
                            ></v-btn>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="pt-4">
                            <v-row>
                                <v-col
                                    v-for="theme in coursesStore.currentCourse.themes"
                                    :key="theme.id"
                                    cols="12"
                                    md="6"
                                >
                                    <v-card
                                        class="theme-card-item"
                                        rounded="lg"
                                        @click="coursesStore.selectTheme(theme.id)"
                                        :class="{ 'theme-selected': coursesStore.selectedThemeId === theme.id }"
                                    >
                                        <v-card-text>
                                            <div class="d-flex align-center mb-3">
                                                <v-icon color="secondary" size="32" class="mr-3">mdi-folder</v-icon>
                                                <h3 class="text-h6 font-weight-bold flex-grow-1">{{ theme.name }}</h3>
                                            </div>
                                            <p v-if="theme.description" class="text-body-2 text-grey-darken-1 mb-3">
                                                {{ theme.description }}
                                            </p>
                                            <v-chip size="small" color="primary" variant="flat">
                                                {{ theme.materials.length }} material(s)
                                            </v-chip>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col v-if="coursesStore.currentCourse.themes.length === 0" cols="12">
                                    <v-card class="empty-themes">
                                        <v-card-text class="text-center py-8">
                                            <v-icon size="64" color="grey-lighten-1" class="mb-2">
                                                mdi-folder-outline
                                            </v-icon>
                                            <p class="text-body-1 text-grey">No themes in this course</p>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </div>

                <!-- Loading State -->
                <v-card v-if="coursesStore.loading" class="loading-card" rounded="xl">
                    <v-card-text class="text-center pa-12">
                        <v-progress-circular indeterminate color="primary" size="64" width="4"></v-progress-circular>
                        <p class="mt-6 text-body-1 text-grey">Loading courses...</p>
                    </v-card-text>
                </v-card>

                <!-- Error State -->
                <v-alert
                    v-if="coursesStore.error"
                    type="error"
                    variant="tonal"
                    rounded="lg"
                    class="error-alert"
                    prominent
                >
                    <v-alert-title>Error loading courses</v-alert-title>
                    {{ coursesStore.error }}
                </v-alert>
            </v-container>
        </div>

        <!-- Dialogs -->
        <MaterialUploadDialog
            v-model="showUploadDialog"
            :theme="coursesStore.currentTheme"
            @upload="handleUploadMaterial"
        />
        <MaterialEditDialog
            v-model="showMaterialEditDialog"
            :material="coursesStore.currentMaterial"
            @save="handleEditMaterial"
        />
        <ThemeEditDialog
            v-model="showThemeEditDialog"
            :theme="coursesStore.currentTheme"
            @save="handleEditTheme"
        />
        <CourseEditDialog
            v-model="showCourseEditDialog"
            :course="coursesStore.currentCourse"
            @save="handleEditCourse"
        />
    </div>
</template>

<style scoped>
.courses-view {
    display: flex;
    height: 100%;
    overflow: hidden;
    background: #f5f7fa;
    width: 100%;
}

.content-area {
    flex: 1;
    background: #f5f7fa;
    padding-top: 0;
    overflow-y: auto;
    min-width: 0;
}

.content-area .v-container {
    padding: 24px !important;
}

/* Welcome Banner */
.welcome-banner {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 280px;
    position: relative;
    overflow: hidden;
}

.banner-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 48px;
    position: relative;
    z-index: 1;
}

.banner-text {
    flex: 1;
    max-width: 600px;
}

.banner-title {
    font-size: 36px;
    font-weight: 700;
    color: white;
    margin-bottom: 16px;
    line-height: 1.2;
}

.banner-subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 32px;
    line-height: 1.6;
}

.banner-actions {
    display: flex;
    gap: 16px;
}

.banner-btn {
    padding: 12px 32px;
    font-weight: 600;
}

.banner-decoration {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    opacity: 0.2;
}

/* Statistics Cards */
.stat-card {
    transition: transform 0.2s;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    margin-bottom: 16px;
}

.stat-card:hover {
    transform: translateY(-2px);
    border-color: #bdbdbd;
}

.stat-card .v-card-text {
    padding: 20px !important;
}

.stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-icon-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon-success {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-icon-info {
    background: linear-gradient(135deg, #2196f3 0%, #21cbf3 100%);
}

.stat-icon-warning {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1;
}

.stat-label {
    font-size: 14px;
    color: #6c757d;
    margin-top: 4px;
}

/* Section Header */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.section-title {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
}

/* Course Cards */
.course-card-modern {
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    margin-bottom: 16px;
}

.course-card-modern:hover {
    transform: translateY(-2px);
    border-color: #bdbdbd;
}

.course-card-modern .v-card-text {
    padding: 16px !important;
}

.course-card-image {
    position: relative;
    height: 160px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.course-tag {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #667eea;
}

.course-image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
}

.course-card-title {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
    line-height: 1.3;
}

.course-card-subtitle {
    font-size: 14px;
    color: #6c757d;
    margin-bottom: 12px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.course-card-footer {
    display: flex;
    align-items: center;
    margin-top: 12px;
}

/* Material/Theme Cards */
.material-container,
.theme-container,
.course-container {
    max-width: 1400px;
    margin: 0 auto;
}

.material-card,
.theme-card,
.course-card {
    background: #ffffff;
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;
}

.material-header,
.theme-header,
.course-header {
    padding: 20px 24px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(255, 255, 255, 1) 100%);
    border-bottom: 1px solid #e0e0e0;
}

.material-card-item,
.theme-card-item {
    cursor: pointer;
    transition: all 0.2s ease;
    height: 100%;
    border: 1px solid #e0e0e0;
    margin-bottom: 16px;
}

.material-card-item:hover,
.theme-card-item:hover {
    transform: translateY(-2px);
    border-color: #bdbdbd;
}

.material-card-item .v-card-text,
.theme-card-item .v-card-text {
    padding: 16px !important;
}

.material-selected,
.theme-selected {
    border: 2px solid #667eea !important;
    background-color: rgba(102, 126, 234, 0.05);
}

.empty-courses,
.empty-materials,
.empty-themes,
.loading-card {
    max-width: 800px;
    margin: 48px auto;
    background: white;
    border: 1px solid #e0e0e0;
}

.error-alert {
    max-width: 1200px;
    margin: 24px auto;
}
</style>
