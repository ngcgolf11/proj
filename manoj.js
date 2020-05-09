 // create cookies
function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";               
	document.cookie = name + "=" + value + expires + "; path=/";
}

 // read cookies
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length).replace(/%2F/gi,'/').replace(/\+/gi,' ').replace(/\%26%23xa3%3B/gi,'&#xa3;');
	}
	return null;
}

 // erase cookies
function eraseCookie(name) {
	createCookie(name, "", -1);
}

$(document).on('change','#Data_Form #showLength',function(){ 
	$('#Data_Form').submit();														 
});

$(document).on('keypress','#Data_Form #searchValue',function(e){ 
	if (e.keyCode == '13') {
        $('#Data_Form').submit();
    }																  
});

$(document).ready(function(){
	// Form Validation
	if($("#currentPageForm").length) { 
	    $("#currentPageForm").validate({
			rules:{
				new_password: { minlength: 6, maxlength: 25 },
				conf_password: { minlength: 6, equalTo: "#new_password" },
		        mobile_number:{ minlength:10, maxlength:15, numberandsign:true }
			},
			errorClass: "error",
			errorElement: "span"
		});
	}

    getHeaderFriendRequestAndNotification();
	setInterval(getHeaderFriendRequestAndNotification,20000);  // 20 second
});

//Profile page tabbing
$(document).on('click','.card .nav-tabs .nav-item a',function(){
	$(this).parent('.nav-item').siblings().find('.nav-link').removeClass('active');
	$(this).addClass('active');
});

//	get header friend request, notification and message
function getHeaderFriendRequestAndNotification(){	

	$.ajax({
		type: 'post',
		 url: FRONTFULLSITEURL+'ajaxcontroller/getHeaderNotification',
		data: {loginUserId:PTREE_FRONT_ID,showCount:6},
	dataType: 'json',
	 success: function(response){
			if(parseInt(response.success) == 0) { 
        		$('#headerNotificationMainDiv').closest('.notification-content').siblings('.dropdown-toggle').removeClass('notification--bullet');
        		$('#headerNotificationMainDiv').siblings('.notification-content__bottom').hide();
			} else { 
        		$('#headerNotificationMainDiv').closest('.notification-content').siblings('.dropdown-toggle').addClass('notification--bullet');
        		$('#headerNotificationMainDiv').siblings('.notification-content__bottom').show();
        	}
			$('#headerNotificationMainDiv').html(response.result.notificationData);
		}
	});

	$.ajax({
		type: 'post',
		 url: FRONTFULLSITEURL+'ajaxcontroller/getHeaderFriendRequest',
		data: {loginUserId:PTREE_FRONT_ID,showCount:6},
	dataType: 'json',
	 success: function(response){
	 		if(parseInt(response.success) == 0) {
        		$('#headerFriendRequestMainDiv').closest('.notification-content').siblings('.dropdown-toggle').removeClass('notification--bullet');
        		$('#headerFriendRequestMainDiv').siblings('.notification-content__bottom').hide();
	 		} else {
        		$('#headerFriendRequestMainDiv').closest('.notification-content').siblings('.dropdown-toggle').addClass('notification--bullet');
        		$('#headerFriendRequestMainDiv').siblings('.notification-content__bottom').show();
        	}
			$('#headerFriendRequestMainDiv').html(response.result.requestData);
		}
	});

	$.ajax({
		type: 'post',
		 url: FRONTFULLSITEURL+'ajaxcontroller/getHeaderMessages',
		data: {loginUserId:PTREE_FRONT_ID,showCount:6},
	dataType: 'json',
	 success: function(response){
	 		if(parseInt(response.success) == 0) {
        		$('#headerMessagesMainDiv').closest('.notification-content').siblings('.dropdown-toggle').removeClass('notification--bullet');
        		$('#headerMessagesMainDiv').siblings('.notification-content__bottom').hide();
	 		} else {
        		$('#headerMessagesMainDiv').closest('.notification-content').siblings('.dropdown-toggle').addClass('notification--bullet');
        		$('#headerMessagesMainDiv').siblings('.notification-content__bottom').show();
        	}
			$('#headerMessagesMainDiv').html(response.result.messageData);
		}
	});
}

//send friend request
$(document).on('click','.friendSection .sendFriendRequestButton',function(event){
	event.stopPropagation();
	var currentObj		=	$(this);
	var	sendToId		=	$(this).attr('data-id');
	if(sendToId){
		$.ajax({
			type: 'post',
			 url: FRONTFULLSITEURL+'ajaxcontroller/sendFriendRequest',
			data: {loginUserId:PTREE_FRONT_ID,sendToId:sendToId},
		dataType: 'json',
		 success: function(response){
		 		if(parseInt(response.success) == 0){ 
	        		alertMessageModelPopup(response.message,'Error');
	        	} else { 
	        		currentObj.closest('li').hide();
	        		alertMessageModelPopup(response.message,'Success');
	        	}
			}
		});
	}
});

//accept friend request
$(document).on('click','.friendRequestHeaderSection .acceptFriendRequest',function(event){
	event.stopPropagation();  
	var currentObj		=	$(this);
	var	requestData		=	(currentObj.closest('.friendRequestHeaderSection').attr('data-id')).split('_____');
	var	requestId		=	requestData[0];
	var	requestUserId	=	requestData[1];  
	if(requestId && requestUserId){
		$.ajax({
			type: 'post',
			 url: FRONTFULLSITEURL+'ajaxcontroller/acceptFriendRequest',
			data: {loginUserId:PTREE_FRONT_ID,requestId:requestId,requestUserId:requestUserId},
		dataType: 'json',
		 success: function(response){
		 		if(parseInt(response.success) == 0){ 
	        		alertMessageModelPopup(response.message,'Error');
	        	} else { 
	        		currentObj.parent('span.pull-right').html('Accepted');
	        		alertMessageModelPopup(response.message,'Success');
	        	}
			}
		});
	}
});

//delete friend request
$(document).on('click','.friendRequestHeaderSection .deleteFriendRequest',function(event){
	event.stopPropagation();
	var currentObj		=	$(this);
	var	requestData		=	(currentObj.closest('.friendRequestHeaderSection').attr('data-id')).split('_____');
	var	requestId		=	requestData[0];
	var	requestUserId	=	requestData[1];
	if(requestId && requestUserId){
		$.ajax({
			type: 'post',
			 url: FRONTFULLSITEURL+'ajaxcontroller/deleteFriendRequest',
			data: {loginUserId:PTREE_FRONT_ID,requestId:requestId,requestUserId:requestUserId},
		dataType: 'json',
		 success: function(response){
		 		if(parseInt(response.success) == 0){ 
	        		alertMessageModelPopup(response.message,'Error');
	        	} else { 
	        		currentObj.parent('span.pull-right').html('Deleted');
	        		alertMessageModelPopup(response.message,'Success');
	        	}
			}
		});
	}
});

//delete from friend list
$(document).on('click','.friendListSection .deleteFromFriendList',function(event){
	event.stopPropagation();
	var currentObj		=	$(this);
	var	requestUserId	=	currentObj.closest('.friendListSection').attr('data-id');

	if(requestUserId){
		$.ajax({
			type: 'post',
			 url: FRONTFULLSITEURL+'ajaxcontroller/deleteFromFriendList',
			data: {loginUserId:PTREE_FRONT_ID,requestUserId:requestUserId},
		dataType: 'json',
		 success: function(response){
		 		if(parseInt(response.success) == 0){ 
	        		alertMessageModelPopup(response.message,'Error');
	        	} else { 
	        		currentObj.parent('span.frnd-btn').html('Deleted');
	        		alertMessageModelPopup(response.message,'Success');
	        	}
			}
		});
	}
});
