import { Octokit } from "@octokit/rest";
import JSZip from "jszip";

const REPO_OWNER = "haex-space";
const REPO_NAME = "haex-vault";

export default defineEventHandler(async (event) => {
  const runId = getRouterParam(event, "runId");
  const query = getQuery(event);
  const filePath = query.path as string;

  if (!runId || !filePath) {
    throw createError({
      statusCode: 400,
      message: "Missing run ID or file path",
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
        message: "No E2E artifacts found",
      });
    }

    // Download the artifact
    const { data: downloadData } = await octokit.actions.downloadArtifact({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      artifact_id: e2eArtifact.id,
      archive_format: "zip",
    });

    // Extract the requested file
    const zip = await JSZip.loadAsync(downloadData as ArrayBuffer);
    const file = zip.file(filePath);

    if (!file) {
      throw createError({
        statusCode: 404,
        message: "File not found in artifact",
      });
    }

    const content = await file.async("nodebuffer");

    // Set content type based on extension
    if (filePath.endsWith(".webm")) {
      setHeader(event, "Content-Type", "video/webm");
    } else if (filePath.endsWith(".mp4")) {
      setHeader(event, "Content-Type", "video/mp4");
    } else if (filePath.endsWith(".png")) {
      setHeader(event, "Content-Type", "image/png");
    } else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
      setHeader(event, "Content-Type", "image/jpeg");
    } else if (filePath.endsWith(".html")) {
      setHeader(event, "Content-Type", "text/html");
    } else if (filePath.endsWith(".json")) {
      setHeader(event, "Content-Type", "application/json");
    }

    setHeader(event, "Content-Length", content.length.toString());
    setHeader(event, "Cache-Control", "public, max-age=86400");

    return content;
  } catch (error: unknown) {
    if ((error as { statusCode?: number }).statusCode) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 500,
      message: `Failed to fetch file: ${message}`,
    });
  }
});
