const users = []

//addUser, removeUser, getUser, getusersInRoom


const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if (!username || !room) {
        return {
            error: 'Username and Room are required!'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }

}

const reUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getusersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}
// addUser({
//     id: 22,
//     username: 'Riya',
//     room: 'home'
// })
// addUser({
//     id: 42,
//     username: 'Ritu',
//     room: 'homework'
// })
// addUser({
//     id: 32,
//     username: 'krish',
//     room: 'home'
// })

// const user = getUser(421)
// console.log(user)

// const userlist = getusersInRoom('home')
// console.log(userlist)

module.exports = {
    addUser,
    reUser,
    getUser,
    getusersInRoom
}




