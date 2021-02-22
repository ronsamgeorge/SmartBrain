import express from "express";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
const database = {
  users: [
    {
      id: "123",
      name: "same",
      email: "same@email.com",
      password: "123",
      entries: 0,
      join: new Date(),
    },
    {
      id: "124",
      name: "sal",
      email: "sal@email.com",
      password: "123",
      entries: 0,
      join: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

// SIgn in routing , Since we are sending data hence its POST
app.post("/signin", (req, res) => {
  //res.json("signin");

  /* bcrypt.compare("bacon", hash, function(err, res) {
        // res == true
    });*/

  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("Wrong password");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  /*bcrypt.hash("bacon", null, null, function(err, hash) {
        // Store hash in your password DB.
    });*/

  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    join: new Date(),
  });

  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  //res.json("found");

  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });

  if (found == false) {
    res.json("user not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  var found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      res.json(user.entries);
    }
  });

  if (found == false) {
    res.json("user not found");
  }
});

app.listen(8000, () => {
  console.log("Running");
});
