import express from "express";
import cors from "cors";
import { communicator } from "./chatCommunicator.js";
import { Readable } from "stream";
import multer from "multer";
import axios from "axios";
import base64Img from "base64-img";
import { parsePDF } from "./pdfParser.js";
import PdfParse from "pdf-parse-new";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// var base64Img = require("base64-img");

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));

//Routes
app.post("/clear", async (req, res) => {
  await communicator('clear-chat');
  res.status(200).json({ message:"chat-cleared" });
});

const upload = multer({storage:multer.memoryStorage()});

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { resource_type: "raw", timeout: 60000 },
    async (error, result) => {
      if (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({ error: "Cloudinary upload failed" });
      }

      try {
        const response = await axios.get(result.secure_url, { responseType: "arraybuffer" });
        const pdfBuffer = Buffer.from(response.data);
        
        await parsePDF(pdfBuffer);
        res.json({ message: "File uploaded and processed successfully", pdfUrl: result.secure_url });
      } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ error: "Error processing the PDF file" });
      }
    }
  );

  // Stream file buffer to Cloudinary
  const bufferStream = Readable.from(req.file.buffer);
  bufferStream.pipe(uploadStream);
});



app.post("/",async(req,res)=>{

  return res.status(200).json({data:"HELLO from genie"})
})

app.post("/chat-bot", async (req, res) => {
  const { query } = req.body;
  if (!query||!query.trim())
    return res.status(400).json({ error: "No message provided" });
  else {
    const response=await communicator(query);
    return res.status(200).json({ data: response });
  }
});

app.post("/quotation", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    else{
      // const response=await communicator("")
    }
   

    if (error) throw error;

    return res.json({
      data:
        "Thank you for providing your details. We will get back to you with a quotation.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Image process Route

app.post("/process-image", upload.single("image"), async (req, res) => {
  
  try {
  // Check if image was uploaded
  if (!req.file && !req.body.imageUrl) {
    return res.status(400).json({ error: "No image provided" });
  }
let imageQuery;
    // Convert image to base64
    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype; // Get the mime type of the image

      imageQuery = `data:${mimeType};base64,${base64Image}`;
      // imageQuery = base64Img.base64Sync(req.file.path);
    } 

    else if (req.body.imageUrl) {
      // Fetch image from URL and convert to base64
      const axiosRes = await axios.get(req.body.imageUrl, {
        responseType: "arraybuffer",
      });
      imageQuery = btoa(
        new Uint8Array(axiosRes.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
    }

    const response = await communicator(imageQuery);
    
    return res.status(200).json({ data: response });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running at port:${process.env.PORT}`);
});

export { app };
