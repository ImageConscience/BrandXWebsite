const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit-lead', (req, res) => {
  const lead = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    website: req.body.website,
    message: req.body.message,
    date: new Date()
  };
  // Store in JSON file
  let leads = [];
  if (fs.existsSync('leads.json')) {
    leads = JSON.parse(fs.readFileSync('leads.json'));
  }
  leads.push(lead);
  fs.writeFileSync('leads.json', JSON.stringify(leads, null, 2));
  res.send('Thank you for your interest! We will contact you soon.');
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});