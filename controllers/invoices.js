const {
    constants: fsConstants,
    promises: fsPromise,
    createReadStream,
} = require("fs")
const path = require("path")

async function download(req, res) {
    const orderId = req.params.orderId
    const invoiceFileName = `invoice-${orderId}.pdf`
    const invoiceFilePath = path.join(
        __dirname,
        "..",
        "storage",
        "invoices",
        invoiceFileName
    )

    try {
        await fsPromise.access(invoiceFilePath, fsConstants.R_OK) // Check if file exists
        // const data = await fsPromise.readFile(invoiceFilePath)
        const readStream = createReadStream(invoiceFilePath)
        const writeStream = res
            .setHeader("Content-Type", "application/pdf")
            .setHeader(
                "Content-Disposition",
                `attachment; filename="${invoiceFileName}"`
            )
        return readStream.pipe(writeStream)
    } catch (err) {
        throw err
    }
}

module.exports = {
    download,
}
