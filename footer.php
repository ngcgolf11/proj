<div id="alertMessageModal" class="modal" role="dialog">
	<div class="modal-dialog">
		<div class="modal-content m-body">
			<button type="button" class="btn btn-default close_msg-d" data-dismiss="modal">X</button>
			<div class="modal-body ">
				<div class="mess_con Error" style="display:none;">
					<h2 class="text-danger">Danger!</h2>
					<p>Loading...</p>
					<button type="button" class="btn btn-danger btn-rounded btn-mod" data-dismiss="modal"><i class="fa fa-heart"></i>&nbsp;ok</button>
				</div>
				<div class="mess_con Warning" style="display:none;">
					<h2 class="text-warning">Warning!</h2>
					<p>Loading...</p>
					<button type="button" class="btn btn-warning  btn-rounded btn-mod" data-dismiss="modal"><i class="fa fa-heart"></i>&nbsp;ok</button>
				</div>
				<div class="mess_con Success" style="display:none;">
					<h2 class="text-success">Success!</h2>
					<p>Loading...</p>
					<button type="button" class="btn btn-success  btn-rounded btn-mod" data-dismiss="modal"><i class="fa fa-heart"></i>&nbsp;ok</button>
				</div>
				<div class="mess_con Message" style="display:none;">
					<h2 class="text-primary">Message!</h2>
					<p>Loading...</p>
					<button type="button" class="btn btn-primary  btn-rounded btn-mod" data-dismiss="modal"><i class="fa fa-heart"></i>&nbsp;ok</button>
				</div>
			</div>
		</div>
	</div>
</div>
<script>
function alertMessageModelPopup(message,type){	
	$("#alertMessageModal").modal('show');
	$("#alertMessageModal").find('.mess_con').css('display','none');
	$("#alertMessageModal").find('.mess_con p').html('Loading...');
	$("#alertMessageModal").find('.'+type).css('display','block');
	$("#alertMessageModal").find('.'+type+' p').html(message);
	setTimeout(AlertMessageModelPopupTimedOut, 10000);
}
function AlertMessageModelPopupTimedOut() { 
	$("#alertMessageModal").modal('hide');
}
alertMessageModelPopup('dsdasdasdsad','Error');
</script>
<div id="lockScreenModal" class="modal" role="dialog" >
	<div class="modal-dialog modal-sm">
		<div class="modal-content">
			<div class="modal-body">
				<div class="lock_screen lock_pop">
					<div class="white_form">
						<div class="userlock">
							<h1>
								<p>PeoplezTree</p>
								<p>Your session is locked</p>
								<span>
									<img src="<?php echo showCorrectImage(sessionData('PTREE_FRONT_IMAGE'),'medium','profile'); ?>" alt="User image" class="img-responsive"/>
								</span>
							</h1>
						</div>
						<div class="form_foeld">
							<form name="lockScreenForm" id="lockScreenForm" action="" method="">
								<div class="form-group">
									<input type="password" name="password" id="password" class="form-control required" placeholder="Password"/>
									<label for="password" generated="true" class="error"></label>
								</div>
								<div class="form-group">
									<button type="submit" value="" id="" class="btn btn-default main_formbtn">Login<span class="bluecircle"><img src="{ASSET_FRONT_URL}image/arrow2.png" /></span></button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="reminderSectionPopup" class="modal" role="dialog">
    <div class="modal-dialog modal-lg">
        <div class="row modal-content p-t-20" id="reminderSectionPopupHTML">
            <form class="form-horizontal">
                 <div class="form-group row m-b-5">
                    <label class="col-sm-2 text-right control-label col-form-label">Loading...</label>
                </div>
            </form>
        </div>
    </div>
</div>
<script type="text/javascript">
///////////   SECTION ///////////////////////
    $(document).on('click','.reminderSection',function(){
        $('#reminderSectionPopup').modal({backdrop:'static', show: true, keyword: false});
            $.ajax({
                  type: 'get',
                  url: FRONTFULLSITEURL+'ajaxcontroller/getReminderData',
                  success: function(rdata){   
                        $('#reminderSectionPopupHTML').html(rdata);
                    }
            });
    });
    $(document).on('click','#reminderSectionPopupClosed',function(){
        $('#reminderSectionPopup').modal('hide');
    });
</script>
<script>
var idleTimeRedirect 		=	0;
var showLockScreenForm 		= 	'NO';
$(document).ready(function(){
	//Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTimeRedirect 	= 	0;
    });

    $(this).keypress(function (e) {
        idleTimeRedirect 	= 	0;
    });

    var idleInterval 		= 	setInterval(showUserLockScreen, 1000); // 1 second

    if(readCookie('PTREE_FRONT_LOCK_SCREEN') == 'YES'){
    	showLockScreenForm 	= 	'YES';
    	var lwheight		=	(($(window).height()/4)-50);
		$("#lockScreenModal").modal({backdrop:'static', show: true, keyword: false});
		$("#lockScreenModal").css('margin-top',lwheight);
    }

    $("#lockScreenForm").validate({
		rules:{
			password:{
				required: true,
				minlength:6,
				maxlength:25
			}
		},
		errorClass: "error",
		errorElement: "label",
		submitHandler: function (form) {
			var password 	=	$('#lockScreenForm #password').val();
		   $.ajax({
		          type: 'post',
		           url: FRONTFULLSITEURL+'ajaxcontroller/unlockUserLockScreen',
		          data: {password:password},
		      dataType: 'json',
		       success: function(rdata){  
		        	if(parseInt(rdata.success) == 0){ 
		        		$('#lockScreenForm .form-group label').css('display','block').html(rdata.message);
		        	} else {
		        		eraseCookie('PTREE_FRONT_LOCK_SCREEN');
		            	window.location.reload();
					}
		        }
		    });
		}
	});	
});
function showUserLockScreen(){  
	if (idleTimeRedirect++ > 1440) { // 1440 seconds  24 minuts
		if(showLockScreenForm == 'NO'){
			$.ajax({
		          type: 'post',
		           url: FRONTFULLSITEURL+'ajaxcontroller/checkUserLogin',
		          data: {checkUserLogin:'YES'},
		      dataType: 'json',
		       success: function(rdata){  
		        	if(parseInt(rdata.success) == 1){ 
		        		showLockScreenForm 	= 	'YES';
		            	createCookie('PTREE_FRONT_LOCK_SCREEN','YES', 1);
				        var lwheight		=	(($(window).height()/4)-50);
						$("#lockScreenModal").modal({backdrop:'static', show: true, keyword: false});
						$("#lockScreenModal").css('margin-top',lwheight);
					} else {
						window.location.href = BASEURL;
					}
		        }
		    });
		}
    }
}
</script>
