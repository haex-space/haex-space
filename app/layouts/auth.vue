<template>
  <div class="flex flex-col min-h-screen">
    <!-- Minimal Navigation -->
    <header class="border-b border-border">
      <nav class="container mx-auto px-4 h-16 flex items-center">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/logo.png" alt="haex.space" class="h-8 w-auto" />
        </NuxtLink>
      </nav>
    </header>

    <!-- Content -->
    <main class="flex-1 flex items-center justify-center p-4">
      <slot />
    </main>
  </div>
</template>
