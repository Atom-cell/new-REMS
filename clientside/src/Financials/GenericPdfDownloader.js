import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from "react-bootstrap";

const GenericPdfDownloader = ({ rootElementId, downloadFileName }) => {
  const addWaterMark = (doc) => {
    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.addImage("/Images/1.jpg", "PNG", 40, 40, 75, 75);
      doc.setTextColor(150);
      doc.text(50, doc.internal.pageSize.height - 30, "Watermark");
    }

    return doc;
  };

  const downloadPdfDocument = () => {
    const input = document.getElementById(rootElementId);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      //   pdf = addWaterMark(pdf);
      //   pdf.text(250, pdf.internal.pageSize.height - 300, "Watermark");
      //   pdf.addImage(
      //     "/Images/paid.png",
      //     "PNG",
      //     250,
      //     pdf.internal.pageSize.height - 300
      //   );
      pdf.addImage(imgData, "JPEG", 0, 60);
      pdf.save(`${downloadFileName}.pdf`);
    });
  };

  return (
    <Button
      style={{ backgroundColor: "#1890ff" }}
      onClick={downloadPdfDocument}
    >
      Download Invoice Pdf
    </Button>
  );

  //   return <button onClick={downloadPdfDocument}>Download Pdf</button>;
};

export default GenericPdfDownloader;
