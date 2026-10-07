let provider;
let signer;
let contract;


// ==========================================
// CONNECT METAMASK
// ==========================================

document.getElementById("connectButton").addEventListener("click", async function () {

    try {

        if (!window.ethereum) {

            alert("MetaMask is not installed.");

            return;
        }


        // Connect MetaMask

        await window.ethereum.request({
            method: "eth_requestAccounts"
        });


        provider = new ethers.BrowserProvider(window.ethereum);

        signer = await provider.getSigner();


        // Get wallet address

        const address = await signer.getAddress();


        // Get network

        const network = await provider.getNetwork();

        console.log("Wallet:", address);

        console.log("Network:", network);


        // Check Sepolia

        if (network.chainId !== 11155111n) {

            alert("Please connect MetaMask to Sepolia.");

            return;
        }


        // Create contract instance

        contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
        );


        document.getElementById("walletStatus").innerText =
            "Connected: " + address;


    } catch (error) {

        console.error(error);

        alert("MetaMask connection failed.");

    }

});


// ==========================================
// REGISTER EMPLOYEE
// ==========================================

document.getElementById("employeeForm").addEventListener("submit", async function (event) {

    event.preventDefault();


    try {

        // ==========================================
        // CHECK METAMASK
        // ==========================================

        if (!signer || !contract) {

            alert("Please connect MetaMask first.");

            return;
        }


        // ==========================================
        // GET FORM VALUES
        // ==========================================

        const employeeId =
            document.getElementById("employeeId").value;

        const employeeName =
            document.getElementById("employeeName").value;

        const designation =
            document.getElementById("designation").value;

        const salary =
            document.getElementById("salary").value;

        const location =
            document.getElementById("location").value;


        // ==========================================
        // GET PHOTO FILE
        // ==========================================

        const photoFile =
            document.getElementById("photo").files[0];


        // ==========================================
        // GET CV PDF FILE
        // ==========================================

        const documentFile =
            document.getElementById("document").files[0];


        // ==========================================
        // VALIDATE PHOTO
        // ==========================================

        if (!photoFile) {

            alert("Please select an employee photo.");

            return;
        }


        // ==========================================
        // VALIDATE CV
        // ==========================================

        if (!documentFile) {

            alert("Please select employee CV PDF.");

            return;
        }


        // ==========================================
        // CHECK CV TYPE
        // ==========================================

        if (documentFile.type !== "application/pdf") {

            alert("Please select a PDF file for the employee CV.");

            return;
        }


        // ==========================================
        // STEP 1: UPLOAD PHOTO TO IPFS
        // ==========================================

        document.getElementById("status").innerText =
            "Uploading employee photo to IPFS...";


        const photoFormData = new FormData();

        photoFormData.append("file", photoFile);


        const photoUploadResponse = await fetch(
            "http://localhost:3000/upload",
            {
                method: "POST",
                body: photoFormData
            }
        );


        const photoUploadResult =
            await photoUploadResponse.json();


        console.log(
            "Photo Pinata response:",
            photoUploadResult
        );


        if (!photoUploadResponse.ok) {

            throw new Error(
                photoUploadResult.error ||
                "Photo upload failed"
            );

        }


        // ==========================================
        // GET PHOTO CID
        // ==========================================

        const photoCID =
            photoUploadResult.cid;


        console.log(
            "Photo IPFS CID:",
            photoCID
        );


        // ==========================================
        // STEP 2: UPLOAD CV TO IPFS
        // ==========================================

        document.getElementById("status").innerText =
            "Photo uploaded. Uploading employee CV to IPFS...";


        const documentFormData =
            new FormData();


        documentFormData.append(
            "file",
            documentFile
        );


        const documentUploadResponse =
            await fetch(
                "http://localhost:3000/upload",
                {
                    method: "POST",
                    body: documentFormData
                }
            );


        const documentUploadResult =
            await documentUploadResponse.json();


        console.log(
            "CV Pinata response:",
            documentUploadResult
        );


        if (!documentUploadResponse.ok) {

            throw new Error(
                documentUploadResult.error ||
                "CV upload failed"
            );

        }


        // ==========================================
        // GET CV CID
        // ==========================================

        const documentCID =
            documentUploadResult.cid;


        console.log(
            "CV IPFS CID:",
            documentCID
        );


        // ==========================================
        // STEP 3: REGISTER EMPLOYEE ON BLOCKCHAIN
        // ==========================================

        document.getElementById("status").innerText =
            "Both files uploaded to IPFS. Waiting for MetaMask transaction...";


        const transaction =
            await contract.registerEmployee(

                employeeId,
                employeeName,
                designation,
                salary,
                location,

                // Photo CID
                photoCID,

                // CV CID
                documentCID

            );


        console.log(
            "Transaction:",
            transaction
        );


        // ==========================================
        // WAIT FOR TRANSACTION
        // ==========================================

        document.getElementById("status").innerText =
            "Transaction submitted. Waiting for confirmation...";


        await transaction.wait();


        // ==========================================
        // SUCCESS
        // ==========================================

        document.getElementById("status").innerHTML =

            "Employee registered successfully!<br><br>" +

            "<strong>Photo IPFS CID:</strong> " +
            photoCID +

            "<br>" +

            "<strong>CV IPFS CID:</strong> " +
            documentCID +

            "<br><br>" +

            "<strong>Transaction Hash:</strong> " +
            transaction.hash;


        console.log(
            "Transaction confirmed:",
            transaction.hash
        );


    } catch (error) {

        console.error(error);

        document.getElementById("status").innerText =
            "Error: " +
            (error.reason || error.message);

    }

});


// ==========================================
// GET EMPLOYEE
// ==========================================

document.getElementById("getEmployeeButton").addEventListener("click", async function () {

    try {

        // ==========================================
        // CHECK CONTRACT
        // ==========================================

        if (!contract) {

            alert("Please connect MetaMask first.");

            return;
        }


        // ==========================================
        // GET EMPLOYEE ID
        // ==========================================

        const employeeId =
            document.getElementById("searchEmployeeId").value;


        if (!employeeId) {

            alert("Enter Employee ID.");

            return;
        }


        // ==========================================
        // READ BLOCKCHAIN
        // ==========================================

        const employee =
            await contract.getEmployee(employeeId);


        console.log(
            "Employee:",
            employee
        );


        // ==========================================
        // GET EMPLOYEE DATA
        // ==========================================

        const employeeName =
            employee[0];

        const designation =
            employee[1];

        const salary =
            employee[2];

        const location =
            employee[3];

        const photoCID =
            employee[4];

        const documentCID =
            employee[5];


        // ==========================================
        // IPFS PHOTO URL
        // ==========================================

        const imageURL =
            "https://gateway.pinata.cloud/ipfs/" +
            photoCID;


        // ==========================================
        // IPFS CV URL
        // ==========================================

        const documentURL =
            "https://gateway.pinata.cloud/ipfs/" +
            documentCID;


        // ==========================================
        // DISPLAY EMPLOYEE
        // ==========================================

        document.getElementById("employeeResult").innerHTML = `

            <h3>Employee Details</h3>

            <p>
                <strong>Employee ID:</strong>
                ${employeeId}
            </p>

            <p>
                <strong>Name:</strong>
                ${employeeName}
            </p>

            <p>
                <strong>Designation:</strong>
                ${designation}
            </p>

            <p>
                <strong>Salary:</strong>
                ${salary}
            </p>

            <p>
                <strong>Location:</strong>
                ${location}
            </p>


            <hr>


            <h3>Employee Photo</h3>

            <p>
                <strong>Photo IPFS CID:</strong>
                ${photoCID}
            </p>

            <img
                src="${imageURL}"
                alt="Employee Photo"
                style="max-width:250px; display:block; margin-top:10px;"
            >


            <hr>


            <h3>Employee CV</h3>

            <p>
                <strong>CV IPFS CID:</strong>
                ${documentCID}
            </p>


            <p>
                <a
                    href="${documentURL}"
                    target="_blank"
                >
                    📄 View Employee CV
                </a>
            </p>


            <p>
                <a
                    href="${documentURL}"
                    target="_blank"
                    download
                >
                    ⬇ Download Employee CV
                </a>
            </p>

        `;


    } catch (error) {

        console.error(error);

        document.getElementById("employeeResult").innerText =
            "Error: " +
            (error.reason || error.message);

    }

});