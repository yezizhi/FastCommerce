 // Fetch header content and append it to the header-container
fetch('header.html').then(response => response.text()).then(data => {$('#header-container').html(data)});

 // Fetch header2 content and append it to the header-container
fetch('header2.html').then(response => response.text()).then(data => {$('#header-container-2').html(data)});

// Fetch footer content and append it to the footer-container
fetch('footer.html').then(response => response.text()).then(data => {$('#footer-container').html(data)});

jQuery("#header-container").animate({opacity:'show', height:'show'},200);
jQuery("#footer-container").animate({opacity:'show', height:'show'},200);

$.ajax({
    url : "/api/checklogin",
    type : "get",
    async : true,
    contentType: 'application/json;charset=UTF-8',
    success : function(data) {
        if(data && data.code == 0){
            var html = "<li class='nav-item'><a class='nav-link fw-semibold' href='javascript:void(0)'>Hi, "+data.data.username+"</a></li>";
            html += "<li class='nav-item'><a class='nav-link login' href='/admin/home' target='blank'>Go to backend</a></li>";
            $("#last-navbar-nav").html(html);
        } 
    }
});