const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.filter((usr) => {
    return (usr.username === username && usr.password === password) 
    
  })
  if (!user)
    return false;
  else
    return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 * 1000 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
   const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200);
     usr = req.session.authorization.username;
    book.reviews[usr] = req.body.review;
    res.json(book.reviews);
  }
  else {
    res.status(404);
    res.send("No book with this isbn!!");
  }
});

//delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
     const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200);
     usr = req.session.authorization.username;
   delete book.reviews[usr];
    res.json({"message":"review deleted ","review":book.reviews});
  }
  else {
    res.status(404);
    res.send("No book with this isbn!!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
