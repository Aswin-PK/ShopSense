// var name = require('readline-sync')
// var namevalue = name.question("Enter your name: ")


// var Person = {
//     name: "aswin",
//     age:21,
//     display: function(){
//         console.log(this.name)
//     }
// }
// console.log(Person.display())
// // console.log(Person['age'])

// // for(x in Person){
// //     console.log(Person[x])
// // }

// console.log(Person)


// function Person(name,age){
//     this.name = name
//     this.age = age
//     this.display = function(){
//         console.log(this.name + " -- " +this.age)
//     }
// }

// var aswin = new Person("aswin", 21)
// var abc = new Person("abc", 20)

// aswin.display()
// abc.display()


// var a = 10
// var a = 20

// console.log(a)
// try{
//     if(a === 10)
//         throw "Value is 10"
// }
// catch(err){
//     console.log(err)
// }


// hello = (a, b) => a+b

// console.log(hello(10,20))
// class hello{
//     constructor(num3,num4){
//         this.num3 = num3
//         this.num4 = num4
//     }
//     basefunction(){
//         console.log("hello base..."+(this.num3-this.num4))
//     }
// }

// class hi extends hello{
//     constructor(num1,num2){
//         super(num1, num2)
//         this.num1 = num1
//         this.num2 = num2
//     }
//     subfunction(){
//         console.log("hello subclass -- "+ (this.num1+this.num2))
//     }
// }

// var val = new hi(10,4)
// val.subfunction()
// val.basefunction()



// var helloFunction = require('./sample1')
// helloFunction.hello().

// var http = require('http')
// var fs = require('fs')
// var url = require('url')

 

// http.createServer((req, res)=>{
    
//     var q = url.parse(req.url, true)

//     if(q.pathname === '/'){

//         fs.readFile('sample.html', (err, data)=>{
//             res.writeHead(200, {'Content-Type':'text/html'})
//             res.write(data)
//             res.end()
//         });
//     }else if(q.pathname === '/registrationdone'){
//         res.write("Hello "+q.query.name)
//         res.end()
//     }else{
//         res.write("error page'''''''")
//         res.end()
//     }
    
// }).listen(7000, ()=>console.log("Server running.........."))



var Promise = require('promise')

function add(num1, num2){
    return new Promise((resolve, reject)=>{
        if(num2 == 0)
            reject("Cannot divide by zero.....")
        else
            resolve(num1/num2)
    });
}


add(120, 0).then(coefficient =>{
    console.log(coefficient)
})
.catch(err=>{
    console.log(err)
})