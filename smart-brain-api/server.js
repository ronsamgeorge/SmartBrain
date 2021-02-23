import express, { response } from "express";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import knex from "knex";

const saltRounds = 10;
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "password",
    database: "smartbrainapi",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log("hi");
  });

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("yes");
});

// SIgn in routing , Since we are sending data hence its POST
app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            console.log(user);
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("wrong credentials"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("Wrong Credentials"));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  /*bcrypt.hash("bacon", null, null, function(err, hash) {
        // Store hash in your password DB.
    });*/

  console.log("trying to hash");
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  console.log("hashed");

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((users) => res.json(users[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(404).json("unable to Register"));
});

app.get("/profile/:id", (req, res) => {
  //res.json("found");

  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("user not found");
      }
    });
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      console.log(entries[0]);
      res.json(entries[0]);
    })
    .catch((err) => {
      res.status(400).json("UNABLE TO FIND");
    });
});

app.listen(8000, () => {
  console.log("Running");
});
