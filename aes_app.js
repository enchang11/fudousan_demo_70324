var express = require('express');
var app = express();
require('socket.io').version
var server = app.listen(3290);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));


/*var express    = require('express');
var app        = express.createServer();
var io         = require('socket.io').listen(app);

app.configure(function(){
	app.use(express.static(__dirname + "/public"));
});

app.listen(3281);*/

//remove error log
io.set('log level', 1);

var hours = 0;
var minutes = 0;
var seconds = 0;
var hh = 0;
var mm = 0;
var ss = 0;
var timer;


//商品名 - 生産者 - 評価 - 最低入札単価 - 入数 - 上場箱数 - 入札総箱数 - 落札可能箱数 - 完売率 - 入札者総数 - 落札合計金額
//Product Name - Producer - Evaluation - The lowest bid - Quantity - Listed number of boxes - Bid total number of boxes - Highest possible number of boxes - Sold out rate - Bidder total number -Successful bid total amount
// categories fashion=0, accessories=1; antiques=2;
var productData = [
					 {"prodID": "1", "category": 0, "prodName": "Tシャツ", "producer": "STUSSY", "rating": 'N', "lowestBid": 1000, "qty": 40, "num": 20, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"1.jpg", "status":1, "bidList": []},
					 {"prodID": "2", "category": 0, "prodName": "ポロシャツ", "producer": "LACOSTE", "rating": 'N', "lowestBid": 3000, "qty": 30, "num": 30, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"2.jpg", "status":1, "bidList": []},
					 {"prodID": "3", "category": 0, "prodName": "ジャケット", "producer": "Brioni", "rating": 'N', "lowestBid": 30000, "qty": 5, "num": 10, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"3.jpg", "status":1, "bidList": []},
					 {"prodID": "4", "category": 0, "prodName": "パーカー", "producer": "Adidas", "rating": 'N', "lowestBid": 4000, "qty": 20, "num": 30, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"4.jpg", "status":1, "bidList": []},
					 {"prodID": "5", "category": 0, "prodName": "シャツ", "producer": "Paul Smith", "rating": 'N', "lowestBid": 6000, "qty": 20, "num": 20, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"5.jpg", "status":1, "bidList": []},
					 {"prodID": "6", "category": 0, "prodName": "チノパン", "producer": "GAP", "rating": 'N', "lowestBid": 5000, "qty": 20, "num": 30, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"6.jpg", "status":1, "bidList": []},
					 {"prodID": "7", "category": 0, "prodName": "ジーンズ", "producer": "Levi's", "rating": 'N', "lowestBid": 9000, "qty": 20, "num": 30, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"7.jpg", "status":1, "bidList": []},
					 {"prodID": "8", "category": 0, "prodName": "ワンピース", "producer": "PRADA", "rating": 'N', "lowestBid": 30000, "qty": 5, "num": 10, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"8.jpg", "status":1, "bidList": []},
					 {"prodID": "9", "category": 0, "prodName": "カーディガン", "producer": "EASTBOY", "rating": 'N', "lowestBid": 6000, "qty": 20, "num": 20, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"9.jpg", "status":1, "bidList": []},
					 {"prodID": "10", "category": 0, "prodName": "スカート", "producer": "PRADA", "rating": 'N', "lowestBid": 20000, "qty": 20, "num": 30, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"10.jpg", "status":1, "bidList": []},
					 {"prodID": "11", "category": 0, "prodName": "ブラウス", "producer": "NARA CAMICIE", "rating": 'N', "lowestBid": 10000, "qty": 20, "num": 10, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"11.jpg", "status":1, "bidList": []},
					 {"prodID": "12", "category": 0, "prodName": "キャミソール", "producer": "GAP", "rating": 'N', "lowestBid": 2000, "qty": 20, "num": 20, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"12.jpg", "status":1, "bidList": []},
					 
					 {"prodID": "13", "category": 1, "prodName": "ROLEX daytona 116509 D番", "producer": "ROLEX", "rating": 'A', "lowestBid": 1000000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"1.jpg", "status":1, "bidList": []},
					 {"prodID": "14", "category": 1, "prodName": "CHROME HEARTS", "producer": "CHROME HEARTS", "rating": 'B', "lowestBid": 5000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"2.jpg", "status":1, "bidList": []},
					 {"prodID": "15", "category": 1, "prodName": "TAG Heuer　carrera CV2014-1", "producer": "TAG Huer", "rating": 'S', "lowestBid": 350000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"3.jpg", "status":1, "bidList": []},
					 {"prodID": "16", "category": 1, "prodName": "CARTIER スリーバングルズリング", "producer": "CARTIER", "rating": 'C', "lowestBid": 550000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"4.jpg", "status":1, "bidList": []},
					 {"prodID": "17", "category": 1, "prodName": "BVLGARI ＢＢ33 オートマSS", "producer": "BVLGARI", "rating": 'B', "lowestBid": 50000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"5.jpg", "status":1, "bidList": []},
				     {"prodID": "18", "category": 1, "prodName": "HERMES トゥルニス　レザーブレスレット BP049", "producer": "HERMES", "rating": 'A', "lowestBid": 3000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"6.jpg", "status":1, "bidList": []},
					 {"prodID": "19", "category": 1, "prodName": "CARTIER 750 ホワイトゴールド・パリリング", "producer": "CARTIER", "rating": 'B', "lowestBid": 20000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"7.jpg", "status":1, "bidList": []},
					 {"prodID": "20", "category": 1, "prodName": "ヴァンクリーフ パピヨン K18YG ダイヤ ネックレス", "producer": "Van Cleef & Arpels", "rating": 'A', "lowestBid": 200000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"8.jpg", "status":1, "bidList": []},
					 {"prodID": "21", "category": 1, "prodName": "TIFFANY PTベゼルセット ネックレス", "producer": "TIFFANY", "rating": 'A', "lowestBid": 20000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"9.jpg", "status":1, "bidList": []},
					 {"prodID": "22", "category": 1, "prodName": "GUCCI K18イエローゴールド ピアス", "producer": "GUCCI", "rating": 'B', "lowestBid": 20000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"10.jpg", "status":1, "bidList": []},
					 {"prodID": "23", "category": 1, "prodName": "CARTIER トーチュSM クオーツ/F409", "producer": "GUCCI", "rating": 'A', "lowestBid": 1800000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"11.jpg", "status":1, "bidList": []},
					 {"prodID": "24", "category": 1, "prodName": "HERMES アピⅢ レザーブレス", "producer": "GUCCI", "rating": 'B', "lowestBid": 5000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"12.jpg", "status":1, "bidList": []},
				  ];
				  
var bidder = [
			 	{"id":1, "name":"Company 1", "numTrades": 10, "numBids": 10, "phone": "00-0000-0000"},
				{"id":2, "name":"Company 2", "numTrades": 10, "numBids": 10, "phone": "00-0000-0000"},
				{"id":3, "name":"Company 3", "numTrades": 10, "numBids": 10, "phone": "00-0000-0000"},
				{"id":4, "name":"Company 4", "numTrades": 10, "numBids": 10, "phone": "00-0000-0000"},
				{"id":5, "name":"Company 5", "numTrades": 10, "numBids": 10, "phone": "00-0000-0000"},
				{"id":6, "name":"Company 6", "numTrades": 10, "numBids": 10, "phone": "00-0000-0000"},
				{"id":7, "name":"Company 7", "numTrades": 10, "numBids": 10, "phone": "00-0000-0000"},
				{"id":8, "name":"Company 8", "numTrades": 10, "numBids": 10, "phone": "00-0000-0000"},
				{"id":9, "name":"Company 9", "numTrades": 10, "numBids": 10, "phone": "00-0000-0000"},
				{"id":10, "name":"Company 10", "numTrades": 10, "numBids": 10, "phone": "00-0000-0000"},
			 ];	
			 
var messages = [
			   ];
			   			 			  
var notifications = [
						{"notification": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "notiDate": "2014/3/7 10:45"},
						{"notification": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "notiDate": "2014/3/7 11:20"},
						{"notification": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "notiDate": "2014/3/7 12:25"},
						{"notification": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "notiDate": "2014/3/7 12:35"},
						{"notification": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "notiDate": "2014/3/7 12:56"},
					];
				  
var biddingData = [];				  
var bidderData = []; 
var start = 0;
var onehour = 0;

io.sockets.on('connection', function (socket) {

	socket.on('disconnect', function(){
		socket.emit('disconnected');
	});
	
	//notification
	socket.on('send_notification', function(data){
		notifications.push(data);
		console.log(notifications);
		io.sockets.emit('recieve_notification', notifications);
	});
	
	socket.on('retrieve_notification', function(){
		socket.emit('recieve_notification', notifications);
	});
	//retrieve bidder data
	socket.on('retrieveBidderData', function(data){
		for(var b=0; b<bidder.length; b++){
			if(data.id==bidder[b].id){
				socket.emit('recieveBidder', bidder[b].name);
			}
		}
	});
	
	//one hour
	socket.on('onehour', function(){
		onehour = 1;
		hours = 0;
		minutes = 29;
		seconds = 60;
		socket.emit('receive_product', {"productData":productData, "onehour": onehour, "cat":""});
		console.log("1 hour");
	});
	
	//retrieve products
	socket.on('retrieve_product', function(data){
		socket.emit('receive_product', {"productData":productData, "onehour": onehour, "cat": data.cat});
		socket.emit('chkAuctionStatus', {"start": start, "onehour": onehour});
	});
	
	//get product detail
	socket.on('getProductDetail', function(data){
		for(var i=0; i<productData.length; i++){
			if(data.prodID==productData[i].prodID){
				//get bidders data
				bidderData = []; 
				for(var b=0; b<biddingData.length; b++){
					if(data.prodID==biddingData[b].prodID){
						bidderData.push(biddingData[b]);
					}
				}
				console.log(bidderData);
				socket.emit('receiveProductDetail', {"getProduct": productData[i], "bidderData": bidder, "biddingData": biddingData, "onehour": onehour});
			}
		}
	});
	
	//start auction
	socket.on('startAuction', function(){
		console.log('start');
		onehour = 0;
		hours = 0;
		minutes = 59;
		seconds = 60;
		timer = setInterval(counter, 1000);
		start = 1;
		biddingData = [];
		bidderData = [];
		productData = [
					 {"prodID": "1", "category": 0, "prodName": "Tシャツ", "producer": "STUSSY", "rating": 'N', "lowestBid": 1000, "qty": 40, "num": 20, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"1.jpg", "status":1, "bidList": []},
					 {"prodID": "2", "category": 0, "prodName": "ポロシャツ", "producer": "LACOSTE", "rating": 'N', "lowestBid": 3000, "qty": 30, "num": 30, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"2.jpg", "status":1, "bidList": []},
					 {"prodID": "3", "category": 0, "prodName": "ジャケット", "producer": "Brioni", "rating": 'N', "lowestBid": 30000, "qty": 5, "num": 10, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"3.jpg", "status":1, "bidList": []},
					 {"prodID": "4", "category": 0, "prodName": "パーカー", "producer": "Adidas", "rating": 'N', "lowestBid": 4000, "qty": 20, "num": 30, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"4.jpg", "status":1, "bidList": []},
					 {"prodID": "5", "category": 0, "prodName": "シャツ", "producer": "Paul Smith", "rating": 'N', "lowestBid": 6000, "qty": 20, "num": 20, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"5.jpg", "status":1, "bidList": []},
					 {"prodID": "6", "category": 0, "prodName": "チノパン", "producer": "GAP", "rating": 'N', "lowestBid": 5000, "qty": 20, "num": 30, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"6.jpg", "status":1, "bidList": []},
					 {"prodID": "7", "category": 0, "prodName": "ジーンズ", "producer": "Levi's", "rating": 'N', "lowestBid": 9000, "qty": 20, "num": 30, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"7.jpg", "status":1, "bidList": []},
					 {"prodID": "8", "category": 0, "prodName": "ワンピース", "producer": "PRADA", "rating": 'N', "lowestBid": 30000, "qty": 5, "num": 10, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"8.jpg", "status":1, "bidList": []},
					 {"prodID": "9", "category": 0, "prodName": "カーディガン", "producer": "EASTBOY", "rating": 'N', "lowestBid": 6000, "qty": 20, "num": 20, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"9.jpg", "status":1, "bidList": []},
					 {"prodID": "10", "category": 0, "prodName": "スカート", "producer": "PRADA", "rating": 'N', "lowestBid": 20000, "qty": 20, "num": 30, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"10.jpg", "status":1, "bidList": []},
					 {"prodID": "11", "category": 0, "prodName": "ブラウス", "producer": "NARA CAMICIE", "rating": 'N', "lowestBid": 10000, "qty": 20, "num": 10, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"11.jpg", "status":1, "bidList": []},
					 {"prodID": "12", "category": 0, "prodName": "キャミソール", "producer": "GAP", "rating": 'N', "lowestBid": 2000, "qty": 20, "num": 20, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"12.jpg", "status":1, "bidList": []},
					 
					 {"prodID": "13", "category": 1, "prodName": "ROLEX daytona 116509 D番", "producer": "ROLEX", "rating": 'A', "lowestBid": 1000000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"1.jpg", "status":1, "bidList": []},
					 {"prodID": "14", "category": 1, "prodName": "CHROME HEARTS", "producer": "CHROME HEARTS", "rating": 'B', "lowestBid": 5000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"2.jpg", "status":1, "bidList": []},
					 {"prodID": "15", "category": 1, "prodName": "TAG Heuer　carrera CV2014-1", "producer": "TAG Huer", "rating": 'S', "lowestBid": 350000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"3.jpg", "status":1, "bidList": []},
					 {"prodID": "16", "category": 1, "prodName": "CARTIER スリーバングルズリング", "producer": "CARTIER", "rating": 'C', "lowestBid": 550000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"4.jpg", "status":1, "bidList": []},
					 {"prodID": "17", "category": 1, "prodName": "BVLGARI ＢＢ33 オートマSS", "producer": "BVLGARI", "rating": 'B', "lowestBid": 50000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"5.jpg", "status":1, "bidList": []},
				     {"prodID": "18", "category": 1, "prodName": "HERMES トゥルニス　レザーブレスレット BP049", "producer": "HERMES", "rating": 'A', "lowestBid": 3000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"6.jpg", "status":1, "bidList": []},
					 {"prodID": "19", "category": 1, "prodName": "CARTIER 750 ホワイトゴールド・パリリング", "producer": "CARTIER", "rating": 'B', "lowestBid": 20000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"7.jpg", "status":1, "bidList": []},
					 {"prodID": "20", "category": 1, "prodName": "ヴァンクリーフ パピヨン K18YG ダイヤ ネックレス", "producer": "Van Cleef & Arpels", "rating": 'A', "lowestBid": 200000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"8.jpg", "status":1, "bidList": []},
					 {"prodID": "21", "category": 1, "prodName": "TIFFANY PTベゼルセット ネックレス", "producer": "TIFFANY", "rating": 'A', "lowestBid": 20000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"9.jpg", "status":1, "bidList": []},
					 {"prodID": "22", "category": 1, "prodName": "GUCCI K18イエローゴールド ピアス", "producer": "GUCCI", "rating": 'B', "lowestBid": 20000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"10.jpg", "status":1, "bidList": []},
					 {"prodID": "23", "category": 1, "prodName": "CARTIER トーチュSM クオーツ/F409", "producer": "GUCCI", "rating": 'A', "lowestBid": 1800000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"11.jpg", "status":1, "bidList": []},
					 {"prodID": "24", "category": 1, "prodName": "HERMES アピⅢ レザーブレス", "producer": "GUCCI", "rating": 'B', "lowestBid": 5000, "qty": 1, "num": 1, "bidNum": 0, "highestBidBox": 0, "soldRate": 0, "bidderNum": 0, "successBidTotal": 0, "imgName":"12.jpg", "status":1, "bidList": []},
				  ];
		io.sockets.emit('receive_product', {"productData":productData, "onehour": onehour, "cat":"0"});
		io.sockets.emit('auctionStarts');
	});
	
	//stop auction
	socket.on('stopAuction', function(){
		endAuction();
	});
	
	socket.on('getProductData', function(data){
		for(var i=0; i<productData.length; i++){
			if(data.prodID==productData[i].prodID){
				socket.emit('receiveProductData', {"getProduct": productData[i], "onehour": onehour});
			}
		}
		
	});
	
	//send bid
	var subTotal=0;
	var total =0;
	var biddingAmount=0;
	socket.on('sendBid', function(data){
		var numBox = 0;
		var totalSuccessBid = 0;
		for(var p=0; p<productData.length; p++){
			if(data.prodID==productData[p].prodID){
				numBox = productData[p].num;
				totalSuccessBid = productData[p].highestBidBox;
				
				var leftBox = parseInt(numBox-totalSuccessBid); //box available after left
				var successBidBox = 0; //box that can successfully bid
				var subTotal = 0; //subtotal of amount bid (bid x pieces x successfulBid);
				if(data.qty<=leftBox){
					succesBidBox = data.qty;
					leftBox = leftBox - succesBidBox;
				}
				else{
					succesBidBox = leftBox;
					leftBox = leftBox - succesBidBox;
				}
				
				productData[p].highestBidBox += parseInt(succesBidBox);
				//console.log("Left: ",leftBox, productData[p].highestBidBox);
				subTotal = parseInt(data.bid*data.pieces*succesBidBox);
				
				var receivedBid = {"prodID": data.prodID, "bidder":data.bidder, "pieces": data.pieces, "qty":data.qty, "bid":parseInt(data.bid), "time": data.time, "successfulBid": succesBidBox, "subTotal": subTotal, "status": data.status};
				
				biddingData.push(receivedBid);
				//
				biddingData = biddingData.sort(function(a, b) {
					if(a["bid"]!= b["bid"]){
						return (parseInt(b["bid"]) - parseInt(a["bid"]));
					}
					else{
						//return new Date(b["time"]) + new Date(a["time"]);
						a = new Date(a["time"]);
    					b = new Date(b["time"]);
						return a>b ? 1 : a<b ? -1 : 0;
					}
				});
			}
		}
		
		var updateLeft = 0;
		var up_successBidBox = 0;
		var up_subTotal = 0;
		var up_totalBidSuccess = 0;
		var up_totalBid = 0;
		var overallTotal = 0;
		var bidderNum = 0;
		for(var i=0; i<biddingData.length; i++){
			if(biddingData[i].prodID==data.prodID){
				updateLeft = parseInt(numBox - up_totalBidSuccess);
				
				if(biddingData[i].qty<=updateLeft){
					up_successBidBox = biddingData[i].qty;
					updateLeft = parseInt(updateLeft - up_successBidBox);
				}
				else{
					up_successBidBox = updateLeft;
					updateLeft = parseInt(updateLeft - up_successBidBox);
				}
				
				up_subTotal = parseInt(biddingData[i].bid*biddingData[i].pieces*up_successBidBox);
				overallTotal += up_subTotal;
				biddingData[i].successfulBid = up_successBidBox;
				biddingData[i].subTotal = up_subTotal;
				up_totalBidSuccess += parseInt(up_successBidBox);
				up_totalBid += parseInt(biddingData[i].qty);
				bidderNum++;
			}
		}
		
		for(var p=0; p<productData.length; p++){
			var greenred = "";
			if(data.prodID==productData[p].prodID){
				productData[p].bidderNum = bidderNum;
				productData[p].bidNum = up_totalBid;
				productData[p].highestBidBox = up_totalBidSuccess;
				productData[p].soldRate = parseInt(up_totalBidSuccess/productData[p].num*100).toFixed(0);
				productData[p].successBidTotal = overallTotal;
				
				if(up_totalBidSuccess<=parseInt(productData[p].num/2)){
					greenred = 1;
				}
				else if(up_totalBidSuccess==productData[p].num){
					greenred = 2;
				}
				else{
					greenred  = 0;
				}
				productData[p].status = greenred;
			}
		}

		io.sockets.emit('receive_bid', {"prodID": data.prodID, "biddingData": biddingData, "productData": productData, "bidderData":bidder, "onehour": onehour, "fromhour": data.fromhour});
		
		//normalize  bid status
		for(var nb=0; nb<biddingData.length; nb++){
			biddingData[nb].status="old";
		}
		
	});
	
	//functions===============
	var finalData = [];
	function endAuction() {
		console.log('end');
		hours = 0;
		minutes = 0;
		seconds = 0;
		hh = 0;
		mm = 0;
		ss = 0;
		start = 0;
		clearInterval(timer);
		
		for(var i=0; i<biddingData.length; i++){
			if(biddingData[i].qty==biddingData[i].successfulBid){
				biddingData[i].status = "successful";
			}
			else if(biddingData[i].qty>biddingData[i].successfulBid && biddingData[i].successfulBid!=0){
				biddingData[i].status = "some";
			}
			else{
				biddingData[i].status = "fail";
			}
		}
		
		for(var p=0; p<productData.length; p++){
			for(var b=0; b<biddingData.length; b++){
				if(productData[p].prodID==biddingData[b].prodID){
					
					productData[p].bidList.push(biddingData[b].bid);
				}
			}
		}
		io.sockets.emit('endAuction', {"biddingData": biddingData, "productData": productData, "bidderData":bidder});
	}
	
	function counter() {
		seconds = seconds - 1;
		ss = seconds - 1;
		if(hours<=0 && minutes<=0 && seconds<=0){
			clearInterval(timer);
			endAuction();
			start = 0;
			console.log('end');
		}
		else{
			if(seconds==0 && minutes==0 && hours >0){
				minutes = 60;
				hours = hours - 1;
				hh = hours - 1;
			}
			if(seconds ==0 && minutes > 0){
				seconds =60;
				minutes = minutes - 1;
				mm = minutes - 1;
			}
		
			if (seconds < 10) {
				ss = "0" + seconds;
			}else{
				ss = seconds;
			}
			if (minutes < 10) {
				mm = "0" + minutes;
			}else{
				mm = minutes;
			}
			if (hours < 10) {
				hh = "0" + hours;
			}else{
				hh = hours;
			}
		
			io.sockets.emit('receiveTimer',{"hours": hh, "minutes": mm, "seconds": ss});
		}
	}
	
	//messaging client =====================
	socket.on('retrieve_client', function(){
		socket.emit('receive_client', {"client": bidder});
	});
	
	//message history
	socket.on('retrieve_history', function(){
		socket.emit('receive_history', {"messages": messages, "bidder": bidder});
	});
	
	//get chat details
	socket.on('getChatDetails', function(data){
		socket.emit('display_chatDetails', {"messages": messages, "bidder": bidder});
	});
	
	//send message
	socket.on('sendMessage', function(data){
		messages.push(data);
		messages = messages.sort(function(a, b) {
					a = new Date(a["sentDate"]);
					b = new Date(b["sentDate"]);
					return a<b ? 1 : a>b ? -1 : 0;
				});
		console.log(messages);
		io.sockets.emit('display_chatDetails', {"messages": messages, "bidder": bidder, "clientId": data.to});
		io.sockets.emit('receive_history', {"messages": messages, "bidder": bidder});
	});
	
	socket.on('readMessage', function(data){
		
		for(var m=0; m<messages.length; m++){
			if(data.to==messages[m].to && data.from==messages[m].from){
				messages[m].status = "Read";
			}
		}
		
		socket.emit('updateMsgCtr', messages);
		socket.emit('receive_history', {"messages": messages, "bidder": bidder});
	});
	
	socket.on('retrieveMsgCtr', function(data){
		socket.emit('receiveMsgCtr', messages);
	});
	
});