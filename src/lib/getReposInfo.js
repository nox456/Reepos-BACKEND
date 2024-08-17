import simpleGit from "simple-git";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import execCommand from "./exec.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @typedef {Object} Commit
 * @property {string} hash - Commit hash
 * @property {string} title - Commit title
 * @property {string} author - Commit author
 * @property {string} content - Commit content
 * @property {string} created_at - Date of creation
 *
 * @typedef {Object} Branch
 * @property {string} name - Branch name
 * @property {string} type - Branch type
 *
 * @typedef {Object} File
 * @property {string} name - File name
 * @property {string} size - File size
 * @property {string} path - File path
 * @property {?string} content - File content
 *
 * @typedef {Object} Modification
 * @property {string} commit - Commit ID
 * @property {string} type - Modification type
 * @property {string} file - File ID
 *
 * @typedef {Object} RepoInfo
 * @property {Commit[]} commits - Repository commits
 * @property {string[]} contributors - Repository contributors
 * @property {Branch[]} branches - Repository branches
 * @property {File[]} files - Repository files
 * @property {Modification[]} modifications - Repository modifications
 * */
/**
 * Get all info of a git repository (commits, branches, contributors, etc)
 * @param {string} repoName - Repository name
 * @return {Promise<RepoInfo>} Repository info object
 * @async
 * */
export default async function repoInfo(repoName) {
    const repoPath = join(__dirname, "../temp", repoName)
    const git = simpleGit(repoPath);
    const commits = await git.log({
        format: {
            title: "%s",
            content: "%b",
            hash: "%H",
            author: "%an",
            created_at: "%ad",
        },
    });
    for (const commit of commits.all) {
        const branchesResult = await git.branch(["--contains", commit.hash]);
        commit.branches = Object.keys(branchesResult.branches);
    }
    const contributors = await git.log({
        format: { name: "%an" },
    });
    const branches = await git.branchLocal();

    const filesRaw = await git.raw("ls-tree", "-r", "--name-only", "HEAD");

    const filesPath = filesRaw.split("\n").filter((f) => f != "");

    const files = [];

    for (const path of filesPath) {
        const sizeText = await git.raw(
            "ls-tree",
            "-r",
            "--format=%(objectsize)",
            "HEAD",
            path == "" ? "." : path,
        );
        const sizeBytes = parseInt(
            sizeText.slice(0, sizeText.lastIndexOf("\\")),
        );
        let size;
        if (sizeBytes >= 1000000) {
            size = `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`;
        } else if (sizeBytes > 1000) {
            size = `${(sizeBytes / 1024).toFixed(1)} KB`;
        } else {
            size = `${sizeBytes} B`;
        }

        const ext = path.slice(path.lastIndexOf(".") + 1);
        const binExts = [
            "png",
            "jpg",
            "mp3",
            "mp4",
            "exe",
            "webp",
            "gif",
            "jpeg",
            "ico",
            "svg"
        ];
        let content;

        if (!binExts.includes(ext)) {
            content = await execCommand(`cat ${join(repoPath,path)}`)
        } else {
            content = null
        }

        files.push({
            name: path.slice(path.lastIndexOf("/") + 1),
            size,
            path,
            content
        });
    }
    const modifications = [];

    for (const commit of commits.all) {
        const resultRaw = await git.show([
            commit.hash,
            "--pretty=format:",
            "--name-status",
        ]);
        const files = resultRaw.split("\n").map((f) => f.split("\t"));
        for (const file of files) {
            if (file[0] == "A" || file[0] == "M" || file[0] == "D") {
                modifications.push({
                    commit: commit.hash,
                    type: file[0],
                    file: file[1],
                });
            }
        }
    }
    return {
        commits: commits.all,
        contributors: [...new Set(contributors.all.map((c) => c.name))],
        branches: branches.all.map((b) => {
            return {
                name: b,
                type: b == "master" || b == "main" ? "primary" : "secondary",
            };
        }),
        files,
        modifications,
    };
}
