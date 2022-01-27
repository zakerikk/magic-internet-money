import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, network } from "hardhat";


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("CauldronV2", {
    from: deployer,
    args: ["0x1A32B83332A9b967c48853A7aC0906392Dff6be3", "0xded1340A337bDd69aecD7e696D610E9D2F49767f"],
    log: true,
    deterministicDeployment: false,
  });
};

export default func;

func.tags = ["CauldronV2"];
func.dependencies = [];
