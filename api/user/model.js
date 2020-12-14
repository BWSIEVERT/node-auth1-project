const db = require('../../database/dbConfig')

function getUsers() {
    return db('user').select('id', 'username').orderBy('id')
}
function getById(id) {
    return db('user').where({ id }).first()
}
async function createUser(user) {
    const [ id ] = await db('user').insert(user)
    return getById(id)
}
function findBy(filter) {
    return db("user").where(filter).orderBy("id");
  }

module.exports = {
    getUsers,
    getById,
    createUser,
    findBy
}