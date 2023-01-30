const PDFDocument = require("pdfkit-table");
const fs = require('fs');

function getSalesReport(Details) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const data = Details.map(function (item, index) {
            return [index + 1, item.date, item.totalAmount, item.totalOrders, item.TotalProductsSold];
        });
        const table = {
            title: "Sales report",
            subtitle: "Sales report based on each month",
            headers: ["NO", "Month", "Amount", "Orders", "Proudcts Sold"],
            rows: data,
        };
        doc.table(table,);
        doc.pipe(fs.createWriteStream('./public/salesreport/report.pdf'));
        doc.end();
        resolve(true);
    })
}


module.exports = getSalesReport;
