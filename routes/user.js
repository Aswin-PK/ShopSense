var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers');
const { route } = require('./admin');
const verifyLogin = (req, res, next)=>{
  if(req.session.loggedIn) next()
  else res.redirect('/login')
}


/* GET home page. */
router.get('/', function(req, res) {
  let user = req.session.user
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products', {products, user}); 
  })
});
// -----------------------------///////////////////////-----------------------------------------


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

// -----------------------------///////////////////////-----------------------------------------


// User Register...................................................

router.get('/signup', (req, res)=>{
  res.render('user/signup')
})

router.post('/signup', (req, res)=>{
  console.log(req.body)
  userHelpers.userSignup(req.body).then((response)=>{

    if(response.status){
      req.session.loggedIn = true           // session = { ...., loggedIn: true,
      req.session.user = response.user     //                       user: userdetails from database }
      // console.log("signup",response);
      res.redirect('/')
    }
    else
      res.redirect('/signup') 
  })
})

// -----------------------------///////////////////////-----------------------------------------

// user log out.........................................................................

router.get('/logout', (req, res)=>{
  req.session.destroy()
  res.redirect('/')
})

// -----------------------------///////////////////////-----------------------------------------


// cart router .....................
 router.get('/cart',verifyLogin, (req, res)=>{
  res.render('user/cart')
 })
module.exports = router;