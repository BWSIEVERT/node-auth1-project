const express = require('express')
const User = require('../user/model')
const router = express.Router()
const bcrypt = require('bcryptjs')


const checkPayload = (req, res, next) => {
    // needs req.body to include username, password
    if (!req.body.username || !req.body.password) {
      res.status(401).json('bad payload')
    } else {
      next()
    }
  }

  const checkUsernameUnique = async (req, res, next) => {
    // username must not be in the db already
    try {
      const rows = await User.findBy({ username: req.body.username })
      if (!rows.length) {
        next()
      } else {
        res.status(401).json('username taken')
      }
    } catch (err) {
      res.status(500).json('something failed tragically')
    }
  }

  const checkUsernameExists = async (req, res, next) => {
    // username must be in the db already
    // we should also tack the user in db to the req object for convenience
    try {
      const rows = await User.findBy({ username: req.body.username })
      if (rows.length) {
        req.userData = rows[0]
        next()
      } else {
        res.status(401).json('who is that exactly?')
      }
    } catch (err) {
      res.status(500).json('something failed tragically')
    }
  }





router.post('/register', checkPayload, checkUsernameUnique, async (req, res) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, 10)

        const newUser = await User.createUser({ username: req.body.username, password: hash })
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

router.post('/login', checkPayload, checkUsernameExists, (req, res) => {
    try {
        // Checking that password matches hash
        const matches = bcrypt.compareSync(req.body.password, req.userData.password)

        if (matches) {
            req.session.user = req.userData
            res.json(`Welcome back, ${req.userData.username}`)
        } else {
            res.status(401).json('Login credentials do not match!')
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(error => {
            if (error) {
                res.json({
                    message: error.message
                })
            } else {
                res.json('Successfully logged out!')
            }
        })
    } else {
        res.json('There was no session')
    }
})

module.exports = router