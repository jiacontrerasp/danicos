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
eyeDock_handled = new Object();
eyeDockLastObject = new Object();
eyeDockMenuState = "";
eyeDockLastId = "";
eyeDockLastPid = "";
eyeDockLastIcon = "";
init_eyeDock($checknum);

	
function init_eyeDock(checknum) {
	sendMsg(checknum,'Launch','');
}
	
function dockButOnClick(id,icon,pid) {
	
	var but = document.getElementById(pid+'_'+id);
	if(!eyeDock_handled[id]) {
		eyeDockClickHandler(id,pid);
	}
	if (eyeDockMenuState == "") {
		dockActiveMenu(id,icon,but,pid);
	} else {      
		if(eyeDockLastObject.id == but.id)
		{
			dockDesactiveMenu(pid);
		}else{
			dockDesactiveMenu(pid);//One var redundance..., desactive old menu
			dockActiveMenu(id,icon,but,pid);		
		}
	}
}

function eyeDockClickHandler(id,pid){
	eyeDock_handled[id] = id;
	var openedDiv = pid+'_'+id;
	var codeClick = "if (eyeDockMenuState == '"+id+"') { dockDesactiveMenu('"+pid+"');}";	
	addClickHandler(openedDiv,codeClick);
}

//Ever desactive the last menu.
function dockDesactiveMenu(pid){
	eyeDockLastObject.src="index.php?version="+EXTERN_CACHE_VERSION+"&extern=images/apps/eyeDock/icons/"+eyeDockLastIcon+".png&theme=1";	
	if (eyeDockLastPid) {
		fixPNG(pid+'_'+eyeDockLastPid);
	}
	eyeDockLastPid = "";
	document.getElementById(pid+'_menu_items_'+eyeDockLastId).style.display = 'none';
	eyeDockMenuState = "";
}

function dockActiveMenu(id,icon,but,pid){
	document.getElementById(pid+'_menu_items_'+id).style.display = 'block';
	eyeDockLastPid = id;
	eyeDockMenuState = id;	
	eyeDockLastObject = but;
	eyeDockLastIcon = icon;
	eyeDockLastId = id;
}

//Private position functions.
function dockCenter(id,pid) {
	/* Center Width */
	var dockContentWidth = document.getElementById(pid+'_eyeDockContent').style.width;	
	var fatherwidth = xWidth(xGetElementById('eyeApps')) / 2;
	var	dockContentWidth = dockContentWidth.substr(0,dockContentWidth.length - 2) / 2;
	var styleLeft = fatherwidth - dockContentWidth;
	if (styleLeft > 0) {
		document.getElementById(pid+'_'+id).style.left = styleLeft+"px";	
	}
}

function dockAdvanceXIcon(id,intx,pid,menuNum) {
	var dockIconLeft = document.getElementById(pid+'_'+id);
	var margin = 110;
	var toRest = 31*menuNum;
	margin = margin-toRest;
	margin = margin*(-1);	
	dockIconLeft.style.left = "50%";
	dockIconLeft.style.marginLeft = margin+"px";	
}

function dockMenuHeight(id,inty,pid) {
	var dockMenu = document.getElementById(pid+'_'+id).style;
	dockMenu.height = inty+"px";
}

function dockButOnMouseOver(id,icon,pid) {
	var but = document.getElementById(pid+'_'+id);
	but.src="index.php?version="+EXTERN_CACHE_VERSION+"&extern=images/apps/eyeDock/icons/"+icon+"_x.png&theme=1";
	fixPNG(pid+'_'+id);
	var txt = document.getElementById(pid+'_menu_text_items_'+id);
	txt.style.display="block";
	if (eyeDockMenuState != "") {
		dockDesactiveMenu(pid);
		dockActiveMenu(id,icon,but,pid);
		if(!eyeDock_handled[id]) {
			eyeDockClickHandler(id,pid);
		}
	}
}

function dockButOnMouseOut(id,icon,pid) {
	var txt = document.getElementById(pid+'_menu_text_items_'+id);
	txt.style.display="none";
	if(eyeDockMenuState == id)
	{
		return;
	}
	var but = document.getElementById(pid+'_'+id);
	but.src="index.php?version="+EXTERN_CACHE_VERSION+"&extern=images/apps/eyeDock/icons/"+icon+".png&theme=1";
	fixPNG(pid+'_'+id);
}