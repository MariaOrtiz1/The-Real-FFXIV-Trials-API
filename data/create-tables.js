const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );           
                CREATE TABLE trials (
                  id SERIAL PRIMARY KEY NOT NULL,
                  name VARCHAR(512) NOT NULL,
                  level INTEGER NOT NULL,
                  item_level INTEGER NOT NULL,
                  boss VARCHAR(512) NOT NULL,
                  party_size VARCHAR(512) NOT NULL,
                  tome_stones VARCHAR(512) NOT NULL,
                  loot VARCHAR(512) NOT NULL,
                  expansion VARCHAR(512) NOT NULL,
                  owner_id INTEGER NOT NULL REFERENCES users(id)
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
