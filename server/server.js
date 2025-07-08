const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');

const getData = (filename) => {
    const dataPath = path.join(dataDir, filename);
    if (!fs.existsSync(dataPath)) return [];
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

const saveData = (filename, data) => {
    const dataPath = path.join(dataDir, filename);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Login API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = getData('users.json');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) return res.json({ success: true });
    res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Notes APIs
app.get('/api/notes', (req, res) => {
    const notes = getData('notes.json');
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const notes = getData('notes.json');
    const newNote = { ...req.body, id: Date.now().toString() };
    notes.push(newNote);
    saveData('notes.json', notes);
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    let notes = getData('notes.json');
    notes = notes.filter(note => note.id !== req.params.id);
    saveData('notes.json', notes);
    res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));