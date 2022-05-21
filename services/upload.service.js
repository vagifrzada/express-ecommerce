const path = require("path")

async function upload(params) {
    const { filesBag, property, uploadDir } = params
    if (!filesBag[property]) {
        return false
    }

    const file = filesBag[property]
    const fileName = await generateFileName(file)
    const rootDir = path.dirname(require.main.filename)
    const target = path.join(rootDir, uploadDir, fileName)

    console.log(`Uploading file to: ${target}`)

    if (typeof file.mv !== "function") {
        throw new Error("Can't upload file, upload logic wasn't provided")
    }

    file.mv(target)

    return {
        fileName,
        fileRelativeUrl: `${uploadDir}/${fileName}`,
    }
}

async function generateFileName(file) {
    return `${Date.now()}-${file.md5}${path.extname(file.name)}`
}

module.exports = {
    upload,
}
