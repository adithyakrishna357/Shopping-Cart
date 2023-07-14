const {MongoClient} =require('mongodb-legacy');
const state={
    db:null
}


module.exports.connect=(done)=>{
    const url='mongodb://127.0.0.1:27017';
    const dbname='shopping';

    MongoClient.connect(url,(err,data)=>{
        if(err) return console.log("database connection err")
        state.db = data.db(dbname);
        done();
    })
}

module.exports.get=function(){
    return state.db
}