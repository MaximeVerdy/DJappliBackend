var express = require('express');
var router = express.Router();
var mongoose = require('../bdd/connexion');
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')
var HoteModel = require('../bdd/SchemaHote');
var eventModel = require('../bdd/SchemaEvent')
var tourdevoteModel = require('../bdd/SchemaTourdevote')
var topModel = require('../bdd/SchemaTop');
var playlistModel = require('../bdd/SchemaPlaylistTitresProposes');


// route initiale créée de base
router.get('/', function (req, res, next) {
  res.send({title: "Express"});
});


router.post('/findEvent', async function(req,res,next){

  var eventIsOpen= await eventModel.findOne({ user: req.body.idUserFromFront, isOpen: true })

  var eventIsClosed= await eventModel.findOne ({ user: req.body.idUserFromFront, isOpen: false })

if (eventIsOpen && eventIsClosed) {
  res.json({eventIsOpen, eventIsClosed})
}

else if (eventIsOpen) {
  res.json({eventIsOpen})
} 

else {
  res.json({result: false})
} 

})


// route permettant la proposition à l'hôte de 5 titres aléatoires venant de la collection Top
router.post('/findTOP', async function(req,res,next){

  var TOP = await topModel.find();

  var randomNumber = Math.floor(Math.random() * 117);
  var title1 = TOP[randomNumber].chanson
  var title2 = TOP[randomNumber + 1].chanson
  var title3 = TOP[randomNumber + 2].chanson
  var title4 = TOP[randomNumber + 3].chanson
  var title5 = TOP[randomNumber + 4].chanson

  var randomTitles = [title1, title2, title3, title4, title5]

  // 5 titres suggérés mis dans la collection Playlist :
  var title1FORMATTING = new playlistModel ({
    user: req.body.userIdFromFront,
    titre: title1,
    votes: [],
  })
  var title1SAVED = await title1FORMATTING.save();

  var title2FORMATTING = new playlistModel ({
    user: req.body.userIdFromFront,
    titre: title2,
    votes: [],
  })
  var title2SAVED = await title2FORMATTING.save();

  var title3FORMATTING = new playlistModel ({
    user: req.body.userIdFromFront,
    titre: title3,
    votes: [],
  })
  var title3SAVED = await title3FORMATTING.save();

  var title4FORMATTING = new playlistModel ({
    user: req.body.userIdFromFront,
    titre: title4,
    votes: [],
  })
  var title4SAVED = await title4FORMATTING.save();

  var title5FORMATTING = new playlistModel ({
    user: req.body.userIdFromFront,
    titre: title5,
    votes: [],
  })
  var title5SAVED = await title5FORMATTING.save();
  
  res.json({randomTitles})

 
})

// route d'accès à la playlist d'une soirée en base de données dans la collection Top
router.post('/playlist', async function(req,res,next){

  var playlistDB = await playlistModel.find({user: req.body.idUserFromFront});

  res.json({playlistDB})

})


router.post('/sign-up', async function (req, res, next) {

  var hotes = await HoteModel.findOne({ email: req.body.email });



  if (hotes === null) {

    var newHote = new HoteModel({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    var hoteSaved = await newHote.save();
    res.json({ result: true, hote: hoteSaved })

  }else{
    res.json({ result: false })

  }
 
})


router.post('/sign-in', async function (req, res, next) {
  var hotes = await HoteModel.findOne({ email: req.body.email, password: req.body.password });

  var isEvent = await eventModel.findOne({user: hotes._id})


  if (hotes === null) {
    res.json({ result: false})
  }
  else if (isEvent) {

    res.json({ result: true, hote: hotes, isEvent })
  }
  else {

    res.json({result: true, hote: hotes})
  }


})


router.post('/enregistrement', async function (req, res, next) {

  var error = []
  var result = false
  var eventExist = null


  if (req.body.pseudoFromFront == ''
    || req.body.eventIdFromFront == ''
    || req.body.eventPasswordFromFront == '') {
    error.push('champs vides')
  }


  if (error.length == 0) {
    var eventExist = await eventModel.findOne({
      eventId: req.body.eventIdFromFront,
      isOpen: true
    })

    if (eventExist) {

      if (req.body.eventPasswordFromFront == eventExist.password) {
        result = true

      } else {
        result = false
        error.push('ID / mot de passe incorrect')
      }

    }

  }

  res.json({ result, eventExist, error })
})

// route de création d'une soirée et enregistrement en base de données
router.post('/eventcreation', async function (req, res, next) {

  var error = []
  var result = false
  var saveEvent = null


  if (req.body.eventNameFromFront == ''
    || req.body.eventPasswordFromFront == '') {
    error.push('champs vides')
  }

  if (req.body.eventPasswordFromFront.length < 3) {
    error.push('mot de passe trop court')
  }

  if (error.length == 0) {

    var userId = await eventModel.findOne(
      { user: req.body.idUserFromFront, isOpen: true }
    );


    if (userId) {

      await eventModel.updateMany(
        { user: userId.user },
        { isOpen: false }
      );
    }

    var newEvent = new eventModel({

      user: req.body.idUserFromFront,
      nameEvent: req.body.eventNameFromFront,
      date: new Date(),
      isOpen: true,
      eventId: (Math.floor(Math.random() * 10000) + 10000).toString().substring(1),
      password: req.body.eventPasswordFromFront,
    })

    var saveEvent = await newEvent.save()

    if (saveEvent) {
      await playlistModel.deleteMany(
        {user: req.body.idUserFromFront}
        );
      result = true
    

    var newTourdevote = new tourdevoteModel({
      event: saveEvent._id,
      date: new Date(),
      isOpen: true,
      echeance: Date.now()+99999999999999, //ECHEANCE A L'INITIALISATION AVANT LE LANCEMENT DU VOTE
      participants: [],
    })
      await newTourdevote.save();
    }
  }
  res.json({ result, error, saveEvent })
})


// route de création tour de vote et enregistrement dans la collection Tour de vote 
router.post('/tourdevotecreation', async function (req, res, next) {

  var isEventOpen = await eventModel.findOne(
    { isOpen: true, user: req.body.idUserFromFront }
  )

  await tourdevoteModel.updateMany(
    { event: isEventOpen._id },
    { isOpen: false }
  );

  var newTourdevote = new tourdevoteModel({
    event: isEventOpen._id,
    date: new Date(),
    isOpen: true,
    echeance: Date.now()+99999999999999, //ECHEANCE A L'INITIALISATION AVANT LE LANCEMENT DU VOTE
    participants: [],

  })

  var saveTourdevote = await newTourdevote.save();



  if (saveTourdevote) {

    await playlistModel.deleteMany(
      {user: req.body.idUserFromFront}
      );

    res.json({ result: true, idTourdeVote: saveTourdevote._id })
  }

  else {
    res.json({ result: false })
  }

}
);

// route pour enregistrer un compte à rebours de 5 min
router.post('/initTimer5', async function (req, res, next) {

  mongoose.set('useFindAndModify', false);

  var userEvent = await eventModel.findOne(
    {user: req.body.idUserFromFront, isOpen: true}
  )


  var tourdevoteMAJ = await tourdevoteModel.findOneAndUpdate(
    { event: userEvent._id},
    { echeance: Date.now()+300000 }
  )

  if (tourdevoteMAJ) {
    res.json({result: true}) 
  }

  else {
    res.json({result: false})
  }

});

// route pour enregistrer un compte à rebours de 10 min
router.post('/initTimer10', async function (req, res, next) {

  mongoose.set('useFindAndModify', false);

  var userEvent = await eventModel.findOne(
    {user: req.body.idUserFromFront, isOpen: true}
  )

  var tourdevoteMAJ = await tourdevoteModel.findOneAndUpdate(
    { event: userEvent._id},
    { echeance: Date.now()+600000 }
  )

  if (tourdevoteMAJ) {
    res.json({result: true}) 
  }

  else {
    res.json({result: false})
  }

});

// route pour enregistrer un compte à rebours de 20 min
router.post('/initTimer20', async function (req, res, next) {

  mongoose.set('useFindAndModify', false);

  var userEvent = await eventModel.findOne(
    {user: req.body.idUserFromFront, isOpen: true}
  )

  var tourdevoteMAJ = await tourdevoteModel.findOneAndUpdate(
    {event: userEvent._id},
    { echeance: Date.now()+1200000 }
  )
   
  if (tourdevoteMAJ) {
    res.json({result: true}) 
  }

  else {
    res.json({result: false})
  }

});


// route pour afficher le compte à rebours 
router.post('/afficheTimer', async function (req, res, next) {

  var isEventOpen = await eventModel.findOne(
    { isOpen: true, user: req.body.idUserFromFront }
  )

  var isTourdevoteOpen = await tourdevoteModel.findOne(
    { isOpen: true, event: isEventOpen._id }
  )
 
  var echeanceMS = isTourdevoteOpen.echeance

  var maintenantMS = Date.now()
  
  var rebours = echeanceMS - maintenantMS

  var reboursSEC = rebours/1000
  var reboursFinal = Math.trunc(reboursSEC)

  if (isTourdevoteOpen) {
    res.json({result: true, isTourdevoteOpen, reboursFinal}) 
  }

  else {
    res.json({result: false})
  }

  }
  );

 // route d'ajouter de titre dans la collection Playlist 
router.post('/ajoutertitre', async function (req, res, next) {

 var newTitre = new playlistModel({
   titre: req.body.titreFromFront,
   vote: [],
   user: req.body.userIdFromFront
 })

 var titreSaved = await newTitre.save();
  
  res.json({ titreSaved })
});


 // route de suppression de titre dans la collection Playlist 
router.post('/supprimertitre', async function (req, res, next) {

  var playlistSaved = await playlistModel.deleteOne(
    {user: req.body.idUserFromFront, titre: req.body.titreFromFront}
    )

  res.json({ playlist: playlistSaved })

})

// route pour afficher le titre gagnant du vote
router.post('/winner', async function (req, res, next) {

  var winnerSEARCH = await playlistModel.find({user: req.body.idUserFromFront});

var arrayBRUT = []

  for (i=0; i < winnerSEARCH.length; i++) {
    arrayBRUT.push(
      {votes: winnerSEARCH[i].votes.length,
      titre : winnerSEARCH[i].titre}
    )
  }

var tri =  arrayBRUT.sort(function(a, b) {
  return b.votes - a.votes;
});

res.json({tri})
}
)


// route enregistrant en base de données le vote de l'invité
router.post('/voteguest', async function (req, res, next) {

  mongoose.set('useFindAndModify', false);

  var hasAlreadyVote = await playlistModel.findOne(
    { votes: {'$in':req.body.tokenFromFront} }
  )

  if (hasAlreadyVote == null) {

    var vote = await playlistModel.findOneAndUpdate(
      { titre: req.body.titreFromFront, user: req.body.idUserFromFront },
      { '$push': { 'votes': req.body.tokenFromFront } }
    )

  }


  if (hasAlreadyVote) {

    res.json({ result: false, hasAlreadyVote })
  }

  else {
    res.json({ result: true })
  }

}
)

// route enregistrant en base de données le vote de l'hôte
router.post('/votehost', async function (req, res, next) {

  mongoose.set('useFindAndModify', false);


  var hasAlreadyVote = await playlistModel.findOne(
    { votes: { $in: req.body.idUserFromFront} }
  )

  if (hasAlreadyVote == null) {

    var vote = await playlistModel.findOneAndUpdate(
      { titre: req.body.titreFromFront },
      { $push: { votes: req.body.idUserFromFront } }
    )

  }

  if (hasAlreadyVote) {
    res.json({ result: false, hasAlreadyVote })
  }

  else {
    res.json({ result: true })
  }
}
)

// route permettant de retrouver la bonne soirée
router.post('/getEventName', async function (req, res, next) {

  var findEventName = await eventModel.findOne({isOpen: true, password: req.body.eventPasswordFromFront, eventId: req.body.eventIdFromFront})

  res.json({})
})

module.exports = router;
