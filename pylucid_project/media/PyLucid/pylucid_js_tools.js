
// helper function for console logging
// set debug to true to enable debug logging
function log() {
	try {debug} catch (e) {debug=false};
    if (debug && window.console && window.console.log)
        window.console.log(Array.prototype.join.call(arguments,''));
}
log("pylucid_js_tools.js loaded.");


function OpenInWindow(link) {
    /*************************************************************************
    Open link in a new JavaScript window.
    Usage e.g.:
        <a href="/foobar/" onclick="return OpenInWindow(this);">foobar</a>
    Better usage:
        <a href="/foobar/" class="openinwindow">foobar</a>
	  *************************************************************************/
    log("OpenInWindow()");
    var url = $(link).attr("href");
    log("url:" + url);
    win = window.open(url, "", "width=900, height=760, dependent=yes, resizable=yes, scrollbars=yes");
    win.focus();
    return false;
}


function replace_complete_page(html) {
    // replace the complete page
    document.open() // no append available since it is closed
    document.write(html);
    document.close();
}

function replace_page_content(data, textStatus) {
    /*************************************************************************
	ajax success "handler".
	replace the "#page_content" with the new html response data
	*************************************************************************/
    log("ajax post response success.");
    log("status:" + textStatus);
    if (data.indexOf("</body>") != -1) {
        // FIXME: We should find a way to handle a
        // redirect directly. But we always get the
        // html data of the redirected page.
		
        log("redirect work-a-round: replace the complete page");
		log(data);
        log("</body> index:" + data.indexOf("</body>"));
        replace_complete_page(data)
    } else {
        // log("put in #page_content:" + data);
		if ($("#page_content").length == 0) {
			msg = 'ajax view error:\n\n';
			msg += 'There is no CSS id="page_content" in your page template!\n\n';
			msg += 'more info at: http://www.pylucid.org/permalink/320/auth-plugin';
			log(msg);
		    alert(msg);
			$("body").html(data);
			return;
		}
        $("#page_content").html(data);
        $("#page_content").animate({
            opacity: 1
        }, 500 );
    }
    load_normal_link = false;
}


function ajax_error_handler(XMLHttpRequest, textStatus, errorThrown) {
    /*************************************************************************
	ajax error "handler".
	replace the complete page with the error text (django html traceback page)
	*************************************************************************/
    log("ajax get response error!");
    log(XMLHttpRequest);
    var response_text = XMLHttpRequest.responseText;
    log("response_text: '" + response_text + "'");
    if (!response_text) {
        response_text = "<h1>Ajax response error without any response text.</h1>";
		response_text += "<p>textStatus:" + textStatus + "</p>"
		response_text += "<p>errorThrown:" + errorThrown + "</p>"
		replace_page_content(response_text, textStatus);
		return
    }
    replace_complete_page(response_text);
    load_normal_link = true;
}



function pylucid_ajax_form_view(form_id) {
    /*************************************************************************
    PyLucid ajax form view.
    
    Don't send the form and get a complete new rendered page. Send the form
    via ajax post and replace the #page_content with the html response.
    
    usage e.g.:
    ----------------------------------------------------------------------
	    $(document).ready(function(){
	    	// simply bind the form with the id:
	        pylucid_ajax_form_view('#form_id');
	    });
    ----------------------------------------------------------------------
    *************************************************************************/
    $(form_id).bind('submit', function() {
        var form = $(this);
        log("pylucid_ajax_form_view submit form:" + form);
        
        $("#page_content").html('<h2>send...</h2>');
        $("#page_content").animate({
            opacity: 0.3
        }, 500 );
    
        var form_data = form.serialize();
        log("form data:" + form_data);
        
        var url = encodeURI(form.attr('action'));
        log("send form to url:" + url);
        
        load_normal_link = true;
        
        XMLHttpRequest = $.ajax({
            async: false,
            type: "POST",
            url: url,
            data: form_data,
            dataType: "html",
            
            success: replace_page_content,
            complete: function(XMLHttpRequest, textStatus){
                // Handle redirects
                log("complete:" + XMLHttpRequest);
                log("text:" + textStatus);
                log("complete:" + XMLHttpRequest.status);
                log("complete:" + XMLHttpRequest.getResponseHeader('Location'));
                
                if(XMLHttpRequest.status.toString()[0]=='3'){
                    top.location.href = XMLHttpRequest.getResponseHeader('Location');
                }
            },
            error: ajax_error_handler
        });
        log("ajax done:" + XMLHttpRequest);
        log("ajax done:" + XMLHttpRequest.status);
        log("ajax done:" + XMLHttpRequest.getResponseHeader('Location'));
        return load_normal_link; // <-- important: Don't send the form in normal way.
    });
}



function get_pylucid_ajax_view(url) {
    /*************************************************************************
    PyLucid ajax get view replace.
    
    Don't render the complete page again. Simply get the new content via ajax
    and replace #page_content with it.
    
    usage e.g.:
    ----------------------------------------------------------------------
        $(document).ready(function(){
            $("#link_id").click(function(){
                return get_pylucid_ajax_view("{{ ajax_get_view_url }}");
            });
        });
    ----------------------------------------------------------------------
    or:
    ----------------------------------------------------------------------
    <a href="{{ url }}" onclick="return get_pylucid_ajax_view('{{ ajax_url }}');">foo</a>
    ----------------------------------------------------------------------
    *************************************************************************/
    $("#page_content").html('<h2>loading...</h2>');
    $("#page_content").animate({
        opacity: 0.3
    }, 500 );

    var url = encodeURI(url);
    log("get:" + url);
    
    load_normal_link = true;
    
    $.ajax({
        async: false,
        type: "GET",
        url: url,
        dataType: "html",
        
        success: replace_page_content,
        error: ajax_error_handler
    });
    if (debug) {
        // never fall back in debug mode.
        log("return: " + load_normal_link);
        return false;
    } else {
        // fall back to normal view, if ajax request failed.
        return load_normal_link; // The browser follow the link, if true
    }    
}


function replace_openinwindow_links() {
    /*************************************************************************
    * replace the existing links with a "open in new window" link
    * usage:
    * 		<a href="/foo" class="openinwindow">foo</a>
    */
    $('a.openinwindow').each(function(){
        var url = $(this).attr("href");
        log("replace openinwindow for:" + url);
        var org_title = $(this).attr("title");
        
        $(this).attr('target', '_blank'); // fall-back
        
        $(this).click(function() {
           return OpenInWindow(this);
        });
    });
}


/*****************************************************************************
* PyLucid comments stuff
*/
var pylucid_comments_preview = false;
function submit_comments_form() {
    log("submit: comment form");
    
    $("#comments_commit_status").slideDown();
    $("#comment_form_div").fadeTo(0.5);
    
    var form_data = $("#comment_form").serialize();
    if (pylucid_comments_preview == true) {
      form_data += "&preview=On";
    }
    log("form data:" + form_data);
    
    $.ajax({
        type: "POST",
        url: "?pylucid_comments=submit",
        data: form_data,
        dataType: "html",
        success: function(data, textStatus) {
            log("Success");
            log("textStatus:" + textStatus);
            //log("data:" + data);
            if (data=="reload") {
                // Reload the current page, after the comment was saved
                log("should reload.");
                log("Cookie:"+document.cookie);
                location.reload();
            }
            log("replace old form");
            insert_comments_form(data);
            $("#comment_form_div").fadeTo(1);
        },
        error: ajax_error_handler // from pylucid_js_tools.js
    });
}
function insert_comments_form(html) {
    log("insert_comments_form()");
    $("#comment_form_div").html(html);
    $("#comments_commit_status").slideUp();
    
    pylucid_comments_preview = false;
    $("#comment_form").bind('submit', submit_comments_form);
    $("input[name=preview]").click(function() {
        log("preview clicked.");
        pylucid_comments_preview = true;
    });
}
function get_pylucid_comments_form() {
    log("get_pylucid_comments_form()");
    
    $("#leave_comment_link").slideUp();
    $("#comments_commit_status").slideDown();
    
    var post_data = "content_type=";
    post_data += $("input#id_content_type").val();
    post_data += "&object_pk="
    post_data += $("input#id_object_pk").val();
    log("post_data:"+post_data);

    $.ajax({
        type: "POST",
        url: "?pylucid_comments=get_form",
        data: post_data,
        dataType: "html",
        success: function(data, textStatus) {
            log("Success");
            log("textStatus:" + textStatus);
            insert_comments_form(data);
            $("#comment_form_div").slideDown();
        },
        error: ajax_error_handler
    });

}
/****************************************************************************/






var MIN_ROWS = 5;
var MAX_ROWS = 25;


jQuery(document).ready(function($) {
   log("run pylucid_js_tools.js init...");
   /*************************************************************************
	 * replace the existing links with a "open in new window" link           */
    replace_openinwindow_links();
	
	
    /*************************************************************************
	 * Add a "open in new window" link after the existing normal link.
	 * usage:
	 * 		<a href="/foo" class="add_openinwindow">foo</a>
	 */
    $('a.add_openinwindow').each(function(){

        var url = $(this).attr("href");
        var org_title = $(this).attr("title");
		
        var new_link = ' <a href="'+url+'" onclick="return OpenInWindow(this);" title="'+org_title+' (Opens in a new window)">[^]</a>'
		
        $(this).after(new_link);
    })
    
    /*************************************************************************
	 * Resize all textareas
	 */
    $("textarea").each(function() {
        rows = this.value.split("\n").length;
        if (rows > MAX_ROWS) {
            rows = MAX_ROWS;
        }
        if (rows < MIN_ROWS) {
            rows = MIN_ROWS;
        }
        log("set textarea row to:" + rows)
        this.rows = rows;
    });
	// jquery.textarearesizer.js -> http://plugins.jquery.com/project/TextAreaResizer
	try {
        $("textarea:not(.processed)").TextAreaResizer();	
    } catch (e) {
	    log("can't init TextAreaResizer:" + e);
    }
	
    /*************************************************************************
	 * resize input fields
	 */
    $(".pylucid_form input").each(function() {
        maxlength = $(this).attr("maxlength");
        if (maxlength<=0) {
            return;
        }
        if (maxlength > MAX_LENGTH) {
            maxlength = MAX_LENGTH;
        }
        this.size=maxlength;
    });

    /*************************************************************************
	 * hide/unhide form fieldset stuff.
	 */
    $(".pylucid_form .form_hide").nextAll().hide();
    $(".pylucid_form .form_collapse").each(function() {
        $(this).css("cursor","n-resize");
    });
    $(".pylucid_form .form_collapse").click(function () {
        if ($(this).css("cursor") == "n-resize") {
            $(this).css("cursor","s-resize");
        } else {
            $(this).css("cursor","n-resize");
        }
        $(this).nextAll().slideToggle("fast");
    });
	
});