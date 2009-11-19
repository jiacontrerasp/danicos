/*
                                  ____   _____ 
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___  
                 / _ \ | | |/ _ \ |  | |\___ \ 
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/ 
                       __/ |                   
                      |___/              2.0

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2008 eyeOS Team (team@eyeos.org)

*/
document.onclick=clickedScreen;
clickEvents = new Object();
eyeDeskItems=0;
eyeFlag=0;
IEversion=0;
if (navigator.appVersion.indexOf("MSIE")!=-1){
	NavSplit=navigator.appVersion.split("MSIE");
	IEversion=parseFloat(NavSplit[1]);
}
minArrows = 0;
spaceBetweenApps = 1;
zLayers = 11;//One more than eyeApps (default and base layer for all apps)
mouseX = 0;
mouseY = 0;

var eyeKeyDown = 0;
document.oncontextmenu = function(e) { if(IEversion == 0) { e.preventDefault(); e.cancelBubble = true; } return false; }
document.onkeydown = function (e) { var e = new xEvent(e); if (e.which) { eyeKeyDown = e.which; } else { eyeKeyDown = e.keyCode; } }
document.onkeyup = function () { eyeKeyDown = 0; }

//For fix Internet explorer <6 png24 no alpha.
function fixPNG(img,type){
	if (IEversion > 0 && IEversion < 7) {
		var myImage = document.getElementById(img);
		if (myImage && myImage.src != 'index.php?extern=apps/eyeX/gfx/spacer.gif') {
			if (!type) {
				type = 'scale';
			}
			myImage.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + myImage.src + "', sizingMethod='" + type + "')";
			myImage.src = 'index.php?extern=apps/eyeX/gfx/spacer.gif'; // This file never change so we don't need EXTERN_CACHE_VERSION here.
		}
	}
}

//== eyeCursor Section ==
var isEyeCursorActivated = false;

//== (eyeCursor) Loading cursor Section ==
//Here is the "loading" special cursor that informs the user that a
//request has been sent and is processed by the server
var loadingRequests = 0;
function checkLoading() {
	if (loadingRequests <= 0) {
		loadingRequests = 0;
		oApps.style.cursor = 'auto';
	}
	else {
		oApps.style.cursor = 'url(index.php?version='+EXTERN_CACHE_VERSION+'&theme=1&extern=images/desktop/loadingcursor/loading.cur), wait';
	}
	return true;
}
//This function is called by the sendMsg() function.
//It makes the "loading" cursor appear and increase the number
//of loading request by one
function notifyLoadingRequest() {
	loadingRequests++;
	checkLoading();
	return true;
}
//This function is called by the localEngine() function.
//It makes the "loading" cursor disappear if the request
//was the last one waiting and decreases the number of loading
//request by one
function notifyEndOfLoadingRequest() {
	loadingRequests--;
	checkLoading();
	return true;
}
//This function can be used to force the "loading" cursor to
//reset and hide it
function resetLoadingRequests() {
	loadingRequests = 0;
	checkLoading();
	return true;
}

if (navigator.appVersion.indexOf("Mac")!=-1) {
	document.onmousemove = function (e) {
		if (IEversion == 0) {
		  mouseX = e.pageX;
		  mouseY = e.pageY;
		}
		if (IEversion > 0) {
		  mouseX = event.clientX + document.body.scrollLeft;
		  mouseY = event.clientY + document.body.scrollTop;
		}
		if(typeof('oCursor')!='undefined' && loadingRequests > 0) {
			oCursor.style.left = mouseX+10+'px';
			oCursor.style.top = mouseY-14+'px';
		}
	}
}
//== (eyeCursor) End of Loading cursor Section ==
//== End of eyeCursor Section ==
//change the opacity with callbacks 0 -100 for exmaple
function updateOpacity(id, init, end, time, callback) {
	var time = Math.round(time / 100);
	var count = 0;

	if(init > end) {
		for(i = init; i >= end; i--) {
			setTimeout("updateOpacityOnce(" + i + ",'" + id + "')",(count * time));
			count++;
		}
		if (callback) {
			setTimeout(callback,(count * time));
		}
	} else if(init < end) {
		for(i = init; i <= end; i++) {
			setTimeout("updateOpacityOnce(" + i + ",'" + id + "')",(count * time));
			count++;
		}
		if(callback) {
			setTimeout(callback,(count * time));
		}
	}
}

//Update a div opacity (css3 opacity property or alpha filter in ie.
function updateOpacityOnce(opacity, id) {
	var object = xGetElementById(id);
 	object.style.opacity = (opacity / 100);
 	object.style.filter = "alpha(opacity=" + opacity + ")";
 	if (opacity == 0) {
 		object.style.display = "none";
 	} else{
 		if (object.style.display == "none") {
 			object.style.display = "block";
 		}
 	}
} 

//sendMsg is a ajax wrapper, send request to index.php with App checknum mgs and params (optional)
function sendMsg(checknum,msg,parameters) {
	var http_request = false;
	var url = 'index.php';
	if (window.XMLHttpRequest) { 
		http_request = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
        	http_request = new ActiveXObject("Msxml2.XMLHTTP");
     	} catch (e) {
        	try {
           	http_request = new ActiveXObject("Microsoft.XMLHTTP");
        	} catch (e) {}
     	}
  	}
  	if (!http_request) {
     	alert('Sorry, but eyeOS only works with AJAX capable browsers!');
     	return false;
  	}
  	http_request.onreadystatechange = function() {
        if (http_request.readyState == 4) {
        	if(http_request.responseText != 'pong') {
        		notifyEndOfLoadingRequest();
                try {
                    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async="false";
                    xmlDoc.loadXML(http_request.responseText);
                } catch(e) {
                    parser=new DOMParser();
                    parser.async="false";
                    xmlDoc=parser.parseFromString(http_request.responseText,"text/xml");
                }
                localEngine(xmlDoc);
        	}
        }
    }
    if (msg != 'ping' && msg != 'baseapp') {
    	notifyLoadingRequest();
    }
  	http_request.open('POST', url+'?checknum=' + checknum + '&msg=' + msg, true);
  	http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
  	http_request.send('params=' + encodeURIComponent(parameters));
}

//Add param to xml
function eyeParam(name,value,nocode) {
	myValue = new String(value);
	if(!nocode) {
		myValue = myValue.replace(/\</g,"&lt;");
		myValue = myValue.replace(/\>/g,"&gt;");
	}
	return '<'+name+'>'+myValue+'</'+name+'>';
}

//Load script dynamically
function dhtmlLoadScript(url)
{
   var e = document.createElement("script");
   e.src = url;
   e.type="text/javascript";
   document.getElementsByTagName("head")[0].appendChild(e);
}

//Load css dynamically
function dhtmlLoadCSS(url,id) {
	var oLink = document.createElement("link")
	oLink.setAttribute("href",url);
	oLink.setAttribute("rel","stylesheet");
	oLink.setAttribute("type","text/css"); 
	oLink.setAttribute("id",id);
	document.getElementsByTagName("head")[0].appendChild(oLink);
}

//Remove css dynamically
function dhtmlRemoveCSS(remid) {
	var oLink = document.getElementById(remid);
	if(oLink) {
		document.getElementsByTagName("head")[0].removeChild(oLink);
	} 
}

/*
*This functions parse the sendmsg response. 
*/
function localEngine(msg) {
	if(!msg) {
		return;
	}
	if(msg.hasChildNodes()) {
		var actions = msg.getElementsByTagName('action');
		var mySize = actions.length;
		for(count=0;count < mySize;count++) {
			try {
				task = actions[count].getElementsByTagName('task')[0].firstChild.nodeValue;
				
				if(task == 'createWidget') {						
					x = actions[count].getElementsByTagName('position')[0].getElementsByTagName('x')[0].firstChild.nodeValue;
					y = actions[count].getElementsByTagName('position')[0].getElementsByTagName('y')[0].firstChild.nodeValue;
					horiz = actions[count].getElementsByTagName('position')[0].getElementsByTagName('horiz')[0].firstChild.nodeValue;
					vert = actions[count].getElementsByTagName('position')[0].getElementsByTagName('vert')[0].firstChild.nodeValue;
					name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					checknum = actions[count].getElementsByTagName('checknum')[0].firstChild.nodeValue;
					father = actions[count].getElementsByTagName('father')[0].firstChild.nodeValue;
					widgetname = actions[count].getElementsByTagName('widgetname')[0].firstChild.nodeValue;
					cent = actions[count].getElementsByTagName('cent')[0].firstChild.nodeValue;
					try{
						eval (widgetname+"_show("+actions[count].getElementsByTagName('params')[0].firstChild.nodeValue+",'"+name+"','"+father+"','"+x+"','"+y+"','"+horiz+"','"+vert+"','"+checknum+"','"+cent+"');");
					}catch(err){
						
					}
				} else if(task == 'messageBox') {
					content = actions[count].getElementsByTagName('content')[0].firstChild.nodeValue;
					content = tinyMCE.entityDecode(content);
					type = actions[count].getElementsByTagName('type')[0].firstChild.nodeValue;
					if (!type || type == 1) {
						eyeMessageBoxShow(content);
					} else if (type == 2) {
						alert(content);
					}
				} else if(task == 'setValue') {
					content = actions[count].getElementsByTagName('content')[0].firstChild.nodeValue;
					widget = actions[count].getElementsByTagName('widget')[0].firstChild.nodeValue;
					if(document.getElementById(widget)) {
						document.getElementById(widget).value = content;
					}
				} else if(task == 'setValueB64') {
					content = actions[count].getElementsByTagName('content')[0].firstChild.nodeValue;
					widget = actions[count].getElementsByTagName('widget')[0].firstChild.nodeValue;
					if(document.getElementById(widget)) {
						document.getElementById(widget).value = Base64.decode(content);
					}
				} else if(task == 'concatValue') {
					content = actions[count].getElementsByTagName('content')[0].firstChild.nodeValue;
					widget = actions[count].getElementsByTagName('widget')[0].firstChild.nodeValue;
					if(document.getElementById(widget)) {
						document.getElementById(widget).value = document.getElementById(widget).value+content;
					}
				} else if(task == 'concatValueB64') {
					content = actions[count].getElementsByTagName('content')[0].firstChild.nodeValue;
					widget = actions[count].getElementsByTagName('widget')[0].firstChild.nodeValue;
					if(document.getElementById(widget)) {
						document.getElementById(widget).value = document.getElementById(widget).value+Base64.decode(content);
					}
				} else if(task == 'concatDiv') {												
					content = actions[count].getElementsByTagName('content')[0].firstChild.nodeValue;
					widget = actions[count].getElementsByTagName('widget')[0].firstChild.nodeValue;						
					if(document.getElementById(widget)) {
						document.getElementById(widget).innerHTML = document.getElementById(widget).innerHTML+content;
					}
				} else if(task == 'rawjs') {
					js = actions[count].getElementsByTagName('js')[0].firstChild.nodeValue;
					js=js.replace(/\n/,"");
					js=js.replace(/\r/,"");
					eval(js);
				} else if(task == 'setDiv') {
					content = actions[count].getElementsByTagName('content')[0].firstChild.nodeValue;
					name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					document.getElementById(name).innerHTML = content;
				} else if(task == 'loadScript') {
					url = actions[count].getElementsByTagName('url')[0].firstChild.nodeValue;
					dhtmlLoadScript(url);
				} else if(task == 'loadCSS') {
					url = actions[count].getElementsByTagName('url')[0].firstChild.nodeValue;
					id = actions[count].getElementsByTagName('id')[0].firstChild.nodeValue;
					dhtmlLoadCSS(url,id);
				} else if(task == 'removeCSS') {
					id = actions[count].getElementsByTagName('id')[0].firstChild.nodeValue;
					dhtmlRemoveCSS(id);
				} else if(task == 'removeWidget') {
					name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					removeWidget(name);
				} else if(task == 'createDiv') {
					name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					myClass = actions[count].getElementsByTagName('class')[0].firstChild.nodeValue;
					father = actions[count].getElementsByTagName('father')[0].firstChild.nodeValue;
					var myDiv = document.createElement('div');
					myDiv.setAttribute("id", name);
					myDiv.className = myClass;
					var divFather = document.getElementById(father);
					divFather.appendChild(myDiv);
				} else if(task == 'setWallpaper') {
					url = actions[count].getElementsByTagName('url')[0].firstChild.nodeValue;
					repeat = actions[count].getElementsByTagName('repeat')[0].firstChild.nodeValue;
					center = actions[count].getElementsByTagName('center')[0].firstChild.nodeValue;
					setWallpaper(url,repeat,center);
				} else if(task == 'updateCss') {
					var name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					var prop = actions[count].getElementsByTagName('property')[0].firstChild.nodeValue;
					var val = actions[count].getElementsByTagName('value')[0].firstChild.nodeValue;
					updateCss(name,prop,val);
				} else if(task == 'makeDrag') {
					var name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					var father = actions[count].getElementsByTagName('father')[0].firstChild.nodeValue;
					//We use try catch for evade the differents beteewn browsers
					try{
						var noIndex = actions[count].getElementsByTagName('noIndex')[0].firstChild;							
						makeDrag(name,father,'','','',noIndex);
					}catch(err){							
						makeDrag(name,father,'','','','');
					}						
				} else if(task == 'rawSendMessage') {
					var myMsg = actions[count].getElementsByTagName('msg')[0].firstChild.nodeValue;
					
					if(actions[count].getElementsByTagName('par')[0].firstChild){
						var myPar = actions[count].getElementsByTagName('par')[0].firstChild.nodeValue;
					}else{
						var myPar = '';
					}
					var myCheck = actions[count].getElementsByTagName('checknum')[0].firstChild.nodeValue;
					sendMsg(myCheck,myMsg,myPar);	
				} else if(task == 'addEvent') {
					var name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					var event = actions[count].getElementsByTagName('event')[0].firstChild.nodeValue;
					var func = actions[count].getElementsByTagName('func')[0].firstChild.nodeValue;
					var args = actions[count].getElementsByTagName('args')[0].firstChild.nodeValue;
					if(args == 0) {
						eval('document.getElementById("'+name+'").'+event+'=function(){'+func+'}');
					} else {
						eval('document.getElementById("'+name+'").'+event+'=function('+args+'){'+func+'}');
					}
				} else if(task == 'createLayer') {
					var name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					var myClass = actions[count].getElementsByTagName('class')[0].firstChild.nodeValue;
					var father = actions[count].getElementsByTagName('father')[0].firstChild.nodeValue;
					createLayer(name,father,myClass);
				} else if(task == 'removeLayer') {
					var name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
				 	removeLayer(name);
				} else if(task == 'showLayer') {
					var name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					showLayer(name);
				} else if(task == 'hideLayer') {
					var name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					hideLayer(name);
				} else if(task == 'fadeOutLayer') {
					var name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					var time = actions[count].getElementsByTagName('time')[0].firstChild.nodeValue;
					var startAlpha = actions[count].getElementsByTagName('startAlpha')[0].firstChild.nodeValue;
					var endAlpha = actions[count].getElementsByTagName('endAlpha')[0].firstChild.nodeValue;

					fadeOutLayer(name,startAlpha,endAlpha,time);
				} else if(task == 'fadeInLayer') {
					var name = actions[count].getElementsByTagName('name')[0].firstChild.nodeValue;
					var time = actions[count].getElementsByTagName('time')[0].firstChild.nodeValue;
					var startAlpha = actions[count].getElementsByTagName('startAlpha')[0].firstChild.nodeValue;
					var endAlpha = actions[count].getElementsByTagName('endAlpha')[0].firstChild.nodeValue;
					fadeInLayer(name,startAlpha,endAlpha,time);
				}
			} catch (err) {

			}
		}
	}
}

function checkEnterKey(e) {
	var characterCode;
	if(e.which) {
		characterCode = e.which;
	} else {
		characterCode = e.keyCode;
	}
	if(characterCode == 13) {
		return true;
	} else { 
		return false;
	}
}

//base64 class from webtoolkit
Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}

function setWallpaper(newWllp,repeat,center) {
	var wllp = document.getElementById('eyeWallpaper');

	wllp.style.backgroundImage = "url('"+newWllp+"')";
	
	if (repeat == 1) {
		wllp.style.backgroundRepeat = "repeat";
	} else {
		wllp.style.backgroundRepeat = "no-repeat";
	}
	
	if (center == 0) {
		wllp.style.backgroundPosition = "left top";
	} else {
		wllp.style.backgroundPosition = "center";
	}
}

function eyeMessageBoxShow(msg) {
	if (msg != "") {
		box = document.getElementById("eyeMessageBoxText");
		box.innerHTML = msg;
		if (IEversion < 7) {
			updateOpacity("eyeMessageBox", 0, 100, 1000);
		} else {
			document.getElementById("eyeMessageBox").style.visibility='visible';
		}
		setTimeout("eyeMessageBoxHid()",2000);
	}
}

function eyeMessageBoxHid() {
	box = document.getElementById("eyeMessageBoxText");
	var delayedEmptyText = 1;
	if (IEversion < 7) {
		if (document.getElementById("eyeMessageBox").style.opacity == 1) {
			updateOpacity("eyeMessageBox", 100, 0, 1000);
			delayedEmptyText = 1000;
		} else {
			updateOpacityOnce(0,"eyeMessageBox");
			delayedEmptyText = false;
		}
	} else {
		document.getElementById("eyeMessageBox").style.visibility='hidden';
	}
	if (delayedEmptyText) {
		setTimeout("box.innerHTML = ''",delayedEmptyText);
	}
}

function clickedScreen(e){
	var target = (e && e.target) || (event && event.srcElement);
	for(current in clickEvents) { 
		if (target.id != current) {
			if(clickEvents[current] != null) {
				for(var i=0; i < clickEvents[current]['friends'].length; i++ ){
					if(clickEvents[current]['friends'][i] == target.id) {
						return;
					}
				}
				eval(clickEvents[current]['code']);
			}
		}
	}
}

function addClickHandler(div,code) {
	clickEvents[div] = new Object();
	clickEvents[div]['code'] = code;
	clickEvents[div]['friends'] = new Array();
}

function addFriendClick(div,id) {
	clickEvents[div]['friends'].push(id);
}

function delClickHandler(div) {
	clickEvents[div] = null;
}

function getArrayArg(arg) {
	var ret = arg.split('""');
	var i;
	for(i=0;i<ret.length;i++) {
		var temp=ret[i].replace(/\\\"/,'"');
		temp=temp.replace(/\\\'/,"'");
		var last=ret[i];
		while(temp != last) {
			last=temp;
			temp = temp.replace(/\\\"/,'"');
			temp = temp.replace(/\\\'/,"'");
		}
		ret[i]=temp;
	}
	var myRet = new Array();
	i = 0;
	for (var x in ret) {
		if(ret[x] != "") {
			myRet[i] = ret[x];
			i++;
		}
	}
	return myRet;
}
zindex = 100;

function findPos(obj) {
	var curleft = 0;
	var curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return [curleft, curtop];
}

function createWidget (widgetid,fatherid,content,horiz,vert,wx,wy,wwidth,wheight,wclass,cent,sizeUnit,isVisible)
{
	var father = document.getElementById(fatherid);
	if (!father) {
		return;
	}
	if(!sizeUnit) {
		var unit = 'px';
	} else {
		var unit = sizeUnit;
	}

	var widget = document.createElement('div');
	widget.setAttribute("id", widgetid);
	widget.style.display = 'none';
	father.appendChild(widget);
	if (wclass) {
		widget.className = wclass;
	}
	if(content != "") {
			widget.appendChild(content);
	}
	widget.style.position = "absolute";

	if (parseInt(wwidth) > 0) {
		widget.style.width = wwidth+unit;
	}
	if (parseInt(wheight) > 0) {
		widget.style.height = wheight+unit;	
	}

	if (cent == 1 && widget.style.width) {
		/* Center Width */
		var widgetwidth = widget.style.width;
		var fatherwidth = xWidth(xGetElementById(fatherid)) / 2;

		widgetwidth = parseInt(widgetwidth.substr(0,widgetwidth.length - 2)) / 2;
		var styleLeft = fatherwidth - widgetwidth;
		if (styleLeft > 0) {
			if(IEversion > 0) {
				widget.style.left = styleLeft+"px";
				widget.style.right = styleLeft+"px";
			} else {
				widget.style.left = styleLeft+"px";	
			}
		}
		
		/* Center Height */
		var widgetheight = widget.style.height;
		var fatherheight = xHeight(xGetElementById(fatherid)) / 2;
		widgetheight = parseInt(widgetheight.substr(0,widgetheight.length - 2)) / 2;
		var styleTop = fatherheight - widgetheight;
		if (styleTop > 0) {
			widget.style.top = styleTop+"px";
		}
		
	} else if(cent == 2 && widget.style.width) {
		/* Center Width */
		var widgetwidth = widget.style.width;
		var fatherwidth = xWidth(xGetElementById(fatherid)) / 2;

		widgetwidth = widgetwidth.substr(0,widgetwidth.length - 2) / 2;
		var styleLeft = fatherwidth - widgetwidth;
		if (styleLeft > 0) {
			if(IEversion > 0) {
				widget.style.left = styleLeft+"px";
				widget.style.right = styleLeft+"px";
			} else {
				widget.style.left = styleLeft+"px";	
			}
		}
	} else if(cent == 3 && widget.style.height) {
		/* Center Height */
		var widgetheight = widget.style.height;
		var fatherheight = xHeight(xGetElementById(fatherid)) / 2;
		widgetheight = widgetheight.substr(0,widgetheight.length - 2) / 2;
		var styleTop = fatherheight - widgetheight;
		if (styleTop > 0) {
			widget.style.top = styleTop+"px";
		}
	} else if(cent == 4) {
		var fatherwidth = xWidth(xGetElementById(fatherid)) / 2;
		if(IEversion > 0) {
			widget.style.right = fatherwidth+"px";
		} else {
			widget.style.left = fatherwidth+"px";	
		}
		var fatherheight = xHeight(xGetElementById(fatherid)) / 2;
		widget.style.top = fatherheight+"px";
	} else if(cent == 5) {
		var fatherwidth = xWidth(xGetElementById(fatherid)) / 2;
		if(IEversion > 0) {
			widget.style.right = fatherwidth+"px";
		} else {
			widget.style.left = fatherwidth+"px";	
		}
	} else if(cent == 6) {
		var fatherheight = xHeight(xGetElementById(fatherid)) / 2;
		widget.style.top = fatherheight+"px";
	}
	
	if (wx >= 0) {
		if (horiz == 1) {
			if(cent == 1 || cent == 2 || cent == 4 || cent == 5) {
				var myX = widget.style.right;
				myX = myX.substring(0,myX.length-2);  
				myX = parseInt(myX);  
				wx = myX + parseInt(wx);
			}
			if(!isNaN(wx)) {
				widget.style.right = wx+"px";
			}
		} else {
			if(cent == 1 || cent == 2 || cent == 4 || cent == 5) {
				myX = widget.style.left;
				myX = myX.substring(0,myX.length-2);  
				myX = parseInt(myX);  
				wx= myX + parseInt(wx);
			}
			if(!isNaN(wx)) {
				widget.style.left = wx+"px";
			}
		}
	}
	
	if (wy >= 0) {
		if (vert == 1) {
			if(cent == 1 || cent == 3 || cent == 4 || cent == 6) {
				var myY = widget.style.bottom;
				myY = myY.substring(0,myY.length-2);  
				myY = parseInt(myY);  
				wy = myY + parseInt(wy);
			} 
			if(!isNaN(wx)) {
				widget.style.bottom = wy+"px";
			}
		} else {
			if(cent == 1 || cent == 3 || cent == 4 || cent == 6) {
				var myY = widget.style.top;
				myY = myY.substring(0,myY.length-2);  
				myY = parseInt(myY);  
				wy = myY + parseInt(wy);
			} 
			if(!isNaN(wx)) {
				widget.style.top = wy+"px";
			}
		}
	}
		
	if (isVisible == 0) {
		widget.style.display = 'none';
	} else {
		widget.style.display = 'block';
	}
	return widget;
}

function makeDrag (widgetid,father,afterfunction,checknum,content,noIndex) {
	var widget = xGetElementById(widgetid);
	var father = xGetElementById(father);
	if (!widget) {
		return;
	}
	xEnableDrag(widget,savePositions,barOnDrag,callafterfunction);

	widget.onmousedown = GoToTop; 
	xShow(widget);
	function GoToTop()
	{
		if (!noIndex) {
			xZIndex(widget, zindex);
			zindex++;
		}
	}
	
	function barOnDrag(e, mdx, mdy)
	{
		var x = xLeft(widget) + mdx;
		var y = xTop(widget) + mdy;
		var xright = xWidth(father) - xWidth(widget);
		var ybottom = xHeight(father) - xHeight(widget);
		if (x < 0) x = 0;
		if (y < 0) y = 0;
		if (x > xright) x = xright;
		if (y > ybottom) y = ybottom;
		xMoveTo(widget, x, y);
	}
	function savePositions()
	{
		firstX = xLeft(widget);
		firstY = xTop(widget);
	}
	function callafterfunction()
	{
		if (afterfunction) {
			if (content) {
				contentid = ',\''+content+'\'';
			} else {
				contentid = '';
			}
			eval (afterfunction+'(\''+widgetid+'\','+firstX+','+firstY+','+xLeft(widget)+','+xTop(widget)+',\''+checknum+'\''+contentid+');');
		}
	}

}

//REMOVE DESKTOP ICONS

function cleanDesktop(pid) {
	var prefix = pid+'_eyeDesk_icon_';
	var eyeapps = document.getElementById('eyeApps');
	var obj;
	for(var i=0 ; i < eyeapps.childNodes.length ; i++) {
		obj = eyeapps.childNodes[i];
		if (obj.id.indexOf(prefix) == 0 && (obj.className == 'eyeIcon' || obj.className == 'eyeContextMenu')) {
			eyeapps.removeChild(obj);
			i=0;
		}
	}
}

function removeWidget(widgetid) {
	var widget = document.getElementById(widgetid);
	if (widget) {
		widget.parentNode.removeChild(widget);	
	}
}

/** ------------- Layer Section -------------**/
function createLayer(name,father,layerClass){
	var myLayer = document.createElement('div');
	myLayer.setAttribute("id", name);
	myLayer.className = layerClass;
	myLayer.style.display = 'none';
	var divFather = document.getElementById(father);
	divFather.appendChild(myLayer);
}
function removeLayer(divid) {
	var father = document.getElementById('eyeScreen');//Hardcoded because all layer are child of eyeScreen
	var div = document.getElementById(divid);
	if (father && div) {
		father.removeChild(div);	
	}
}
function showLayer(layerId){
	var myLayer = document.getElementById(layerId);
	if(myLayer){
			myLayer.style.display = 'block';
			xZIndex(myLayer,zLayers);
			zLayers++;
	}
}
function hideLayer(layerId){
	var myLayer = document.getElementById(layerId);
	if(myLayer){
			myLayer.style.display = 'none';
			xZIndex(myLayer,1);//1 is because the minim of zLayer is 10.
	}
}
function fadeOutLayer(layerId,startAlpha,endAlpha,time){
	var myLayer = document.getElementById(layerId);
	if(myLayer){
			updateOpacityOnce(0,layerId);
			myLayer.style.display = 'block';
			//Up to layers
			xZIndex(myLayer,zLayers);
			zLayers++;
			updateOpacity(layerId, startAlpha, endAlpha, time,'');
	}
}
function fadeInLayer(layerId,startAlpha,endAlpha,time){
	var myLayer = document.getElementById(layerId);
	if(myLayer){
			//fadein alpha and then call hideLayer for set zindex etc
			var callback = 'hideLayer("'+layerId+'");';//Totaly hide  put tis optional? maybe
			updateOpacity(layerId, startAlpha, endAlpha, time,callback);
	}
}
function updateCss(widgetid,prop,val) {
	eval('document.getElementById("'+widgetid+'").style.'+prop+'="'+val+'";');
}

tinyMCE.init({
	mode : "specific_textareas",
	theme : "advanced",
	plugins : "advimage,inlinepopups,preview,print,table",
	theme_advanced_buttons1 : "fontselect,fontsizeselect,separator,bold,italic,underline,strikethrough,separator,sub,sup,separator,justifyleft,justifycenter,justifyright,justifyfull,separator,numlist,bullist,separator,outdent,indent",
	theme_advanced_buttons2 : "print,preview,separator,cut,copy,paste,separator,undo,redo,separator,tablecontrols,separator,image,separator,forecolor,backcolor",
	theme_advanced_buttons3 : "",
	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	auto_reset_designmode : true
});

//This is the entityDecode version from tinyMCE2, the new one crash some widgets :/
tinyMCE.entityDecode = function entityDecode(s) {
	var e = document.createElement("div");
	e.innerHTML = s;
	return !e.firstChild ? s : e.firstChild.nodeValue;
}

//---
//THE NEXT CODE IS TAKEN FROM A BSD LICENSED LIBRARY ---
//---

/*
Copyright (c) Copyright (c) 2007, Carl S. Yestrau All rights reserved.
Code licensed under the BSD License: http://www.featureblend.com/license.txt
Version: 1.0.2
*/
var FlashDetect = new function(){
	var self = this;
	self.installed = false;
	self.major = -1;
	self.minor = -1;
	self.revision = -1;
	self.revisionStr = "";
	self.activeXVersion = "";
	var activeXDetectRules = [
		{
			"name":"ShockwaveFlash.ShockwaveFlash.7",
			"version":function(obj){
				return getActiveXVersion(obj);
			}
		},
		{
			"name":"ShockwaveFlash.ShockwaveFlash.6",
			"version":function(obj){
				var version = "6,0,21";
				try{
					obj.AllowScriptAccess = "always";
					version = getActiveXVersion(obj);
				}catch(err){}
				return version;
			}
		},
		{
			"name":"ShockwaveFlash.ShockwaveFlash",
			"version":function(obj){
				return getActiveXVersion(obj);
			}
		}
	];
	var getActiveXVersion = function(activeXObj){
		var version = -1;
		try{
			version = activeXObj.GetVariable("$version");
		}catch(err){}
		return version;
	};
	var getActiveXObject = function(name){
		var obj = -1;
		try{
			obj = new ActiveXObject(name);
		}catch(err){}
		return obj;
	};
	var parseActiveXVersion = function(str){
		var versionArray = str.split(",");//replace with regex
		return {
			"major":parseInt(versionArray[0].split(" ")[1], 10),
			"minor":parseInt(versionArray[1], 10),
			"revision":parseInt(versionArray[2], 10),
			"revisionStr":versionArray[2]
		};
	};
	var parseRevisionStrToInt = function(str){
		return parseInt(str.replace(/[a-zA-Z]/g, ""), 10) || self.revision;
	};
	self.majorAtLeast = function(version){
		return self.major >= version;
	};
	self.FlashDetect = function(){
		if(navigator.plugins && navigator.plugins.length>0){
			var type = 'application/x-shockwave-flash';
			var mimeTypes = navigator.mimeTypes;
			if(mimeTypes && mimeTypes[type] && mimeTypes[type].enabledPlugin && mimeTypes[type].enabledPlugin.description){
				var desc = mimeTypes[type].enabledPlugin.description;
				var descParts = desc.split(' ');//replace with regex
				var majorMinor = descParts[2].split('.');
				self.major = parseInt(majorMinor[0], 10);
				self.minor = parseInt(majorMinor[1], 10); 
				self.revisionStr = descParts[3];
				self.revision = parseRevisionStrToInt(self.revisionStr);
				self.installed = true;
			}
		}else if(navigator.appVersion.indexOf("Mac")==-1 && window.execScript){
			var version = -1;
			for(var i=0; i<activeXDetectRules.length && version==-1; i++){
				var obj = getActiveXObject(activeXDetectRules[i].name);
				if(typeof obj == "object"){
					self.installed = true;
					version = activeXDetectRules[i].version(obj);
					if(version!=-1){
						var versionObj = parseActiveXVersion(version);
						self.major = versionObj.major;
						self.minor = versionObj.minor; 
						self.revision = versionObj.revision;
						self.revisionStr = versionObj.revisionStr;
						self.activeXVersion = version;
					}
				}
			}
		}
	}();
};
FlashDetect.release = "1.0.2";