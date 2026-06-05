<script setup lang="ts">
const props = defineProps<{
  diagram: string
}>()

const colorMode = useColorMode()
const containerRef = ref<HTMLElement>()
const id = useId()
let seq = 0

async function render() {
  if (!containerRef.value) return
  const mermaid = (await import('mermaid')).default
  const theme = colorMode.value === 'dark' ? 'dark' : 'default'
  mermaid.initialize({ startOnLoad: false, theme, securityLevel: 'loose' })
  const { svg } = await mermaid.render(`m${id}-${++seq}`, props.diagram)
  containerRef.value.innerHTML = svg
}

onMounted(render)
watch(() => colorMode.value, render)
</script>

<template>
  <ClientOnly>
    <div ref="containerRef" class="overflow-x-auto" />
  </ClientOnly>
</template>
