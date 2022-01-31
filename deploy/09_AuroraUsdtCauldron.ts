import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, network } from "hardhat";
import { BentoBoxV1 } from "../typechain";
import { DeploymentSubmission } from "hardhat-deploy/dist/types";
import { expect } from "chai";


const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const getDeployment = async (name: string) => {
    try {
      return (await deployments.get(name)).address
    } catch {
      return undefined
    }
  }

  // Deploy Aurora Cauldron using DegenBox
  // if we need to use DegenBox instead the CauldronV2 mastercontract needs to
  // be whitelisted
  const BentoBox = await ethers.getContractAt<BentoBoxV1>("BentoBoxV1", "0xcF9bBc99342a7704D61b2A06597aEC98D76e9155");
  const CauldronV2MasterContract = "0xAad5c22eF3b10f0039A1bB623D953411299c0355"; // CauldronV2

  const collateral = "0x60F49DA40230C67Aaa471685C66400C28b438FBC"; // AURORA/USDT
  const oracle = "0xDf42bA177094D3438FB193644d27A120DEEaF48F"; // Aurora/USD oracle
  const oracleData = "0x0000000000000000000000000000000000000000";

  let INTEREST_CONVERSION = 1e18/(365.25*3600*24)/100
  let interest = parseInt(String(3 * INTEREST_CONVERSION))
  const OPENING_CONVERSION = 1e5/100
  const opening = 0.5 * OPENING_CONVERSION
  const liquidation = 12.5 * 1e3+1e5
  const collateralization = 75 * 1e3

  let initData = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "bytes", "uint64", "uint256", "uint256", "uint256"],
    [collateral, oracle, oracleData, interest, liquidation, collateralization, opening]
  );

  const cauldronAddress = await getDeployment("AuroraCauldron")

  if(cauldronAddress === undefined) {
    const tx = await (await BentoBox.deploy(CauldronV2MasterContract, initData, true)).wait();

    const deployEvent = tx?.events?.[0];
    expect(deployEvent?.eventSignature).to.be.eq("LogDeploy(address,bytes,address)");

    deployments.save("AuroraCauldron", {
      abi: [],
      address: deployEvent?.args?.cloneAddress,
    });

  }
};

export default deployFunction;

if (network.name !== "hardhat") {
  deployFunction.skip = ({ getChainId }) =>
    new Promise((resolve, reject) => {
      try {
        getChainId().then((chainId) => {
          resolve(chainId !== "1313161555");
        });
      } catch (error) {
        reject(error);
      }
    });
}

deployFunction.tags = ["AuroraCauldron"];
deployFunction.dependencies = [];
