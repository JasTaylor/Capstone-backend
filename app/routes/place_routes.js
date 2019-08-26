const express = require('express')
const passport = require('passport')

const Place = require('../models/place')

const handle = require('../../lib/error_handler')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE
// POST /places
router.post('/places', requireToken, (req, res) => {
  req.body.place.owner = req.user.id

  Place.create(req.body.place)
    .then(place => {
      res.status(201).json({ place: place.toObject() })
    })
    .catch(err => handle(err, res))
})

// SHOW
// GET /places/5a7db6c74d55bc51bdf39793
router.get('/places/:id', (req, res) => {
  Place.findById(req.params.id)
    .then(handle404)
    .then(place => res.status(200).json({ place: place.toObject() }))
    .catch(err => handle(err, res))
})

// INDEX
// GET /places
router.get('/places', (req, res) => {
  Place.find()
    .then(places => {
      return places.map(place => place.toObject())
    })
    .then(places => res.status(200).json({ places: places }))
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /places/5a7db6c74d55bc51bdf39793
router.patch('/places/:id', requireToken, (req, res) => {
  delete req.body.place.owner

  Place.findById(req.params.id)
    .then(handle404)
    .then(place => {
      requireOwnership(req, place)

      return place.update(req.body.place)
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /places/5a7db6c74d55bc51bdf39793
router.delete('/places/:id', requireToken, (req, res) => {
  Place.findById(req.params.id)
    .then(handle404)
    .then(place => {
      requireOwnership(req, place)
      place.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
