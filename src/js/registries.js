// arrays to hold test data
var regArray = [];		//name, stake, stakePerReg, stakePerVal, stakePerArb

/****************************Functions******************************/

function getRegistries() {

	console.log("filling registry array");		//FIXME:debug

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

// used for populating fields needed to add a registry from JSON file
function populateFields() {
	// TODO load in file later, focus on parsing now
	var data = [
		{
			"name": "Stake Amount",
			"data": "num",
			"placeholder": "Enter stake",
			"description": "Some WEEV must be given as collateral to discourage malicious behavior"
		},
		{
			"name": "Registry Name",
			"data": "str",
			"placeholder": "Enter name",
			"description": "Provide a name to identify and describe the registry"
		},
		{
			"name": "Stake per Registration",
			"data": "num",
			"placeholder": "Enter stake",
			"description": "Set the amount in WEEV device owners must stake as collateral when registering a device. This helps ensure the data can be trusted"
		},
		{
			"name": "Stake per Validator",
			"data": "num",
			"placeholder": "Enter stake",
			"description": "Set the amount in WEEV validator's must stake as collateral. Validator's check that devices conform to registry standards"
		},
		{
			"name": "Stake per Arbiter",
			"data": "num",
			"placeholder": "Enter stake",
			"description": "Set the amount in WEEV arbiter's must stake as collateral. Arbiters serve the purpose of dispute resolution on specific transaction types"
		}
	]
	var retArray = [];
	for (var key in data) {
		var fields = data[key];
		var fieldArray = [];
		for (var el in fields) {
			fieldArray.push(fields[el].replace(/^\s+|\s+$/g,''));
		}
		retArray.push(fieldArray);
	}
	return retArray;
}

// updates slide to match current field data
function updateFields(name, placeholder, description, input) {
	document.getElementById('fieldName').textContent = name;
	document.getElementById("fieldInput").placeholder = placeholder;
	document.getElementById('fieldDescription').textContent = description;
	document.getElementById("fieldInput").value = input;
}

// verify user gave correct input before advancing slides and storing data
function verifyInput(inputType) {
	var input = document.getElementById("fieldInput");
	if (inputType.toLowerCase() === "str") {
		return typeof input.value === typeof ""
		|| input.value === "";
	}
	else if (inputType.toLowerCase() === "num") {
		return !isNaN(input.value) || input.value === "";
	}
	else if (inputType.toLowerCase() === "bool") {
		return input.value.toLowerCase().replace(/^\s+|\s+$/g,'') === "true"
		|| input.value.toLowerCase().replace(/^\s+|\s+$/g,'') === "false"
		|| input.value === "";
	}
	else {
		console.log("Invalid input type");
		return false;
	}
}

// confirm stored input is of the correct type before finishing creation
function confirmInput(storedVal, valType) {
	if (valType.toLowerCase() === "str") {
		return typeof storedVal === typeof ""
		&& storedVal !== "";
	}
	else if (valType.toLowerCase() === "num") {
		return !isNaN(storedVal) && storedVal !== "";
	}
	else if (inputType.toLowerCase() === "bool") {
		return storedVal.toLowerCase().replace(/^\s+|\s+$/g,'') === "true"
		|| storedVal.toLowerCase().replace(/^\s+|\s+$/g,'') === "false";
	}
	else {
		console.log("Invalid input type");
		return false;
	}
}

// confirms the stored input for each field is valid
// returns -1 if all are valid
// returns index of the invalid stored input otherwise
function executeFinish(inputArray, fieldArray) {
	for (var i = 0; i < inputArray.length; i++) {
		if (!confirmInput(inputArray[i], fieldArray[i][1])) {
			return i;
		}
	}
	return -1;
}

// populate the finish display before displaying
// assume input array and field array are the same size
function populateFinish(inputArray, fieldArray) {
	var newHtml = ""
	for (var i = 0; i < inputArray.length; i++) {
		str1 = newHtml;
		str2 = "<div class='infoLabel confirm'><p class='leftFloat'>" + fieldArray[i][0] + "</p><p class='rightFloat'>" + inputArray[i] + "</p></div>";
		newHtml = str1.concat(str2);
	}
	document.querySelector('#confirmData').innerHTML = newHtml;
}

// throws an error stating the desired inputType
function inputError(inputType) {
	var errorAlert = document.getElementById("inputAlert");
	var alertPrompt = document.getElementById("alertPrompt");
	var input = document.getElementById("fieldInput");
	if (inputType.toLowerCase() === "str") {
		alertPrompt.textContent = "Please enter a string of text";
	}
	else if (inputType.toLowerCase() === "num") {
		alertPrompt.textContent = "Please enter a number";
	}
	else if (inputType.toLowerCase() === "bool") {
		alertPrompt.textContent = "Please enter either 'true' or 'false'";
	}
	else {
		alertPrompt.textContent = "Invalid input type given";
	}
	$("#inputAlert").show();
	input.style.opacity = 0;
}

// close error prompt
function closeInputError() {
	$("#inputAlert").hide();
	document.getElementById("fieldInput").style.opacity = 1;
}

/***************************UI***************************************/


window.onload=function() {
	// immediately load registries into array
	getRegistries();
	displayRegistries();

	$("#infoPanel").hide();
	$('#createPanel').hide();
	$('#finishBox').hide();

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

	//handle creating a new registry

	var addButton = document.querySelector('#addRegBtn');
	var currentFieldNum = 0;
	var fieldArray = populateFields();
	var inputArray = [];

	// generate correct number of 'slides'
	document.getElementById('createName').textContent = "Create Registry";
	var dotRow = document.querySelector('#dotRow');
	var newHtml = "";
	for (var i = 0; i < fieldArray.length; i++) {
		str1 = newHtml;
		str2 = "<a><span class='purpleDot' id='dot" + i + "'></span></a>";
		newHtml = str1.concat(str2);
	}
	dotRow.innerHTML = newHtml;

	// setup listeners to handle moving through slides and updating data
	for (var i = 0; i < fieldArray.length; i++) {
		var thisDot = document.getElementById("dot" + i);
		var input = document.getElementById("fieldInput");
		thisDot.addEventListener('click', function(event) {
			if (verifyInput(fieldArray[currentFieldNum][1])) {
				event.target.style.opacity = 1;
				if (event.target.id != "dot" + currentFieldNum) {
					document.getElementById('dot' + currentFieldNum).style.opacity = 0.6;
				}
				inputArray[currentFieldNum] = input.value.replace(/^\s+|\s+$/g,'');
				currentFieldNum = +event.target.id.split("dot")[1];
				updateFields(
					fieldArray[currentFieldNum][0],
					fieldArray[currentFieldNum][2],
					fieldArray[currentFieldNum][3],
					inputArray[currentFieldNum]
				);
				if (currentFieldNum === 0) {
					document.getElementById("prevBtn").style.opacity = 0.3;
				}
				else {
					document.getElementById("prevBtn").style.opacity = 1.0;
				}
				console.log(inputArray);
			}
			else {
				inputError(fieldArray[currentFieldNum][1]);
			}
		});
		// add blank elements to input array
		inputArray.push(input.value);
	}
	var leftArrow = document.getElementById("prevBtn");
	leftArrow.addEventListener('click', function(event) {
		if (verifyInput(fieldArray[currentFieldNum][1])) {
			if (currentFieldNum > 0) {
				document.getElementById('dot' + currentFieldNum).style.opacity = 0.6;
				inputArray[currentFieldNum] = document.getElementById("fieldInput").value.replace(/^\s+|\s+$/g,'');
				currentFieldNum = currentFieldNum - 1;
				document.getElementById('dot' + currentFieldNum).style.opacity = 1.0;
				updateFields(
					fieldArray[currentFieldNum][0],
					fieldArray[currentFieldNum][2],
					fieldArray[currentFieldNum][3],
					inputArray[currentFieldNum]
				);
				if (currentFieldNum === 0) {
					document.getElementById("prevBtn").style.opacity = 0.3;
				}
			}
		}
		else {
			inputError(fieldArray[currentFieldNum][1]);
		}
		console.log(inputArray);
	});
	var rightArrow = document.getElementById("nextBtn");
	rightArrow.addEventListener('click', function(event) {
		if (verifyInput(fieldArray[currentFieldNum][1])) {
			if (currentFieldNum === fieldArray.length - 1) {
				inputArray[currentFieldNum] = document.getElementById("fieldInput").value.replace(/^\s+|\s+$/g,'');
				var finishResult = executeFinish(inputArray, fieldArray);
				// all stored values are correct, display the finish screen
				if (finishResult === -1) {
					// populate finish screen fields to match input fields
					populateFinish(inputArray, fieldArray);
					// display finish screen
					$('#createSlides').hide();
					$('#finishBox').show();
				}
				else {
					document.getElementById('dot' + currentFieldNum).style.opacity = 0.6;
					currentFieldNum = finishResult;
					document.getElementById('dot' + currentFieldNum).style.opacity = 1.0;
					updateFields(
						fieldArray[currentFieldNum][0],
						fieldArray[currentFieldNum][2],
						fieldArray[currentFieldNum][3],
						inputArray[currentFieldNum]
					);
					inputError(fieldArray[currentFieldNum][1]);
					if (currentFieldNum === 0) {
						document.getElementById("prevBtn").style.opacity = 0.3;
					}
				}
			}
			else if (currentFieldNum < fieldArray.length - 1) {
				document.getElementById('dot' + currentFieldNum).style.opacity = 0.6;
				inputArray[currentFieldNum] = document.getElementById("fieldInput").value.replace(/^\s+|\s+$/g,'');
				currentFieldNum = currentFieldNum + 1;
				document.getElementById('dot' + currentFieldNum).style.opacity = 1.0;
				updateFields(
					fieldArray[currentFieldNum][0],
					fieldArray[currentFieldNum][2],
					fieldArray[currentFieldNum][3],
					inputArray[currentFieldNum]
				);
			}
			// at the end, check to restore full opacity
			if (currentFieldNum > 0) {
				document.getElementById("prevBtn").style.opacity = 1.0;
			}
		}
		else {
			inputError(fieldArray[currentFieldNum][1]);
		}
		console.log(inputArray);
	});

	addButton.addEventListener('click', function(event) {

		//hide info panel
		$('#infoPanel').hide();
		$('#registryPanel').hide();
		$('#titlePanel').hide();
		$('#createPanel').show();

		// reset input array and currentField counter
		document.getElementById('dot' + currentFieldNum).style.opacity = 0.6;
		for (var i = 0; i < inputArray.length; i++) {
			inputArray[i] = "";
		}
		currentFieldNum = 0;
		document.getElementById("fieldInput").value = "";
		document.getElementById("prevBtn").style.opacity = 0.3;

		$('#dotRow').show();

		//set data for the first field
		document.getElementById('dot0').style.opacity = 1;
		updateFields(
			fieldArray[currentFieldNum][0],
			fieldArray[currentFieldNum][2],
			fieldArray[currentFieldNum][3],
			inputArray[currentFieldNum]
		);

	});

	//handle canceling from creation and returning to mainpage
	var cancelAddButton = document.querySelector('#cancelAddBtn');

	cancelAddBtn.addEventListener('click', function(event) {

		//hide info panel
		$('#infoPanel').hide();
		$('#registryPanel').show().addClass("right").removeClass("left");
		$('#titlePanel').show();
		$('#createPanel').hide();

		// reset input array and currentField counter
		document.getElementById('dot' + currentFieldNum).style.opacity = 0.6;
		for (var i = 0; i < inputArray.length; i++) {
			inputArray[i] = "";
		}
		currentFieldNum = 0;
		document.getElementById("fieldInput").value = "";

	});

	//handle canceling from creation and returning to mainpage
	var finishAddButton = document.querySelector('#finishAddBtn');

	finishAddBtn.addEventListener('click', function(event) {

		//hide info panel
		$('#infoPanel').hide();
		$('#registryPanel').show().addClass("right").removeClass("left");
		$('#titlePanel').show();
		$('#createSlides').show();
		$('#createPanel').hide();
		$('#finishBox').hide();

		// reset input array and currentField counter
		document.getElementById('dot' + currentFieldNum).style.opacity = 0.6;
		for (var i = 0; i < inputArray.length; i++) {
			inputArray[i] = "";
		}
		currentFieldNum = 0;
		document.getElementById("fieldInput").value = "";
	});

	//handle canceling from confirmation and returning to slideshow
	var backAddButton = document.querySelector('#backAddBtn');

	backAddBtn.addEventListener('click', function(event) {
		// hide finish screen
		$('#createSlides').show();
		$('#finishBox').hide();
	});

}
