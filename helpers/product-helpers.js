var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId

module.exports = {

    addProduct: (product,category, callback)=>{
        console.log(category)
        category = category+'s'

        db.get().collection(category).insertOne(product).then((data)=>{
            // console.log("hello", data.insertedId.toString())
            callback(data.insertedId.toString())
        })
    },

    getOneProduct: (productId)=>{
        let id = new objectId(productId)
        return new Promise(async (resolve, reject)=>{
            let products = await db.get().collection(collection.productCollection).find({_id: id}).toArray()
            resolve(products[0])
        })
    },

    getAllProducts: ()=>{
        return new Promise(async (resolve, reject)=>{
            let products = await db.get().collection(collection.productCollection).find().toArray()
            resolve(products)
        })
    },

    deleteProduct: (productId)=>{
        let id = new objectId(productId)
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.productCollection).deleteOne({_id: id}).then(()=>{
                resolve(true)
            })
        })
    },

    updateProduct: (productId, productDetail)=>{
        let id = new objectId(productId)
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.productCollection).updateOne({_id: id},{
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
