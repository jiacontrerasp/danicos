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
//Load sounds
function eyeMp3_loadSound(myPid,path){
	document.getElementById(myPid+"_flashPlayer").SetVariable("jsValue",path);
    document.getElementById(myPid+"_flashPlayer").SetVariable("jsMethod","newfile");
}
