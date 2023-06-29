var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
const { reject } = require('promise')
var objectId = require('mongodb').ObjectId


module.exports = {
    userLogin: (userData)=>{
        let loginStatus = false
        let response = {}
        return new Promise(async (resolve, reject)=>{
            let user = await db.get().collection(collection.userCollection).findOne({email: userData.email})
            // console.log("user helper ",user)
            if(user){
                bcrypt.compare(userData.password, user.password).then((status)=>{
                    if(status){
                        // console.log("user found")
                        response.user = user,
                        response.status = true
                        resolve(response)
                    }
                    else{
                        // console.log("not found")
                        resolve({status: false})
                    }
                })
            }
            else{
                // console.log("user not found")
                resolve({status: false})
            }
        })
    },

    userSignup: (userData)=>{
        return new Promise(async (resolve, reject)=>{

            let user = {}
            if(userData.password === userData.confirmpassword){
                userData.password = await bcrypt.hash(userData.password, 10) // hashing the password
                console.log("password matched")
                delete userData.confirmpassword; //we only need to store userDAta to database without confirm password value
                db.get().collection(collection.userCollection).insertOne(userData).then(()=>{
                    console.log("user created")
                    user = {
                        user: userData,
                        status: true
                    }
                    // console.log("user signed is", user)
                    resolve(user) 
                })

            }
            else{
                user = {status:false}
                resolve(user)
            }
        })
    },

    addToCart: (userId, productId)=>{

        let prodObj = {
            item: new objectId(productId),
            quantity: 1
        }
        
        return new Promise(async (resolve, reject)=>{ 
            let userCart = await db.get().collection(collection.cartCollection).findOne({userId: new objectId(userId)}) 
            if(userCart){
                console.log("cart=", userCart);
                // console.log(userCart.products[0].item.toString());
                let isprodExist = userCart.products.findIndex(product => product.item.equals(productId)) !== -1;
                console.log("exist",isprodExist);
                if(isprodExist){
                    db.get().collection(collection.cartCollection).updateOne(
                        {
                            userId: new objectId(userId),
                            "products.item": new objectId(productId)
                        },
                        {
                            $inc: {"products.$.quantity": 1}
                        }
                    ).then(()=>{
                        console.log(userCart);
                        resolve()
                    })
                }
                else{

                    // if user cart is there it need to be updated with product's Id
                    db.get().collection(collection.cartCollection).updateOne(
                        {
                            userId: new objectId(userId)
                        },
                        {
                            $push: {products: prodObj}
                        }
                    ).then(()=>{
                        resolve()
                    })
                }

            }
            else{
                //create a cart with userid in it
                let cartObj = {
                    userId: new objectId(userId),
                    products: [prodObj]
                }
                db.get().collection(collection.cartCollection).insertOne(cartObj).then(()=>{
                    console.log("product added by creating a cart")
                    resolve()
                })
            }
            
        })
    },

    getCartItems: (userId)=>{
        // let uid = new objectId(userId)
        return new Promise(async (resolve, reject)=>{
            let cartItems = await db.get().collection(collection.cartCollection).aggregate([
                {
                    $match: {userId: new objectId(userId)}
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.productCollection,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'products'
                    }
                }
            ]).toArray()
            console.log("> user helper ",cartItems)
            resolve(cartItems)
        })
    },

    getCartItemCount: (userId)=>{
        // let uid = new objectId(userId)
        let count = 0
        return new Promise(async (resolve, reject)=>{
            let cart = await db.get().collection(collection.cartCollection).findOne({userId: new objectId(userId)})
            if(cart){
                count = cart.products.length
                console.log(count, "\n ", cart);
            }
            resolve(count)
        })
    },

    changeProductQuantity: (details)=>{
        let quantity = parseInt(details.quantity)
        let count = parseInt(details.count)
        return new Promise((resolve, reject)=>{
            if(count == -1 && quantity == 1){
                //have to remove item from cart
                db.get().collection(collection.cartCollection).updateOne(
                    {
                        _id: new objectId(details.cartId),
                    },
                    {
                        $pull: {products: {item: new objectId(details.productId)}}
                    }
                ).then(()=>{
                    resolve()
                })
            }
            else{
                // have to increment or decrement the quantity of item in the database
                db.get().collection(collection.cartCollection).updateOne(
                    {
                        _id: new objectId(details.cartId),
                        "products.item": new objectId(details.productId)
                    },
                    {
                        $inc: {"products.$.quantity": count}
                    }
                ).then(()=>{
                    // console.log(userCart);
                    resolve(true)
                })
            }
        })
    },

    removeFromCart: (details)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.cartCollection).updateOne(
                {
                    _id: new objectId(details.cartId),
                },
                {
                    $pull: {products: {item: new objectId(details.productId)}}
                }
            ).then(()=>{
                resolve({itemRemoved: true})
            })
        })
    },

    getTotalAmount: (userId)=>{
        return new Promise(async (resolve, reject)=>{
            let total = await db.get().collection(collection.cartCollection).aggregate([
                {
                    $match: {userId: new objectId(userId)}
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.productCollection,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'products'
                    }
                },
                {
                    $project: {
                        item:1, quantity: 1, products: {$arrayElemAt: ['$products', 0]}
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {$sum: {$multiply: ['$quantity', '$products.price']}}
                    }
                }
            ]).toArray()
            console.log(total[0].total); // [ { _id: null, total: 167000 } ]
            resolve(total[0].total)
        })
    }
}