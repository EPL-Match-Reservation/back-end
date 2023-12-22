const Repository = require("./repository");

class MatchRepository extends Repository {
  constructor({ Match }) {
    super(Match);
  }

  async getMatch(matchId) {
    const result = await this.model.findById(matchId);

    return result;
  }
  async createMatch(match) {
    const result = await this.model.create(match);

    return result;
  }
  async retrievematches() {
    const result = await this.model.find().sort({ MatchDate: 1 }).exec();

    return result;
  }
}
module.exports = MatchRepository;
