db = db.getSiblingDB("sportapp");

// ─── Users ────────────────────────────────────────────────────────────────────
db.users.insertMany([
  {
    username: "mario",
    password: "$2b$10$MCIHd2FlGJhl7G.pW2Mp0eMdiE4YsQ60FSBpuTcB1lcVjuihKh5Xm", // Mario123!
    name: "Mario",
    surname: "Rossi",
    email: "mario.rossi@example.com"
  },
  {
    username: "luigi",
    password: "$2b$10$0qU9fszBsbOyJ141X6VlweKI1xncRiznDcdjWU1SmSSLP0oZFrxvS", // Luigi123!
    name: "Luigi",
    surname: "Verdi",
    email: "luigi.verdi@example.com"
  },
  {
    username: "anna",
    password: "$2b$10$3AcKznBMVTweOO3Fg9DUSORG8K.qHr7/o9bb7z0PcQ7VHmC1PwW8a", // Anna123!
    name: "Anna",
    surname: "Bianchi",
    email: "anna.bianchi@example.com"
  },
  {
    username: "giulia",
    password: "$2b$10$tIcvcGo/PbUzd/cVsAYbROFY4DJHS4MytYH2DdvHSZfZNXzJ/pswu", // Giulia123!
    name: "Giulia",
    surname: "Neri",
    email: "giulia.neri@example.com"
  },
  {
    username: "paolo",
    password: "$2b$10$uSJP4qYZKnUdtOi0fC8VPe1QSs41WpYmImTpv/jj8ppz/dElWFoSy", // Paolo123!
    name: "Paolo",
    surname: "Galli",
    email: "paolo.galli@example.com"
  },
]);

// ─── Fields ───────────────────────────────────────────────────────────────────
db.fields.insertMany([
  {
    name: "Campo Football 1",
    sport: "football",
    address: "Via Roma 1, Milano",
    slots: ["09:00 - 10:00", "11:00 - 12:00", "14:00 - 15:00", "16:00 - 17:00", "18:00 - 19:00"],
  },
  {
    name: "Campo Football 2",
    sport: "football",
    address: "Via Torino 10, Torino",
    slots: ["10:00 - 11:00", "12:00 - 13:00", "15:00 - 16:00", "17:00 - 18:00"],
  },
  {
    name: "Campo Volleyball 1",
    sport: "volleyball",
    address: "Via Dante 9, Napoli",
    slots: ["09:00 - 10:00", "11:00 - 12:00", "14:00 - 15:00", "16:00 - 17:00"],
  },
  {
    name: "Campo Volleyball 2",
    sport: "volleyball",
    address: "Corso Italia 22, Firenze",
    slots: ["10:00 - 11:00", "12:00 - 13:00", "15:00 - 16:00", "18:00 - 19:00"],
  },
  {
    name: "Campo Basketball 1",
    sport: "basketball",
    address: "Via Garibaldi 5, Roma",
    slots: ["09:30 - 10:30", "11:30 - 12:30", "14:30 - 15:30", "16:30 - 17:30"],
  },
  {
    name: "Campo Basketball 2",
    sport: "basketball",
    address: "Piazza Duomo 3, Bologna",
    slots: ["10:30 - 11:30", "12:30 - 13:30", "15:30 - 16:30", "17:30 - 18:30"],
  },
]);

// ─── Lookup inserted docs ─────────────────────────────────────────────────────
var mario  = db.users.findOne({ username: "mario" });
var luigi  = db.users.findOne({ username: "luigi" });
var anna   = db.users.findOne({ username: "anna" });
var giulia = db.users.findOne({ username: "giulia" });

var fieldFootball1   = db.fields.findOne({ name: "Campo Football 1" });
var fieldFootball2   = db.fields.findOne({ name: "Campo Football 2" });
var fieldVolleyball1 = db.fields.findOne({ name: "Campo Volleyball 1" });
var fieldVolleyball2 = db.fields.findOne({ name: "Campo Volleyball 2" });
var fieldBasketball1 = db.fields.findOne({ name: "Campo Basketball 1" });
var fieldBasketball2 = db.fields.findOne({ name: "Campo Basketball 2" });

// ─── Bookings ─────────────────────────────────────────────────────────────────
db.bookings.insertMany([
  // Manual bookings
  { fieldId: fieldFootball1._id.toString(),   userId: mario._id.toString(),  date: "2026-06-25", slot: "09:00 - 10:00" },
  { fieldId: fieldBasketball1._id.toString(), userId: anna._id.toString(),   date: "2026-06-25", slot: "14:30 - 15:30" },
  { fieldId: fieldVolleyball1._id.toString(), userId: mario._id.toString(),  date: "2026-06-30", slot: "16:00 - 17:00" },
  { fieldId: fieldBasketball1._id.toString(), userId: luigi._id.toString(),  date: "2026-06-30", slot: "09:30 - 10:30" },
  // T3 (Summer Football Cup) — Round 3 upcoming matches
  { fieldId: fieldFootball1._id.toString(),   userId: mario._id.toString(),  date: "2026-06-25", slot: "14:00 - 15:00" },
  { fieldId: fieldFootball2._id.toString(),   userId: mario._id.toString(),  date: "2026-06-27", slot: "15:00 - 16:00" },
  // T4 (City Volleyball League) — Round 3 upcoming matches
  { fieldId: fieldVolleyball1._id.toString(), userId: luigi._id.toString(),  date: "2026-06-25", slot: "16:00 - 17:00" },
  { fieldId: fieldVolleyball2._id.toString(), userId: luigi._id.toString(),  date: "2026-06-27", slot: "18:00 - 19:00" },
]);

// ═════════════════════════════════════════════════════════════════════════════
// TOURNAMENTS
// Each active/completed tournament has 4 teams → 3 rounds × 2 matches = 6 matches
// Round-robin rotation for [A, B, C, D]:
//   Round 1: A vs D,  B vs C
//   Round 2: A vs C,  D vs B
//   Round 3: A vs B,  C vs D
// ═════════════════════════════════════════════════════════════════════════════

// ─── T1: UPCOMING — Football, 0 teams ─────────────────────────────────────────
var t1Id = new ObjectId();
db.tournaments.insertOne({
  _id: t1Id,
  name: "Spring Football Cup",
  sport: "football",
  maxTeams: 4,
  startDate: "2026-07-14",
  creatorId: mario._id.toString(),
  status: "upcoming",
  teamIds: [],
});

// ─── T2: UPCOMING — Basketball, 2 teams registered (not full yet) ─────────────
var t2Id = new ObjectId();
var t2_team1 = new ObjectId();
var t2_team2 = new ObjectId();

db.teams.insertMany([
  {
    _id: t2_team1,
    name: "Lakers Milano",
    tournamentId: t2Id.toString(),
    players: [
      { name: "Luca",     surname: "Ferrari",  jerseyNumber: "10" },
      { name: "Marco",    surname: "Esposito", jerseyNumber: "23" },
      { name: "Giovanni", surname: "Ricci",    jerseyNumber: "5"  },
    ],
  },
  {
    _id: t2_team2,
    name: "Bulls Roma",
    tournamentId: t2Id.toString(),
    players: [
      { name: "Andrea", surname: "Colombo", jerseyNumber: "1"  },
      { name: "Matteo", surname: "Romano",  jerseyNumber: "15" },
      { name: "Davide", surname: "Greco",   jerseyNumber: "7"  },
    ],
  },
]);

db.tournaments.insertOne({
  _id: t2Id,
  name: "Summer Basketball Open",
  sport: "basketball",
  maxTeams: 4,
  startDate: "2026-08-04",
  creatorId: anna._id.toString(),
  status: "upcoming",
  teamIds: [t2_team1.toString(), t2_team2.toString()],
});

// ─── T3: ACTIVE — Football, 4 teams, 4 played + 2 upcoming ───────────────────
var t3Id = new ObjectId();
var t3_team1 = new ObjectId(); // Eagles FC
var t3_team2 = new ObjectId(); // Wolves United
var t3_team3 = new ObjectId(); // Panthers SC
var t3_team4 = new ObjectId(); // Tigers CF

db.teams.insertMany([
  {
    _id: t3_team1,
    name: "Eagles FC",
    tournamentId: t3Id.toString(),
    players: [
      { name: "Roberto", surname: "Mancini",  jerseyNumber: "1"  },
      { name: "Simone",  surname: "Zola",     jerseyNumber: "9"  },
      { name: "Filippo", surname: "Inzaghi",  jerseyNumber: "11" },
    ],
  },
  {
    _id: t3_team2,
    name: "Wolves United",
    tournamentId: t3Id.toString(),
    players: [
      { name: "Alessandro", surname: "Del Piero", jerseyNumber: "10" },
      { name: "Gianluigi",  surname: "Buffon",    jerseyNumber: "1"  },
      { name: "Paolo",      surname: "Maldini",   jerseyNumber: "3"  },
    ],
  },
  {
    _id: t3_team3,
    name: "Panthers SC",
    tournamentId: t3Id.toString(),
    players: [
      { name: "Francesco", surname: "Totti",   jerseyNumber: "10" },
      { name: "Gabriel",   surname: "Batistuta", jerseyNumber: "9" },
      { name: "Fabio",     surname: "Cannavaro", jerseyNumber: "5" },
    ],
  },
  {
    _id: t3_team4,
    name: "Tigers CF",
    tournamentId: t3Id.toString(),
    players: [
      { name: "Ronaldo",  surname: "Nazario",  jerseyNumber: "9"  },
      { name: "Roberto",  surname: "Baggio",   jerseyNumber: "10" },
      { name: "Christian", surname: "Vieri",   jerseyNumber: "32" },
    ],
  },
]);

// Round 1 (June 9–12): played
// Round 2 (June 16–19): played
// Round 3 (June 23–26): upcoming
db.matches.insertMany([
  // Round 1
  { tournamentId: t3Id.toString(), homeTeamId: t3_team1.toString(), awayTeamId: t3_team4.toString(), startDate: "2026-06-09", fieldId: fieldFootball1._id.toString(), slot: "14:00 - 15:00", status: "played",   result: "2-1" },
  { tournamentId: t3Id.toString(), homeTeamId: t3_team2.toString(), awayTeamId: t3_team3.toString(), startDate: "2026-06-11", fieldId: fieldFootball2._id.toString(), slot: "15:00 - 16:00", status: "played",   result: "0-0" },
  // Round 2
  { tournamentId: t3Id.toString(), homeTeamId: t3_team1.toString(), awayTeamId: t3_team3.toString(), startDate: "2026-06-16", fieldId: fieldFootball1._id.toString(), slot: "16:00 - 17:00", status: "played",   result: "1-3" },
  { tournamentId: t3Id.toString(), homeTeamId: t3_team4.toString(), awayTeamId: t3_team2.toString(), startDate: "2026-06-18", fieldId: fieldFootball2._id.toString(), slot: "17:00 - 18:00", status: "played",   result: "2-2" },
  // Round 3 (upcoming)
  { tournamentId: t3Id.toString(), homeTeamId: t3_team1.toString(), awayTeamId: t3_team2.toString(), startDate: "2026-06-25", fieldId: fieldFootball1._id.toString(), slot: "14:00 - 15:00", status: "upcoming", result: "-" },
  { tournamentId: t3Id.toString(), homeTeamId: t3_team3.toString(), awayTeamId: t3_team4.toString(), startDate: "2026-06-27", fieldId: fieldFootball2._id.toString(), slot: "15:00 - 16:00", status: "upcoming", result: "-" },
]);

db.tournaments.insertOne({
  _id: t3Id,
  name: "Summer Football Cup",
  sport: "football",
  maxTeams: 4,
  startDate: "2026-06-09",
  creatorId: mario._id.toString(),
  status: "active",
  teamIds: [t3_team1.toString(), t3_team2.toString(), t3_team3.toString(), t3_team4.toString()],
});

// ─── T4: ACTIVE — Volleyball, 4 teams, 4 played + 2 upcoming ─────────────────
var t4Id = new ObjectId();
var t4_team1 = new ObjectId(); // Azzurri Volley
var t4_team2 = new ObjectId(); // Rossoneri Spike
var t4_team3 = new ObjectId(); // Bianchi Smash
var t4_team4 = new ObjectId(); // Verdi Block

db.teams.insertMany([
  {
    _id: t4_team1,
    name: "Azzurri Volley",
    tournamentId: t4Id.toString(),
    players: [
      { name: "Matteo",   surname: "Piano",    jerseyNumber: "3" },
      { name: "Ivan",     surname: "Zaytsev",  jerseyNumber: "9" },
      { name: "Osmany",   surname: "Juantorena", jerseyNumber: "17" },
    ],
  },
  {
    _id: t4_team2,
    name: "Rossoneri Spike",
    tournamentId: t4Id.toString(),
    players: [
      { name: "Simone",   surname: "Giannelli", jerseyNumber: "6" },
      { name: "Gabriele", surname: "Nelli",     jerseyNumber: "14" },
      { name: "Daniele",  surname: "Lavia",     jerseyNumber: "18" },
    ],
  },
  {
    _id: t4_team3,
    name: "Bianchi Smash",
    tournamentId: t4Id.toString(),
    players: [
      { name: "Alessandro", surname: "Michieletto", jerseyNumber: "21" },
      { name: "Fabio",      surname: "Balaso",      jerseyNumber: "1"  },
      { name: "Riccardo",   surname: "Sbertoli",    jerseyNumber: "5"  },
    ],
  },
  {
    _id: t4_team4,
    name: "Verdi Block",
    tournamentId: t4Id.toString(),
    players: [
      { name: "Roberto",  surname: "Russo",    jerseyNumber: "2"  },
      { name: "Lorenzo",  surname: "Bernardi", jerseyNumber: "8"  },
      { name: "Andrea",   surname: "Giani",    jerseyNumber: "11" },
    ],
  },
]);

// volleyball: no draws allowed
db.matches.insertMany([
  // Round 1
  { tournamentId: t4Id.toString(), homeTeamId: t4_team1.toString(), awayTeamId: t4_team4.toString(), startDate: "2026-06-09", fieldId: fieldVolleyball1._id.toString(), slot: "09:00 - 10:00", status: "played",   result: "3-1" },
  { tournamentId: t4Id.toString(), homeTeamId: t4_team2.toString(), awayTeamId: t4_team3.toString(), startDate: "2026-06-11", fieldId: fieldVolleyball2._id.toString(), slot: "10:00 - 11:00", status: "played",   result: "1-3" },
  // Round 2
  { tournamentId: t4Id.toString(), homeTeamId: t4_team1.toString(), awayTeamId: t4_team3.toString(), startDate: "2026-06-16", fieldId: fieldVolleyball1._id.toString(), slot: "14:00 - 15:00", status: "played",   result: "2-3" },
  { tournamentId: t4Id.toString(), homeTeamId: t4_team4.toString(), awayTeamId: t4_team2.toString(), startDate: "2026-06-18", fieldId: fieldVolleyball2._id.toString(), slot: "15:00 - 16:00", status: "played",   result: "3-0" },
  // Round 3 (upcoming)
  { tournamentId: t4Id.toString(), homeTeamId: t4_team1.toString(), awayTeamId: t4_team2.toString(), startDate: "2026-06-25", fieldId: fieldVolleyball1._id.toString(), slot: "16:00 - 17:00", status: "upcoming", result: "-" },
  { tournamentId: t4Id.toString(), homeTeamId: t4_team3.toString(), awayTeamId: t4_team4.toString(), startDate: "2026-06-27", fieldId: fieldVolleyball2._id.toString(), slot: "18:00 - 19:00", status: "upcoming", result: "-" },
]);

db.tournaments.insertOne({
  _id: t4Id,
  name: "City Volleyball League",
  sport: "volleyball",
  maxTeams: 4,
  startDate: "2026-06-09",
  creatorId: luigi._id.toString(),
  status: "active",
  teamIds: [t4_team1.toString(), t4_team2.toString(), t4_team3.toString(), t4_team4.toString()],
});

// ─── T5: COMPLETED — Football, 4 teams, all 6 matches played ─────────────────
var t5Id = new ObjectId();
var t5_team1 = new ObjectId(); // Calcio Nordest
var t5_team2 = new ObjectId(); // Forza Sud
var t5_team3 = new ObjectId(); // Roma Warriors
var t5_team4 = new ObjectId(); // Milano Knights

db.teams.insertMany([
  {
    _id: t5_team1,
    name: "Calcio Nordest",
    tournamentId: t5Id.toString(),
    players: [
      { name: "Luca",    surname: "Toni",     jerseyNumber: "9"  },
      { name: "Antonio", surname: "Cassano",  jerseyNumber: "10" },
      { name: "Daniele", surname: "De Rossi", jerseyNumber: "16" },
    ],
  },
  {
    _id: t5_team2,
    name: "Forza Sud",
    tournamentId: t5Id.toString(),
    players: [
      { name: "Ciro",     surname: "Immobile", jerseyNumber: "17" },
      { name: "Lorenzo",  surname: "Insigne",  jerseyNumber: "24" },
      { name: "Salvatore", surname: "Sirigu",  jerseyNumber: "1"  },
    ],
  },
  {
    _id: t5_team3,
    name: "Roma Warriors",
    tournamentId: t5Id.toString(),
    players: [
      { name: "Edin",    surname: "Dzeko",    jerseyNumber: "9"  },
      { name: "Kevin",   surname: "Strootman", jerseyNumber: "6" },
      { name: "Radja",   surname: "Nainggolan", jerseyNumber: "4"},
    ],
  },
  {
    _id: t5_team4,
    name: "Milano Knights",
    tournamentId: t5Id.toString(),
    players: [
      { name: "Zlatan",  surname: "Ibrahimovic", jerseyNumber: "11" },
      { name: "Rodney",  surname: "Strasser",    jerseyNumber: "8"  },
      { name: "Kevin",   surname: "Prince Boateng", jerseyNumber: "10" },
    ],
  },
]);

db.matches.insertMany([
  // Round 1
  { tournamentId: t5Id.toString(), homeTeamId: t5_team1.toString(), awayTeamId: t5_team4.toString(), startDate: "2026-03-02", fieldId: fieldFootball1._id.toString(), slot: "09:00 - 10:00", status: "played", result: "1-0" },
  { tournamentId: t5Id.toString(), homeTeamId: t5_team2.toString(), awayTeamId: t5_team3.toString(), startDate: "2026-03-04", fieldId: fieldFootball2._id.toString(), slot: "10:00 - 11:00", status: "played", result: "2-3" },
  // Round 2
  { tournamentId: t5Id.toString(), homeTeamId: t5_team1.toString(), awayTeamId: t5_team3.toString(), startDate: "2026-03-09", fieldId: fieldFootball1._id.toString(), slot: "11:00 - 12:00", status: "played", result: "0-2" },
  { tournamentId: t5Id.toString(), homeTeamId: t5_team4.toString(), awayTeamId: t5_team2.toString(), startDate: "2026-03-11", fieldId: fieldFootball2._id.toString(), slot: "12:00 - 13:00", status: "played", result: "1-1" },
  // Round 3
  { tournamentId: t5Id.toString(), homeTeamId: t5_team1.toString(), awayTeamId: t5_team2.toString(), startDate: "2026-03-16", fieldId: fieldFootball1._id.toString(), slot: "14:00 - 15:00", status: "played", result: "3-1" },
  { tournamentId: t5Id.toString(), homeTeamId: t5_team3.toString(), awayTeamId: t5_team4.toString(), startDate: "2026-03-18", fieldId: fieldFootball2._id.toString(), slot: "15:00 - 16:00", status: "played", result: "2-0" },
]);

db.tournaments.insertOne({
  _id: t5Id,
  name: "Winter Football League",
  sport: "football",
  maxTeams: 4,
  startDate: "2026-03-02",
  creatorId: mario._id.toString(),
  status: "completed",
  teamIds: [t5_team1.toString(), t5_team2.toString(), t5_team3.toString(), t5_team4.toString()],
});

// ─── T6: COMPLETED — Basketball, 4 teams, all 6 matches played ───────────────
var t6Id = new ObjectId();
var t6_team1 = new ObjectId(); // Heat Napoli
var t6_team2 = new ObjectId(); // Nets Torino
var t6_team3 = new ObjectId(); // Spurs Venezia
var t6_team4 = new ObjectId(); // Celtics Genova

db.teams.insertMany([
  {
    _id: t6_team1,
    name: "Heat Napoli",
    tournamentId: t6Id.toString(),
    players: [
      { name: "Marco",    surname: "Belinelli", jerseyNumber: "3"  },
      { name: "Danilo",   surname: "Gallinari", jerseyNumber: "8"  },
      { name: "Andrea",   surname: "Bargnani",  jerseyNumber: "77" },
    ],
  },
  {
    _id: t6_team2,
    name: "Nets Torino",
    tournamentId: t6Id.toString(),
    players: [
      { name: "Luigi",    surname: "Datome",    jerseyNumber: "70" },
      { name: "Nicolò",   surname: "Melli",     jerseyNumber: "4"  },
      { name: "Amedeo",   surname: "Della Valle", jerseyNumber: "34"},
    ],
  },
  {
    _id: t6_team3,
    name: "Spurs Venezia",
    tournamentId: t6Id.toString(),
    players: [
      { name: "Simone",   surname: "Fontecchio", jerseyNumber: "33" },
      { name: "Alessandro", surname: "Pajola",   jerseyNumber: "0"  },
      { name: "Tommaso",  surname: "Baldasso",   jerseyNumber: "1"  },
    ],
  },
  {
    _id: t6_team4,
    name: "Celtics Genova",
    tournamentId: t6Id.toString(),
    players: [
      { name: "Achille",  surname: "Polonara",  jerseyNumber: "9"  },
      { name: "Michele",  surname: "Vitali",    jerseyNumber: "14" },
      { name: "Paul",     surname: "Biligha",   jerseyNumber: "11" },
    ],
  },
]);

// basketball: no draws allowed
db.matches.insertMany([
  // Round 1
  { tournamentId: t6Id.toString(), homeTeamId: t6_team1.toString(), awayTeamId: t6_team4.toString(), startDate: "2026-04-06", fieldId: fieldBasketball1._id.toString(), slot: "09:30 - 10:30", status: "played", result: "88-72" },
  { tournamentId: t6Id.toString(), homeTeamId: t6_team2.toString(), awayTeamId: t6_team3.toString(), startDate: "2026-04-08", fieldId: fieldBasketball2._id.toString(), slot: "10:30 - 11:30", status: "played", result: "65-79" },
  // Round 2
  { tournamentId: t6Id.toString(), homeTeamId: t6_team1.toString(), awayTeamId: t6_team3.toString(), startDate: "2026-04-13", fieldId: fieldBasketball1._id.toString(), slot: "14:30 - 15:30", status: "played", result: "91-84" },
  { tournamentId: t6Id.toString(), homeTeamId: t6_team4.toString(), awayTeamId: t6_team2.toString(), startDate: "2026-04-15", fieldId: fieldBasketball2._id.toString(), slot: "15:30 - 16:30", status: "played", result: "70-85" },
  // Round 3
  { tournamentId: t6Id.toString(), homeTeamId: t6_team1.toString(), awayTeamId: t6_team2.toString(), startDate: "2026-04-20", fieldId: fieldBasketball1._id.toString(), slot: "16:30 - 17:30", status: "played", result: "77-80" },
  { tournamentId: t6Id.toString(), homeTeamId: t6_team3.toString(), awayTeamId: t6_team4.toString(), startDate: "2026-04-22", fieldId: fieldBasketball2._id.toString(), slot: "17:30 - 18:30", status: "played", result: "95-61" },
]);

db.tournaments.insertOne({
  _id: t6Id,
  name: "Spring Basketball Championship",
  sport: "basketball",
  maxTeams: 4,
  startDate: "2026-04-06",
  creatorId: giulia._id.toString(),
  status: "completed",
  teamIds: [t6_team1.toString(), t6_team2.toString(), t6_team3.toString(), t6_team4.toString()],
});

// ─── T7: ACTIVE — Football, 4 teams, all 6 matches past but NO results yet ────
var t7Id = new ObjectId();
var t7_team1 = new ObjectId(); // Fiorentina Boys
var t7_team2 = new ObjectId(); // Juventus Club
var t7_team3 = new ObjectId(); // Inter Amatori
var t7_team4 = new ObjectId(); // Napoli Street

db.teams.insertMany([
  {
    _id: t7_team1,
    name: "Fiorentina Boys",
    tournamentId: t7Id.toString(),
    players: [
      { name: "Gabriel",  surname: "Batistuta", jerseyNumber: "9"  },
      { name: "Rui",      surname: "Costa",     jerseyNumber: "10" },
      { name: "Angelo",   surname: "Di Livio",  jerseyNumber: "7"  },
    ],
  },
  {
    _id: t7_team2,
    name: "Juventus Club",
    tournamentId: t7Id.toString(),
    players: [
      { name: "Alessandro", surname: "Del Piero", jerseyNumber: "10" },
      { name: "David",      surname: "Trezeguet", jerseyNumber: "17" },
      { name: "Edgar",      surname: "Davids",    jerseyNumber: "8"  },
    ],
  },
  {
    _id: t7_team3,
    name: "Inter Amatori",
    tournamentId: t7Id.toString(),
    players: [
      { name: "Ronaldo",   surname: "Nazario",   jerseyNumber: "9"  },
      { name: "Javier",    surname: "Zanetti",   jerseyNumber: "4"  },
      { name: "Christian", surname: "Vieri",     jerseyNumber: "32" },
    ],
  },
  {
    _id: t7_team4,
    name: "Napoli Street",
    tournamentId: t7Id.toString(),
    players: [
      { name: "Diego",    surname: "Maradona",  jerseyNumber: "10" },
      { name: "Careca",   surname: "Oliveira",  jerseyNumber: "9"  },
      { name: "Ciro",     surname: "Ferrara",   jerseyNumber: "6"  },
    ],
  },
]);

// All 6 matches have past dates, none have results yet
db.matches.insertMany([
  // Round 1
  { tournamentId: t7Id.toString(), homeTeamId: t7_team1.toString(), awayTeamId: t7_team4.toString(), startDate: "2026-06-02", fieldId: fieldFootball1._id.toString(), slot: "09:00 - 10:00", status: "upcoming", result: "-" },
  { tournamentId: t7Id.toString(), homeTeamId: t7_team2.toString(), awayTeamId: t7_team3.toString(), startDate: "2026-06-04", fieldId: fieldFootball2._id.toString(), slot: "10:00 - 11:00", status: "upcoming", result: "-" },
  // Round 2
  { tournamentId: t7Id.toString(), homeTeamId: t7_team1.toString(), awayTeamId: t7_team3.toString(), startDate: "2026-06-09", fieldId: fieldFootball1._id.toString(), slot: "11:00 - 12:00", status: "upcoming", result: "-" },
  { tournamentId: t7Id.toString(), homeTeamId: t7_team4.toString(), awayTeamId: t7_team2.toString(), startDate: "2026-06-11", fieldId: fieldFootball2._id.toString(), slot: "12:00 - 13:00", status: "upcoming", result: "-" },
  // Round 3
  { tournamentId: t7Id.toString(), homeTeamId: t7_team1.toString(), awayTeamId: t7_team2.toString(), startDate: "2026-06-16", fieldId: fieldFootball1._id.toString(), slot: "14:00 - 15:00", status: "upcoming", result: "-" },
  { tournamentId: t7Id.toString(), homeTeamId: t7_team3.toString(), awayTeamId: t7_team4.toString(), startDate: "2026-06-18", fieldId: fieldFootball2._id.toString(), slot: "15:00 - 16:00", status: "upcoming", result: "-" },
]);

db.tournaments.insertOne({
  _id: t7Id,
  name: "June Football Derby",
  sport: "football",
  maxTeams: 4,
  startDate: "2026-06-02",
  creatorId: mario._id.toString(),
  status: "active",
  teamIds: [t7_team1.toString(), t7_team2.toString(), t7_team3.toString(), t7_team4.toString()],
});

// ─── T8: ACTIVE — Basketball, 4 teams, all 6 matches past but NO results yet ──
var t8Id = new ObjectId();
var t8_team1 = new ObjectId(); // Basket Torino
var t8_team2 = new ObjectId(); // Slam Dunk Milano
var t8_team3 = new ObjectId(); // Pallacanestro Sud
var t8_team4 = new ObjectId(); // Dribble Venezia

db.teams.insertMany([
  {
    _id: t8_team1,
    name: "Basket Torino",
    tournamentId: t8Id.toString(),
    players: [
      { name: "Marco",   surname: "Belinelli", jerseyNumber: "3"  },
      { name: "Danilo",  surname: "Gallinari", jerseyNumber: "8"  },
      { name: "Luigi",   surname: "Datome",    jerseyNumber: "70" },
    ],
  },
  {
    _id: t8_team2,
    name: "Slam Dunk Milano",
    tournamentId: t8Id.toString(),
    players: [
      { name: "Andrea",  surname: "Bargnani",  jerseyNumber: "77" },
      { name: "Nicolò",  surname: "Melli",     jerseyNumber: "4"  },
      { name: "Simone",  surname: "Fontecchio", jerseyNumber: "33" },
    ],
  },
  {
    _id: t8_team3,
    name: "Pallacanestro Sud",
    tournamentId: t8Id.toString(),
    players: [
      { name: "Alessandro", surname: "Pajola",   jerseyNumber: "0"  },
      { name: "Achille",    surname: "Polonara", jerseyNumber: "9"  },
      { name: "Paul",       surname: "Biligha",  jerseyNumber: "11" },
    ],
  },
  {
    _id: t8_team4,
    name: "Dribble Venezia",
    tournamentId: t8Id.toString(),
    players: [
      { name: "Amedeo",  surname: "Della Valle", jerseyNumber: "34" },
      { name: "Michele", surname: "Vitali",      jerseyNumber: "14" },
      { name: "Tommaso", surname: "Baldasso",    jerseyNumber: "1"  },
    ],
  },
]);

db.matches.insertMany([
  // Round 1
  { tournamentId: t8Id.toString(), homeTeamId: t8_team1.toString(), awayTeamId: t8_team4.toString(), startDate: "2026-06-02", fieldId: fieldBasketball1._id.toString(), slot: "09:30 - 10:30", status: "upcoming", result: "-" },
  { tournamentId: t8Id.toString(), homeTeamId: t8_team2.toString(), awayTeamId: t8_team3.toString(), startDate: "2026-06-04", fieldId: fieldBasketball2._id.toString(), slot: "10:30 - 11:30", status: "upcoming", result: "-" },
  // Round 2
  { tournamentId: t8Id.toString(), homeTeamId: t8_team1.toString(), awayTeamId: t8_team3.toString(), startDate: "2026-06-09", fieldId: fieldBasketball1._id.toString(), slot: "14:30 - 15:30", status: "upcoming", result: "-" },
  { tournamentId: t8Id.toString(), homeTeamId: t8_team4.toString(), awayTeamId: t8_team2.toString(), startDate: "2026-06-11", fieldId: fieldBasketball2._id.toString(), slot: "15:30 - 16:30", status: "upcoming", result: "-" },
  // Round 3
  { tournamentId: t8Id.toString(), homeTeamId: t8_team1.toString(), awayTeamId: t8_team2.toString(), startDate: "2026-06-16", fieldId: fieldBasketball1._id.toString(), slot: "16:30 - 17:30", status: "upcoming", result: "-" },
  { tournamentId: t8Id.toString(), homeTeamId: t8_team3.toString(), awayTeamId: t8_team4.toString(), startDate: "2026-06-18", fieldId: fieldBasketball2._id.toString(), slot: "17:30 - 18:30", status: "upcoming", result: "-" },
]);

db.tournaments.insertOne({
  _id: t8Id,
  name: "June Basketball Derby",
  sport: "basketball",
  maxTeams: 4,
  startDate: "2026-06-02",
  creatorId: mario._id.toString(),
  status: "active",
  teamIds: [t8_team1.toString(), t8_team2.toString(), t8_team3.toString(), t8_team4.toString()],
});

print("Database initialized: 5 users, 6 fields, 8 tournaments, 28 teams, 36 matches.");
