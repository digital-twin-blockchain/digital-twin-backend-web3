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