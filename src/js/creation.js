/****************************Variables*******************************/
/*
/* State variables used to store user input and slide display information
/*
/*********************************************************************/
var slideArray = [];
var inputArray = [];
var currentSlideNum = 0;

/******************Creating/Registering Functions*********************/
/*
/* Functions specific to the process of creating a marketplace/registry
/* and registering a device with the network
/*
/*********************************************************************/

/**
 *	Takes the data from the json file and uses it to populate
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
    var htmlPage = location.pathname.split('/').pop();
    var file = "";
    if (htmlPage === "registries.html") {
        file = 'json/registryFields.json';
    }
    else if (htmlPage === "marketplaces.html") {
        file = 'json/marketplaceFields.json';
    }
    else if (htmlPage === "devices.html") {
        file = 'json/deviceFields.json';
    }
    else {
        console.log("Error determining html page");
    }
	$.getJSON(file, {}, function(data) {
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
 *	Takes the data from the json file, which is stored in the
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

/**
 *	Verifies the user inputted a valid type in each field on the slide
 *
 *	@param slideArr an array containing the data for a single slide in the slideshow
 */
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

/**
 *	Verifies the user input matches the field's expected inputType. Empty strings
 *	are always considered valid inputs to allow for the user to skip through the
 *	the slideshow and input values out of order.
 *
 *	@param inputType the expected data type to be inputted in the field, taken from the JSON file
 *	@param input the actual user inputted value in the field
 *  @return true if the input is valid, matches the expected inputType, and false otherwise.
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
 *	Displays an error message in the input parameter. The message displayed
 *	is specific to the expected inputType.
 *
 *	@param inputType the expected data type to be inputted in the field, taken from the JSON file
 *	@param input the actual input html object to display the error in
 */
function errorSingleInput(inputType, input) {
	if (inputType.toLowerCase() === "str") {;
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
 *  @return true if the input is confirmed, matches the expected valType and isn't empty, and false otherwise.
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
