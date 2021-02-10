const Sauce = require('../models/sauce');
const fs = require('fs');
//const  = require('../routes/user');


exports.createNewSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // delete sauceObject._id;
    const sauce = new Sauce({
        // name: req.body.name,
        // manufacturer: req.body.manufacturer,
        // description: req.body.description,
        // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // mainPepper: req.body.mainPepper,
        // heat: req.body.heat,
        // userId: req.body.userId
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        mainPepper: sauceObject.mainPepper,
        heat: sauceObject.heat,
        userId: sauceObject.userId
    })
    sauce.save()
    .then(() => {res.status(201).json({message: 'Sauce créee avec succès'})})
    .catch((error) => {res.status(400).json({error: error})});
}


exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    // {
    //       const mappedSauces = sauces.map((sauce) => {
    //         sauce.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + sauce.imageUrl;
    //         return sauce;
    //       });
    //       res.status(200).json(mappedSauces);
    //     })
    .catch(() => {
      res.status(500).send(new Error('Erreur base de données!'));
    });
};

exports.getSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).send(new Error('Sauce introuvable!'));
      }
      res.status(200).json(sauce);
    })
    .catch((error) => {res.status(404).json({error: error})})
    ;
};

//Modif sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id })
  .then(() => {
      res.status(201).json({
        message: 'Sauce modifiée avec succès'
      });
    }
  ).catch((error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Suppression sauce
exports.deleteSauce = (req, res, next) => {
  //trouver le fichier
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; //cree un tableau dans lequel on recupere le nom du fichier à l'index 1
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


//fonction qui ajoute ou retire un like
exports.likeSauce = (req, res, next) => {
  if(req.body.like === 0) {
    Sauce.findOne({ _id: req.params.id})
      .then((sauce) => {
        if(sauce.usersLiked.find(user => user === req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
          })
          .then(() => { res.status(201).json({ message: 'Like retiré' }); })
          .catch((error) => { res.status(400).json({ error: error }); });
        } else if (sauce.usersDisliked.find(user => user === req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          })
            .then(() => { res.status(201).json({ message: 'Dislike retiré' }); })
            .catch((error) => { res.status(400).json({ error: error }); });
        }
      })
      .catch((error) => { res.status(404).json({ error: error }); });
  } else if(req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id }, {
      $inc: { likes: 1 },
      $push: { usersLiked: req.body.userId },
    })
      .then(() => { res.status(201).json({ message: 'Like a bien été ajouté' }); })
      .catch((error) => { res.status(400).json({ error: error }); });
  } else if(req.body.like === -1) {
    Sauce.updateOne({ _id: req.params.id }, {
      $inc: { dislikes: 1 },
      $push: { usersDisliked: req.body.userId },
    })
      .then(() => { res.status(201).json({ message: 'Dislike a été pris en compte!' }); })
      .catch((error) => { res.status(400).json({ error: error }); });
  }
}