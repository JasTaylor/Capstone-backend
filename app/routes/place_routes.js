const express = require('express')
const passport = require('passport')
const Place = require('../models/place')
const handle = require('../../lib/error_handler')
const customErrors = require('../../lib/custom_errors')
const multer = require('multer')
const multerUpload = multer()
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()
const { s3Upload, s3Delete } = require('../../lib/s3Files.js')

// CREATE
// POST /places
router.post('/places', requireToken, multerUpload.single('file'), (req, res, next) => {
  const place = req.body
  place.owner = req.user.id
  if (req.file) {
    s3Upload(req.file)
      .then(s3Response => Place.create({
        title: place.title,
        text: place.text,
        city: place.city,
        country: place.country,
        owner: place.owner,
        url: s3Response.Location
      }))
      .then(place => {
        res.status(201).json({ place: place.toObject() })
      })
      .catch(next)
  } else {
    Place.create(req.body.place)
      .then(place => {
        res.status(201).json({ place: place.toObject() })
      })
      .catch(err => handle(err, res))
  }
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
router.patch('/places/:id', requireToken, multerUpload.single('file'), (req, res, next) => {
  req.body.owner = req.user.id
  for (const key in req.body) {
    if (req.body[key] === '') {
      delete req.body[key]
    }
  }
  if (req.file) {
    s3Upload(req.file)
      .then(s3Response => {
        Place.findById(req.params.id)
          .then(handle404)
          .then(place => {
            requireOwnership(req, place)
            if (place.url) {
              s3Delete({
                Bucket: process.env.BUCKET_NAME,
                Key: place.url.split('/').pop()
              })
            }
            return place.update({
              ...req.body,
              url: s3Response.Location
            })
          })
          .then(() => res.sendStatus(204))
          .catch(next)
      })
  } else {
    Place.findById(req.params.id)
      .then(handle404)
      .then(place => {
        requireOwnership(req, place)

        return place.update(req.body.place)
      })
      .then(() => res.sendStatus(204))
      .catch(err => handle(err, res))
  }
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
    .then(place => {
      if (place.url) {
        s3Delete({
          Bucket: process.env.BUCKET_NAME,
          Key: place.url.split('/').pop()
        })
      }
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
