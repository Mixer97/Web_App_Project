

db = db.getSiblingDB('sportapp'); // creates & switches to your DB

// --- Users (passwords are plaintext here — hash them in real seeds) ---
db.users.insertMany([
  {
    username: "mario",
    password: "hashed_pw_1",
    email: "mario@example.com",
    name: "Mario",
    surname: "Rossi"
  },
  {
    username: "luigi",
    password: "hashed_pw_2",
    email: "luigi@example.com",
    name: "Luigi",
    surname: "Verdi"
  },
  {
    username: "anna",
    password: "hashed_pw_3",
    email: "anna@example.com",
    name: "Anna",
    surname: "Bianchi"
  },
  {
    username: "giulia",
    password: "hashed_pw_4",
    email: "giulia@example.com",
    name: "Giulia",
    surname: "Neri"
  },
  {
    username: "paolo",
    password: "hashed_pw_5",
    email: "paolo@example.com",
    name: "Paolo",
    surname: "Galli"
  }
]);

db.fields.insertMany([
  {
    name: "Campo Football 1",
    sport: "football",
    address: "Via Roma 1, Milano",
    slots: ["09:00", "11:00", "14:00", "16:00", "18:00"]
  },
  {
    name: "Campo Football 2",
    sport: "football",
    address: "Via Torino 10, Torino",
    slots: ["10:00", "12:00", "15:00", "17:00"]
  },
  {
    name: "Campo Volleyball 1",
    sport: "volleyball",
    address: "Via Dante 9, Napoli",
    slots: ["09:00", "11:00", "14:00", "16:00"]
  },
  {
    name: "Campo Volleyball 2",
    sport: "volleyball",
    address: "Corso Italia 22, Firenze",
    slots: ["10:00", "12:00", "15:00", "18:00"]
  },
  {
    name: "Campo Basketball 1",
    sport: "basketball",
    address: "Via Garibaldi 5, Roma",
    slots: ["09:30", "11:30", "14:30", "16:30"]
  },
  {
    name: "Campo Basketball 2",
    sport: "basketball",
    address: "Piazza Duomo 3, Bologna",
    slots: ["10:30", "12:30", "15:30", "17:30"]
  }
]);

// --- Bookings ---
const mario = db.users.findOne({ username: "mario" });
const luigi = db.users.findOne({ username: "luigi" });
const anna = db.users.findOne({ username: "anna" });

const fieldFootball1 = db.fields.findOne({ name: "Campo Football 1" });
const fieldBasket1 = db.fields.findOne({ name: "Campo Basketball 1" });
const fieldVolley1 = db.fields.findOne({ name: "Campo Volleyball 1" });

db.bookings.insertMany([
  {
    fieldId: fieldFootball1._id.toString(),
    userId: mario._id.toString(),
    date: "2026-06-03",
    slot: "09:00"
  },
  {
    fieldId: fieldFootball1._id.toString(),
    userId: luigi._id.toString(),
    date: "2026-06-03",
    slot: "11:00"
  },
  {
    fieldId: fieldBasket1._id.toString(),
    userId: anna._id.toString(),
    date: "2026-06-04",
    slot: "14:30"
  },
  {
    fieldId: fieldVolley1._id.toString(),
    userId: mario._id.toString(),
    date: "2026-06-05",
    slot: "16:00"
  },
  {
    fieldId: fieldBasket1._id.toString(),
    userId: luigi._id.toString(),
    date: "2026-06-06",
    slot: "09:30"
  }
]);

print("Database initialized successfully");