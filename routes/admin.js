var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getProducts().then((products)=>{
    res.render('admin/view-products', {products, admin:true });
  })
});


router.get('/add-products', (req, res)=>{
  res.render('admin/add-products')
});

router.post('/add-products', (req, res)=>{
  console.log(req.body)
  // console.log(req.files.image)
  productHelpers.addProduct(req.body, (objectId)=>{
    let image = req.files.image
    image.mv('./public/images/product-images/'+objectId+'.png', (err, done)=>{
      if(!err) res.render('admin/add-products')
      else console.log(err)
    })
    // res.render('admin/add-products')
  })
});

module.exports = router;
