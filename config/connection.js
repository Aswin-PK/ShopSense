const { MongoClient } = require('mongodb');
const state = {
    db: null
}

module.exports.connect = (done)=>{

    const dbname = 'Shopping';

    MongoClient.connect('mongodb://localhost:27017')
        .then((data)=>{
        console.log("connected..");
            state.db = data.db(dbname);
            // console.log(state.db)
            done()
        })
        .catch((err)=>{
            console.log("not connected");
            return done(err);
        });
    
}

module.exports.get = ()=> state.db