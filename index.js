const http = require('http')
const express = require('express')
const Sequelize = require('sequelize')
const { User, Photo } = require('./models')

const host = '127.0.0.1'
const port = 3000
const dbport = 5432
const app = express()
const server = http.createServer(app)

app.get('/', (req, res) => {
    res.send('Welcome to photo-app!')
})

app.post('/users', async (req, res) =>{
    const { firstName, lastName, email } = req.body
    const newUser = await User.create({
        firstName,
        lastName,
        email
    })

    res.json({
        id: newUser.id
    })
})

app.get('/users', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
})

app.get('/users/by-last-name', async (req, res) => {
    const users = await User.findAll({
        attributes: ['lastName']
    })
    res.json(users)
})

app.get('/users/search/:id', async (req, res) => {
    try{
        const oneUser = await User.findByPk(req.params.id)
        res.json(oneUser)
    } catch (e) {
        console.log(e)
        res.status(404).json({
            message: 'User not found'
        }) 
    }
})

app.post('/users/search', async (req, res) => {
    console.log(req.body)
    const users = await User.findAll({
        where: {
            [Sequelize.Op.or]: [
                {
                    firstName: req.body.term,
                    lastName: req.body.term
                }
            ]
        },
        include: [{
            model: Photo
        }]
    })
    res.json(users)
})

app.post('/users/:id', async (req, res) => {
    const { id } = req.params

    // Assuming that 'req.body' is limited to
    // the keys firstName, lastName, and email
    const updatedUser = await User.update(req.body, {
        where: {
            id
        }
    })
    res.json(updatedUser)
})

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params
    const deletedUser = await User.destroy({
        where: {
            id
        }
    })
    res.json(deletedUser)
})

app.get('/users/photos', async (req, res) => {
    const users = await User.findAll({
        include: [{
            model: Photo
        }]
    })
    res.json(users)
})

app.get('/photos/users', async (req, res) => {
    const photos = await Photo.findAll({
        include: [{
            model: User
        }]
    })
    res.json(photos)
})

server.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}/`)
})