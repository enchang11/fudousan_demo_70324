var socket = io.connect(socketUrl);
$(function(){
	var type=[
						{"name":'Tシャツ', "cat":0},
						{"name":'ポロシャツ', "cat":0},
						{"name":'シャツ', "cat":0},
						{"name":'キャップ', "cat":0},
						{"name":'パーカー', "cat":0},
						{"name":'時計',"cat":1},
						{"name":'指輪',"cat":1},
						{"name":'ピアス',"cat":1},
						{"name":'ブレスレット',"cat":1},
						{"name":'ネックレス',"cat":1}
				];
						
	var categories=[
						{"name":'アウター', "cat":0},
						{"name":'トップス', "cat":0},
						{"name":'ボトムス', "cat":0},
						{"name":'インナー', "cat":0},
						{"name":'ルーム', "cat":0},
						{"name":'グッズ', "cat":0},
						{"name":'キッズ',"cat":0},
						{"name":'時計',"cat":1},
						{"name":'指輪',"cat":1},
						{"name":'ネックレス',"cat":1},
						{"name":'ブレスレット',"cat":1},
						{"name":'ピアス',"cat":1},
						{"name":'ブローチ',"cat":1},
						{"name":'チャーム',"cat":1}
					];

								
	var get=getRequest();
	var userid=get["id"];
	socket.emit('retrieveBidderData', {"id": userid});
	socket.on('recieveBidder', function(data){
		$('#username').html(data);
	});;
	
	//list type and category
	listType("");
	listCategory("");
	function listType(cat){
		var typeHTML = "";
		var typeCtr = 0;
		for(var t=0; t<type.length; t++){
			if(cat==type[t].cat || cat==""){
				typeCtr++;
				typeHTML +='<li>';
				typeHTML +='<a href="#">';
				typeHTML +='<div class="listShadeNumber listShadeLine">';
				typeHTML +=typeCtr;
				typeHTML +='</div>';
				typeHTML +='<div class="listShadeText">'+type[t].name+'</div>';
				typeHTML +='</a>';
				typeHTML +='</li>';
			}
		}
		$('#productType').html(typeHTML);
	}
	
	function listCategory(cat){
		var categoryHTML = '<li><a href="#" class="link">ALL</a></li>';
		var catCtr = 0;
		for(var t=0; t<categories.length; t++){
			if(cat==categories[t].cat || cat==""){
				catCtr++;
				categoryHTML +='<li>';
				categoryHTML +='<a href="#" class="link">';
				categoryHTML += categories[t].name;
				categoryHTML +='</a>';
				categoryHTML +='</li>';
			}
		}
		$('#productCategory').html(categoryHTML);
	}
	//===============
	
	//click category
	var getCat =0;
	
	$('.foodGraph li').click(function(){
		$('.foodGraph li').removeClass('active');
		
		getCat = $(this).attr('data-cat');
		$(this).addClass('active');
		displayProducts(getCat);
		listType(getCat);
		listCategory(getCat);
	});
	
	//display products
	displayProducts('0');
	listType('0');
	listCategory('0');
	
	function displayProducts(cat){
		socket.emit('retrieve_product', {"cat": cat});
	}
	
	socket.on('receive_product', function(data){
		console.log(getCat);
		$('.foodGraph li').removeClass('active');
		$('.foodGraph li').filter('[data-cat="'+getCat+'"]').addClass('active');
		var htmlProduct="";
		for(var i=0; i<data.productData.length; i++){
			if(data.cat==data.productData[i].category || data.cat==""){
				var category = "";
				if(data.productData[i].category==0){
					category="fashion";
				}
				else if(data.productData[i].category==1){
					category="accessories";
				}
				else{
					category="antique";
				}
				htmlProduct +='<li data-prodID="'+data.productData[i].prodID+'">';
				htmlProduct +='<div class="productThumb">';
				htmlProduct +='<img src="images/product/'+category+'/'+data.productData[i].imgName+'">';
				htmlProduct +='</div>';
				htmlProduct +='<strong class="productTitle">'+data.productData[i].producer+' '+data.productData[i].prodName+'</strong>';
				htmlProduct +='<span class="productQty">';
				htmlProduct +='<span>評価：'+data.productData[i].rating+'</span>';
				htmlProduct +='<span>最低入札単価：¥'+edtComma(data.productData[i].lowestBid)+'</span>';
				if(data.productData[i].category!=1){
					htmlProduct +='<span class="split">入数：'+data.productData[i].qty+'</span>';
				}
				htmlProduct +='<span class="split">ロット数：'+data.productData[i].num+'</span>';
				htmlProduct +='</span>';
				htmlProduct +='<div class="afterBid">';
				htmlProduct +='<div class="productAction">';
				htmlProduct +='<a href="#" class="btn btnStatusBid disable btnBid"><span class="statusLabel">入札する</span><div class="timeStart"></div></a>';
				htmlProduct +='<span class="productNote"></span>';
				htmlProduct +='</div>';
				htmlProduct +='</div>';
				htmlProduct +='</li>';
			}
		}

		$('#productList').html(htmlProduct);
	});
	
	socket.on('chkAuctionStatus', function(data){
		if(data.start==1){
			$('#productList li').find('.btnBid').removeClass('disable');
			$('.btnBid').removeClass('pink');
			$('.btnBid').removeClass('blue');
			$('.btnBid').removeClass('red');
		}
	});
	//auction starts
	socket.on('auctionStarts', function(){
		console.log('start');
		$('.btnBid').removeClass('disable');
		$('.btnBid').removeClass('pink');
		$('.btnBid').removeClass('blue');
		$('.btnBid').removeClass('red');
	});
	
	//receive timer
	socket.on('receiveTimer', function(data){
		$('.hours').html(data.hours);
		$('.minutes').html(data.minutes);
		$('.seconds').html(data.seconds);
	});
	
	//bidding
	$('#btnCloseBid').live('click', function(e){
		e.preventDefault();
		$('#productBidding').fadeOut();
	});
	
	$('.btnBid').live('click',function(e){
		if(!$(this).hasClass('disable')){
			e.preventDefault();
			var prodId = $(this).parents('li').attr('data-prodID');
			socket.emit('getProductData',{"prodID": prodId});
		}
	});
	
	socket.on('receiveProductData', function(data){
		var category = "";
		if(data.getProduct.category==0){
			category="fashion";
		}
		else if(data.getProduct.category==1){
			category="accessories";
		}
		else{
			category="antique";
		}
		var productBidding = "";
		productBidding +='<div class="smallModal">';
		productBidding +='<div class="headline blue">';
		productBidding +='<h1 class="left">'+data.getProduct.producer+' '+data.getProduct.prodName+'</h1>';
		productBidding +='<a href="#" class="closeModal" id="btnCloseBid">';
		productBidding +='<div class="icon icon12 i12Clos"></div>';
		productBidding +='</a>';
		productBidding +='</div>';
		productBidding +='<div class="modalContent">';
		productBidding +='<div class="content10">';
		productBidding +='<div class="productThumb">';
		productBidding +='<img src="images/product/'+category+'/'+data.getProduct.imgName+'">';
		productBidding +='</div>';
		productBidding +='</div>';
		productBidding +='<ul class="modalGridList">';
		productBidding +='<li>評価：'+data.getProduct.rating+'</li>';
		productBidding +='<li>最低入札単価：¥'+edtComma(data.getProduct.lowestBid)+'</li>';
		if(data.getProduct.category!=1){
			productBidding +='<li>入数：'+data.getProduct.qty+'</li>';
		}
		productBidding +='<li>ロット数：'+data.getProduct.num+'</li>';
		productBidding +='</ul>';
		productBidding +='<div class="content10">';
		productBidding +='<div class="textfieldContainer mBottom8">';
		productBidding +='<span class="textRed w100p" id="bidMsg" style="display:none;">最低入札単価以上を入札してください。</span>';
		productBidding +='<span class="mBottom8 w70p">入札単価を入力してください</span>';
		productBidding +='<input name="" type="text" class="textCenter small bidInput" id="txtBid">';
		productBidding +='</div>';
		productBidding +='<div class="textfieldContainer mBottom8">';
		productBidding +='<span class="textRed w100p" id="boxMsg" style="display:none;">上場箱数以上を入札できません。</span>';
		
		productBidding +='<input name="" type="hidden" class="textCenter small bidInput" value="'+data.getProduct.qty+'" id="txtQty">';
		
		if(data.getProduct.num==1){
			productBidding +='<span class="mBottom8 w70p">入札ロット</span>';
			productBidding +='<input name="" type="text" class="textCenter small bidInput"  id="txtBox" value="1" disabled>';
		}
		else{
			productBidding +='<span class="mBottom8 w70p">入札ロット数を入力してください</span>';
			productBidding +='<input name="" type="text" class="textCenter small bidInput"  id="txtBox">';
		}
		
		productBidding +='</div>';
		productBidding +='</div>';
		productBidding +='<div class="modalAlone textCenter">';
		productBidding +='合計金額　： <span id="autoCalculate">¥ 0</span>';
		productBidding +='</div>';
		productBidding +='<div class="content10 textCenter">';
		productBidding +='<a href="#" class="btn blue" id="btnSendBid" data-num="'+data.getProduct.num+'" data-lowBid="'+data.getProduct.lowestBid+'" data-pieces="'+data.getProduct.qty+'" data-prodID="'+data.getProduct.prodID+'">入札する</a>';
		productBidding +='</div>';
		productBidding +='</div>';
		productBidding +='</div>';
		
		$('#productBidding').html(productBidding);
		$('#productBidding').fadeIn();
		$('#txtBid').focus();
	});
	
	$(".bidInput").live('keydown', function (e) {
		// Allow: backspace, delete, tab, escape, enter and .
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
			 // Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) || 
			 // Allow: home, end, left, right
			(e.keyCode >= 35 && e.keyCode <= 39)) {
				 // let it happen, don't do anything
				 return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	});

	$('.bidInput').live('keyup', function(){
		var bid = $('#txtBid').val();
		var pieces = $('#txtQty').val();
		var boxes = $('#txtBox').val();
		var autoTotal = 0;
		if(bid !== "" && boxes !== ""){
			autoTotal = parseInt(bid*boxes*pieces);
			$('#autoCalculate').html("¥" +edtComma(autoTotal));
		}
	});
	
	$('#btnSendBid').live('click', function(){
		var prodID = $(this).attr('data-prodID');
		var pieces = $(this).attr('data-pieces');
		var box = $('#txtBox').val();// number of boxes
		var bid = $('#txtBid').val();
		var lowBid = $(this).attr('data-lowBid');
		var num = $(this).attr('data-num');
		
		var dNow = new Date();

		var errorBox=0;
		var errorBid=0;
		if(parseInt(box) > parseInt(num) || box==""){
			$('#boxMsg').show();
			errorBox = 1;
			console.log('box',box,num);
		}
		else{
			$('#boxMsg').hide();
			errorBox = 0;
		}
		
		if(parseInt(lowBid) > parseInt(bid) || bid==""){
			$('#bidMsg').show();
			errorBid = 1;
			console.log('bid',lowBid,bid);
		}
		else{
			$('#bidMsg').hide();
			errorBid=0;
		}
		 if(errorBox==0 && errorBid==0){
			socket.emit('sendBid', {"prodID": prodID, "bidder":userid, "pieces": pieces, "qty":box, "bid":parseInt(bid), "time": dNow, "status": "new", "fromhour": 0});
			
			$('#productList').find('li[data-prodID="'+prodID+'"]').find('.btnBid').addClass('btnBidAfter');
			$('#productList').find('li[data-prodID="'+prodID+'"]').find('.statusLabel').html('入札中');
			$('#productBidding').fadeOut();
			
			$('#productList').find('li[data-prodID="'+prodID+'"]').find('.btnBid').addClass('disable');
		}
	});
	
	//end auction
	var biddedProducts = [];
	socket.on('endAuction', function(data){
		$('.hours').html("00");
		$('.minutes').html("00");
		$('.seconds').html("00");
		$('.btnBid').addClass('disable');
		biddedProducts = [];
		for(var b =0; b<data.biddingData.length; b++){
			if(userid==data.biddingData[b].bidder){
				biddedProducts.push(data.biddingData[b].prodID);
				
				
				var btnClass = "";
				var bid = "";
				var bidBox = "";
				var bidSuccess = "";
				var totalBidAmount = "";
				var bidBtnText = "";
				
				if(data.biddingData[b].status=="successful"){
					btnClass = "green";
					bid = data.biddingData[b].bid;
					bidBox = data.biddingData[b].qty;
					bidSuccess = data.biddingData[b].successfulBid;
					totalBidAmount = data.biddingData[b].subTotal;
					bidBtnText = "落札";
				}
				else if(data.biddingData[b].status=="some"){
					btnClass = "orange";
					bid = data.biddingData[b].bid;
					bidBox = data.biddingData[b].qty;
					bidSuccess = data.biddingData[b].successfulBid;
					totalBidAmount = data.biddingData[b].subTotal;
					bidBtnText = "一部落札";
				}
				else if(data.biddingData[b].status=="fail"){
					btnClass = "red";
					bid = data.biddingData[b].bid;
					bidBox = data.biddingData[b].qty;
					bidSuccess = data.biddingData[b].successfulBid;
					totalBidAmount = data.biddingData[b].subTotal;
					bidBtnText = "他者落札";
				}
				
				$('#productList').find('li[data-prodID="'+data.biddingData[b].prodID+'"]').find('.afterBid').html('<span class="productBidinfo biddedMaxMin"></span><div class="productAction"><a href="#" class="btn btnBid '+btnClass+'">'+
																														'<span>'+bidBtnText+'</span>'+
																														'</a>'+
																														'<span class="productNote">'+
																														'<span>入札単価 ： ¥'+edtComma(bid)+'</span>'+
																														'<span>入札箱数 ： '+bidBox+'</span>'+
																														'<span>落札箱数 ： <span class="textRed">'+bidSuccess+'</span></span>'+								
																														'<span>合計金額 ： ¥'+edtComma(totalBidAmount)+'</span>'+
																														'</span></div>');
			}
			
			
			for(var i=0; i<data.productData.length; i++){
				if(data.productData[i].bidList.length==0){
					data.productData[i].bidList=[0];
				}
				
				if($.inArray(data.productData[i].prodID,biddedProducts)==-1){
					$('#productList').find('li[data-prodID="'+data.productData[i].prodID+'"]').find('.afterBid').html('<span class="productBidinfo">'+
																														'<span>最高落札単価： ¥'+edtComma(Math.max.apply(Math, data.productData[i].bidList))+'</span>'+
																														'<span>最低落札単価: ¥'+edtComma(Math.min.apply(Math, data.productData[i].bidList))+'</span>'+
																														'</span>');
				}
				else{
					$('#productList').find('li[data-prodID="'+data.productData[i].prodID+'"]').find('.afterBid').find('.biddedMaxMin').html('<span>最高落札単価： ¥'+edtComma(Math.max.apply(Math, data.productData[i].bidList))+'</span>'+
																														'<span>最低落札単価: ¥'+edtComma(Math.min.apply(Math, data.productData[i].bidList))+'</span>');
				}
			}
			
		}
		
	});
	
	//messages (chat) ======================
	$('#msgNotification').click(function(){
		socket.emit('getChatDetails');
		$('#messages').fadeIn();
		socket.emit('readMessage', {"to":userid, "from":0});
	});
	
	$('.chatMessage').live('click',function(){
		socket.emit('readMessage', {"to":userid, "from":0});
	});
	
	socket.emit('retrieveMsgCtr', userid);
	socket.on('receiveMsgCtr', function(data){
		var msgCtr = 0;
		for(var m=parseInt(data.length-1); m>=0; m--){
			if(data[m].to==userid){
				if(data[m].status=="Unread"){
					msgCtr++;
				}
			}
		}
		if(msgCtr!=0){
			$('#msgNotification').html('<div class="icon icon46 i46MessaBlue"></div><span>商談</span><div class="notiCicrle">'+msgCtr+'</div>');
		}
	});
	
	socket.on('display_chatDetails', function(data){
		var msgCtr = 0;
		$('#messagesList').html("");
		var chatMessage = "";
		chatMessage+='<div class="chatLine">';
		chatMessage+='<ul class="chatMessage">';
		console.log(data.messages);
		for(var m=parseInt(data.messages.length-1); m>=0; m--){
			
			var bYear = new Date(data.messages[m].sentDate).getFullYear();
			var bMonth = new Date(data.messages[m].sentDate).getMonth()+1;
			var bDay = new Date(data.messages[m].sentDate).getDate();
			var bHour = new Date(data.messages[m].sentDate).getHours();
			var bMinute = new Date(data.messages[m].sentDate).getMinutes();
			if(bHour < 10){
				bHour = "0"+bHour;
			}
			else{
				bHour = bHour;
			}
			if(bMinute < 10){
				bMinute = "0"+bMinute;
			}
			else{
				bMinute = bMinute;
			}
				
			var sentDate = bYear+"/"+bMonth+"/"+bDay+" "+bHour+":"+bMinute;
			
			if(userid==data.messages[m].to || userid==data.messages[m].from){
				if(userid==data.messages[m].from){
					chatMessage+='<li class="me">';
					chatMessage+='<span class="time">';
					chatMessage+='<strong class="status">'+data.messages[m].status+'</strong>';
					chatMessage+=sentDate;
					chatMessage+='</span>';
					chatMessage+='<p>';
					chatMessage+=data.messages[m].message;
					chatMessage+='</p>';
					chatMessage+='</li>';
				}
				else if(userid==data.messages[m].to){
					if(data.messages[m].status=="Unread"){
						msgCtr++;
					}
					chatMessage+='<li class="friend">';
					chatMessage+='<p>';
					chatMessage+=data.messages[m].message;
					chatMessage+='</p>';
					chatMessage+='<span class="time">';
					chatMessage+='<strong class="status">'+data.messages[m].status+'</strong>';
					chatMessage+=sentDate;
					chatMessage+='</span>';
					
					chatMessage+='</li>';
				}
			}
		}
		chatMessage+='</ul>';
		chatMessage+='<div class="chatForm">';
		chatMessage+='<textarea name="" cols="" rows="" placeholder="Message Here" id="chatMsg"></textarea>';
		chatMessage+='<button class="btnSend" id="btnChatSend" data-to="0">Send</button>';
		chatMessage+='</div>';
		chatMessage+='</div>';
		
		$('#messagesList').html(chatMessage);
		$('.chatMessage').scrollTop($('.chatMessage')[0].scrollHeight);
		if(msgCtr!=0){
			$('#msgNotification').html('<div class="icon icon46 i46MessaBlue"></div><span>商談</span><div class="notiCicrle">'+msgCtr+'</div>');
		}
	});
	
	socket.on('updateMsgCtr', function(data){
		var ctr = 0;
		for(var m =0; m<data.length; m++){
			if(userid==data[m].to){
				if(data[m].status=="Unread"){
						ctr++;
				}
			}
			if(ctr!=0){
				$('#msgNotification').html('<div class="icon icon46 i46MessaBlue"></div><span>商談</span><div class="notiCicrle">'+ctr+'</div>');
			}
			else{
				$('#msgNotification').html('<div class="icon icon46 i46MessaBlue"></div><span>商談</span>');
			}
		}
	});
	
	$('#closeMessagePop').click(function(){
		$('#messages').fadeOut();
	});
	
	$('#btnChatSend').live('click', function(){
		var getClientId = $(this).attr('data-to');
		var message = $('#chatMsg').val();
		var dNow = new Date();
		
		socket.emit('sendMessage', {"to": getClientId, "from": userid, "message": message, "sentDate":dNow, "status": "Unread"});
	});
	//======================================
	
	//notification
	socket.emit('retrieve_notification');
	socket.on('recieve_notification', function(data){
		var notifications = "";
		for(var n=parseInt(data.length-1); n>=0; n--){
			var nDate = data[n].notiDate.split(' ');
			var datenoti = nDate[0].split('/');
			var timenoti = nDate[1].split(':');
			notifications +='<li>';
			notifications +='<a href="#">';
			notifications +='<div class="timeDate listShadeLine">';
			notifications +='<span class="date">'+datenoti[0]+'年 '+datenoti[1]+'月 '+datenoti[2]+'日</span>';
			notifications +='<span class="time">'+timenoti[0]+':'+timenoti[1]+'</span>';
			notifications +='</div>';
			notifications +='<div class="scheduleTitle">'+data[n].notification.substring(0,100)+'</div>';
			notifications +='</a>';
			notifications +='</li>';
		}
		
		$('#notifications').html(notifications);
	});
	
});