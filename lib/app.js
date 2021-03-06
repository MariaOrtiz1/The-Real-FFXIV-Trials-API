const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const trials = require('../data/trials');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/trials', async(req, res) => {
  try {
    const data = await client.query('SELECT * from trials');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/trials/:id', (req, res) => {   
  const id = Number(req.params.id);

  const trial = trials.find((singleTrial) => singleTrial.id === id);
  res.json(trial);
});

app.post('/trials', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO trials (name, level, item_level, boss, party_size, tome_stones, loot, expansion, owner_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1)
    RETURNING *`, [req.body.name, req.body.level, req.body.item_level, req.body.boss, req.body.party_size, req.body.tome_stones, req.body.loot, req.body.expansion]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.put('/trials/:id', async(req, res) => {
  try {
    const data = await client.query(`
      UPDATE trials
      SET 
          name=$1,
          level=$2,
          item_level=$3,
          boss=$4,
          party_size=$5
          tome_stones=$6
          loot=$7
          expansion=$8
      WHERE id=$9
      RETURNING *
    `, [req.body.name, req.body.level, req.body.item_level, req.body.boss, req.body.party_size, req.body.tome_stones, req.body.loot, req.body.expansion]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.delete('/trials/:id', async(req, res) => {
  try {
    const data = await client.query('DELETE FROM trials WHERE id=$1', [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
