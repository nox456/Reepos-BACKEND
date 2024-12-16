import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import * as Types from "../lib/types.js";
import { Worker } from "worker_threads";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Get all info of a git repository (commits, branches, contributors, etc)
 * @param {string} repoName - Repository name
 * @return {Promise<Types.RepoGitInfo>} Repository info object
 * @async
 * */
export default async function repoInfo(repoName) {
    const repoPath = join(__dirname, "../temp", repoName);
    const worker = new Worker(join(__dirname, "worker.js"), {
        workerData: { repoPath },
    });
    return new Promise(resolve => {
        worker.on("message", (msg) => {
            resolve(msg)
        });
    })
}
