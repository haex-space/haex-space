export function useSlug(initialValue = '') {
  const slug = ref(initialValue)
  const error = ref('')

  const isValid = computed(() => {
    if (!slug.value) return true
    return /^[a-z0-9-]+$/.test(slug.value)
  })

  function generate(source: string) {
    slug.value = source
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function setError(message: string) {
    error.value = message
  }

  function clearError() {
    error.value = ''
  }

  return {
    slug,
    error,
    isValid,
    generate,
    setError,
    clearError,
  }
}
