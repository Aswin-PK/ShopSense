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
router.get('/', async (req, res)=>{
  let user = req.session.user
  let cartitemcount = null
  if(user){
    cartitemcount = await userHelpers.getCartItemCount(user._id)
  }
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products', {products, user, cartitemcount}); 
  })
});
// -----------------------------///////////////////////-----------------------------------------


// user login route.....................................................

router.get('/login', (req, res)=>{
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
  let userId = req.session.user._id
  userHelpers.getCartItems(userId).then(async (cartItems)=>{
    // console.log(cartItems);
    let totalAmount = await userHelpers.getTotalAmount(req.session.user._id)
    res.render('user/cart',{cartItems, user: req.session.user, totalAmount})
  })
})


router.get('/add-to-cart/:id', (req, res)=>{
  let productId = req.params.id
  let userId = req.session.user._id
  console.log("api call");
  userHelpers.addToCart(userId, productId).then(()=>{
    res.json({status: true})
  })
})


router.post('/change-product-quantity', verifyLogin, (req, res)=>{
  console.log(req.body)
  userHelpers.changeProductQuantity(req.body).then((response)=>{
    res.json(response)
  })
})

router.post('/remove-cart-item', (req, res)=>{
  userHelpers.removeFromCart(req.body).then((response)=>{
    console.log('removed')
    res.json(response)
  })
})


// order placing

router.get('/place-order', verifyLogin, (req, res)=>{
  res.render('user/place-order', {user: req.session.user})
})







module.exports = router;