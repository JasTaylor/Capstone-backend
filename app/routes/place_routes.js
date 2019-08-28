const express = require('express')
const passport = require('passport')
const Place = require('../models/place')

const multer = require('multer')
const multerUpload = multer()

const { s3Upload, s3Delete } = require('../../lib/aws-s3-upload.js')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/places', (req, res, next) => {
  Place.find()
    .then(places => {
      return places.map(place => place.toObject())
    })
    .then(places => res.status(200).json({ places: places }))
    .catch(next)
})

router.get('/places/:id', (req, res, next) => {
  Place.findById(req.params.id)
    .then(handle404)
    .then(place => res.status(200).json({ place: place.toObject() }))
})

router.delete('/places/:id', requireToken, (req, res, next) => {
  Place.findById(req.params.id)
    .then(handle404)
    .then(place => {
      requireOwnership(req, place)
      place.remove()
      return place
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
    .catch(next)
})

router.patch('/places/:id', requireToken, multerUpload.single('file'), (req, res, next) => {
  req.body.place.owner = req.user.id
  for (const key in req.body.place) {
    if (req.body.place[key] === '') {
      delete req.body.place[key]
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
              ...req.body.place,
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
      .catch(next)
  }
})

router.post('/places', requireToken, multerUpload.single('file'), (req, res, next) => {
  const place = req.body.place
  place.owner = req.user.id
  console.log(place)
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
    console.log(place)
    Place.create({
      title: place.title,
      text: place.text,
      city: place.city,
      country: place.country,
      owner: place.owner
    })
      .then(place => {
        res.status(201).json({ place: place.toObject() })
      })
      .catch(next)
  }
})

module.exports = router
