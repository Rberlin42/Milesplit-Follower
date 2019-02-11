// load all runners from storage when the popup is opened
chrome.storage.sync.get(null, displayRunners);

// add event handlers for the buttons
$(document).ready(function(){
    $("#clear").click(clear);
    $("#select-all").click(selectAll);
});

// clear all notifications that are checked
function clear(){

    // loop through each line
    $("li").each(function(){

        // if its checked, remove it and update the storage
        if($(this).find("input").prop("checked")){
            var id = $(this).val();
            
            // find the runner in storage and update the notification flags to false
            chrome.storage.sync.get(id+"", (runner) => {
                runner[id]["new_result"] = false;
                runner[id]["pr"] = false;
                chrome.storage.sync.set(runner);
            });

            // remove it from the list
            $(this).remove();
        }
    });
}

// check all boxes
function selectAll(){
    $("input").each(function(){
        $(this).prop("checked", true);
    });
}

// take in the runner objects and display them appropriately
function displayRunners(runners){

    // if the storage request returns an error, then display it
    if(chrome.runtime.lastError){
        $("body").html(chrome.runtime.lastError);
        return;
    }

    // look for runners who have new results
    var ids = Object.keys(runners);
    ids.forEach((id) => {
        var runner = runners[id];

        //check if the runner has a new result or not
        if(!runner["new_result"])
            return;

        // create the list item
        var listItem = $("<li value=" + id + "><input type=\'checkbox\'><a href=\'\'> " + runner["first_name"] + " " + runner["last_name"] + "</a></li>");
        // add the click listener
        listItem.find("a").click(link);
        // add the pr indicator if necessary
        if(runner["pr"])
            listItem.append(" - PR!");
        // append to the list
        $("#results").append(listItem);
    });
}

// redirect to the runner associated with the list item
function link(e){
    var newURL = "http://milesplit.com/athletes/" + e.target.parentElement.value + "/stats";
    chrome.tabs.update({url:newURL});
}


//Tests
var me = 
{
    "first_name": "Ryan",
    "last_name": "Berlin",
    "new_result": true,
    "pr": true
}
var a = 
{
    "first_name": "hello",
    "last_name": "there",
    "new_result": false,
    "pr": false
}
var b = 
{
    "first_name": "Big",
    "last_name": "Chungus",
    "new_result": true,
    "pr": false
}
//chrome.storage.sync.clear();
//chrome.storage.sync.set({1:me, 2:a, 3:b});
printStorageData();