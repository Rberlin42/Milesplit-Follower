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

// redirect to the runner associated with the list item
function link(e){
	var newURL = e.target.href;
	chrome.tabs.update({url:newURL});
}

/*
Runner Storage Structure:

{
	"first_name": "Ryan",
	"last_name": "Berlin",
	"new_results": 	{
						result_id: {"event": "5k", "mark": "15:26", "pr": true},
						result_id: {"event": "8k (xc)", "mark": "27:04", "pr": false}
					},
	"last_seen_result": result_id
}
	
*/