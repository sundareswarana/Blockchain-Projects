The complete Flow:

Open index.html.  (Frontend)
.	
Connect MetaMask.
	
Confirm that MetaMask is on Sepolia.
.	
Enter employee details.
	
Select the employee photograph.
	
Click Register Employee.
	
Frontend uploads the photograph to your Pinata backend.
	
Pinata returns the CID.

Frontend calls registerEmployee() on your already deployed Sepolia contract.
	
MetaMask asks you to confirm the transaction.

After confirmation, the employee record is stored on Sepolia with the IPFS CID.

Then use Get Employee to retrieve the record and display the photograph.
