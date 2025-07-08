import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleLogin = async () => {
    try {
      await axios.post('/api/login', { username, password });
      setUser(username);
      setLoggedIn(true);
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
    setUser('');
    setNotes([]);
  };

  const fetchNotes = async () => {
    const res = await axios.get('/api/notes');
    setNotes(res.data);
  };

  const addNote = async () => {
    await axios.post('/api/notes', { title, content });
    setTitle('');
    setContent('');
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`/api/notes/${id}`);
    fetchNotes();
  };

  useEffect(() => {
    if (loggedIn) fetchNotes();
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="login-container">
        <h1>Digital Notes Keeper</h1>
        <div className="login-box">
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h2>Welcome, {user} 👋</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>
      <h1>Digital Notes Keeper</h1>
      <div className="note-input">
        <input type="text" placeholder="Note Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Note Content" value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={addNote}>Add Note</button>
      </div>
      <div className="notes-grid">
        {notes.map(note => (
          <div key={note.id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
