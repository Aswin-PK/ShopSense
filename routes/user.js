// import { MongoClient } from 'mongodb';
var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers')


/* GET home page. */
router.get('/', function(req, res) {
  let user = req.session.user
  productHelpers.getProducts().then((products)=>{
    res.render('user/view-products', {products, user}); 
  })
});

// user login route.....................................................

router.get('/login', (req, res)=>{
  // console.log(req.session.loggedIn)
  if(req.session.loggedIn)
    res.redirect('/')
  else
    res.render('user/login')
})

router.post('/login', (req, res)=>{
  userHelpers.userLogin(req.body).then((response)=>{
    if(response.status){
      //user login is success
      req.session.loggedIn = true           // session = { ...., loggedIn: true,
      req.session.user = response.user      //                       user: userdetails from database }
      res.redirect('/')
    }
    else
      res.redirect('/login')
  })
})

// ///////////////////////////////////////////////////////////////////

// User Register...................................................

router.get('/signup', (req, res)=>{
  res.render('user/signup')
})

router.post('/signup', (req, res)=>{
  console.log(req.body)
  userHelpers.userSignup(req.body).then((user)=>{

    if(user.status)
      res.redirect('/')
    else
      res.redirect('/signup') 
  })
})

// ///////////////////////////////////////////////////////////////////

// user log out.........................................................................

router.get('/logout', (req, res)=>{
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
