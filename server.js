require('dotenv').config();
require('./lib/client').connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   // eslint-disable-next-line no-console
//   console.log(`Started on ${PORT}`);
// });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${PORT}`);
});

