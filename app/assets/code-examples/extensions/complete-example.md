```vue
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useHaexVaultSdk } from '@haex-space/vault-sdk/vue'
import manifest from '../haextension/manifest.json'

interface Password {
  id: string
  title: string
  username: string | null
  password: string
  url: string | null
  created_at: string
}

const { client, isSetupComplete, context, getTableName, storage } = useHaexVaultSdk({
  manifest,
  debug: import.meta.env.DEV
})

const passwords = ref<Password[]>([])
const newPassword = ref({ title: '', username: '', password: '', url: '' })
const loading = ref(true)

// Migrations
const migrations = [
  {
    name: '0001_initial',
    sql: `
      CREATE TABLE IF NOT EXISTS ${getTableName('passwords')} (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        username TEXT,
        password TEXT NOT NULL,
        url TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `
  }
]

// Setup hook - runs once after initialization
client.onSetup(async () => {
  await client.registerMigrationsAsync(manifest.version, migrations)
})

// Load data after setup complete
onMounted(async () => {
  await client.setupComplete()
  await loadPasswords()
  loading.value = false
})

async function loadPasswords() {
  passwords.value = await client.query<Password>(
    `SELECT * FROM ${getTableName('passwords')} ORDER BY created_at DESC`
  )
}

async function addPassword() {
  if (!newPassword.value.title || !newPassword.value.password) return

  await client.execute(
    `INSERT INTO ${getTableName('passwords')} (id, title, username, password, url) VALUES (?, ?, ?, ?, ?)`,
    [
      crypto.randomUUID(),
      newPassword.value.title,
      newPassword.value.username || null,
      newPassword.value.password,
      newPassword.value.url || null
    ]
  )

  newPassword.value = { title: '', username: '', password: '', url: '' }
  await loadPasswords()
}

async function deletePassword(id: string) {
  await client.execute(
    `DELETE FROM ${getTableName('passwords')} WHERE id = ?`,
    [id]
  )
  await loadPasswords()
}

async function exportPasswords() {
  const data = new TextEncoder().encode(JSON.stringify(passwords.value, null, 2))
  await client.filesystem.saveFileAsync(data, {
    defaultPath: 'passwords-export.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })
}

const isDark = computed(() => context.value?.theme === 'dark')
</script>

<template>
  <div :class="{ 'dark': isDark }" class="min-h-screen p-4">
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else>
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">My Password Manager</h1>
        <button @click="exportPasswords" class="btn btn-secondary">
          Export
        </button>
      </header>

      <!-- Add Password Form -->
      <form @submit.prevent="addPassword" class="card mb-6 p-4 space-y-4">
        <input v-model="newPassword.title" placeholder="Title" required class="input" />
        <input v-model="newPassword.username" placeholder="Username" class="input" />
        <input v-model="newPassword.password" type="password" placeholder="Password" required class="input" />
        <input v-model="newPassword.url" placeholder="URL" class="input" />
        <button type="submit" class="btn btn-primary w-full">Add Password</button>
      </form>

      <!-- Password List -->
      <div class="space-y-2">
        <div v-for="pwd in passwords" :key="pwd.id" class="card p-4 flex justify-between items-center">
          <div>
            <h3 class="font-semibold">{{ pwd.title }}</h3>
            <p class="text-sm text-muted">{{ pwd.username || 'No username' }}</p>
          </div>
          <button @click="deletePassword(pwd.id)" class="btn btn-danger btn-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
```
