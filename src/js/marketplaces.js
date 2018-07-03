window.onload=function() {

	$("#infoPanel").hide();

	// handle clicking of a registry
	var marketButtons = document.querySelector('#marketButtons');

	marketButtons.addEventListener('click', function(event) {

		//check if creator of event is child of the panel
		if(event.target.parentNode === marketButtons) {
			// get rid of left panel
			$('#titlePanel').hide();

			let string  = event.target.innerHTML;

			let beginning = string.search(">") + 2;
			let end = string.search("</p>");

			let selectedMarket = string.slice(beginning, end);
			let msg = "Selected " + selectedMarket;
			console.log(msg);

			//move list of registers from right to left
			$('#marketPanel').addClass("left").removeClass("right");

			//show info panel on right side
			document.getElementById("marketName").textContent = selectedMarket;
			$("#infoPanel").show();

			//TODO: eventually will pull actual info about registry and display that

		}
	});

	//handle closing registry
	var closeButton = document.querySelector('#closeBtn');

	closeButton.addEventListener('click', function(event) {

		//hide info panel
		$('#infoPanel').hide();

		//TODO: eventually logic to delete registry goes here

	});


}
