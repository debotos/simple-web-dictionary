app.get('/api/data', async (req, res, next) => {
  try {
    const db = await dbPromise;
    console.log('Connected to the dictionary database.');
    const [english, others] = await Promise.all([
      db.all('SELECT * FROM eng'),
      db.all('SELECT * FROM other')
    ]);
    // Declare those var EnglishWords, BanglaWords, Definations, Utterings, Examples
    english.forEach(singleWord => {
      EnglishWords.push(singleWord.word);
    });
    others.forEach(singleWord => {
      BanglaWords.push(singleWord.word);
    });
    others.forEach(singleWord => {
      Utterings.push(singleWord.tr);
    });
    others.forEach(singleWord => {
      Definations.push(singleWord.def);
    });
    others.forEach(singleWord => {
      Examples.push(singleWord.exm);
    });
    console.log('Sending Dictionary Data');
    res.json({
      EnglishWords: EnglishWords,
      BanglaWords: BanglaWords,
      Definations: Definations,
      Utterings: Utterings,
      Examples: Examples
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/data/oten', async (req, res, next) => {
  try {
    const db = await dbPromise;
    const [oten] = await Promise.all([
      db.all('SELECT * FROM oten WHERE serial=2')
    ]);
    res.json({
      oten: oten
    });
  } catch (err) {
    next(err);
  }
});
