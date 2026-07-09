Problem Statement

Traditional certificate verification is often manual and time-consuming. 

Blockchain technology provides an immutable and transparent platform where certificate information can be securely stored and verified without relying on centralized databases.

Step 1

Create a Solidity smart contract named CertificateVerification.sol.

Step 2

Define a Certificate structure containing:

Student Name

Course Name

Certificate Status

Step 3

Create a mapping that associates each certificate ID with its corresponding certificate details.

Step 4

Deploy the smart contract using Remix IDE and Ganache.

Step 5

Issue certificates by providing:

Certificate ID

Student Name

Course Name

Step 6

Verify certificates using their certificate IDs.

Sample Output

Valid Certificate

Student Name : Arun Kumar

Course Name : Blockchain Fundamentals

Status : true

Invalid Certificate

Student Name :

Course Name :

Status : false

