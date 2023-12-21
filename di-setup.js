const awilix = require("awilix");


////////////to do/////////////

// Require Controllers
const MatchController = require("./controllers/matchController");

// Require Services
const MatchService = require("./service/matchService");

// Require Data access
const MatchRepository = require("./data_access/matchRepository");

//Require Models
const Match = require("./models/matchModel");



const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

function setup() {
  container.register({



    ///////////to do///////////////
    // controllers
    MatchController: awilix.asClass(MatchController),
   

    // services
    MatchService: awilix.asClass(MatchService),


    // DAOs

    //Repository: awilix.asClass(Repository),
    MatchRepository: awilix.asClass(MatchRepository),

    // inject knexjs object with database connection pooling
    // support
    Match: awilix.asValue(Match),

  
  });
}

module.exports = {
  container,
  setup,
};
