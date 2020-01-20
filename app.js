const express = require('express'),
  app = express(),
  mongoose = require('mongoose');

require('dotenv').config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log('Server has successfully connected to database')
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Api rodando');
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
