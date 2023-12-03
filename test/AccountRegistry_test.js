const { expect } = require("chai");

describe("AccountRegistry", function () {
  let AccountRegistry;
  let Account;
  let accountRegistry;
  let accountImplementation;

  beforeEach(async function () {
    AccountRegistry = await ethers.getContractFactory("AccountRegistry");
    Account = await ethers.getContractFactory("Account");

    accountImplementation = await Account.deploy();
    accountRegistry = await AccountRegistry.deploy(accountImplementation.address);
  });

  it("should create an account and return its address", async function () {
    const chainId = 1; // Set the desired chainId
    const tokenCollection = accounts[1]; // Set the desired token collection address
    const tokenId = 123; // Set the desired token ID

    const accountAddress = await accountRegistry.createAccount(
      chainId,
      tokenCollection,
      tokenId
    );

    expect(accountAddress).to.not.equal(
      ethers.constants.AddressZero,
      "Account address should not be zero"
    );
  });

  it("should get the account address for an existing account", async function () {
    const chainId = 1; // Set the desired chainId
    const tokenCollection = accounts[1]; // Set the desired token collection address
    const tokenId = 123; // Set the desired token ID

    await accountRegistry.createAccount(chainId, tokenCollection, tokenId);

    const accountAddress = await accountRegistry.account(
      chainId,
      tokenCollection,
      tokenId
    );

    expect(accountAddress).to.not.equal(
      ethers.constants.AddressZero,
      "Account address should not be zero"
    );
  });
});

it("should revert when creating an account with an invalid chainId", async function () {
    const invalidChainId = 0; // Set an invalid chainId
  
    await expect(
      accountRegistry.createAccount(
        invalidChainId,
        tokenCollection,
        tokenId
      )
    ).to.be.revertedWith("Invalid chainId");
  });
  
  it("should revert when creating an account with a zero tokenCollection address", async function () {
    const zeroAddress = ethers.constants.AddressZero; // Set a zero address as the tokenCollection
  
    await expect(
      accountRegistry.createAccount(
        chainId,
        zeroAddress,
        tokenId
      )
    ).to.be.revertedWith("Invalid tokenCollection address");
  });
  
  it("should revert when creating an account with a zero tokenId", async function () {
    const zeroTokenId = 0; // Set a zero tokenId
  
    await expect(
      accountRegistry.createAccount(
        chainId,
        tokenCollection,
        zeroTokenId
      )
    ).to.be.revertedWith("Invalid tokenId");
  });
  
  it("should get the same account address when called with the same input parameters", async function () {
    const chainId = 1;
    const tokenCollection = accounts[1];
    const tokenId = 123;
  
    const accountAddress1 = await accountRegistry.account(
      chainId,
      tokenCollection,
      tokenId
    );
  
    const accountAddress2 = await accountRegistry.account(
      chainId,
      tokenCollection,
      tokenId
    );
  
    expect(accountAddress1).to.equal(accountAddress2, "Account addresses should be equal");
  });
  
  it("should return the zero address for a non-existing account", async function () {
    const nonExistingChainId = 999; // Set a non-existing chainId
    const nonExistingTokenCollection = accounts[2]; // Set a non-existing token collection address
    const nonExistingTokenId = 456; // Set a non-existing token ID
  
    const accountAddress = await accountRegistry.account(
      nonExistingChainId,
      nonExistingTokenCollection,
      nonExistingTokenId
    );
  
    expect(accountAddress).to.equal(ethers.constants.AddressZero, "Account address should be zero");
  });
  