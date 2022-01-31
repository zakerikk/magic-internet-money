import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, network } from "hardhat";
import { CauldronV2 } from "../typechain";


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("CauldronV2", {
    from: deployer,
    args: ["0xcF9bBc99342a7704D61b2A06597aEC98D76e9155", "0xded1340A337bDd69aecD7e696D610E9D2F49767f"],
    log: true,
    deterministicDeployment: false,
  });

  const CauldronV2 = await ethers.getContract<CauldronV2>("CauldronV2");

  await CauldronV2.setFeeTo(deployer)
};

export default func;

func.tags = ["CauldronV2"];
func.dependencies = [];
