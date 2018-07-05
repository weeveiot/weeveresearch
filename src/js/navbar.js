var web3;
var contract_registry;
var contract_token;
var contract_factory;
var networkID;
var address = "0x0";
var connected = false;

var token_address = '0x21D6690715dB82A7B11c17c7Dda8Cf7afAC47fD7';
var registry_address = '0x0';
var factory_address = '0x6edb9a1e68258f1d7aebefb4fbd53c74f68031b7';

var balanceETH = 0;
var balanceToken = 0;
var balanceStake = 0;
var allowanceToken = {};
var numberOfDevices = 0;

var deviceIDs = Array();

var waitForStake = {};
var waitForRegistry = {};
var waitForUnregistry = {};

var numberOfActiveRegistries = 0;
var numberOfMyActiveRegistries = 0;
var registries = {};

var numberOfActiveMarketplaces = 0;
var numberOfMyActiveMarketplaces = 0;
var marketplaces = {};

var tokenEvents;

var siteIsRegistry = false;
var siteIsMarketplace = false;
var siteIsDevice = false;

var testTokensRequested = false;

var interactionAddress;

window.addEventListener('load', function() {
  if(sessionStorage.getItem("carryOver") == true) {
      balanceETH = sessionStorage.getItem("balanceETH");
      balanceToken = sessionStorage.getItem("balanceToken");
      address = sessionStorage.getItem("address");
      connected = sessionStorage.getItem("connected");
      networkID = sessionStorage.getItem("networkID");
  }

  if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
  } else {
      console.log('No web3? You should consider trying MetaMask!')
      //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  // $.getJSON('abi_registry.json', function(data) {
  //     contract_registry = web3.eth.contract(data).at(registry_address)
  // });

  $.getJSON('abi_token.json', function(data) {
      contract_token = web3.eth.contract(data).at(token_address)
  });

  $.getJSON('abi_factory.json', function(data) {
      contract_factory = web3.eth.contract(data).at(factory_address)
  });

  var location = window.location.href.split("/")[window.location.href.split("/").length-1];
  switch(location) {
      case "devices.html":
          interactionAddress = "0x0";
          $('#setStakeButton').prop("disabled",true);
          $('#deviceFormSelectAction').prop("disabled",true);
          siteIsRegistry = false;
          siteIsMarketplace = false;
          siteIsDevice = true;
          setTimeout(function(){getAllRegistries(0, 0, 0, true);},200);
          break;
      case "registry.html":
          siteIsRegistry = true;
          siteIsMarketplace = false;
          siteIsDevice = true;
          interactionAddress = factory_address;
          setTimeout(function(){getAllRegistries(0, 0, 0, true);},200);
          break;
      case "marketplace.html":
          siteIsRegistry = false;
          siteIsMarketplace = true;
          siteIsDevice = false;
          interactionAddress = factory_address;
          setTimeout(function(){getAllMarketplaces(0, 0, 0, true);},200);
          break;
      default:
          interactionAddress = "0x0";
          siteIsRegistry = false;
          siteIsMarketplace = false;
          siteIsDevice = false;
          break;
  }



  $("#deviceFormSelectAction").change(function() {
      if($("#deviceFormSelectAction").val() == "default") {
          $(".deviceForm").hide();
      } else if ($("#deviceFormSelectAction").val() == "create"){
          $(".deviceForm").show();
          $("#deviceEditStake").hide();
          $("#deviceEditState").hide();
          $("#regDeviceButton").show();
          $("#unregDeviceButton").hide();
          $("#deviceName").val("Device_" + generateId(5));
          $("#deviceID").val(generateId(16));
          $("#deviceSensors").val("electricity,current");
          $("#deviceDataType").val("numeric");
          $("#deviceManufacturer").val("Sensor HW Ltd.");
          $("#deviceIdentifier").val("ChargingSens-" + generateId(5));
          $("#deviceDescription").val("Sensor - electrical current");
          $("#deviceProduct").val("CHARGE_SENS_1_8");
          $("#deviceVersion").val("1.50.361A");
          $("#deviceSerial").val("LR04M1CA");
          $("#deviceCPU").val("ARM Cortex-A53");
          $("#deviceWIFI").val("true");
          $("#deviceTrustzone").val("true");
          $(".deviceForm .form-control").prop("disabled",false);
      }
      else {
          checkDevice();
          $("#regDeviceButton").hide();
          $("#deviceEdit").show();
          $("#unregDeviceButton").show();
          $("#deviceEditStake").show();
          $("#deviceEditState").show();
          getDeviceMetainformationFromID($("#deviceFormSelectAction").val(), function(res) {
              $("#deviceSensors").val(res.sensors);
              $("#deviceDataType").val(res.dataType);
              $("#deviceManufacturer").val(res.manufacturer);
              $("#deviceIdentifier").val(res.identifier);
              $("#deviceDescription").val(res.description);
              $("#deviceProduct").val(res.product);
              $("#deviceVersion").val(res.version);
              $("#deviceSerial").val(res.serial);
              $("#deviceCPU").val(res.cpu);
              $("#deviceWIFI").val(res.wifi);
              $("#deviceTrustzone").val(res.trustzone);
              $(".deviceForm .form-control").prop("disabled",true);
              $(".deviceForm").show();
          });
      }
  });
  $("#registryFormSelectAction").change(function() {
      $('#deviceFormSelectAction').val("default");
      $('#deviceFormSelectAction').trigger("change");
      numberOfDevices = 0;
      if(interactionAddress != factory_address) {
          interactionAddress = "0x0";
      }

      if($("#registryFormSelectAction").val() == "default") {
          $(".registryForm").hide();
      } else if ($("#registryFormSelectAction").val() == "create"){
          $(".registryForm").show();
          $("#regRegistryButton").show();
          $("#unregRegistryButton").hide();
          $("#registryEditStake").hide();
          $("#registryEditStakeRegistration").show();
          $("#registryEditStakeValidator").show();
          $("#registryEditStakeArbiter").show();
          $("#registryName").val("My little registry")
          $(".registryForm .form-control").prop("disabled",false);
      }
      else {
          if(interactionAddress != factory_address) {
              interactionAddress = $("#registryFormSelectAction").val();

              eventListening();
              $.getJSON('abi_registry.json', function(data) {
                  contract_registry = web3.eth.contract(data).at(interactionAddress)
              });
              setTimeout(generalInformation, 100);
              setTimeout(function(){getDeviceCount(true);}, 100);

              $('#setStakeButton').prop("disabled",false);
              $('#deviceFormSelectAction').prop("disabled",false);
          } else {
              $(".registryForm").show();
              $("#regRegistryButton").hide();
              $("#unregRegistryButton").show();
              $("#registryEditStake").show();
              $("#registryName").val(registries[$("#registryFormSelectAction").val()][1])
              $("#registryStake").val(web3.fromWei(registries[$("#registryFormSelectAction").val()][4], 'ether') + " WEEV")
              $("#registryEditStakeRegistration").hide();
              $("#registryEditStakeValidator").hide();
              $("#registryEditStakeArbiter").hide();
              $(".registryForm .form-control").prop("disabled",true);
          }
      }
      if(interactionAddress == "0x0") {
          $('#setStakeButton').prop("disabled",true);
          $('#deviceFormSelectAction').prop("disabled",true);
      }
  });
  $("#marketplaceFormSelectAction").change(function() {
      if($("#marketplaceFormSelectAction").val() == "default") {
          $(".marketplaceForm").hide();
      } else if ($("#marketplaceFormSelectAction").val() == "create"){
          $(".marketplaceForm").show();
          $("#regMarketplaceButton").show();
          $("#unregMarketplaceButton").hide();
          $("#marketplaceName").val("My little marketplace")
          $("#registryEditStake").hide();
          $("#registryEditStakeRegistration").show();
          $("#registryEditStakeValidator").show();
          $("#registryEditStakeArbiter").show();
          $(".marketplaceForm .form-control").prop("disabled",false);
      }
      else {
          if(interactionAddress != factory_address) {
              interactionAddress = $("#marketplaceFormSelectAction").val();
              eventListening();
              $.getJSON('abi_registry.json', function(data) {
                  contract_registry = web3.eth.contract(data).at(interactionAddress)
              });
              setTimeout(generalInformation, 100);
              $('#setStakeButton').prop("disabled",false);
              $('#deviceFormSelectAction').prop("disabled",false);
          } else {
              $(".marketplaceForm").show();
              $("#regMarketplaceButton").hide();
              $("#unregMarketplaceButton").show();
              $("#marketplaceEditStake").show();
              $("#marketplaceName").val(marketplaces[$("#marketplaceFormSelectAction").val()][1])
              $("#marketplaceStake").val(marketplaces[$("#marketplaceFormSelectAction").val()][4] + " WEEV")
              $("#marketplaceEditCommission").hide();
              $(".marketplaceForm .form-control").prop("disabled",true);
          }
      }
      if(interactionAddress == "0x0") {
          $('#setStakeButton').prop("disabled",true);
      }
  });
  setTimeout(checkConnection, 500);
})

function checkConnection() {
  if(typeof web3 !== 'undefined') {
      if(!connected) {
          $("#metamaskButton").removeAttr('class');
          $("#metamaskButton").addClass("badge badge-warning");
          $("#metamaskButton").html('<i class="fa fa-lock" style="font-size:0.9em"></i> Connected, but locked.')
          $('#balanceETH').hide();
          $('#balanceToken').hide();
          connected = true
          sessionStorage.setItem('connected', connected);
      }
  } else {
      if(connected) {
          $("#metamaskButton").removeAttr('class');
          $("#metamaskButton").addClass("badge badge-danger");
          $("#metamaskButton").text("Not connected.")
          $('#balanceETH').hide();
          $('#balanceToken').hide();
          connected = false
          sessionStorage.setItem('connected', connected);
      }
  }

  if(web3.eth.accounts[0] != address) {
      address = web3.eth.accounts[0]
      sessionStorage.setItem('address', address);
      $("#metamaskButton").html('<i class="fa fa-unlock" style="font-size:20px"></i> ' + address);
      if(networkID == "4") {
          $('#balanceETH').show();
          $('#balanceToken').show();
      }
      setTimeout(eventListening, 1000);
      setTimeout(generalInformation, 100);
  }

  web3.version.getNetwork(function(err, netId) {
      if(netId != networkID) {
          switch (netId) {
              case "4":
                  $("#metamaskButton").removeAttr('class');
                  $("#metamaskButton").addClass("badge badge-success");
                  if(connected && typeof address !== 'undefined' && address.startsWith("0x")) {
                      $('#balanceETH').show();
                      $('#balanceToken').show();
                  } else {
                      $('#balanceETH').hide();
                      $('#balanceToken').hide();
                  }
                  break;
              default:
                  $("#metamaskButton").removeAttr('class');
                  $("#metamaskButton").addClass("badge badge-warning");
                  $("#metamaskButton").text("Metamask: Please switch to Rinkeby.");
                  $('#balanceETH').hide();
                  $('#balanceToken').hide();
                  break;
          }
          netId = networkID;
          sessionStorage.setItem('networkID', networkID);
      }
  });
  sessionStorage.setItem('carryOver', true);
  setTimeout(checkConnection, 2000);
}

function generalInformation() {
  if(typeof address !== 'undefined') {
      web3.eth.getBalance(web3.eth.accounts[0], function(err, res){
          if(Number(web3.fromWei(res, 'ether')) != balanceETH) {
              balanceETH = Number(web3.fromWei(res, 'ether'));
              sessionStorage.setItem('balanceETH', balanceETH);
              $("#balanceETH").text(round(balanceETH, 5) + " ETH");
          }
      });
      contract_token.balanceOf(web3.eth.accounts[0], function(errCall, result) {
          if(!errCall) {
              if(!testTokensRequested && Number(result) == 0) {
                  $('#getTokens').show();
              } else {
                  $('#getTokens').hide();
              }
              if(Number(result) != balanceToken) {
                  balanceToken = Number(result);
                  sessionStorage.setItem('balanceToken', balanceToken);
                  $("#balanceToken").text(web3.fromWei(balanceToken, 'ether') + " WEEV");
              }
          }
          else {
              console.log(errCall)
          }
      });
      if(interactionAddress != token_address && interactionAddress != factory_address && interactionAddress != "0x0") {
          contract_registry.getTotalStakeOfAddress(web3.eth.accounts[0], function(errCall, result) {
              if(!errCall) {
                  if(Number(result) != balanceStake) {
                      balanceStake = web3.fromWei(Number(result), 'ether');
                      $("#balanceStake").text(balanceStake + " WEEV staked");
                  }
              }
              else {
                  console.log(errCall)
              }
          });
      }
  }
  if(interactionAddress != "0x0") {
      getTokenAllowance();
      if(interactionAddress != factory_address && interactionAddress != token_address) {
          getDeviceCount(false);
      }
  }
  setTimeout(generalInformation, 3000);
}

function getTestTokens() {
  web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
      if(!errNonce) {
          contract_factory.getTestTokens({value: 0, gas: 100000, nonce: nonce},function(errCall, result) {
              if(!errCall) {
                  testTokensRequested = true;
                  $('#getTokens').hide();
              }
              else {
                  testTokensRequested = true;
                  $('#getTokens').hide();
                  console.log(errCall)
              }
          });
      }
  });
}

function eventListening() {
  tokenApprovalEvents = contract_token.Approval({tokenOwner: address, spender: interactionAddress});
  tokenApprovalEvents.watch(function(error, result){
      if(!error) {
          if(typeof waitForStake[result.transactionHash] !== "undefined") {
              $('#afterAllowanceDiv').html('<div id="waitingForApproval"><i class="fa fas fa-check" style="font-size:20px"></i> New stake was successfully set!<br><br></div>');
              $('#setStakeButton').prop("disabled",false);
              setTimeout(function(){$('#afterAllowanceDiv').html('');}, 4000);
              delete waitForStake[result.transactionHash];
          }
      }
  });
}

function getBalance() {
  web3.eth.getBalance(web3.eth.accounts[0], function(err, res){
      console.log(Number(web3.fromWei(res, 'ether')) + " ETH");
  });
}

function getTokenAllowance() {
  if(interactionAddress != "0x0") {
      contract_token.allowance(address, interactionAddress, function(errCall, result) {
          if(!errCall) {
              if(Number(web3.fromWei(result, 'ether')) != allowanceToken[interactionAddress] || $("#currentAllowance").text() != Number(web3.fromWei(result, 'ether')) + " WEEV") {
                  allowanceToken[interactionAddress] = Number(web3.fromWei(result, 'ether'));
                  $("#currentAllowance").text(allowanceToken[interactionAddress] + " WEEV");
              }

          }
          else {
              console.log(errCall)
          }
      });
  }
}

function setAllowance(contract) {
  if(interactionAddress != "0x0") {
      var newAllowance = web3.toWei(parseFloat($("#newAllowance").val()), 'ether');
      if(!isNaN(newAllowance) && newAllowance != allowanceToken[interactionAddress]) {
          var contract_call_data = contract_token.approve.getData(interactionAddress, newAllowance);

          web3.eth.estimateGas({data: contract_call_data, to: token_address, from: web3.eth.accounts[0]}, function(errEstimate, estimatedGas) {
              if(!errEstimate) {
                  web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
                      if(!errNonce) {
                          contract_token.approve(interactionAddress, newAllowance, {value: 0, gas: parseInt(estimatedGas*1.1), nonce: nonce},function(errCall, result) {
                              $("#newAllowance").val("0");
                              if(!errCall) {
                                  waitForStake[result] = newAllowance;
                                  $('#setStakeButton').prop("disabled",true);
                                  $('#afterAllowanceDiv').html('<div id="waitingForApproval"><i class="fa fa-spinner fa-spin" style="font-size:20px"></i> Waiting for your transaction to be mined...<br><br></div>');
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
}

function getDeviceCount(additional_mode) {
  if(siteIsDevice) {
      contract_registry.getDeviceCountOfUser(address, function(errCall, result) {
          if(!errCall) {
              if(Number(result) != numberOfDevices || additional_mode) {
                  if(Object.keys(waitForRegistry).length != 0) {
                      $('#regDeviceButton').prop("disabled",false);
                      $('#unregDeviceButton').prop("disabled",false);
                      $('#afterDeviceRegDiv').html('<div id="waitingForDevice"><i class="fa fas fa-check" style="font-size:20px"></i> New device (' + waitForRegistry[Object.keys(waitForRegistry)[0]] + ') was successfully accepted to "' + registries[interactionAddress][1] + '"!<br><br></div>');
                      waitForRegistry = {};
                      setTimeout(function(){$('#afterDeviceRegDiv').html('');}, 4000);
                  } else if(Object.keys(waitForUnregistry).length != 0) {
                      $('#regDeviceButton').prop("disabled",false);
                      $('#unregDeviceButton').prop("disabled",false);
                      $('#afterDeviceRegDiv').html('<div id="waitingForDevice"><i class="fa fas fa-check" style="font-size:20px"></i> Device (' + waitForUnregistry[Object.keys(waitForUnregistry)[0]] + ') was successfully removed from "' + registries[interactionAddress][1] + '"!<br><br></div>');
                      waitForUnregistry = {};
                      setTimeout(function(){$('#afterDeviceRegDiv').html('');}, 4000);
                  }
                  numberOfDevices = Number(result);
                  getDeviceIDsFromArray(numberOfDevices);
              }
          }
          else {
              console.log(errCall)
          }
      });
  }
}

function getAllRegistries(counter, currentNumberOfActiveRegistries, currentNumberOfMyActiveRegistries, add_mode) {
  if(siteIsRegistry || siteIsDevice) {
      if(address != "0x0") {
          getRegistry(counter, function(res, err) {
              if(!err) {
                  if(res[5] == true) {
                      if(add_mode) {
                          if((interactionAddress == factory_address && currentNumberOfMyActiveRegistries == 0) || (interactionAddress != factory_address && currentNumberOfActiveRegistries == 0)) {
                              $('#registryFormSelectAction').empty();
                              $('#myRegistries').empty();
                              $('#myRegistries').append("<ul>");
                              $('#registryFormSelectAction').append($('<option>', {
                                  value: "default",
                                  text : "Select a registry..."
                              }));
                              $('#registryFormSelectAction').append('<option value="spacer" disabled>---------------------</option>');
                              if(interactionAddress == factory_address) {
                                  $('#registryFormSelectAction').append('<option value="create">Create a new registry...</option>');
                                  $('#registryFormSelectAction').append('<option value="spacer" disabled>---------------------</option>');
                              }
                              if((interactionAddress != factory_address || (interactionAddress == factory_address && res[2] == address))) {
                                  $('#registryFormSelectAction').append($('<option>', {
                                      value: res[3],
                                      text : res[1]
                                  }));
                                  $('#myRegistries').append("<li><strong>" + res[1] + "</strong> [<a href='https://rinkeby.etherscan.io/address/" + res[3] + "' target='_blank'>Link to rinkeby</a>]</li>");
                              }
                          }
                          if((interactionAddress == factory_address && currentNumberOfMyActiveRegistries > 0) || (interactionAddress != factory_address && currentNumberOfActiveRegistries > 0)) {
                              if((interactionAddress != factory_address || (interactionAddress == factory_address && res[2] == address))) {
                                  $('#registryFormSelectAction').append($('<option>', {
                                      value: res[3],
                                      text : res[1]
                                  }));
                                  $('#myRegistries').append("<li><strong>" + res[1] + "</strong> [<a href='https://rinkeby.etherscan.io/address/" + res[3] + "' target='_blank'>Link to rinkeby</a>]</li>");
                              }
                          }
                          registries[res[3]] = res;
                      }
                      currentNumberOfActiveRegistries++;
                      if(interactionAddress == factory_address && res[2] == address) {
                          currentNumberOfMyActiveRegistries++;
                      }
                  }
                  let newCounter = counter + 1;
                  getAllRegistries(newCounter, currentNumberOfActiveRegistries, currentNumberOfMyActiveRegistries, add_mode);
              } else {
                  add_mode = false;
                  if(interactionAddress == factory_address) {
                      if(numberOfMyActiveRegistries != currentNumberOfMyActiveRegistries) {
                          if(currentNumberOfMyActiveRegistries > numberOfMyActiveRegistries) {
                              if(Object.keys(waitForRegistry).length != 0) {
                                  getAllRegistries(0, 0, 0, true);
                                  $('#regRegistryButton').prop("disabled",false);
                                  $('#unregRegistryButton').prop("disabled",false);
                                  $('#afterRegistryRegDiv').html('<div id="waitingForDevice"><i class="fa fas fa-check" style="font-size:20px"></i> New registry (' + waitForRegistry[Object.keys(waitForRegistry)[0]] + ') was successfully created!<br><br></div>');
                                  waitForRegistry = {};
                                  setTimeout(function(){$('#afterRegistryRegDiv').html('');}, 4000);
                              }
                          } else {
                              if(Object.keys(waitForUnregistry).length != 0) {
                                  getAllRegistries(0, 0, 0, true);
                                  $('#regRegistryButton').prop("disabled",false);
                                  $('#unregRegistryButton').prop("disabled",false);
                                  $('#afterRegistryRegDiv').html('<div id="waitingForDevice"><i class="fa fas fa-check" style="font-size:20px"></i> Registry (' + waitForUnregistry[Object.keys(waitForUnregistry)[0]] + ') was successfully closed!<br><br></div>');
                                  waitForUnregistry = {};
                                  setTimeout(function(){$('#afterRegistryRegDiv').html('');}, 4000);
                              }
                          }
                      }
                      if(currentNumberOfMyActiveRegistries == 0 && $('#nothingFound').text() != "No registries found.") {
                          $('#registryFormSelectAction').append('<option id="nothingFound" value="spacer" disabled>No registries found.</option>');
                          $('#myRegistries').append("<i>No registries found.</i>");
                      } else {
                          $('#myRegistries').append("</ul>");
                      }
                  } else {
                      if(numberOfActiveRegistries != currentNumberOfActiveRegistries) {

                      }
                      if(currentNumberOfActiveRegistries == 0 && $('#nothingFound').text() != "No registries found.") {
                          $('#registryFormSelectAction').append('<option id="nothingFound" value="spacer" disabled>No registries found.</option>');
                          $('#myRegistries').append("<i>No registries found.</i>");
                      } else {
                          $('#myRegistries').append("</ul>");
                      }
                  }
                  numberOfActiveRegistries = currentNumberOfActiveRegistries;
                  numberOfMyActiveRegistries = currentNumberOfMyActiveRegistries;
                  setTimeout(function(){getAllRegistries(0, 0, 0, false);}, 5000);
              }
          });
      } else {
      setTimeout(function(){getAllRegistries(0, 0, 0, true);}, 100);
      }
  }
}

function getRegistry(position, callback) {
  contract_factory.allRegistries(position, function(errCall, result) {
          if(!errCall) {
              callback(result, null);
          }
          else {
              callback(null, true);
          }
  });
}

function getAllMarketplaces(counter, currentNumberOfActiveMarketplaces, currentNumberOfMyActiveMarketplaces, add_mode) {
  if(siteIsMarketplace) {
      if(address != "0x0") {
          getMarketplace(counter, function(res, err) {
              if(!err) {
                  if(res[5] == true) {
                      if(add_mode) {
                          if((interactionAddress == factory_address && currentNumberOfMyActiveMarketplaces == 0) || (interactionAddress != factory_address && currentNumberOfActiveMarketplaces == 0)) {
                              $('#marketplaceFormSelectAction').empty();
                              $('#myMarketplaces').empty();
                              $('#myMarketplaces').append("<ul>");
                              $('#marketplaceFormSelectAction').append($('<option>', {
                                  value: "default",
                                  text : "Select a marketplace..."
                              }));
                              $('#marketplaceFormSelectAction').append('<option value="spacer" disabled>---------------------</option>');
                              if(interactionAddress == factory_address) {
                                  $('#marketplaceFormSelectAction').append('<option value="create">Create a new marketplace...</option>');
                                  $('#marketplaceFormSelectAction').append('<option value="spacer" disabled>---------------------</option>');
                              }
                              if((interactionAddress != factory_address || (interactionAddress == factory_address && res[2] == address))) {
                                  $('#marketplaceFormSelectAction').append($('<option>', {
                                      value: res[3],
                                      text : res[1]
                                  }));
                                  $('#myMarketplaces').append("<li><strong>" + res[1] + "</strong> [<a href='https://rinkeby.etherscan.io/address/" + res[3] + "' target='_blank'>Link to rinkeby</a>]</li>");
                              }
                          }
                          if((interactionAddress == factory_address && currentNumberOfMyActiveMarketplaces > 0) || (interactionAddress != factory_address && currentNumberOfActiveMarketplaces > 0)) {
                              if((interactionAddress != factory_address || (interactionAddress == factory_address && res[2] == address))) {
                                  $('#marketplaceFormSelectAction').append($('<option>', {
                                      value: res[3],
                                      text : res[1]
                                  }));
                                  $('#myMarketplaces').append("<li><strong>" + res[1] + "</strong> [<a href='https://rinkeby.etherscan.io/address/" + res[3] + "' target='_blank'>Link to rinkeby</a>]</li>");
                              }
                          }
                          marketplaces[res[3]] = res;
                      }
                      currentNumberOfActiveMarketplaces++;
                      if(interactionAddress == factory_address && res[2] == address) {
                          currentNumberOfMyActiveMarketplaces++;
                      }
                  }
                  let newCounter = counter + 1;
                  getAllMarketplaces(newCounter, currentNumberOfActiveMarketplaces, currentNumberOfMyActiveMarketplaces, add_mode);
              } else {
                  add_mode = false;
                  if(interactionAddress == factory_address) {
                      if(numberOfMyActiveMarketplaces != currentNumberOfMyActiveMarketplaces) {
                          if(currentNumberOfMyActiveMarketplaces > numberOfMyActiveMarketplaces) {
                              if(Object.keys(waitForRegistry).length != 0) {
                                  getAllMarketplaces(0, 0, 0, true);
                                  $('#regRegistryButton').prop("disabled",false);
                                  $('#unregRegistryButton').prop("disabled",false);
                                  $('#afterMarketplaceRegDiv').html('<div id="waitingForDevice"><i class="fa fas fa-check" style="font-size:20px"></i> New marketplace (' + waitForRegistry[Object.keys(waitForRegistry)[0]] + ') was successfully created!<br><br></div>');
                                  waitForRegistry = {};
                                  setTimeout(function(){$('#afterMarketplaceRegDiv').html('');}, 4000);
                              }
                          } else {
                              if(Object.keys(waitForUnregistry).length != 0) {
                                  getAllMarketplaces(0, 0, 0, true);
                                  $('#regRegistryButton').prop("disabled",false);
                                  $('#unregRegistryButton').prop("disabled",false);
                                  $('#afterMarketplaceRegDiv').html('<div id="waitingForDevice"><i class="fa fas fa-check" style="font-size:20px"></i> Marketplace (' + waitForUnregistry[Object.keys(waitForUnregistry)[0]] + ') was successfully closed!<br><br></div>');
                                  waitForUnregistry = {};
                                  setTimeout(function(){$('#afterMarketplaceRegDiv').html('');}, 4000);
                              }
                          }
                      }
                      if(currentNumberOfMyActiveMarketplaces == 0 && $('#nothingFound').text() != "No marketplaces found.") {
                          $('#marketplaceFormSelectAction').append('<option id="nothingFound" value="spacer" disabled>No marketplaces found.</option>');
                          $('#myMarketplaces').append("<i>No marketplaces found.</i>");
                      } else {
                          $('#myMarketplaces').append("</ul>");
                      }
                  } else {
                      if(numberOfActiveRegistries != currentNumberOfActiveMarketplaces) {

                      }
                      if(currentNumberOfActiveMarketplaces == 0 && $('#nothingFound').text() != "No marketplaces found.") {
                          $('#marketplaceFormSelectAction').append('<option id="nothingFound" value="spacer" disabled>No marketplaces found.</option>');
                          $('#myMarketplaces').append("<i>No marketplaces found.</i>");
                      } else {
                          $('#myMarketplaces').append("</ul>");
                      }
                  }
                  numberOfActiveMarketplaces = currentNumberOfActiveMarketplaces;
                  numberOfMyActiveMarketplaces = currentNumberOfMyActiveMarketplaces;
                  setTimeout(function(){getAllMarketplaces(0, 0, 0, false);}, 5000);
              }
          });
      } else {
      setTimeout(function(){getAllMarketplaces(0, 0, 0, true);}, 100);
      }
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


function getDeviceIDsFromArray(numberOfDevices) {
  deviceIDs = Array();
  $('#deviceFormSelectAction').empty();
  $('#myDevices').empty();
  $('#deviceFormSelectAction').append($('<option>', {
      value: "default",
      text : "Select your action..."
  }));
  $('#deviceFormSelectAction').append('<option value="spacer" disabled>---------------------</option>');
  $('#deviceFormSelectAction').append($('<option>', {
      value: "create",
      text : "Register a new device..."
  }));
  $('#deviceFormSelectAction').append('<option value="spacer" disabled>---------------------</option>');
  if(numberOfDevices == 0) {
      $('#deviceFormSelectAction').append('<option value="spacer" disabled>No devices found.</option>');
      $('#myDevices').append("<i>No devices found.</i>");
  }

  for(var i = 0; i < numberOfDevices; i++) {
      contract_registry.getDeviceIDFromUserArray(address, i, function(errCall, result) {
          if(!errCall) {
              if(result) {
                  deviceIDs.push(result);
                  $('#deviceFormSelectAction').append($('<option>', {
                      value: result,
                      text : result
                  }));
                  $('#myDevices').append("<li><strong>" + result + "</strong></li>");
              }
          }
          else {
              console.log(errCall)
          }
      });
  }
}

function getDeviceMetainformationFromID(deviceID, callback) {
  deviceObject = {};
  contract_registry.getDeviceMetainformation1ByID(deviceID, function(errCall, result) {
      if(!errCall) {
          deviceObject.sensors = result[0];
          deviceObject.dataType = result[1];
          deviceObject.manufacturer = result[2];
          deviceObject.identifier = result[3];
          deviceObject.description = result[4];
          deviceObject.product = result[5];
          contract_registry.getDeviceMetainformation2ByID(deviceID, function(errCall, result) {
              if(!errCall) {
                  deviceObject.version = result[0];
                  deviceObject.serial = result[1];
                  deviceObject.cpu = result[2];
                  deviceObject.trustzone = result[3];
                  deviceObject.wifi = result[4];
                  callback(deviceObject);
              }
              else {
                  console.log(errCall)
              }
          });
      }
      else {
          console.log(errCall)
      }
  });
}

function registerDevice() {
  if(interactionAddress != "0x0") {
      if(allowanceToken[interactionAddress] >= 10) {
          var test_json = '{"sensors":"' + $("#deviceSensors").val() + '","dataType":"' + $("#deviceDataType").val() + '","manufacturer":"' + $("#deviceManufacturer").val() + '","id":"' + $("#deviceIdentifier").val() + '","description":"' + $("#deviceDescription").val() + '","product":"' + $("#deviceProduct").val() + '", "version":"' + $("#deviceVersion").val() + '","serial":"' + $("#deviceSerial").val() + '","cpu":"' + $("#deviceCPU").val() + '","trustzone":"' + $("#deviceTrustzone").val() + '","wifi":"' + $("#deviceWIFI").val() + '"}';

          var json_object = JSON.parse(test_json);
          var bytes_array = new Array();
          for(var key in json_object) {
              bytes_array.push(web3.fromAscii(json_object[key]));
          }
          var deviceID = $("#deviceID").val();
          var deviceName = $("#deviceName").val();
          var contract_call_data = contract_registry.requestRegistration.getData(deviceName, deviceID, bytes_array);
          web3.eth.estimateGas({data: contract_call_data, to: interactionAddress}, function(errEstimate, estimatedGas) {
              if(!errEstimate) {
                  web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
                      if(!errNonce) {
                          contract_registry.requestRegistration(deviceName, deviceID, bytes_array, {value: 0, gas: parseInt(estimatedGas*1.1), nonce: nonce},function(errCall, result) {
                              $('#deviceFormSelectAction').val("default");
                              $('#deviceFormSelectAction').trigger("change");
                              if(!errCall) {
                                  if(result.startsWith("0x")) {
                                      waitForRegistry[result] = deviceID;
                                      $('#regDeviceButton').prop("disabled",true);
                                      $('#unregDeviceButton').prop("disabled",true);
                                      $('#afterDeviceRegDiv').html('<div id="waitingForDevice"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i> Waiting for your transaction to be mined...<br><br></div>');
                                  }
                              }
                              else {
                                  console.log(errCall)
                              }
                          });
                      }
                  });
              } else {
                  console.log(errEstimate)
              }
          });
      } else {
          $("#wrapper").prepend('<div id="alertNotEnoughWEEV" class="alert alert-danger alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Oh no! An error occured!</strong><br> You don\' have enough WEEV tokens allowed to be withdrawn by the registry.<br> Please allow the registry to withdraw at least 10 WEEV!</div>');
          $(document).ready(function(){
              $(window).scrollTop(0);
          });
          setTimeout(function(){$("#alertNotEnoughWEEV").alert('close');}, 10000);
      }
  }
}

function checkDevice() {
  if(interactionAddress != "0x0") {
      var deviceID = $("#deviceFormSelectAction option:selected").text();
      if(!deviceID.startsWith("Select")) {
          contract_registry.getDeviceByID(deviceID, function(errCall, result) {
              if(!errCall) {
                  $("#deviceID").val(result[1]);
                  $("#deviceName").val(result[0]);
                  $("#deviceStake").val(web3.fromWei(result[4], 'ether') + " WEEV");
                  $("#deviceState").val(result[5]);
              }
              else {
                  console.log(errCall)
              }
          });
      }
  }
}

function unregisterDevice() {
  if(interactionAddress != "0x0") {
      var deviceID = $("#deviceFormSelectAction option:selected").text();
      if(!deviceID.startsWith("Select") && !deviceID.startsWith("Register")) {
          var contract_call_data = contract_registry.unregister.getData(deviceID);
          web3.eth.estimateGas({data: contract_call_data, to: interactionAddress}, function(errEstimate, estimatedGas) {
              if(!errEstimate) {
                  web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
                      if(!errNonce) {
                          contract_registry.unregister(deviceID, {value: 0, gas: parseInt(estimatedGas*1.1), nonce: nonce},function(errCall, result) {
                              $('#deviceFormSelectAction').val("default");
                              $('#deviceFormSelectAction').trigger("change");
                              if(!errCall) {
                                  if(result.startsWith("0x")) {
                                      waitForUnregistry[result] = deviceID;
                                      $('#regDeviceButton').prop("disabled",true);
                                      $('#unregDeviceButton').prop("disabled",true);
                                      $('#afterDeviceRegDiv').html('<div id="waitingForDevice"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i> Waiting for your transaction to be mined...<br><br></div>');
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
}

function registerRegistry() {
  if(allowanceToken[interactionAddress] >= 1000) {
      var registryName = $("#registryName").val();
      var registryStakeRegistration = web3.toWei($("#registryStakeRegistration").val(), 'ether');
      var registryStakeValidator = web3.toWei($("#registryStakeValidator").val(), 'ether');
      var registryStakeArbiter = web3.toWei($("#registryStakeArbiter").val(), 'ether');
      var registryCode = "0x6080604052736edb9a1e68258f1d7aebefb4fbd53c74f68031b7600c60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507321d6690715db82a7b11c17c7dda8cf7afac47fd7600d60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550348015620000bb57600080fd5b50620000c66200035e565b600080600a0160006101000a81548160ff021916908315150217905550806000800160405180807f656d70747900000000000000000000000000000000000000000000000000000081525060050190509081526020016040518091039020600082015181600001908051906020019062000142929190620003bb565b50602082015181600101908051906020019062000161929190620003bb565b5060408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606082015181600301556080820151816004019080519060200190620001d1929190620003bb565b5060a0820151816005019080519060200190620001f0929190620003bb565b5060c082015181600601600082015181600001908051906020019062000218929190620003bb565b50602082015181600101908051906020019062000237929190620003bb565b50604082015181600201908051906020019062000256929190620003bb565b50606082015181600301908051906020019062000275929190620003bb565b50608082015181600401908051906020019062000294929190620003bb565b5060a0820151816005019080519060200190620002b3929190620003bb565b5060c0820151816006019080519060200190620002d2929190620003bb565b5060e0820151816007019080519060200190620002f1929190620003bb565b5061010082015181600801908051906020019062000311929190620003bb565b5061012082015181600901908051906020019062000331929190620003bb565b5061014082015181600a01908051906020019062000351929190620003bb565b50505090505050620004c5565b610220604051908101604052806060815260200160608152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600081526020016060815260200160608152602001620003b562000442565b81525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620003fe57805160ff19168380011785556200042f565b828001600101855582156200042f579182015b828111156200042e57825182559160200191906001019062000411565b5b5090506200043e91906200049d565b5090565b6101606040519081016040528060608152602001606081526020016060815260200160608152602001606081526020016060815260200160608152602001606081526020016060815260200160608152602001606081525090565b620004c291905b80821115620004be576000816000905550600101620004a4565b5090565b90565b61413980620004d56000396000f300608060405260043610610149576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806308ef4f741461014e5780631654d1691461017d5780633487e08c1461020d57806335100a3c14610250578063366f13f4146102a757806340a141ff146102fe5780634d238c8e14610341578063631831fb146103845780636598a1ae1461044357806365e5f5f0146104ac57806367f8a8b814610572578063706c2c24146105bf578063743539b314610851578063868578a41461087c5780639846067c146108a7578063ab61d7a914610958578063b538d3bc146109af578063c0be58b2146109f2578063c4abf32614610ae4578063cb0b75ac14610b11578063e4a7bdba14610d71578063e73308e414610dc8578063ee9bfff514610e31578063f973af5f1461112f578063fbc6e3ae1461118a575b600080fd5b34801561015a57600080fd5b506101636111e5565b604051808215151515815260200191505060405180910390f35b34801561018957600080fd5b5061019261127a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101d25780820151818401526020810190506101b7565b50505050905090810190601f1680156101ff5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561021957600080fd5b5061024e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611318565b005b34801561025c57600080fd5b5061026561140c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102b357600080fd5b506102bc611432565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561030a57600080fd5b5061033f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611458565b005b34801561034d57600080fd5b50610382600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061154c565b005b34801561039057600080fd5b50610429600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001909291908035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611650565b604051808215151515815260200191505060405180910390f35b34801561044f57600080fd5b506104aa600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506117fe565b005b3480156104b857600080fd5b506104f7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611ad5565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561053757808201518184015260208101905061051c565b50505050905090810190601f1680156105645780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561057e57600080fd5b506105bd600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611c28565b005b3480156105cb57600080fd5b50610626600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611e2d565b60405180806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b8381101561067657808201518184015260208101905061065b565b50505050905090810190601f1680156106a35780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b838110156106dc5780820151818401526020810190506106c1565b50505050905090810190601f1680156107095780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b83811015610742578082015181840152602081019050610727565b50505050905090810190601f16801561076f5780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b838110156107a857808201518184015260208101905061078d565b50505050905090810190601f1680156107d55780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b8381101561080e5780820151818401526020810190506107f3565b50505050905090810190601f16801561083b5780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390f35b34801561085d57600080fd5b506108666124f6565b6040518082815260200191505060405180910390f35b34801561088857600080fd5b50610891612502565b6040518082815260200191505060405180910390f35b3480156108b357600080fd5b506108bc61250e565b60405180888152602001878152602001868152602001858152602001841515151581526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200197505050505050505060405180910390f35b34801561096457600080fd5b50610999600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061258b565b6040518082815260200191505060405180910390f35b3480156109bb57600080fd5b506109f0600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506125d9565b005b3480156109fe57600080fd5b50610ae2600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843782019150505050505091929192905050506126dd565b005b348015610af057600080fd5b50610b0f60048036038101908080359060200190929190505050612ae4565b005b348015610b1d57600080fd5b50610b78600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050612b50565b604051808060200180602001806020018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018060200185810385528b818151815260200191508051906020019080838360005b83811015610bfc578082015181840152602081019050610be1565b50505050905090810190601f168015610c295780820380516001836020036101000a031916815260200191505b5085810384528a818151815260200191508051906020019080838360005b83811015610c62578082015181840152602081019050610c47565b50505050905090810190601f168015610c8f5780820380516001836020036101000a031916815260200191505b50858103835289818151815260200191508051906020019080838360005b83811015610cc8578082015181840152602081019050610cad565b50505050905090810190601f168015610cf55780820380516001836020036101000a031916815260200191505b50858103825286818151815260200191508051906020019080838360005b83811015610d2e578082015181840152602081019050610d13565b50505050905090810190601f168015610d5b5780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390f35b348015610d7d57600080fd5b50610db2600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050613204565b6040518082815260200191505060405180910390f35b348015610dd457600080fd5b50610e2f600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506132e5565b005b348015610e3d57600080fd5b50610e98600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050613731565b6040518080602001806020018060200180602001806020018060200187810387528d818151815260200191508051906020019080838360005b83811015610eec578082015181840152602081019050610ed1565b50505050905090810190601f168015610f195780820380516001836020036101000a031916815260200191505b5087810386528c818151815260200191508051906020019080838360005b83811015610f52578082015181840152602081019050610f37565b50505050905090810190601f168015610f7f5780820380516001836020036101000a031916815260200191505b5087810385528b818151815260200191508051906020019080838360005b83811015610fb8578082015181840152602081019050610f9d565b50505050905090810190601f168015610fe55780820380516001836020036101000a031916815260200191505b5087810384528a818151815260200191508051906020019080838360005b8381101561101e578082015181840152602081019050611003565b50505050905090810190601f16801561104b5780820380516001836020036101000a031916815260200191505b50878103835289818151815260200191508051906020019080838360005b83811015611084578082015181840152602081019050611069565b50505050905090810190601f1680156110b15780820380516001836020036101000a031916815260200191505b50878103825288818151815260200191508051906020019080838360005b838110156110ea5780820151818401526020810190506110cf565b50505050905090810190601f1680156111175780820380516001836020036101000a031916815260200191505b509c5050505050505050505050505060405180910390f35b34801561113b57600080fd5b50611170600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050613f0c565b604051808215151515815260200191505060405180910390f35b34801561119657600080fd5b506111cb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050613fba565b604051808215151515815260200191505060405180910390f35b6000600c60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561124357600080fd5b6000806009015414151561125657600080fd5b600080600a0160006101000a81548160ff0219169083151502179055506001905090565b600e8054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156113105780601f106112e557610100808354040283529160200191611310565b820191906000526020600020905b8154815290600101906020018083116112f357829003601f168201915b505050505081565b6000600a0160009054906101000a900460ff16151561133657600080fd5b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561139557600080fd5b600060040160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160009055505050565b600c60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600d60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600a0160009054906101000a900460ff16151561147657600080fd5b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156114d557600080fd5b600060030160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160009055505050565b6000600a0160009054906101000a900460ff16151561156a57600080fd5b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156115c957600080fd5b80600060030160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600c60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156116ae57600080fd5b85600e90805190602001906116c4929190614068565b50600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415151561170157600080fd5b816000600a0160016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508460006006018190555083600060080181905550826000600701819055506000806009018190555060016000600a0160006101000a81548160ff021916908315150217905550600d60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000600b0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001905095945050505050565b6000600a0160009054906101000a900460ff16151561181c57600080fd5b33818173ffffffffffffffffffffffffffffffffffffffff1660008001826040518082805190602001908083835b60208310151561186f578051825260208201915060208101905060208303925061184a565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156118e857600080fd5b82600080600001826040518082805190602001908083835b6020831015156119255780518252602082019150602081019050602083039250611900565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010180546001816001161561010002031660029004905011151561197c57600080fd5b735c4f700b70e6ee23054ff6b319ff0f0466cab66263ef181d71600033876040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b83811015611a3d578082015181840152602081019050611a22565b50505050905090810190601f168015611a6a5780820380516001836020036101000a031916815260200191505b5094505050505060206040518083038186803b158015611a8957600080fd5b505af4158015611a9d573d6000803e3d6000fd5b505050506040513d6020811015611ab357600080fd5b81019080805190602001909291905050501515611acf57600080fd5b50505050565b6060828280600060010160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080549050111515611b2c57600080fd5b600060010160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002084815481101515611b7b57fe5b906000526020600020018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611c195780601f10611bee57610100808354040283529160200191611c19565b820191906000526020600020905b815481529060010190602001808311611bfc57829003601f168201915b50505050509250505092915050565b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611c8757600080fd5b60008060050160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054118015611d1a575080600060050160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410155b1515611d2557600080fd5b6000600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015611ded57600080fd5b505af1158015611e01573d6000803e3d6000fd5b505050506040513d6020811015611e1757600080fd5b8101908080519060200190929190505050505050565b606080606080606033868173ffffffffffffffffffffffffffffffffffffffff1660008001826040518082805190602001908083835b602083101515611e885780518252602082019150602081019050602083039250611e63565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515611f0157600080fd5b87600080600001826040518082805190602001908083835b602083101515611f3e5780518252602082019150602081019050602083039250611f19565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600101805460018160011615610100020316600290049050111515611f9557600080fd5b60008001896040518082805190602001908083835b602083101515611fcf5780518252602082019150602081019050602083039250611faa565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600601600080018a6040518082805190602001908083835b602083101515612042578051825260208201915060208101905060208303925061201d565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600701600080018b6040518082805190602001908083835b6020831015156120b55780518252602082019150602081019050602083039250612090565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600801600080018c6040518082805190602001908083835b6020831015156121285780518252602082019150602081019050602083039250612103565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600901600080018d6040518082805190602001908083835b60208310151561219b5780518252602082019150602081019050602083039250612176565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600a01848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156122695780601f1061223e57610100808354040283529160200191612269565b820191906000526020600020905b81548152906001019060200180831161224c57829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156123055780601f106122da57610100808354040283529160200191612305565b820191906000526020600020905b8154815290600101906020018083116122e857829003601f168201915b50505050509350828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156123a15780601f10612376576101008083540402835291602001916123a1565b820191906000526020600020905b81548152906001019060200180831161238457829003601f168201915b50505050509250818054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561243d5780601f106124125761010080835404028352916020019161243d565b820191906000526020600020905b81548152906001019060200180831161242057829003601f168201915b50505050509150808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156124d95780601f106124ae576101008083540402835291602001916124d9565b820191906000526020600020905b8154815290600101906020018083116124bc57829003601f168201915b505050505090509750975097509750975050505091939590929450565b60008060060154905090565b60008060090154905090565b600080600601549080600701549080600801549080600901549080600a0160009054906101000a900460ff169080600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905087565b60008060010160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805490509050919050565b6000600a0160009054906101000a900460ff1615156125f757600080fd5b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561265657600080fd5b80600060040160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600a0160009054906101000a900460ff1615156126fb57600080fd5b81600080600001826040518082805190602001908083835b6020831015156127385780518252602082019150602081019050602083039250612713565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010180546001816001161561010002031660029004905014151561278f57600080fd5b33600060060154806000600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e84306040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050602060405180830381600087803b15801561288b57600080fd5b505af115801561289f573d6000803e3d6000fd5b505050506040513d60208110156128b557600080fd5b8101908080519060200190929190505050101515156128d357600080fd5b735c4f700b70e6ee23054ff6b319ff0f0466cab662637e688a0f6000888888336040518663ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808681526020018060200180602001806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001848103845288818151815260200191508051906020019080838360005b8381101561299e578082015181840152602081019050612983565b50505050905090810190601f1680156129cb5780820380516001836020036101000a031916815260200191505b50848103835287818151815260200191508051906020019080838360005b83811015612a045780820151818401526020810190506129e9565b50505050905090810190601f168015612a315780820380516001836020036101000a031916815260200191505b50848103825286818151815260200191508051906020019060200280838360005b83811015612a6d578082015181840152602081019050612a52565b505050509050019850505050505050505060206040518083038186803b158015612a9657600080fd5b505af4158015612aaa573d6000803e3d6000fd5b505050506040513d6020811015612ac057600080fd5b81019080805190602001909291905050501515612adc57600080fd5b505050505050565b6000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515612b4357600080fd5b8060006006018190555050565b6060806060600080606033878173ffffffffffffffffffffffffffffffffffffffff1660008001826040518082805190602001908083835b602083101515612bad5780518252602082019150602081019050602083039250612b88565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515612c2657600080fd5b88600080600001826040518082805190602001908083835b602083101515612c635780518252602082019150602081019050602083039250612c3e565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600101805460018160011615610100020316600290049050111515612cba57600080fd5b600080018a6040518082805190602001908083835b602083101515612cf45780518252602082019150602081019050602083039250612ccf565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600001600080018b6040518082805190602001908083835b602083101515612d645780518252602082019150602081019050602083039250612d3f565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600101600080018c6040518082805190602001908083835b602083101515612dd45780518252602082019150602081019050602083039250612daf565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600501600080018d6040518082805190602001908083835b602083101515612e445780518252602082019150602081019050602083039250612e1f565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600080018e6040518082805190602001908083835b602083101515612ed55780518252602082019150602081019050602083039250612eb0565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060030154600080018f6040518082805190602001908083835b602083101515612f465780518252602082019150602081019050602083039250612f21565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600401858054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156130115780601f10612fe657610100808354040283529160200191613011565b820191906000526020600020905b815481529060010190602001808311612ff457829003601f168201915b50505050509550848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156130ad5780601f10613082576101008083540402835291602001916130ad565b820191906000526020600020905b81548152906001019060200180831161309057829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156131495780601f1061311e57610100808354040283529160200191613149565b820191906000526020600020905b81548152906001019060200180831161312c57829003601f168201915b50505050509350808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156131e55780601f106131ba576101008083540402835291602001916131e5565b820191906000526020600020905b8154815290600101906020018083116131c857829003601f168201915b5050505050905098509850985098509850985050505091939550919395565b60003373ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16148061329057506000600a0160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561329b57600080fd5b600060050160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000600a0160009054906101000a900460ff16151561330357600080fd5b338073ffffffffffffffffffffffffffffffffffffffff16600060030160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156133a357600080fd5b81600080600001826040518082805190602001908083835b6020831015156133e057805182526020820191506020810190506020830392506133bb565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010180546001816001161561010002031660029004905011151561343757600080fd5b60008001836040518082805190602001908083835b602083101515613471578051825260208201915060208101905060208303925061344c565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600060060154806000600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e84306040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050602060405180830381600087803b1580156135c357600080fd5b505af11580156135d7573d6000803e3d6000fd5b505050506040513d60208110156135ed57600080fd5b81019080805190602001909291905050501015151561360b57600080fd5b735c4f700b70e6ee23054ff6b319ff0f0466cab662636f962f7c6000876040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561369957808201518184015260208101905061367e565b50505050905090810190601f1680156136c65780820380516001836020036101000a031916815260200191505b50935050505060206040518083038186803b1580156136e457600080fd5b505af41580156136f8573d6000803e3d6000fd5b505050506040513d602081101561370e57600080fd5b8101908080519060200190929190505050151561372a57600080fd5b5050505050565b60608060608060608033878173ffffffffffffffffffffffffffffffffffffffff1660008001826040518082805190602001908083835b60208310151561378d5780518252602082019150602081019050602083039250613768565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561380657600080fd5b88600080600001826040518082805190602001908083835b602083101515613843578051825260208201915060208101905060208303925061381e565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010180546001816001161561010002031660029004905011151561389a57600080fd5b600080018a6040518082805190602001908083835b6020831015156138d457805182526020820191506020810190506020830392506138af565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600001600080018b6040518082805190602001908083835b6020831015156139475780518252602082019150602081019050602083039250613922565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600101600080018c6040518082805190602001908083835b6020831015156139ba5780518252602082019150602081019050602083039250613995565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600201600080018d6040518082805190602001908083835b602083101515613a2d5780518252602082019150602081019050602083039250613a08565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600301600080018e6040518082805190602001908083835b602083101515613aa05780518252602082019150602081019050602083039250613a7b565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600401600080018f6040518082805190602001908083835b602083101515613b135780518252602082019150602081019050602083039250613aee565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600601600501858054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613be15780601f10613bb657610100808354040283529160200191613be1565b820191906000526020600020905b815481529060010190602001808311613bc457829003601f168201915b50505050509550848054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613c7d5780601f10613c5257610100808354040283529160200191613c7d565b820191906000526020600020905b815481529060010190602001808311613c6057829003601f168201915b50505050509450838054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613d195780601f10613cee57610100808354040283529160200191613d19565b820191906000526020600020905b815481529060010190602001808311613cfc57829003601f168201915b50505050509350828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613db55780601f10613d8a57610100808354040283529160200191613db5565b820191906000526020600020905b815481529060010190602001808311613d9857829003601f168201915b50505050509250818054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613e515780601f10613e2657610100808354040283529160200191613e51565b820191906000526020600020905b815481529060010190602001808311613e3457829003601f168201915b50505050509150808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015613eed5780601f10613ec257610100808354040283529160200191613eed565b820191906000526020600020905b815481529060010190602001808311613ed057829003601f168201915b5050505050905098509850985098509850985050505091939550919395565b60008173ffffffffffffffffffffffffffffffffffffffff16600060030160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415613fb05760019050613fb5565b600090505b919050565b60008173ffffffffffffffffffffffffffffffffffffffff16600060040160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561405e5760019050614063565b600090505b919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106140a957805160ff19168380011785556140d7565b828001600101855582156140d7579182015b828111156140d65782518255916020019190600101906140bb565b5b5090506140e491906140e8565b5090565b61410a91905b808211156141065760008160009055506001016140ee565b5090565b905600a165627a7a7230582014f671bad8d3f8a347fb00c9c0827bd126f2a6a814dc4d5d074923c0d976b2910029";

      var contract_call_data = contract_factory.createRegistry.getData(registryName, registryStakeRegistration, registryStakeArbiter, registryStakeValidator, registryCode);
      web3.eth.estimateGas({data: contract_call_data, to: factory_address}, function(errEstimate, estimatedGas) {
          if(!errEstimate) {
              web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
                  if(!errNonce) {
                      contract_factory.createRegistry(registryName, registryStakeRegistration, registryStakeArbiter, registryStakeValidator, registryCode, {value: 0, gas: parseInt(estimatedGas*1.1), nonce: nonce},function(errCall, result) {
                          $('#registryFormSelectAction').val("default");
                          $('#registryFormSelectAction').trigger("change");
                          if(!errCall) {
                              if(result.startsWith("0x")) {
                                  waitForRegistry[result] = registryName;
                                  $('#regRegistryButton').prop("disabled",true);
                                  $('#unregRegistryButton').prop("disabled",true);
                                  $('#afterRegistryRegDiv').html('<div id="waitingForDevice"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i> Waiting for your transaction to be mined...<br><br></div>');
                              }
                          }
                          else {
                              console.log(errCall)
                          }
                      });
                  }
              });
          } else {
              console.log(errEstimate)
          }
      });
  } else {
      $("#wrapper").prepend('<div id="alertNotEnoughWEEV" class="alert alert-danger alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Oh no! An error occured!</strong><br> You don\' have enough WEEV tokens allowed to be withdrawn by the weeveFactory.<br> Please allow the factory to withdraw at least 1000 WEEV!</div>');
      $(document).ready(function(){
          $(window).scrollTop(0);
      });
      setTimeout(function(){$("#alertNotEnoughWEEV").alert('close');}, 10000);
  }
}

function unregisterRegistry() {
  if(interactionAddress == factory_address) {
      var registryID = Number(registries[$("#registryFormSelectAction option:selected").val()][0]);
      var registryName = registries[$("#registryFormSelectAction option:selected").val()][1];
      var contract_call_data = contract_factory.closeRegistry.getData(registryID);
      web3.eth.estimateGas({data: contract_call_data, to: interactionAddress}, function(errEstimate, estimatedGas) {
          if(!errEstimate) {
              web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
                  if(!errNonce) {
                      contract_factory.closeRegistry(registryID, {value: 0, gas: parseInt(estimatedGas*1.1), nonce: nonce},function(errCall, result) {
                          $('#registryFormSelectAction').val("default");
                          $('#registryFormSelectAction').trigger("change");
                          if(!errCall) {
                              if(result.startsWith("0x")) {
                                  waitForUnregistry[result] = registryName;
                                  $('#regRegistryButton').prop("disabled",true);
                                  $('#unregRegistryButton').prop("disabled",true);
                                  $('#afterRegistryRegDiv').html('<div id="waitingForDevice"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i> Waiting for your transaction to be mined...<br><br></div>');
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

function registerMarketplace() {
  if(allowanceToken[interactionAddress] >= 1000) {
      var marketplaceName = $("#marketplaceName").val();
      var marketplaceCommission = Number($("#marketplaceCommission").val());
      var marketplaceCode = "0x6080604052736edb9a1e68258f1d7aebefb4fbd53c74f68031b7600b60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507321d6690715db82a7b11c17c7dda8cf7afac47fd7600c60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503480156100ba57600080fd5b5060008060060160006101000a81548160ff021916908315150217905550611a66806100e76000396000f3006080604052600436106100fc576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806304804ee814610101578063163edd381461017e5780631d6069fc146101ad5780633487e08c1461023d57806335100a3c14610280578063366f13f4146102d757806340a141ff1461032e578063492cc769146103715780634d238c8e146103da5780634f3bddeb1461041d5780639fa637a8146104c8578063b538d3bc146105f6578063b7cac6ab14610639578063df922f3a14610664578063e1224f9a14610691578063f4bd4610146106de578063f973af5f14610788578063fbc6e3ae146107e3575b600080fd5b34801561010d57600080fd5b5061017c600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001909291908035906020019092919050505061083e565b005b34801561018a57600080fd5b50610193610990565b604051808215151515815260200191505060405180910390f35b3480156101b957600080fd5b506101c2610a25565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102025780820151818401526020810190506101e7565b50505050905090810190601f16801561022f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561024957600080fd5b5061027e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610ac3565b005b34801561028c57600080fd5b50610295610bb7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102e357600080fd5b506102ec610bdd565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561033a57600080fd5b5061036f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c03565b005b34801561037d57600080fd5b506103d8600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610cf7565b005b3480156103e657600080fd5b5061041b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e37565b005b34801561042957600080fd5b506104ae600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610f3b565b604051808215151515815260200191505060405180910390f35b3480156104d457600080fd5b5061052f600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611117565b60405180806020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200185815260200184815260200183151515158152602001828103825287818151815260200191508051906020019080838360005b838110156105b757808201518184015260208101905061059c565b50505050905090810190601f1680156105e45780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390f35b34801561060257600080fd5b50610637600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061142f565b005b34801561064557600080fd5b5061064e611533565b6040518082815260200191505060405180910390f35b34801561067057600080fd5b5061068f6004803603810190808035906020019092919050505061153f565b005b34801561069d57600080fd5b506106dc600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506115e5565b005b3480156106ea57600080fd5b506106f36117a9565b60405180878152602001861515151581526020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001965050505050505060405180910390f35b34801561079457600080fd5b506107c9600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611820565b604051808215151515815260200191505060405180910390f35b3480156107ef57600080fd5b50610824600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506118ce565b604051808215151515815260200191505060405180910390f35b600060060160009054906101000a900460ff16151561085c57600080fd5b73e016e7bf275a559e0d3ea827c36bf3b8e55942b76358d0a32b60008585856040518563ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018085815260200180602001848152602001838152602001828103825285818151815260200191508051906020019080838360005b838110156108f85780820151818401526020810190506108dd565b50505050905090810190601f1680156109255780820380516001836020036101000a031916815260200191505b509550505050505060206040518083038186803b15801561094557600080fd5b505af4158015610959573d6000803e3d6000fd5b505050506040513d602081101561096f57600080fd5b8101908080519060200190929190505050151561098b57600080fd5b505050565b6000600b60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156109ee57600080fd5b60008060050154141515610a0157600080fd5b60008060060160006101000a81548160ff0219169083151502179055506001905090565b600d8054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610abb5780601f10610a9057610100808354040283529160200191610abb565b820191906000526020600020905b815481529060010190602001808311610a9e57829003601f168201915b505050505081565b600060060160009054906101000a900460ff161515610ae157600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610b4057600080fd5b600060040160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160009055505050565b600b60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600c60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060060160009054906101000a900460ff161515610c2157600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c8057600080fd5b600060030160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160009055505050565b600060060160009054906101000a900460ff161515610d1557600080fd5b73e016e7bf275a559e0d3ea827c36bf3b8e55942b763e5b335fd6000836040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610da3578082015181840152602081019050610d88565b50505050905090810190601f168015610dd05780820380516001836020036101000a031916815260200191505b50935050505060206040518083038186803b158015610dee57600080fd5b505af4158015610e02573d6000803e3d6000fd5b505050506040513d6020811015610e1857600080fd5b81019080805190602001909291905050501515610e3457600080fd5b50565b600060060160009054906101000a900460ff161515610e5557600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610eb457600080fd5b80600060030160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600b60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f9957600080fd5b83600d9080519060200190610faf929190611995565b50600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614151515610fec57600080fd5b81600060090160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600080600501819055506001600060060160006101000a81548160ff021916908315150217905550600083101580156110695750606483105b151561107457600080fd5b82600060070181905550600080600801819055506001600060060160006101000a81548160ff021916908315150217905550600c60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000600a0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600190509392505050565b606060008060008060008001866040518082805190602001908083835b6020831015156111595780518252602082019150602081019050602083039250611134565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060000160008001876040518082805190602001908083835b6020831015156111c957805182526020820191506020810190506020830392506111a4565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660008001886040518082805190602001908083835b60208310151561125a5780518252602082019150602081019050602083039250611235565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206002015460008001896040518082805190602001908083835b6020831015156112cb57805182526020820191506020810190506020830392506112a6565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060030154600080018a6040518082805190602001908083835b60208310151561133c5780518252602082019150602081019050602083039250611317565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060040160009054906101000a900460ff16848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156114155780601f106113ea57610100808354040283529160200191611415565b820191906000526020600020905b8154815290600101906020018083116113f857829003601f168201915b505050505094509450945094509450945091939590929450565b600060060160009054906101000a900460ff16151561144d57600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156114ac57600080fd5b80600060040160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008060050154905090565b600060060160009054906101000a900460ff16151561155d57600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156115bc57600080fd5b600081101580156115cd5750606481105b15156115d857600080fd5b8060006007018190555050565b600060060160009054906101000a900460ff16151561160357600080fd5b600060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561166257600080fd5b600060080154811115151561167657600080fd5b6000600a0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15801561173e57600080fd5b505af1158015611752573d6000803e3d6000fd5b505050506040513d602081101561176857600080fd5b8101908080519060200190929190505050151561178457600080fd5b61179c8160006008015461197c90919063ffffffff16565b6000600801819055505050565b60008060050154908060060160009054906101000a900460ff16908060070154908060080154908060090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600a0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905086565b60008173ffffffffffffffffffffffffffffffffffffffff16600060030160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156118c457600190506118c9565b600090505b919050565b60008173ffffffffffffffffffffffffffffffffffffffff16600060040160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156119725760019050611977565b600090505b919050565b600082821115151561198a57fe5b818303905092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106119d657805160ff1916838001178555611a04565b82800160010185558215611a04579182015b82811115611a035782518255916020019190600101906119e8565b5b509050611a119190611a15565b5090565b611a3791905b80821115611a33576000816000905550600101611a1b565b5090565b905600a165627a7a72305820d8c8f1742da73feb978e4793d110e0fcc7e3de18cf3b62900e7adfa11204870c0029";
      var contract_call_data = contract_factory.createMarketplace.getData(marketplaceName, marketplaceCommission, marketplaceCode);
      web3.eth.estimateGas({data: contract_call_data, to: factory_address}, function(errEstimate, estimatedGas) {
          if(!errEstimate) {
              web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
                  if(!errNonce) {
                      contract_factory.createMarketplace(marketplaceName, marketplaceCommission, marketplaceCode, {value: 0, gas: parseInt(estimatedGas*1.1), nonce: nonce},function(errCall, result) {
                          $('#marketplaceFormSelectAction').val("default");
                          $('#marketplaceFormSelectAction').trigger("change");
                          if(!errCall) {
                              if(result.startsWith("0x")) {
                                  waitForRegistry[result] = marketplaceName;
                                  $('#regMarketplaceButton').prop("disabled",true);
                                  $('#unregMarketplaceButton').prop("disabled",true);
                                  $('#afterMarketplaceRegDiv').html('<div id="waitingForDevice"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i> Waiting for your transaction to be mined...<br><br></div>');
                              }
                          }
                          else {
                              console.log(errCall)
                          }
                      });
                  }
              });
          } else {
              console.log(errEstimate)
          }
      });
  } else {
      $("#wrapper").prepend('<div id="alertNotEnoughWEEV" class="alert alert-danger alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Oh no! An error occured!</strong><br> You don\' have enough WEEV tokens allowed to be withdrawn by the weeveFactory.<br> Please allow the factory to withdraw at least 1000 WEEV!</div>');
      $(document).ready(function(){
          $(window).scrollTop(0);
      });
      setTimeout(function(){$("#alertNotEnoughWEEV").alert('close');}, 10000);
  }
}

function unregisterMarketplace() {
  if(interactionAddress == factory_address) {
      var marketplaceID = Number(marketplaces[$("#marketplaceFormSelectAction option:selected").val()][0]);
      var marketplaceName = marketplaces[$("#marketplaceFormSelectAction option:selected").val()][1];
      var contract_call_data = contract_factory.closeMarketplace.getData(marketplaceID);
      web3.eth.estimateGas({data: contract_call_data, to: interactionAddress}, function(errEstimate, estimatedGas) {
          if(!errEstimate) {
              web3.eth.getTransactionCount(web3.eth.accounts[0], function(errNonce, nonce) {
                  if(!errNonce) {
                      contract_factory.closeMarketplace(marketplaceID, {value: 0, gas: parseInt(estimatedGas*1.1), nonce: nonce},function(errCall, result) {
                          $('#marketplaceFormSelectAction').val("default");
                          $('#marketplaceFormSelectAction').trigger("change");
                          if(!errCall) {
                              if(result.startsWith("0x")) {
                                  waitForUnregistry[result] = marketplaceName;
                                  $('#regMarketplaceButton').prop("disabled",true);
                                  $('#unregMarketplaceButton').prop("disabled",true);
                                  $('#afterMarketplaceRegDiv').html('<div id="waitingForDevice"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i> Waiting for your transaction to be mined...<br><br></div>');
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

function dec2hex(dec) {
  return ('0' + dec.toString(16)).substr(-2)
}

function generateId(len) {
  var arr = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}

function round(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0)
      return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
      return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}
