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
				"name": "_employeeId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_employeeName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_designation",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_salary",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_photo",
				"type": "string"
			}
		],
		"name": "registerEmployee",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "employees",
		"outputs": [
			{
				"internalType": "string",
				"name": "employeeName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "designation",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "salary",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "photo",
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
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_employeeId",
				"type": "string"
			}
		],
		"name": "getEmployee",
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
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
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
