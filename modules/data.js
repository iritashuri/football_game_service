const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const consts = require('../consts.js');
const { UpcomingMatch, PlayedMatch } = require('../entities/matches.js');

data = {};

data.team_to_UUID = {};                 // Translate team name to team UUID
data.tournament_to_UUID = {};           // Translate tournament name to tournament UUID
data.matches_by_team = {};              // Keep list of played & list of upcoming matches per team UUID
data.matches_by_tournament = {};        // Keep list of played & list of upcoming matches per tournament UUID

data.init_data = () => {
    console.log('Loading data ...');

    for (let [match_type, path_to_csv] of Object.entries(consts.path_to_CSVs))
        init_data_from_file(match_type, path_to_csv);
}

const init_data_from_file = (type, path_to_csv) => {
    fs.readFile(path.join(__dirname, path_to_csv), (err, data) => {
        if (err)
            return console.log(err);

        // Prepare a list of CSV entries (lines) and remove the first line of CSV (headers)
        data = data.toString().split('\r');
        data.shift();

        data.forEach((line) => {
            const values = line.replace('\n', '').split(',');

            // Keep values based on type of CSV
            let teams = (type === consts.UPCOMING) ? [values[0], values[1]] : [values[0], values[2]];
            let tournament = (type === consts.UPCOMING) ? values[2] : values[4];
            let start_date = (type === consts.UPCOMING) ? values[3] : values[5];
            let match;

            // Create the according Match entity
            if (type === consts.UPCOMING) {
                match = new UpcomingMatch(teams[0], teams[1], start_date, tournament, values[4]);
            } else {
                let score = get_score(teams, values[1], values[3]);
                match = new PlayedMatch(teams[0], teams[1], start_date, tournament, score)
            }

            // Import this line
            import_team(teams);
            import_tournament(tournament);
            import_match(match);
        });
    });
};

const import_team = (list_of_teams) => {
    list_of_teams.forEach(team => {
        if (!data.team_to_UUID[team])
            data.team_to_UUID[team] = uuid.v1();
    });
};

const import_tournament = (tournament) => {
    if (!data.tournament_to_UUID[tournament])
        data.tournament_to_UUID[tournament] = uuid.v1();
};

const import_match = (match) => {
    const tournament_uuid = data.tournament_to_UUID[match.tournament];
    const team1_uuid = data.team_to_UUID[match.team1];
    const team2_uuid = data.team_to_UUID[match.team2];
    const teams = [team1_uuid, team2_uuid];
    const new_record_obj = { [consts.UPCOMING]: [], [consts.PLAYED]: [] };

    if (!data.matches_by_tournament[tournament_uuid])
        data.matches_by_tournament[tournament_uuid] = JSON.parse(JSON.stringify(new_record_obj));

    data.matches_by_tournament[tournament_uuid][match.type].push(match.toJSON());

    teams.forEach(team => {
        if (!data.matches_by_team[team])
            data.matches_by_team[team] = JSON.parse(JSON.stringify(new_record_obj));

        data.matches_by_team[team][match.type].push(match.toJSON());
    });
};

const get_score = (list_of_teams, score_team_1, score_team_2) => {
    return {
        [list_of_teams[0]]: score_team_1,
        [list_of_teams[1]]: score_team_2
    };
};

module.exports = data;