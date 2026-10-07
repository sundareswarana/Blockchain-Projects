const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { Blob, File } = require("buffer");
const { PinataSDK } = require("pinata");

require("dotenv").config();

console.log("Starting Pinata backend...");

const app = express();


// ==========================================
// CORS
// ==========================================

app.use(cors());


// ==========================================
// UPLOAD FOLDER
// ==========================================

const uploadFolder = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadFolder)) {

    fs.mkdirSync(uploadFolder, {
        recursive: true
    });

}


// ==========================================
// MULTER CONFIGURATION
// ==========================================

const upload = multer({
    dest: uploadFolder
});


// ==========================================
// CHECK PINATA JWT
// ==========================================

if (!process.env.PINATA_JWT) {

    console.error(
        "ERROR: PINATA_JWT is not defined in .env file."
    );

    process.exit(1);

}


// ==========================================
// PINATA SDK
// ==========================================

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT
});

console.log("Pinata SDK initialized.");


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.send(
        "Pinata backend is running successfully."
    );

});


// ==========================================
// UPLOAD ROUTE
// Supports:
// 1. Employee Photo
// 2. Employee CV / PDF
// ==========================================

app.post(
    "/upload",
    upload.single("file"),
    async (req, res) => {

        let temporaryFilePath = null;

        try {

            console.log("----------------------------------------");
            console.log("Upload request received.");

            // --------------------------------------
            // Check whether file was received
            // --------------------------------------

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error: "No file uploaded."

                });

            }


            temporaryFilePath = req.file.path;


            console.log(
                "File name:",
                req.file.originalname
            );

            console.log(
                "File type:",
                req.file.mimetype
            );

            console.log(
                "File size:",
                req.file.size,
                "bytes"
            );


            // ======================================
            // VALIDATE FILE TYPE
            // ======================================

            const allowedTypes = [

                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/webp",
                "application/pdf"

            ];


            if (!allowedTypes.includes(req.file.mimetype)) {

                // Delete temporary file

                if (fs.existsSync(req.file.path)) {

                    fs.unlinkSync(req.file.path);

                }


                return res.status(400).json({

                    success: false,

                    error:
                        "Invalid file type. " +
                        "Only JPG, PNG, WEBP images and PDF documents are allowed."

                });

            }


            // ======================================
            // READ TEMPORARY FILE
            // ======================================

            const fileBuffer = fs.readFileSync(
                req.file.path
            );


            // ======================================
            // BUFFER → BLOB
            // ======================================

            const blob = new Blob([
                fileBuffer
            ]);


            // ======================================
            // CREATE FILE OBJECT
            // ======================================

            const file = new File(

                [blob],

                req.file.originalname,

                {
                    type: req.file.mimetype
                }

            );


            console.log(
                "Uploading file to Pinata..."
            );


            // ======================================
            // UPLOAD TO PINATA / IPFS
            // ======================================

            const result =
                await pinata.upload.public.file(file);


            // ======================================
            // DELETE TEMPORARY LOCAL FILE
            // ======================================

            if (fs.existsSync(req.file.path)) {

                fs.unlinkSync(req.file.path);

            }

            temporaryFilePath = null;


            // ======================================
            // SUCCESS
            // ======================================

            console.log(
                "Uploaded successfully!"
            );

            console.log(
                "File:",
                result.name
            );

            console.log(
                "CID:",
                result.cid
            );

            console.log("----------------------------------------");


            // ======================================
            // SEND RESULT TO FRONTEND
            // ======================================

            return res.json({

                success: true,

                cid: result.cid,

                name: result.name,

                fileType: req.file.mimetype

            });


        }

        catch (error) {

            console.error(
                "Upload error:",
                error
            );


            // ======================================
            // DELETE TEMPORARY FILE
            // ======================================

            if (
                temporaryFilePath &&
                fs.existsSync(temporaryFilePath)
            ) {

                try {

                    fs.unlinkSync(
                        temporaryFilePath
                    );

                }

                catch (deleteError) {

                    console.error(
                        "Could not delete temporary file:",
                        deleteError.message
                    );

                }

            }


            return res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "File upload failed."

            });

        }

    }
);


// ==========================================
// START SERVER
// ==========================================

const PORT = 3000;

app.listen(PORT, () => {

    console.log("----------------------------------------");

    console.log(
        "Pinata backend is running!"
    );

    console.log(
        `http://localhost:${PORT}`
    );

    console.log("----------------------------------------");

});
