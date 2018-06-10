const express = require('express');
const sqlite = require('sqlite');
const Promise = require('bluebird');

const mergeTwoArrayContent = require('./utility/helper');

const app = express();

const dbPromise = sqlite.open('./db/database.db', { Promise });

app.get('/api/eTob/:eng', async (req, res, next) => {
  try {
    const wordToSearch = req.params.eng.toUpperCase();
    console.log('Searching for => ', wordToSearch);

    const db = await dbPromise;
    // console.log('Connected to the dictionary database.');
    const english = await db.all(
      `SELECT * FROM eng WHERE word LIKE "${wordToSearch}%" LIMIT 5`
    );
    // const english have something like => [{serial: 48141, word: 'DOG'}, {}, {}]
    // Iterate through english array and create query
    const queries = [];
    english.forEach(singleItem => {
      queries.push(`SELECT * FROM other WHERE serial= ${singleItem.serial}`);
    });
    // search singleItem serial in other table
    const other = await Promise.all(
      queries.map(singleQuery => db.get(singleQuery))
    );
    res.json(mergeTwoArrayContent(english, other));
  } catch (err) {
    next(err);
  }
});

app.get('/api/bToe/:bangla', async (req, res, next) => {
  try {
    const wordToSearch = req.params.bangla.toUpperCase();
    console.log('Searching for => ', wordToSearch);

    const db = await dbPromise;
    // console.log('Connected to the dictionary database.');
    const other = await db.all(
      `SELECT * FROM other WHERE word LIKE "${wordToSearch}%" LIMIT 5`
    );
    const queries = [];
    other.forEach(singleItem => {
      queries.push(`SELECT * FROM eng WHERE serial= ${singleItem.serial}`);
    });
    const english = await Promise.all(
      queries.map(singleQuery => db.get(singleQuery))
    );
    res.json(mergeTwoArrayContent(english, other));
  } catch (err) {
    next(err);
  }
});

app.get('/api/exact/eTob/:eng', async (req, res, next) => {
  try {
    const wordToSearch = req.params.eng.toUpperCase();
    console.log('Searching Exact for => ', wordToSearch);

    const db = await dbPromise;
    // console.log('Connected to the dictionary database.');
    const english = await db.all(
      `SELECT * FROM eng WHERE word = "${wordToSearch}"`
    );
    // const english have something like => [{serial: 48141, word: 'DOG'}, {}, {}]
    // Iterate through english array and create query
    const queries = [];
    english.forEach(singleItem => {
      queries.push(`SELECT * FROM other WHERE serial= ${singleItem.serial}`);
    });
    // search singleItem serial in other table
    const other = await Promise.all(
      queries.map(singleQuery => db.get(singleQuery))
    );
    res.json(mergeTwoArrayContent(english, other));
  } catch (err) {
    next(err);
  }
});

app.get('/api/exact/bToe/:bangla', async (req, res, next) => {
  try {
    const wordToSearch = req.params.bangla.toUpperCase();
    console.log('Searching Exact for => ', wordToSearch);

    const db = await dbPromise;
    // console.log('Connected to the dictionary database.');
    const other = await db.all(
      `SELECT * FROM other WHERE word = "${wordToSearch}"`
    );
    const queries = [];
    other.forEach(singleItem => {
      queries.push(`SELECT * FROM eng WHERE serial= ${singleItem.serial}`);
    });
    const english = await Promise.all(
      queries.map(singleQuery => db.get(singleQuery))
    );
    res.json(mergeTwoArrayContent(english, other));
  } catch (err) {
    next(err);
  }
});

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
