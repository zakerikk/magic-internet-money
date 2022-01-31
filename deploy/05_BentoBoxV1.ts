import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, network } from "hardhat";
import { ChainId, setDeploymentSupportedChains } from "../utilities";
import { xMerlin } from "../test/constants";
import { BentoBoxV1 } from "../typechain";

const ParametersPerChain = {
  [ChainId.AuroraTestNet]: {
    weth: "0x9D29f395524B3C817ed86e2987A14c1897aFF849",
    owner: xMerlin,
  },
};

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  const chainId = await hre.getChainId();
  const parameters = ParametersPerChain[parseInt(chainId)];

  await deploy("BentoBoxV1", {
    from: deployer,
    args: [parameters.weth],
    log: true,
    deterministicDeployment: false,
  });

  const BentoBoxV1 = await ethers.getContract<BentoBoxV1>("BentoBoxV1");

  if ((await BentoBoxV1.owner()) != parameters.owner && network.name !== "hardhat") {
    await BentoBoxV1.transferOwnership(parameters.owner, true, false);
  }
};

export default func;

if (network.name !== "hardhat") {
  func.skip = ({ getChainId }) =>
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

func.tags = ["BentoBoxV1"];
func.dependencies = [];
