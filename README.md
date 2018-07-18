# weeveresearch
_Ben Hodgson_, _Braden Meyerhoefer_

Experimental things we are working on regarding the weeveNetwork demo.

### Adding Registries/Marketplaces and Registering Devices
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
