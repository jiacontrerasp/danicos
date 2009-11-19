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

function eyeFTP_logConsole(pid, text_b64, maxDisplayedLines, type, debug) {
	maxDisplayedLines = parseInt(maxDisplayedLines);
	maxDisplayedLines = (isNaN(maxDisplayedLines) || maxDisplayedLines < 1)? 100 : maxDisplayedLines;
	var consoleObj = document.getElementById(pid+"_eyeFTP_log_CTNR");
	if (consoleObj == null) {
		return;
	}
	
	if (debug) {
		consoleObj.innerHTML += "<br>"+Base64.decode(text_b64);
	}
	else {
		var now = new Date();
		var hours = (now.getHours() > 9)? now.getHours() : "0"+now.getHours();
		var minutes = (now.getMinutes() > 9)? now.getMinutes() : "0"+now.getMinutes();
		var seconds = (now.getSeconds() > 9)? now.getSeconds() : "0"+now.getSeconds();
		
		var newText = "<span class=\"eyeFTP_logStyle_"+type+"\">";
		newText += "<img src=\"index.php?version="+EXTERN_CACHE_VERSION+"&theme=1&extern=images/apps/eyeFTP/10x10/"+type+".png\" style=\"vertical-align: middle;\" />&nbsp;";
		newText += "["+hours+":"+minutes+":"+seconds+"] ";
		newText += Base64.decode(text_b64)+"</span>";	
		
		var lines = consoleObj.innerHTML.split("<br>");
		if(lines.length >= (maxDisplayedLines -1)) {
			var existingText = "";
			for(var i = (lines.length - maxDisplayedLines +1); i < lines.length; i++) {
				existingText += lines[i]+"<br>";
			}
			consoleObj.innerHTML = existingText+newText;
		}
		else {
			consoleObj.innerHTML += (consoleObj.innerHTML.length > 0)? "<br>"+newText : newText;
		}
	}
	consoleObj.scrollTop = consoleObj.scrollHeight;
}

function eyeFTP_clearConsole(pid) {
	var consoleObj = document.getElementById(pid+"_eyeFTP_log_CTNR");
	if (consoleObj == null) {
		return;
	}
	consoleObj.innerHTML = "";
}