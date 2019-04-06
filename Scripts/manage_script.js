// load all followed runners from storage
chrome.storage.sync.get(null, displayRunners);

var followCount;

// add event handlers for the buttons
$(document).ready(function(){
    $("#unfollow").click(unfollow);
    $("#select-all").click(selectAll);

    // milesplit link stuff
    $("#milesplit-link img").attr("src", chrome.runtime.getURL("Images/logo.jpg"));
    $("#milesplit-link").click(function(){
        var newURL = $(this).attr("href");
        chrome.tabs.update({url:newURL});
    });
});

// Unfollow all runners that are checked
function unfollow(){
	if(!confirm("Are you sure you want to unfollow all selected athletes?"))
		return;

	// create an array of keys
	keys = [];
	//loop through each line
	$(".lineItem").each(function(){

		// if it is checked, remove it from the list and the storage
		if($(this).find("input").prop("checked")){
			var id = $(this).attr("value");
			$(this).remove();
			keys.push(id);
			//update the count
			followCount--;
		}
	});

	//remove from storage
	chrome.storage.sync.remove(keys);
	//update the page
	$("#follow-count").text("("+followCount+")");
	chrome.tabs.reload();
}

// check or uncheck all boxes
function selectAll(){
    $("input").each(function(){
        $(this).prop("checked", true);
    });
    $("#select-all").off("click").text("Uncheck all").click(uncheckAll);
}
function uncheckAll(){
    $("input").each(function(){
        $(this).prop("checked", false);
    });
    $("#select-all").off("click").text("Select all").click(selectAll);
}

// Take in the runner objects and display them in the list
function displayRunners(data){
	// if the storage request returns an error, then display it
    if(chrome.runtime.lastError){
        $("body").html(chrome.runtime.lastError);
        return;
    }

    // display the number of athletes followed
	var ids = Object.keys(data);
	followCount = ids.length;
	$("#follow-count").text("("+followCount+")");

	// create a list of [last_name, first_name, id, team, teamID, location] lists
	runners = [];
	ids.forEach((id) => {
		var fname = data[id]["first_name"];
		var lname = data[id]["last_name"];
		var team = data[id]["team"];
		var tid = data[id]["teamID"];
		var loc = data[id]["location"];
		runners.push([lname, fname, id, team, tid, loc]);
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
    	var lineItem = $("<tr class='lineItem' value=" + runner[2] + "></tr>");
    	lineItem.append($("<td class='check'><input type=\'checkbox\'></td>"));
    	lineItem.append($("<td class='name'><a href=http://milesplit.com/athletes/" + runner[2] + ">" + runner[1] + " " + runner[0] + "</a></td>"));
    	lineItem.append($("<td class='team'><a href=http://milesplit.com/teams/" + runner[4] + ">" + runner[3] + "</a></td>"));
    	lineItem.append($("<td class='location'>" + runner[5] + "</td>"));

		// add the click listener
        lineItem.find("a").click(link);
        // append to the list
   		$("#runnersList").append(lineItem);
	});
}

// redirect to the runner associated with the list item
function link(e){
	var newURL = e.target.href;
	chrome.tabs.update({url:newURL});
}
