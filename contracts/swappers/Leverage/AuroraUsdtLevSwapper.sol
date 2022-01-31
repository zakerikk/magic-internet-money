// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Pair.sol";
import "@sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Router01.sol";
import "../../libraries/Babylonian.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transfer(address recipient, uint256 amount) external returns (bool);
}

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

contract AuroraUsdtLevSwapper {
    IBentoBoxV1 public constant DEGENBOX = IBentoBoxV1(0xcF9bBc99342a7704D61b2A06597aEC98D76e9155);
    IUniswapV2Pair public constant AURORAUSDT = IUniswapV2Pair(0x60F49DA40230C67Aaa471685C66400C28b438FBC);
    IUniswapV2Pair public constant MIMAURORA = IUniswapV2Pair(0x618b11074D2E41fAd4eA20424fD512742866F277);
    IUniswapV2Router01 public constant ROUTER = IUniswapV2Router01(0x26ec2aFBDFdFB972F106100A3deaE5887353d9B9);

    uint256 private constant DEADLINE = 0xf000000000000000000000000000000000000000000000000000000000000000; // ~ placeholder for swap deadline

    IERC20 public constant MIM = IERC20(0xcDc61EDF7F1E2D89dd22F39eF442a29018AA5d82);
    IERC20 public constant AURORA = IERC20(0xaDeE31e4643D8891CaC9328B93BE002373428947);
    IERC20 public constant USDT = IERC20(0xfa1Ee6A11A8Ac851dEd1EF449878d1eE20D135EC);

    constructor() {
        AURORAUSDT.approve(address(DEGENBOX), type(uint256).max);
        AURORA.approve(address(ROUTER), type(uint256).max);
        USDT.approve(address(ROUTER), type(uint256).max);
    }

    function _calculateSwapInAmount(uint256 reserveIn, uint256 userIn) internal pure returns (uint256) {
        return (Babylonian.sqrt(reserveIn * ((userIn * 3988000) + (reserveIn * 3988009))) - (reserveIn * 1997)) / 1994;
    }

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
    function swap(
        address recipient,
        uint256 shareToMin,
        uint256 shareFrom
    ) public returns (uint256 extraShare, uint256 shareReturned) {
        (uint256 amountFrom, ) = DEGENBOX.withdraw(MIM, address(this), address(this), 0, shareFrom);

        // Swap MIM to AURORA
        (uint256 reserve0, uint256 reserve1, ) = MIMAURORA.getReserves();
        uint256 auroraFromMim = _getAmountOut(amountFrom, reserve0, reserve1);
        MIM.transfer(address(MIMAURORA), amountFrom);
        MIMAURORA.swap(0, auroraFromMim, address(this), new bytes(0));

        // Determine optimal amount of AURORA to swap for liquidity providing
        (reserve0, reserve1, ) = AURORAUSDT.getReserves();
        uint256 auroraSwapInAmount = _calculateSwapInAmount(reserve0, auroraFromMim);
        uint256 usdtAmount = _getAmountOut(auroraSwapInAmount, reserve0, reserve1);
        AURORA.transfer(address(AURORAUSDT), auroraSwapInAmount);
        AURORAUSDT.swap(0, usdtAmount, address(this), "");

        ROUTER.addLiquidity(
            address(AURORA),
            address(USDT),
            AURORA.balanceOf(address(this)),
            USDT.balanceOf(address(this)),
            1,
            1,
            address(this),
            DEADLINE
        );

        (, shareReturned) = DEGENBOX.deposit(IERC20(address(AURORAUSDT)), address(this), recipient, AURORAUSDT.balanceOf(address(this)), 0);
        extraShare = shareReturned - shareToMin;
    }
}
