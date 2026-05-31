// initialization test for db

db = db.getSiblingDB('sportapp'); // creates & switches to your DB

// --- Fields ---
db.fields.insertMany([
  {
    name: "Campo A",
    sport: "football",
    address: "Via Roma 1, Milano",
    slots: ["09:00", "11:00", "14:00", "16:00", "18:00"]
  },
  {
    name: "Campo B",
    sport: "basketball",
    address: "Via Garibaldi 5, Roma",
    slots: ["10:00", "12:00", "15:00", "17:00"]
  },
  {
    name: "Campo C",
    sport: "volleyball",
    address: "Via Dante 9, Napoli",
    slots: ["09:00", "11:00", "14:00", "16:00"]
  }
]);

// --- Users (passwords are plaintext here — hash them in real seeds) ---
db.users.insertMany([
  { username: "mario", password: "hashed_pw_1", name: "Mario", surname: "Rossi" },
  { username: "luigi", password: "hashed_pw_2", name: "Luigi", surname: "Verdi" }
]);

print("✅ Database initialized successfully");