const CONTRACT_ADDRESS ="0x5cE8736D23CC4009C7cc9dF6c7C979b4c1667115";


const CONTRACT_ABI = [

	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "accounts",
		"outputs": [
			{
				"internalType": "string",
				"name": "customerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "accountType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "branchName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "balanceAmount",
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
				"name": "_accountNumber",
				"type": "string"
			}
		],
		"name": "getAccount",
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
				"name": "_accountNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_customerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_accountType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_branchName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_balanceAmount",
				"type": "string"
			}
		],
		"name": "registerAccount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]