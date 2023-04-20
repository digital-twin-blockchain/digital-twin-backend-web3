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


/**
 * 
 * WEB3 Endpoints
 */


// Define a POST endpoint for adding meter records
app.post('/meter/:category', async (req, res) => {
  try {

    const category = req.params.category;

    if(category!="b1" && category!="b2" && category!="g")
    {
        res.send("Boys/Girls Only");
        return;
    }

    const { time, vplus, qv, vminus, cputemp } = req.body;


    if(category=="b1")
    {
      const receipt = await contract.methods.addRecordB1(time, vplus, qv, vminus, cputemp)
      .send({ from: account,gas:1000000});

      res.json(receipt);
    }
    else if(category=="b2")
    {
      const receipt = await contract.methods.addRecordB2(time, vplus, qv, vminus, cputemp)
      .send({ from: account,gas:1000000});

      res.json(receipt);
    }
    else if(category=="g")
    {
      const receipt = await contract.methods.addRecordG(time, vplus, qv, vminus, cputemp)
      .send({ from: account,gas:1000000});

      res.json(receipt);
    }

  } catch (error) {

    console.error(error);
    res.status(500).send('Error adding meter record');

  }
});



// Define an endpoint to get all records from blockchain
app.get('/api/web3/getall', async (req, res) => {
  try {

    const records = await contract.methods.getAllRecordsB1().call();

    res.json(records);

  } catch (error) {

    console.error(error);
    res.status(500).send('Error fetching records');

  }
});


// Define an endpoint to get record at index from blockchain
app.get('/api/web3/get/:index', async (req, res) => {
  try {
    const no = req.params.index;

    const ln = await contract.methods.getRecordCountB1().call();

    if(no>=ln) 
    {
       res.send(`Total Index = ${ln} Index Requested = ${no}`);
       return;
    }

    const record = await contract.methods.getRecordB1(nos).call();

    res.json(record);

  } catch (error) {

    console.error(error);
    res.status(500).send('Error fetching records');

  }
});


// Define an endpoint to get last n records from blockchain
app.get('/api/web3/getlast/:no', async (req, res) => {
  try {

    const no = req.params.no;

    const ln = await contract.methods.getRecordCountB1().call();
    
    let records = [];

    for(let i=ln-1;i>=Math.max(0,ln-no);i--)
    {
      const record = await contract.methods.getRecordB1(i).call();
      records.push(record);
    }

    res.json(records);

  } catch (error) {

    console.error(error);
    res.status(500).send('Error fetching records');

  }
});



/**
 *  Web2 Endpoints
 */


//Get Past Days (noDays) Data (Here Category=> boys, girls)
app.get('/api/:category/past/:noDays',(req,res)=>{

    const category = req.params.category;
    const n = parseInt(req.params.noDays);

    if(category!="boys" && category!="girls")
    {
        res.send("Boys/Girls Only")
        return
    }


    try {

      const rows = [];
      fs.createReadStream(`data/${category}.csv`)
        .pipe(csv())
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          const lastNRows = rows.slice(-n);
          res.send(lastNRows);
        });
      
    } catch (err) {
      
      res.send("Some Error Occured");
    }



});

//Get Future Data (Here Category=> boys, girls)
app.get('/api/:category/future',(req,res)=>{

 
  // const n = parseInt(req.params.noDays);

  const category = req.params.category;

  if(category!="boys" && category!="girls")
  {
      res.send("Boys/Girls Only")
      return
  }

  const rows = [];
  fs.createReadStream(`data/${category}_future.csv`)
    .pipe(csv())
    .on('data', (row) => {
      rows.push(row);
    })
    .on('end', () => {
      // const lastNRows = rows.slice(-n);
      res.send(rows);
    });

});



//Get todays Data (Here Category=> b1,b2,g)
app.get('/api/:category/current',(req,res)=>{
    const category = req.params.category;

    if(category!="b1" && category!="b2" && category!="g")
    {
        res.send("Boys/Girls Only")
        return
    }


    const rows = [];
    fs.createReadStream(`data/present/raw_today_${category}_block.csv`)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        // const lastNRows = rows.slice(-n);
        res.send(rows);
      });
});


app.all('*',(req,res)=>{
  res.send("Not found 404")
})


app.listen(3000, () => {
  console.log('App listening on port 3000');
});