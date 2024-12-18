import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
const port = 3000;
app.use(cors());
// Middleware to parse the body of incoming requests as JSON
app.use(express.json()); 

// Connect to the MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.4")
  .then(() => {
    console.log('Connected to Database');
  })
  .catch(err => {
    console.error('Error while connecting to database', err);
  });

// Define the schema and model for Todo
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Todo = mongoose.model('Todo', todoSchema);

// Get all todos from the database
app.get('/', (req, res) => {
  Todo.find()
    .then((todos) => res.json(todos))
    .catch(err => res.status(500).json({ message: 'Error retrieving todos', error: err }));
});

// Add a new todo to the database
app.post('/add', (req, res) => {
  const { title, description } = req.body;
  
  if (title && description) {
    const newTodo = new Todo({
      title,
      description,
    });

    newTodo.save()
      .then(() => {
        res.status(201).json({ message: 'New todo saved successfully', newTodo });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Error while saving todo', error: err });
      });
  } else {
    res.status(400).json({ message: 'Please provide title and description' });
  }
});

// Update an existing todo by its ID
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  Todo.findByIdAndUpdate(id, { title, description }, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(400).json({ message: 'Todo Not Found' });
      }
      res.status(200).json({ message: 'Todo Updated Successfully', updatedTodo });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error while updating todo', error: err });
    });
});

// Delete a todo by its ID
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  Todo.findByIdAndDelete(id,{new: true})
    .then((todoAfterDeletion) => {
      res.status(200).json({ message: 'Todo Deleted Successfully', todoAfterDeletion });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error while deleting todo', error: err });
    });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
