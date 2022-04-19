import { expect } from "chai";
import { ethers } from "hardhat";

describe("Ballot", function () {
  it("Should assign voting rights correctly", async function () {
    // Create new Ballot
    const Ballot = await ethers.getContractFactory("Ballot");
    const ballot = await Ballot.deploy([
      ethers.utils.formatBytes32String("ETH"),
      ethers.utils.formatBytes32String("BTC"),
    ]);
    await ballot.deployed();

    // Get voters
    const [deployer, voter1] = await ethers.getSigners();

    // Check voter1 does not have right to vote
    const voteTx = ballot.connect(voter1).vote(0);
    await expect(voteTx).to.be.revertedWith("Has no right to vote");

    // Give voter1 right to vote
    const grantVoter1RightTx = await ballot
      .connect(deployer)
      .giveRightToVote(voter1.address);
    grantVoter1RightTx.wait();

    // voter1 now casts vote for proposal 1
    const voteTx1 = ballot.connect(voter1).vote(1);
    await (await voteTx1).wait();

    // Check winning proposal should be 1
    expect(await ballot.winningProposal()).to.be.equal(1);
  });

  it("Should reject votes that are cast after 5 minutes since Ballot started", async function () {
    // Create new Ballot
    const Ballot = await ethers.getContractFactory("Ballot");
    const ballot = await Ballot.deploy([
      ethers.utils.formatBytes32String("ETH"),
      ethers.utils.formatBytes32String("BTC"),
    ]);
    await ballot.deployed();

    // Get startTime
    const ballotStartTime = await ballot.startTime();

    // Get voters
    const [deployer, voter1, voter2, voter3, voter4] =
      await ethers.getSigners();

    // Give voters right to vote
    const grantVoter1RightTx = await ballot
      .connect(deployer)
      .giveRightToVote(voter1.address);
    grantVoter1RightTx.wait();
    const grantVoter2RightTx = await ballot
      .connect(deployer)
      .giveRightToVote(voter2.address);
    grantVoter2RightTx.wait();
    const grantVoter3RightTx = await ballot
      .connect(deployer)
      .giveRightToVote(voter3.address);
    grantVoter3RightTx.wait();
    const grantVoter4RightTx = await ballot
      .connect(deployer)
      .giveRightToVote(voter4.address);
    grantVoter4RightTx.wait();

    // voter1 now casts vote for proposal 1
    const voteTx1 = ballot.connect(voter1).vote(1);
    await (await voteTx1).wait();

    // Check Proposal object to have new vote count
    expect((await ballot.proposals(1)).voteCount).to.be.equal(1);

    // speed up time to 1s before 5m since startTime
    const deadlineMinusOneSecond = ballotStartTime.add(
      ethers.BigNumber.from(300 - 1)
    );
    console.log("speeding up time to 5m-1s since startTime", {
      ballotStartTime,
      speedUpToTime: deadlineMinusOneSecond,
    });
    await ethers.provider.send("evm_setNextBlockTimestamp", [
      deadlineMinusOneSecond.toNumber(),
    ]);

    // voter2 should be able to still cast valid vote
    const voteTx2 = ballot.connect(voter2).vote(1);
    await (await voteTx2).wait();

    // Check Proposal object to have new vote count
    expect((await ballot.proposals(1)).voteCount).to.be.equal(2);

    // speed up time to 5m since startTime
    const deadline = ballotStartTime.add(ethers.BigNumber.from(300));
    console.log("speeding up time to 5m since startTime", {
      ballotStartTime,
      speedUpToTime: deadline,
    });
    await ethers.provider.send("evm_setNextBlockTimestamp", [
      deadline.toNumber(),
    ]);

    // voter3 should be able to still cast valid vote
    const voteTx3 = ballot.connect(voter3).vote(1);
    await (await voteTx3).wait();

    // Check Proposal object to have new vote count
    expect((await ballot.proposals(1)).voteCount).to.be.equal(3);

    // speed up time to 5m+1s since startTime
    const deadlinePlusOneSecond = ballotStartTime.add(
      ethers.BigNumber.from(300 + 1)
    );
    console.log("speeding up time to 5m+1s since startTime", {
      ballotStartTime,
      speedUpToTime: deadlinePlusOneSecond,
    });
    await ethers.provider.send("evm_setNextBlockTimestamp", [
      deadlinePlusOneSecond.toNumber(),
    ]);

    // voter4 should NOT be able to cast valid vote
    const voteTx4 = ballot.connect(voter3).vote(1);

    await expect(voteTx4).to.be.revertedWith(
      "Ballot: cannot vote since Ballot voting ended"
    );

    // Check Proposal object to have OLD vote count
    expect((await ballot.proposals(1)).voteCount).to.be.equal(3);
  });
});
