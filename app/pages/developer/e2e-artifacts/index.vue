<script setup lang="ts">
import {
  FlaskConical,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-vue-next";

interface Artifact {
  id: number;
  name: string;
  sizeInBytes: number;
  expiresAt: string;
}

interface ArtifactRun {
  id: number;
  name: string;
  workflowName: string;
  status: "success" | "failure" | "cancelled" | "in_progress";
  conclusion: string | null;
  createdAt: string;
  updatedAt: string;
  branch: string;
  commit: string;
  commitMessage: string;
  artifacts: Artifact[];
  htmlUrl: string;
}

useSeoMeta({
  title: "E2E Test Artifacts - haex.space",
  description: "View E2E test results, videos, and screenshots.",
});

const { data, pending, error, refresh } = await useFetch<{
  runs: ArtifactRun[];
  total: number;
}>("/api/e2e-artifacts");

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "success":
      return CheckCircle;
    case "failure":
      return XCircle;
    default:
      return Clock;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "success":
      return "text-green-500";
    case "failure":
      return "text-red-500";
    default:
      return "text-yellow-500";
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="pending" class="flex items-center justify-center min-h-[50vh]">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <XCircle class="h-12 w-12 mx-auto text-destructive" />
      <p class="mt-4 text-muted-foreground">
        Failed to load artifacts: {{ error.message }}
      </p>
      <Button variant="outline" class="mt-4" @click="refresh()">
        Try Again
      </Button>
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">E2E Test Artifacts</h1>
          <p class="text-muted-foreground mt-1">
            View test results, videos, and screenshots from CI/CD pipeline runs.
          </p>
        </div>
        <Button variant="outline" @click="refresh()">
          <Loader2 v-if="pending" class="h-4 w-4 mr-2 animate-spin" />
          Refresh
        </Button>
      </div>

      <!-- Runs List -->
      <Card>
        <CardContent class="p-0">
          <!-- Empty State -->
          <div v-if="!data?.runs?.length" class="text-center py-12">
            <FlaskConical class="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p class="mt-4 text-muted-foreground">
              No E2E test runs found. Run the E2E tests in the GitHub Actions pipeline to see artifacts here.
            </p>
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b">
                <tr class="text-left text-sm text-muted-foreground">
                  <th class="p-4 font-medium">Status</th>
                  <th class="p-4 font-medium">Run</th>
                  <th class="p-4 font-medium hidden md:table-cell">Branch</th>
                  <th class="p-4 font-medium hidden lg:table-cell">Date</th>
                  <th class="p-4 font-medium hidden md:table-cell">Artifacts</th>
                  <th class="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr
                  v-for="run in data.runs"
                  :key="run.id"
                  class="hover:bg-muted/50"
                >
                  <td class="p-4">
                    <component
                      :is="getStatusIcon(run.status)"
                      :class="['h-5 w-5', getStatusClass(run.status)]"
                    />
                  </td>
                  <td class="p-4">
                    <div class="min-w-0">
                      <p class="font-medium truncate">{{ run.name }}</p>
                      <p class="text-sm text-muted-foreground truncate">
                        {{ run.commit }} - {{ run.commitMessage.split('\n')[0] }}
                      </p>
                    </div>
                  </td>
                  <td class="p-4 hidden md:table-cell">
                    <Badge variant="secondary">{{ run.branch }}</Badge>
                  </td>
                  <td class="p-4 hidden lg:table-cell text-muted-foreground text-sm">
                    {{ formatDate(run.createdAt) }}
                  </td>
                  <td class="p-4 hidden md:table-cell">
                    <div class="flex items-center gap-2 text-sm text-muted-foreground">
                      <span v-for="artifact in run.artifacts" :key="artifact.id">
                        {{ formatSize(artifact.sizeInBytes) }}
                      </span>
                    </div>
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <NuxtLink :to="`/developer/e2e-artifacts/${run.id}`">
                        <Button variant="ghost" size="sm">
                          View
                          <ChevronRight class="h-4 w-4 ml-1" />
                        </Button>
                      </NuxtLink>
                      <a :href="run.htmlUrl" target="_blank" rel="noopener">
                        <Button variant="ghost" size="icon">
                          <ExternalLink class="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
