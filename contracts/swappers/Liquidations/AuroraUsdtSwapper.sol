// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Pair.sol";
import "../../interfaces/ISwapperGeneric.sol";

interface IBentoBoxV1 {
    function withdraw(
        IERC20 token,
        address from,
        address to,
        uint256 amount,
        uint256 share
    ) external returns (uint256, uint256);

    function deposit(
        IERC20 token,
        address from,
        address to,
        uint256 amount,
        uint256 share
    ) external returns (uint256, uint256);
}

contract AuroraUsdtSwapper is ISwapperGeneric {
    IBentoBoxV1 public constant DEGENBOX = IBentoBoxV1(0xcF9bBc99342a7704D61b2A06597aEC98D76e9155);
    IUniswapV2Pair public constant AURORAUSDT = IUniswapV2Pair(0x60F49DA40230C67Aaa471685C66400C28b438FBC);
    IUniswapV2Pair public constant MIMAURORA = IUniswapV2Pair(0x618b11074D2E41fAd4eA20424fD512742866F277);
    IERC20 public constant MIM = IERC20(0xcDc61EDF7F1E2D89dd22F39eF442a29018AA5d82);
    IERC20 public constant AURORA = IERC20(0xaDeE31e4643D8891CaC9328B93BE002373428947);
    IERC20 public constant USDT = IERC20(0xfa1Ee6A11A8Ac851dEd1EF449878d1eE20D135EC);

    constructor() {
        MIM.approve(address(DEGENBOX), type(uint256).max);
    }

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function _getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256 amountOut) {
        uint256 amountInWithFee = amountIn * 997;
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;
    }

    // Swaps to a flexible amount, from an exact input amount
    /// @inheritdoc ISwapperGeneric
    function swap(
        IERC20,
        IERC20,
        address recipient,
        uint256 shareToMin,
        uint256 shareFrom
    ) public override returns (uint256 extraShare, uint256 shareReturned) {
        (uint256 amountFrom, ) = DEGENBOX.withdraw(IERC20(address(AURORAUSDT)), address(this), address(this), 0, shareFrom);

        AURORAUSDT.transfer(address(AURORAUSDT), amountFrom);
        (uint256 auroraAmount, uint256 usdtAmount) = AURORAUSDT.burn(address(this));

        // swap USDT to AURORA
        (uint256 reserve0, uint256 reserve1, ) = AURORAUSDT.getReserves();
        uint256 auroraFromUsdt = _getAmountOut(usdtAmount, reserve1, reserve0);
        USDT.transfer(address(AURORAUSDT), usdtAmount);
        AURORAUSDT.swap(auroraFromUsdt, 0, address(this), new bytes(0));
        auroraAmount += auroraFromUsdt;

        // swap AURORA to MIM
        (reserve0, reserve1, ) = MIMAURORA.getReserves();
        uint256 mimFromAurora = _getAmountOut(auroraAmount, reserve1, reserve0);
        AURORA.transfer(address(MIMAURORA), auroraAmount);
        MIMAURORA.swap(mimFromAurora, 0, address(this), new bytes(0));

        (, shareReturned) = DEGENBOX.deposit(MIM, address(this), recipient, mimFromAurora, 0);
        extraShare = shareReturned - shareToMin;
    }

    // Swaps to an exact amount, from a flexible input amount
    /// @inheritdoc ISwapperGeneric
    function swapExact(
        IERC20,
        IERC20,
        address,
        address,
        uint256,
        uint256
    ) public override returns (uint256 shareUsed, uint256 shareReturned) {
        return (0, 0);
    }
}
