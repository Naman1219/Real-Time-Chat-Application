const users = [];

// addUser, removeUser, getUser, getUsersInRoom:

const addUser = ({ id, username, room }) => {
  // clean the data:
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // validate the data:
  if (!username || !room) {
    return {
      error: 'Username and room are required!'
    }
  }

  // Check for existing user:
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  });

  // Validate username:
  if (existingUser) {
    return {
      error: 'Username is in use!'
    }
  }

  // Store user:
  const user = { id, username, room }
  users.push(user)
  return { user }
}

removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }

};

addUser({
  id: 23,
  username: 'Naman',
  room: 'first'
})

const getUser = ({ id }) => {
  const getuserByid = users.find((user) => user.id === id);
  return getuserByid || undefined;
}

console.log(users);

const gettingUser = getUser(22);
console.log(gettingUser);

// const removeUsers = removeUser(23);
// console.log("-->", removeUsers);
// console.log(users);