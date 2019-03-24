// id of the athlete whose page we are on
var id;

$(document).ready(function(){
	id = getID();

	// insert button
	var button = $("#claimAthlete").clone().attr("id", "follow").text("");
	$("#claimAthlete").after(button);
	setButtonFunction();
});

// set the text and function of the follow button
// if text is undefined, then look in the storage to see what it should be
function setButtonFunction(follow=undefined){
	$("#follow").off("click");

	if(follow === undefined){
		//check the storage
		chrome.storage.sync.getBytesInUse(id, (size) => {
			if(size > 0)
				$("#follow").text("Unfollow").click(unfollowAthlete);
			else
				$("#follow").text("Follow").click(followAthlete);
		});
	}
	else{
		if(follow)
			$("#follow").text("Follow").click(followAthlete);
		else
			$("#follow").text("Unfollow").click(unfollowAthlete);
	}
}

//get the id of the runner on the current page
function getID(){
	var url = window.location.href;
	var id = parseInt(url);
	while(isNaN(id)){
		url = url.substring(1);
		id = parseInt(url);
	}
	return String(id);
}

// follow the athlete
function followAthlete(){
	// get some info from the page
	var nameInfo = $("#athleteName").text().split(" ");
	var team = $("span.current-school a").text();
	var tid = $("span.current-school a").attr("href").split("/");
	var loc = $("span.city-state").text();

	//create the object
	var runner = {};
	runner[id] = {
					"first_name":nameInfo[0], 
					"last_name": nameInfo[1], 
					"new_results": {}, 
					"last_seen_result": "",
					"team": team,
					"teamID": tid[tid.length-1],
					"location": loc
				};
	chrome.storage.sync.set(runner);
	setButtonFunction(false);	

	// get most recent result
	$.get("https://www.milesplit.com/athletes/"+id, {"sort":"byDate"}, (data, status, xhr) => {
		if(status == "success"){
			var page = $("<html></html>").append(data.substring(data.indexOf("<!doctype html>")+16, data.indexOf("</html>")-1));

			runner[id]["last_seen_result"] = page.find("div.record:first").attr("data-performance-id");

			//store the new runner and update the button
			chrome.storage.sync.set(runner);
		}
		else{
			alert("error occurred");
			chrome.storage.sync.remove(id);
			setButtonFunction(true);
		}
	});
}

// unfollow the athlete
function unfollowAthlete(){
	chrome.storage.sync.remove(id);
	setButtonFunction(true);
}