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


if (network.chainId !== 11155111n) {

    alert("Please connect MetaMask to Sepolia.");

    return;
}


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

        // Check MetaMask

        if (!signer || !contract) {

            alert("Please connect MetaMask first.");

            return;
        }


        // Get form values

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

        const photoFile =
            document.getElementById("photo").files[0];


        if (!photoFile) {

            alert("Please select a photo.");

            return;
        }


        document.getElementById("status").innerText =
            "Uploading photo to IPFS...";


        // ==========================================
        // STEP 1: UPLOAD PHOTO TO PINATA BACKEND
        // ==========================================

        const formData = new FormData();

        formData.append("file", photoFile);


        const uploadResponse = await fetch(
            "http://localhost:3000/upload",
            {
                method: "POST",
                body: formData
            }
        );


        const uploadResult = await uploadResponse.json();


        console.log("Pinata response:", uploadResult);


        if (!uploadResponse.ok) {

            throw new Error(
                uploadResult.error || "Photo upload failed"
            );

        }


        // ==========================================
        // GET CID
        // ==========================================

        const cid = uploadResult.cid;


        console.log("IPFS CID:", cid);


        document.getElementById("status").innerText =
            "Photo uploaded to IPFS. CID: " + cid;


        // ==========================================
        // STEP 2: REGISTER EMPLOYEE ON BLOCKCHAIN
        // ==========================================

        document.getElementById("status").innerText =
            "Waiting for MetaMask transaction...";


        const transaction = await contract.registerEmployee(

            employeeId,
            employeeName,
            designation,
            salary,
            location,
            cid

        );


        console.log("Transaction:", transaction);


        document.getElementById("status").innerText =
            "Transaction submitted. Waiting for confirmation...";


        await transaction.wait();


        // ==========================================
        // SUCCESS
        // ==========================================

        document.getElementById("status").innerHTML =
            "Employee registered successfully!<br><br>" +
            "IPFS CID: " + cid + "<br>" +
            "Transaction Hash: " + transaction.hash;


        console.log("Transaction confirmed:", transaction.hash);


    } catch (error) {

        console.error(error);

        document.getElementById("status").innerText =
            "Error: " + (error.reason || error.message);

    }

});


// ==========================================
// GET EMPLOYEE
// ==========================================

document.getElementById("getEmployeeButton").addEventListener("click", async function () {

    try {

        if (!contract) {

            alert("Please connect MetaMask first.");

            return;
        }


        const employeeId =
            document.getElementById("searchEmployeeId").value;


        if (!employeeId) {

            alert("Enter Employee ID.");

            return;
        }


        // Read blockchain

        const employee =
            await contract.getEmployee(employeeId);


        console.log("Employee:", employee);


        const employeeName = employee[0];

        const designation = employee[1];

        const salary = employee[2];

        const location = employee[3];

        const cid = employee[4];


        // ==========================================
        // IPFS IMAGE URL
        // ==========================================

        const imageURL =
            "https://gateway.pinata.cloud/ipfs/" + cid;


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

            <p>
                <strong>IPFS CID:</strong>
                ${cid}
            </p>

            <img
                src="${imageURL}"
                alt="Employee Photo"
            >

        `;


    } catch (error) {

        console.error(error);

        document.getElementById("employeeResult").innerText =
            "Error: " + (error.reason || error.message);

    }

});