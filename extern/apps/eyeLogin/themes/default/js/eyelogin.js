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
newUserOpen = 0;

function toggleNewUser(pid) {
	if(newUserOpen == 0) {
		newUserOpen = 1;
		document.getElementById(pid+"_createUserWND_Container").style.display='block';
		if(IEversion == 0) {
			updateOpacityOnce(0,pid+'_createUserWND_Container');
			updateOpacity(pid+'_createUserWND_Container',0,100,500,'');
		}
	} else {
		newUserOpen = 0;
		if(IEversion == 0) {
			updateOpacity(pid+'_createUserWND_Container',100,0,500,'');
		} else {
			document.getElementById(pid+'_createUserWND_Container').style.display='none';
		}
	}
	document.getElementById(pid+"_tboxUsername").focus();
}
function tryLogin(pid, checknum) {
	sendMsg(checknum, 'doLogin', eyeParam('tboxUsername',document.getElementById(pid+'_tboxUsername').value)+eyeParam('tboxPassword',document.getElementById(pid+'_tboxPassword').value)+eyeParam('selectSessionLanguage',document.getElementById(pid+'_selectSessionLanguage').value));
}
function tryNewUser(pid, checknum) {
	sendMsg(checknum, 'doCreateUser', eyeParam('tboxNewUsername',document.getElementById(pid+'_tboxNewUsername').value)+eyeParam('tboxNewPassword1',document.getElementById(pid+'_tboxNewPassword1').value)+eyeParam('tboxNewPassword2',document.getElementById(pid+'_tboxNewPassword2').value)+eyeParam('selectNewLanguage',document.getElementById(pid+'_selectNewLanguage').value));
}
function eyeLogin_badLogin(pid) {
	document.getElementById(pid+'_tboxUsername').disabled=true;
	document.getElementById(pid+'_tboxPassword').disabled=true;
	movecount=0;
	document.getElementById(pid + '_eyeLoginWND_Container').style.left = String(xClientWidth() / 2) + 'px';
	document.getElementById(pid + '_eyeLoginWND_Container').style.top = String(xClientHeight() / 2) + 'px';
	setTimeout("mover('"+pid+"_eyeLoginWND_Container','"+pid+"')", 500);
}
function eyeLogin_successLogin(pid, checknum) {
	updateOpacity(pid+'_eyeLoginWND_Container',100,0,150,'clean('+checknum+','+pid+');');
}
function clean(checknum, pid) {
	lbl = document.getElementById(pid+'_lblPoweredByeyeOS_Container');
	lbl.parentNode.removeChild(lbl);
	img = document.getElementById(pid+'_eyeLoginWND_Container');
	img.parentNode.removeChild(img);
	sendMsg(checknum,"successLogin");
}
function mover(widget,pid) {
	var left = xLeft(widget);
	xLeft(widget,left+20);
	if(movecount > 0) {
		xLeft(widget,left+40);
	}
	if(movecount > 5) {
		document.getElementById(widget).style.left = '50%';
		document.getElementById(widget).style.top = '50%';
		document.getElementById(pid+'_tboxUsername').disabled=false;
		document.getElementById(pid+'_tboxPassword').disabled=false;
		return;
	}
	movecount++;
	setTimeout("movel('"+widget+"','"+pid+"')",50);
}
function movel(widget,pid) {
	var left = xLeft(widget);
	var top = xTop(widget);
	xLeft(widget,left-40);
	setTimeout("mover('"+widget+"','"+pid+"')",50);
}