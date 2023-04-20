pragma solidity ^0.8.0;

contract MeterRecords {
    
    struct MeterRecord {
        string time;
        string vplus;
        string qv;
        string vminus;
        string cputemp;
    }

    MeterRecord[] public boys_b1_records;
    MeterRecord[] public boys_b2_records;
    MeterRecord[] public girls_records;

    
    function addRecordB1(string memory _time, string memory _vplus, string memory _qv, string memory _vminus, string memory _cputemp) public {
        MeterRecord memory newRecord = MeterRecord(_time, _vplus, _qv, _vminus, _cputemp);
        boys_b1_records.push(newRecord);
    }

    function addRecordB2(string memory _time, string memory _vplus, string memory _qv, string memory _vminus, string memory _cputemp) public {
        MeterRecord memory newRecord = MeterRecord(_time, _vplus, _qv, _vminus, _cputemp);
        boys_b2_records.push(newRecord);
    }

    function addRecordG(string memory _time, string memory _vplus, string memory _qv, string memory _vminus, string memory _cputemp) public {
        MeterRecord memory newRecord = MeterRecord(_time, _vplus, _qv, _vminus, _cputemp);
        girls_records.push(newRecord);
    }
    

    function getRecordB1(uint256 _index) public view returns (string memory, string memory, string memory, string memory, string memory) {
        require(_index < boys_b1_records.length, "Invalid index");
        MeterRecord memory record = boys_b1_records[_index];
        return (record.time, record.vplus, record.qv, record.vminus, record.cputemp);
    }

    function getRecordB2(uint256 _index) public view returns (string memory, string memory, string memory, string memory, string memory) {
        require(_index < boys_b2_records.length, "Invalid index");
        MeterRecord memory record = boys_b2_records[_index];
        return (record.time, record.vplus, record.qv, record.vminus, record.cputemp);
    }

    function getRecordG(uint256 _index) public view returns (string memory, string memory, string memory, string memory, string memory) {
        require(_index < girls_records.length, "Invalid index");
        MeterRecord memory record = girls_records[_index];
        return (record.time, record.vplus, record.qv, record.vminus, record.cputemp);
    }
    
    function getRecordCountB1() public view returns (uint256) {
        return boys_b1_records.length;
    }

    function getRecordCountB2() public view returns (uint256) {
        return boys_b2_records.length;
    }

    function getRecordCountG() public view returns (uint256) {
        return girls_records.length;
    }


    function getAllRecordsB1() public view returns (MeterRecord[] memory) {
        return boys_b1_records;
    }

    function getAllRecordsB2() public view returns (MeterRecord[] memory) {
        return boys_b2_records;
    }

    function getAllRecordsG() public view returns (MeterRecord[] memory) {
        return girls_records;
    }

    function getLastNRecordsB1(uint256 n) public view returns (MeterRecord[] memory) {
        require(n <= boys_b1_records.length, "n exceeds the number of records");
        
        MeterRecord[] memory lastNRecords = new MeterRecord[](n);
        
        for (uint256 i = 0; i < n; i++) {
            lastNRecords[i] = boys_b1_records[boys_b1_records.length - n + i];
        }
        
        return lastNRecords;
    }


    function getLastNRecordsB2(uint256 n) public view returns (MeterRecord[] memory) {
        require(n <= boys_b2_records.length, "n exceeds the number of records");
        
        MeterRecord[] memory lastNRecords = new MeterRecord[](n);
        
        for (uint256 i = 0; i < n; i++) {
            lastNRecords[i] = boys_b2_records[boys_b2_records.length - n + i];
        }
        
        return lastNRecords;
    }


    function getLastNRecordsG(uint256 n) public view returns (MeterRecord[] memory) {
        require(n <= girls_records.length, "n exceeds the number of records");
        
        MeterRecord[] memory lastNRecords = new MeterRecord[](n);
        
        for (uint256 i = 0; i < n; i++) {
            lastNRecords[i] = girls_records[girls_records.length - n + i];
        }
        
        return lastNRecords;
    }
}
