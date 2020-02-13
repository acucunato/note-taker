const path = require("path");
const fs = require("fs");

module.exports = function(app) {
  app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "db/db.json"));
  });

  app.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let noteID = savedNotes.length.toString();
    newNote.id = noteID;
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("New Note saved to db.json file. Your note: ", newNote);
    res.json(savedNotes);
  });

  //deleting notes with their unique id
  app.delete("/api/notes/:id", function(req, res) {
    let deleteNote = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let targetID = req.params.id;

    console.log(`Deleting note with ID ${targetID}`);
    for (var i = 0; i < deleteNote.length; i++) {
      if (deleteNote[i].id == targetID) {
        deleteNote.splice(i, 1);
      }
    }
    //rewrites ids to increment through again
    for (i = 0; i < deleteNote.length; i++) {
      deleteNote[i].id = i;
    }

    // writes new array
    fs.writeFileSync("./db/db.json", JSON.stringify(deleteNote), err => {
      if (err) throw err;
      return;
    });
    res.send(req.body);
  });
};
