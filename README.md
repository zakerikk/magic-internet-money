# Magic Internet Money

It's magic!

# Testing

```
yarn test
```

# License

The Kashi code is licensed from BoringCrypto and is licensed only to Abracadabra.

# Deployments

## Ethereum

### Utilities

| Contract                     | Address                                    | Note                                                                                         |
| ---------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| EthereumWithdrawer           | 0xB2c3A9c577068479B1E5119f6B7da98d25Ba48f4 | Withdraw MIM fees from cauldron and swap for SPELL. Also used as recipient for other chains. |
| **Popsicle USDC/WETH 0.3%**  |                                            |                                                                                              |
| PopsicleUSDCWETHCauldron     | 0xfD5165bD318AB6e18bD0439a736e662986F6C5b2 | 85% LTV .5% initial 3% Interest 8% Fee                                                       |
| PopsicleUSDCWETHProxyOracle  | 0x52B2773FB2f69d565C651d364f0AA95eBED097E4 |                                                                                              |
| PopsicleUSDCWETHOracle       | 0x0D52048451207106184f0423cAF055aE24a5A38A |                                                                                              |
| PopsicleUSDCWETHSwapper      | 0xc97C7F6e60Fdd610A0fCA4792BbBD1dbD028d474 |                                                                                              |
| PopsicleUSDCWETHLevSwapper   | 0x04146736FEF83A25e39834a972cf6A5C011ACEad |                                                                                              |
| **Popsicle USDC/WETH 0.05%** |                                            |                                                                                              |
| PopsicleUSDCWETHCauldron     | 0xab8F52D568ba9B58c296522232240621Cf3f9dDa | 85% LTV .5% initial 3% Interest 8% Fee                                                       |
| PopsicleUSDCWETHProxyOracle  | 0x87A5bF86D6C96775d926F43700c0fD99EE0c2E82 |                                                                                              |
| PopsicleUSDCWETHOracle       | 0x9D72680409b906bf964dBFC89C7c270a88fe4DE6 |                                                                                              |
| PopsicleUSDCWETHSwapper      | 0x0E0E2c6204976bA791fBA95eFbb54f9f76556a57 |                                                                                              |
| PopsicleUSDCWETHLevSwapper   | 0x2cA12e0Ca5c2E1EE8DC18eAA0D24EEd647aE7531 |                                                                                              |
| **Popsicle WETH/USDT 0.3%**  |                                            |                                                                                              |
| PopsicleWETHUSDTCauldron     | 0x08371AAcA536370ffba76e1502E8a476AC3D9691 | 85% LTV .5% initial 3% Interest 8% Fee                                                       |
| PopsicleWETHUSDTProxyOracle  | 0x76c936A0db6EeEb54e615B93a6fAAA9930C02C19 |                                                                                              |
| PopsicleWETHUSDTOracle       | 0x85E8A3087C90992BAdD74BE44F18626b2359F490 |                                                                                              |
| PopsicleWETHUSDTSwapper      | 0xad2f284Db532A57d6940F3A46D875549DCEB030d |                                                                                              |
| PopsicleWETHUSDTLevSwapper   | 0x2906ae98fdAf225a697a09158D10843A89CF0FC5 |                                                                                              |
| **Popsicle WETH/USDT 0.05%** |                                            |                                                                                              |
| PopsicleWETHUSDTCauldron     | 0x5aC11966ca33128c516116b5a597554e9f25ab6f | 85% LTV .5% initial 3% Interest 8% Fee                                                       |
| PopsicleWETHUSDTProxyOracle  | 0xEd5D79F369D878C9038ac156D7D71b6364756f8e |                                                                                              |
| PopsicleWETHUSDTOracle       | 0xE5683f4bD410ea185692b5e6c9513Be6bf1017ec |                                                                                              |
| PopsicleWETHUSDTSwapper      | 0xBd73aA17Ce60B0e83d972aB1Fb32f7cE138Ca32A |                                                                                              |
| PopsicleWETHUSDTLevSwapper   | 0x9Ca03FeBDE38c2C8A2E8F3d74E23a58192Ca921d |                                                                                              |

## BSC

### Utilities

| Contract             | Address                                    | Note |
| -------------------- | ------------------------------------------ | ---- |
| MultichainWithdrawer | 0xB3f5c7D0Ac3944a9d9A9623D6B50bCeA85A26753 |      |

## Fantom

### Utilities

| Contract             | Address                                    | Note |
| -------------------- | ------------------------------------------ | ---- |
| MultichainWithdrawer | 0x7a3b799E929C9bef403976405D8908fa92080449 |      |

## Arbitrum

### Utilities

| Contract             | Address                                    | Note |
| -------------------- | ------------------------------------------ | ---- |
| MultichainWithdrawer | 0x7a3b799E929C9bef403976405D8908fa92080449 |      |

## Avalanche

### Cauldrons

| Contract                    | Address                                    | Note                                  |
| --------------------------- | ------------------------------------------ | ------------------------------------- |
| **AVAX/USDT**               |                                            |                                       |
| AvaxUsdtCauldron            | 0x0a1e6a80E93e62Bd0D3D3BFcF4c362C40FB1cF3D | 85% LTV .5% initial 3% Interest       |
| AvaxUsdtProxyOracle         | 0x2cA12e0Ca5c2E1EE8DC18eAA0D24EEd647aE7531 | Using AvaxUsdtLPOracle                |
| AvaxUsdtLPOracle            | 0xEd5D79F369D878C9038ac156D7D71b6364756f8e | Using AvaxUsdtLPChainlinkOracleV1     |
| AvaxUsdtLPChainlinkOracleV1 | 0xd15f851A912e4Fa9947e6024f16f02Ef25Ff311B | Using AvaxUsdtOracleV1                |
| AvaxUsdtOracleV1            | 0xD43f26102b0671dCf8D6357aA2908D6cC80C0559 | Using Chainlink AVAX/USD and USDT/USD |
| AvaxUsdtSwapper             | 0x9Ca03FeBDE38c2C8A2E8F3d74E23a58192Ca921d | Liquidation Swapper                   |
| AvaxUsdtLevSwapper          | 0x8CEe5B335f450933b4720B5b84e6125d4225FB62 | Leverage Swapper                      |
| **MIM/AVAX**                |                                            |                                       |
| MimAvaxCauldron             | 0x2450Bf8e625e98e14884355205af6F97E3E68d07 | 85% LTV .5% initial 1% Interest       |
| MimAvaxProxyOracle          | 0x15f57fbCB7A443aC6022e051a46cAE19491bC298 | Using MimAvaxLPOracle                 |
| MimAvaxLPOracle             | 0x3e6ef9E97147C266c5bddeF03E7dfba7a167d853 | Using MimAvaxLPChainlinkOracleV1      |
| MimAvaxLPChainlinkOracleV1  | 0xE275ec65fDbB4ECF0142b393402eE90D47359fBf | Using MimAvaxOracleV1                 |
| MimAvaxOracleV1             | 0x4437DB9538eb74C7418a1668766536b279C52709 | Using Chainlink AVAX/USD and MIM/USD  |
| MimAvaxSwapper              | 0xBc00ca0d71231c5E23Ba90A90D8C5D9039C39614 | Liquidation Swapper                   |
| MimAvaxLevSwapper           | 0xBA7fd957ad9b7C0238E6E4413dbA69E83224a582 | Leverage Swapper                      |

### Utilities

| Contract             | Address                                    | Note                                                             |
| -------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| MultichainWithdrawer | 0x2b95bf93B5873c8cB9aE3374e3054736A5b79676 | Withdraw MIM fees from cauldron and bridge to EthereumWithdrawer |

## Boba Network

| Contract | Address                                    | Note |
| -------- | ------------------------------------------ | ---- |
| DegenBox | 0x279D54aDD72935d845074675De0dbcfdc66800a3 |      |

## Moonriver

| Contract | Address                                    | Note |
| -------- | ------------------------------------------ | ---- |
| DegenBox | 0xB734c264F83E39Ef6EC200F99550779998cC812d |      |
