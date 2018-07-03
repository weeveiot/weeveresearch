// track what view is being shown
let landing = true;
let displayingReg = false;
let addingReg = false;


window.onload=function() {

	$("#infoPanel").hide();

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

			//show info panel on right side
			$("#infoPanel").show();
			$("#regName").innerText = selectedReg;

			landing = false;
			displayingReg = true;
		}
	});


}
