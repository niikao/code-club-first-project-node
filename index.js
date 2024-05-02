/*
- Query params => meusite.com/users?name=vinicius&age=27 // Filtros
- Route params => /users/2 // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECIFICO
- Request Body => {"name": "Vinicius," " age":}

    -GET         => Buscar innformção no back-end
    -POST        => Criar informção no Back-end
    -PUT /PATH   => Alternar/Atualizar informação no back-end
    -DELETE      => Deletar informação no back-end

    -Middleware => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisão
*/


const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "User not found" })
    }

    request.userIndex = index
    request.userId = id
    next()
}
app.get('/users/:id', (request, response) => {
    return response.json(users)
})

app.post('/users/:id', (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }

    users.push(user)
    return response.status(201).json(users)
})
//------- PUT ABAIXO 
app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId
    
    const updateUser = { id, name, age }

    users[index] = updateUser

    return response.json(updateUser)
})

app.listen(port, () => {
    console.log(`🚀Server started on port 3000 ${port}`)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})