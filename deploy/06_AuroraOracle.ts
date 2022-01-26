import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, network } from "hardhat";


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("AuroraOracle", {
    from: deployer,
    log: true,
    deterministicDeployment: false,
  });
};

export default func;

func.tags = ["AuroraOracle"];
func.dependencies = [];
