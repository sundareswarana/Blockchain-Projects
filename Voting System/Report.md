# Voting System: Procedure

Step 1: Open Remix

Go to:

Remix IDE

# Create a new file:

VotingSystem.sol    // Refer the code

# Step 2: Compile

Click:

Solidity Compiler

Select:

0.8.20

Click:

Compile VotingSystem.sol

Step 3: Start Ganache

Step 4: Connect Remix to Ganache

In Remix:

Deploy & Run Transactions

Environment:

Dev Ganache Provider

Step 5: Deploy

Click:

Deploy

Contract appears under:

Deployed Contracts

Expand it.

You will see:

addCandidate

vote

candidates

getCandidateCount

hasVoted

#PART A - Add Candidates

Candidate 1

In:

addCandidate

Enter:

Alice

Click:

transact


Candidate 2

Enter:

Bob

Click:

transact

Candidate 3

Enter:

Charlie

Click:

transact

Now 3 candidates are stored on blockchain.

Step 6: Verify Candidates

Click:

getCandidateCount

Output:

3

Meaning:

Alice

Bob

Charlie

exist.

# Step 7: View Candidate Details

Candidate indexes:

Alice   = 0

Bob     = 1

Charlie = 2

Call:

candidates(0)

Output:

Alice

0 votes

Call:

candidates(1)

Output:

Bob

0 votes


#PART B - Vote

Suppose we vote for Alice.

In:

vote

Enter:

0

Click:

transact

Success.


Check Result

Call:

candidates(0)

Output:

Alice

1 vote

Alice now has one vote.

# PART C - Prevent Double Voting

Using the SAME account:

Again call:

vote(0)

Now Solidity checks:

require(!hasVoted[msg.sender]);

Since you already voted:

Output:

You already voted

Transaction fails.

This is the main feature of the project.

#PART D - Vote Using Another Account

In Remix, change account:

Account 2

(from Ganache)

Now vote:

vote(1)

Meaning:

Vote for Bob

Success.

Check:

candidates(1)

Output:

Bob

1 vote

Final Result Example

Alice   1 vote

Bob     1 vote

Charlie 0 vote
