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
		            "placeholder": "E.g. Ben's iPhone"
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
		if (slideArray[0].length > 3) {
			$('#multiField').show();
			$('#singleField').hide();
		}
		else {
			$('#multiField').hide();
			$('#singleField').show();
			// TODO replace "" with inputArray[0]
			updateSingleFields(slideArray[0], "");
			document.getElementById("prevBtnSingle").style.opacity = 0.3;
		}
	});

	//handle creating a new registry
	var currentSlideNum = 0;
	var slideArray = populateSlides();
	var inputArray = [];

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
			// TODO handle input verification later
		});
		// TODO add proper number of blank elements to input array
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
	});


}
