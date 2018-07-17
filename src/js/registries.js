// arrays to hold test data
var regArray = [];		//name, stake, stakePerReg, stakePerVal, stakePerArb

// web3 and contract data
var web3Provider;
var contract_factory;
var factory_address = '0x6edb9a1e68258f1d7aebefb4fbd53c74f68031b7';
var contract_token;
var token_address = '0x21d6690715db82a7b11c17c7dda8cf7afac47fd7';

var slideArray = [];
var inputArray = [];
var currentSlideNum = 0;


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
	for(var i = 0; i < contract_factory.length; i++) {
		contract_factory.allRegistries(i, function(errCall, result) {
			if(result.owner == web3.eth.accounts[0]) {
				name = result.name;
				stake = result.
				//fill array
				regArray[i] = [name, stake];
				console.log(regArray[i][0] + " " + regArray[i][1]);		//FIXME:debug
			}
		});
	}
	console.log("finished filling array");
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
			str2 = "<button class='grayNameBtn'><span class='leftFloat'>" + regArray[i][0] + "</span><span class='rightFloat'>" + regArray[i][1] + " WEEV</span></button>";
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

// extracts necessary inputs from json file
function populateSlides() {
	var data = [
		{
		    "slide1": {
		        "title": "Add Registry",
		        "field1": {
		            "name": "Stake Amount",
		            "data": "num",
		            "placeholder": "Enter stake"
		        },
		        "description": "Some WEEV must be given as collateral to discourage malicious behavior"
		    },
		    "slide2": {
		        "title": "Add Registry",
		        "field1": {
		            "name": "Registry Name",
		            "data": "str",
		            "placeholder": "Enter name"
		        },
		        "description": "Provide a name to identify and describe the Registry"
		    },
		    "slide3": {
		        "title": "Add Registry",
		        "field1": {
		            "name": "Stake per Registration",
		            "data": "num",
		            "placeholder": "Enter stake"
		        },
				"description": "Set the amount in WEEV device owners must stake as collateral when registering a device. This helps ensure the data can be trusted"
		    },
            "slide4": {
		        "title": "Add Registry",
		        "field1": {
		            "name": "Stake per Validator",
		            "data": "num",
		            "placeholder": "Enter stake"
		        },
				"description": "Set the amount in WEEV validator's must stake as collateral. Validator's check that devices conform to registry standards"
		    },
            "slide5": {
		        "title": "Add Registry",
		        "field1": {
		            "name": "Stake per Arbiter",
		            "data": "num",
		            "placeholder": "Enter stake"
		        },
				"description": "Set the amount in WEEV arbiter's must stake as collateral. Arbiters serve the purpose of dispute resolution on specific transaction types"
		    }
		}
	];

	/* TODO read in from actual json files
	$.getJSON('json/registryFields.json', {}, function(data) {
		console.log(data);
		console.log(tdata);
		var retArray = [];
		for (var num in data) {
			var singleSlide = data[num];
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
		console.log(retArray);
		return retArray;
	});*/

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
	document.getElementById("nextBtnSingle").style.opacity = 0.8;
	document.getElementById("nextBtnMulti").style.opacity = 0.8;
}

// enables the left arrow button
function enablePrevBtn() {
	document.getElementById("prevBtnSingle").style.opacity = 0.8;
	document.getElementById("prevBtnMulti").style.opacity = 0.8;
	document.getElementById("nextBtnSingle").style.opacity = 0.8;
	document.getElementById("nextBtnMulti").style.opacity = 0.8;
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

/***************************UI***************************************/


window.onload=function() {
	//connect to web3 and load contracts
	if(typeof web3 !== 'undefined') {
		web3Provider = web3.currentProvider;
	} else {
		console.log('No web3? Use metamask');
	}

	web3 = new Web3(web3Provider);
	console.log(web3);

	$.getJSON('json/weeveFactory.json', function(data) {
		console.log("pulling factory contract");
		contract_factory = web3.eth.contract(data.abi).at(factory_address);
		console.log(contract_factory);
	});

	$.getJSON('json/weeveToken.json', function(data) {
		console.log("pulling token contract");
		contract_token = web3.eth.contract(data.abi).at(token_address);
		console.log(contract_token);
	});

	//wait a little
	setTimeout(function() {
		getRegistries();
		displayRegistries();
	}, 200);

	// immediately load registries into array

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
			let end = string.search("</span>");

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

	//handle adding device
	var addButton = document.querySelector('#addRegBtn');

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
	currentSlideNum = 0;
	slideArray = populateSlides();
	inputArray = populateInputs(slideArray);

	// generate correct number of 'slides'
	var dotRow = document.querySelector('#dotRow');
	var newHtml = "";
	for (var i = 0; i < slideArray.length; i++) {
		str1 = newHtml;
		str2 = "<a><span class='purpleDot' id='dot" + i + "' role='button' tabindex='0'></span></a>";
		newHtml = str1.concat(str2);
	}
	dotRow.innerHTML = newHtml;

	// setup listeners to handle moving through slides and updating data
	// setup clickable dots
	for (var i = 0; i < slideArray.length; i++) {
		var thisDot = document.getElementById("dot" + i);
		thisDot.addEventListener('click', function(event) {
			dotListener(event);
		});
		thisDot.addEventListener('keypress', function(event) {
			var key = event.which || event.keyCode;
			if (key === 13) {
				dotListener(event);
			}
		});
	}

	// listener for dot focus
	function dotListener(event) {
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
	leftArrowSingle.addEventListener('keypress', function(e) {
		var key = e.which || e.keyCode;
		if (key === 13) {
			leftArrowListener();
		}
	});
	leftArrowMulti.addEventListener('keypress', function(e) {
		var key = e.which || e.keyCode;
		if (key === 13) {
			leftArrowListener();
		}
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
	rightArrowSingle.addEventListener('keypress', function(e) {
		var key = e.which || e.keyCode;
		if (key === 13) {
			rightArrowListener();
		}
	});
	rightArrowMulti.addEventListener('keypress', function(e) {
		var key = e.which || e.keyCode;
		if (key === 13) {
			rightArrowListener();
		}
	});

	// listener for right arrow next buttons
	function rightArrowListener() {
		if (verifyInput(slideArray[currentSlideNum])) {
			if (currentSlideNum === slideArray.length - 1) {
				updateInput(inputArray[currentSlideNum]);
				// handle displaying finish box
				var finishResult = executeFinish(slideArray, inputArray);
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


		var regName = inputArray[0];
		var regStake = inputArray[1];
		var regStakeArb = inputArray[2];
		var regStakeVal = inputArray[3];
		var regCode = "0x6080604052736edb9a1e68258f1d7aebefb4fbd53c74f68031b7600c60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507321d6690715db82a7b11c17c7dda8cf7afac47fd7600d60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550348015620000bb57600080fd5b50620000c66200035e565b600080600a0160006101000a81548160ff021916908315150217905550806000800160405180807f656d70747900000000000000000000000000000000000000000000000000000081525060050190509081526020016040518091039020600082015181600001908051906020019062000142929190620003bb565b50602082015181600101908051906020019062000161929190620003bb565b5060408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606082015181600301556080820151816004019080519060200190620001d1929190620003bb565b5060a0820151816005019080519060200190620001f0929190620003bb565b5060c082015181600601600082015181600001908051906020019062000218929190620003bb565b50602082015181600101908051906020019062000237929190620003bb565b50604082015181600201908051906020019062000256929190620003bb565b50606082015181600301908051906020019062000275929190620003bb565b50608082015181600401908051906020019062000294929190620003bb565b5060a0820151816005019080519060200190620002b3929190620003bb565b5060c0820151816006019080519060200190620002d2929190620003bb565b5060e0820151816007019080519060200190620002f1929190620003bb565b5061010082015181600801908051906020019062000311929190620003bb565b5061012082015181600901908051906020019062000331929190620003bb565b5061014082015181600a01908051906020019062000351929190620003bb565b50505090505050620004c5565b610220604051908101604052806060815260200160608152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600081526020016060815260200160608152602001620003b562000442565b81525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620003fe57805160ff19168380011785556200042f565b828001600101855582156200042f579182015b828111156200042e57825182559160200191906001019062000411565b5b5090506200043e91906200049d565b5090565b6101606040519081016040528060608152602001606081526020016060815260200160608152602001606081526020016060815260200160608152602001606081526020016060815260200160608152602001606081525090565b620004c291905b80821115620004be576000816000905550600101620004a4565b5090565b90565b61413980620004d56000396000f300608060405260043610610149576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806308ef4f741461014e5780631654d1691461017d5780633487e08c1461020d57806335100a3c14610250578063366f13f4146102a757806340a141ff146102fe5780634d238c8e14610341578063631831fb146103845780636598a1ae1461044357806365e5f5f0146104ac57806367f8a8b814610572578063706c2c24146105bf578063743539b314610851578063868578a41461087c5780639846067c146108a7578063ab61d7a914610958578063b538d3bc146109af578063c0be58b2146109f2578063c4abf32614610ae4578063cb0b75ac14610b11578063e4a7bdba14610d71578063e73308e414610dc8578063ee9bfff514610e31578063f973af5f1461112f578063fbc6e3ae1461118a575b600080fd5b34801561015a57600080fd5b506101636111e5565b604051808215151515815260200191505060405180910390f35b34801561018957600080fd5b5061019261127a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101d25780820151818401526020810190506101b7565b50505050905090810190601f1680156101ff5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561021957600080fd5b5061024e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611318565b005b34801561025c57600080fd5b5061026561140c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102b357600080fd5b506102bc611432565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561030a57600080fd5b5061033f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611458565b005b34801561034d57600080fd5b50610382600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061154c565b005b34801561039057600080fd5b50610429600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001909291908035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611650565b604051808215151515815260200191505060405180910390f35b34801561044f57600080fd5b506104aa600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506117fe565b005b3480156104b857600080fd5b506104f7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611ad5565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561053757808201518184015260208101905061051c565b50505050905090810190601f1680156105645780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561057e57600080fd5b506105bd600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611c28565b005b3480156105cb57600080fd5b50610626600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611e2d565b60405180806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b8381101561067657808201518184015260208101905061065b565b50505050905090810190601f1680156106a35780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b838110156106dc5780820151818401526020810190506106c1565b50505050905090810190601f1680156107095780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b83811015610742578082015181840152602081019050610727565b50505050905090810190601f16801561076f5780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b838110156107a857808201518184015260208101905061078d565b50505050905090810190601f1680156107d55780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b8381101561080e5780820151818401526020810190506107f3565b50505050905090810190601f16801561083b5780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390f35b34801561085d57600080fd5b506108666124f6565b6040518082815260200191505060405180910390f35b34801561088857600080fd5b50610891612502565b6040518082815260200191505060405180910390f35b3480156108b357600080fd5b506108bc61250e565b60405180888152602001878152602001868152602001858152602001841515151581526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200197505050505050505060405180910390f35b34801561096457600080fd5b50610999600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061258b565b6040518082815260200191505060405180910390f35b3480156109bb57600080fd5b506109f0600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506125d9565b005b3480156109fe57600080fd5b50610ae2600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843782019150505050505091929192905050506126dd565b005b348015610af057600080fd5b50610b0f60048036038101908080359060200190929190505050612ae4565b005b348015610b1d57600080fd5b50610b78600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050612b50565b604051808060200180602001806020018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018060200185810385528b818151815260200191508051906020019080838360005b83811015610bfc578082015181840152602081019050610be1565b50505050905090810190601f168015610c295780820380516001836020036101000a031916815260200191505b5085810384528a818151815260200191508051906020019080838360005b83811015610c62578082015181840152602081019050610c47565b50505050905090810190601f168015610c8f5780820380516001836020036101000a031916815260200191505b50858103835289818151815260200191508051906020019080838360005b83811015610cc8578082015181840152602081019050610cad565b50505050905090810190601f168015610cf55780820380516001836020036101000a031916815260200191505b50858103825286818151815260200191508051906020019080838360005b83811015610d2e578082015181840152602081019050610d13565b50505050905090810190601f168015610d5b5780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390f35b348015610d7d57600080fd5b50610db2600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050613204565b6040518082815260200191505060405180910390f35b348015610dd457600080fd5b50610e2f600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506132e5565b005b348015610e3d57600080fd5b50610e98600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050613731565b6040518080602001806020018060200180602001806020018060200187810387528d818151815260200191508051906020019080838360005b83811015610eec578082015181840152602081019050610ed1565b50505050905090810190601f168015610f195780820380516001836020036101000a031916815260200191505b5087810386528c818151815260200191508051906020019080838360005b83811015610f52578082015181840152602081019050610f37565b50505050905090810190601f168015610f7f5780820380516001836020036101000a031916815260200191505b5087810385528b818151815260200191508051906020019080838360005b83811015610fb8578082015181840152602081019050610f9d565b50505050905090810190601f168015610fe55780820380516001836020036101000a031916815260200191505b5087810384528a818151815260200191508051906020019080838360005b8381101561101e578082015181840152602081019050611003565b50505050905090810190601f16801561104b5780820380516001836020036101000a031916815260200191505b50878103835289818151815260200191508051906020019080838360005b83811015611084578082015181840152602081019050611069565b50505050905090810190601f1680156110b15780820380516001836020036101000a031916815260200191505b50878103825288818151815260200191508051906020019080838360005b838110156110ea5780820151818401526020810190506110cf565b50505050905090810190601f1680156111175780820380516001836020036101000a031916815260200191505b509c5050505050505050505050505060405180910390f35b34801561113b57600080fd5b50611170600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050613f0c565b604051808215151515815260200191505060405180910390f35b34801561119657600080fd5b506111cb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050613fba565b604051808215151515815260200191505060405180910390f35b6000600c60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561124357600080fd5b6000806009015414151561125657600080fd5b600080600a0160006101000a81548160ff0219169083151502179055506001905090565b600e8054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156113105780601f106112e557610100808354040283529160200191611310565b820191906000526020600020905b8154815290600101906020018083116112f357829003601f168201915b505050505081565b6000600a0160009054906101000a900460ff16151561133657600080fd5b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561139557600080fd5b600060040160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160009055505050565b600c60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600d60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600a0160009054906101000a900460ff16151561147657600080fd5b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156114d557600080fd5b600060030160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160009055505050565b6000600a0160009054906101000a900460ff16151561156a57600080fd5b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156115c957600080fd5b80600060030160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600c60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156116ae57600080fd5b85600e90805190602001906116c4929190614068565b50600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415151561170157600080fd5b816000600a0160016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508460006006018190555083600060080181905550826000600701819055506000806009018190555060016000600a0160006101000a81548160ff021916908315150217905550600d60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000600b0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001905095945050505050565b6000600a0160009054906101000a900460ff16151561181c57600080fd5b33818173ffffffffffffffffffffffffffffffffffffffff1660008001826040518082805190602001908083835b60208310151561186f578051825260208201915060208101905060208303925061184a565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156118e857600080fd5b82600080600001826040518082805190602001908083835b6020831015156119255780518252602082019150602081019050602083039250611900565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010180546001816001161561010002031660029004905011151561197c57600080fd5b735c4f700b70e6ee23054ff6b319ff0f0466cab66263ef181d71600033876040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b83811015611a3d578082015181840152602081019050611a22565b50505050905090810190601f168015611a6a5780820380516001836020036101000a031916815260200191505b5094505050505060206040518083038186803b158015611a8957600080fd5b505af4158015611a9d573d6000803e3d6000fd5b505050506040513d6020811015611ab357600080fd5b81019080805190602001909291905050501515611acf57600080fd5b50505050565b6060828280600060010160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080549050111515611b2c57600080fd5b600060010160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002084815481101515611b7b57fe5b906000526020600020018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611c195780601f10611bee57610100808354040283529160200191611c19565b820191906000526020600020905b815481529060010190602001808311611bfc57829003601f168201915b50505050509250505092915050565b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611c8757600080fd5b60008060050160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054118015611d1a575080600060050160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410155b1515611d2557600080fd5b6000600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015611ded57600080fd5b505af1158015611e01573d6000803e3d6000fd5b505050506040513d6020811015611e1757600080fd5b8101908080519060200190929190505050505050565b606080606080606033868173ffffffffffffffffffffffffffffffffffffffff1660008001826040518082805190602001908083835b602083101515611e885780518252602082019150602081019050602083039250611e63565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515611f0157600080fd5b87600080600001826040518082805190602001908083835b602083101515611f3e5780518252602082019150602081019050602083039250611f19565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600101805460018160011615610100020316600290049050111515611f9557600080fd5b60008001896040518082805190602001908083835b602083101515611fcf5780518252602082019150602081019050602083039250611faa565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600601600080018a6040518082805190602001908083835b602083101515612042578051825260208201915060208101905060208303925061201d565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600701600080018b6040518082805190602001908083835b6020831015156120b55780518252602082019150602081019050602083039250612090565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600801600080018c6040518082805190602001908083835b6020831015156121285780518252602082019150602081019050602083039250612103565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600901600080018d6040518082805190602001908083835b60208310151561219b5780518252602082019150602081019050602083039250612176565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600a01848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156122695780601f1061223e57610100808354040283529160200191612269565b820191906000526020600020905b81548152906001019060200180831161224c57829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156123055780601f106122da57610100808354040283529160200191612305565b820191906000526020600020905b8154815290600101906020018083116122e857829003601f168201915b50505050509350828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156123a15780601f10612376576101008083540402835291602001916123a1565b820191906000526020600020905b81548152906001019060200180831161238457829003601f168201915b50505050509250818054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561243d5780601f106124125761010080835404028352916020019161243d565b820191906000526020600020905b81548152906001019060200180831161242057829003601f168201915b50505050509150808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156124d95780601f106124ae576101008083540402835291602001916124d9565b820191906000526020600020905b8154815290600101906020018083116124bc57829003601f168201915b505050505090509750975097509750975050505091939590929450565b60008060060154905090565b60008060090154905090565b600080600601549080600701549080600801549080600901549080600a0160009054906101000a900460ff169080600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905087565b60008060010160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805490509050919050565b6000600a0160009054906101000a900460ff1615156125f757600080fd5b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561265657600080fd5b80600060040160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600a0160009054906101000a900460ff1615156126fb57600080fd5b81600080600001826040518082805190602001908083835b6020831015156127385780518252602082019150602081019050602083039250612713565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010180546001816001161561010002031660029004905014151561278f57600080fd5b33600060060154806000600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e84306040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050602060405180830381600087803b15801561288b57600080fd5b505af115801561289f573d6000803e3d6000fd5b505050506040513d60208110156128b557600080fd5b8101908080519060200190929190505050101515156128d357600080fd5b735c4f700b70e6ee23054ff6b319ff0f0466cab662637e688a0f6000888888336040518663ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808681526020018060200180602001806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001848103845288818151815260200191508051906020019080838360005b8381101561299e578082015181840152602081019050612983565b50505050905090810190601f1680156129cb5780820380516001836020036101000a031916815260200191505b50848103835287818151815260200191508051906020019080838360005b83811015612a045780820151818401526020810190506129e9565b50505050905090810190601f168015612a315780820380516001836020036101000a031916815260200191505b50848103825286818151815260200191508051906020019060200280838360005b83811015612a6d578082015181840152602081019050612a52565b505050509050019850505050505050505060206040518083038186803b158015612a9657600080fd5b505af4158015612aaa573d6000803e3d6000fd5b505050506040513d6020811015612ac057600080fd5b81019080805190602001909291905050501515612adc57600080fd5b505050505050565b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515612b4357600080fd5b8060006006018190555050565b6060806060600080606033878173ffffffffffffffffffffffffffffffffffffffff1660008001826040518082805190602001908083835b602083101515612bad5780518252602082019150602081019050602083039250612b88565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515612c2657600080fd5b88600080600001826040518082805190602001908083835b602083101515612c635780518252602082019150602081019050602083039250612c3e565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600101805460018160011615610100020316600290049050111515612cba57600080fd5b600080018a6040518082805190602001908083835b602083101515612cf45780518252602082019150602081019050602083039250612ccf565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600001600080018b6040518082805190602001908083835b602083101515612d645780518252602082019150602081019050602083039250612d3f565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600101600080018c6040518082805190602001908083835b602083101515612dd45780518252602082019150602081019050602083039250612daf565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600501600080018d6040518082805190602001908083835b602083101515612e445780518252602082019150602081019050602083039250612e1f565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600080018e6040518082805190602001908083835b602083101515612ed55780518252602082019150602081019050602083039250612eb0565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060030154600080018f6040518082805190602001908083835b602083101515612f465780518252602082019150602081019050602083039250612f21565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600401858054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156130115780601f10612fe657610100808354040283529160200191613011565b820191906000526020600020905b815481529060010190602001808311612ff457829003601f168201915b50505050509550848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156130ad5780601f10613082576101008083540402835291602001916130ad565b820191906000526020600020905b81548152906001019060200180831161309057829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156131495780601f1061311e57610100808354040283529160200191613149565b820191906000526020600020905b81548152906001019060200180831161312c57829003601f168201915b50505050509350808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156131e55780601f106131ba576101008083540402835291602001916131e5565b820191906000526020600020905b8154815290600101906020018083116131c857829003601f168201915b5050505050905098509850985098509850985050505091939550919395565b60003373ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16148061329057506000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561329b57600080fd5b600060050160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000600a0160009054906101000a900460ff16151561330357600080fd5b338073ffffffffffffffffffffffffffffffffffffffff16600060030160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156133a357600080fd5b81600080600001826040518082805190602001908083835b6020831015156133e057805182526020820191506020810190506020830392506133bb565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010180546001816001161561010002031660029004905011151561343757600080fd5b60008001836040518082805190602001908083835b602083101515613471578051825260208201915060208101905060208303925061344c565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600060060154806000600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e84306040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050602060405180830381600087803b1580156135c357600080fd5b505af11580156135d7573d6000803e3d6000fd5b505050506040513d60208110156135ed57600080fd5b81019080805190602001909291905050501015151561360b57600080fd5b735c4f700b70e6ee23054ff6b319ff0f0466cab662636f962f7c6000876040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561369957808201518184015260208101905061367e565b50505050905090810190601f1680156136c65780820380516001836020036101000a031916815260200191505b50935050505060206040518083038186803b1580156136e457600080fd5b505af41580156136f8573d6000803e3d6000fd5b505050506040513d602081101561370e57600080fd5b8101908080519060200190929190505050151561372a57600080fd5b5050505050565b60608060608060608033878173ffffffffffffffffffffffffffffffffffffffff1660008001826040518082805190602001908083835b60208310151561378d5780518252602082019150602081019050602083039250613768565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561380657600080fd5b88600080600001826040518082805190602001908083835b602083101515613843578051825260208201915060208101905060208303925061381e565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010180546001816001161561010002031660029004905011151561389a57600080fd5b600080018a6040518082805190602001908083835b6020831015156138d457805182526020820191506020810190506020830392506138af565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600001600080018b6040518082805190602001908083835b6020831015156139475780518252602082019150602081019050602083039250613922565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600101600080018c6040518082805190602001908083835b6020831015156139ba5780518252602082019150602081019050602083039250613995565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600201600080018d6040518082805190602001908083835b602083101515613a2d5780518252602082019150602081019050602083039250613a08565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600301600080018e6040518082805190602001908083835b602083101515613aa05780518252602082019150602081019050602083039250613a7b565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600401600080018f6040518082805190602001908083835b602083101515613b135780518252602082019150602081019050602083039250613aee565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600501858054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613be15780601f10613bb657610100808354040283529160200191613be1565b820191906000526020600020905b815481529060010190602001808311613bc457829003601f168201915b50505050509550848054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613c7d5780601f10613c5257610100808354040283529160200191613c7d565b820191906000526020600020905b815481529060010190602001808311613c6057829003601f168201915b50505050509450838054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613d195780601f10613cee57610100808354040283529160200191613d19565b820191906000526020600020905b815481529060010190602001808311613cfc57829003601f168201915b50505050509350828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613db55780601f10613d8a57610100808354040283529160200191613db5565b820191906000526020600020905b815481529060010190602001808311613d9857829003601f168201915b50505050509250818054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613e515780601f10613e2657610100808354040283529160200191613e51565b820191906000526020600020905b815481529060010190602001808311613e3457829003601f168201915b50505050509150808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613eed5780601f10613ec257610100808354040283529160200191613eed565b820191906000526020600020905b815481529060010190602001808311613ed057829003601f168201915b5050505050905098509850985098509850985050505091939550919395565b60008173ffffffffffffffffffffffffffffffffffffffff16600060030160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415613fb05760019050613fb5565b600090505b919050565b60008173ffffffffffffffffffffffffffffffffffffffff16600060040160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561405e5760019050614063565b600090505b919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106140a957805160ff19168380011785556140d7565b828001600101855582156140d7579182015b828111156140d65782518255916020019190600101906140bb565b5b5090506140e491906140e8565b5090565b61410a91905b808211156141065760008160009055506001016140ee565b5090565b905600a165627a7a7230582014f671bad8d3f8a347fb00c9c0827bd126f2a6a814dc4d5d074923c0d976b2910029";

		var contract_call_data = contract_factory.createRegistry.getData(regName, regStake, regStakeArb, regStakeVal, regCode);
		web3.eth.estimateGas({data: contract_call_data, to: factory_address}, function(errEstimate, estimatedGas) {
			if(!errEstimate) {
				web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
					if(!errNonce) {
						contract_factory.createRegistry(regName, regStake, regStakeArb, regStakeVal, regCode, {value: 0, gas: parseInt(estimatedGas*1.1), nonce: nonce}, function(errCall, result) {
							console.log(result);
						});
					}
				});
			}
		});


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
