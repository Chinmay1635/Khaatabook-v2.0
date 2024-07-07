const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongooseconnection = require("./config/mongoose");
const userModel = require('./models/user');
const expenseModel = require('./models/expense');
const debugLog = require('debug')('development:app');
const path = require('path');
const { debuglog } = require('util');
const { redirect } = require('express/lib/response');
const exp = require('constants');
var invalid;


app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.get('/', function(req,res){
    let invalid = req.query.invalid || null;
    res.render('login',{invalid});
});

app.get('/signup', function(req,res){
    res.render('signup');
});



app.get('/:user/create', function(req,res){
    let userid = req.params.user;
    res.render('createnew', {userid})
});

app.post('/:user/expensecreate', async function(req,res){
    let userid = req.params.user;
    let user = await userModel.findOne({username:userid});
    let date = new Date();
    let day = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    const encrypted = req.body.encrypt === 'on';
    const sharable = req.body.sharable === 'on';
    const edit = req.body.edit === 'on';
    const password = req.body.password;
    if(user==null){
        res.redirect('/');
    }else{
     user.expense.push({
        title:req.body.title,
        description:req.body.description,
        properties:{
            encrypt:encrypted,
            password:password,
            sharable:sharable,
            edit:edit,
        },
        date:day,
    });

    await user.save();
    res.redirect(`/home/${userid}`);
}
});

// user creation and checking
app.post('/usercreated', async function(req,res){
    let user = await userModel.create({
        name:req.body.name,
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,

    });
    res.redirect('/');
});

app.post('/checkuser', async function(req,res){
    let userid = req.body.username;
    let password = req.body.password;

    let user = await userModel.findOne({username:userid});
    if(user==null){
        res.redirect('/');
    }else if(password==user.password){
        res.redirect(`/home/${userid}`);
    }else{
        
        res.redirect(`/?invalid=${decodeURIComponent('true')}`);
    }
});

app.get('/home/:username', async function(req,res){
    let userid = req.params.username;
    let user = await userModel.findOne({username:userid});
    let name = user.name;
    let expenseCard =  user ? user.expense : [];
    res.render('home',{userid,expenseCard,name});

});

app.get('/:username/view/:expense', async function(req,res){
    let userid = req.params.username;
    let user = await userModel.findOne({username:userid});
    let expenseCardId = req.params.expense;
    let expenseCard = user.expense.id(expenseCardId);
    
    res.render('view',{userid,expenseCard,expenseCardId});
});

app.get('/home/:username/:expense/delete', async function(req,res){
    let userid = req.params.username;
    let user = await userModel.findOne({username:userid});
    let expenseCardId = req.params.expense;
   user.expense = user.expense.filter(exp => exp._id.toString() !== expenseCardId);
   await user.save();

    res.redirect(`/home/${userid}`);
});

app.post('/home/:username/:expense/checkpass', async function(req,res){
    let userid = req.params.username;
    let user = await userModel.findOne({username:userid});
    let expenseId = req.params.expense;
    let inputpass = req.body.inputpass;
    let expenseCard = user.expense.find(exp => exp._id.toString() === expenseId);
    if(expenseCard.properties.password==inputpass){
        res.redirect(`/${userid}/view/${expenseId}`)
    }else{
        res.redirect(`/home/${userid}`);
    }
});

app.get('/home/:username/:expense/edit', async function(req,res){
    let userid = req.params.username;
    let user = await userModel.findOne({username:userid});
    let expenseId = req.params.expense;
    let expenseCard = user.expense.find(exp => exp._id.toString() === expenseId);
    res.render('edit',{userid,expenseCard});

});

app.post('/home/:username/:expenseId/edited', async function(req, res) {
    let userid = req.params.username;
    let expenseId = req.params.expenseId;
    let user = await userModel.findOne({ username: userid });
    let date = new Date();
    let day = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

    const encrypted = req.body.encrypt === 'on';
    const sharable = req.body.sharable === 'on';
    const edit = req.body.edit === 'on';
    const password = req.body.password;

    if (user == null) {
        res.redirect('/');
    } else {
        let expense = user.expense.id(expenseId);
        
        if (expense) {
            expense.title = req.body.title;
            expense.description = req.body.description;
            expense.properties = {
                encrypt: encrypted,
                password: password,
                sharable: sharable,
                edit: edit
            };
            expense.date = day;
        }

        await user.save();
        res.redirect(`/${userid}/view/${expense._id}`);
    }
});
app.listen(3000);

