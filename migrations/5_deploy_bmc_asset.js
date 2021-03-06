const BMCAssetProxy = artifacts.require("./BMCAssetProxy.sol");
const BMCPlatform = artifacts.require("./BMCPlatform.sol");
const BMC = artifacts.require("./BMC.sol");

module.exports = function(deployer,network) {
    const BMC_SYMBOL = 'BMC';
    const BMC_NAME = 'Blackmoon Crypto Token';
    const BMC_DESCRIPTION = 'BMC blackmooncrypto.com asset';

    const BASE_UNIT = 8;
    const IS_REISSUABLE = true;
    const IS_NOT_REISSUABLE = false;

    const VALUE = 6000000000000000; // 30M * 2 * 10^8

    // Final ICO result
    const ICO_USD = 30000000;
    const ICO_ETH = 73175;
    const ICO_BTC = 1142;
    const ICO_LTC = 32866;

    deployer
      .then(() => BMCPlatform.deployed())
      .then(_platform => platform = _platform)
      .then(() => platform.issueAsset(BMC_SYMBOL, VALUE, BMC_NAME, BMC_DESCRIPTION, BASE_UNIT, IS_NOT_REISSUABLE))
      .then(() => deployer.deploy(BMCAssetProxy))
      .then(() => BMCAssetProxy.deployed())
      .then(_proxy => platform.setProxy(_proxy.address,BMC_SYMBOL))
      .then(() => BMCAssetProxy.deployed())
      .then(_proxy => _proxy.init(BMCPlatform.address, BMC_SYMBOL, BMC_NAME))
      .then(() => deployer.deploy(BMC))
      .then(() => BMC.deployed())
      .then(_asset => _asset.initBMC(BMCAssetProxy.address,ICO_USD,ICO_ETH,ICO_BTC,ICO_LTC))
      .then(() => BMCAssetProxy.deployed())
      .then(_proxy => _proxy.proposeUpgrade(BMC.address))
      .then(() => console.log("[MIGRATION] [5] BMC ASSET: #done"))
}
