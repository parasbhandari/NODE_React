import React from 'react';

function Items({ id, title, description, refreshTodos }) {
  // Function to handle editing a todo
  const editTodo = () => {
    const updatedTitle = prompt('Enter updated title:', title);
    const updatedDescription = prompt('Enter updated description:', description);

    if (updatedTitle && updatedDescription) {
      fetch(`http://localhost:3000/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedTitle,
          description: updatedDescription,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          refreshTodos(); // Refresh the list after updating
        })
        .catch((err) => console.error('Error updating todo:', err));
    }
  };

  // Function to handle deleting a todo
  const deleteTodo = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      fetch(`http://localhost:3000/delete/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => {
          refreshTodos(); // Refresh the list after deleting
        })
        .catch((err) => console.error('Error deleting todo:', err));
    }
  };

  return (
    <div className="items">
      <p><strong>Title:</strong> {title}</p>
      <p><strong>Description:</strong> {description}</p>
      <div className="btn">
        <button onClick={editTodo}>Edit</button>
        <button onClick={deleteTodo}>Delete</button>
      </div>
    </div>
  );
}

export default Items;
