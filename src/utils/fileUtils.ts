export type FileType = 'docx' | 'pdf' | 'pptx' | 'png' | 'jpg' | 'jpeg' | 'py' | 'unknown'

export const getFileTypeFromUrl = (fileUrl: string): FileType => {
    const url = fileUrl.toLowerCase()
    const extension = url.split('.').pop()?.split('?')[0] // Remove query params

    switch (extension) {
        case 'docx':
            return 'docx'
        case 'pdf':
            return 'pdf'
        case 'pptx':
            return 'pptx'
        case 'png':
            return 'png'
        case 'jpg':
        case 'jpeg':
            return 'jpg'
        case 'py':
            return 'py'
        default:
            return 'unknown'
    }
}

export const getFileTypeIcon = (fileType: FileType): string => {
    switch (fileType) {
        case 'pdf':
            return 'mdi-file-pdf-box'
        case 'docx':
            return 'mdi-file-word-box'
        case 'pptx':
            return 'mdi-file-powerpoint-box'
        case 'png':
        case 'jpg':
            return 'mdi-file-image'
        case 'py':
            return 'mdi-language-python'
        default:
            return 'mdi-file-document'
    }
}

export const getFileTypeColor = (fileType: FileType): string => {
    switch (fileType) {
        case 'pdf':
            return 'error'
        case 'docx':
            return 'info'
        case 'pptx':
        case 'py':
            return 'warning'
        case 'png':
        case 'jpg':
            return 'success'
        default:
            return 'grey'
    }
}
