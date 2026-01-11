<script setup lang="ts">
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Video,
  Image,
  FileText,
  Play,
} from "lucide-vue-next";

interface TestResult {
  name: string;
  status: "passed" | "failed" | "skipped";
  duration: number;
}

interface ArtifactDetails {
  runId: number;
  artifactId: number;
  name: string;
  createdAt: string;
  expiresAt: string;
  videos: string[];
  screenshots: string[];
  testResults: TestResult[];
  htmlReportAvailable: boolean;
}

const route = useRoute();
const runId = route.params.runId as string;

useSeoMeta({
  title: `Test Run #${runId} - E2E Artifacts - haex.space`,
  description: "View test videos, screenshots, and results.",
});

const { data, pending, error } = await useFetch<ArtifactDetails>(
  `/api/e2e-artifacts/${runId}`
);

const selectedVideo = ref<string | null>(null);
const selectedScreenshot = ref<string | null>(null);

const isVideoModalOpen = computed({
  get: () => selectedVideo.value !== null,
  set: (value: boolean) => {
    if (!value) selectedVideo.value = null;
  },
});

const isScreenshotModalOpen = computed({
  get: () => selectedScreenshot.value !== null,
  set: (value: boolean) => {
    if (!value) selectedScreenshot.value = null;
  },
});

function getFileUrl(path: string) {
  return `/api/e2e-artifacts/${runId}/file?path=${encodeURIComponent(path)}`;
}

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function getTestStatusIcon(status: string) {
  switch (status) {
    case "passed":
      return CheckCircle;
    case "failed":
      return XCircle;
    default:
      return Clock;
  }
}

function getTestStatusClass(status: string) {
  switch (status) {
    case "passed":
      return "text-green-500";
    case "failed":
      return "text-red-500";
    default:
      return "text-yellow-500";
  }
}

function getVideoName(path: string) {
  return path.split("/").pop() || path;
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Back button -->
    <NuxtLink to="/developer/e2e-artifacts" class="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
      <ArrowLeft class="h-4 w-4 mr-2" />
      Back to all runs
    </NuxtLink>

    <!-- Loading state -->
    <div v-if="pending" class="flex items-center justify-center min-h-[50vh]">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <XCircle class="h-12 w-12 mx-auto text-destructive" />
      <p class="mt-4 text-muted-foreground">
        Failed to load artifact details: {{ error.message }}
      </p>
    </div>

    <div v-else-if="data" class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold">Test Run #{{ runId }}</h1>
        <p class="text-muted-foreground mt-1">
          {{ data.name }}
        </p>
        <p class="text-sm text-muted-foreground mt-2">
          Expires: {{ new Date(data.expiresAt).toLocaleDateString() }}
        </p>
      </div>

      <!-- Test Results Summary -->
      <Card v-if="data.testResults.length > 0">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <FileText class="h-5 w-5" />
            Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="(test, idx) in data.testResults"
              :key="idx"
              class="flex items-center justify-between p-2 rounded hover:bg-muted/50"
            >
              <div class="flex items-center gap-2">
                <component
                  :is="getTestStatusIcon(test.status)"
                  :class="['h-4 w-4', getTestStatusClass(test.status)]"
                />
                <span class="text-sm">{{ test.name }}</span>
              </div>
              <span class="text-sm text-muted-foreground">
                {{ formatDuration(test.duration) }}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Videos -->
      <Card v-if="data.videos.length > 0">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Video class="h-5 w-5" />
            Videos ({{ data.videos.length }})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="video in data.videos"
              :key="video"
              class="relative group cursor-pointer rounded-lg overflow-hidden bg-muted aspect-video"
              @click="selectedVideo = video"
            >
              <div class="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors">
                <Play class="h-12 w-12 text-white" />
              </div>
              <p class="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-white text-xs truncate">
                {{ getVideoName(video) }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Screenshots -->
      <Card v-if="data.screenshots.length > 0">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Image class="h-5 w-5" />
            Screenshots ({{ data.screenshots.length }})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="screenshot in data.screenshots"
              :key="screenshot"
              class="cursor-pointer rounded-lg overflow-hidden bg-muted"
              @click="selectedScreenshot = screenshot"
            >
              <img
                :src="getFileUrl(screenshot)"
                :alt="screenshot"
                class="w-full h-auto object-cover aspect-video"
                loading="lazy"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- No artifacts -->
      <div v-if="data.videos.length === 0 && data.screenshots.length === 0" class="text-center py-12">
        <FileText class="h-12 w-12 mx-auto text-muted-foreground/50" />
        <p class="mt-4 text-muted-foreground">
          No video or screenshot artifacts found for this run.
        </p>
      </div>
    </div>

    <!-- Video Modal -->
    <Dialog v-model:open="isVideoModalOpen">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{{ selectedVideo ? getVideoName(selectedVideo) : '' }}</DialogTitle>
        </DialogHeader>
        <div v-if="selectedVideo" class="mt-4">
          <video
            :src="getFileUrl(selectedVideo)"
            controls
            autoplay
            class="w-full rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>

    <!-- Screenshot Modal -->
    <Dialog v-model:open="isScreenshotModalOpen">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Screenshot</DialogTitle>
        </DialogHeader>
        <div v-if="selectedScreenshot" class="mt-4">
          <img
            :src="getFileUrl(selectedScreenshot)"
            alt="Screenshot"
            class="w-full rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
