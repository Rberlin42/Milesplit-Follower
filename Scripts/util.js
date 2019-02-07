/*
File holds utility functions that are used several times across different parts of the extension.
Provides an inteface for getting runner data with HTTP requests, and accessing the chome storage
*/

// Takes a runner ID and returns a runner object
// returns null if it is not found or if the request returns bad data
function scrapeRunnerData(id){

}


// function to help debug
// gets and logs all data
function printStorageData(){
	chrome.storage.sync.get(null, (data) => {
		console.log(data);
	});
}