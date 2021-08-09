const express = require('express');

const consts = require('./consts.js');
const data_module = require('./modules/data.js');
const teamAPI = require('./routes/teamAPI.js');
const tournamentAPI = require('./routes/tournamentAPI.js');

const app = express();

data_module.init_data();

app.use('/team', teamAPI);
app.use('/tournament', tournamentAPI);

app.listen(consts.PORT, () => {
    console.log(`Listening on port ${consts.PORT}`);
});