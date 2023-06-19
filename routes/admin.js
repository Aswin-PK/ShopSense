var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products', {products, admin:true});
  })
});


router.get('/add-products', (req, res)=>{
  res.render('admin/add-products', {admin: true})
});

router.post('/add-products', (req, res)=>{
  productHelpers.addProduct(req.body, (objectId)=>{
    let image = req.files.image
    image.mv('./public/images/product-images/'+objectId+'.png', (err, done)=>{
      if(!err) res.redirect('/admin/add-products')
      else console.log(err)
    })
  })
});



router.get('/delete-product', (req, res)=>{
  productId = req.query.id
  // console.log(req.query.id)
  productHelpers.deleteProduct(productId).then((result)=>{
    if(result) {
      // console.log("object deleted")
      res.redirect('/admin')
    }
  })
})


router.get('/edit-product', async (req, res)=>{
  productId = req.query.id
  // console.log(req.query.id)
  let productDetail = await productHelpers.getOneProduct(productId)
  console.log("admin.js ",productDetail,productId);
  res.render('admin/edit-products', {productDetail, productId})
})

router.post('/edit-product', (req, res)=>{
  productId = req.query.id
  // console.log(req.body)
  
  productHelpers.updateProduct(productId, req.body).then((result)=>{
    if(result) {
      // console.log("object updated") 
      if(req.files.image){
        let image = req.files.image
        image.mv('./public/images/product-images/'+productId+'.png', (err, done)=>{
          if(!err) res.redirect('/admin')
          else console.log(err)
        }) 
      }
    }
  })
})

module.exports = router;
