const MeterRecords = artifacts.require("MeterRecords");

module.exports = function(deployer) {
  deployer.deploy(MeterRecords);
};
