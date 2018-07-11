// hold info about devices for user
var regArray = [];			//[regName, regStake]
var deviceArray = [];		//[regIndex][deviceName, devStake, devType]

var selectedRegId;			//track which reg we're in

/******************************Functions******************************/

function getDevices() {
	console.log("please put on your 3d glasses (this array is gross)");		//FIXME:debug

	var regName;
	var regStake;
	var deviceName;
	var devStake;
	var devType;

	//TODO: pull actual data from contract
	for(var i = 0; i < 3; i++) {
		if (i == 0) {
			regName = "Ben's Reg";
			regStake = 1500;
			deviceName = "Ben's Camera"
			devStake = 20;
			devType = "Camera";
		}

		if (i == 1) {
			regName = "Braden's Reg";
			regStake = 1000;
			deviceName = "Braden's Car"
			devStake = 15;
			devType = "Car";
		}

		if (i == 2) {
			regName = "Martin's Reg";
			regStake = 2000;
			deviceName = "Martin's Fridge"
			devStake = 5;
			devType = "Refridgerator";
		}

		//fill array in the most disgusting way possible
		regArray[i] = [regName, regStake];
		for(var j = 0; j < 1; j++) {
			deviceArray[i] = [];
			deviceArray[i][j] = [deviceName, devStake, devType];

			console.log(deviceArray[i][j][0] + " " + deviceArray[i][j][1] + " " + deviceArray[i][j][2]);		//FIXME: debug
		}

		console.log(regArray[i][0] + " " + regArray[i][1]);		//FIXME:debug

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

		console.log(newHtml);		//FIXME: debug

		panel.innerHTML = newHtml;
	}
}

function displayDevices(id) {
	if(deviceArray[id].length != 0) {
		//fill deviceButtons
		var panel = document.querySelector('#deviceButtons');
		var newHtml = "";
		var str1;
		var str2;
		for (var i = 0; i < deviceArray[id].length; i++) {
			str1 = newHtml;
			str2 = "<button class='grayNameBtn'><p class='leftFloat'>" + deviceArray[id][i][0] + "</p><p class='rightFloat'>" + deviceArray[id][i][1] + " WEEV</p></button>";
			newHtml = str1.concat(str2);
		}

		console.log(newHtml);		//FIXME: debug

		panel.innerHTML = newHtml;
	}
}

function displayDeviceInfo(id) {
	if(deviceArray[selectedRegId].length != 0) {
		//fill deviceInfo
		var panel = document.querySelector('#deviceInfo');

		var newHtml = "<div class='infoLabel'><p class='leftFloat'>Stake</p><p class='rightFloat'>" + deviceArray[selectedRegId][id][1] + " WEEV</p></div><div class='infoLabel'><p class='leftFloat'>Device Type</p><p class='rightFloat'>" + deviceArray[selectedRegId][id][2] + "</p></div>";

		console.log(newHtml);			//FIXME:debug

		panel.innerHTML = newHtml;
	}
}

// extracts necessary inputs from json file
function populateSlides() {
	// TODO load in file later, focus on parsing now
	var data = [
		{
		    "slide1": {
		        "title": "Register Device",
		        "field1": {
		            "name": "Select Registry",
		            "data": "str",
		            "placeholder": "Enter registry name"
		        },
		        "description": "Select a registry to register the device to"
		    },
		    "slide2": {
		        "title": "Register Device",
		        "field1": {
		            "name": "Stake Amount",
		            "data": "num",
		            "placeholder": "Enter stake"
		        },
		        "description": "Some WEEV must be given as collateral to discourage malicious behavior"
		    },
		    "slide3": {
		        "title": "Device Information",
		        "field1": {
		            "name": "Device Name",
		            "data": "str",
		            "placeholder": "E.g. Device_0d87"
		        },
		        "field2": {
		            "name": "Device ID",
		            "data": "str",
		            "placeholder": "E.g. '4aa0c302c6138118'"
		        },
		        "field3": {
		            "name": "Device Product Name",
		            "data": "str",
		            "placeholder": "E.g. 'CHARGE_SENS_1_8'"
		        },
		        "field4": {
		            "name": "Device Version",
		            "data": "str",
		            "placeholder": "E.g. '1.50.361A'"
		        },
		        "field5": {
		            "name": "Device Serial",
		            "data": "str",
		            "placeholder": "E.g. 'LR04M1CA'"
		        },
		        "field6": {
		            "name": "Device Description",
		            "data": "str",
		            "placeholder": "E.g. 'Small thermal sensor'"
		        },
				"description": "Provide device information useful for identification purposes"
		    },
		    "slide4": {
		        "title": "Device Specifications",
				"field1": {
		            "name": "Device Manufacturer",
		            "data": "str",
		            "placeholder": "E.g. 'Sensor HW Ltd.'"
		        },
		        "field2": {
		            "name": "Device CPU",
		            "data": "str",
		            "placeholder": "E.g. 'ARM Cortex-A53'"
		        },
		        "field3": {
		            "name": "Device has TrustZone",
		            "data": "bool",
		            "placeholder": "'true' or 'false'"
		        },
		        "field4": {
		            "name": "Device has WiFi",
		            "data": "bool",
		            "placeholder": "'true' or 'false'"
		        },
		        "field5": {
		            "name": "Device Sensors",
		            "data": "str",
		            "placeholder": "E.g. 'electricity, current'"
		        },
		        "field6": {
		            "name": "Device Datatype",
		            "data": "str",
		            "placeholder": "E.g. 'numeric'"
		        },
				"description": "Provide device specifications to ensure it conforms to the selected registry standards"
		    }
		}
	]

	// extra slow parsing
	var retArray = [];
	var slides = data[0];
	for (var num in slides) {
		var singleSlide = slides[num];
		var slideArray = [];
		for (var field in singleSlide) {
			if (field == "title" || field == "description") {
				slideArray.push(singleSlide[field]);
			}
			else {
				var fieldArray = [];
				for (var el in singleSlide[field]) {
					fieldArray.push(singleSlide[field][el]);
				}
				slideArray.push(fieldArray);
			}
		}
		retArray.push(slideArray);
	}
	return retArray;
}

// creates and returns an array initialized with empty strings for each field
function populateInputs(slideArr) {
	var retArray = [];
	for (var slide in slideArr) {
		var slideFields = [];
		for (var i = 1; i < slideArr[slide].length - 1; i++) {
			slideFields.push("");
		}
		retArray.push(slideFields);
	}
	return retArray;
}

// updates the slide information
function updateSlide(slideArr, inputArr) {
	if (slideArr.length > 3) {
		$('#multiField').show();
		$('#singleField').hide();
		updateMultiFields(slideArr, inputArr);
	}
	else {
		$('#multiField').hide();
		$('#singleField').show();
		updateSingleFields(slideArr, inputArr[0]);
	}
}

// TODO handle creating the fields needed, e.g. instead of standard input
// maybe use two buttons, one yes and the other no, for bool fields

// used to populate text for single field slides
function updateSingleFields(slideArr, storedInput) {
	var title = slideArr[0];
	var field = slideArr[1];
	var description = slideArr[2];
	var fieldName = field[0];
	var fieldPH = field[2];
	document.getElementById('slideName').textContent = title;
	document.getElementById('fieldNameSingle').textContent = fieldName;
	document.getElementById("fieldInputSingle").placeholder = fieldPH;
	document.getElementById("fieldInputSingle").value = storedInput;
	document.getElementById('fieldDescriptionSingle').textContent = description;
	$('#fieldInputSingle').removeClass("error");
}

// used to populate text for multi field slides
function updateMultiFields(slideArr, inputArr) {
	var title = slideArr[0];
	var description = slideArr[slideArr.length - 1];
	document.getElementById('slideName').textContent = title;
	document.getElementById('fieldDescriptionMulti').textContent = description;
	// can't handle more than 6 inputs on one multi field slide
	// plus 2 for the title and description
	if (slideArr.length > 8) {
		// TODO more rigorous error checking here
		console.log("Critical json format error. More than 6 fields on slide!")
	}
	for (var i = 1; i < slideArr.length - 1; i++) {
		var fieldName = slideArr[i][0];
		var fieldPH = slideArr[i][2];
		document.getElementById("fieldInput" + i).value = inputArr[i - 1];
		document.getElementById("fieldInput" + i).placeholder = fieldPH;
		document.getElementById("fieldName" + i).textContent = fieldName;
		$('#fieldInput' + i).removeClass("error");
	}
}

// handles storing user input values
function updateInput(inputArr) {
	if (inputArr.length > 1) {
		if (inputArr.length > 6) {
			// TODO more rigorous error checking here
			console.log("Critical json format error. More than 6 fields on slide!")
		}
		else {
			for (var i = 0; i < inputArr.length; i++) {
				inputArr[i] = document.getElementById("fieldInput" + (i + 1)).value.replace(/^\s+|\s+$/g,'');
			}
		}
	}
	else {
		inputArr[0] = document.getElementById("fieldInputSingle").value.replace(/^\s+|\s+$/g,'');
	}
}

// verify user gave correct input before advancing slides and storing data
function verifyInput(slideArr) {
	// loop through the slide fields
	if (slideArr.length > 3) {
		for (var i = 1; i < slideArr.length - 1; i++) {
			var fieldArr = slideArr[i];
			var inputType = fieldArr[1];
			var input = document.getElementById("fieldInput" + i);
			if (!verifySingleInput(inputType, input)) {
				return false;
			}
		}
		return true;
	}
	else {
		var fieldArr = slideArr[1];
		var inputType = fieldArr[1];
		var input = document.getElementById("fieldInputSingle");
		return verifySingleInput(inputType, input);
	}
}

// verify user gave correct input before advancing from a single field slide
function verifySingleInput(inputType, input) {
	if (inputType.toLowerCase() === "str") {
		return typeof input.value === typeof "" || input.value === "";
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
		// TODO better error throwing in this case
		console.log("Invalid input type");
		return false;
	}
}

// disables the left arrow button
function disablePrevBtn() {
	document.getElementById("prevBtnSingle").style.opacity = 0.3;
	document.getElementById("prevBtnMulti").style.opacity = 0.3;
}

// enables the left arrow button
function enablePrevBtn() {
	document.getElementById("prevBtnSingle").style.opacity = 0.8;
	document.getElementById("prevBtnMulti").style.opacity = 0.8;
}

// handles displaying error messages in certain fields
function inputError(slideArr) {
	// loop through the slide fields
	if (slideArr.length > 3) {
		for (var i = 1; i < slideArr.length - 1; i++) {
			var fieldArr = slideArr[i];
			var inputType = fieldArr[1];
			var input = document.getElementById("fieldInput" + i);
			if (!verifySingleInput(inputType, input)) {
				errorSingleInput(inputType, input);
			}
		}
	}
	else {
		var fieldArr = slideArr[1];
		var inputType = fieldArr[1];
		var input = document.getElementById("fieldInputSingle");
		errorSingleInput(inputType, input);
	}
}

/**
 *
 * Handles displaying a specific error message, depending upon inputType, in
 * the correct field, specified by the input parameter.
 */
function errorSingleInput(inputType, input) {
	//var alertPrompt = document.getElementById("alertPrompt");
	if (inputType.toLowerCase() === "str") {
		//alertPrompt.textContent = "Please enter a string of text";
		input.value = "";
		input.placeholder = "Please enter some text";
		$('#' + input.id).addClass("error");
	}
	else if (inputType.toLowerCase() === "num") {
		//alertPrompt.textContent = "Please enter a number";
		input.value = "";
		input.placeholder = "Please enter a number";
		$('#' + input.id).addClass("error");
	}
	else if (inputType.toLowerCase() === "bool") {
		//alertPrompt.textContent = "Please enter either 'true' or 'false'";
		input.value = "";
		input.placeholder = "Please enter 'true' or 'false'";
		$('#' + input.id).addClass("error");
	}
	else {
		//alertPrompt.textContent = "Invalid input type given";
		input.value = "";
		input.placeholder = "Invalid input in json file";
		$('#' + input.id).addClass("error");
	}
}

// ensure all stored input values are valid
function executeFinish(slideArr, inputArr) {
	for (var i = 0; i < slideArr.length; i++) {
		var slide = slideArr[i];
		var errorArr = [];
		for (var j = 1; j < slide.length - 1; j++) {
			var slideField = slide[j];
			console.log(inputArr[i][j - 1]);
			console.log(slideField[1]);
			if (!confirmSingleInput(inputArr[i][j - 1], slideField[1])) {
				errorArr.push(j);
			}
		}
		if (errorArr.length > 0) {
			return [i, errorArr];
		}
	}
	return -1;
}

// returns whether the stored input value is of the correct valType
function confirmSingleInput(storedVal, valType) {
	if (valType.toLowerCase() === "str") {
		return typeof storedVal === typeof "" && storedVal !== "";
	}
	else if (valType.toLowerCase() === "num") {
		return !isNaN(storedVal) && storedVal !== "";
	}
	else if (valType.toLowerCase() === "bool") {
		return storedVal.toLowerCase().replace(/^\s+|\s+$/g,'') === "true"
				|| storedVal.toLowerCase().replace(/^\s+|\s+$/g,'') === "false";
	}
	else {
		// TODO better error checking
		console.log("Invalid input type");
		return false;
	}
}

// displays errors for all fields that didn't pass input type confirmation
function confirmInputError(slideArr, errorFields) {
	if (slideArr.length > 3) {
		for (var i = 0; i < errorFields.length; i++) {
			var index = +errorFields[i];
			var field = slideArr[index];
			var fieldType = field[1];
			console.log(+index + 1);
			var input = document.getElementById("fieldInput" + index);
			console.log(input);
			errorSingleInput(fieldType, input);
		}
	}
	else {
		var field = slideArr[1];
		var fieldType = field[1];
		var input = document.getElementById("fieldInputSingle");
		errorSingleInput(fieldType, input);
	}
}

// populates the finish box with stored user inputs
function populateFinish(inputArr, slideArr) {
	var newHtml = ""
	for (var i = 0; i < slideArr.length; i++) {
		var slide = slideArr[i];
		for (var j = 1; j < slide.length - 1; j++) {
			str1 = newHtml;
			str2 = "<div class='infoLabel confirm'><p class='leftFloat'>" + slide[j][0] + "</p><p class='rightFloat'>" + inputArr[i][j - 1] + "</p></div>";
			newHtml = str1.concat(str2);
		}
	}
	document.querySelector('#confirmData').innerHTML = newHtml;
}


/*******************************UI*******************************/

window.onload=function() {
	// immediately fill arrays and display regs
	getDevices();
	displayRegistries();

	$("#devicesPanel").hide();
	$('#infoPanel').hide();
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

			//display devices for that registry
			selectedRegId = $('.grayNameBtn').index(event.target);
			displayDevices(selectedRegId);

			//show device list on right side and hide back button
			document.getElementById("regName").textContent = selectedReg;
			$("#devicesPanel").show();
			$('#goBack').hide();

			//TODO: will have to load actual devices
		}
	});

	//handle selecting device
	var deviceButtons = document.querySelector('#deviceButtons');

	deviceButtons.addEventListener('click', function(event) {
		if(event.target.parentNode === deviceButtons) {
			//get rid of left panel
			$('#registryPanel').hide();

			let string  = event.target.innerHTML;

			let beginning = string.search(">") + 1;
			let end = string.search("</p>");

			let selectedDevice = string.slice(beginning, end);
			let msg = "Selected " + selectedDevice;
			console.log(msg);

			//move list of devices to left and show back button
			$('#devicesPanel').addClass('left').removeClass('right');
			$('#goBack').show();

			//show device info
			let buttonId = $('.grayNameBtn').index(event.target) - regArray.length;			//cheeky
			displayDeviceInfo(buttonId);

			//show info panel on right
			document.getElementById('deviceName').textContent = selectedDevice;
			$('#infoPanel').show();

			//TODO: will get actual device info

		}
	});

	//handle going back from device info to list of registries
	var backButton = document.querySelector('#goBack');

	backButton.addEventListener('click', function(event) {
		//hide info panel
		$('#infoPanel').hide();

		//move device list to right and hide back button
		$('#devicesPanel').addClass('right').removeClass('left');
		$('#goBack').hide();

		//show registry list
		$('#registryPanel').show();
	});

	//handle removing device
	var removeButton = document.querySelector('#removeBtn');

	removeButton.addEventListener('click', function(event) {

		//hide info panel
		$('#infoPanel').hide();

		//TODO: eventually actual logic to remove
	});

	//handle adding device
	var addButton = document.querySelector('#addBtn');

	addButton.addEventListener('click', function(event) {

		//hide info panel
		$('#infoPanel').hide();
		$("#devicesPanel").hide();
		$("#titlePanel").hide();
		$('#registryPanel').hide();
		$('#createPanel').show();

		// initialize creation panel
		updateSlide(slideArray[0], inputArray[0]);
		disablePrevBtn();
		document.getElementById('dot0').style.opacity = 1.0;
	});

	//handle creating a new registry
	var currentSlideNum = 0;
	var slideArray = populateSlides();
	var inputArray = populateInputs(slideArray);

	// generate correct number of 'slides'
	var dotRow = document.querySelector('#dotRow');
	var newHtml = "";
	for (var i = 0; i < slideArray.length; i++) {
		str1 = newHtml;
		str2 = "<a><span class='purpleDot' id='dot" + i + "'></span></a>";
		newHtml = str1.concat(str2);
	}
	dotRow.innerHTML = newHtml;

	// setup listeners to handle moving through slides and updating data
	// setup clickable dots
	for (var i = 0; i < slideArray.length; i++) {
		var thisDot = document.getElementById("dot" + i);
		thisDot.addEventListener('click', function(event) {
			if (verifyInput(slideArray[currentSlideNum])) {
				event.target.style.opacity = 1;
				if (event.target.id != "dot" + currentSlideNum) {
					document.getElementById('dot' + currentSlideNum).style.opacity = 0.6;
				}
				updateInput(inputArray[currentSlideNum]);
				currentSlideNum = +event.target.id.split("dot")[1];
				updateSlide(slideArray[currentSlideNum], inputArray[currentSlideNum]);
				if (currentSlideNum === 0) {
					disablePrevBtn();
				}
				else {
					enablePrevBtn();
				}
			}
			else {
				// handle displaying error
				inputError(slideArray[currentSlideNum]);
			}
		});
	}

	// setup clickable previous buttons
	var leftArrowSingle = document.getElementById("prevBtnSingle");
	var leftArrowMulti = document.getElementById("prevBtnMulti");
	leftArrowSingle.addEventListener('click', function(event) {
		leftArrowListener();
	});
	leftArrowMulti.addEventListener('click', function(event) {
		leftArrowListener();
	});

	// listener for left arrow previous buttons
	function leftArrowListener() {
		if (verifyInput(slideArray[currentSlideNum])) {
			if (currentSlideNum > 0) {
				document.getElementById('dot' + currentSlideNum).style.opacity = 0.6;
				updateInput(inputArray[currentSlideNum]);
				currentSlideNum = currentSlideNum - 1;
				document.getElementById('dot' + currentSlideNum).style.opacity = 1.0;
				updateSlide(slideArray[currentSlideNum], inputArray[currentSlideNum]);
				if (currentSlideNum === 0) {
					disablePrevBtn();
				}
				else {
					enablePrevBtn();
				}
			}
		}
		else {
			// handle displaying error
			inputError(slideArray[currentSlideNum]);
		}
	}


	// setup clickable next buttons
	var rightArrowSingle = document.getElementById("nextBtnSingle");
	var rightArrowMulti = document.getElementById("nextBtnMulti");
	rightArrowSingle.addEventListener('click', function(event) {
		rightArrowListener();
	});
	rightArrowMulti.addEventListener('click', function(event) {
		rightArrowListener();
	});

	// listener for right arrow next buttons
	function rightArrowListener() {
		if (verifyInput(slideArray[currentSlideNum])) {
			if (currentSlideNum === slideArray.length - 1) {
				updateInput(inputArray[currentSlideNum]);
				// handle displaying finish box
				var finishResult = executeFinish(slideArray, inputArray);
				console.log("finish result:");
				console.log(finishResult);
				if (finishResult === -1) {
					// populate finish screen fields to match input fields
					populateFinish(inputArray, slideArray);
					// display finish screen
					$('#createSlides').hide();
					$('#finishBox').show();
					$('#createPanel').show();
				}
				else {
					document.getElementById('dot' + currentSlideNum).style.opacity = 0.6;
					currentSlideNum = finishResult[0];
					document.getElementById('dot' + currentSlideNum).style.opacity = 1.0;
					updateSlide(slideArray[currentSlideNum], inputArray[currentSlideNum]);
					// display errors
					confirmInputError(slideArray[currentSlideNum], finishResult[1]);
					if (currentSlideNum === 0) {
						disablePrevBtn();
					}
				}
			}
			else if (currentSlideNum < slideArray.length - 1) {
				document.getElementById('dot' + currentSlideNum).style.opacity = 0.6;
				updateInput(inputArray[currentSlideNum]);
				currentSlideNum = currentSlideNum + 1;
				document.getElementById('dot' + currentSlideNum).style.opacity = 1.0;
				updateSlide(slideArray[currentSlideNum], inputArray[currentSlideNum]);
				enablePrevBtn();
			}
		}
		else {
			// handle displaying error
			inputError(slideArray[currentSlideNum]);
		}
	}

	//handle canceling during adding device
	var cancelAddButton = document.querySelector('#cancelAddBtn');

	cancelAddButton.addEventListener('click', function(event) {

		//hide info panel
		$('#infoPanel').hide();
		$("#devicesPanel").hide();
		$("#titlePanel").show();
		$('#registryPanel').show().addClass('right').removeClass('left');;
		$('#createPanel').hide();

		// reset input array and currentField counter
		document.getElementById('dot' + currentSlideNum).style.opacity = 0.6;
		for (var i = 0; i < inputArray.length; i++) {
			for (var j = 0; j < inputArray[i].length; j++) {
				inputArray[i][j] = "";
			}
		}
		currentSlideNum = 0;
	});

	//handle canceling from confirmation and returning to slideshow
	var backAddButton = document.querySelector('#backAddBtn');

	backAddBtn.addEventListener('click', function(event) {
		// hide finish screen
		updateSlide(slideArray[currentSlideNum], inputArray[currentSlideNum]);
		$('#createPanel').show();
		$('#createSlides').show();
		$('#finishBox').hide();
	});

	finishAddBtn.addEventListener('click', function(event) {

		//hide info panel
		$('#infoPanel').hide();
		$('#registryPanel').show().addClass("right").removeClass("left");
		$('#titlePanel').show();
		$('#createSlides').show();
		$('#createPanel').hide();
		$('#finishBox').hide();

		// reset input array and currentField counter
		document.getElementById('dot' + currentSlideNum).style.opacity = 0.6;
		for (var i = 0; i < inputArray.length; i++) {
			for (var j = 0; j < inputArray[i].length; j++) {
				inputArray[i][j] = "";
			}
		}
		currentSlideNum = 0;

		// TODO update blockchain
	});


}
