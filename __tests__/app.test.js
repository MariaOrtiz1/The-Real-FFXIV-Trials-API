require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns trials', async() => {

      const expectation = [{
        id: 1,
        name: 'The Akh Arah Amphitheatre (Hard)',
        level: 50,
        itemLevel: 80,
        boss: 'Shiva',
        partySize: 'Full Party, 8 man',
        tomeStones: '15 Allagan Tomestones of Poetics',
        loot: 'Shiva Card, Ice Tear',
        expansion: 'A Realm Reborn',
      },
      {
        id: 2,
        name: 'The Final Steps of Faith',
        level: 60,
        itemLevel: 205,
        boss: 'Nidhogg',
        partySize: 'Full Party, 8 man',
        tomeStones: '10 Allagan Tomestones of Poetics',
        loot: 'Nidhogg Card',
        expansion: 'Heavensward',
      },
      {
        id: 3,
        name: 'Castrum Fluminis',
        level: 70,
        itemLevel: 335,
        boss: 'Tsukuyomi',
        partySize: 'Full Party, 8 man',
        tomeStones: '12 Allagan Tomestones of Poetics',
        loot: 'Tsukuyomi Card',
        expansion: 'Stormblood',
      },
      {
        id: 4,
        name: 'The Dancing Plague',
        level: 73,
        itemLevel: '0',
        boss: 'Titania',
        partySize: 'Full Party, 8 man',
        tomeStones: '0',
        loot: 'Titania Card',
        expansion: 'Shadowbringers',
      },
      {
        id: 5,
        name: 'The Crown of the Immaculate',
        level: 79,
        itemLevel: '0',
        boss: 'Innocence',
        partySize: 'Full Party, 8 man',
        tomeStones: '0',
        loot: 'Innocence Card',
        expansion: 'Shadowbringers',
      },
      ];

      const data = await fakeRequest(app)
        .get('/trials')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns a single item by id', async() => {

      const expectation = {
        id: 1,
        name: 'The Akh Arah Amphitheatre (Hard)',
        level: 50,
        itemLevel: 80,
        boss: 'Shiva',
        partySize: 'Full Party, 8 man',
        tomeStones: '15 Allagan Tomestones of Poetics',
        loot: 'Shiva Card, Ice Tear',
        expansion: 'A Realm Reborn',
      };

      const data = await fakeRequest(app)
        .get('/trials/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});