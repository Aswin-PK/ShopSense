// module.exports.hello = function(){
//     console.log("hello there....")
// }


const express = require('express')
const app = express()
const path = require('path')

app.get('/', (req, res)=> res.send("home page......."))

app.use((req, res, next)=>{
    console.log("starting ")
    next()
})


app.get('/register', (req, res, next)=> {
    res.sendFile(path.join(__dirname, 'sample.html'))
    console.log("middleware...")
    next()
})


app.use((req, res)=>{
    console.log("ending ")
})

app.post('/register', (req, res, next)=>{
    
    res.send("account created.......")
    next()
})


app.get('/contact', (req, res)=> res.send("contact page......."))



app.listen(7500, ()=>{
    console.log("server running......")
})