const client = require('../lib/client');
// import our seed data:
const trials = require('./trials.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      trials.map(trial => {
        return client.query(`
        INSERT INTO trials (name, level, itemLevel, boss, partySize, tomeStones, loot, expansion, owner_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
                `,
        [trial.name, trial.level, trial.itemLevel, trial.boss, trial.partySize, trial.tomeStones, trial.loot, trial.expansion, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
