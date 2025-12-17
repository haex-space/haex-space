<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Copy, Check } from 'lucide-vue-next'

const props = defineProps<{
  code?: string
  language?: string
  path?: string  // Path to markdown file (e.g., '/sdk/vue-setup')
}>()

const { copy, copied } = useClipboard({ copiedDuring: 2000 })

// Import all markdown files at build time using relative path from this file
const codeExamples = import.meta.glob<string>('../../assets/code-examples/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

// Build a map with simplified keys for easier lookup
const codeExampleMap = Object.fromEntries(
  Object.entries(codeExamples).map(([key, value]) => {
    // Extract path like '/sdk/vue-setup' from '../../assets/code-examples/sdk/vue-setup.md'
    const match = key.match(/code-examples(.+)\.md$/)
    return match ? [match[1], value] : [key, value]
  })
)

// Get markdown content from path
const markdownContent = computed(() => {
  if (props.path) {
    // path is like '/sdk/vue-setup', key in map is '/sdk/vue-setup'
    return codeExampleMap[props.path] || ''
  }
  if (props.code) {
    // For inline code, wrap it in markdown code block
    return `\`\`\`${props.language || 'text'}\n${props.code}\n\`\`\``
  }
  return ''
})

// Extract raw code for clipboard (without markdown backticks)
// Supports multiple code blocks - combines all of them
const rawCode = computed(() => {
  const content = markdownContent.value
  if (!content) return props.code || ''

  // Match all code blocks and extract their content
  const codeBlockRegex = /```\w*\n([\s\S]*?)\n```/g
  const matches = [...content.matchAll(codeBlockRegex)]

  if (matches.length === 0) {
    return content.trim()
  }

  // Combine all code blocks with newlines
  return matches.map(match => match[1].trim()).join('\n\n')
})

function handleCopy() {
  copy(rawCode.value)
}
</script>

<template>
  <div class="relative group rounded-lg border bg-muted/30 overflow-hidden">
    <div class="overflow-x-auto text-sm [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-transparent">
      <MDC :value="markdownContent" />
    </div>
    <button
      @click="handleCopy"
      class="absolute top-3 right-3 p-2 rounded-md bg-background/80 hover:bg-background border transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      :title="copied ? 'Copied!' : 'Copy code'"
    >
      <Check v-if="copied" class="w-4 h-4 text-green-500" />
      <Copy v-else class="w-4 h-4 text-muted-foreground" />
    </button>
  </div>
</template>
