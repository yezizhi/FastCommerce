// Show "Get in touch" form when clicking the button. Show "Thank you" message when submitting the form.
if(jQuery("#btnShowForm").length > 0){
	const btnShowForm = document.getElementById('btnShowForm');
	const formSection = document.getElementById('formSection');
	const msgSection = document.getElementById('msgSection');
	btnShowForm.addEventListener('click', function () {
	  $.ajax({
		url : "/api/country/list",
		type : "get",
		async : true,
		contentType: 'application/json;charset=UTF-8',
		success : function(data) {
			if(data && data.code == 0 && data.data.total > 0){
				var countries = data.data.list;
				var html = "<option selected value='US'>United States</option>";
				for(var index in countries){
					if(countries[index].code != 'US'){
						html += "<option value='"+countries[index].code+"'>"+countries[index].name+"</option>";
					}
				}
				jQuery("#formSection #country").html(html);
				
				if(jQuery("#partnersformbox").length > 0){
					loadStates('US');
				}
			}
		}
	  });
	  formSection.classList.remove('d-none');
	  msgSection.classList.add('d-none');
	  btnShowForm.classList.add('d-none');
	});
	
	if(jQuery("#contactformbox #btnShowForm").length > 0){
		formSection.addEventListener('submit', function (e) {
			  e.preventDefault(); // Prevent the default form submission
			  var name = jQuery("#formSection #fullName").val();
			  var email = jQuery("#formSection #businessEmail").val();
			  var phone = jQuery("#formSection #businessPhone").val();
			  var company = jQuery("#formSection #company").val();
			  var websiteUrl = jQuery("#formSection #website").val();
			  var country = jQuery("#formSection #country").val();
			  var message = jQuery("#formSection #comments").val();
			  
			  if(!checkEmail(email)){
				  alert("The business  email you entered is invalid.");
			  }
			  jQuery.ajax({
				url : "/api/lead/addContactUs",
				type : "post",
				async : true,
				data: JSON.stringify({"name": name, "email": email, "phone": phone, "company": company, "websiteUrl": websiteUrl, "country": country, "message": message}),
				contentType: 'application/json;charset=UTF-8',
				success : function(data) {
				  if(data){
					if(data.code == 0){
						formSection.classList.add('d-none');
						msgSection.classList.remove('d-none');
					} else {
						alert(data.msg);
						return;
					}
				  }
				}
			  });
		});
	}
	
	if(jQuery("#partnersformbox #btnShowForm").length > 0){
		formSection.addEventListener('submit', function (e) {
			  e.preventDefault(); // Prevent the default form submission
			  var firstName = jQuery("#formSection #firstName").val();
			  var lastName = jQuery("#formSection #lastName").val();
			  var title = jQuery("#formSection #title").val();
			  var email = jQuery("#formSection #emailAddress").val();
			  var phone = jQuery("#formSection #phone").val();
			  var company = jQuery("#formSection #company").val();
			  var websiteUrl = jQuery("#formSection #website").val();
			  var address = jQuery("#formSection #address").val();
			  var city = jQuery("#formSection #city").val();
			  var state = jQuery("#formSection #state").val();
			  var zipcode = jQuery("#formSection #postalCode").val();
			  var country = jQuery("#formSection #country").val();
			  var businessType = jQuery("#formSection input[type='checkbox']:checked");
			  var businessTypes = "";
			 for(var i=0;i<businessType.length;i++){
				businessTypes = businessTypes + ',' + $(businessType[i]).val();
			 }
			 if(businessTypes != ''){
				businessTypes = businessTypes.substring(1);
			 }
			 
			  if(!checkEmail(email)){
				  alert("The business  email you entered is invalid.");
			  }
			  
			  jQuery.ajax({
				url : "/api/lead/addPartner",
				type : "post",
				async : true,
				data: JSON.stringify({"firstName": firstName, "lastName": lastName, "title": title, "email": email, "phone": phone, "company": company, "websiteUrl": websiteUrl, "address": address, "city": city, "state": state, "zipcode": zipcode, "country": country, "businessType": businessTypes}),
				contentType: 'application/json;charset=UTF-8',
				success : function(data) {
				  if(data){
					if(data.code == 0){
						formSection.classList.add('d-none');
						msgSection.classList.remove('d-none');
					} else {
						alert(data.msg);
						return;
					}
				  }
				}
			  });
		});
	}
}

if(jQuery("#domainbox #filter").length > 0){
	jQuery.ajax({
		url : "/api/setting/domain/search/init",
		type : "post",
		async : true,
		contentType: 'application/json;charset=UTF-8',
		success : function(data) {
			if(data && data.code == 0 && data.data.total > 0){
				var tlds = data.data.list;
				var html = "";
				for(var index in tlds){
					html += "<div class='form-check'><input class='form-check-input' type='checkbox' checked value='"+tlds[index]+"'><label class='form-check-label'>"+tlds[index]+"</label></div>";
				}
				jQuery("#domainbox #filter #toptldbox").append(html);
			}
		}
	});
}

function showhidetldbox(type){
	if(type == 'top'){
		jQuery("#domainbox #filter #toptldbox").stop(true,true).hide();
		jQuery("#domainbox #filter #toptldbox input[type='checkbox']").prop("checked", false);
		loadtldbyletter('A');
		jQuery("#domainbox #filter #alltldbox").animate({opacity:'show', height:'show'},200);
	} else {
		jQuery("#domainbox #filter #alltldbox").stop(true,true).hide();
		jQuery("#domainbox #filter #toptldbox").animate({opacity:'show', height:'show'},200);
		jQuery("#domainbox #filter #toptldbox input[type='checkbox']").prop("checked", true);
		jQuery("#domainbox #filter #alltldbox input[type='checkbox']").prop("checked", false);
	}
}

function loadtldbyletter(letter){
	jQuery.ajax({
		url : "/api/setting/domain/searchTld?firstletter=" + letter,
		type : "get",
		async : true,
		contentType: 'application/json;charset=UTF-8',
		success : function(data) {
			if(data && data.code == 0 && data.data.total > 0){
				var tlds = data.data.list;
				var html = "";
				for(var index in tlds){
					html += "<div class='form-check'><input class='form-check-input' checked type='checkbox' value='"+tlds[index]+"'><label class='form-check-label'>"+tlds[index]+"</label></div>";
				}
				jQuery("#domainbox #filter #alltldbox #subtldbox").html(html);
			} else {
				jQuery("#domainbox #filter #alltldbox #subtldbox").html('');
			}
			$("#domainbox #filter #alltldbox a.tldlink").removeClass("selected");
			$("#domainbox #filter #alltldbox a.tldlink_" + letter.toLowerCase()).addClass("selected");
		}
	});
}

function clearselectedtlds(){
	jQuery("#domainbox #filter .tldbox:visible input[type='checkbox']:checked").prop("checked", false);
}

function applytlds(){
	var tlds = jQuery("#domainbox #filter .tldbox:visible input[type='checkbox']:checked");
	if(tlds == '' || tlds.length == 0){
		alert("TLD is required.");
		return;
	}
	
	$('#domainbox #filter').modal('hide');
	
	var keyword = jQuery("#domainbox #keyword").val();
	if(keyword != ''){
		searchdomain();
	}
}

function searchdomain(){
	var keyword = jQuery("#domainbox #keyword").val();
	if(keyword == ''){
		alert("Please enter a domain name containing only letters and numbers, and less than 63 characters.");
		return;
	}
	
	var tlds = jQuery("#domainbox #filter .tldbox input[type='checkbox']:checked");
	if(tlds == '' || tlds.length == 0){
		alert("TLD is required.");
		return;
	}
	
	$("#domainbox .searchresultbox").hide();
	$("#domainbox .searchresultbox .searchlistitemsbox").html("");
	
	const tldvals = [];
	for(var i=0;i<tlds.length;i++){
		tldvals.push($(tlds[i]).val());
	}
	
	jQuery.ajax({
		url : "/api/setting/domain/searchForOfficialWebsite",
		type : "post",
		async : true,
		data: JSON.stringify({"keyword": keyword, "tlds": tldvals}),
		contentType: 'application/json;charset=UTF-8',
		success : function(data) {
			if(data && data.code == 0){
				var searchList = data.data.searchList;
				if(searchList.length == 0){
					$("#domainbox #searchListbox #nosearchlistbox").show();
					$("#domainbox #searchListbox #withsearchlistbox").hide();
				} else {
					$("#domainbox #searchListbox #nosearchlistbox").hide();
					loadsearchitems(searchList, 'searchListbox');
					$("#domainbox #searchListbox #withsearchlistbox").show();
				}
				$("#domainbox #searchListbox").show();
				
				var suggestList = data.data.suggestList;
				if(suggestList.length > 0){
					loadsearchitems(suggestList, 'suggestListbox');
					$("#domainbox #suggestListbox").show();
				}
			}
		}
	});
}

function loadsearchitems(searchList, id){
	var html = "";
	for(var index in searchList){
		html += "<div class='searchlistitembox'><div class='container d-flex justify-content-between'><span>"+searchList[index].name+"</span><div class='d-flex align-items-center'><span>"+searchList[index].yearPriceText+"</span><a href=\"javascript:addtodomiancart('"+searchList[index].name+"')\" class='text-decoration-none'><i class='ph-light ph-shopping-cart-simple text-blue ms-3'></i></a></div></div></div>";
	}
	$("#domainbox #"+id+" .searchlistitemsbox").html(html);
	
	var itemcount = (id == 'searchListbox') ? 5 : 10;
	var searchlistitems = $("#domainbox #"+id+" .searchlistitembox");
	for(var i=0;i<itemcount && i<searchlistitems.length;i++){
		$(searchlistitems[i]).show();
	}
	if($("#domainbox #"+id+" .searchlistitembox").length > itemcount){
		$("#domainbox #"+id+" .showmorebtn").show();
	}
}

function showmoresearchitem(id){
	var itemcount = (id == 'searchListbox') ? 5 : 10;
	var searchlistitems = $("#domainbox #"+id+" .searchlistitembox:hidden");
	for(var i=0;i<itemcount && i<searchlistitems.length;i++){
		$(searchlistitems[i]).show();
	}
	
	if($("#domainbox #"+id+" .searchlistitembox:hidden").length == 0){
		$("#domainbox #"+id+" .showmorebtn").show();
	}
}

function addtodomiancart(domain){
	jQuery.ajax({
		url : "/api/setting/domain/addDomainToCookie?domain=" + domain,
		type : "get",
		async : true,
		contentType: 'application/json;charset=UTF-8',
		success : function(data) {
			if(data && data.code == 0){
				jQuery.ajax({
					url : "/api/setting/domain/cart/add",
					type : "post",
					async : true,
					data: JSON.stringify({"name": domain}),
					contentType: 'application/json;charset=UTF-8',
					success : function(data) {
						if(data){
							if(data.code == 0){
								location.href="/admin/settings/domains/getdomain/shoppingcart";
							} else if(data.code == 401){
								location.href="/admin/login";
							} else {
								alert(data.data.msg);
							}
						} else {
							alert("failed");
						}
					}
				});
			} else {
				alert("failed");
			}
		}
	});
}

function loadStates(country){
	$.ajax({
		url : "/api/state/list?country=" + country,
		type : "get",
		async : true,
		contentType: 'application/json;charset=UTF-8',
		success : function(data) {
			var html = "";
			if(data && data.code == 0 && data.data.total > 0){
				html += "<select class='form-select' id='state'>";
				var states = data.data.list;
				for(var index in states){
					html += "<option value='"+states[index].code+"'>"+states[index].name+"</option>";
				}
				html += "</select>";
			} else {
				html += "<input type='text' class='form-control' id='state' maxlength='200'>";
			}
			jQuery("#statebox #state").remove();
			jQuery("#statebox").append(html);
		}
	})
}

function checkEmail(email){
	var email_reg = /^([A-Za-z0-9_\-\.\'])+\@([A-Za-z0-9_\-\.\'])+\.([A-Za-z])+$/;
	return email != '' && email.trim().length <= 100 && email_reg.test(email);
}