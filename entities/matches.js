const consts = require('../consts.js');

class Match {
    constructor(team1, team2, start_date, tournament) {
        this.team1 = team1;
        this.team2 = team2;
        this.start_date = start_date;
        this.tournament = tournament;
    }

    toJSON() {
        let json = {
            team1: this.team1,
            team2: this.team2,
            start_date: this.start_date,
            tournament: this.tournament
        }

        return json;
    }
}

class UpcomingMatch extends Match {
    constructor(team1, team2, start_date, tournament, kickoff_time) {
        super(team1, team2, start_date, tournament);

        this.kickoff_time = kickoff_time;
        this.type = consts.UPCOMING;
    }

    toJSON() {
        let json = super.toJSON();

        json['kickoff_time'] = this.kickoff_time;

        return json;
    }
}


class PlayedMatch extends Match {
    constructor(team1, team2, start_date, tournament, score) {
        super(team1, team2, start_date, tournament);

        this.score = score;
        this.type = consts.PLAYED;
    }

    toJSON() {
        let json = super.toJSON();

        json['score'] = this.score;

        return json;
    }
}


module.exports = {
    UpcomingMatch,
    PlayedMatch
};

