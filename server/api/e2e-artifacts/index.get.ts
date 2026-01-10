import { Octokit } from "@octokit/rest";

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
  artifacts: {
    id: number;
    name: string;
    sizeInBytes: number;
    expiresAt: string;
  }[];
  htmlUrl: string;
}

const REPO_OWNER = "haex-space";
const REPO_NAME = "haex-e2e-tests";

export default defineEventHandler(async () => {
  // No auth needed for public repos (60 requests/hour rate limit)
  const octokit = new Octokit();

  try {
    // Get recent workflow runs
    const { data: workflowRuns } = await octokit.actions.listWorkflowRuns({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      workflow_id: "e2e-tests.yml",
      per_page: 20,
    });

    const runs: ArtifactRun[] = [];

    for (const run of workflowRuns.workflow_runs) {
      // Get artifacts for this run
      const { data: artifactsData } =
        await octokit.actions.listWorkflowRunArtifacts({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          run_id: run.id,
        });

      // Only include runs that have e2e artifacts
      const e2eArtifacts = artifactsData.artifacts.filter((a) =>
        a.name.startsWith("e2e-artifacts-")
      );

      if (e2eArtifacts.length > 0) {
        runs.push({
          id: run.id,
          name: run.name || "E2E Tests",
          workflowName: run.workflow_id.toString(),
          status:
            run.status === "completed"
              ? run.conclusion === "success"
                ? "success"
                : "failure"
              : "in_progress",
          conclusion: run.conclusion,
          createdAt: run.created_at,
          updatedAt: run.updated_at,
          branch: run.head_branch || "unknown",
          commit: run.head_sha.substring(0, 7),
          commitMessage: run.head_commit?.message || "",
          artifacts: e2eArtifacts.map((a) => ({
            id: a.id,
            name: a.name,
            sizeInBytes: a.size_in_bytes,
            expiresAt: a.expires_at || "",
          })),
          htmlUrl: run.html_url,
        });
      }
    }

    return {
      runs,
      total: runs.length,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw createError({
      statusCode: 500,
      message: `Failed to fetch artifacts: ${message}`,
    });
  }
});
