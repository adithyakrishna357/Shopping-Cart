var express = require('express');
var router = express.Router();
const productHelper=require('../helpers/product-helpers')
const userHelpers=require('../helpers/user-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.user.loggedIn){
    next()
  }
  else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/',(req,res)=>{
  let user=req.session.user;
  // console.log(user);
  productHelper.getAllProducts().then((products)=>{
    // console.log(products);
    res.render('user/view-products',{admin:false,products,user})
  })
});

router.get('/login',(req,res)=>{
  // console.log(req.session.user);
  if(req.session.user){
    res.redirect('/');
  }else{
    res.render('user/login', {loginErr:req.session.loginErr});
    req.session.loginErr=false;
  }
})
router.get('/signup',(req,res)=>{
    if(!req.session.user){
      res.render('user/signup');
    }
    else{
      res.redirect('/');
    }
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    // console.log(response);
    req.session.user=req.body.name;    //name
    req.session.user.loggedIn=true;
    // console.log(req.session.user);
    // console.log("check");
    res.redirect('/');
  })
})

router.post('/login',(req,res)=>{
  // console.log(req.body.email);
  userHelpers.doLogin(req.body).then((response)=>{
    // console.log(response)
    // res.send('login success !!!');
    if(response.status){
      req.session.user=response.user.name;
      req.session.loggedIn=true;
      res.redirect('/')
    }else{
      req.session.loginErr="Invalid username or password";
      res.redirect('/login'); 
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.user=null
  req.session.loggedIn=false;
  res.redirect('/')
})
module.exports = router;
