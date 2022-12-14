const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors =  require('cors')
const axios = require('axios')

const app = express();
const port = 4001;


app.use(bodyParser.json());
app.use(cors())


const commentsByPostBiId = {}

app.get("/posts/:id/comments", (req, res) => {
    res.send(commentsByPostBiId[req.params.id] || [])
});

app.post("/posts/:id/comments",async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const {content} =  req.body

    const comments = commentsByPostBiId[req.params.id] || [];

    comments.push({id:commentId,content,status:'pending'});

    commentsByPostBiId[req.params.id] = comments;

    await axios.post(`http://localhost:4005/events`,{
      type:'CommentCreated',
      data:{
        id :commentId,
        content,
        postId:req.params.id,
        status:'pending'
      }
    });


    res.status(201).send(comments)
});

app.post('/events',async (req,res) => {
  console.log('Event Recieved: ', req.body.type)

  const {type, data} = req.body

  if(type === 'CommentModerated'){
    const { postId ,id, status , content} = data
    const comments = commentsByPostBiId[postId]

    const comment = comments.find(comment => {
      return comment.id === id;
    })

    comment.status = status

    await axios.post(`http://localhost:4005/events`,{
      type: 'CommentUpdated',
      data: {
        id,
        status:comment.status,
        postId,
        content
      }
    })

    
  }

  res.send({})
})

app.listen(port, () => {
  console.log(`Comments server is up on the port: ${port}`);
});
