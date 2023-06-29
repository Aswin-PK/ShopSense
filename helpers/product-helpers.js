var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId

module.exports = {

    addProduct: (product, callback)=>{

        db.get().collection(collection.productCollection).insertOne(product).then((data)=>{
            // console.log("hello", data.insertedId.toString())
            callback(data.insertedId.toString())
        })
    },

    getOneProduct: (productId)=>{
        
        return new Promise(async (resolve, reject)=>{
            let products = await db.get().collection(collection.productCollection).findOne({_id: new objectId(productId)})
            // console.log(products)
            resolve(products)
        })
    },

    getAllProducts: ()=>{
        return new Promise(async (resolve, reject)=>{
            let products = await db.get().collection(collection.productCollection).find().toArray()
            resolve(products)
        })
    },

    deleteProduct: (productId)=>{
        // let id = objectId(productId)
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.productCollection).deleteOne({_id: new objectId(productId)}).then(()=>{
                resolve(true)
            })
        })
    },

    updateProduct: (productId, productDetail)=>{
        // let id = objectId(productId)
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.productCollection).updateOne({_id: new objectId(productId)},{
                $set: {
                    name: productDetail.name,
                    category: productDetail.category,
                    price: productDetail.price
                }
            }).then(()=>{
                resolve(true)
            })
        })    
    },


}
