//global variables
var marketArray = []	//name, stake, commission

/************************************Functions*****************************/

function getMarkets() {

	console.log("filling market array");		//FIXME:debug

	var name;
	var stake;
	var commission;

	//TODO: update to actually pull from contract
	for(var i = 0; i < 3; i++) {
		if (i == 0) {
			name = "Ben's Market";
			stake = 1000;
			commission = 5;
		}

		if (i == 1) {
			name = "Braden's Market";
			stake = 1500;
			commission = 20;
		}

		if (i == 2) {
			name = "Martin's Market";
			stake = 3000;
			commission = 30;
		}

		marketArray[i] = [name, stake, commission];

		console.log(marketArray[i][0] + " " + marketArray[i][2]);		//FIXME: debug

	}
}

function displayMarkets() {
	if(marketArray.length != 0) {
		var panel = document.querySelector('#marketButtons');
		var newHtml = "";
		var str1;
		var str2;

		for(var i = 0; i < marketArray.length; i++) {
			str1 = newHtml;
			str2 = "<button class='grayNameBtn'><p class='leftFloat'>" + marketArray[i][0] + "</p><p class='rightFloat'>" + marketArray[i][1] + " WEEV</p></button>";
			newHtml = str1.concat(str2);
		}

		console.log(newHtml);		//FIXME: debug

		panel.innerHTML = newHtml;
	}
}

function displayMarketInfo(id) {
	if(marketArray.length != 0) {
		var panel = document.querySelector('#marketInfo');
		var newHtml = "<div class='infoLabel'><p class='leftFloat'>Stake</p><p class='rightFloat'>" + marketArray[id][1] + " WEEV</p></div><div class='infoLabel'><p class='leftFloat'>Commission</p><p class='rightFloat'>" + marketArray[id][2] + " WEEV</p></div>";

		console.log(newHtml);		//FIXME: debug

		panel.innerHTML = newHtml;
	}
}


/*************************************UI*******************************/

window.onload=function() {

	//immediately fill array and display
	getMarkets();
	displayMarkets();

	$("#infoPanel").hide();

	// handle clicking of a registry
	var marketButtons = document.querySelector('#marketButtons');

	marketButtons.addEventListener('click', function(event) {

		//check if creator of event is child of the panel
		if(event.target.parentNode === marketButtons) {
			// get rid of left panel
			$('#titlePanel').hide();

			let string  = event.target.innerHTML;

			let beginning = string.search(">") + 1;
			let end = string.search("</p>");

			let selectedMarket = string.slice(beginning, end);
			let msg = "Selected " + selectedMarket;
			console.log(msg);

			//move list of registers from right to left
			$('#marketPanel').addClass("left").removeClass("right");

			//load info for chosen marketplace
			let buttonId = $('.grayNameBtn').index(event.target);
			displayMarketInfo(buttonId);

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
