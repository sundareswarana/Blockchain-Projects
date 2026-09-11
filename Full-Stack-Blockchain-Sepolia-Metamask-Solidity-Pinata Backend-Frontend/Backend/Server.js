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
    fs.mkdirSync(uploadFolder, { recursive: true });
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
// ==========================================

app.post(
    "/upload",
    upload.single("file"),
    async (req, res) => {

        try {

            console.log("Upload request received.");


            // --------------------------------------
            // Check whether file was received
            // --------------------------------------

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error: "No file uploaded"

                });

            }


            console.log(
                "File received:",
                req.file.originalname
            );


            // --------------------------------------
            // Read temporary uploaded file
            // --------------------------------------

            const fileBuffer = fs.readFileSync(
                req.file.path
            );


            // --------------------------------------
            // Convert Buffer → Blob
            // --------------------------------------

            const blob = new Blob([
                fileBuffer
            ]);


            // --------------------------------------
            // Create File object
            // --------------------------------------

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


            // --------------------------------------
            // Upload to Pinata / IPFS
            // --------------------------------------

            const result =
                await pinata.upload.public.file(file);


            // --------------------------------------
            // Delete temporary local file
            // --------------------------------------

            if (fs.existsSync(req.file.path)) {

                fs.unlinkSync(req.file.path);

            }


            console.log(
                "Uploaded successfully!"
            );

            console.log(
                "CID:",
                result.cid
            );


            // --------------------------------------
            // Send CID to frontend
            // --------------------------------------

            return res.json({

                success: true,

                cid: result.cid,

                name: result.name

            });

        }

        catch (error) {

            console.error(
                "Upload error:",
                error
            );


            // --------------------------------------
            // Delete temporary file if necessary
            // --------------------------------------

            if (
                req.file &&
                fs.existsSync(req.file.path)
            ) {

                try {

                    fs.unlinkSync(
                        req.file.path
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

                error: error.message

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