// arrays to hold test data
var regArray = [];		//name, stake, stakePerReg, stakePerVal, stakePerArb

/****************************Functions******************************/

function getRegistries() {
	//maybe have to clear array at start?

	console.log("filling registry array")		//FIXME:debug

	var name;
	var stake;
	var stakePerReg;
	var stakePerVal;
	var stakePerArb;

	//TODO: update so actually pulls data from contract
	//will probably need to take users address as an argument
	for(var i = 0; i < 3; i++) {
		if (i == 0) {
			name = "Ben's Reg";
			stake = 1500;
			stakePerReg = 10;
			stakePerVal = 5;
			stakePerArb = 20;
		}

		if (i == 1) {
			name = "Braden's Reg";
			stake = 1000;
			stakePerReg = 15;
			stakePerVal = 10;
			stakePerArb = 10;
		}

		if (i == 2) {
			name = "Martin's Reg";
			stake = 2000;
			stakePerReg = 40;
			stakePerVal = 20;
			stakePerArb = 10;
		}

		//fill array
		regArray[i] = [name, stake, stakePerReg, stakePerVal, stakePerArb];
		console.log(regArray[i][0] + " " + regArray[i][4]);		//FIXME:debug
	}
}

function displayRegistries() {
	if(regArray.length != 0) {
		//fill registryButtons
		var panel = document.querySelector('#registryButtons');
		var newHtml = "";
		var str1;
		var str2;
		for (var i = 0; i < regArray.length; i++) {
			str1 = newHtml;
			str2 = "<button class='grayNameBtn'><p class='leftFloat'>" + regArray[i][0] + "</p><p class='rightFloat'>" + regArray[i][1] + " WEEV</p></button>";
			newHtml = str1.concat(str2);
		}

		console.log(newHtml);			//FIXME: debug

		panel.innerHTML = newHtml;

	} else {

	}
}

function displayRegistryInfo(id) {
	if(regArray.length != 0) {
		//fill registryButtons
		var panel = document.querySelector('#registryInfo');

		var newHtml = "<div class='infoLabel'><p class='leftFloat'>Stake</p><p class='rightFloat'>" + regArray[id][1] + " WEEV</p></div><div class='infoLabel'><p class='leftFloat'>Stake per Registration</p><p class='rightFloat'>" + regArray[id][2] + " WEEV</p></div><div class='infoLabel'><p class='leftFloat'>Stake per Validator</p><p class='rightFloat'>" + regArray[id][3] + " WEEV</p></div><div class='infoLabel'><p class='leftFloat'>Stake per Arbiter</p><p class='rightFloat'>" + regArray[id][4] + " WEEV</p></div>";

		console.log(newHtml);			//FIXME: debug

		panel.innerHTML = newHtml;

	} else {

	}
}


/***************************UI***************************************/


window.onload=function() {
	// immediately load registries into array
	getRegistries();
	displayRegistries();

	$("#infoPanel").hide();

	// handle clicking of a registry
	var registryButtons = document.querySelector('#registryButtons');

	registryButtons.addEventListener('click', function(event) {

		//check if creator of event is child of the panel
		if(event.target.parentNode === registryButtons) {
			// get rid of left panel
			$('#titlePanel').hide();

			let string  = event.target.innerHTML;

			let beginning = string.search(">") + 1;
			let end = string.search("</p>");

			let selectedReg = string.slice(beginning, end);
			let msg = "Selected " + selectedReg;
			console.log(msg);

			//move list of registers from right to left
			$('#registryPanel').addClass("left").removeClass("right");

			// load info for chosen registry
			let buttonId = $('.grayNameBtn').index(event.target);
			console.log("buttonId: " + buttonId);			//FIXME: debug
			displayRegistryInfo(buttonId);

			//show info panel on right side
			document.getElementById("regName").textContent = selectedReg;
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
