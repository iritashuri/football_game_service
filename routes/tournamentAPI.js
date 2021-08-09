const express = require('express');

const consts = require('../consts.js');
const data_module = require('../modules/data.js');
const API_module = require('../modules/API.js');

const router = express.Router();

router.use('/', (req, res) => {
    if (!req.query.tournament)
        return res.json(API_module.createAPIResponse(true, 'Missing tournament parameter'));

    let tournament_uuid = data_module.tournament_to_UUID[req.query.tournament];
    let matches = data_module.matches_by_tournament[tournament_uuid];
    let payload;

    // Played AND Upcoming case - need to concat both lists
    if (!req.query.status)
        payload = matches[consts.PLAYED].concat(matches[consts.UPCOMING]);

    // Played OR Upcoming case
    else {
        if ((req.query.status !== consts.UPCOMING) && (req.query.status !== consts.PLAYED))
            return res.json(API_module.createAPIResponse(true, `Unknown status: ${req.query.status}`))

        else {
            type = (req.query.status === consts.UPCOMING) ? consts.UPCOMING : consts.PLAYED;
            payload = matches[type];
        }
    }

    return res.json(API_module.createAPIResponse(null, payload));
});

module.exports = router;