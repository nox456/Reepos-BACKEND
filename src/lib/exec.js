import {exec} from "child_process"

export default async function execCommand(command) {
    return new Promise((resolve,reject) => {
        exec(command,(err,stdout,stderr) => {
            if (err) return reject(err)
            if (stderr) return reject(err)
            return resolve(stdout)
        })
    })
}
