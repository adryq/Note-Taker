const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//HTML route to return notes.html file
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

  // API route to get all saved notes
  app.get('/api/notes', (req, res) => {
    res.json(notes)
})


//HTML route to return index.html file
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);



// POST request to add a note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text} = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };
  
      // Obtain existing notes
      fs.readFile('./db/db.json', 'utf8',(err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNote);
  
          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.json(response);
    } else {
      res.json('Error in posting note');
    }
  });

  app.delete('/api/notes/:id', (req, res) => {
      const noteID = req.params.note_id;
      console.log(notes);
      for(let i = 0; i < notes.length; i++){
          const note = notes[i];
          console.log(notes[i])
          if(notes.note_id === noteID){
              const index = notes.findIndex;
              notes.splice(index, 1);
              fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
          }
      }
  })




app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
