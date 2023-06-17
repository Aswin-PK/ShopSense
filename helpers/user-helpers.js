var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')

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
    }
}