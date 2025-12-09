import JSZip from 'jszip'
import { verifyExtensionSignature, type ExtensionManifest, type ZipFileEntry } from '@haex-space/vault-sdk'
import { useDropZone } from '@vueuse/core'

/**
 * Compare two semver version strings
 * Returns: 1 if a > b, -1 if a < b, 0 if equal
 */
function compareSemver(a: string, b: string): number {
  const parseVersion = (v: string) => {
    const parts = v.replace(/^v/, '').split('.')
    return {
      major: parseInt(parts[0] || '0', 10),
      minor: parseInt(parts[1] || '0', 10),
      patch: parseInt(parts[2] || '0', 10),
    }
  }

  const vA = parseVersion(a)
  const vB = parseVersion(b)

  if (vA.major !== vB.major) return vA.major > vB.major ? 1 : -1
  if (vA.minor !== vB.minor) return vA.minor > vB.minor ? 1 : -1
  if (vA.patch !== vB.patch) return vA.patch > vB.patch ? 1 : -1
  return 0
}

export interface ExtensionUploadOptions {
  /** Optional public key to validate against (for version uploads) */
  expectedPublicKey?: Ref<string | undefined> | string
  /** Current version to compare against (for version uploads) */
  currentVersion?: Ref<string | undefined> | string
  /** Called when upload/processing starts */
  onStart?: () => void
  /** Called when upload completes successfully */
  onSuccess?: () => void
  /** Called when upload fails */
  onError?: (error: string) => void
}

export function useExtensionUpload(options: ExtensionUploadOptions = {}) {
  // Unwrap reactive options
  const getExpectedPublicKey = () => unref(options.expectedPublicKey)
  const getCurrentVersion = () => unref(options.currentVersion)
  const { t } = useI18n()

  // State
  const file = ref<File | null>(null)
  const manifest = ref<ExtensionManifest | null>(null)
  const iconUrl = ref<string | null>(null)
  const parseError = ref('')
  const isProcessing = ref(false)

  // Computed
  const isValid = computed(() => !!manifest.value && !!file.value)

  // Dropzone ref for VueUse
  const dropZoneRef = ref<HTMLElement>()
  const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop: (files: File[] | null) => {
      if (files?.[0]) {
        processFile(files[0])
      }
    },
  })

  // Process uploaded file
  async function processFile(uploadedFile: File) {
    // Reset state
    clear()
    isProcessing.value = true
    options.onStart?.()

    // Validate file extension
    if (!uploadedFile.name.endsWith('.xt')) {
      parseError.value = t('developer.extensions.new.upload.invalidFormat')
      isProcessing.value = false
      return
    }

    try {
      const zip = await JSZip.loadAsync(uploadedFile)

      // Read manifest.json from haextension folder
      const manifestFile = zip.file('haextension/manifest.json')
      if (!manifestFile) {
        parseError.value = t('developer.extensions.new.upload.noManifest')
        isProcessing.value = false
        return
      }

      const manifestContent = await manifestFile.async('string')
      const parsedManifest = JSON.parse(manifestContent) as ExtensionManifest

      // Validate required fields
      if (!parsedManifest.name || !parsedManifest.publicKey || !parsedManifest.version) {
        parseError.value = t('developer.extensions.new.upload.invalidManifest')
        isProcessing.value = false
        return
      }

      // Validate public key matches (for version uploads)
      const expectedKey = getExpectedPublicKey()
      if (expectedKey && parsedManifest.publicKey !== expectedKey) {
        parseError.value = t('developer.extensions.version.publicKeyMismatch')
        isProcessing.value = false
        return
      }

      // Validate version is higher than current (for version uploads)
      const currentVer = getCurrentVersion()
      if (currentVer && compareSemver(parsedManifest.version, currentVer) <= 0) {
        parseError.value = t('developer.extensions.version.versionTooLow', {
          current: currentVer,
          new: parsedManifest.version,
        })
        isProcessing.value = false
        return
      }

      // Verify cryptographic signature
      const files: ZipFileEntry[] = []
      for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
        if (!zipEntry.dir) {
          const content = await zipEntry.async('uint8array')
          files.push({ path: relativePath, content })
        }
      }

      const verifyResult = await verifyExtensionSignature(files, parsedManifest)
      if (!verifyResult.valid) {
        console.error('Signature verification failed:', verifyResult.error)
        parseError.value = t('developer.extensions.new.upload.invalidSignature')
        isProcessing.value = false
        return
      }

      // Extract icon - check multiple possible locations
      const iconName = parsedManifest.icon || 'favicon.ico'
      const iconFile = zip.file(iconName)
        || zip.file(`haextension/${iconName}`)
        || zip.file('favicon.ico')
        || zip.file('haextension/favicon.ico')

      if (iconFile) {
        const iconBlob = await iconFile.async('blob')
        const iconPath = iconName.toLowerCase()
        const mimeType = iconPath.endsWith('.svg') ? 'image/svg+xml'
          : iconPath.endsWith('.png') ? 'image/png'
          : iconPath.endsWith('.jpg') || iconPath.endsWith('.jpeg') ? 'image/jpeg'
          : iconPath.endsWith('.ico') ? 'image/x-icon'
          : iconPath.endsWith('.webp') ? 'image/webp'
          : 'image/png'
        iconUrl.value = URL.createObjectURL(new Blob([iconBlob], { type: mimeType }))
      }

      file.value = uploadedFile
      manifest.value = parsedManifest
    } catch (err) {
      console.error('Failed to parse extension:', err)
      parseError.value = t('developer.extensions.new.upload.parseError')
    } finally {
      isProcessing.value = false
    }
  }

  // Handle file input event
  function handleFileInput(e: Event) {
    const target = e.target as HTMLInputElement
    const selectedFile = target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  // Clear state
  function clear() {
    if (iconUrl.value) {
      URL.revokeObjectURL(iconUrl.value)
    }
    file.value = null
    manifest.value = null
    iconUrl.value = null
    parseError.value = ''
  }

  // Get icon as File for upload
  async function getIconFile(): Promise<File | null> {
    if (!iconUrl.value || !manifest.value) return null

    try {
      const response = await fetch(iconUrl.value)
      const blob = await response.blob()
      const iconFileName = manifest.value.icon || 'favicon.ico'
      return new File([blob], iconFileName, { type: blob.type })
    } catch {
      return null
    }
  }

  return {
    // State
    file,
    manifest,
    iconUrl,
    parseError,
    isProcessing,
    isValid,

    // Dropzone
    dropZoneRef,
    isOverDropZone,

    // Methods
    processFile,
    handleFileInput,
    clear,
    getIconFile,
  }
}
