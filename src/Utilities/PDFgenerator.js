import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const PDFgenerator = (headerData, data,billingDetails, totalAmount ) => {
    
    console.log(data);
    // Sample vendor data
    const vendorData = {
        vendorName: "Test vendor",
        vendorAddress: "14/203, Kallakulam, Seenapuram",
        vendorPinCode: "638057",
        contactPerson: "Santhosh D",
        contactPersonMobNo: "8993298712",
    };

    // Extract itemsData from billingDetails
    const itemsData = billingDetails?.map((item, index) => ({
        itemName: item.itemName,
        quantity: item.qty,
        uom: "Units", // Assuming UOM is "Units" for all items
        unitPrice: item.amount,
        total: item.netAmount,
    })) || [];

    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Set document properties
    pdf.setProperties({
        title: "Request For Quotation"
    });

    // Add images and text to the PDF
    const callImage = "/Calling.png";
    const imageUrl = "/aalam.png";
    pdf.addImage(imageUrl, 'JPEG', 10, 5, 40, 12);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');  // Using default font 'helvetica'
    pdf.text('REQUEST FOR QUOTATION', 150, 12);

    // Line width in units (you can adjust this)
    pdf.setLineWidth(0.1);

    // Line color (RGB)
    pdf.setDrawColor(200, 200, 200);
    pdf.line(10, 18, 200, 18)
    pdf.text('Contact Person', 13, 23)
    pdf.setFont('helvetica', 'normal');
    pdf.text("Nithish Kumar CP", 13, 28)
    pdf.addImage(callImage, 'PNG', 13, 29, 3, 3);
    pdf.text("9078382732", 16, 32)
    pdf.setFont('times', 'bold')  // Using default font 'times'
    pdf.text('RFQ No      :', 130, 23)
    pdf.text('RFQ Date   :', 130, 27)
    pdf.text('Due Date    :', 130, 31)
    pdf.setFont('times', 'normal')  // Using default font 'times'
    pdf.text("RFQ20240092", 155, 23)
    pdf.text(format(new Date(), 'MMM dd, yyyy'), 155, 27)
    pdf.text(format(new Date("2024-02-08 00:00:00.000 +0530"), 'MMM dd, yyyy'), 155, 31)
    pdf.line(10, 34, 200, 34)
    pdf.setFont('times', 'bold')
    pdf.text('To', 13, 39)
    pdf.setFont('times', 'bold')
    pdf.text('Purchase Centre Address :', 130, 39)
    pdf.setFont('times', 'normal')
    pdf.text('Head Office', 130, 44)
    pdf.text('CHENNAI', 130, 48)

    // Generate the vendor-specific content
    pdf.setFont('times', 'bold');
    pdf.text(`${vendorData?.vendorName}`, 13, 44);
    pdf.text(`${vendorData?.vendorAddress}`, 13, 48)
    pdf.setFont('times', 'normal');
    pdf.text(`P.O BOX : ${vendorData?.vendorPinCode}`, 13, 52);
    pdf.setFont('times', 'bold')
    pdf.text('Contact Person', 13, 56)
    pdf.setFont('times', 'normal')
    pdf.text(`${vendorData?.contactPerson}`, 13, 60);
    pdf.addImage(callImage, 'PNG', 13, 61, 3, 3);
    pdf.text(`  ${vendorData?.contactPersonMobNo || "N/A"}`, 16, 64);
    pdf.setFont('times', 'bold')
    pdf.text('Dear Sir,', 13, 72)
    pdf.setFont('times', 'normal')
    pdf.text('Please send your most competitive offer/mentioning your Terms & Conditions before the due date. You can send the same to \nthe above mentioned e-mail/fax', 13, 79)
    pdf.setFont('times', 'normal')
    pdf.setFontSize(10);

    // Generate AutoTable for item details
    const itemDetailsRows = itemsData.map((item, index) => [
        (index + 1).toString(),
        item.itemName,
        item.quantity?.toString(),
        item.uom,
        item.total?.toLocaleString(),
    ]);
    const itemDetailsHeaders = ['S.No', 'Item Name', 'Quantity', 'UOM', 'Total'];
    const columnWidths = [15, 90, 30, 30, 23]; // Adjust column widths as needed

    // Define table styles
    const headerStyles = {
        fillColor: [240, 240, 240],
        textColor: [0],
        fontFamily: 'times',
        fontStyle: 'bold',
    };

    pdf.setFont('times');
    const itemDetailsYStart = 88;
    pdf.autoTable({
        head: [itemDetailsHeaders],
        body: itemDetailsRows,
        startY: itemDetailsYStart, // Adjust the Y position as needed
        headStyles: {
            fillColor: headerStyles.fillColor,
            textColor: headerStyles.textColor,
            fontStyle: headerStyles.fontStyle,
            fontSize: 10, // Adjust the font size as needed
            font: 'times', // Set the font family
            halign: 'left',
        },
        columnStyles: {
            0: { cellWidth: columnWidths[0] }, // Adjust column widths as needed
            1: { cellWidth: columnWidths[1] },
            2: { cellWidth: columnWidths[2] },
            3: { cellWidth: columnWidths[3] },
            4: { cellWidth: columnWidths[4] },
        },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        bodyStyles: {
            fontSize: 10, // Adjust the font size for the body
            font: 'times', // Set the font family for the body
            cellPadding: { top: 1, right: 5, bottom: 1, left: 2 }, // Adjust cell padding
            textColor: [0, 0, 0], // Set text color for the body
            rowPageBreak: 'avoid', // Avoid row page breaks
        },
        margin: { top: 10, left: 13 },
    });

    // Calculate grand total dynamically
    const grandTotal = itemsData.reduce((acc, item) => acc + parseFloat(item.total), 0);

    // Add summary and page numbers
    const summaryYStart = pdf.internal.pageSize.getHeight() - 50;

    pdf.setFont('times', 'normal')
    pdf.text('Thanking You,', 13, summaryYStart + 20)
    pdf.text('Yours Faithfully,', 13, summaryYStart + 24)
    pdf.text('For ', 13, summaryYStart + 28)
    pdf.setFont('times', 'bold')
    pdf.text('Aalam Info Solutions LLP', 19, summaryYStart + 28)

    // Add grand total to the footer
    pdf.setFont('times', 'bold');
    pdf.setFontSize(10);
    pdf.text(`Grand Total: ${grandTotal.toLocaleString()}`, 130, summaryYStart + 20);

    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.line(10, 283, 200, 283)
        pdf.setPage(i);
        pdf.setFont('times');
        pdf.text(
            `Page ${i} of ${totalPages}`,
            185,
            pdf.internal.pageSize.getHeight() - 5
        );
    }

    // Save the PDF 
    pdf.save(`RFQ.pdf`);

    // Open PDF in a new tab
    const pdfDataUri = pdf.output('datauristring');
    const newTab = window.open();
    newTab?.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
}

export default PDFgenerator;
