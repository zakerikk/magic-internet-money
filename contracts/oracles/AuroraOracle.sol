// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "../interfaces/IOracle.sol";

// Flux Aggregator

interface IAggregator {
    function latestAnswer() external view returns (int256 answer);
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

contract AuroraOracle is IOracle {
    IAggregator constant public AURORAUSD = IAggregator(0x8Cda9621b6D0401EBFaf3c71bc28BFc9fE99CdE5);

    // Calculates the lastest exchange rate
    // Uses both divide and multiply only for tokens not supported directly by Flux, for example MKR/USD
    function _get() internal view returns (uint256) {

        return 1e26 / uint256(AURORAUSD.latestAnswer());
    }

    // Get the latest exchange rate
    /// @inheritdoc IOracle
    function get(bytes calldata) public view override returns (bool, uint256) {
        return (true, _get());
    }

    // Check the last exchange rate without any state changes
    /// @inheritdoc IOracle
    function peek(bytes calldata) public view override returns (bool, uint256) {
        return (true, _get());
    }

    // Check the current spot exchange rate without any state changes
    /// @inheritdoc IOracle
    function peekSpot(bytes calldata data) external view override returns (uint256 rate) {
        (, rate) = peek(data);
    }

    /// @inheritdoc IOracle
    function name(bytes calldata) public pure override returns (string memory) {
        return "Flux Aurora";
    }

    /// @inheritdoc IOracle
    function symbol(bytes calldata) public pure override returns (string memory) {
        return "FLUX/Aurora";
    }
}
