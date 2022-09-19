const express = require('express')
const bodyParser =  require('body-parser')
const cors =  require('cors')
const axios = require('axios')

const app = express() 
const port = 4002

app.use(bodyParser.json())
app.use(cors())

const posts = {}
//QUICK EXAMPLE 

// posts ===
//   {
//     j123j42: {
//       id: "j123j42",
//       title: "post title",
//       comments: [{ id: "klj3kl", content: "comment!" }],
//     },
//     j123j42: {
//       id: "j123j42",
//       title: "post title",
//       comments: [{ id: "klj3kl", content: "comment!" }],
//     },
//   };

const handleEvent = (type,data) => {
    if (type === "PostCreated") {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
    }
    if (type === "CommentCreated") {
      const { id, content, postId, status } = data;
      let post = posts[postId];
      post.comments.push({ id, content, status });
    }

    if (type === "CommentUpdated") {
      const { id, content, postId, status } = data;
      const post = posts[postId];
      const comment = post.comments.find((comment) => {
        return comment.id === id;
      });

      comment.status = status;
      comment.content = content;
    }
}


app.get('/posts',(req,res)=>{
    res.send(posts)
})

app.post('/events',(req,res) => {
    const { type, data } = req.body;
    // console.log(posts)
    handleEvent(type,data);

    res.send({});
})


app.listen(port, async() => {
    console.log(`Query server is up on port :${port}`)
    try {
      const res = await axios.get("http://localhost:4005/events");

      for (let event of res.data) {
        console.log("Processing event:", event.type);

        handleEvent(event.type, event.data);
      }
    } catch (error) {
      console.log(error.message);
    }
})