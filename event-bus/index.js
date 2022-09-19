const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 4005;

app.use(bodyParser.json());
const events = []

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event)
  try{
    axios.post("http://localhost:4000/events", event).catch((e)=> {
      console.log(e)
    });
  axios.post("http://localhost:4001/events", event).catch((e)=> {
    console.log(e)
  });
  axios.post("http://localhost:4002/events",event).catch((e)=> {
    console.log(e)
  });
  axios.post("http://localhost:4003/events", event).catch((e)=> {
    console.log(e)
  });

  }catch(e){
    console.log(e)
  }


  
  res.send({ status: "OK" });
});

app.get("/events",(req,res) => {
  res.send(events)
})


app.listen(port, () => {
  console.log(`Event-bus server is up on port :${port}`);
});
