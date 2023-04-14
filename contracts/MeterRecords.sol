pragma solidity ^0.8.0;

contract MeterRecords {
    struct MeterRecord {
        string time;
        string vplus;
        string qv;
        string vminus;
        string cputemp;
    }
    
    MeterRecord[] public records;
    
    function addRecord(string memory _time, string memory _vplus, string memory _qv, string memory _vminus, string memory _cputemp) public {
        MeterRecord memory newRecord = MeterRecord(_time, _vplus, _qv, _vminus, _cputemp);
        records.push(newRecord);
    }
    
    function getRecord(uint256 _index) public view returns (string memory, string memory, string memory, string memory, string memory) {
        require(_index < records.length, "Invalid index");
        MeterRecord memory record = records[_index];
        return (record.time, record.vplus, record.qv, record.vminus, record.cputemp);
    }
    
    function getRecordCount() public view returns (uint256) {
        return records.length;
    }
}
