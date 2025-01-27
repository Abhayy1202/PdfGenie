import React, { useState, useRef } from "react";
import { Button } from "./ui/button.jsx";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useAppContext } from "../context/AppContext.jsx";

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export const PDFViewer = () => {
  const { file, setFile } = useAppContext();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(100);

  const onZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 10, 200));
  };

  const onZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 10, 10));
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name);
      // await handlePDF();
    } else {
      console.error("Please select a PDF file");
    }
    // Reset the file input
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      console.log("File dropped:", selectedFile.name);
    } else {
      console.error("Please drop a PDF file");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return file ? (
    <div className="flex-1 bg-[#e5e7eb] p-4 overflow-auto h-screen">
      <div className="bg-white p-2 mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ZoomOut onClick={onZoomOut} />
          </button>
          <span className="text-sm">{scale}%</span>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            id="el-ro0y9g7r"
          >
            <ZoomIn onClick={onZoomIn} />
          </button>
        </div>
        <span>{file.name}</span>

        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={previousPage}
            disabled={pageNumber <= 1}
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextPage}
            disabled={pageNumber >= numPages}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error("Error while loading document!", error);
            setError("Failed to load PDF. Please try again.");
            setLoading(false);
          }}
          className="flex justify-center  "
          loading={<div>Loading PDF...</div>}
        >
          {loading && <div>Loading page...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={scale / 100}
          />
        </Document>
      </div>
    </div>
  ) : (
    <div className="flex-grow flex-shrink overflow-hidden basis-0">
      <div className="relative overflow-auto h-full">
        <div className="m-10 gap-10 flex flex-col justify-center items-center">
          <div className="mt-12 mx-auto text-center px-5">
            <h1 className="font-onest font-bold text-5xl leading-tight tracking-tight text-[#070D1B] relative inline-block p-0 m-0">
              Chat with any
              <span className=" inline-block">
                <div className="absolute right-[-130px] top-[2px] bg-[#2563eb] w-[127px] h-[61px] transform rotate-[1.73deg] rounded-[10px] z-1 flex items-center justify-center">
                  <span className=" text-white z-2">PDF</span>
                </div>
              </span>
            </h1>
            <h2 className="text-[#333] my-2.5 font-onest text-lg font-normal leading-7 text-center">
              Join millions of{" "}
              <span className="relative">
                <span className="text-[#FB923C] underline">
                  students, researchers and professionals
                </span>
              </span>{" "}
              to instantly
              <br className="hidden md:inline" /> answer questions and
              understand research with AI
            </h2>
          </div>
          <div className="box-border w-full max-w-[820px] mx-auto mt-[47px]">
            <div className="relative bg-white border border-[#EBEEF9] shadow-lg rounded-[24px] p-[26px]">
              <div className="absolute top-[-41px] right-[-74px] w-[200px] h-[100px] bg-[url('/drag-arrow.png')] bg-contain bg-no-repeat"></div>
              <div
                className="rounded-[8px] p-[54px] text-center  border-dashed border-2 border-[#2563eb] hover:bg-[#2564eb16]
               cursor-pointer flex flex-col justify-center items-center"
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  ref={fileInputRef}
                  accept=".pdf"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <img
                  src="/UploadFile.svg"
                  alt="UploadFileIcon"
                  className="w-[68px] h-[83px]"
                />
                <p className="text-[20px] font-semibold mt-[12px] text-[#070D1B]">
                  Click to upload, or drag PDF here
                </p>
                <div className="relative ">
                  <button className="mt-[20px] inline-flex items-center bg-[#2563eb] justify-center text-white rounded-[8px] h-[48px]  text-[14px] overflow-hidden font-bold ">
                    <span
                      className="flex items-center px-6 h-full button-primary hover:bg-[#2c5dc8] "
                      type="button"
                    >
                      <img
                        alt="Upload Arrow Icon"
                        loading="lazy"
                        width="19"
                        height="19"
                        decoding="async"
                        src="/UploadArrowIcon.d1849693.svg"
                        className="text-transparent"
                      />
                      <span className="ml-2">Upload PDF</span>
                    </span>
                    <span className="flex items-center justify-center h-full w-[40px] border-l border-[#ffffff4d] cursor-pointer hover:bg-[#2c5dc8] ">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="white"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
