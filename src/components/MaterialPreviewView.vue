<script setup lang="ts">
import type { Material } from '@/types/material'
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import mammoth from 'mammoth'
import { getFileTypeFromUrl } from '@/utils/fileUtils'
import { getToken } from '@/services/token'
import axios from 'axios'
import VueOfficePptx from '@vue-office/pptx'

const props = defineProps<{
    material: Material | null
}>()

const previewContent = ref<string>('')
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const pptxBlobUrl = ref<string | null>(null)

const fileType = computed(() => {
    if (!props.material) return null
    return getFileTypeFromUrl(props.material.file)
})

const getFileUrl = (fileUrl: string): string => {
    // If URL is absolute, return as is
    if (fileUrl.startsWith('http://')) {
        return fileUrl.replace('http://', 'https://')
    }
    if (fileUrl.startsWith('https://')) {
        return fileUrl
    }
    // If relative, prepend API base URL
    const apiBaseUrl = import.meta.env.VITE_API_URL || ''
    if (fileUrl.startsWith('/')) {
        return `${apiBaseUrl}${fileUrl}`
    }
    return `${apiBaseUrl}/${fileUrl}`
}

const loadDocument = async () => {
    if (!props.material) {
        previewContent.value = ''
        loading.value = false
        return
    }

    loading.value = true
    error.value = null
    previewContent.value = ''

    try {
        const fileUrl = getFileUrl(props.material.file)
        const type = fileType.value

        if (!type || type === 'unknown') {
            error.value = `Unknown file type for: ${props.material.file}`
            previewContent.value = `<p>Unknown file type. <a href="${fileUrl}" target="_blank">Download file</a></p>`
            return
        }

        console.log('Loading material:', props.material.name, 'Type:', type, 'URL:', fileUrl)

        const token = getToken()
        const headers: Record<string, string> = {}
        if (token) {
            headers['Authorization'] = `Token ${token}`
        }

        if (type === 'docx') {
            const response = await axios.get(fileUrl, {
                responseType: 'arraybuffer',
                headers,
            })
            const arrayBuffer = response.data
            const result = await mammoth.convertToHtml({ arrayBuffer })
            previewContent.value = result.value
            if (result.messages.length > 0) {
                console.warn('Document conversion warnings:', result.messages)
            }
        } else if (type === 'pdf') {
            // For PDF, use the URL directly (it's already absolute from API)
            previewContent.value = `<iframe src="${fileUrl}" width="100%" height="800px" style="border: none;"></iframe>`
        } else if (type === 'pptx') {
            // For PPTX, create a blob URL with authentication
            try {
                // Clean up previous blob URL if exists
                if (pptxBlobUrl.value) {
                    URL.revokeObjectURL(pptxBlobUrl.value)
                    pptxBlobUrl.value = null
                }

                const response = await axios.get(fileUrl, {
                    responseType: 'blob',
                    headers,
                })
                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                })
                pptxBlobUrl.value = URL.createObjectURL(blob)
                // Set a flag to indicate PPTX is ready
                previewContent.value = 'PPTX_READY'
            } catch (pptxErr) {
                console.error('Error loading PPTX:', pptxErr)
                error.value = 'Failed to load PowerPoint presentation'
                previewContent.value = `<p>Failed to load presentation. <a href="${fileUrl}" target="_blank" download>Download file</a></p>`
            }
        } else if (type === 'png' || type === 'jpg') {
            // For images, create a blob URL with authentication
            try {
                const response = await axios.get(fileUrl, {
                    responseType: 'blob',
                    headers,
                })
                const blob = new Blob([response.data], {
                    type: `image/${type === 'jpg' ? 'jpeg' : type}`,
                })
                const blobUrl = URL.createObjectURL(blob)
                previewContent.value = `<img src="${blobUrl}" alt="${props.material.name}" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e0e0e0;" />`
            } catch (imgErr) {
                // Fallback: try direct URL
                console.error('Error loading image:', imgErr)
                previewContent.value = `<img src="${fileUrl}" alt="${props.material.name}" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e0e0e0;" onerror="this.onerror=null; this.parentElement.innerHTML='<p>Failed to load image. <a href=\\'${fileUrl}\\' target=\\'_blank\\'>Download file</a></p>'" />`
            }
        } else {
            previewContent.value = `<p>Preview not available for this file type. <a href="${fileUrl}" target="_blank" download>Download file</a></p>`
        }
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to load document'
        console.error('Error loading document:', err)
        previewContent.value = `<p class="error-message">Failed to load document. <a href="${getFileUrl(props.material?.file || '')}" target="_blank">Download file</a></p>`
    } finally {
        loading.value = false
    }
}

watch(
    () => props.material?.id,
    () => {
        // Clean up previous blob URL when material changes
        if (pptxBlobUrl.value) {
            URL.revokeObjectURL(pptxBlobUrl.value)
            pptxBlobUrl.value = null
        }
        loadDocument()
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    // Clean up blob URL on component unmount
    if (pptxBlobUrl.value) {
        URL.revokeObjectURL(pptxBlobUrl.value)
    }
})
</script>

<template>
    <div class="material-preview">
        <v-progress-linear
            v-if="loading"
            indeterminate
            color="primary"
            height="4"
            class="loading-bar"
        ></v-progress-linear>
        <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            rounded="lg"
            class="error-alert ma-4"
            prominent
        >
            <v-alert-title>Error loading document</v-alert-title>
            {{ error }}
        </v-alert>
        <div
            v-if="!loading && !error && previewContent && fileType !== 'pptx'"
            class="preview-content"
        >
            <div v-if="fileType === 'docx'" v-html="previewContent" class="docx-content"></div>
            <div
                v-else-if="fileType === 'png' || fileType === 'jpg'"
                v-html="previewContent"
                class="image-content"
            ></div>
            <div v-else v-html="previewContent" class="other-content"></div>
        </div>
        <div
            v-if="!loading && !error && fileType === 'pptx' && pptxBlobUrl"
            class="preview-content pptx-content"
        >
            <VueOfficePptx :src="pptxBlobUrl" style="height: 600px" />
        </div>
        <v-card
            v-if="!loading && !error && !previewContent && !pptxBlobUrl && material"
            class="text-center pa-12 empty-preview"
        >
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-file-document-outline</v-icon>
            <p class="text-h6 text-grey">Preview not available</p>
            <v-btn
                :href="material?.file"
                target="_blank"
                color="primary"
                variant="outlined"
                class="mt-4"
            >
                Download File
            </v-btn>
        </v-card>
        <v-card
            v-if="!loading && !error && !previewContent && !material"
            class="text-center pa-12 empty-preview"
        >
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-file-document-outline</v-icon>
            <p class="text-h6 text-grey">No material selected</p>
        </v-card>
    </div>
</template>

<style scoped>
.material-preview {
    min-height: 400px;
    overflow-y: auto;
    background: #fafafa;
}

.loading-bar {
    position: sticky;
    top: 0;
    z-index: 10;
}

.error-alert {
    margin: 16px;
}

.preview-content {
    padding: 32px;
    max-width: 1000px;
    margin: 0 auto;
    background: #ffffff;
    min-height: 400px;
    border: 1px solid #e0e0e0;
}

.image-content {
    text-align: center;
}

.image-content {
    text-align: center;
}

.image-content img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
}

.pptx-content {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 16px;
}

.docx-content,
.other-content {
    line-height: 1.8;
    color: #333;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.docx-content :deep(h1),
.other-content :deep(h1) {
    font-size: 2em;
    font-weight: 600;
    margin: 24px 0 16px;
    color: #1a1a1a;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 8px;
}

.docx-content :deep(h2),
.other-content :deep(h2) {
    font-size: 1.5em;
    font-weight: 600;
    margin: 20px 0 12px;
    color: #2a2a2a;
}

.docx-content :deep(h3),
.other-content :deep(h3) {
    font-size: 1.25em;
    font-weight: 600;
    margin: 16px 0 8px;
    color: #3a3a3a;
}

.docx-content :deep(p),
.other-content :deep(p) {
    margin: 12px 0;
    line-height: 1.8;
}

.docx-content :deep(ul),
.docx-content :deep(ol),
.other-content :deep(ul),
.other-content :deep(ol) {
    margin: 12px 0;
    padding-left: 24px;
}

.docx-content :deep(li),
.other-content :deep(li) {
    margin: 6px 0;
}

.docx-content :deep(img),
.other-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 16px 0;
    border: 1px solid #e0e0e0;
}

.docx-content :deep(table),
.other-content :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 20px 0;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
}

.docx-content :deep(table td),
.docx-content :deep(table th),
.other-content :deep(table td),
.other-content :deep(table th) {
    border: 1px solid #e0e0e0;
    padding: 12px 16px;
    text-align: left;
}

.docx-content :deep(table th),
.other-content :deep(table th) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.875em;
    letter-spacing: 0.5px;
}

.docx-content :deep(table tr:nth-child(even)),
.other-content :deep(table tr:nth-child(even)) {
    background-color: #f8f9fa;
}

.docx-content :deep(table tr:hover),
.other-content :deep(table tr:hover) {
    background-color: #e3f2fd;
}

.docx-content :deep(blockquote),
.other-content :deep(blockquote) {
    border-left: 4px solid #2196f3;
    padding-left: 16px;
    margin: 16px 0;
    color: #666;
    font-style: italic;
}

.docx-content :deep(code),
.other-content :deep(code) {
    background-color: #f5f5f5;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
}

.docx-content :deep(pre),
.other-content :deep(pre) {
    background-color: #263238;
    color: #aed581;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
}

.docx-content :deep(a),
.other-content :deep(a) {
    color: #2196f3;
    text-decoration: none;
    transition: color 0.2s;
}

.docx-content :deep(a:hover),
.other-content :deep(a:hover) {
    color: #1976d2;
    text-decoration: underline;
}

.empty-preview {
    background: transparent;
}
</style>
