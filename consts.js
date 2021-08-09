consts = {};

consts.PORT = 3000;

consts.PLAYED = 'played';
consts.UPCOMING = 'upcoming';

consts.path_to_CSVs = {
    [consts.PLAYED]: './result_played.csv',
    [consts.UPCOMING]: './result_upcoming.csv'
};

module.exports = consts;