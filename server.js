const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

const dataFilePath = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Helper to read data
function readData() {
    if (!fs.existsSync(dataFilePath)) return [];
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data || '[]');
}

// Helper to write data
function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Get all expenses
app.get('/expenses', (req, res) => {
    const data = readData();
    res.json(data);
});

// Add a new expense
app.post('/expenses', (req, res) => {
    const { category, amount, date } = req.body;
    const data = readData();

    const newExpense = {
        id: Date.now(),
        category,
        amount,
        date
    };

    data.push(newExpense);
    writeData(data);

    res.status(201).json(newExpense);
});

// Delete an expense
app.delete('/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let data = readData();

    data = data.filter(exp => exp.id !== id);
    writeData(data);

    res.status(200).json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
