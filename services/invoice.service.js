const {
    constants: fsConstants,
    promises: fsPromise,
    createReadStream,
    createWriteStream,
} = require("fs")

const path = require("path")
const INVOICE_STORAGE = path.join(__dirname, "..", "storage", "invoices")
const PDFDocument = require("pdfkit")

async function generate(params) {
    const doc = new PDFDocument()
    const { order } = params
    const fileName = `invoice-${order._id}.pdf`

    try {
        await fsPromise.access(INVOICE_STORAGE)
    } catch (err) {
        await fsPromise.mkdir(INVOICE_STORAGE, { recursive: true })
    }

    doc.pipe(createWriteStream(path.join(INVOICE_STORAGE, fileName)))
    doc.fontSize(26).text("Invoice")
    doc.fontSize(20).text(`Order id: #${order._id}`, { underline: true })
    doc.text("Products:")

    let totalPrice = 0
    const productList = order.items.map((item) => {
        totalPrice += item.quantity * item.product.price
        let subtotal = item.quantity * item.product.price
        return `Product name: ${item.product.name}, Qty: (${item.quantity}), Subtotal: ${subtotal}`
    })

    console.log("Product list", productList)
    console.log("Total price: " + totalPrice.toFixed(2))

    doc.fontSize(15).list(productList)
    doc.fontSize(26).text(`Total price: $${totalPrice.toFixed(2)}`)
    doc.end()
}

async function download(params) {
    const { order, res } = params
    const invoiceFileName = `invoice-${order._id}.pdf`
    const invoiceFilePath = path.join(INVOICE_STORAGE, invoiceFileName)

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
        console.log(err)
        throw err
    }
}

module.exports = {
    generate,
    download,
}
