import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from "react-bootstrap";

const GenericPdfDownloader = ({ rootElementId, downloadFileName }) => {
  const downloadPdfDocument = () => {
    const input = document.getElementById(rootElementId);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
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
};

export default GenericPdfDownloader;
