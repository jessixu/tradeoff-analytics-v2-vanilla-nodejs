/**
 * Copyright 2014-2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var path = require('path');
var express = require('express'),
    tradeoffAnalyticsConfig = require('./tradeoff-analytics-config');

var bodyParser = require('body-parser');    
var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });


//读出所有的data
var fs = require('fs');
var file="data.json";
var result=JSON.parse(fs.readFileSync( file));
var option = result.options; // 所有的option data 



//test
var file_new = "datas.json";
var result_new=JSON.parse(fs.readFileSync( file));


//使用splice 删除json文件

// var jsonObj2={persons:[{name:"jordan",sex:"m",age:"40"}]};
// jsonObj2.persons.splice(0,1);

// result_new.options[0]=

//   {"key": "0",
//   "name": "34.55E23.001",
//   "values": {
//     "Length": 196,
//     "Width": 3.9,
//     "Thickness": 2,
//     "Annual Volume": 6000,
//     "Price": 0.212,
//     "Product Type": "Gasket",
//     "Supplier": "Laird"
//   },
//   "app_data": {
    
//   }
// } 

// console.log("test delete"+result_new.length);
// console.log(result_new);
// console.log("test end"+result_new.length);







var app = express();

app.use(bodyParser.urlencoded({ extended: false }));  
// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
	
});
app.get('/user',function(req,res){
	res.render('signup');
});

app.get('/test',function(req,res){
	res.render('index01');
});

app.get('/try',function(req,res){
	res.render('index');
});

//app.use('/',express.static(__dirname + '/public'));
app.get('/users/:name',function(req,res){
	res.send('hello'+req.params.name)
});

app.post('/user',  function(req, res) {
  var new_option = [];
  var length = parseFloat(req.body.length);
  var width = parseFloat(req.body.width);
  var thickness = parseFloat(req.body.thickness);
  var type = req.body.type;
  var length_low,length_high, width_low, width_high,thickness_low,thickness_high;
  console.log(typeof(length));
  if(type =="Gasket"){
     length_low = length-20;
      length_high = length+20;

     width_low = width-2;
      width_high = width+2;

      thickness_low = thickness-2;
      thickness_high = thickness+2;


      //删除 api调用时所用的json
var filepath = './public/data.json';
fs.unlink(filepath, function(err){
 if(err){
  throw err;
 }
 console.log('文件:'+filepath+'删除成功！');
})

      result_new.options.splice(0,result_new.options.length);


     console.log("gasket success");
  }
  console.log(length_low);
  console.log(length);
  console.log(width);
   console.log(thickness);

  
var key = 0;
  
  for (var i = 0; i< option.length; i++){
    if(option[i].values.Length>length_low&&option[i].values.Length<length_high&&option[i].values.Width>width_low&&option[i].values.Width<width_high&&option[i].values.Thickness>thickness_low&&option[i].values.Thickness<thickness_high){
  // if(option[i].values.Length>length_low&&option[i].values.Length<length_high){
   //   console.log("suitbale length No"+i+" "+option[i].values.Length);
    //   console.log("suitbale Width No"+i+" "+option[i].values.Width);
     //   console.log("suitbale thickness No"+i+" "+option[i].values.Thickness);
        var option_temp = option[i];
        option_temp.key = key+"";
        new_option.push(option_temp);
        result_new.options.push(option_temp);
        key++;

   }
    }
console.log(result_new.options);


//重新写入新的json
//key 要连续
var filename = "./public/data.json";
 fs.writeFileSync(filename, JSON.stringify(result_new));
//   console.log(option);
 // return  res.redirect('/test');
 return  res.redirect('/test');
});

// For local development, copy your service instance credentials here, otherwise you may ommit this parameter
var serviceCredentials = {
  username: '87b7d84c-5f9f-4fcf-af60-a6b83df93465',
  password: '3r7yIYLJh7ah'
}
// When running on Bluemix, serviceCredentials will be overriden by the credentials obtained from VCAP_SERVICES
tradeoffAnalyticsConfig.setupToken(app, serviceCredentials); 

// to communicate with the service using a proxy rather then a token, add a dependency on "body-parser": "^1.15.0" 
// to package.json, and use:
// tradeoffAnalyticsConfig.setupProxy(app, serviceCredentials);

var port = process.env.VCAP_APP_PORT || 2000;
app.listen(port);
console.log('listening at:', port);
