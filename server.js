const express = require('express');
const mysql = require ('mysql2');
const dotenv = require('dotenv');

// Create an Express application
const app = express();

app.use(express.json());

// Load environment variables from .env file
dotenv.config();

// Connect to the database

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test the database connection
db.connect(err => {
    if (err) {
      console.error('Database connection failed:', err.stack);
      return;
    }
    console.log('Connected to database');
  });
  
// Question 1  Create a GET endpoint to retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving patients:', err);
        res.status(500).send('Error retrieving patients');
        return;
      }
      res.json(results);
    });
  });
  

// Question 2: Create a GET endpoint to retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving providers:', err);
        res.status(500).send('Error retrieving providers');
        return;
      }
      res.json(results);
    });
  });
  

// Question 3: Create a GET endpoint to filter patients by first name
app.get('/patients/filter', (req, res) => {
    // Get the first_name from the query parameters
    const { first_name } = req.query; 
  
    // Check if the first_name parameter is provided
    if (!first_name) {
      return res.status(400).send('Please provide a first name');
    }
  
    // SQL query to filter patients by first name
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  
    // Execute the query with the provided first_name
    db.query(query, [first_name], (err, results) => {
      if (err) {
        console.error('Error retrieving patients by first name:', err);
        res.status(500).send('Error retrieving patients');
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send('No patients found with the given first name');
        return;
      }
      
      // To display the results of a filter
      res.json(results); 
    });
  });
  

// Question 4: Create a GET endpoint to retrieve providers by their specialty
app.get('/providers/filter', (req, res) => {
    // Get the provider_specialty from the query parameters
    const { provider_specialty } = req.query; 
  
    // Check if the provider_specialty parameter is provided
    if (!provider_specialty) {
      return res.status(400).send('Please provide a provider specialty');
    }
  
    // SQL query to filter providers by specialty
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  
    // Execute the query with the provided provider_specialty
    db.query(query, [provider_specialty], (err, results) => {
      if (err) {
        console.error('Error retrieving providers by specialty:', err);
        res.status(500).send('Error retrieving providers');
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send('No providers found with the given specialty');
        return;
      }
      
      // Return the filtered list
      res.json(results); 
    });
  });
  

// listen to the server
const PORT = 3300
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)
})