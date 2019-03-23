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
	var info = $("meta[name=keywords]").attr("content").split(",");
	var runner = {};
	runner[id] = {"first_name":info[0], "last_name": info[1], "new_results": {}};
	chrome.storage.sync.set(runner);
	setButtonFunction(false);
}

// unfollow the athlete
function unfollowAthlete(){
	chrome.storage.sync.remove(id);
	setButtonFunction(true);
}