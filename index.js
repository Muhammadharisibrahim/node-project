const { name } = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const connectionUrl = "mongodb://localhost:27017/schoolDb";
mongoose
  .connect(connectionUrl)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

const studentsSchema = mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  address: String,
});

const Student = mongoose.model("student", studentsSchema);

// add student
app.post("/student/single", async(req, res, next) => {
  try{
    const {name, email, age, address} = req.body;
    const newStudent = new Student({name, email, age, address});
    await newStudent.save();
    res.status(200).json({message: "Data added successfully"})
  }
  catch(err){
    res.status(500).json({message: err.message})
  }
  
})

app.post("/student/multiple", async(req, res, next) => {
  try {
    await Student.insertMany(req.body);

    res.status(200).json({message: "Data added successfully"})
  } catch (error) {
    res.status(500).json({message: err.message})
  }
})

// uodate student
app.put("/student/single", async(req, res, next) => {
  try {
    const {email} = req.query;
    const{address} = req.body
    await Student.findOneAndUpdate({email},{address})

    res.status(200).json({message: "Data updated successfully"})
  } catch (error) {
    res.status(500).json({message: err.message})
  }
})


app.put("/student/single/:id", async(req, res, next) => {
  try {
    const {id} = req.params
    const {address} = req.body;
    
    const student= await Student.findById(id);
    student.address = address;
    await student.save();

    res.status(200).json({message: "Data updated successfully"})
  } catch (error) {
    res.status(500).json({message: err.message})
  }
})

const errorMiddleware = (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send(error.message);
};

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
