const data = require('./Data');
const textFileMetaDatafile = require('./data/metadata_tables')
const audioSetMetaDatafile = require('./data/metadata_audio')
const express = require('express');
const app = express();
const assert = require('assert');
// store config variables in dotenv
require('dotenv').config();
// ORM (Object-Relational Mapper library)
const Sequelize = require('sequelize');

/* const pg = require('pg');
var client = new pg.Client({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  host: process.env.DB_HOST,
  ssl: true
}); 
client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
});
const Query = require('pg').Query
const query = new Query('select now()')
const result = client.query(query)
assert(query === result) // true
query.on('row', row => {
  console.log('row!', row) // { the time }
})
query.on('end', () => {
  console.log('query done')
})
query.on('error', err => {
  console.error(err.stack)
}) */

// ****** Set up default MYSQL connection START ****** //
 const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: true
    },
    //operatorsAliases: false,
    pool: { max: 5, min: 0, acquire: 300000, idle: 10000 },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true
    },
    //logging:false
  });

sequelize
.authenticate()
.then(() => {
  console.log('connected to POSTGRES- COLRC database');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});
// ****** Set up default POSTGRES connection END ****** //

// first provide all the fundamental types
const User = sequelize.define('users', {
  name: { type: Sequelize.STRING },
  created_at: { type: Sequelize.DATE },
  last_seen: { type: Sequelize.DATE }
},
{
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

// Find all users
async function getUsers() {
  const users = await User.findAll();
  // const users = await User.findAll({
  //   attributes: ['name', 'last_seen']
  // });
  console.log(users.every(user => user instanceof User)); // true
  console.log("All users:", JSON.stringify(users, null, 2));
}

getUsers();

const Root = sequelize.define('roots', {
  root: { type: Sequelize.TEXT },
  number: { type: Sequelize.INTEGER },
  sense: {type: Sequelize.TEXT},
  salish: { type: Sequelize.TEXT },
  nicodemus: { type: Sequelize.TEXT },
  symbol: {type: Sequelize.TEXT },
  english: { type: Sequelize.TEXT },
  grammar: { type: Sequelize.TEXT },
  crossref: { type: Sequelize.TEXT },
  variant: { type: Sequelize.TEXT },
  cognate: { type: Sequelize.TEXT },
  edit_note: { type: Sequelize.TEXT },
  active: { type: Sequelize.TEXT },
  prev_id: { type: Sequelize.INTEGER },
  user_id: { type: Sequelize.TEXT }
},
{
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

// Find all roots
async function getRoots() {
  const roots = await Root.findAll({
    order: [
        ['root', 'ASC']
    ],
    attributes: ['root', 'salish', 'nicodemus'],
    limit: 100
});
  // const roots = await Roots.findAll({
  //   attributes: ['salish', 'nicodemus']
  // });
  console.log(roots.every(root => root instanceof Root)); // true
  console.log("All roots:", JSON.stringify(roots, null, 2));
}

// next, build the Root Dictionary, Affix List and Stem List from files in the 'data' directory
async function makeRootTable(){
  //await Root.sync({force: true});
  var fs = require('fs');
  var contents = fs.readFileSync('data/fixed_entries_trim.txt', 'utf8');
  var rows = contents.split("\n");
  for (row of rows) {
    row = row.replace(/(\r)/gm, "");
    columns = row.split(":::");
    console.log(columns)
    if (columns[5]) {
      await Root.create({
        root: columns[2],
        number: columns[3] ? parseInt(columns[3]) : 0,
        sense: columns[4],
        salish: columns[5],
        nicodemus: columns[6],
        symbol: columns[7],
        english: columns[8],
        grammar: columns[9],
        crossref: columns[10],
        variant: columns[11],
        cognate: columns[12],
        edit_note: columns[13],
        active: 'Y',
        prev_id: Sequelize.NULL,
        user_id: "auth0|5e4c1705b6ef8d0e9ccffd60"
      })
    }
  }
  console.log("I have a roots table");
}

//makeRootTable();

getRoots();
 
/* const Affix = sequelize.define('affix', {
  type: { type: Sequelize.STRING },
  salish: { type: Sequelize.STRING },
  nicodemus: { type: Sequelize.STRING },
  english: { type: Sequelize.STRING },
  link: { type: Sequelize.STRING },
  page: { type: Sequelize.STRING },
  editnote: { type: Sequelize.STRING },
  active: { type: Sequelize.STRING(1) },
  prevId: { type: Sequelize.INTEGER },
  userId: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const Stem = sequelize.define('stem', {
  category: { type: Sequelize.STRING },
  reichard: { type: Sequelize.STRING },
  doak: { type: Sequelize.STRING },
  salish: { type: Sequelize.STRING },
  nicodemus: { type: Sequelize.STRING },
  english: { type: Sequelize.STRING },
  note: { type: Sequelize.STRING },
  editnote: { type: Sequelize.STRING },
  active: { type: Sequelize.STRING(1) },
  prevId: { type: Sequelize.INTEGER },
  userId: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const Spelling = sequelize.define('spelling', {
  reichard: { type: Sequelize.STRING },
  nicodemus: { type: Sequelize.STRING },
  salish: { type: Sequelize.STRING },
  english: { type: Sequelize.STRING },
  note: { type: Sequelize.STRING },
  active: { type: Sequelize.STRING(1) },
  prevId: { type: Sequelize.INTEGER },
  userId: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const Vowel = sequelize.define('vowel', {
  orthography: { type: Sequelize.STRING },
  height: { type: Sequelize.STRING },
  front: { type: Sequelize.STRING },
  central: { type: Sequelize.STRING },
  back: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const Consonant = sequelize.define('consonant', {
  orthography: { type: Sequelize.STRING },
  voice: { type: Sequelize.STRING },
  manner: { type: Sequelize.STRING },
  secondary: { type: Sequelize.STRING },
  labial: { type: Sequelize.STRING },
  alveolar: { type: Sequelize.STRING },
  alveopalatal: { type: Sequelize.STRING },
  lateral: { type: Sequelize.STRING },
  palatal: { type: Sequelize.STRING },
  velar: { type: Sequelize.STRING },
  uvular: { type: Sequelize.STRING },
  glottal: { type: Sequelize.STRING },
  pharyngeal: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const Bibliography = sequelize.define('bibliography', {
  author: { type: Sequelize.STRING },
  year: { type: Sequelize.STRING },
  title: { type: Sequelize.STRING },
  reference: { type: Sequelize.STRING },
  link: { type: Sequelize.STRING },
  linktext: { type: Sequelize.STRING },
  active: { type: Sequelize.STRING(1) },
  prevId: { type: Sequelize.INTEGER },
  userId: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const Text = sequelize.define('text', {
  title: { type: Sequelize.STRING },
  speaker: { type: Sequelize.STRING },
  cycle: { type: Sequelize.STRING },
  rnumber: { type: Sequelize.STRING },
  tnumber: { type: Sequelize.STRING },
  active: { type: Sequelize.STRING(1) },
  prevId: { type: Sequelize.INTEGER },
  userId: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const Textfile = sequelize.define('textfile', {
  subdir: { type: Sequelize.STRING },
  src: { type: Sequelize.STRING },
  resType: { type: Sequelize.STRING },
  msType: { type: Sequelize.STRING },
  fileType: { type: Sequelize.STRING },
  textId: { type: Sequelize.STRING },
  active: { type: Sequelize.STRING(1) },
  prevId: { type: Sequelize.INTEGER },
  userId: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const Textimage = sequelize.define('textimage', {
  subdir: { type: Sequelize.STRING },
  src: { type: Sequelize.STRING },
  active: { type: Sequelize.STRING(1) },
  prevId: { type: Sequelize.INTEGER },
  userId: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const TextFileMetaData = sequelize.define('textfilemetadata', {
  textFileId: { type: Sequelize.INTEGER },
  metadata:{ type: Sequelize.TEXT }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});


const Audioset = sequelize.define('audioset', {
  title: { type: Sequelize.STRING },
  speaker: { type: Sequelize.STRING },
  active: { type: Sequelize.STRING(1) },
  textId: { type: Sequelize.STRING },
  userId: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const Audiofile = sequelize.define('audiofile', {
  subdir: { type: Sequelize.STRING },
  src: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING },
  direct: { type: Sequelize.STRING },
  active: { type: Sequelize.STRING(1) },
  userId: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const AudioSetMetaData = sequelize.define('audiosetmetadata', {
  audioSetId: { type: Sequelize.INTEGER },
  metadata:{ type: Sequelize.TEXT }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const Elicitationset = sequelize.define('elicitationset', {
  title: { type: Sequelize.STRING },
  language: { type: Sequelize.STRING },
  speaker: { type: Sequelize.STRING },
  transcription: { type: Sequelize.STRING },
  editnote: { type: Sequelize.STRING },
  active: { type: Sequelize.STRING(1) },
  userId: { type: Sequelize.STRING },
  prevID: { type: Sequelize.INTEGER }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

const Elicitationfile = sequelize.define('elicitationfile', {
  src: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING },
  direct: { type: Sequelize.STRING },
  active: { type: Sequelize.STRING(1) },
  userId: { type: Sequelize.STRING }
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

// fundamental types for relation tables, supporting many-to-many mappings
// audiosets to audiofiles; elicitationsets to elicitationfiles; textfiles to textimages;
// texts to textfiles; and texts to audiosets

// audiosets to audiofiles
const Audiorelation = sequelize.define('audiorelation', {
  AudiosetId: { type: Sequelize.STRING },
  AudiofileId: { type: Sequelize.STRING },
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

// audiosets to audiometadata
// const Audiometadatarelation = sequelize.define('audiometadatarelation', {
//   AudiosetId: { type: Sequelize.STRING },
//   AudiosetmetadataId: { type: Sequelize.STRING },
// },
// {
//   charset: 'utf8mb4',
//   collate: 'utf8mb4_unicode_ci'
// });

// elicitationsets to elicitationfiles
const Elicitationrelation = sequelize.define('elicitationrelation', {
  ElicitationsetId: { type: Sequelize.STRING },
  ElicitationfileId: { type: Sequelize.STRING },
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

// textfiles to textimages
const Filetoimagerelation = sequelize.define('filetoimagerelation', {
  TextfileId: { type: Sequelize.STRING },
  TextimageId: { type: Sequelize.STRING },
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

// // textfiles to textfilemetadata
// const Filetometadatarelation = sequelize.define('filetometadatarelation', {
//   TextfileId: { type: Sequelize.STRING },
//   TextfilemetadataId: { type: Sequelize.STRING },
// },
// {
//   charset: 'utf8mb4',
//   collate: 'utf8mb4_unicode_ci'
// });

//texts to textfiles
const Texttofilerelation = sequelize.define('texttofilerelation', {
  TextId: { type: Sequelize.STRING },
  TextfileId: { type: Sequelize.STRING },
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

// texts to audiosets
const Texttoaudiosetrelation = sequelize.define('texttoaudiosetrelation', {
  TextId: { type: Sequelize.STRING },
  AudiosetId: { type: Sequelize.STRING },
},
{
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

// now establiehs the many-to-many relationships via foreignKeys
// audiosets to audiofiles
Audioset.belongsToMany( Audiofile, {
  //as: [SetToFile],
  through: "audiorelations", //this can be string or a model,
  foreignKey: 'AudiosetId'
})
Audiofile.belongsToMany( Audioset, {
  //as: [FileToSet],
  through: "audiorelations",
  foreignKey: 'AudiofileId'
})
// elicitationsets to elicitationfiles
Elicitationset.belongsToMany( Elicitationfile, {
  through: "elicitationrelations", //this can be string or a model,
  foreignKey: 'ElicitationsetId'
})
Elicitationfile.belongsToMany( Elicitationset, {
  through: "elicitationrelations",
  foreignKey: 'ElicitationfileId'
})
//Textfiles to textimages
Textfile.belongsToMany( Textimage, {
  through: "filetoimagerelations", //this can be string or a model,
  foreignKey: 'TextfileId'
})
Textimage.belongsToMany( Textfile, {
  through: "filetoimagerelations", //this can be string or a model,
  foreignKey: 'TextimageId'
})
//Texts to textfiles
Text.belongsToMany( Textfile, {
  through: "texttofilerelations", //this can be string or a model,
  foreignKey: 'TextId'
})
Textfile.belongsToMany( Text, {
  through: "texttofilerelations", //this can be string or a model,
  foreignKey: 'TextfileId'
})
//Texts to audiosets
Text.belongsToMany( Audioset, {
  through: "texttoaudiosetrelations", //this can be string or a model,
  foreignKey: 'TextId'
})
Audioset.belongsToMany( Text, {
  through: "texttoaudiosetrelations", //this can be string or a model,
  foreignKey: 'AudiosetId'
})

// Now functions to build tables.  First the empty relations tables
// audioset to audiofile
async function makeAudiorelationTable(){
  await Audiorelation.sync({force: true});
}

// elicitationset to elicitationfile
async function makeElicitationrelationTable(){
  await Elicitationrelation.sync({force: true});
}

// textfile to textimages
async function makeFiletoimagerelationTable(){
  await Filetoimagerelation.sync({force: true});
}

// text to textfiles
async function makeTexttofilerelationTable(){
  await Texttofilerelation.sync({force: true});
}

// text to audiosets
async function makeTexttoaudiosetrelationTable(){
  await Texttoaudiosetrelation.sync({force: true});
}

// now build tables from data
// build the users table
async function makeUsersTable(){
  // force: true will drop the table if it already exists
  await User.sync({force: true})
  for (row of data.users) {
    // Table created
    await User.create({
      first: row.first,
      last: row.last,
      username: row.username,
      email: row.email,
      password: row.password,
      roles: row.roles
    });
  }
}

// next, build the Root Dictionary, Affix List and Stem List from files in the 'data' directory
async function makeRootTable(){
  await Root.sync({force: true});
  var fs = require('fs');
  var contents = fs. readFileSync('data/fixed_entries_trim.txt', 'utf8');
  var rows = contents.split("\n");
  for (row of rows) {
    row = row.replace(/(\r)/gm, "");
    columns = row.split(":::");
    if (columns[5]) {
      await Root.create({
        root: columns[2],
        number: parseInt(columns[3]),
        sense: columns[4],
        salish: columns[5],
        nicodemus: columns[6],
        symbol: columns[7],
        english: columns[8],
        grammar: columns[9],
        crossref: columns[10],
        variant: columns[11],
        cognate: columns[12],
        editnote: columns[13],
        active: 'Y',
        prevId: Sequelize.NULL,
        userId: "1"
      })
    }
  }
  console.log("I have a roots table");
}

async function makeAffixTable(){
  await Affix.sync({force: true});
  var fs = require('fs');
  var contents = fs. readFileSync('data\\affixes_spelled.txt', 'utf8');
  var rows = contents.split("\n");
  for (row of rows) {
    row = row.replace(/(\r)/gm, "");
    columns = row.split(":::");
    if (columns[2]) {
      await Affix.create({
        type: columns[0],
        salish: columns[1],
        nicodemus: columns[2],
        english: columns[3],
        link: columns[4],
        page: columns[5],
        editnote: Sequelize.NULL,
        active: 'Y',
        prevId: Sequelize.NULL,
        userId: "1"
      });
    }
  }
  console.log("I have an affixes table");
}

async function makeStemTable(){
  await Stem.sync({force: true});
  var fs = require('fs');
  var contents = fs. readFileSync('data\\stems_both_lists_nodoak_spelled.txt', 'utf8');
  var rows = contents.split("\n");
  for (row of rows) {
    row = row.trim();
    row = row.replace(/(\r)/gm, "");
    columns = row.split(":::");
    if (columns[5]) {
      await Stem.create({
        category: columns[0],
        reichard: columns[2],
        doak: columns[3],
        salish: columns[4],
        nicodemus: columns[5],
        english: columns[6],
        note: columns[7],
        editnote: Sequelize.NULL,
        active: 'Y',
        prevId: Sequelize.NULL,
        userId: "1"
      });
    }
  }
  console.log("I have a stems table");
}

// make the bibliography table, using Data.js
async function makeBibliographyTable(){
	await Bibliography.sync({force: true});
	var contents = data.bibliography;
  for (row of data.bibliography) {
	//contents.forEach(async function (row) {
		await Bibliography.create({
      author: row.author,
      year: row.year,
      title: row.title,
      reference: row.reference,
      link: row.link,
      linktext: row.linktext,
      active: 'Y',
      prevId: Sequelize.NULL,
      userId: "1"
		});
	}
	console.log("I have a bibliography table");
}

// this table builds the spelling list, using Data.js
async function makeSpellingTable(){
  await Spelling.sync({force: true});
  for (row of data.spelling) {
  //data.spelling.forEach(async function (row) {
    await Spelling.create({
      reichard: row.reichard,
      salish: row.salish,
      nicodemus: row.nicodemus,
      english: row.english,
      note: row.note,
      active: 'Y',
      prevId: Sequelize.NULL,
      userId: "1"
    });
  };
  console.log("I have a spelling table");
}

// make the consonant chart, using Data.js
async function makeConsonantTable(){
  console.log(data.consonants)
  await Consonant.sync({force: true});
  for (row of data.consonants) {
  //data.consonants.forEach(async function (row) {
    await Consonant.create({
      orthography: row.orthography ? row.orthography : '',
      voice: row.voice ? row.voice : '',
      manner: row.manner ? row.manner : '',
      secondary: row.secondary ? row.secondary : '',
      labial: row.labial ? row.labial : '',
      alveolar: row.alveolar ? row.alveolar : '',
      alveopalatal: row.alveopalatal ? row.alveopalatal : '',
      lateral: row.lateral ? row.lateral : '',
      palatal: row.palatal ? row.palatal : '',
      velar: row.velar ? row.velar : '',
      uvular: row.uvular ? row.uvular : '',
      glottal: row.glottal ? row.glottal : '',
      pharyngeal: row.pharyngeal ? row.pharyngeal : '',
    });
  };
  console.log("I have a consonant table");
}

// make the vowel chart, using Data.js
async function makeVowelTable(){
  await Vowel.sync({force: true});
  for (row of data.vowels) {
  //data.vowels.forEach(async function (row) {
    await Vowel.create({
      orthography: row.orthography,
      height: row.height,
      front: row.front,
      central: row.central,
      back: row.back,
    });
  };
  console.log("I have a vowel table");
}
// media tables are next, and these are complicated.
// make the Text table, using Data.js
async function makeTextTable(){
  await Text.sync({force: true});
  for (row of data.texts) {
  //data.texts.forEach(async function (row) {
    await Text.create({
      title: row.title,
      speaker: row.speaker,
      cycle: row.cycle,
      rnumber: row.rnumber,
      tnumber: row.tnumber,
      active: 'Y',
      prevId: Sequelize.NULL,
      userId: '1'
    });
  };
  console.log("I have a texts table");
}

// the textfiles table requires the texttofilerelation table
async function makeTextfileTable(){
  await makeTexttofilerelationTable();
  await Textfile.sync({force: true});
  for (row of data.textfiles) {
    let newTextfile = await Textfile.create({
      subdir: row.subdir,
      src: row.src,
      resType: row.resType,
      msType: row.msType,
      fileType: row.fileType,
      textID: row.textId,
      active: 'Y',
      prevId: Sequelize.NULL,
      userId: '1'
    })
    let myText = await Text.findOne({  where: {id: row.textId} })
    await newTextfile.addText(myText)
  };
  console.log("I have a textfiles table")
}

// the textimage table requires the filetoimagerelation table and the textfile table
async function makeTextimageTable(){
  await makeFiletoimagerelationTable();
  await makeTextfileTable();
  await Textimage.sync({force: true});
  for (row of data.textimages) {
    let newTextImage = await Textimage.create({
      subdir: row.subdir,
      src: row.src,
      active: 'Y',
      prevId: Sequelize.NULL,
      userId: '1'
    })
    let myTextFile = await Textfile.findOne({  where: {id: row.textfileId} })
    await newTextImage.addTextfile(myTextFile)
  };
  console.log("I have a textimages table");
}

async function makeTextFileMetaDataTable(){
  await TextFileMetaData.sync({force: true});
  for (row of textFileMetaDatafile.metadata) {
    await TextFileMetaData.create({
      textFileId: row.textFileId,
      metadata: "{ \"originalTitle\" : \"" + row.originalTitle + "\", \n" +
      "\"isVersionofEngl\" : \"" + row.isVersionofEngl + "\" }" 
    });
  };
  console.log("I have a textfilemetadata table");
}

async function makeAudioSetMetaDataTable(){
  await AudioSetMetaData.sync({force: true});
  for (row of audioSetMetaDatafile.audiometadata) {
    await AudioSetMetaData.create({
      audioSetId: row.audioSetId,
      metadata: "{ \"originalTitle\" : \"" + row.originalTitle + "\", \n" +
      "\"isFormatofCrd\" : \"" + row.isFormatofCrd + "\" }" 
    });
  };
  console.log("I have a audiosetmetadata table");
}

// make the audioset table
async function makeAudiosetTable(){
  await makeTexttoaudiosetrelationTable();
  await Audioset.sync({force: true});
  for (row of data.audiosets) {
    let newAudioSet = await Audioset.create({
      title: row.title,
      speaker: row.speaker,
      textId: row.textId,
      active: 'Y',
      prevId: Sequelize.NULL,
      userId: '1'
    })
    let myText = await Text.findOne({  where: {id: row.textId} })
    await newAudioSet.addText(myText)
  };
  console.log("I have an audiosets table");
}

// make the audiofile table from Data.js
async function makeAudiofileTable(){
  await makeAudiosetTable()
  await makeAudiorelationTable()
  await Audiofile.sync({force: true})
  for (row of data.audiofiles) {
    let newAudioFile = await Audiofile.create({
      subdir: row.subdir,
      src: row.src,
      type: row.type,
      direct: row.direct,
      active: 'Y',
      prevId: Sequelize.NULL,
      userId: '1'
    })
    let myAudioSet = await Audioset.findOne({  where: {id: row.audiosetId} })
    await newAudioFile.addAudioset(myAudioSet)
  }
  console.log("I have an audiofiles table")
}

// make the elicitationset table
async function makeElicitationsetTable(){
  await Elicitationset.sync({force: true});
  for (row of data.elicitationsets) {
  //data.elicitationsets.forEach(await async function (row) {
    await Elicitationset.create({
      title: row.title,
      language: row.language,
      speaker: row.speaker,
      transcription: row.transcription,
      editnote: Sequelize.NULL,
      active: 'Y',
      prevId: Sequelize.NULL,
      userId: '1'
    });
  };
  console.log("I have an elicitationsets table");
}

// make the elicitationfile table from Data.js
async function makeElicitationfileTable(){
  await makeElicitationrelationTable();
  await makeElicitationsetTable();
  await Elicitationfile.sync({force: true});
  for (row of data.elicitationfiles) {
    let newElicitationFile = await Elicitationfile.create({
      src: row.src,
      type: row.type,
      direct: row.direct,
      active: 'Y',
      prevId: Sequelize.NULL,
      userId: '1'
    })
    let myElicitationSet = await Elicitationset.findOne({  where: {id: row.elicitationId} })
    await console.log("Elicitation set id: " + myElicitationSet.id + ", elicitation title: " + myElicitationSet.title)
    await console.log("Elicitation file id: " + newElicitationFile.id + ", elicitation src: " + newElicitationFile.src)
    await myElicitationSet.addElicitationfile(newElicitationFile)
  }
  console.log("I have an elicitationfiles table");
}

// we can bundle these table builds, but order matters.  Relation tables must come before
// the tables that use them
async function makeMedia(){
  await makeFiletoimagerelationTable();
  await makeTexttofilerelationTable();
  await makeTexttoaudiosetrelationTable();
  await makeAudiorelationTable();
  await makeTextTable();
  await makeTextimageTable();
  await makeAudiofileTable();
  await makeElicitationfileTable();
}

async function makeTables(){
  await makeAudioSetMetaDataTable();
  await makeTextFileMetaDataTable();
  await makeUsersTable();
  await makeRootTable();
  await makeStemTable();
  await makeAffixTable();
  await makeBibliographyTable();
  await makeSpellingTable();
  await makeConsonantTable();
  await makeVowelTable();
  await makeMedia();
}

// below call the build function(s) you want.
//makeRootTable()
//makeStemTable();
makeTables();
//makeAudiofileTable();
//makeElicitationfileTable();
//makeMedia();
//makeUsersTable()
 */