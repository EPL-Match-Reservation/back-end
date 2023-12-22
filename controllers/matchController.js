const MatchService = require('../service/matchService')

module.exports.getMatch = async (req, res) => {
    try {
        const { matchId }  = req.params;
        const match = await MatchService.getMatchById(matchId);

        if (!match.success) {
            
            return  res.status(404).json({ error: "Match not found" });
        }

        return res.status(200).json(match);
    } catch (error) {

        console.error("Error getting match:", error);

        return  res.status(500).json({ error: "Internal server error" });
        
    }
};

module.exports.retrievematches = async (req, res) => {
    try {
        //const { matchId }  = req.params;
        const matches = await MatchService.retrievematches();

        if (!matches.success) {
            
            return  res.status(404).json({ error: "Match not found" });
        }

        return res.status(200).json(matches);
    } catch (error) {

        console.error("Error getting match:", error);

        return  res.status(500).json({ error: "Internal server error" });
        
    }
};

module.exports.createMatch = async (req, res) => {
    try {
        const {HomeTeam,MatchTime, linesman2, linesman1, AwayTeam, MatchDate, MatchVenue, MainReferee}  = req.body;
        if (!HomeTeam || !AwayTeam){
            return res.status(400).json({ error: "please enter home team and away team" });
        }
        if (!linesman2 || !linesman1){
            return res.status(400).json({ error: "please enter both linesmen" });
        }
        if (!MainReferee ){
            return res.status(400).json({ error: "please enter referee name" });
        }
        if (!MatchVenue ){
            return res.status(400).json({ error: "please enter match venue" });
        }
        const match = await MatchService.createMatch({HomeTeam,linesman2,linesman1,AwayTeam,MatchTime,MatchDate,MatchVenue,MainReferee});

        return res.status(200).json(match);
    } catch (error) {

        console.error("Error creating match:", error);

        return  res.status(500).json({ error: "Internal server error" });
        
    }
};
