<script setup lang="ts">
import { User, LogOut, Settings } from 'lucide-vue-next'
import { useMarketplaceStore } from '~/stores/marketplace'

const { t } = useI18n()
const localePath = useLocalePath()
const store = useMarketplaceStore()

async function handleLogout() {
  await store.signOut()
  await navigateTo(localePath('/developer/auth/login'))
}
</script>

<template>
  <DropdownMenu v-if="store.isAuthenticated">
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="gap-2">
        <User class="h-4 w-4" />
        <span class="hidden sm:inline-block max-w-32 truncate">
          {{ store.user?.email }}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-56">
      <DropdownMenuLabel>
        {{ store.user?.email }}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <NuxtLinkLocale to="/developer" class="flex items-center gap-2 cursor-pointer">
          <User class="h-4 w-4" />
          Dashboard
        </NuxtLinkLocale>
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <NuxtLinkLocale to="/developer/settings" class="flex items-center gap-2 cursor-pointer">
          <Settings class="h-4 w-4" />
          {{ t('developer.nav.settings') }}
        </NuxtLinkLocale>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleLogout" class="text-destructive focus:text-destructive cursor-pointer">
        <LogOut class="h-4 w-4 mr-2" />
        {{ t('developer.nav.logout') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
