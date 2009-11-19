function highlightStars(starsPrefix, i, max) {
	i = parseInt(i);
	max = parseInt(max);
	var j = 0;
	for(j; j <= i ; j++) {
		document.getElementById(starsPrefix+'_'+j+'_IMG').src="index.php?version="+EXTERN_CACHE_VERSION+"&extern=apps/eyeReport/gfx/star_selected.png";
	}
	for(j;j < max ; j++) {
		document.getElementById(starsPrefix+'_'+j+'_IMG').src="index.php?version="+EXTERN_CACHE_VERSION+"&extern=apps/eyeReport/gfx/star_notselected.png";
	}
}