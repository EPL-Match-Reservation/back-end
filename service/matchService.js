class MatchService {
    // Other methods...
 constructor({ MatchRepository }) {
    this.MatchRepository = MatchRepository;
  }


    async getMatchById(matchId) {
       
            let match = await this.MatchRepository.getMatch(matchId);
    
            if (!match) {
                return { success: false };
            }
    
            return { success: true, data: match };
     
    }
    async createMatch(match) {
       
      let data = await this.MatchRepository.createMatch(match);

      
      return { success: true, data: data };

}
    async retrievematches() {
          
      let matches = await this.MatchRepository.retrievematches();

      if (!matches) {
          return { success: false };
      }

      return { success: true, data: matches };

    }
}

module.exports = MatchService;
