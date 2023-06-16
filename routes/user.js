// import { MongoClient } from 'mongodb';
var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')


/* GET home page. */
router.get('/', function(req, res) {
  productHelpers.getProducts().then((products)=>{
    res.render('user/view-products', {products}); 
  })
});


module.exports = router;
