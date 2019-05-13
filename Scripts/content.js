// id of the athlete whose page we are on
var id;

$(document).ready(function(){
	id = getID();

	// insert button if we're logged in
	if($(".sign-up-box").length == 0){
		var button = $("h2.mt-2 a.btn").clone().attr({"id":"follow"}).removeAttr("href").text("");
		$("h2.mt-2 small.mr-2").after(button);
		setButtonFunction();
	}
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
	var nameInfo = $("meta[property='og:title']").attr("content").split(" ");
	var team = $("h1.mb-0.mr-2 a.text-sport").text();
	var tid = $("h1.mb-0.mr-2 a.text-sport").attr("href").split("=");
	var loc = $("span[ng-if='::vm.team.City']").parent().text().split("-");

	//create the object
	var runner = {};
	runner[id] = {
					"first_name":nameInfo[0], 
					"last_name": nameInfo[1], 
					"new_results": {}, 
					"last_seen_result": "",
					"team": team,
					"teamID": tid[tid.length-1],
					"location": loc[loc.length-1]
				};
	chrome.storage.sync.set(runner, errorHandle);
	setButtonFunction(false);	

	// get most recent result
	$.get("https://www.athletic.net/TrackAndField/Athlete.aspx", {"AID":id}, (data, status, xhr) => {
		if(status == "success"){
			tfPage = $("<html></html>").append(data.substring(data.indexOf("<head"), data.indexOf("</html>")));

			$.get("https://www.athletic.net/CrossCountry/Athlete.aspx", {"AID":id}, (data, status, xhr) => {
				if(status == "success"){
					var xcPage = $("<html></html>").append(data.substring(data.indexOf("<head"), data.indexOf("</html>")));

					var ids = [];
					tfPage.find("tr[id^=rID_]").each(function(){
						ids.push($(this).attr("id").substring(4));
					});
					runner[id]["last_seen_TFresult"] = ids.reduce((last_seen, id) => { return Math.max(last_seen, id);});
					ids = [];
					xcPage.find("tr[id^=rID_]").each(function(){
						ids.push($(this).attr("id").substring(4));
					});
					runner[id]["last_seen_XCresult"] = ids.reduce((last_seen, id) => { return Math.max(last_seen, id);});

					//store the new runner and update the button
					chrome.storage.sync.set(runner, errorHandle);
				}
				else{
					alert("error occurred");
					chrome.storage.sync.remove(id);
					setButtonFunction(true);
				}
				
			});
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

function errorHandle(){
	if(chrome.runtime.lastError){
		console.log(chrome.runtime.lastError.message);
		alert("Error following athlete: Storage Full");
	}
}