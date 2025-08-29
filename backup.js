const express = require("express");
const mongodb = require("mongodb");
const app = express();

app.use(express.json());
const connectionUrl = "mongodb://localhost:27017";
const client = new mongodb.MongoClient(connectionUrl);

client
  .connect()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

const db = client.db("schoolDb");
const student = db.collection("students");

// add student
app.post("/student", (req, res, next) => {
    
  student
    .insertMany(req.body)
    .then(() => res.status(200).send("Data added successfully"))
    .catch((err) => res.status(500).send(err.message));
}); 

// get student
app.get("/student", (req, res, next) => {
    const {address} = req.query
    
    student
      .find({ address: address })
      .toArray()
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).send(err.message));
})

// update student
app.put("/student", (req, res, next) => {
  const { age } = req.query;
  const { address} = req.body;
  student
    .updateMany(
      { age:parseInt(age) },
      { $set: { address } }
    )
    .then((data) => {
      console.log(data);
      res.status(200).json({
        message: "Data updated successfully"
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// delete single data student
// app.delete("/student", (req, res, next) => {
//   const {email} = req.query;
//   student
//     .findOneAndDelete({email: email })
//     .then(() => res.status(200).json({message: "Data deleted successfully"}))
//     .catch((err) => res.status(500).json({message: err.message }));
// });

// delet multiple data
app.delete("/student", (req, res, next) => {
  const {age} = req.query;
  
  student.deleteMany({age: parseInt(age)}).then(() => {
    res.status(200).json({
      message: "Data deleted successfully",
    })
  }).catch((err) => {
    res.status(500).json({
      message: err.message
    });
  })
});

const errorMiddleware = (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send(error.message);
};

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
