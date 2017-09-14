/**
 * Unofficial Pebble App for Nicehash
 * The app was created by https://github.com/kenman345 and with my little help on some stuff
 * This version is only modified by me (DylanGrl) so this repo isn't linked to what kenman345 is doing
 * Feel free to support him for his huge work ! (His wallet : 1fyhhqygc6hh7jccckwvyq7khrzczhahat)
 * You can also think of me if you got still enought money ^^  (My BTC Wallet : 154JhrS85atM8Wp9f71TLgXyQFazRCNhPw)
 */
Pebble.addEventListener('ready', function() {
    //IMPORT
    require('pebblejs');
    var Clay = require('pebble-clay');
    var clayConfig = require('./config.js');
    var clay = new Clay(clayConfig);

    var UI = require('pebblejs/ui');
    var Vector2 = require('pebblejs/lib/vector2');
    var ajax = require('pebblejs/lib/ajax');
    var Settings = require('pebblejs/settings');
    var Feature = require('pebblejs/platform/feature');
    var symbol_array=[];
    var convert_array=[];
    var change_array=[];
    var fiat_price;
    var menu ;

    var currType = Settings.option('10000');


    Pebble.addEventListener('showConfiguration', function(e) {
        Pebble.openURL(clay.generateUrl());
    });

    Pebble.addEventListener('webviewclosed', function(e) {
        if (e && !e.response) {
            return;
        }

        console.log('e: ', JSON.stringify(e));
        var dict = clay.getSettings(e.response);
        console.log(JSON.stringify(dict));

        // Save the Clay settings to the Settings module. 
        Settings.option(dict);

        console.log("Currency: " + Settings.option('10000'));
        console.log(Settings.option('Currency'));

        currType = Settings.option('10000');
    });

    var splashScreen = new UI.Card({ title: "Loading...", subtitle: "Please Wait" });
    splashScreen.show();


  function getFiatRate(){
    if(currType===undefined){
        currType='EUR';
      }
          ajax({ 
              url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=' + currType, 
              type: 'json' 
          },
               function(data) {
                 console.log('currType:'+currType);
                   fiat_price = data[currType];
                   getData();
               });
  
          return fiat_price;
  }
  
  function getData() {
      if(currType===undefined){
        currType='EUR';
      }
      ajax({ 
                url: 'https://api.coinmarketcap.com/v1/ticker/?convert='+currType+'&limit=10', 
                type: 'json' 
            }, function(data) {
              var resultData = data;
              //console.log(resultData.length);
              var size = resultData.length;
              for(var i=0; i<size;i++){
                //console.log('Symb:'+resultData[i].symbol);
                //console.log('Convert:'+resultData[i].price_eur);
                //console.log('Change:'+resultData[i].percent_change_24h);
                symbol_array.push(resultData[i].symbol);
                console.log('Symb:'+symbol_array[i]);
                var btc_price = resultData[i].price_btc;
                //console.log('btc_price:'+btc_price);
                //console.log('fiat_price:'+fiat_price);
                var price = btc_price* fiat_price;
                price = parseFloat(price).toFixed(2);
                //console.log('price:'+price);
                convert_array.push(price);
                console.log('Convert:'+convert_array[i]);
                change_array.push(resultData[i].percent_change_24h);
                console.log('Change:'+change_array[i]);
                updateContent();
              }
            }
           );
}

function updateContent(){
   menu = new UI.Menu({
       highlightBackgroundColor: Feature.color('#0497F9', 'black'),
        highlightColor: Feature.color('white', 'white'),
       sections: [{
        items: [
       {
          title: ''+symbol_array[0]+' / '+symbol_array[1],                
         }, 
          {
         title: ''+symbol_array[2]+' / '+symbol_array[3],
        //subtitle: 'Subtitle Text'
          },
        {
          title: ''+symbol_array[4]+' / '+symbol_array[5],
          //subtitle: 'Subtitle Text'
          }, 
         {
          title: ''+symbol_array[6]+' / '+symbol_array[7],
          }, 
         {
          title: ''+symbol_array[8]+' / '+symbol_array[9],
         }
        ]
      }]
    });
    splashScreen.hide();
     var main = new UI.Window({
         bodyColor: Feature.color('white', 'black'),
         backgroundColor: Feature.color('#0497F9', 'white'),
    });
    var welcome = new UI.Text({
        size: new Vector2(144, 168),
        text: "Check the top 10 Coin rate on the market !",
        textAlign:'center',
        position: new Vector2(0, 30),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
    main.add(welcome);
  
    menu.show();
   
    
    //P1
    var p1 = new UI.Window({
         bodyColor: Feature.color('white', 'black'),
         backgroundColor: Feature.color('#0497F9', 'white'),
    });
    var p1_top_text = new UI.Text({
        size: new Vector2(144, 168),
        text: "Page 1/5",
        textAlign:'center',
        color:Feature.color('white', 'black')
    });
    var p1_currency_text = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+symbol_array[0]+": "+convert_array[0]+" "+currType,
        textAlign:'center',
        position: new Vector2(0, 30),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
   var p1_change_text = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+change_array[0]+" % (24h)",
        textAlign:'center',
        position: new Vector2(0, 60),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
    var p1_currency_text_2 = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+symbol_array[1]+": "+convert_array[1]+" "+currType,
        textAlign:'center',
        position: new Vector2(0, 100),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
   var p1_change_text_2 = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+change_array[1]+" % (24h)",
        textAlign:'center',
        position: new Vector2(0, 130),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
    p1.add(p1_top_text);
    p1.add(p1_currency_text);
    p1.add(p1_change_text);
    p1.add(p1_currency_text_2);
    p1.add(p1_change_text_2);
  
  
    //P2
    var p2 = new UI.Window({
         bodyColor: Feature.color('white', 'black'),
         backgroundColor: Feature.color('#0497F9', 'white'),
    });
    var p2_top_text = new UI.Text({
        size: new Vector2(144, 168),
        text: "Page 2/5",
        textAlign:'center',
        color:Feature.color('white', 'black')
    });
    var p2_currency_text = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+symbol_array[2]+": "+convert_array[2]+" "+currType,
        textAlign:'center',
        position: new Vector2(0, 30),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
   var p2_change_text = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+change_array[2]+" % (24h)",
        textAlign:'center',
        position: new Vector2(0, 60),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
    var p2_currency_text_2 = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+symbol_array[3]+": "+convert_array[3]+" "+currType,
        textAlign:'center',
        position: new Vector2(0, 100),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
   var p2_change_text_2 = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+change_array[3]+" % (24h)",
        textAlign:'center',
        position: new Vector2(0, 130),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
    p2.add(p2_top_text);
    p2.add(p2_currency_text);
    p2.add(p2_change_text);
    p2.add(p2_currency_text_2);
    p2.add(p2_change_text_2);
  
  
    //P3
    var p3 = new UI.Window({
         bodyColor: Feature.color('white', 'black'),
         backgroundColor: Feature.color('#0497F9', 'white'),
    });
    var p3_top_text = new UI.Text({
        size: new Vector2(144, 168),
        text: "Page 3/5",
        textAlign:'center',
        color:Feature.color('white', 'black')
    });
    var p3_currency_text = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+symbol_array[4]+": "+convert_array[4]+" "+currType,
        textAlign:'center',
        position: new Vector2(0, 30),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
   var p3_change_text = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+change_array[4]+" % (24h)",
        textAlign:'center',
        position: new Vector2(0, 60),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
    var p3_currency_text_2 = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+symbol_array[5]+": "+convert_array[5]+" "+currType,
        textAlign:'center',
        position: new Vector2(0, 100),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
   var p3_change_text_2 = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+change_array[5]+" % (24h)",
        textAlign:'center',
        position: new Vector2(0, 130),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
    p3.add(p3_top_text);
    p3.add(p3_currency_text);
    p3.add(p3_change_text);
    p3.add(p3_currency_text_2);
    p3.add(p3_change_text_2);
  

      //P4
    var p4 = new UI.Window({
         bodyColor: Feature.color('white', 'black'),
         backgroundColor: Feature.color('#0497F9', 'white'),
    });
    var p4_top_text = new UI.Text({
        size: new Vector2(144, 168),
        text: "Page 4/5",
        textAlign:'center',
        color:Feature.color('white', 'black')
    });
    var p4_currency_text = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+symbol_array[6]+": "+convert_array[6]+" "+currType,
        textAlign:'center',
        position: new Vector2(0, 30),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
   var p4_change_text = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+change_array[6]+" % (24h)",
        textAlign:'center',
        position: new Vector2(0, 60),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
    var p4_currency_text_2 = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+symbol_array[7]+": "+convert_array[7]+" "+currType,
        textAlign:'center',
        position: new Vector2(0, 100),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
   var p4_change_text_2 = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+change_array[7]+" % (24h)",
        textAlign:'center',
        position: new Vector2(0, 130),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
    p4.add(p4_top_text);
    p4.add(p4_currency_text);
    p4.add(p4_change_text);
    p4.add(p4_currency_text_2);
    p4.add(p4_change_text_2);
  
  
  
    //P5
    var p5 = new UI.Window({
         bodyColor: Feature.color('white', 'black'),
         backgroundColor: Feature.color('#0497F9', 'white'),
    });
    var p5_top_text = new UI.Text({
        size: new Vector2(144, 168),
        text: "Page 5/5",
        textAlign:'center',
        color:Feature.color('white', 'black')
    });
    var p5_currency_text = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+symbol_array[8]+": "+convert_array[8]+" "+currType,
        textAlign:'center',
        position: new Vector2(0, 30),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
   var p5_change_text = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+change_array[8]+" % (24h)",
        textAlign:'center',
        position: new Vector2(0, 60),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
    var p5_currency_text_2 = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+symbol_array[9]+": "+convert_array[9]+" "+currType,
        textAlign:'center',
        position: new Vector2(0, 100),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
   var p5_change_text_2 = new UI.Text({
        size: new Vector2(144, 168),
        text: ""+change_array[9]+" % (24h)",
        textAlign:'center',
        position: new Vector2(0, 130),
        font:'GOTHIC_24_BOLD',
        color:Feature.color('white', 'black')
    });
    p5.add(p5_top_text);
    p5.add(p5_currency_text);
    p5.add(p5_change_text);
    p5.add(p5_currency_text_2);
    p5.add(p5_change_text_2);
  
  
    //MAIN  + MENU + INTERRACTION
  
    menu.on('select', function(e) {
      if(e.itemIndex == 0){
          menu.hide();
          p1.show();
      }
      if(e.itemIndex == 1){
          menu.hide();
          p2.show();
      }
      if(e.itemIndex == 2){
          menu.hide();
          p3.show();
      }
      if(e.itemIndex == 3){
          menu.hide();
          p4.show();
      }
      if(e.itemIndex == 4){
          menu.hide();
          p5.show();
      }
      
      });
  
      //PAGE MVMT
      menu.on('click', 'back', function () {
            menu.close();
      });
      //p1
      p1.on('click', 'down', function(e) {
        p2.show();
        p1.hide();
      });
      p1.on('click', 'up', function(e) {
        p1.hide();
        menu.show();
      });
    
      //p2
      p2.on('click', 'down', function(e) {
        p2.hide();
        p3.show();
      });
      p2.on('click', 'up', function(e) {
        p2.hide();
        p1.show();
      });
  
      //p3
      p3.on('click', 'down', function(e) {
        p3.hide();
        p4.show();
      });
      p3.on('click', 'up', function(e) {
        p3.hide();
        p2.show();
      });
      
      //p4
      p4.on('click', 'down', function(e) {
        p4.hide();
        p5.show();
      });
      p4.on('click', 'up', function(e) {
        p4.hide();
        p3.show();
      });
  
      //p5
      p5.on('click', 'down', function(e) {
        p5.hide();
        menu.show();
      });
      p5.on('click', 'up', function(e) {
        p5.hide();
        p4.show();
      });
}
  
  getFiatRate();

});
