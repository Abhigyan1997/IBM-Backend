const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    username:"Alok Abhigyan",
    password:"12345"
}];

const isValid = (username)=>{ 
  let exists=users.filter(item=>item.username==username)
  if(exists) {
      return true
  }
  else{
      return false
  }
}

const authenticatedUser = (username,password)=>{ 
  const user=users.find((single)=>single.username==username);
  if(user.password==password){
      return true
  }else{
      return false
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  var username=req.body.username;
  var password=req.body.password;
  if(!username || !password){
    return res.status(400).json({"Message":"username and password required"})
  }
  if(!isValid(username)){
      return res.status(400).json({"message":username+" is invalid username"})
  }
  if(!authenticatedUser(username,password)){
    return res.status(400).json({"message":password+" doesn't match"})
  }
  jwt.sign({ user: username }, "secretkey", (err, token) => {
    req.session.accessToken = token;
    return  res.status(200).json({"message":username+" sucesfully logged in"});
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn=req.params.isbn;
  var obj1={
      username:"Alok Abhigyan",
      text:req.body.text
  }
  // books[isbn].reviews={...(books[isbn].reviews),obj1}
  
  res.status(200).json({"message":"new review by "+ obj1.username+ " is added" })
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  // remove the review with the given ISBN
  // books[isbn].reviews = { ...books[isbn].reviews.filter(review => review.username !== "Alok Abhigyan") }
  
  res.status(200).json({"message": "review by Alok Abhigyan is deleted" })
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
