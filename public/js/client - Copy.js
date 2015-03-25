var socket = io.connect(socketUrl);
$(function(){
	var get=getRequest();
	var userid=get["userid"];
	socket.emit('retrieveBidderData', {"id": userid});
	socket.on('recieveBidder', function(data){
		$('#username').html(data);
	});;
	
	socket.emit('retrieve_product');
	socket.on('receive_product', function(data){
		var htmlProduct="";
		for(var i=0; i<data.productData.length; i++){
			htmlProduct +='<li data-prodID="'+data.productData[i].prodID+'">';
			htmlProduct +='<div class="productThumb">';
			htmlProduct +='<img src="images/product/'+data.productData[i].imgName+'">';
			htmlProduct +='</div>';
			htmlProduct +='<strong class="productTitle">'+data.productData[i].producer+' '+data.productData[i].prodName+'</strong>';
			htmlProduct +='<span class="productQty">';
			htmlProduct +='<span>評価：'+data.productData[i].rating+'</span>';
			htmlProduct +='<span>最低入札単価：¥'+edtComma(data.productData[i].lowestBid)+'</span>';
			htmlProduct +='<span class="split">入数：'+data.productData[i].qty+'</span>';
			htmlProduct +='<span class="split">上場箱数：'+data.productData[i].num+'</span>';
			htmlProduct +='</span>';
			htmlProduct +='<div class="afterBid">';
			htmlProduct +='<div class="productAction">';
			htmlProduct +='<a href="#" class="btn btnStatusBid disable btnBid"><span class="statusLabel">入札する</span><div class="timeStart"></div></a>';
			htmlProduct +='<span class="productNote"></span>';
			htmlProduct +='</div>';
			htmlProduct +='</div>';
			htmlProduct +='</li>';
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
	$('#btnCloseBid').live('click', function(){
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
		var productBidding = "";
		productBidding +='<div class="smallModal">';
		productBidding +='<div class="headline blue">';
		productBidding +='<h1 class="left">'+data.getProduct.prodName+'</h1>';
		productBidding +='<a href="#" class="closeModal" id="btnCloseBid">';
		productBidding +='<div class="icon icon12 i12Clos"></div>';
		productBidding +='</a>';
		productBidding +='</div>';
		productBidding +='<div class="modalContent">';
		productBidding +='<div class="content10">';
		productBidding +='<div class="productThumb">';
		productBidding +='<img src="images/product/'+data.getProduct.imgName+'">';
		productBidding +='</div>';
		productBidding +='</div>';
		productBidding +='<ul class="modalGridList">';
		productBidding +='<li>評価：'+data.getProduct.rating+'</li>';
		productBidding +='<li>最低入札単価：¥'+edtComma(data.getProduct.lowestBid)+'</li>';
		productBidding +='<li>入数：'+data.getProduct.qty+'</li>';
		productBidding +='<li>上場箱数：'+data.getProduct.num+'</li>';
		productBidding +='</ul>';
		productBidding +='<div class="content10">';
		productBidding +='<div class="textfieldContainer mBottom8">';
		productBidding +='<span class="mBottom8 w60p">入札単価を入力してください</span>';
		productBidding +='<input name="" type="text" class="textCenter small bidInput" id="txtBid">';
		productBidding +='</div>';
		productBidding +='<div class="textfieldContainer mBottom8">';
		productBidding +='<span class="mBottom8 w60p">入札箱数を入力してください</span>';
		productBidding +='<input name="" type="hidden" class="textCenter small bidInput" value="'+data.getProduct.qty+'" id="txtQty">';
		productBidding +='<input name="" type="text" class="textCenter small bidInput"  id="txtBox">';
		productBidding +='</div>';
		productBidding +='</div>';
		productBidding +='<div class="modalAlone textCenter">';
		productBidding +='合計金額　： <span id="autoCalculate">¥ 0</span>';
		productBidding +='</div>';
		productBidding +='<div class="content10 textCenter">';
		productBidding +='<a href="#" class="btn blue" id="btnSendBid" data-pieces="'+data.getProduct.qty+'" data-prodID="'+data.getProduct.prodID+'">入札する</a>';
		productBidding +='</div>';
		productBidding +='</div>';
		productBidding +='</div>';
		
		$('#productBidding').html(productBidding);
		$('#productBidding').fadeIn();
		$('#txtBid').focus();
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
		var dNow = new Date();
		var bidTime= dNow.getHours() + ':' + dNow.getMinutes() + ':' + dNow.getSeconds();
		
		socket.emit('sendBid', {"prodID": prodID, "bidder":userid, "pieces": pieces, "qty":box, "bid":bid, "time": bidTime});
		
		$('#productList').find('li[data-prodID="'+prodID+'"]').find('.btnBid').addClass('btnBidAfter');
		$('#productList').find('li[data-prodID="'+prodID+'"]').find('.statusLabel').html('入札中');
		$('#productBidding').fadeOut();
		
		$('#productList').find('li[data-prodID="'+prodID+'"]').find('.btnBid').addClass('disable');
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
				if(data.biddingData[b].status=="successful"){
					btnClass = "green";
					bid = data.biddingData[b].bid;
					bidBox = data.biddingData[b].qty;
					bidSuccess = data.biddingData[b].successfulBid;
					totalBidAmount = data.biddingData[b].subTotal;
				}
				else if(data.biddingData[b].status=="some"){
					btnClass = "orange";
					bid = data.biddingData[b].bid;
					bidBox = data.biddingData[b].qty;
					bidSuccess = data.biddingData[b].successfulBid;
					totalBidAmount = data.biddingData[b].subTotal;
				}
				else if(data.biddingData[b].status=="fail"){
					btnClass = "red";
					bid = data.biddingData[b].bid;
					bidBox = data.biddingData[b].qty;
					bidSuccess = data.biddingData[b].successfulBid;
					totalBidAmount = data.biddingData[b].subTotal;
				}
				
				$('#productList').find('li[data-prodID="'+data.biddingData[b].prodID+'"]').find('.afterBid').html('<span class="productBidinfo biddedMaxMin"></span><div class="productAction"><a href="#" class="btn btnBid '+btnClass+'">'+
																														'<span>落札</span>'+
																														'</a>'+
																														'<span class="productNote">'+
																														'<span>入札単価 ： ¥'+edtComma(bid)+'</span>'+
																														'<span>入札箱数 ： '+bidBox+'</span>'+
																														'<span>落札箱数 ： <span class="textRed">'+bidSuccess+'</span></span>'+								
																														'<span>合計金額 ： ¥'+edtComma(totalBidAmount)+'</span>'+
																														'</span></div>');	
			
			
			
			
			
			}
			
			
			for(var i=0; i<data.productData.length; i++){
				var maxminBid = [];
				for(var c=0; c<data.biddingData.length; c++){
					if(data.productData[i].prodID==data.biddingData[c].prodID){
						maxminBid.push(data.biddingData[c].bid);
						console.log(data.biddingData[c].prodID);
					}
					else{
						maxminBid.push(0);
					}
				}
				console.log(maxminBid);
				if($.inArray(data.productData[i].prodID,biddedProducts)==-1){
					$('#productList').find('li[data-prodID="'+data.productData[i].prodID+'"]').find('.afterBid').html('<span class="productBidinfo">'+
																														'<span>最高落札単価： ¥'+edtComma(Math.max.apply(Math, maxminBid))+'</span>'+
																														'<span>最低落札単価: ¥'+edtComma(Math.min.apply(Math, maxminBid))+'</span>'+
																														'</span>');
				}
				else{
					$('#productList').find('li[data-prodID="'+data.productData[i].prodID+'"]').find('.afterBid').find('.biddedMaxMin').html('<span>最高落札単価： ¥'+edtComma(Math.max.apply(Math, maxminBid))+'</span>'+
																														'<span>最低落札単価: ¥'+edtComma(Math.min.apply(Math, maxminBid))+'</span>');
				}
			}
			
		}
		
	});
	
	//messages (chat) ======================
	$('#msgNotification').click(function(){
		socket.emit('getChatDetails');
		$('#messages').fadeIn();
	});
	
	socket.on('display_chatDetails', function(data){
		$('#messagesList').html("");
		var chatMessage = "";
		chatMessage+='<div class="chatLine">';
		chatMessage+='<ul class="chatMessage">';
		for(var m =0; m<data.messages.length; m++){
			if(userid==data.messages[m].to || userid==data.messages[m].from){
				if(userid==data.messages[m].from){
					chatMessage+='<li class="me">';
					chatMessage+='<p>';
					chatMessage+=data.messages[m].message;
					chatMessage+='</p>';
					chatMessage+='<span class="time">';
					chatMessage+='<strong class="status">Read</strong>';
					chatMessage+=data.messages[m].sentDate;
					chatMessage+='</span>';
					chatMessage+='</li>';
				}
				else if(userid==data.messages[m].to){
					chatMessage+='<li class="friend">';
					chatMessage+='<span class="time">';
					chatMessage+='<strong class="status">Read</strong>';
					chatMessage+=data.messages[m].sentDate;
					chatMessage+='</span>';
					chatMessage+='<p>';
					chatMessage+=data.messages[m].message;
					chatMessage+='</p>';
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
	});
	
	$('#closeMessagePop').click(function(){
		$('#messages').fadeOut();
	});
	
	$('#btnChatSend').live('click', function(){
		var getClientId = $(this).attr('data-to');
		var message = $('#chatMsg').val();
		var dNow = new Date();
		var localdate= dNow.getFullYear() + '/' + (dNow.getMonth()+1) + '/' + dNow.getDate() + ' ' + dNow.getHours() + ':' + dNow.getMinutes();
		
		socket.emit('sendMessage', {"to": getClientId, "from": userid, "message": message, "sentDate":localdate});
	});
	//======================================
});