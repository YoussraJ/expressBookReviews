const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const userName = req.body.userName;
  const password = req.body.password;
  console.log(userName, password);
  if (users.some(user => user.userName === req.body.userName)) {
    res.status(400);
    res.send("userName already exist");
  }
  else {
    if (!userName || !password) {
     res.status(400);
      res.send("Please fill all fields ! ");
   }
   else {
   
       let user = { userName: req.body.userName, password: req.body.password };
    users.push(user);
    res.status(200);
    res.send(req.body.userName + "  successfully added");
   }
  }
  
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   let bookList = JSON.stringify(books,null,4);
//   return res.status(200).send(bookList);
// });
// Assuming books is an array containing the list of books available in the shop.

public_users.get('/', function (req, res) {
  
  const getBookListPromise = new Promise((resolve, reject) => {
   
    let bookList = JSON.stringify(books, null, 4);
    setTimeout(() => {
      resolve(bookList);
    }, 1000); 
  });

  getBookListPromise
    .then((bookList) => {
      return res.status(200).send(bookList);
    })
    .catch((err) => {
      return res.status(500).send('Error: ' + err.message);
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200);
    res.send(book);
  }
  else {
    res.status(404);
    res.send("No book with this isbn!!");
  }

});
 
//////////////////Get book details based on ISBN with promises///////////////
public_users.get('/isbn/:isbn', function (req, res) {
  const getBookIsbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    setTimeout(() => {
      resolve(book);
    }, 1000);
  });
  getBookIsbn
    .then((book) => {
      return res.status(200).send(book);
    })
    .catch((err) => {
      return res.status(500).send('Error: ' + err.message);
    });
 });
 /*************************************/ 
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  for (const [bookId, bookDetails] of Object.entries(books)) {
    if (bookDetails.author === req.params.author) {
      res.status(200);
      res.send(bookDetails)
      return { bookId, ...bookDetails };
    }
  }
  return null; // If no book with the given author is found, return null});
});

//Get book details based on author using promises
public_users.get('/author/:author', function (req, res) {
  let book;
  const getBookAuthor = new Promise((resolve, reject) => {
    
    for (const [bookId, bookDetails] of Object.entries(books)) {
    if (bookDetails.author === req.params.author) {
      book = { bookId, ...bookDetails };
    }
  }

    setTimeout(() => {
     
      resolve(book);
    }, 1000);
  });

  getBookAuthor
    .then((book) => {
      return res.status(200).send(book);
    })
    .catch((err) => {
      return res.status(500).send('Error: ' + err.message);
    });
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
   for (const [bookId, bookDetails] of Object.entries(books)) {
    if (bookDetails.title === req.params.title) {
      res.status(200);
      res.send(bookDetails)
      return { bookId, ...bookDetails };
    }
  }
  return null; // If no book with the given author is found, return null});
});
//Get books based on title using promises 
public_users.get('/title/:title', function (req, res) {
  let book;
  const getBookTitle = new Promise((resolve, reject) => {
    
    for (const [bookId, bookDetails] of Object.entries(books)) {
      if (bookDetails.title === req.params.title) {
        book = { bookId, ...bookDetails };
      }
    }
    setTimeout(() => {
      // If the books were fetched successfully
      resolve(book);
    
    }, 1000); 
  });

  // Use .then() and .catch() to handle the Promise callbacks
  getBookTitle
    .then((book) => {
      return res.status(200).send(book);
    })
    .catch((err) => {
      return res.status(500).send('Error: ' + err.message);
    });
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200);
    res.send(book.reviews);
  }
  else {
    res.status(404);
    res.send("No book with this isbn!!");
  }
});

module.exports.general = public_users;
