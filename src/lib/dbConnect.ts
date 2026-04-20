//next.js uses server side rendering, and doesnot keep on running, instead it runs as it receives the request. Unlike in normal node.js backend where, once the DB connection is established, it stays connected, here, in nextjs the connected is made as per the requirement.

//Therefore, one difference is that, we need to check whether there is already a db connection established due to some previous request , them use the same connection. Otherwise, creating a fresh connection everytime on each request may choke the DB and application.

import mongoose from "mongoose";

let cached = (global as any).mongoose || {conn: null, promise: null}

export async function connectToDB(): Promise <void>{

    if(cached.conn) return cached.conn;

    try{
        const mongo_uri = process.env.MONGO_URI;
        // console.log("mongo_uri: ",mongo_uri);
        //promise is maintained so that multiple request donot make their independent connection request initially when the connection is not established and use the same promise/connection request.
        if(!cached.promise){
            cached.promise = mongoose.connect( mongo_uri || '')
        }

        cached.conn = await cached.promise;
        return cached.conn;

    }catch(err){
        // console.log("error occured. unable to connect", err)
        process.exit(1);
    }
    
}

(global as any).mongoose = cached;
