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
eyeBarMenuState = 0;
eyeSystem_menu="";
eyeSystem_handled = 0;
init_eyeBar($myPid,$checknum);
function ButOnClick(e,pid,checknum) {
	var eyeSystem_menu=pid+'_eyeMenu';
	var eyeSystem_but=pid+'_eyeBut';
	var but = document.getElementById(eyeSystem_but);
	if(eyeSystem_handled == 0) {
		eyeSystemClickHandler(pid);
	}
	if (eyeBarMenuState == 0) {
		but.src="index.php?version="+EXTERN_CACHE_VERSION+"&theme=1&extern=images/apps/eyeBar/pressed.png";
		fixPNG(eyeSystem_but);
		
		if(IEversion == 0) {
			updateOpacityOnce(0,pid+'_eyeMenu');
			document.getElementById(eyeSystem_menu).style.visibility='visible';
			updateOpacity(pid+'_eyeMenu', 0, 100, 350,'');
		} else {
			showIEmenu(pid);
		}
		eyeBarMenuState = 1;	
	} else {
		but.src="index.php?version="+EXTERN_CACHE_VERSION+"&theme=1&extern=images/apps/eyeBar/default.png";
		fixPNG(eyeSystem_but);
		if(IEversion == 0) {
			updateOpacity(pid+'_eyeMenu', 100, 0, 150,'eyeSystem_hideMenu('+pid+');');
		} else {
			hideIEmenu(pid);
		}
		eyeBarMenuState = 0;
	}
}

function ButOnMouseOver(e,pid,checknum) {
	var eyeSystem_but=pid+'_eyeBut';
	if (eyeBarMenuState == 0) {
		var but = document.getElementById(pid+"_eyeBut");
		but.src="index.php?version="+EXTERN_CACHE_VERSION+"&theme=1&extern=images/apps/eyeBar/hover.png";
		fixPNG(eyeSystem_but);
	}
}

function ButOnMouseOut(e,pid,checknum) {
	var eyeSystem_but=pid+'_eyeBut';
	if (eyeBarMenuState == 0) {
		var but = document.getElementById(pid+"_eyeBut");
		but.src="index.php?version="+EXTERN_CACHE_VERSION+"&theme=1&extern=images/apps/eyeBar/default.png";
		fixPNG(eyeSystem_but);
	}
}

function eyeSystem_hideMenu(pid) {
	var eyeSystem_menu=pid+'_eyeMenu';
	document.getElementById(eyeSystem_menu).style.visibility='hidden';
}

function eyeSystemClickHandler(pid) {
	eyeSystem_handled = 1;
	var openedDiv = pid+"_eyeMenu_content";
	var codeClick = "if (eyeBarMenuState == 1) { document.getElementById('"+pid+"_eyeBut').src='index.php?version="+EXTERN_CACHE_VERSION+"&theme=1&extern=images/apps/eyeBar/default.png'; if(IEversion==0) {updateOpacity('"+pid+"_eyeMenu', 100, 0, 150,'eyeSystem_hideMenu("+pid+")'); } else {fixPNG('"+pid+"_eyeBut');hideIEmenu("+pid+"); } eyeBarMenuState = 0; }";
	addClickHandler(openedDiv,codeClick);
	addFriendClick(openedDiv,pid+'_eyeBut');
	addFriendClick(openedDiv,pid+'_eyeMenu_top');
	addFriendClick(openedDiv,pid+'_eyeMenu_bot');
	addFriendClick(openedDiv,pid+'_eyeMenu_cen');
}

function init_eyeBar(pid,checknum) {
	var obj=document.getElementById(pid+'_eyeBut');
	obj.onmousedown=function(e) {ButOnClick(e,pid,checknum);};
	obj.onmouseover=function(e) {ButOnMouseOver(e,pid,checknum);};
	obj.onmouseout=function(e) {ButOnMouseOut(e,pid,checknum)};
}

function showIEmenu(pid) {
	if (IEversion > 6) {
		var eyeSystem_menu=pid+'_eyeMenu';
		document.getElementById(eyeSystem_menu).style.visibility='visible';
	} else {
		var eyeSystem_menu=pid+'_eyeMenu';
		document.getElementById(eyeSystem_menu).style.visibility='visible';
	}

}

function hideIEmenu(pid) {
	if (IEversion > 6) {
		var eyeSystem_menu=pid+'_eyeMenu';
		document.getElementById(eyeSystem_menu).style.visibility='hidden';
	} else {
		var eyeSystem_menu=pid+'_eyeMenu';
		document.getElementById(eyeSystem_menu).style.visibility='hidden';
	}

}
function updateMenuStateOn(menu) {
	var imgmenu = document.getElementById(menu + "_miniIcon");
	var imgpath = 'index.php?version='+EXTERN_CACHE_VERSION+'&theme=1&extern=images/apps/eyeBar/icons/';
	var textmenu = document.getElementById(menu + "_textId");
	textmenu.style.color = '#ffffff';
	imgmenu.src = imgpath+imgmenu.alt+'_on.png';
	fixPNG(menu + "_miniIcon");
}
function updateMenuStateOff(menu) {
	var imgmenu = document.getElementById(menu + "_miniIcon");
	var imgpath = 'index.php?version='+EXTERN_CACHE_VERSION+'&theme=1&extern=images/apps/eyeBar/icons/';
	var textmenu = document.getElementById(menu + "_textId");
	textmenu.style.color = '#dddddd';
	imgmenu.src = imgpath + imgmenu.alt + '.png';
	fixPNG(menu + "_miniIcon");
}