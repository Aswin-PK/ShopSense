var db = require('../config/connection')
var collection = require('../config/collections')

module.exports = {

    addProduct: (product,category, callback)=>{
        console.log(category)
        category = category+'s'

        db.get().collection(category).insertOne(product).then((data)=>{
            // console.log("hello", data.insertedId.toString())
            callback(data.insertedId.toString())
        })
    },

    getProducts: ()=>{
        return new Promise(async (resolve, reject)=>{
            let products = await db.get().collection(collection.productCollection).find().toArray()
            resolve(products)
        })
    }
}
