/******************************Variables******************************/
/*
/* State variables used to by the marketplaces.html page
/*
/*********************************************************************/
//global variables
var marketArray = []	// id, name, ownerAddress, marketAddress, stakedTokens, active

// web3 and contract data
var web3Provider;
var contract_factory;
var factory_address = '0x6edb9a1e68258f1d7aebefb4fbd53c74f68031b7';
var contract_token;
var token_address = '0x21d6690715db82a7b11c17c7dda8cf7afac47fd7';
var userAddress = "0x0";

var slideArray = [];
var inputArray = [];
var currentSlideNum = 0;

// used to check for changes in marketplace data in the contract
var compareArray = [];

/*******************************Functions*****************************/
/*
/* Functions used to by the marketplaces.html page
/*
/*********************************************************************/

/**
*	Accesses contract factory to determine the marketplaces to display
*/
function getUserMarkets(counter) {
	userAddress = web3.eth.accounts[0];
	if (userAddress != "0x0") {
		if (counter === 0) {
			compareArray = [];
			console.log("new market process");
		}
		getMarketplace(counter, function(res, err) {
			if (!err) {
				// extract registry data and push to array
				var id = res[0];
				var name = res[1];
				var ownerAddress = res[2];
				var marketAddress = res[3];
				var stakedTokens = res[4];
				var active = res[5];

				if (userAddress == ownerAddress && active) {
					compareArray.push([id, name, ownerAddress, marketAddress, stakedTokens, active]);
				}

				let newCounter = counter + 1;
				getUserMarkets(newCounter);
			}
			else {
				console.log("finished");
				console.log(compareArray.length);
				if (compareArray.length !== marketArray.length) {
					marketArray = compareArray;
					displayMarkets();
				}
				setTimeout(function(){getUserMarkets(0);}, 1000);
			}
		});
	}
	else {
		setTimeout(function(){getUserMarkets(0);}, 100);
	}
}


function getMarketplace(position, callback) {
	contract_factory.allMarketplaces(position, function(errCall, result) {
		if(!errCall) {
			callback(result, null);
		}
		else {
			callback(null, true);
		}
	});
}

/**
*	TODO revise documentation
*	Takes the data from the state variable marketArray and populates the
*	appropriate area of the html to display information on a button pertaining
*	to the marketplaces, including the marketplace name and the stake set.
*
* @param marketArray a 2D array with elements of the form [name, stake, commission]
*/
function displayMarkets() {
	console.log("update display");
	if(marketArray.length != 0) {
		var panel = document.querySelector('#marketButtons');
		var newHtml = "";
		var str1;
		var str2;

		for(var i = 0; i < marketArray.length; i++) {
			str1 = newHtml;
			str2 = "<button class='grayNameBtn'><span class='leftFloat'>" + marketArray[i][1] + "</span><span class='rightFloat'>" + web3.fromWei(marketArray[i][4], 'ether') + " WEEV</span></button>";
			newHtml = str1.concat(str2);
		}

		console.log(newHtml);		//FIXME: debug

		panel.innerHTML = newHtml;
	}
	else {
		console.log("no markets to display");
		var panel = document.querySelector('#marketButtons');
		panel.innerHTML = "<div class='infoLabel'><p class='leftFloat'>No marketplaces to display</p></div>";
	}
	$('#loadingAlert').hide();
}

/**
* TODO revise documentation
*	Takes the data from the state variable marketArray and populates the
*	appropriate area of the html to display information in a div pertaining to the
*	marketplace, including the marketplace name, stake, and commission
*
* @param marketArray a 2D array with elements of the form [name, stake, commission]
*/
function displayMarketInfo(id) {
	if(marketArray.length != 0) {
		var panel = document.querySelector('#marketInfo');
		var newHtml = "<div class='infoLabel'><p class='leftFloat'>Stake</p><p class='rightFloat'>" + web3.fromWei(marketArray[id][4], 'ether') + " WEEV</p></div><div class='infoLabel'><p class='leftFloat'>Active</p><p class='rightFloat'>" + marketArray[id][5] + "</p></div>";

		console.log(newHtml);		//FIXME: debug

		panel.innerHTML = newHtml;
	}
}

/***********************Creating a Marketplace************************/
/*
/* Functions specific to the process of creating a new marketplace
/*
/*********************************************************************/

/**
*	Takes the data from the marketplaceFields.json file and uses it to populate
*	the slides where the user can add a new marketplace. See the README for more
*	information about customizing the required fields with the JSON file.
*
*	@return retArray an arry containing the data from the JSON file. The array is of
*	the form [[slide title, [field name, field data, field placeholder], slide description], ...]
*	Each index refers to a different slide defined in the JSON file, so the above element
*	contains all of the information to populate 1 slide.
*/
function populateArrays() {
	currentSlideNum = 0;
	$.getJSON('json/marketplaceFields.json', {}, function(data) {
		var retArray = [];
		for (var num in data) {
			var singleSlide = data[num];
			var singleSlideArr = [];
			for (var field in singleSlide) {
				if (field == "title" || field == "description") {
					singleSlideArr.push(singleSlide[field]);
				}
				else {
					var fieldArray = [];
					for (var el in singleSlide[field]) {
						fieldArray.push(singleSlide[field][el]);
					}
					singleSlideArr.push(fieldArray);
				}
			}
			retArray.push(singleSlideArr);
		}
		slideArray = retArray;
		populateInputs(slideArray);
		initializeDots();
		initializeArrows();
		initializeBack();
		return true;
	});
}

/**
*	Takes the data from the marketplaceFields.json file, which is stored in the
*	slideArr parameter, and uses this to initialize an array to store user
*	inputted values for each field in the slideshow.
*
*	@param slideArr an array containing all of the data for the slides in the slideshow
*	@return retArray a 2D array, where retArray[i][j] is the user input for the
*	j-th field on the i-th slide in the slideshow.
*/
function populateInputs(slideArr) {
	var retArray = [];
	for (var slide in slideArr) {
		var slideFields = [];
		for (var i = 1; i < slideArr[slide].length - 1; i++) {
			slideFields.push("");
		}
		retArray.push(slideFields);
	}
	inputArray = retArray;
}

/**
*	Creates dots to navigate through slides in the slideshow and
*	adds click listener events.
*/
function initializeDots() {
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
}

/**
*	Function triggered when a 'dot' is clicked. Handle updating slide Information
*	to display a new slide and storing user input from previous slide.
*/
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

/**
*	Adds click listener events to both the previous, left arrow, and next, right
*	arrow, buttons to support navigating through the slideshow
*/
function initializeArrows() {
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
}

/**
*	Function triggered when the previous button is clicked. Handles
*	moving back through the slideshow by updating slide display and storing
*	any user input.
*/
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

/**
*	Function triggered when the next button is clicked. Handles
*	moving forward through the slideshow by updating slide display and storing
*	any user input.
*/
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

/**
*  Assigns an event listener to the back button on the finish/confirmation
*  display to return to edit the slideshow on click
*/
function initializeBack() {
	var backAddButton = document.querySelector('#backAddBtn');
	backAddBtn.addEventListener('click', function(event) {
		// hide finish screen
		updateSlide(slideArray[currentSlideNum], inputArray[currentSlideNum]);
		$('#createPanel').show();
		$('#createSlides').show();
		$('#finishBox').hide();
	});
}

/**
*	Takes the slideArray and inputArray parameters and calls the appropriate
*	function to update the slide to display the appropriate data
*
*	@param slideArr an array containing the data for a single slide in the slideshow
*	@param inputArr an array containing the user input for a single slide
*/
function updateSlide(slideArr, inputArr) {
	// the slide contains more than one input field
	if (slideArr.length > 3) {
		$('#multiField').show();
		$('#singleField').hide();
		updateMultiFields(slideArr, inputArr);
	}
	// the slide contains just one input field
	else {
		$('#multiField').hide();
		$('#singleField').show();
		updateSingleFields(slideArr, inputArr[0]);
	}
}

/**
*	Takes the slideArray and inputArray parameters and updates the slide
*	to display the appropriate data
*
*	@param slideArr an array containing the data for a single slide in the slideshow
*	@param storedInput the user input stored for the single field on the slide
*/
function updateSingleFields(slideArr, storedInput) {
	var title = slideArr[0];
	var field = slideArr[1];
	var description = slideArr[2];
	var fieldName = field[0];
	var fieldData = field[1];
	var fieldPH = field[2];

	// TODO handle displaying different input types here

	/* TODO test with other browsers. Does every browser support input type changes?
	if (fieldData.toLowerCase() === "str") {
	document.getElementById("fieldInputSingle").type = "text";
}
else if (fieldData.toLowerCase() === "num") {
document.getElementById("fieldInputSingle").type = "number";
}
else if (fieldData.toLowerCase() === "bool") {
document.getElementById("fieldInputSingle").type = "checkbox";
}
*/

document.getElementById('slideName').textContent = title;
document.getElementById('fieldNameSingle').textContent = fieldName;
document.getElementById("fieldInputSingle").placeholder = fieldPH;
document.getElementById("fieldInputSingle").value = storedInput;
document.getElementById('fieldDescriptionSingle').textContent = description;
$('#fieldInputSingle').removeClass("error");
}

/**
*	Takes the slideArray and inputArray parameters and updates the slide
*	to display the appropriate data
*
*	@param slideArr an array containing the data for a single slide in the slideshow
*	@param inputArr the user input stored for the multiple fields on the slide
*/
function updateMultiFields(slideArr, inputArr) {
	var title = slideArr[0];
	var description = slideArr[slideArr.length - 1];
	document.getElementById('slideName').textContent = title;
	document.getElementById('fieldDescriptionMulti').textContent = description;
	// can't handle more than 6 inputs on one multi field slide, plus 2 for the title and description
	if (slideArr.length > 8) {
		// TODO more rigorous error checking here
		console.log("Critical json format error. More than 6 fields on slide!")
	}
	for (var i = 1; i < slideArr.length - 1; i++) {
		var fieldName = slideArr[i][0];
		var fieldData = slideArr[i][1];
		var fieldPH = slideArr[i][2];

		// TODO handle displaying different input types here

		/* TODO test with other browsers. Does every browser support input type changes?
		if (fieldData.toLowerCase() === "str") {
		document.getElementById("fieldInput" + i).type = "text";
	}
	else if (fieldData.toLowerCase() === "num") {
	document.getElementById("fieldInput" + i).type = "number";
}
else if (fieldData.toLowerCase() === "bool") {
document.getElementById("fieldInput" + i).type = "checkbox";
}
*/

document.getElementById("fieldInput" + i).value = inputArr[i - 1];
document.getElementById("fieldInput" + i).placeholder = fieldPH;
document.getElementById("fieldName" + i).textContent = fieldName;
$('#fieldInput' + i).removeClass("error");
}
}

/**
*	Stores the user input in the inputArray. Takes the data from the input
*	fields in the html.
*
*	@param inputArr the user input stored for the slide
*/
function updateInput(inputArr) {
	// store input for a slide with multiple fields
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
	// store input for a slide with a single field
	else {
		inputArr[0] = document.getElementById("fieldInputSingle").value.replace(/^\s+|\s+$/g,'');
	}
}

/**
*	Verifies the user inputted a valid type in each field on the slide
*
*	@param slideArr an array containing the data for a single slide in the slideshow
*/
function verifyInput(slideArr) {
	// loop through the slide fields if the slide contains multiple fields
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
	// slide contains a single field
	else {
		var fieldArr = slideArr[1];
		var inputType = fieldArr[1];
		var input = document.getElementById("fieldInputSingle");
		return verifySingleInput(inputType, input);
	}
}

/**
*	Verifies the user input matches the field's expected inputType. Empty strings
*	are always considered valid inputs to allow for the user to skip through the
*	the slideshow and input values out of order.
*
*	@param inputType the expected data type to be inputted in the field, taken from the JSON file
*	@param input the actual user inputted value in the field
*	@return true if the input is valid, matches the expected inputType, and false otherwise.
*/
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

// visually 'disables' the left arrow button
function disablePrevBtn() {
	document.getElementById("prevBtnSingle").style.opacity = 0.3;
	document.getElementById("prevBtnMulti").style.opacity = 0.3;
	document.getElementById("nextBtnSingle").style.opacity = 0.8;
	document.getElementById("nextBtnMulti").style.opacity = 0.8;
}

// visually 'enables' the left arrow button
function enablePrevBtn() {
	document.getElementById("prevBtnSingle").style.opacity = 0.8;
	document.getElementById("prevBtnMulti").style.opacity = 0.8;
	document.getElementById("nextBtnSingle").style.opacity = 0.8;
	document.getElementById("nextBtnMulti").style.opacity = 0.8;
}

/**
*	Displays error messages in all fields with malformed inputs on a single slide
*
*	@param slideArr an array containing the data for a single slide in the slideshow
*/
function inputError(slideArr) {
	// loop through the slide fields if the slide contains multiple fields
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
	// handle single field
	else {
		var fieldArr = slideArr[1];
		var inputType = fieldArr[1];
		var input = document.getElementById("fieldInputSingle");
		errorSingleInput(inputType, input);
	}
}

/**
*	Displays an error message in the input parameter. The message displayed
*	is specific to the expected inputType.
*
*	@param inputType the expected data type to be inputted in the field, taken from the JSON file
*	@param input the actual input html object to display the error in
*/
function errorSingleInput(inputType, input) {
	if (inputType.toLowerCase() === "str") {
		input.value = "";
		input.placeholder = "Please enter some text";
		$('#' + input.id).addClass("error");
	}
	else if (inputType.toLowerCase() === "num") {
		input.value = "";
		input.placeholder = "Please enter a number";
		$('#' + input.id).addClass("error");
	}
	else if (inputType.toLowerCase() === "bool") {
		input.value = "";
		input.placeholder = "Please enter 'true' or 'false'";
		$('#' + input.id).addClass("error");
	}
	else {
		input.value = "";
		input.placeholder = "Invalid input in json file";
		$('#' + input.id).addClass("error");
	}
}

/**
*	After the last slide, before displaying the stored inputs, confirm the stored user
*	input values are not empty and conform to the expected data types.
*
*	@param slideArr an array containing all of the data for the slides in the slideshow
*	@param inputArr an array containing all of the user input stored in the slideshow
* 	@return -1 if all of the stored input values are confirmed and valid
*	@return an array of the form [i, [j, k, l]] if there is an error with the
*	user input on slide i in fields j, k, and l.
*/
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

/**
*	Confirms the storedVal user input matches the field's expected valType.
*	Empty strings are not allowed.
*
*	@param storedVal the stored user input
*	@param valType the expected data type to be inputted in the field, taken from the JSON file
*	@return true if the input is confirmed, matches the expected valType and isn't empty, and false otherwise.
*/
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

/**
*	Displays input errors on all fields with errors on the slide defined by
*	the slideArr parameter .
*
*	@param slideArr an array containing the data for a single slide in the slideshow
*	@param errorFields an array containing the numbers of all fields containing errors
*	on a single slide in the slideshow
*/
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

/**
*	Populates a final, confirmation view that displays the fields and the user
*	inputs from the slideshow
*
*	@param inputArr an arry containing all of the stored user inputs for the slides in the slideshow
*	@param slideArr an array containing all of the data for the slides in the slideshow
*/
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

/*************************************UI*******************************/

window.onload=function() {

	$("#infoPanel").hide();
	$('#createPanel').hide();
	$('#finishBox').hide();
	$('#loadingAlert').hide();
	$('#loadingScreen').hide();

	// initialize slides for creating marketplaces
	populateArrays();

	// connect to web3
	if (typeof web3 !== 'undefined') {
		web3Provider = web3.currentProvider;
	} else {
		console.log('No web3? You should consider trying MetaMask!');
		//default to local ganache
		web3Provider = new Web3.providers.HttpProvider("http://localhost:7454");
	}

	web3 = new Web3(web3Provider);
	console.log("web3: " + web3);

	// get contract data for factory and token
	$.getJSON('json/weeveToken.json', function(data) {
		console.log("pulling token contract");
		contract_token = web3.eth.contract(data.abi).at(token_address);
		console.log("token: ", contract_token);
	});


	$.getJSON('json/weeveFactory.json', function(data) {
		console.log("pulling factory contract");
		contract_factory = web3.eth.contract(data.abi).at(factory_address);
		console.log("factory: ", contract_factory);
	});

	//wait a little before displaying data to ensure DOM objects loaded
	setTimeout(function() {
		getUserMarkets(0);
		displayMarkets();
	}, 1000);

	/*************************Attach listeners****************************/
	/*
	/* Attach listeners to html buttons
	/*
	/*********************************************************************/

	// handle clicking of a marketplace
	var marketButtons = document.querySelector('#marketButtons');
	marketButtons.addEventListener('click', function(event) {
		// support clicking on button text
		if(event.target.parentNode.parentNode === marketButtons
			&& $(event.target.parentNode).hasClass("grayNameBtn")) {
				// get rid of left panel
				$('#titlePanel').hide();

				let string  = event.target.parentNode.innerHTML;
				let beginning = string.search(">") + 1;
				let end = string.search("</span>");
				let selectedMarket = string.slice(beginning, end);
				let msg = "Selected " + selectedMarket;
				console.log(msg);

				//move list of registers from right to left
				$('#marketPanel').addClass("left").removeClass("right");

				//load info for chosen marketplace
				let buttonId = $('.grayNameBtn').index(event.target.parentNode);
				displayMarketInfo(buttonId);

				//show info panel on right side
				document.getElementById("marketName").textContent = selectedMarket;
				$("#infoPanel").show();
			}
			// support clicking on actual button
			else if(event.target.parentNode === marketButtons
				&& $(event.target).hasClass("grayNameBtn")) {
					// get rid of left panel
					$('#titlePanel').hide();

					let string  = event.target.innerHTML;
					let beginning = string.search(">") + 1;
					let end = string.search("</span>");
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

					//TODO: eventually will pull actual info about markets and display that

				}
			});

			//handle closing marketplace
			var closeButton = document.querySelector('#closeBtn');
			closeButton.addEventListener('click', function(event) {
				var marketName = document.getElementById("marketName").textContent;
				for (var i = 0; i < marketArray.length; i++) {
					if (marketArray[i][1] === marketName) {
						var marketplaceID = Number(marketArray[i][0]);
						var contract_call_data = contract_factory.closeMarketplace.getData(marketplaceID);
						web3.eth.estimateGas({data: contract_call_data, to: factory_address}, function(errEstimate, estimatedGas) {
							document.getElementById("loadingTxt").textContent = "Please submit the transaction to close the marketplace";
							$('#loadingAlert').show();
							if(!errEstimate) {
								web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
									if(!errNonce) {
										contract_factory.closeMarketplace(marketplaceID, {value: 0, gas: parseInt(estimatedGas*1.1), nonce: nonce},function(errCall, result) {
											if(!errCall) {
												if(result.startsWith("0x")) {
													console.log("worked");
													// hide info panel
													$('#infoPanel').hide();
													document.getElementById("loadingTxt").textContent = "Please wait while your transaction is being mined...";
												}
											}
											else {
												console.log(errCall)
											}
										});
									}
								});
							}
						});
					}
				}
			});

			//handle adding device
			var addButton = document.querySelector('#addMPBtn');
			addButton.addEventListener('click', function(event) {
				//hide info panel
				$('#infoPanel').hide();
				$("#titlePanel").hide();
				$('#marketPanel').hide();
				$('#createPanel').show();
				// initialize creation panel
				updateSlide(slideArray[0], inputArray[0]);
				disablePrevBtn();
				document.getElementById('dot0').style.opacity = 1.0;
			});

			//handle canceling during adding device
			var cancelAddButton = document.querySelector('#cancelAddBtn');
			cancelAddButton.addEventListener('click', function(event) {
				//hide info panel
				$('#infoPanel').hide();
				$("#titlePanel").show();
				$('#marketPanel').show().addClass('right').removeClass('left');;
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

			// handle taking user input and updating network state with a new marketplace
			finishAddBtn.addEventListener('click', function(event) {
				//hide info panel
				$('#infoPanel').hide();
				$('#marketPanel').show().addClass("right").removeClass("left");
				$('#titlePanel').show();
				$('#createSlides').show();
				$('#createPanel').hide();
				$('#finishBox').hide();

				var marketplaceName = inputArray[1][0];
				var marketplaceStake = web3.toWei(inputArray[0][0], 'ether');
				var marketplaceCommission = web3.toWei(inputArray[2][0], 'ether');
				var marketplaceCode = "0x6080604052736edb9a1e68258f1d7aebefb4fbd53c74f68031b7600b60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507321d6690715db82a7b11c17c7dda8cf7afac47fd7600c60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503480156100ba57600080fd5b5060008060060160006101000a81548160ff021916908315150217905550611a66806100e76000396000f3006080604052600436106100fc576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806304804ee814610101578063163edd381461017e5780631d6069fc146101ad5780633487e08c1461023d57806335100a3c14610280578063366f13f4146102d757806340a141ff1461032e578063492cc769146103715780634d238c8e146103da5780634f3bddeb1461041d5780639fa637a8146104c8578063b538d3bc146105f6578063b7cac6ab14610639578063df922f3a14610664578063e1224f9a14610691578063f4bd4610146106de578063f973af5f14610788578063fbc6e3ae146107e3575b600080fd5b34801561010d57600080fd5b5061017c600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001909291908035906020019092919050505061083e565b005b34801561018a57600080fd5b50610193610990565b604051808215151515815260200191505060405180910390f35b3480156101b957600080fd5b506101c2610a25565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102025780820151818401526020810190506101e7565b50505050905090810190601f16801561022f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561024957600080fd5b5061027e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610ac3565b005b34801561028c57600080fd5b50610295610bb7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102e357600080fd5b506102ec610bdd565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561033a57600080fd5b5061036f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c03565b005b34801561037d57600080fd5b506103d8600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610cf7565b005b3480156103e657600080fd5b5061041b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e37565b005b34801561042957600080fd5b506104ae600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610f3b565b604051808215151515815260200191505060405180910390f35b3480156104d457600080fd5b5061052f600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611117565b60405180806020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200185815260200184815260200183151515158152602001828103825287818151815260200191508051906020019080838360005b838110156105b757808201518184015260208101905061059c565b50505050905090810190601f1680156105e45780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390f35b34801561060257600080fd5b50610637600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061142f565b005b34801561064557600080fd5b5061064e611533565b6040518082815260200191505060405180910390f35b34801561067057600080fd5b5061068f6004803603810190808035906020019092919050505061153f565b005b34801561069d57600080fd5b506106dc600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506115e5565b005b3480156106ea57600080fd5b506106f36117a9565b60405180878152602001861515151581526020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001965050505050505060405180910390f35b34801561079457600080fd5b506107c9600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611820565b604051808215151515815260200191505060405180910390f35b3480156107ef57600080fd5b50610824600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506118ce565b604051808215151515815260200191505060405180910390f35b600060060160009054906101000a900460ff16151561085c57600080fd5b73e016e7bf275a559e0d3ea827c36bf3b8e55942b76358d0a32b60008585856040518563ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018085815260200180602001848152602001838152602001828103825285818151815260200191508051906020019080838360005b838110156108f85780820151818401526020810190506108dd565b50505050905090810190601f1680156109255780820380516001836020036101000a031916815260200191505b509550505050505060206040518083038186803b15801561094557600080fd5b505af4158015610959573d6000803e3d6000fd5b505050506040513d602081101561096f57600080fd5b8101908080519060200190929190505050151561098b57600080fd5b505050565b6000600b60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156109ee57600080fd5b60008060050154141515610a0157600080fd5b60008060060160006101000a81548160ff0219169083151502179055506001905090565b600d8054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610abb5780601f10610a9057610100808354040283529160200191610abb565b820191906000526020600020905b815481529060010190602001808311610a9e57829003601f168201915b505050505081565b600060060160009054906101000a900460ff161515610ae157600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610b4057600080fd5b600060040160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160009055505050565b600b60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600c60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060060160009054906101000a900460ff161515610c2157600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c8057600080fd5b600060030160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160009055505050565b600060060160009054906101000a900460ff161515610d1557600080fd5b73e016e7bf275a559e0d3ea827c36bf3b8e55942b763e5b335fd6000836040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610da3578082015181840152602081019050610d88565b50505050905090810190601f168015610dd05780820380516001836020036101000a031916815260200191505b50935050505060206040518083038186803b158015610dee57600080fd5b505af4158015610e02573d6000803e3d6000fd5b505050506040513d6020811015610e1857600080fd5b81019080805190602001909291905050501515610e3457600080fd5b50565b600060060160009054906101000a900460ff161515610e5557600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610eb457600080fd5b80600060030160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600b60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f9957600080fd5b83600d9080519060200190610faf929190611995565b50600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614151515610fec57600080fd5b81600060090160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600080600501819055506001600060060160006101000a81548160ff021916908315150217905550600083101580156110695750606483105b151561107457600080fd5b82600060070181905550600080600801819055506001600060060160006101000a81548160ff021916908315150217905550600c60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000600a0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600190509392505050565b606060008060008060008001866040518082805190602001908083835b6020831015156111595780518252602082019150602081019050602083039250611134565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060000160008001876040518082805190602001908083835b6020831015156111c957805182526020820191506020810190506020830392506111a4565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660008001886040518082805190602001908083835b60208310151561125a5780518252602082019150602081019050602083039250611235565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206002015460008001896040518082805190602001908083835b6020831015156112cb57805182526020820191506020810190506020830392506112a6565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060030154600080018a6040518082805190602001908083835b60208310151561133c5780518252602082019150602081019050602083039250611317565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060040160009054906101000a900460ff16848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156114155780601f106113ea57610100808354040283529160200191611415565b820191906000526020600020905b8154815290600101906020018083116113f857829003601f168201915b505050505094509450945094509450945091939590929450565b600060060160009054906101000a900460ff16151561144d57600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156114ac57600080fd5b80600060040160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008060050154905090565b600060060160009054906101000a900460ff16151561155d57600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156115bc57600080fd5b600081101580156115cd5750606481105b15156115d857600080fd5b8060006007018190555050565b600060060160009054906101000a900460ff16151561160357600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561166257600080fd5b600060080154811115151561167657600080fd5b6000600a0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15801561173e57600080fd5b505af1158015611752573d6000803e3d6000fd5b505050506040513d602081101561176857600080fd5b8101908080519060200190929190505050151561178457600080fd5b61179c8160006008015461197c90919063ffffffff16565b6000600801819055505050565b60008060050154908060060160009054906101000a900460ff16908060070154908060080154908060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600a0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905086565b60008173ffffffffffffffffffffffffffffffffffffffff16600060030160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156118c457600190506118c9565b600090505b919050565b60008173ffffffffffffffffffffffffffffffffffffffff16600060040160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156119725760019050611977565b600090505b919050565b600082821115151561198a57fe5b818303905092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106119d657805160ff1916838001178555611a04565b82800160010185558215611a04579182015b82811115611a035782518255916020019190600101906119e8565b5b509050611a119190611a15565b5090565b611a3791905b80821115611a33576000816000905550600101611a1b565b5090565b905600a165627a7a72305820d8c8f1742da73feb978e4793d110e0fcc7e3de18cf3b62900e7adfa11204870c0029";

				//approve staked tokens
				console.log("approving stake");
				console.log(marketplaceStake);
				var approve_call_data = contract_token.approve.getData(factory_address, marketplaceStake);

				web3.eth.estimateGas({data: approve_call_data, to: token_address, from: web3.eth.accounts[0]}, function(errEstimate, estimatedGas) {
					if(!errEstimate) {
						document.getElementById("loadingTxt").textContent = "Please submit the transaction to approve the stake";
						$('#loadingAlert').show();
						web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
							if(!errNonce) {
								contract_token.approve(factory_address, marketplaceStake, {value:0, gas: parseInt(estimatedGas*1.1), nonce: nonce}, function(errCall, result) {
									if(!errCall) {
										document.getElementById("loadingTxt").textContent = "Please wait while your transaction is being mined...";
										console.log("successfully set allowance");
										console.log(estimatedGas);
										console.log(result);
									} else {
										console.log(errCall);
									}
								});
							}
						});
					}
				});
				//wait for tokens to be staked then create marketplace
				setTimeout(function() {
					var contract_call_data = contract_factory.createMarketplace.getData(marketplaceName, marketplaceCommission, marketplaceCode);
					web3.eth.estimateGas({data: contract_call_data, to: factory_address}, function(errEstimate, estimatedGas) {
						if(!errEstimate) {
							document.getElementById("loadingTxt").textContent = "Please submit the transaction to create the marketplace";
							web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
								if(!errNonce) {
									contract_factory.createMarketplace(marketplaceName, marketplaceCommission, marketplaceCode, {value: 0, gas: parseInt(estimatedGas*1.1), nonce: nonce},function(errCall, result) {
										if(!errCall) {
											document.getElementById("loadingTxt").textContent = "Please wait while your transaction is being mined...";
											console.log("result: " + result);
										}
										else {
											console.log(errCall)
										}
									});
								}
							});
						} else {
							console.log(errEstimate)
							console.log(estimatedGas);
						}
					});
				}, 50000);

				// reset input array and currentField counter
				document.getElementById('dot' + currentSlideNum).style.opacity = 0.6;
				for (var i = 0; i < inputArray.length; i++) {
					for (var j = 0; j < inputArray[i].length; j++) {
						inputArray[i][j] = "";
					}
				}
				currentSlideNum = 0;
			});


		}
