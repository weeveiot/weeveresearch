window.onload=function() {

	$("#devicesPanel").hide();
	$('#infoPanel').hide();

	// handle clicking of a registry
	var registryButtons = document.querySelector('#registryButtons');

	registryButtons.addEventListener('click', function(event) {

		//check if creator of event is child of the panel
		if(event.target.parentNode === registryButtons) {
			// get rid of left panel
			$('#titlePanel').hide();

			let string  = event.target.innerHTML;

			let beginning = string.search(">") + 2;
			let end = string.search("</p>");

			let selectedReg = string.slice(beginning, end);
			let msg = "Selected " + selectedReg;
			console.log(msg);

			//move list of registers from right to left
			$('#registryPanel').addClass("left").removeClass("right");

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


}
