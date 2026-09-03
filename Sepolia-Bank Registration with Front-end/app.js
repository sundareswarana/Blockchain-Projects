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
// REGISTER ACCOUNT
// ==========================================

document.getElementById("customerForm").addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        try {

            // Check MetaMask
            if (!signer || !contract) {
                alert("Please connect MetaMask first.");
                return;
            }

            // Get form values
            const accountNumber =
                document.getElementById("accountNumber").value;

            const customerName =
                document.getElementById("customerName").value;

            const accountType =
                document.getElementById("accountType").value;

            const branchName =
                document.getElementById("branchName").value;

            const balanceAmount =
                document.getElementById("balanceAmount").value;


            // Send transaction
            const tx = await contract.registerAccount(
                accountNumber,
                customerName,
                accountType,
                branchName,
                balanceAmount
            );


            alert("Transaction Submitted");

            await tx.wait();

            alert("Account Registered Successfully");

            clearForm();

        } catch (err) {

            console.error(err);

            alert(err.message);

        }

    }
);

// ==========================================
// SEARCH ACCOUNT
// ==========================================

document.getElementById("getAccountButton").addEventListener(
    "click",
    searchAccount
);

async function searchAccount() {

    try {

        // Check MetaMask connection
        if (!signer || !contract) {
            alert("Please connect MetaMask first.");
            return;
        }

        // Get account number from Search field
        const id =
            document.getElementById("searchAccountNumber").value.trim();

        if (!id) {
            alert("Please enter an Account Number.");
            return;
        }

        console.log("Searching account:", id);

        // Call smart contract
        const account =
            await contract.getAccount(id);

        console.log("Account returned from blockchain:", account);

        // Display result
        document.getElementById("accountResult").innerHTML =

            "<b>Customer Name:</b> " + account[0] + "<br>" +

            "<b>Account Type:</b> " + account[1] + "<br>" +

            "<b>Branch Name:</b> " + account[2] + "<br>" +

            "<b>Balance Amount:</b> " + account[3];

    } catch (error) {

        console.error("Search error:", error);

        document.getElementById("accountResult").innerHTML =
            "Error retrieving account.";

        alert(error.message);
    }
}


// ==========================================
// CLEAR REGISTRATION FORM
// ==========================================

function clearForm() {

    document.getElementById("accountNumber").value = "";
    document.getElementById("customerName").value = "";
    document.getElementById("accountType").value = "";
    document.getElementById("branchName").value = "";
    document.getElementById("balanceAmount").value = "";

}