const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'budac',
  port: 3306
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

// Endpointy pro práci s databází
app.get('/classes', (req, res) => {
  db.query('SELECT * FROM classes', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/students/class/:classId', (req, res) => {
  const classId = req.params.classId;
  db.query('SELECT * FROM students WHERE class_id = ?', [classId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/students', (req, res) => {
  const { name, classId } = req.body;
  db.query('INSERT INTO students (name, class_id) VALUES (?, ?)', [name, classId], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Student added' });
  });
});

app.post('/grades', (req, res) => {
  const { studentId, grade, weight, description } = req.body;
  db.query('INSERT INTO grades (student_id, grade, weight, description) VALUES (?, ?, ?, ?)', 
    [studentId, grade, weight, description], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Grade added' });
  });
});

app.get('/grades/student/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  db.query('SELECT * FROM grades WHERE student_id = ?', [studentId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/students/:id/average', (req, res) => {
  const studentId = req.params.id;
  db.query('SELECT AVG(grade * weight / 10) AS average FROM grades WHERE student_id = ?', [studentId], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

app.delete('/grades/:id', (req, res) => {
  const gradeId = req.params.id;
  db.query('DELETE FROM grades WHERE id = ?', [gradeId], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Grade deleted' });
  });
});

app.delete('/students/:id', (req, res) => {
  const studentId = req.params.id;
  db.query('DELETE FROM students WHERE id = ?', [studentId], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Student deleted' });
  });
});
