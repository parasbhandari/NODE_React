import React, { useState, useEffect } from 'react';
import Items from './Items';

function Todo() {
  const [items, setItems] = useState([]);
  const [todo, setTodo] = useState({
    title: '',
    description: '',
  });

  // Fetch data from the backend
  const fetchTodos = () => {
    fetch('http://localhost:3000/')
      .then((response) => response.json())
      .then((data) => {
        setItems(data); // Update the state with fetched todos
      })
      .catch((err) => {
        console.log('Error fetching data:', err);
      });
  };

  useEffect(() => {
    fetchTodos(); // Fetch todos on component mount
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodo({
      ...todo,
      [name]: value,
    });
  };

  // Validate Input
  const validateInput = (todo) => {
    const { title, description } = todo;
    if (!title || !description) {
      alert('Please provide both title and description');
      return false;
    }
    return true;
  };

  // Add Todo
  const addTodo = () => {
    if (validateInput(todo)) {
      fetch('http://localhost:3000/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      })
        .then((response) => response.json())
        .then(() => {
          fetchTodos(); // Refresh the list after adding a new todo
          setTodo({ title: '', description: '' }); // Clear the input fields
        })
        .catch((err) => {
          console.log('Error adding todo:', err);
        });
    }
  };

  return (
    <div>
      <div className="heading">
        <h1>Todo App</h1>
      </div>
      <div className="todo_details">
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={todo.title}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={todo.description}
          onChange={handleChange}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <div>
        {items.map((item) => (
          <Items
            key={item._id}
            id={item._id}
            title={item.title}
            description={item.description}
            refreshTodos={fetchTodos} // Pass the refresh function
          />
        ))}
      </div>
    </div>
  );
}

export default Todo;
