var socket = io.connect(socketUrl);
$(function(){
	var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'sound/1.mp3');
	//rearrange display
	 $(".mainContent" ).sortable({
		revert: 300,
		delay: 100,
		opacity: 0.8,
		handle: ".draggableContent",
    });
	
	socket.on('chkAuctionStatus', function(data){
		if(data.start==1){
			$('#btnStart').addClass('disable');
			$('#btnEnd').removeClass('disable');
			console.log(data.onehour);
			if(data.onehour==1){
				$('#btnHour').addClass('disable');
			}
			else{
				$('#btnHour').removeClass('disable');
			}
		}
		
	});
	
	//category tabs
	$('#categoryTabLink li').click(function(){
		$('#categoryTabLink li').removeClass('active');
		$(this).addClass('active');
		var getCat = $(this).attr('data-cat');
		displayProducts(getCat);
	});
	
	//auction starts
	socket.on('auctionStarts', function(){
		console.log('start');
		$('#btnStart').addClass('disable');
		$('#btnEnd').removeClass('disable');
		$('#btnHour').removeClass('disable');
	});
	
	//btn noti
	$('#btnNoti').click(function(){
		$('#noti').fadeIn();
	});
	
	$('#closeNoti').click(function(){
		$('#noti').fadeOut();
	});
	
	$('#btnSendNoti').click(function(){
		var notiMessage = $('#txtNoti').val();
		var noti = new Date();
		var bHour = noti.getHours();
		var bMinute = noti.getMinutes();
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
		
		var notiDate= noti.getFullYear() + '/' + (noti.getMonth()+1) + '/' + noti.getDate() + ' ' + bHour + ':' + bMinute;
		
		console.log(notiMessage);
		if(notiMessage!=""){
			socket.emit('send_notification', {"notification": notiMessage, "notiDate": notiDate});
			$('#noti').fadeOut();
		}
	});
	
	//receive timer
	socket.on('receiveTimer', function(data){
		$('.hours').html(data.hours);
		$('.minutes').html(data.minutes);
		$('.seconds').html(data.seconds);
	});
	
	//btnHour
	$('#btnHour').click(function(){
		if(!$(this).hasClass('disable')){
			$(this).addClass('disable');
			socket.emit('onehour');
			var defaultOneHourData = [
									//company 7
									{"prodID": "1", "bidder":"7", "pieces": "40", "qty":"5", "bid":"1100", "minustime":5},
									{"prodID": "2", "bidder":"7", "pieces": "30", "qty":"28", "bid":"5000", "minustime":5},
									{"prodID": "5", "bidder":"7", "pieces": "20", "qty":"15", "bid":"6300", "minustime":5},
									
									//company 8
									{"prodID": "1", "bidder":"8", "pieces": "40", "qty":"15", "bid":"1200", "minustime":3},
									{"prodID": "2", "bidder":"8", "pieces": "30", "qty":"5", "bid":"3300", "minustime":3},
									{"prodID": "11", "bidder":"8", "pieces": "20", "qty":"3", "bid":"25000", "minustime":3},
									
									//company 9
									{"prodID": "1", "bidder":"9", "pieces": "40", "qty":"25", "bid":"1300", "minustime":2},
									{"prodID": "5", "bidder":"9", "pieces": "20", "qty":"15", "bid":"6300", "minustime":2},
									
									//company 10
									{"prodID": "1", "bidder":"10", "pieces": "40", "qty":"3", "bid":"1400", "minustime":1},
									{"prodID": "5", "bidder":"10", "pieces": "20", "qty":"15", "bid":"6800", "minustime":1},
									{"prodID": "15", "bidder":"10", "pieces": "1", "qty":"1", "bid":"355000", "minustime":1},
									
							];
								
			for(var h=0; h<defaultOneHourData.length; h++){
				var curTime = new Date(new Date().getTime() - (defaultOneHourData[h].minustime * 60 * 1000));
			
				socket.emit('sendBid', {"prodID": defaultOneHourData[h].prodID, "bidder":defaultOneHourData[h].bidder, "pieces": defaultOneHourData[h].pieces, "qty":defaultOneHourData[h].qty, "bid":defaultOneHourData[h].bid, "time": curTime, "status": "old", "fromhour": 1});
			}
		}
		
	});
	
	//retrieve products
	displayProducts('');
	
	function displayProducts(cat){
		socket.emit('retrieve_product', {"cat": cat});
	}
	
	socket.on('receive_product', function(data){
		var htmlProduct="";
		var greenred = "";
		for(var i=0; i<data.productData.length; i++){
			if(data.cat==data.productData[i].category || data.cat==""){
				htmlProduct +='<li data-prodID="'+data.productData[i].prodID+'">';
				htmlProduct +='<div class="textLeft">'+data.productData[i].prodName+'</div>';
				htmlProduct +='<div class="textLeft">'+data.productData[i].producer+'</div>';
				htmlProduct +='<div class="textRight">'+data.productData[i].rating+'</div>';
				htmlProduct +='<div class="textRight">¥'+edtComma(data.productData[i].lowestBid)+'</div>';
				htmlProduct +='<div class="textRight">'+data.productData[i].qty+'</div>';
				htmlProduct +='<div class="textRight">'+data.productData[i].num+'</div>';
				htmlProduct +='<div class="textRight totalBid">'+data.productData[i].bidNum+'</div>';
				console.log(data.onehour);
				if(data.onehour==1){
					if(data.productData[i].status==1){
						greenred = "red";
						$('#'+data.productData[i].prodID).find('.soldRate').addClass('red');
						$('#'+data.productData[i].prodID).find('.soldRate').removeClass('green');
					}
					else if(data.productData[i].status==2){
						greenred = "green";
						$('#'+data.productData[i].prodID).find('.soldRate').addClass('green');
						$('#'+data.productData[i].prodID).find('.soldRate').removeClass('red');
					}
					else{
						greenred = "";
					}
				}
				
				htmlProduct +='<div class="textRight successBid '+greenred+'">'+data.productData[i].highestBidBox+'</div>';
				htmlProduct +='<div class="textRight soldRate '+greenred+'">'+data.productData[i].soldRate+'%</div>';
				
				htmlProduct +='<div class="textRight bidderNum">'+data.productData[i].bidderNum+'</div>';
				htmlProduct +='<div class="textRight totalAmount">¥'+edtComma(data.productData[i].successBidTotal)+'</div>';
				htmlProduct +='</li>';
			}
		}
		$('#productList').html(htmlProduct);
		
	});
	//display product details
	$('#productList li').live('click', function(){
		var prodID = $(this).attr('data-prodID');
		socket.emit('getProductDetail', {"prodID":prodID});
	});
	
	socket.on('receiveProductDetail', function(data){
		var prodContent = "";
		
		prodContent +=' <div class="prodDetails overlay transparent" id="'+data.getProduct.prodID+'">';
		prodContent +=' <div class="mediumModal">';
		prodContent +=' <div class="headline blue prodHead">';
		prodContent +=' <h1 class="left">商品詳細情報</h1>';
		prodContent +=' <a href="#" class="closeModal closeProdDetails" data-id="'+data.getProduct.prodID+'">';
		prodContent +=' <div class="icon icon12 i12Clos"></div>';
		prodContent +=' </a>';
		prodContent +=' </div>';
		prodContent +=' <div class="modalContent">';
		prodContent +=' <div class="content10">';
		prodContent +=' <section class="fl w100p">';
		prodContent +=' <div class="fl w50p">';
		prodContent +=' <ul class="table header noHover">';
		prodContent +=' <li>';
		prodContent +=' <div>商品名</div>';
		prodContent +=' <div>商品ID</div>';
		prodContent +=' </li>';
		prodContent +=' </ul>';
		prodContent +=' <ul class="table light mBottom8 noHover">';
		prodContent +=' <li>';
		prodContent +=' <div>'+data.getProduct.prodName+'</div>';
		prodContent +=' <div class="textLeft">'+data.getProduct.prodID+'</div>';
		prodContent +=' </li>';
		prodContent +=' </ul>';
		prodContent +=' </div>';
		prodContent +=' </section>';
		prodContent +=' <section class="fl w100p">';
		prodContent +=' <div class="fl w50p">';
		prodContent +=' <ul class="table header noHover">';
		prodContent +=' <li>';
		prodContent +=' <div>メーカー</div>';
		prodContent +=' </li>';
		prodContent +=' </ul>';
		prodContent +=' <ul class="table light mBottom8 noHover">';
		prodContent +=' <li>';
		prodContent +=' <div>'+data.getProduct.producer+'</div>';
		prodContent +=' </li>';
		prodContent +=' </ul>';
		prodContent +=' </div>';
		prodContent +=' <div class="fl w50p pLeft50p">';
		prodContent +=' <ul class="table header noHover">';
		prodContent +=' <li>';
		prodContent +=' <div>完売率</div>';
		prodContent +=' </li>';
		prodContent +=' </ul>';
		
		prodContent +=' <ul class="table light mBottom8 noHover">';
		prodContent +=' <li>';
		var greenred = "";
		if(data.onehour==1){
			if(data.getProduct.status==1){
				greenred = "red";
			}
			else if(data.getProduct.status==2){
				greenred = "green";
			}
			else{
				greenred = "";
			}
		}
		prodContent +=' <div class="textRight soldRate '+greenred+'">'+data.getProduct.soldRate+'%</div>';
		prodContent +=' </li>';
		prodContent +=' </ul>';
		prodContent +=' </div>';
		prodContent +=' </section>';
		prodContent +=' <section class="fl w100p">';
		prodContent +=' <div class="fl w75p pRight10">';
		prodContent +=' <ul class="table header noHover">';
		prodContent +=' <li>';
		prodContent +=' <div>評価</div>';
		prodContent +=' <div>入数</div>';
		prodContent +=' <div>最低入札単価</div>';
		prodContent +=' <div>ロット数</div>';
		prodContent +=' <div>落札可能数計</div>';
		prodContent +=' </li>';
		prodContent +=' </ul>';
		
		prodContent +=' <ul class="table light mBottom8 noHover">';
		prodContent +=' <li>';
		prodContent +=' <div class="textRight">'+data.getProduct.rating+'</div>';
		prodContent +=' <div class="textRight">'+data.getProduct.qty+'</div>';
		prodContent +=' <div class="textRight">¥'+edtComma(data.getProduct.lowestBid)+'</div>';
		prodContent +=' <div class="textRight">'+data.getProduct.num+'</div>';
		prodContent +=' <div class="textRight successBid '+greenred+'">'+data.getProduct.highestBidBox+'</div>';
		prodContent +=' </li>';
		prodContent +=' </ul>';
		prodContent +=' </div>';
		prodContent +=' <div class="fl w25p">';
		prodContent +=' <ul class="table header noHover">';
		prodContent +=' <li>';
		prodContent +=' <div>落札合計金額</div>';
		prodContent +=' </li>';
		prodContent +=' </ul>';
		
		prodContent +=' <ul class="table light mBottom8 noHover">';
		prodContent +=' <li>';
		prodContent +=' <div class="textRight totalAmount">¥'+edtComma(data.getProduct.successBidTotal)+'</div>';
		prodContent +=' </li>';
		prodContent +=' </ul>';
		prodContent +=' </div>';
		prodContent +=' </section>';
		
		prodContent +=' <ul class="table col6 header noHover">';
		prodContent +=' <li>';
		prodContent +=' <div>入札者</div>';
		prodContent +=' <div>入札単価</div>';
		prodContent +=' <div>入札ロット数</div>';
		prodContent +=' <div>落札可能数</div>';
		prodContent +=' <div>入札時刻</div>';
		prodContent +=' <div>金額</div>';
		prodContent +=' </li>';
		prodContent +=' </ul>';
		
		prodContent +=' <ul class="table light col6 noHover biddingData">';
		
		for(var b=0; b<data.biddingData.length; b++){
			if(data.getProduct.prodID==data.biddingData[b].prodID){
				for(var n=0; n<data.bidderData.length; n++){
					if(data.biddingData[b].bidder==data.bidderData[n].id){
						var bidderName = data.bidderData[n].name;
						console.log('a',bidderName);
					}
				}
				
				var remarks = "";
				if(data.biddingData[b].qty==data.biddingData[b].successfulBid){
					remarks = "green";
				}
				else if(data.biddingData[b].qty>data.biddingData[b].successfulBid && data.biddingData[b].successfulBid!=0){
					remarks = "yellow";
				}
				
				var bHour = new Date(data.biddingData[b].time).getHours();
				var bMinute = new Date(data.biddingData[b].time).getMinutes();
				var bSeconds = new Date(data.biddingData[b].time).getSeconds();
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
				if(bSeconds < 10){
					bSeconds = "0"+bSeconds;
				}
				else{
					bSeconds = bSeconds;
				}
				
				var getCurTime = bHour +":"+ bMinute +":"+ bSeconds;
				
				prodContent +=' <li class="'+remarks+'">';
				prodContent +=' <div>'+bidderName+'</div>';
				prodContent +=' <div class="textRight">¥'+edtComma(data.biddingData[b].bid)+'</div> ';
				prodContent +=' <div class="textRight">'+data.biddingData[b].qty+'</div>    ';
				prodContent +=' <div class="textRight">'+data.biddingData[b].successfulBid+'</div>';
				prodContent +=' <div class="textRight">'+getCurTime+'</div>';
				prodContent +=' <div class="textRight">¥'+edtComma(data.biddingData[b].subTotal);+'</div>';
				prodContent +=' </li>';
			}
		}
		prodContent +=' </ul>';
		prodContent +=' </div>';
		prodContent +=' </div>';
		prodContent +=' </div>';
		prodContent +=' </div>';
		
		if($('.bodyWrapper').find('#'+data.getProduct.prodID).length==0){
			$('.bodyWrapper').append(prodContent);
			$('#'+data.getProduct.prodID).fadeIn().draggable();
		}
		
	});
	
	$('.closeProdDetails').live('click',function(){
		var getId = $(this).attr('data-id');
		$('#'+getId).remove();
		$('#'+getId).fadeOut();
	});
	
	//start bidding
	$('#btnStart').click(function(){
		if(!$(this).hasClass('disable')){
			$(this).addClass('disable'); 
			$('#btnEnd').removeClass('disable');
			socket.emit('startAuction');
		}
	});
	
	//receive bidding
	socket.on('receive_bid', function(data){
		var totalBid = 0;
		var bidderNum = 0;
		var successBid = 0;
		var soldRate = 0;
		var totalAmount = 0;
		var numBox = 0;
		var status = "";
		for(var i=0; i<data.productData.length; i++){
			if(data.prodID==data.productData[i].prodID){
				totalBid = data.productData[i].bidNum;
				bidderNum = data.productData[i].bidderNum;
				successBid = data.productData[i].highestBidBox;
				soldRate = data.productData[i].soldRate;
				totalAmount = data.productData[i].successBidTotal;
				numBox = data.productData[i].num;
				status = data.productData[i].status;
			}
		}
		
		if(data.fromhour==0){
			$('#productList').find('li[data-prodID="'+data.prodID+'"]').addClass('highlightedAnimate');
		}
		$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.totalBid').html(totalBid);
		$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.bidderNum').html(bidderNum);
		$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.successBid').html(successBid);
		$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.soldRate').html(soldRate+"%");
		$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.totalAmount').html("¥"+edtComma(totalAmount));
		if(data.onehour==1){
			if(status==1){
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.successBid').addClass('red');
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.soldRate').addClass('red');
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.successBid').removeClass('green');
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.soldRate').removeClass('green');
				
				$('#'+data.prodID).find('.soldRate').addClass('red');
				$('#'+data.prodID).find('.soldRate').removeClass('green');
			}
			else if(status==2){
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.successBid').removeClass('red');
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.soldRate').removeClass('red');
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.successBid').addClass('green');
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.soldRate').addClass('green');
				
				$('#'+data.prodID).find('.soldRate').removeClass('red');
				$('#'+data.prodID).find('.soldRate').addClass('green');
			}
			else{
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.successBid').removeClass('red');
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.soldRate').removeClass('red');
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.successBid').removeClass('green');
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').find('.soldRate').removeClass('green');
				
				$('#'+data.prodID).find('.soldRate').removeClass('red');
				$('#'+data.prodID).find('.soldRate').removeClass('green');
			}
		}
		
		//update product detail
		$('#'+data.prodID).find('.soldRate').html(soldRate+"%");
		$('#'+data.prodID).find('.successBid').html(successBid);
		$('#'+data.prodID).find('.totalAmount').html("¥"+edtComma(totalAmount));
		var bidList = "";
		

		for(var e=0; e<data.biddingData.length; e++){
			for(var n=0; n<data.bidderData.length; n++){
				if(data.biddingData[e].bidder==data.bidderData[n].id){
					var bidderName = data.bidderData[n].name;
				}
			}
			if(data.prodID==data.biddingData[e].prodID){
				$('#'+data.biddingData[e].prodID).find('.biddingData').html("");
				
				var remarks = "";
				if(data.biddingData[e].qty==data.biddingData[e].successfulBid){
					remarks = "green";
				}
				else if(data.biddingData[e].qty>data.biddingData[e].successfulBid && data.biddingData[e].successfulBid!=0){
					remarks = "yellow";
				}
				
				var bHour = new Date(data.biddingData[e].time).getHours();
				var bMinute = new Date(data.biddingData[e].time).getMinutes();
				var bSeconds = new Date(data.biddingData[e].time).getSeconds();
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
				if(bSeconds < 10){
					bSeconds = "0"+bSeconds;
				}
				else{
					bSeconds = bSeconds;
				}
				
				var getCurTime = bHour +":"+ bMinute +":"+ bSeconds;
				
				bidList +=' <li class="'+remarks+' '+data.biddingData[e].status+'">';
				bidList +=' <div>'+bidderName+'</div>';
				bidList +=' <div class="textRight">¥'+edtComma(data.biddingData[e].bid)+'</div> ';
				bidList +=' <div class="textRight">'+data.biddingData[e].qty+'</div>    ';
				bidList +=' <div class="textRight">'+data.biddingData[e].successfulBid+'</div>';
				bidList +=' <div class="textRight">'+getCurTime+'</div>';
				bidList +=' <div class="textRight">¥'+edtComma(data.biddingData[e].subTotal)+'</div>';
				bidList +=' </li>';
				$('#'+data.prodID).find('.biddingData').html(bidList);
			}
		}
		
		if(data.fromhour==0){
			$('#'+data.prodID).find('.biddingData').find('li.new').addClass('highlightedAnimate');
			setTimeout(function(){
				$('#'+data.prodID).find('.biddingData').find('li.new').removeClass('highlightedAnimate');
			},3000);
		
			audioElement.play();
			setTimeout(function(){
				$('#productList').find('li[data-prodID="'+data.prodID+'"]').removeClass('highlightedAnimate');
			},3000);
		}
		
	});
	
	//end auction
	$('#btnEnd').click(function(){
		$('#btnStart').removeClass('disable');
		$(this).addClass('disable');
		socket.emit('stopAuction');
	});
	
	socket.on('endAuction', function(data){
		$('#btnStart').removeClass('disable');
		$('#btnEnd').addClass('disable');
		$('#btnHour').addClass('disable');
		$('.prodDetails').remove();
		$('.hours').html("00");
		$('.minutes').html("00");
		$('.seconds').html("00");
	});
	
	//messaging (chat) ===================
	var tab = 0;
	//retrieve clients
	$('.tabNew').click(function(){
		socket.emit('retrieve_client');
		$('.tabHistory').removeClass('active');
		$('.tabNew').addClass('active');
		tab = 1;
	});
	
	socket.on('receive_client', function(data){
		var clientList = "";
		for(var c=0; c<data.client.length; c++){
			clientList +='<li data-client="'+data.client[c].id+'">';
			clientList +='<a href="#">';
			clientList +='<div class="listBlueHead">';
			clientList +='<strong class="listBlueTitle">'+data.client[c].name+'</strong>';
			clientList +='</div>';
			clientList +='</a>';
			clientList +='</li>';
		}
		
		$('#messageList').html(clientList);
	});
	
	//retrieve chat history
	socket.emit('retrieve_history');
	$('.tabHistory').click(function(){
		socket.emit('retrieve_history');
		$('.tabHistory').addClass('active');
		$('.tabNew').removeClass('active');
		console.log('history');
		messageHistory = [];
		tab = 0;
	});
	
	var messageHistory = [];
	socket.on('receive_history', function(data){
			if(tab==0){
				$('#messageList').html("");
				messageHistory = [];
				var historyList = "";
				var msgCtr = 0;
				for(var m=parseInt(data.messages.length-1); m>=0; m--){
					if(data.messages[m].to==0){
						
						var bidderName = "";
						for(var b=0; b<data.bidder.length; b++){
							if(data.messages[m].from==data.bidder[b].id){
								bidderName = data.bidder[b].name;
							}
						}
					
						var bYear = new Date(data.messages[m].sentDate).getFullYear();
						var bMonth = parseInt(new Date(data.messages[m].sentDate).getMonth()+1);
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
						
							if($.inArray(data.messages[m].from,messageHistory)==-1){
								
								messageHistory.push(data.messages[m].from);
								var curClientId = localStorage.getItem('clientId');
								var class_active = "";
								if(curClientId==data.messages[m].from){
									class_active = "active";
									socket.emit('getChatDetails');
								}
								else{
									 class_active = "";
								}
								$('#messageList').append('<li data-client="'+data.messages[m].from+'" class="'+class_active+'">'
														+'<a href="#">'
														+'<div class="listBlueHead">'
														+'<strong class="listBlueTitle">'+bidderName+'</strong>'
														+'<span class="listBlueDate">'+sentDate+'</span>'
														+'</div>'
														+'<span class="listBlueDetails">'+data.messages[m].message.substring(0,30)+'</span>'
														+'<div class="chatCtr"><strong class="listAlert" style="display:none">0</strong></div>'
														+'</a>'
														+'</li>');
							}
							else{
								$('#messageList').find('li[data-client="'+data.messages[m].from+'"]').find('.listBlueDate').html(sentDate);
								$('#messageList').find('li[data-client="'+data.messages[m].from+'"]').find('.listBlueDetails').html(data.messages[m].message.substring(0,30));
							}
						
						
						if(data.messages[m].status=="Unread"){
							msgCtr++;
							var indCtr = $('#messageList').find('li[data-client="'+data.messages[m].from+'"]').find('.chatCtr').find('.listAlert').html();
							$('#messageList').find('li[data-client="'+data.messages[m].from+'"]').find('.chatCtr').find('.listAlert').html(parseInt(indCtr)+1).show();
							console.log(data.messages[m].from);
						}
						
					}
				
				if(msgCtr!=0){
					$('#msgNoti').html('<div class="icon icon46 i46Messa"></div><span>商談</span><div class="notiCicrle">'+msgCtr+'</div>');
				}
				else{
					$('#msgNoti').html('<div class="icon icon46 i46Messa"></div><span>商談</span>');
				}
			}
		}
	});
	
	//====================================
	socket.emit('retrieveMsgCtr', 0);
	socket.on('receiveMsgCtr', function(data){
		var msgCtr = 0;
		for(var m=parseInt(data.length-1); m>=0; m--){
			if(data[m].to==0){
				if(data[m].status=="Unread"){
					msgCtr++;
				}
			}
		}
		if(msgCtr!=0){
			$('#msgNoti').html('<div class="icon icon46 i46Messa"></div><span>商談</span><div class="notiCicrle">'+msgCtr+'</div>');
		}
	});
	
	$('#msgNoti').click(function(){
		socket.emit('readMessage', 0);
	});
	
	$('#messageList li').live('click', function(){
		$('#messageList li').removeClass('active');
		$(this).addClass('active');
		var clientId = $(this).attr('data-client');
		localStorage.setItem('clientId',clientId);
		socket.emit('getChatDetails');
		socket.emit('readMessage', {"to":0, "from": clientId});
	});
	
	socket.on('display_chatDetails', function(data){
		var chat_details = "";
		var curClientId = localStorage.getItem('clientId');
		$('#messageDetails').html("");
		for(var b=0; b<data.bidder.length; b++){
			if(curClientId==data.bidder[b].id){
				chat_details+='<section class="articleHeader">';
				chat_details+='<div class="listWhiteDetails">';
				chat_details+='<strong>'+data.bidder[b].name+'</strong>';
				chat_details+='<span>相対取引数：'+data.bidder[b].numTrades+'</span>';
				chat_details+='<span>入札数：'+data.bidder[b].numBids+'</span>';
				chat_details+='<span>電話番号：'+data.bidder[b].phone+'</span>';
				chat_details+='</div>';
				chat_details+='<div class="listWhiteButton">';
				chat_details+='<a href="#">';
				chat_details+='<div class="icon icon32 i32Profi"></div>';
				chat_details+='<span>仲買データ</span>';
				chat_details+='</a>';
				chat_details+='</div>';
				chat_details+='</section>';
			}
		}
		
		chat_details+='<section class="content">';
		chat_details+='<div class="chatLine">';
		chat_details+='<ul class="chatMessage">';
		for(var m=parseInt(data.messages.length-1); m>=0; m--){
			var bYear = new Date(data.messages[m].sentDate).getFullYear();
			var bMonth = parseInt(new Date(data.messages[m].sentDate).getMonth()+1);
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
			
			if(curClientId==data.messages[m].to || curClientId==data.messages[m].from){
				if(0==data.messages[m].from){
					chat_details+='<li class="me">';
					chat_details+='<span class="time">';
					chat_details+='<strong class="status">'+data.messages[m].status+'</strong>';
					chat_details+=sentDate;
					chat_details+='</span>';
					chat_details+='<p>'+data.messages[m].message+'</p>';
					chat_details+='</li>';
				}
				else if(0==data.messages[m].to){
					chat_details+='<li class="friend">';
					chat_details+='<p>'+data.messages[m].message+'</p>';
					chat_details+='<span class="time">';
					chat_details+='<strong class="status">'+data.messages[m].status+'</strong>';
					chat_details+=sentDate;
					chat_details+='</span>';
					chat_details+='</li>';
				}
			}
		}
		chat_details+='</ul>';
		chat_details+='<div class="chatForm">';
		chat_details+='<textarea name="" cols="" rows="" placeholder="Message Here" id="chatMsg"></textarea>';
		chat_details+='<button class="btnSend" id="btnChatSend" data-client="'+curClientId+'">Send</button>';
		chat_details+='</div>';
		chat_details+='</div>';
		chat_details+='</section>';
		
		$('#messageDetails').html(chat_details);
		$('.chatMessage').css('height',$('.containerRight').height()-$('.articleHeader').height()-130);
		$('.chatMessage').scrollTop($('.chatMessage')[0].scrollHeight);
	});
	
	$('.chatMessage').live('click',function(){
		var curClientId = localStorage.getItem('clientId');
		socket.emit('readMessage', {"to":0, "from":curClientId});
	});
	
	socket.on('updateMsgCtr', function(data){
		var ctr = 0;
		for(var m =0; m<data.length; m++){
			if(0==data[m].to){
				if(data[m].status=="Unread"){
					ctr++;
				}
			}
			if(ctr!=0){
				$('#msgNoti').html('<div class="icon icon46 i46Messa"></div><span>商談</span><div class="notiCicrle">'+ctr+'</div>');
			}
			else{
				$('#msgNoti').html('<div class="icon icon46 i46Messa"></div><span>商談</span>');
			}
		}
		
		console.log(ctr);
	});
	
	$('#btnChatSend').live('click', function(){
		var getClientId = $(this).attr('data-client');
		var message = $('#chatMsg').val();
		var dNow = new Date();
		
		socket.emit('sendMessage', {"to": getClientId, "from": "0", "message": message, "sentDate":dNow, "status": "Unread"});
	});
	
});