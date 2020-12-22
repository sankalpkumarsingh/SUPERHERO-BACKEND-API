const http = require("http");
const url = require('url');
const fs = require('fs');

const superherosString = fs.readFileSync("./superheros.json","utf-8");
const superheros = JSON.parse(superherosString)



const server= http.createServer((req,res)=>{

const path = url.parse(req.url,true)

res.writeHead(200,{

    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST,GET,PUSH,PUT,PATCH,DELETE",
    "Access-Control-Allow-Headers":"*",
    "Content-Type":"application/json"
})

if(path.pathname=="/superheros"|| path.pathname=="/"){
    res.end(superherosString)

}
   else if(path.pathname=="/superhero"){
       if(req.method=="OPTION"){
       res.end()
       }
       else if(req.method=="GET"){
         
     const id = path.query.id;
        const singlesuperhero = superheros.find((ele)=>{
         return ele.id==id;
        })

     res.end(JSON.stringify(singlesuperhero))
    
    }


    else if(req.method=="POST"){
        let body=""
         req.on('data',(data)=>{
             body+=data;
         })

         req.on('end',()=>{
             let superhero = JSON.parse(body)
             superheros.push(superhero);
             fs.writeFile("./superheros.json",JSON.stringify(superheros),(err)=>{
                 res.end(JSON.stringify({message:"supehero added"}))
             })
         })



    }

      else if(req.method=="PUT"){
   const id = path.query.id;
        let body=""
        req.on('data',(data)=>{
            body+=data;
        })

        req.on('end',()=>{
            let superhero = JSON.parse(body)
         superheros.forEach((ele) => {
             if(ele.id==id){
                 ele.name=superhero.name
                 ele.age=superhero.age
                 ele.planet=superhero.planet
                 ele.weapons=superhero.weapons

             }
             
             });


            fs.writeFile("./superheros.json",JSON.stringify(superheros),(err)=>{
                res.end(JSON.stringify({message:"product added"}))
            })
        })

    }

    

      else if(req.method=="DELETE"){
      const id = path.query.id;
       superheros.forEach((ele,index)=>{
         if(ele.id==id){
             superheros.splice(index,1)
         }
       })
       fs.writeFile("./superheros.json",JSON.stringify(superheros),(err)=>{
         res.end(JSON.stringify({message:"supehero deleted"})) 
       })
 }

    

   else{
        res.writeHead(404,{
            "Content-Type":"text/hmtl"
        })
     res.end("resourse not found")
    }


   
}
      

})


   server.listen("3000","127.0.0.1",()=>{
        console.log("server has started")
    })
