<script setup lang="ts">
import {
  Loader2,
  Download,
  FolderPlus,
  LogIn,
  ChevronRight,
  FolderLock,
  CheckCircle2,
  RefreshCw,
  Trash2,
} from 'lucide-vue-next'
import { useVaultSyncStore } from '~/stores/vaultSync'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const localePath = useLocalePath()
const user = useSupabaseUser()
const vaultSyncStore = useVaultSyncStore()

useSeoMeta({
  title: 'Dashboard - haex.space',
  description: 'Manage your haex vaults and synchronization.',
})

// Fetch vaults automatically on mount and decrypt if password is available
onMounted(async () => {
  if (!vaultSyncStore.isConnected) {
    try {
      await vaultSyncStore.fetchVaults()
      // Auto-decrypt if password is available
      if (vaultSyncStore.serverPassword && !vaultSyncStore.isDecrypted) {
        await vaultSyncStore.decryptVaultNames(vaultSyncStore.serverPassword)
      }
    } catch (e) {
      console.error('Failed to fetch vaults:', e)
    }
  }
})

// Refresh vaults
async function handleRefresh() {
  try {
    await vaultSyncStore.fetchVaults()
  } catch (e) {
    console.error('Failed to refresh vaults:', e)
  }
}

// Delete vault
const deleteDialogOpen = ref(false)
const vaultToDelete = ref<{ vaultId: string; name: string } | null>(null)
const deleting = ref(false)

function openDeleteDialog(vaultId: string, name: string) {
  vaultToDelete.value = { vaultId, name }
  deleteDialogOpen.value = true
}

async function confirmDelete() {
  if (!vaultToDelete.value) return

  deleting.value = true
  try {
    await vaultSyncStore.deleteVault(vaultToDelete.value.vaultId)
    deleteDialogOpen.value = false
    vaultToDelete.value = null
  } catch (e) {
    console.error('Failed to delete vault:', e)
  } finally {
    deleting.value = false
  }
}

// Format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

// Onboarding steps
const onboardingSteps = computed(() => [
  {
    id: 'download',
    title: t('dashboard.onboarding.steps.download.title'),
    description: t('dashboard.onboarding.steps.download.description'),
    icon: Download,
    link: localePath('/download'),
    linkText: t('dashboard.onboarding.steps.download.action'),
    completed: false,
  },
  {
    id: 'createVault',
    title: t('dashboard.onboarding.steps.createVault.title'),
    description: t('dashboard.onboarding.steps.createVault.description'),
    icon: FolderPlus,
    completed: vaultSyncStore.vaultCount > 0,
  },
  {
    id: 'connect',
    title: t('dashboard.onboarding.steps.connect.title'),
    description: t('dashboard.onboarding.steps.connect.description'),
    icon: LogIn,
    completed: vaultSyncStore.isConnected && vaultSyncStore.vaultCount > 0,
  },
])
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold">{{ t('dashboard.title') }}</h1>
        <p class="text-muted-foreground mt-1">
          {{ t('dashboard.welcome') }}, {{ user?.email }}
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Onboarding Card -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <FolderLock class="h-5 w-5" />
                {{ t('dashboard.onboarding.title') }}
              </CardTitle>
              <CardDescription>
                {{ t('dashboard.onboarding.description') }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div
                  v-for="(step, index) in onboardingSteps"
                  :key="step.id"
                  class="flex gap-4"
                >
                  <!-- Step indicator -->
                  <div class="flex flex-col items-center">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-full"
                      :class="step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'"
                    >
                      <CheckCircle2 v-if="step.completed" class="h-5 w-5" />
                      <component v-else :is="step.icon" class="h-5 w-5" />
                    </div>
                    <div
                      v-if="index < onboardingSteps.length - 1"
                      class="h-full w-px bg-border my-2"
                    />
                  </div>

                  <!-- Step content -->
                  <div class="flex-1 pb-6">
                    <h3 class="font-medium">
                      {{ step.title }}
                    </h3>
                    <p class="text-sm text-muted-foreground mt-1">
                      {{ step.description }}
                    </p>
                    <NuxtLinkLocale v-if="step.link && !step.completed" :to="step.link" class="inline-block mt-3">
                      <Button size="sm" variant="outline">
                        {{ step.linkText }}
                        <ChevronRight class="h-4 w-4 ml-1" />
                      </Button>
                    </NuxtLinkLocale>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Vaults Section -->
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle>{{ t('dashboard.vaults.title') }}</CardTitle>
                  <CardDescription>
                    {{ t('dashboard.vaults.description') }}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  :disabled="vaultSyncStore.loading"
                  @click="handleRefresh"
                >
                  <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': vaultSyncStore.loading }" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <!-- Loading state -->
              <div v-if="vaultSyncStore.loading" class="flex items-center justify-center py-8">
                <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
              </div>

              <!-- Vaults list -->
              <div v-else-if="vaultSyncStore.vaults.length > 0" class="space-y-3">
                <div
                  v-for="vault in vaultSyncStore.vaults"
                  :key="vault.vaultId"
                  class="flex items-center gap-4 p-4 rounded-lg border bg-card"
                >
                  <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderLock class="h-5 w-5 text-primary" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium truncate">
                      {{ vault.decryptedName || `${vault.vaultId.slice(0, 8)}...` }}
                    </p>
                    <p class="text-sm text-muted-foreground">
                      {{ t('dashboard.vaults.createdAt') }}: {{ formatDate(vault.createdAt) }}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-muted-foreground hover:text-destructive"
                    @click="openDeleteDialog(vault.vaultId, vault.decryptedName || vault.vaultId.slice(0, 8))"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <!-- No vaults -->
              <div v-else class="text-center py-8">
                <FolderLock class="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p class="mt-4 text-muted-foreground">
                  {{ t('dashboard.vaults.empty') }}
                </p>
                <p class="text-sm text-muted-foreground mt-2">
                  {{ t('dashboard.vaults.emptyHint') }}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Account Info Card -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">{{ t('dashboard.account.title') }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-primary font-medium">
                    {{ user?.email?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ user?.email }}</p>
                  <p class="text-xs text-muted-foreground">
                    {{ t('dashboard.account.memberSince') }}
                    {{ user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-' }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Quick Links Card -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">{{ t('dashboard.quickLinks.title') }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <NuxtLinkLocale to="/download" class="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                <Download class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm">{{ t('dashboard.quickLinks.download') }}</span>
              </NuxtLinkLocale>
              <NuxtLinkLocale to="/docs" class="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                <FolderPlus class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm">{{ t('dashboard.quickLinks.docs') }}</span>
              </NuxtLinkLocale>
              <NuxtLinkLocale to="/marketplace" class="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                <FolderLock class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm">{{ t('dashboard.quickLinks.marketplace') }}</span>
              </NuxtLinkLocale>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{ t('dashboard.vaults.deleteDialog.title') }}</AlertDialogTitle>
          <AlertDialogDescription>
            {{ t('dashboard.vaults.deleteDialog.description', { name: vaultToDelete?.name }) }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="deleting">{{ t('common.cancel') }}</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            :disabled="deleting"
            @click="confirmDelete"
          >
            <Loader2 v-if="deleting" class="h-4 w-4 mr-2 animate-spin" />
            {{ t('dashboard.vaults.deleteDialog.confirm') }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
