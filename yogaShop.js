/*Prathima Yarlagadda*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
var myApp = express();

myApp.use(bodyParser.urlencoded({ extended:false}));

myApp.use(bodyParser.json())

myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname+'/public'));
myApp.set('view engine', 'ejs');

myApp.get('/',function(req, res){
    res.render('yogaShop');
});
myApp.get('/orderForm',function(req, res){
    res.render('orderForm');
});
myApp.post('/orderForm',[      
    check('email', 'Please enter a valid Email').isEmail(),
    check('address', 'Address is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('postCode', 'PostCode is required').not().isEmpty(),    
    check('phone').custom(value => {
        var phoneRegex = /^[0-9]{3}\s?[0-9]{3}\s?[0-9]{4}$/;
        if(!phoneRegex.test(value)){
            throw new Error ('Phone number not right')
            ;} 
            else{
            return true;
            }
        }),

    check('name').custom(value => {
        var nameRegex = /^[A-Za-z]{1,}\s?[A-Za-z]{1,}$/;
        if(!nameRegex.test(value)){
            throw new Error ('There must be a space between first and last name');}
            else{
                return true;
                }
        }),
    
    check('item1').not().isEmpty(),
    check('item1').isInt(),    
    check('item1').custom((value,{req})=> {
        var item1 = req.body.item1;
        var item2 = req.body.item2;
        var item3 = req.body.item3;        
        value = parseInt(value);        
        if(item1 == 0 && item2 == 0 && item3 == 0 ){
            throw new Error('Select at least one Item')
        }
        else if (value < 0) {
            throw new Error ('Enter a positive value')
        }
        return true;
    }),
    check('item2').optional({checkFalse:true}).isInt().withMessage().custom((value)=>{
        value = parseInt(value); 
        if (value < 0) {
            throw new Error ('Enter a positive value')
        }
        return true;
    }),
    check('item3').optional({checkFalse:true}).isInt().withMessage().custom((value)=>{
        value = parseInt(value); 
        if (value < 0) {
            throw new Error ('Enter a positive value')
        }
        return true;
    }),
    
],function(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        var errorsData = {
            errors: errors.array()
        }
        res.render('orderForm',errorsData);
    }   
    else
    {   
        var name = req.body.name;
        var phone = req.body.phone;        
        var address = req.body.address;        
        var city = req.body.city;
        var postCode = req.body.postCode;        
        var item1 = parseInt(req.body.item1);
        var item2 = parseInt(req.body.item2);
        var item3 = parseInt(req.body.item3);        
        var delTime = parseInt(req.body.delTime); 
        var province = req.body.province;
           
          
            var provTaxes = {
                "AB":0.05, "BC":0.12, "MB": 0.12, "NB": 0.15,
                "NL": 0.15, "NT": 0.05, "NS": 0.15, "NV": 0.05, 
                "ON":0.13, "PE": 0.15, "QC": 0.14975, 
                "SK": 0.11, "YT":0.05};
            var deliveryCost = [0, 30, 25, 20, 15];
                
                var cost = 0;
                if(item1>0){
                    cost += 12*item1;
                }            
                if(item2>0){
                    cost+=20*item2;
                }
                if(item3>0){
                    cost += 40*item3;
                }
            var tax =  cost * provTaxes[province]; 
            var delCost = deliveryCost [delTime];
            var totalCost = cost + tax + delCost;
            var pageData = {
                name: name,
                phone: phone,
                address: address,
                city: city,
                province : province,
                postCode: postCode,
                cost: cost.toFixed(2), 
                delCost: delCost,
                tax: tax.toFixed(2),          
                totalCost: totalCost.toFixed(2)
            };
            res.render('invoice',pageData);
        }
    });

myApp.listen(80);
console.log('Server started at 80 for mywebsite...');