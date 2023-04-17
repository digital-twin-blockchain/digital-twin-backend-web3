const express = require('express');
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');


require('dotenv').config()

const contractJson = fs.readFileSync(path.resolve(__dirname, '../build/contracts/MeterRecords.json'));


const contractABI = JSON.parse(contractJson);


const web3 = new Web3('http://localhost:8560');

const account = process.env.ACCOUNT_ADDRESS;
 
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

const app = express();

app.use(express.json())

// Define a POST endpoint for adding meter records
app.post('/meter', async (req, res) => {
  try {

    const { time, vplus, qv, vminus, cputemp } = req.body;

    const receipt = await contract.methods.addRecord(time, vplus, qv, vminus, cputemp)
      .send({ from: account,gas:1000000});

    res.json(receipt);

  } catch (error) {

    console.error(error);
    res.status(500).send('Error adding meter record');

  }
});

app.get('/api/past/:noDays',(req,res)=>{

 
    const n = parseInt(req.params.noDays);
  
    const rows = [];
    fs.createReadStream('data/boys.csv')
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        const lastNRows = rows.slice(-n);
        res.send(lastNRows);
      });

});


app.listen(3000, () => {
  console.log('App listening on port 3000');
});