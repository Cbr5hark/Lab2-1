import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const DATA_FILE = './students.json';
const XML_FILE = './students.xml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function saveXMLfile(students) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<students>\n`;
    students.forEach(student => {
        xml += `  <student>\n`;
        xml += `    <id>${student.id}</id>\n`;
        xml += `    <firstname>${student.firstname}</firstname>\n`;
        xml += `    <lastname>${student.lastname}</lastname>\n`;
        xml += `    <phone>${student.phone}</phone>\n`;
        xml += `    <email>${student.email}</email>\n`;
        xml += `    <group>${student.group}</group>\n`;
        xml += `    <sex>${student.sex}</sex>\n`;
        xml += `  </student>\n`;
    });
    xml += `</students>`;
    fs.writeFileSync(XML_FILE, xml);
}

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
    next()
});
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/students', (req, res) => {
    const data = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : [];
    res.json(data);
});

app.post('/students', (req, res) => {
    const newStudent = req.body;
    const students = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : [];
    newStudent.id = Date.now();
    students.push(newStudent);

    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));

    saveXMLfile(students)
    
    res.status(201).json(newStudent);
});

app.delete('/students/:id', (req, res) => {
    let students = JSON.parse(fs.readFileSync(DATA_FILE));
    const id = parseInt(req.params.id);
    students = students.filter(s => s.id !== id);

    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));

    saveXMLfile(students)
    
    res.sendStatus(204);
});

app.put('/students/:id', (req, res) => {
    let students = JSON.parse(fs.readFileSync(DATA_FILE));
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = { ...students[index], ...req.body };

        fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));

        saveXMLfile(students)
        
        res.json(students[index]);
    } else {
        res.sendStatus(404);
    }
});

app.get('/download/json', (req, res) => {
    res.download(DATA_FILE);
});

app.get('/download/xml', (req, res) => {
    res.download(XML_FILE);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
