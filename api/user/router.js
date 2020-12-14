const router = require('express').Router()

const Users = require('./model')

router.get('/', async (req, res) => {
    try {
        const users = await Users.getUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router