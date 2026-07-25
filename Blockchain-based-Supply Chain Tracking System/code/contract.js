let provider;
let signer;
let contract;
// Contract Address
const contractAddress = "0x17e91224c30c5b0B13ba2ef1E84FE880Cb902352";

// Paste your ABI here
const abi =
[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_productId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_productName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_manufacturer",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_status",
				"type": "string"
			}
		],
		"name": "registerProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_productId",
				"type": "string"
			}
		],
		"name": "getProduct",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "string",
				"name": "productName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "manufacturer",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}

];
async function connectWallet() {

    if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
    }

    await window.ethereum.request({
        method: "eth_requestAccounts"
    });

    provider = new ethers.providers.Web3Provider(window.ethereum);

    signer = provider.getSigner();

    contract = new ethers.Contract(
        contractAddress,
        abi,
        signer
    );

    console.log("Wallet Connected Successfully");
}
window.onload = connectWallet;
async function registerProduct() {

    const productId = document.getElementById("productId").value;
    const productName = document.getElementById("productName").value;
    const manufacturer = document.getElementById("manufacturer").value;
    const location = document.getElementById("location").value;
    const status = document.getElementById("status").value;

    try {

        const tx = await contract.registerProduct(
            productId,
            productName,
            manufacturer,
            location,
            status
        );

        await tx.wait();

        alert("Product Registered Successfully!");
		
		console.log("Calling clearForm()");
		clearForm();

    } catch(err) {

        console.log(err);
        alert("Registration Failed");

    }

}
async function getProduct() {

    const productId = document.getElementById("productId").value;

    try {

        const product = await contract.getProduct(productId);

        document.getElementById("output").innerHTML =
        `
        <b>Product Name:</b> ${product[0]}<br>
        <b>Manufacturer:</b> ${product[1]}<br>
        <b>Location:</b> ${product[2]}<br>
        <b>Status:</b> ${product[3]}
        `;

    } catch(err) {

        console.log(err);
        alert("Product Not Found");

    }

}
