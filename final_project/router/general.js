const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let usernameAlreadyUsed = users.filter((user)=>{
    return user.username === username
  });
  if(usernameAlreadyUsed.length > 0){
    return true;
  } else {
    return false;
  }
}

const getAllBooks = () => {
  return books;
};

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Successfully registered. You may now login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// Task 10: Get all books using an async callback function
public_users.get('/',async (req, res)=> {
  //Write your code here
  try{
    const allBooks = await getAllBooks();
    return res.send(JSON.stringify(books,null,4));
  }catch(err){
    res.status(500).send(err);
  }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const booksByIsbn = req.params.isbn;
//   res.send(books[booksByIsbn])
//  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const booksByIsbn = req.params.isbn;
  // using a Promise for task 11
  new Promise((resolve, reject) => { 
    const bookDetails = books[booksByIsbn]; 
    if (bookDetails) { 
      resolve(bookDetails); 
    } else { 
      reject('Book not found'); 
    } 
  }) 
  .then((bookDetails) => { 
    res.send(bookDetails); 
  }) 
  .catch((error) => { 
    res.status(404).send(error);
 });
});
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   let ans = []
//     for(const [key, values] of Object.entries(books)){
//         const book = Object.entries(values);
//         for(let i = 0; i < book.length ; i++){
//             if(book[i][0] == 'author' && book[i][1] == req.params.author){
//                 ans.push(books[key]);
//             }
//         }
//     }
//     if(ans.length == 0){
//         return res.status(300).json({message: "Author not found"});
//     }
//     res.send(ans);
// });

// Search books by author using async for task 12
public_users.get('/author/:author', async (req, res) => {
  try {
    const ans = [];
    for (const [key, values] of Object.entries(books)) {
      const book = Object.entries(values);
      for (let i = 0; i < book.length; i++) {
        if (book[i][0] === 'author' && book[i][1] === req.params.author) {
          ans.push(books[key]);
        }
      }
    }
    if (ans.length === 0) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.send(ans);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   let ans = []
//   for(const [key, values] of Object.entries(books)){
//       const book = Object.entries(values);
//       for(let i = 0; i < book.length ; i++){
//           if(book[i][0] == 'title' && book[i][1] == req.params.title){
//               ans.push(books[key]);
//           }
//       }
//   }
//   if(ans.length == 0){
//       return res.status(300).json({message: "Title not found"});
//   }
//   res.send(ans);
// });

//Search by title using async for task 13
public_users.get('/title/:title', async (req, res) => { 
  try { 
    const title = req.params.title; 
    const matchingBooks = Object.values(books)
    .filter(book => book.title === title); 
    if (matchingBooks.length === 0) { 
      return res.status(404).json({ message: "Title not found" });
    } 
      res.send(matchingBooks); 
    } catch (error) { 
        res.status(500).json({ message: "Internal Server Error" }); 
    }
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const booksByIsbn = req.params.isbn;
  res.send(books[booksByIsbn].reviews)
});

module.exports.general = public_users;