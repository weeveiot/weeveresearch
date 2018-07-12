# weeveresearch
Experimental things we are working on.

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
Each slide has 3 fields :

 1. **"title"**:  Used to display what is being added/registered or what step in the slideshow the user is currently on.
 2. **"field x"**: Defines the properties of the specific user input field on the slide.
 3. **"description"**: Used to inform the user about the purpose behind the field(s) displayed on the slide. The goal of the description is to alleviate confusion for new users.

Using these common components it's very easy to add more slides or change specific fields. For example, we can add a new slide to our marketplace creation by adding the following json data to our existing _marketplaceFields.json_ file displayed above:

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
This produces a new slide at the end with six fields displaying the following information:

![Slide Components](https://lh3.googleusercontent.com/vEq4eGOf9hz34W5u0K_8cNo-vmCiK0f0TFuT83YtKW6bDjY5nfOZcaIF3-_74lGHRz20uFwDDIaF)
