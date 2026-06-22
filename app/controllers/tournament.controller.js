const Match = require("../models/match.model");
const Team = require("../models/team.model");
const Tournament = require("../models/tournament.model");
const Field = require("../models/field.model");
const Booking = require("../models/booking.model");

const queryTournament = async (req, res) => {
  try {
    let q = req.query.q;
    let query = {};

    if (q) {
      const q_normalized = q.trim().toLowerCase();
      query.$or = [
        { name: { $regex: q_normalized, $options: "i" } },
        { sport: { $regex: q_normalized, $options: "i" } },
        { startDate: { $regex: q_normalized, $options: "i" } },
        { status: { $regex: q_normalized, $options: "i" } },
      ];
    }
    const tournaments = await Tournament.find(query).select("-creatorId");
    return res.status(200).json(tournaments);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const createTournament = async (req, res) => {
  try {
    const { name, sport, maxTeams, startDate } = req.body;
    const max = Number(maxTeams);
    if (!Number.isInteger(max) || max <= 0) {
      return res
        .status(400)
        .json({ msg: "maxTeams must be a positive integer" });
    }
    const tournament = await Tournament.create({
      name: name,
      sport: sport,
      maxTeams: max,
      startDate: startDate,
      creatorId: req.userId,
      status: "upcoming",
    });
    return res.status(201).json({ msg: "Tournament creation successfull" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const getTournamentDetails = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res
        .status(404)
        .json({ msg: "Tournament selected does not exist" });
    }

    const teams = await Team.find({ tournamentId: tournamentId });
    const matches = await Match.find({ tournamentId: tournamentId });

    return res.status(200).json({ tournament, teams, matches });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const updateTournamentDetails = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const userId = req.userId;
    const tournament = await Tournament.findOne({ _id: tournamentId });

    if (!tournament) {
      return res.status(404).json({ msg: "Tournament not found" });
    }

    if (!(userId === tournament.creatorId)) {
      return res
        .status(403)
        .json({ msg: "Cannot modify a tournament created by another user" });
    }

    const { name, sport, maxTeams, startDate, status } = req.body;

    const max = Number(maxTeams);
    if (!Number.isInteger(max) || max <= 0) {
      return res
        .status(400)
        .json({ msg: "maxTeams must be a positive integer" });
    }

    tournament.set({
      name: name,
      sport: sport,
      maxTeams: max,
      startDate: startDate,
    });

    if (status === "completed") {
      tournament.status = "completed";
    }

    await tournament.save();

    return res.status(200).json({ msg: "Tournament updated" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const userId = req.userId;
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ msg: "Tournament not found" });
    }

    if (!(userId === tournament.creatorId)) {
      return res
        .status(400)
        .json({ msg: "Not authorized to delete this tournament" });
    }

    await Team.deleteMany({ tournamentId: tournamentId });
    await Match.deleteMany({ tournamentId: tournamentId });
    await Tournament.findByIdAndDelete(tournamentId);

    return res.status(200).json({ msg: "Tournament deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const createTournamentSchedule = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const userId = req.userId;
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ msg: "Tournament not found" });
    }

    if (userId !== tournament.creatorId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (tournament.status !== "upcoming") {
      return res.status(400).json({ msg: "Schedule already generated" });
    }

    const teams = await Team.find({ tournamentId: tournamentId });

    if (teams.length < 2) {
      return res
        .status(400)
        .json({ msg: "Need at least 2 teams to generate a schedule" });
    }

    const schedule = await generateRoundRobin(teams, tournament);

    tournament.set({
      status: "active",
    });
    await tournament.save();
    return res.status(201).json({ msg: "Schedule generated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const getMatchList = async (req, res) => {
  try {
    const tournamentId = req.params.id;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ msg: "Tournament not found" });
    }

    const matches = await Match.find({ tournamentId: tournamentId });
    return res.status(200).json(matches);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const getTournamentStandings = async (req, res) => {
  try {
    const tournamentId = req.params.id;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ msg: "Tournament not found" });
    }

    const teams = await Team.find({ tournamentId: tournamentId });
    const matches = await Match.find({
      tournamentId: tournamentId,
      status: "played",
    });

    const standings = {};
    teams.forEach((team) => {
      standings[team._id.toString()] = {
        teamId: team._id,
        teamName: team.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        scored: 0,
        conceded: 0,
        diff: 0,
        points: 0,
      };
    });

    matches.forEach((match) => {
      const home = standings[match.homeTeamId.toString()];
      const away = standings[match.awayTeamId.toString()];

      const [homeScore, awayScore] = match.result.split("-").map(Number);

      home.played++;
      away.played++;
      home.scored += homeScore;
      home.conceded += awayScore;
      away.scored += awayScore;
      away.conceded += homeScore;

      if (tournament.sport === "football") {
        if (homeScore > awayScore) {
          home.won++;
          home.points += 3;
          away.lost++;
        } else if (homeScore < awayScore) {
          away.won++;
          away.points += 3;
          home.lost++;
        } else {
          home.drawn++;
          home.points += 1;
          away.drawn++;
          away.points += 1;
        }
      } else {
        if (homeScore > awayScore) {
          home.won++;
          home.points += 2;
          away.lost++;
        } else {
          away.won++;
          away.points += 2;
          home.lost++;
        }
      }
    });

    const result = Object.values(standings).map((entry) => ({
      ...entry,
      diff: entry.scored - entry.conceded,
    }));

    result.sort((a, b) => b.points - a.points || b.diff - a.diff);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const queryTeam = async (req, res) => {
  try {
    let q = req.query.q;
    let query = {};

    if (q) {
      const q_normalized = q.trim().toLowerCase();
      query.$or = [
        { name: { $regex: q_normalized, $options: "i" } },
        { "players.name": { $regex: q_normalized, $options: "i" } },
        { "players.surname": { $regex: q_normalized, $options: "i" } },
      ];
    }
    const teams = await Team.find(query).select("-tournamentId");
    return res.status(200).json(teams);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const createTeam = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const userId = req.userId;
    const { name, players } = req.body;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ msg: "Tournament not found" });
    }

    if (!(userId === tournament.creatorId)) {
      return res
        .status(400)
        .json({ msg: "Not authorized to create teams for this tournament" });
    }

    if (tournament.teamIds.length >= tournament.maxTeams) {
      return res
        .status(400)
        .json({ msg: "Tournament is altready at max capacity" });
    }

    const team = await Team.create({
      name: name,
      players: players,
      tournamentId: tournamentId,
    });
    tournament.teamIds.push(team._id);
    await tournament.save();
    return res.status(201).json({ msg: "team creation successfull" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const getTeamDetails = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res
        .status(404)
        .json({ msg: "Tournament selected does not exist" });
    }

    const arrayOfTeams = [];
    const teamIds = tournament.teamIds;
    for (const teamId of teamIds) {
      const team = await Team.findById(teamId);
      arrayOfTeams.push(team);
    }

    return res.status(200).json(arrayOfTeams);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const updateTeam = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const teamId = req.params.teamId;
    const userId = req.userId;
    const tournament = await Tournament.findById(tournamentId);
    const team = await Team.findById(teamId);

    if (!tournament) {
      return res.status(404).json({ msg: "Tournament not found" });
    }

    if (!(userId === tournament.creatorId)) {
      return res
        .status(403)
        .json({ msg: "Cannot modify a tournament created by another user" });
    }

    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    const { name, players } = req.body;

    team.set({
      name: name,
      players: players,
    });

    await team.save();

    return res.status(200).json({ msg: "Team updated" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const teamId = req.params.teamId;
    const userId = req.userId;
    const tournament = await Tournament.findById(tournamentId);
    const team = await Team.findById(teamId);

    if (!tournament) {
      return res.status(404).json({ msg: "Tournament not found" });
    }

    if (!(userId === tournament.creatorId)) {
      return res
        .status(400)
        .json({ msg: "Not authorized to delete a team in this tournament" });
    }

    if (tournament.status !== "upcoming") {
      return res.status(400).json({
        msg: "Tournament already started, cannot delete teams after pairings are created",
      });
    }

    await Team.findByIdAndDelete(teamId);
    return res.status(200).json({ msg: "Team deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error" });
  }
};

const generateRoundRobin = async (teams, tournament) => {
  let list = [...teams];

  if (list.length % 2 !== 0) {
    list.push({ _id: null, name: "BYE" });
  }

  const numTeams = list.length;
  const numRounds = numTeams - 1;
  const half = numTeams / 2;

  const MATCH_DAYS = [1, 3, 5, 6];

  const matches = [];
  const bookings = [];

  const getFirstMonday = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay();
    const diff = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
    d.setDate(d.getDate() + diff);
    return d;
  };

  const getDateForWeekAndDay = (weekStart, dayOfWeek) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + dayOfWeek - 1);
    return d.toISOString().split("T")[0];
  };

  const findAvailableFieldAndSlot = async (date, sport) => {
    const fields = await Field.find({ sport });
    if (!fields.length) return null;

    const shuffled = fields.sort(() => Math.random() - 0.5);

    for (const field of shuffled) {
      const existingBookings = await Booking.find({ fieldId: field._id, date });
      const bookedSlots = existingBookings.map((b) => b.slot);

      const freeSlot = field.slots.find((s) => !bookedSlots.includes(s));
      if (freeSlot) {
        return { field, slot: freeSlot };
      }
    }

    return null;
  };

  const weekStart = getFirstMonday(tournament.startDate);

  for (let round = 0; round < numRounds; round++) {
    const roundWeekStart = new Date(weekStart);
    roundWeekStart.setDate(roundWeekStart.getDate() + round * 7);

    const roundMatches = [];
    for (let i = 0; i < half; i++) {
      const home = list[i];
      const away = list[numTeams - 1 - i];

      if (home.name === "BYE" || away.name === "BYE") continue;
      roundMatches.push({ home, away });
    }

    for (let i = 0; i < roundMatches.length; i++) {
      const { home, away } = roundMatches[i];

      const dayOfWeek = MATCH_DAYS[i % MATCH_DAYS.length];
      const matchDate = getDateForWeekAndDay(roundWeekStart, dayOfWeek);

      const availability = await findAvailableFieldAndSlot(
        matchDate,
        tournament.sport,
      );

      const matchDoc = {
        tournamentId: tournament._id.toString(),
        homeTeamId: home._id.toString(),
        awayTeamId: away._id.toString(),
        startDate: matchDate,
        fieldId: availability ? availability.field._id.toString() : null,
        slot: availability ? availability.slot : null,
        status: "upcoming",
        result: "-",
      };

      matches.push(matchDoc);

      if (availability) {
        bookings.push({
          fieldId: availability.field._id,
          userId: tournament.creatorId,
          date: matchDate,
          slot: availability.slot,
        });
      }
    }

    list.splice(1, 0, list.pop());
  }

  const insertedMatches = await Match.insertMany(matches);

  if (bookings.length) {
    await Booking.insertMany(bookings, { ordered: false });
  }

  return insertedMatches;
};

module.exports = {
  queryTournament,
  createTournament,
  getTournamentDetails,
  updateTournamentDetails,
  deleteTournament,
  createTournamentSchedule,
  getMatchList,
  getTournamentStandings,
  queryTeam,
  createTeam,
  getTeamDetails,
  updateTeam,
  deleteTeam,
};
