const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");

const app = express();

app.use(express.json());

let db = null;

const initializingDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => 
      console.log("Server Running At http://localhost:3000");
    );
  } catch (e) {
    console.log(`Error is ${e.message}`);
    process.exit(1);
  }
};

initializingDBAndServer();

const convertObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//Get Players API

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
        SELECT * 
        FROM
         cricket_team;
    `;
  const dbResponse = await db.all(getPlayersQuery);
  response.send(
    dbResponse.map((eachPlayer) => convertObjectToResponseObject(eachPlayer))
  );
});

//Get player API

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
        SELECT * 
        FROM cricket_team
        WHERE player_id = ${playerId}
    `;
  const playerDetails = await db.get(getPlayerQuery);
  response.send(convertObjectToResponseObject(playerDetails));
});


//Post Player API

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const addPlayerQuery = `
        INSERT INTO 
        cricket_team(player_name,jersey_number,role)
        VALUES
        ('${playerName}', ${jerseyNumber}, '${role}');
    `;
  const player = await db.run(addPlayerQuery);

  response.send("Player Added to Team");
});


//update player API

app.put(" /players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { bookId } = request.params;
  const updatedQuery = `
    UPDATE 
        cricket_team
    SET
        player_name = '${player_Name}',
        jersey_number = ${jerseyNumber},
        role = '${role}',
        WHERE 
        player_Id = ${playerId}
    `;
  await db.run(updatedQuery);
  response.send("Player Details Updated");
});

//delete player API

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
        DELETE FROM
           cricket_team
        WHERE 
            player_id = ${playerId}
    `;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;