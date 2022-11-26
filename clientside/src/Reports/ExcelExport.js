import React from "react";
import { Button } from "react-bootstrap";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import DownloadIcon from "@mui/icons-material/Download";

const ExcelExport = ({ excelData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async (excelData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  return (
    <Button
      className="submitbtn"
      style={{ position: "absolute", right: 0 }}
      onClick={
        excelData.length > 1 ? (e) => exportToExcel(excelData, fileName) : null
      }
    >
      <DownloadIcon style={{ fill: "white", marginRight: "0.5em" }} />
      Export
    </Button>
  );
};

export default ExcelExport;
