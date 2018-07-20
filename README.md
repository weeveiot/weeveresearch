# weeveresearch
_Ben Hodgson_, _Braden Meyerhoefer_

Experimental things we are working on regarding the weeveNetwork demo.

### TODOs and Bugs

#### Load device data from contracts
Currently the Registry and Marketplace information displayed is loaded in from the contract data. This same functionality needs to be implemented for devices, including functionality for registering and closing a device. For registering a device we also recommend either a dropdown menu or an autocomplete/predictive text feature so the user can easily choose which registry to register the device to. 

#### Perfect error handling
The error checking is satisfactory for creating registries/marketplaces and registering devices, but the error checking could be improved for reading in JSON and contract data. For example, if a JSON file has a typo in a field name then this needs to be communicated to the user in a more effective way than a console.log. Similarly the user should be told to install and use MetaMask if they reach the webpage without it because they won't be able to interact with most of the site. 

#### Navigation bar doesn't always display MetaMask information
The navigation bar doesn't always load in the information about the user's MetaMask data, including their ether, weev, and address. We believe this is caused by either:
  1. A timing bug where the information is loaded before the webpage elements, so they don't get displayed. 
  2. Loading the navbar in from a separate html file with it's own js file. For some reason maybe the js file doesn't execute when it's loaded into the page externally this way. 

### Customize Adding Registries/Marketplaces and Registering Devices
Currently the user interface for adding registries/marketplaces and registering devices is presented as a slideshow. Each slide supports up to 6 fields at once, but for optimal display we recommend presenting either **1 field** or **6 fields** on a slide. The number of slides and the slide content is specified in a json file under the doc directory. Here's the _marketplaceFields.json_ file used to define the process of adding a new marketplace: 

```json
{
	"slide1": {
		"title": "Add Marketplace",
		"field1": {
			"name": "Stake Amount",
		    	"data": "num",
		    	"placeholder": "Enter stake"
		},
		"description": "Some WEEV must be given as collateral to discourage malicious behavior"
	},
	"slide2": {
		"title": "Add Marketplace",
		"field1": {
			"name": "Marketplace Name",
		    	"data": "str",
		    	"placeholder": "Enter name"
		},
		"description": "Provide a name to identify and describe the Marketplace"
	},
	"slide3": {
		"title": "Add Marketplace",
		"field1": {
			"name": "Commission",
		    	"data": "num",
		    	"placeholder": "Enter commission"
		},
		"description": "Set the amount that will be collected as commission on marketplace transactions to support marketplace curation"
	},
}  
```

#### Slide Components
Each slide has 3 components:

 1. **"title"**:  Used to display what is being added/registered or what step in the slideshow the user is currently on.
 2. **"fieldx"**: Defines the properties of the specific user input field on the slide. Note it's important that the field is named 'field(_x_)' where 
 1 $\le$ x $\le$ 6.
 4. **"description"**: Used to inform the user about the purpose behind the field(s) displayed on the slide. The goal of the description is to alleviate confusion for new users.

Using these common components it's very easy to add more slides or change specific fields **as long as the JSON key names are consistent with the ones displayed here**. For example, we can add a new slide to our marketplace creation by adding the following JSON data to our existing _marketplaceFields.json_ file displayed above:

```json
"slide4": {
	"title": "Slide 4 Title",
	"field1": {
		"name": "Field 1 Name",
		"data": "num",
		"placeholder": "Field 1 Placeholder"
	},
	"field2": {
		"name": "Field 2 Name",
		"data": "num",
		"placeholder": "Field 2 Placeholder"
	},
	"field3": {
	    "name": "Field 3 Name",
		"data": "num",
		"placeholder": "Field 3 Placeholder"
	},
	"field4": {
		"name": "Field 4 Name",
		"data": "num",
		"placeholder": "Field 4 Placeholder"
	},
	"field5": {
		"name": "Field 5 Name",
		"data": "num",
		"placeholder": "Field 5 Placeholder"
	},
	"field6": {
		"name": "Field 6 Name",
		"data": "num",
		"placeholder": "Field 6 Placeholder"
	},
	"description": "Slide 4 Description: Only the json file needs to change to allow for more marketplace fields!"
}
``` 
This produces a [new slide](https://photos.app.goo.gl/Ap4MLif9MR83ihyx7) at the end with six fields displaying the following information:

![Slide Components](https://lh3.googleusercontent.com/vEq4eGOf9hz34W5u0K_8cNo-vmCiK0f0TFuT83YtKW6bDjY5nfOZcaIF3-_74lGHRz20uFwDDIaF)

#### Field Components
Each field has 3 components:

 1. **"name"**:  Used to display the name of the field over the input area to keep the user informed.
 2. **"data"**: Defines the desired input type. Used for error checking user inputs. Note that capitalization and leading and trailing white space in the user input does not impact the error checking process. There are **3 kinds of data values** recognized:
	 1. _"str"_: A string of text
	 2. _"num"_: A numeric value
	 3.  _"bool"_: A value of either true or false
 3. **"placeholder"**: Gives further clarification when necessary. For example, a more confusing field might include an example input in the placeholder.

### Extensions
Some extensions were considered when designing and building the site that we believe would enhance both the user and developer experience:

#### Use of  `creation.js` and `creation.html` by all pages

Currently, all of the functions necessary to support the slideshow where users can input values to create a marketplace/registry or add a device are duplicated in each respective js file. The code would be more flexible if instead all three html pages could use the `creation.js` file, that way only one file needs to be changed to edit the process for all slideshows. The only difference between the duplicated functions is one line in the `populateArrays()` function:
```javascript
$.getJSON('json/registryFields.json', {}, function(data) {
	...
}
```
```javascript
$.getJSON('json/marketplaceFields.json', {}, function(data) {
	...
}
```
```javascript
$.getJSON('json/deviceFields.json', {}, function(data) {
	...
}
```
The `creation.js` code solves this by checking it's location to determine which JSON file should be used:
```javascript
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
    // TODO more thorough error throwing
}
```
However, even with the common functions each separate html page still needs to assign their own unique Event Listeners for the below buttons because each page has different elements displayed:

 - Add button: the button to start the slideshow and hide other page elements
 - Cancel button: the button to cancel out of a slideshow and show other page elements
 - Finish button: the button to update the contract state, close the slideshow, and show other page elements 

The `creation.html` page also has the common html objects used to display the slideshow, _except for the button to initially display the slideshow_. This duplication was less of a concern because all pages could be changed at the same time by editing the `common.css` file. 

In the end we decided to keep the duplication in the `registries.js`, `marketplaces.js`, and `devices.js` files because we were running into bugs loading multiple external scripts into the html pages. We also reasoned it would be better to limit the number of external files to decrease loading times. However, the `creation.js` and `creation.html` files should be ready to use if it seems more beneficial to load these into all 3 pages.

#### Support for multiple input field types

It would streamline the process of registering devices and adding registries/marketplaces if the input field types were specialized to the datatype required from the user. For example, for fields that require yes/no or true/false responses a checkbox offers more ease than a text input field. We considered implementing this but feared we wouldn't have enough time to sufficiently test it because some browsers don't fully support changing the input field type in javascript. To implement this functionality the following changes need to be made:

 1. First, the input field types would need be changed depending upon the datatype expected. This would need to happen in the below 2 functions in the same place as the added if statements.
```javascript
function updateSingleFields(slideArr, storedInput) {
	var title = slideArr[0];
	var field = slideArr[1];
	var description = slideArr[2];
	var fieldName = field[0];
	var fieldData = field[1];
	var fieldPH = field[2];

	// handle displaying different input types here
	// TODO test with other browsers. Does every browser support input type changes?
	if (fieldData.toLowerCase() === "str") {
		document.getElementById("fieldInputSingle").type = "text";
		document.getElementById("fieldInputSingle").placeholder = fieldPH;
	}
	else if (fieldData.toLowerCase() === "num") {
		document.getElementById("fieldInputSingle").type = "number";
		document.getElementById("fieldInputSingle").placeholder = fieldPH;
	}
	else if (fieldData.toLowerCase() === "bool") {
		document.getElementById("fieldInputSingle").type = "checkbox";
	}

	document.getElementById('slideName').textContent = title;
	document.getElementById('fieldNameSingle').textContent = fieldName;
	document.getElementById("fieldInputSingle").value = storedInput;
	document.getElementById('fieldDescriptionSingle').textContent = description;
	$('#fieldInputSingle').removeClass("error");
}
```
```javascript
function updateMultiFields(slideArr, inputArr) {
	var title = slideArr[0];
	var description = slideArr[slideArr.length - 1];
	document.getElementById('slideName').textContent = title;
	document.getElementById('fieldDescriptionMulti').textContent = description;
	// can't handle more than 6 inputs on one multi field slide, plus 2 for the title and description
	if (slideArr.length > 8) {
		console.log("Critical json format error. More than 6 fields on slide!")
	}
	for (var i = 1; i < slideArr.length - 1; i++) {
		var fieldName = slideArr[i][0];
		var fieldData = slideArr[i][1];
		var fieldPH = slideArr[i][2];

		// handle displaying different input types here
		// TODO test with other browsers. Does every browser support input type changes?
		if (fieldData.toLowerCase() === "str") {
			document.getElementById("fieldInput" + i).type = "text";
		}
		else if (fieldData.toLowerCase() === "num") {
			document.getElementById("fieldInput" + i).type = "number";
		}
		else if (fieldData.toLowerCase() === "bool") {
			document.getElementById("fieldInput" + i).type = "checkbox";
		}

		document.getElementById("fieldInput" + i).value = inputArr[i - 1];
		document.getElementById("fieldInput" + i).placeholder = fieldPH;
		document.getElementById("fieldName" + i).textContent = fieldName;
		$('#fieldInput' + i).removeClass("error");
	}
}
```

 2. Second, the process for verifying the user input before changing slides would need to change slightly, specifically for bool types with a checkbox or non text input field:
```javascript
function verifySingleInput(inputType, input) {
	...
	else if (inputType.toLowerCase() === "bool") {
		// check the checkbox or other input field type
	}
	...
}
```

 3. Then the error display needs to be changed to indicate errors for other input field types. Currently some text is displayed with an error message in the input field, but this wouldn't work with inputs like a checkbox that don't contain text.
```javascript
function errorSingleInput(inputType, input) {
	if (inputType.toLowerCase() === "str") {
		input.value = "";
		input.placeholder = "Please enter some text";
		$('#' + input.id).addClass("error");
	}
	else if (inputType.toLowerCase() === "bool") {
		input.value = "";
		// display error somehow, perhaps changing css to display a red outline around inputs of a certain type
		$('#' + input.id).addClass("error");
	}
	...
}
```
Note that if a new "error" css class is used with a name other than "error", then these classes need to be removed in the following two functions to remove the error displays when the user navigates to a different slide:
```javascript
function updateSingleFields(slideArr, storedInput) {
	...
	$('#fieldInputSingle').removeClass("error");
	// change the above or remove any other error classes
}
```
```javascript
function updateMultiFields(slideArr, storedInput) {
	...
	for (var i = 1; i < slideArr.length - 1; i++) {
		...
		$('#fieldInput' + i).removeClass("error");
		// change the above or remove any other error classes
	}
}
```

 4. The function that handles storing user input would also need slight change to properly store inputs from different input field types. 
```javascript
 function updateInput(inputArr) {
	for (var i = 0; i < inputArr.length; i++) {
		inputArr[i] = document.getElementById("fieldInput" + (i + 1)).value.replace(/^\s+|\s+$/g,'');
		// Change needs to occur here. Do all input fields have a value property? 
	}
}
```
 5. Finally, the function to confirm the user input at the end of the slideshow must also be changed to properly error check for different input types. This is very similar to the rework needed in the `verifySingleInput()` function from step 2, but for this function _every field must have user input_.
```javascript
function confirmSingleInput(storedVal, valType) {
	if (valType.toLowerCase() === "str") {
		return typeof storedVal === typeof "" && storedVal !== "";
	}
	else if (valType.toLowerCase() === "bool") {
		// is any check needed? Just treat empty checkbox as false/no
	}
	...
}
```
