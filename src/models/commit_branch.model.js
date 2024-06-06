import db from "../connections/database.js";

export default class Commit_Branch {
    static async save(commit,branch) {
        try {
            await db.query("INSERT INTO commits_branches VALUES (DEFAULT,$1,$2)", [commit, branch])
        } catch(e) {
            console.error(e)
        }
    }
}
