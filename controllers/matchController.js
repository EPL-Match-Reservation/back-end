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
module.exports.editMatch = async (req, res) => {
    try {
        const { matchId } = req.params;
        const match = await this.MatchService.editMatch(matchId);

        if (!match) {
            return res.status(400).json({ message: 'Match not found' });
        }

        // Update fields if provided in the request body
        match.HomeTeam = req.body.HomeTeam || match.HomeTeam;
        match.AwayTeam = req.body.AwayTeam || match.AwayTeam;
        match.MatchVenue = req.body.MatchVenue || match.MatchVenue;
        match.MatchDate = req.body.MatchDate || match.MatchDate;
        match.MatchTime = req.body.MatchTime || match.MatchTime;
        match.linesman1 = req.body.linesman1 || match.linesman1;
        match.linesman2 = req.body.linesman2 || match.linesman2;
        match.MainReferee = req.body.MainReferee || match.MainReferee;

        // Save the updated match
        const updatedMatch = await match.save();

        res.status(200).json({ message: 'Match updated', updatedMatch });
    } catch (error) {
        console.error("Error updating match:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
