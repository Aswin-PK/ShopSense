var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
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
        let uid = new objectId(userId)
        let prodid = new objectId(productId)
        return new Promise(async (resolve, reject)=>{
            let userCart = await db.get().collection(collection.cartCollection).findOne({userId: uid}) 
            if(userCart){
                //if user cart is there it need to be updated with product's Id
                db.get().collection(collection.cartCollection).updateOne({userId: uid},
                    {
                        $push: {products: prodid}
                    }
                ).then((response)=>{
                    resolve()
                })
            }
            else{
                //create a cart with userid in it
                let cartObj = {
                    userId: uid,
                    products: [prodid]
                }
                db.get().collection(collection.cartCollection).insertOne(cartObj).then(()=>{
                    console.log("product added by creating a cart")
                    resolve()
                })
            }
            
        })
    },

    getCartItems: (userId)=>{
        let uid = new objectId(userId)
        return new Promise(async (resolve, reject)=>{
            let cartItems = await db.get().collection(collection.cartCollection).aggregate([
                {
                    $match: {userId: uid}
                },
                {
                    $lookup: {
                        from: collection.productCollection,
                        let: {productList: '$products'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$productList']
                                    }
                                }
                            }
                        ],
                        as: 'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    },

    getCartItemCount: (userId)=>{
        let uid = new objectId(userId)
        let count = 0
        return new Promise(async (resolve, reject)=>{
            let cart = await db.get().collection(collection.cartCollection).findOne({userId: uid})
            if(cart){
                count = cart.products.length
                console.log(count, "\n ", cart);
            }
            resolve(count)
        })
    }
}