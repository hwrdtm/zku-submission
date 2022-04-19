# ZKU Submission

Github Link: https://github.com/hwrdtm/zku-submission

## A. Conceptual Knowledge

1. What is a smart contract? How are they deployed? You should be able to describe how a smart contract is deployed and the necessary steps.

A smart contract is a series of bytecode that is deployed at a contract address and stored among the blockchain nodes in the network. This bytecode encodes instructions - technically, EVM opcodes at the low-level - on how the EVM should process transactions that are sent to this particular contract address. The instructions can be written in the higher-level Solidity programming language, which gets compiled down to the EVM-compatible bytecode.

In order to deploy a smart contract, one would need to have the following:

1. The smart contract bytecode, which can be generated through compilation
2. Enough ETH for gas during deployment
3. A script to deploy the smart contract, which can be done via Hardhat for example
4. Access to an Ethereum node (eg. own node or public node from Infura or Alchemy etc.)

Smart contracts can be deployed by sending a transaction without a recipient, with calldata containing the bytecode for the smart contract itself, and the sender wallet having enough ETH to pay for the gas usage during deployment.

2. What is gas? Why is gas optimization such a big focus when building smart contracts?

Gas is a unit to measure the total cost of computational operations needed to execute and process transactions. At the low-level, the smart contract bytecode instructs the EVM on which opcodes to use against which values, and each opcode requires a different amount of gas to be used.

Smart contracts exist in order to have transactions be sent towards its address and for its bytecode to be executed against the instructions of each transaction that is sent. Since each transaction involves running bytecode - and hence opcodes - each transaction will therefore require gas (in the form of the native blockchain currency) to be expended in order to be processed. Gas optimization is important so that the same functionality can be achieved at a cheaper cost, or conversely, the same cost can result in greater number of smart contract interactions, which ultimately has huge implications on the usability of decentralized applications, both from UX and cost perspectives.

3. What is a hash? Why do people use hashing to hide information?

A hash is the output of some computation performed by a hashing function. As hashing functions are one-way and irreversible, people can present the hash of the information they want to share with others instead of the original plaintext to prevent others from discovering what the original plaintext is.

One common example of a hash is digital signatures. When using asymmetric keys involving public + private keys, a private key can be used to create a digital signature (which is a hash) of any arbitrary payload, such that anyone else can verify using the corresponding public key that this signature hash was created exactly by this private key. This allows others to authenticate that information was indeed presented by the individual that is in possession of the private key.

4. How would you prove to a colorblind person that two different colored objects are actually of different colors? You could check out Avi Wigderson talk about a similar problem [here](https://www.youtube.com/watch?v=5ovdoxnfFVc&t=4s).

Abstractly speaking, we can take the statement and proof about the two objects are of different colors and model it into a three-coloring solution for a map. Concretely though, this person is colorblind, so the abstract concept doesn't translate 1:1 in practical terms.

Solution 1: Show the two objects to sufficiently large number of individuals who don't know each other and likely have no incentive for lying to the colorblind person, and asking them whether the two objects are colored differently. This is a probabilistic proof where the colorblind person will gain confidence of the proof only after gathering the same answer from a sufficiently large group. Then again, as Avi Wigderson alluded to, it is impossible to get 100% certainty with proofs, rather proof with high 9's of certainty.

Solution 2: Instead of relying on honest actors when the colorblind person is asking for answers among a sufficiently large set of individuals as in Solution 1, we can turn towards other mechanisms that we _know_ to be 100% truthy at all times, eg. different chemical reactions that are based on color pigments on an object, that are underpined by science (and science never lies, right?). The colorblind person will simply perform the same set of chemical operations against each object, and upon observing different chemical reactions, conclude that the objects are having different color pigments on them. But, this is not quite a zero-knowledge proof since this technically reveals the exact coloring of each object.

## B. You sure you’re solid with Solidity?

Please check code in `contracts` directory and corresponding tests in `test` directory.

To run tests, run the following:

```
yarn install
npx hardhat compile
npx hardhat test
```
