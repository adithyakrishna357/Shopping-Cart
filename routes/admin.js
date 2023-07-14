const { response } = require('express');
var express = require('express');
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require("../helpers/user-helpers")
var router = express.Router();



/* GET users listing. */
let credentials={
  adminName: "Admin",
  adminEmail: "admin12345@gmail.com",
  adminPassword: "admin357"
}
router.get('/login',(req,res)=>{
  if(req.session.adminLoggedIn){
    res.redirect('/admin');
  }
  else{
    res.render('admin/admin-login',{admin:true,adminLoginErr:req.session.adminLoginErr});
    req.session.adminLoginErr=false;
  }
})
router.post('/login',(req,res)=>{
  if(req.body.email==credentials.adminEmail&&req.body.password==credentials.adminPassword){
    req.session.admin=req.body.email;
    req.session.adminLoggedIn=true;
    req.session.adminName=credentials.adminName;
    // console.log(req.session.adminName);
    res.redirect('/admin');
  }
  else{
    req.session.adminLoginErr="Invalid username or Password";
    res.redirect('/admin/login');
  }
})
router.get('/',(req,res)=>{
  if(req.session.adminLoggedIn){
    productHelpers.getAllProducts().then((products)=>{
      res.render('admin/admin-view',{admin:true,products,adminName:req.session.adminName});
    })
  }
  else{
    res.redirect('/admin/login');
  }
})
router.get('/add-product',(req,res)=>{
  if(req.session.adminLoggedIn){
    res.render('admin/add-product',{admin:true,adminName:req.session.adminName});
  }else{
    res.redirect('/admin/login')
  }
  
})

router.post("/add-product",(req,res)=>{
  if(req.session.adminLoggedIn){
  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image
    // console.log(id);
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(!err){
        res.render("admin/add-product",{admin:true,adminName:req.session.adminName})
      }
      else{
        console.log(err)
      }
    })
    // res.render("admin/add-product")
  })
  }
})

router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  // console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })
})

router.get('/edit-product/:id',async(req,res)=>{
  if(req.session.adminLoggedIn){
    let product= await productHelpers.getProductDetails(req.params.id);
  res.render('admin/edit-product',{admin:true,product,adminName:req.session.adminName})
  }
  else{
    res.redirect('/admin/login');
  }
  
})

router.post('/edit-product/:id',(req,res)=>{
  // let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    // console.log(req.params.id);
    try{
      let image = req.files.Image;
      image.mv('./public/product-images/'+req.params.id+'.jpg');
      // console.log("working...");
    }catch{
      console.log("image not updated !!!");
    }finally{
      res.redirect('/admin');
    }
  })
})

router.get('/logout',(req,res)=>{
  // req.session.destroy();
  req.session.adminLoggedIn=false;
  res.redirect('/admin/login');
})



// new edits

router.get("/user-data",(req,res)=>{
  if(req.session.adminLoggedIn){
  userHelpers.getUserData().then((users)=>{
    res.render("admin/user-data-view",{users,admin:true,adminName:req.session.adminName})

  })
  }
  else{
    res.redirect('/admin/login')
  }

})

router.get("/edit-user/:id",(req,res)=>{
  // console.log(req.params.id)
  if(req.session.adminLoggedIn){
    userHelpers.getEditUser(req.params.id).then((users)=>{
      res.render("admin/edit-user",{users,admin:true,adminName:req.session.adminName})
    })
    
  }
  else{
    res.redirect('/admin/login')
  }
})

router.post("/edit-user/:id",(req,res)=>{
  if(req.session.adminLoggedIn){
    userHelpers.updateuser(req.params.id,req.body).then((users)=>{
      if(users){
        res.redirect("/admin/user-data")
      }
    })
  }
})

router.get("/delete-user/:id",(req,res)=>{
  userHelpers.deleteuser(req.params.id).then((response)=>{
    if(response){
      res.redirect("/admin/user-data")
    }
  })
})

router.get('/add-user',(req,res)=>{
  if(req.session.adminLoggedIn){
    res.render('admin/add-user',{admin:true,adminName:req.session.adminName});
  }else{
    res.redirect('/admin/login')
  }
  
})


router.post("/add-user",(req,res)=>{
  if(req.session.adminLoggedIn){
    // console.log(req.body)
  userHelpers.doSignup(req.body).then((response)=>{
    if(response){
      res.redirect("/admin/user-data");
    }
    else{
      res.redirect('/admin');
    }    
  })
  }
})

router.get("/allproducts",(req,res)=>{
  // console.log('arrivede conn')
  if(req.session.adminLoggedIn){
    productHelpers.getAllProducts().then((products)=>{
    res.render("admin/admin-view",{admin:true,products,adminName:req.session.adminName})

  })
  }
})

module.exports = router;
