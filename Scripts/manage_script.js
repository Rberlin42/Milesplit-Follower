// load all followed runners from storage
chrome.storage.sync.get(null, displayRunners);

// add event handlers for the buttons
$(document).ready(function(){
    $("#unfollow").click(unfollow);
    $("#select-all").click(selectAll);
});

// Unfollow all runners that are checked
function unfollow(){
	if(!confirm("Are you sure you want to unfollow all selected runners?"))
		return;

	//loop through each line
	$("tr").each(function(){

		// if it is checked, remove it from the list and the storage
		if($(this).find("input").prop("checked")){
			var id = $(this).val();
			chrome.storage.sync.remove(id);
			$(this).remove();
		}
	});
	printStorageData();
	chrome.tabs.reload();
}

// check all boxes
function selectAll(){
    $("input").each(function(){
        $(this).prop("checked", true);
    });
}

// Take in the runner objects and display them in the list
function displayRunners(data){
	// if the storage request returns an error, then display it
    if(chrome.runtime.lastError){
        $("body").html(chrome.runtime.lastError);
        return;
    }

	var ids = Object.keys(data);

	// create a list of [last_name, first_name, id] pairs
	runners = [];
	ids.forEach((id) => {
		var fname = data[id]["first_name"];
		var lname = data[id]["last_name"];
		runners.push([lname, fname, id]);
	});


	// sort the list by last names
	// first name tie breaker, then id
	runners.sort((a,b) => {
		for(var i = 0; i < 3; i++){
			if(a[i] < b[i])
				return -1;
			if(a[i] > b[i])
				return 1;
		}

		// return 0 if they're the same but this should never be the case
		return 0;
	});

	// add to page
	runners.forEach((runner) => { 
		// create the row item
    	var lineItem = $("<tr value=" + runner[2] + "></tr>");
    	lineItem.append($("<td><input type=\'checkbox\'></td>"));
    	lineItem.append($("<td><a href=http://milesplit.com/athletes/" + runner[2] + "> " + runner[1] + " " + runner[0] + "</a></td>"));

		// add the click listener
        lineItem.find("a").click(link);
        // append to the list
   		$("#runnersList").append(lineItem);
	});
}


