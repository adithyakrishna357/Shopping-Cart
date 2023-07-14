const db=require('../config/connection');
const collection=require('../config/collections');
const bcrypt = require('bcrypt');
var objectId=require('mongodb-legacy').ObjectId


module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            // console.log(userData);
            userData.password = await bcrypt.hash(userData.password,10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(async(data)=>{
                dataDoc = await db.get().collection(collection.USER_COLLECTION).findOne({_id:data.insertedId});
                resolve(dataDoc);
            })
        })
        
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            // let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                // console.log(user)
                // console.log(user.password);
                // console.log(userData.password);
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    // console.log(status)
                    if(status){
                        // console.log("login success");
                        response.user=user;
                        response.status=true;
                        resolve(response);
                    }
                    else{
                        // console.log('login failed');
                        resolve({status:false});
                    }
                })
            }
            else{
                console.log('User Invalid');
                resolve({status:false})
            }
        })
    },

    getUserData:function(){
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).find().toArray().then((users)=>{
                console.log(users);
                resolve(users)
            })
        })
    },
    getEditUser:function(id,proDetails){
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(id)}).then((users)=>{
                resolve(users);
            })
        })
    },
    updateuser:function(id,userDetails){
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(id)},{
                $set:{
                    name:userDetails.name,
                    email:userDetails.email
                }
            }).then((response)=>{   
                resolve(response);
            })
        })
    },

    deleteuser:function(id){
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(id)}).then((response)=>{
                resolve(response);
            })
        })
    },
}