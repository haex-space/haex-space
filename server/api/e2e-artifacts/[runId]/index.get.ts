import { Octokit } from "@octokit/rest";
import JSZip from "jszip";

const REPO_OWNER = "haex-space";
const REPO_NAME = "haex-vault";

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

export default defineEventHandler(async (event) => {
  const runId = getRouterParam(event, "runId");

  if (!runId) {
    throw createError({
      statusCode: 400,
      message: "Missing run ID",
    });
  }

  // No auth needed for public repos
  const octokit = new Octokit();

  try {
    // Get artifacts for this run
    const { data: artifactsData } =
      await octokit.actions.listWorkflowRunArtifacts({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        run_id: parseInt(runId),
      });

    const e2eArtifact = artifactsData.artifacts.find((a) =>
      a.name.startsWith("e2e-artifacts-")
    );

    if (!e2eArtifact) {
      throw createError({
        statusCode: 404,
        message: "No E2E artifacts found for this run",
      });
    }

    // Download and analyze the artifact
    const { data: downloadData } = await octokit.actions.downloadArtifact({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      artifact_id: e2eArtifact.id,
      archive_format: "zip",
    });

    // Parse the zip to get file listing
    const zip = await JSZip.loadAsync(downloadData as ArrayBuffer);
    const files = Object.keys(zip.files);

    const videos = files.filter(
      (f) => f.endsWith(".webm") || f.endsWith(".mp4")
    );
    const screenshots = files.filter(
      (f) => f.endsWith(".png") || f.endsWith(".jpg")
    );
    const htmlReportAvailable = files.some((f) => f.includes("html-report"));

    // Try to parse test results
    let testResults: TestResult[] = [];
    const resultsFile = zip.file("results.json");
    if (resultsFile) {
      try {
        const resultsJson = await resultsFile.async("string");
        const results = JSON.parse(resultsJson);
        // Extract test results from Playwright JSON format
        if (results.suites) {
          for (const suite of results.suites) {
            for (const spec of suite.specs || []) {
              testResults.push({
                name: `${suite.title} > ${spec.title}`,
                status: spec.ok ? "passed" : "failed",
                duration: spec.tests?.[0]?.results?.[0]?.duration || 0,
              });
            }
          }
        }
      } catch {
        // Ignore parsing errors
      }
    }

    const details: ArtifactDetails = {
      runId: parseInt(runId),
      artifactId: e2eArtifact.id,
      name: e2eArtifact.name,
      createdAt: e2eArtifact.created_at || "",
      expiresAt: e2eArtifact.expires_at || "",
      videos,
      screenshots,
      testResults,
      htmlReportAvailable,
    };

    return details;
  } catch (error: unknown) {
    if ((error as { statusCode?: number }).statusCode) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 500,
      message: `Failed to fetch artifact details: ${message}`,
    });
  }
});
