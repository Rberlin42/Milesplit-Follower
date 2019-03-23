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
    $(".lineItem").each(function(){

        // if its checked, remove it and update the storage
        if($(this).find("input").prop("checked")){
            var ids = $(this).attr("value").split(".");
            
            // find the runner in storage and remove the result
            chrome.storage.sync.get(ids[0], (runner) => {
                delete runner[ids[0]]["new_results"][ids[1]];
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

    // loop through the runners and add line items for each new result
    for(id in runners){
        var runner = runners[id];
        var results = runner["new_results"];

        // loop through each new result for this runner
        for(resultID in results){
            result = results[resultID];

            // create the row item
            var lineItem = $("<tr class='lineItem' value=" + id + "." + resultID + "></tr>");
            lineItem.append($("<td><input type=\'checkbox\'></td>"));
            lineItem.append($("<td><a href=http://milesplit.com/athletes/" + id + "> " + runner["first_name"] + " " + runner["last_name"] + "</a></td>"));
            lineItem.append($("<td>" + result["event"] + "</td>"));
            lineItem.append($("<td>" + result["mark"] + "</td>"));
            if(result["pr"])
                lineItem.append($("<td>PR!</td>"));
            else
                lineItem.append($("<td></td>"));

            // add the click listener
            lineItem.find("a").click(link);
            // append to the list
            $("#results").append(lineItem);
        }
    }
}


//Tests
var me = 
{
    "first_name": "Ryan",
    "last_name": "Berlin",
    "new_results": {
        12345: {
            "event": "5k",
            "mark": "15:26",
            "pr": true
        },
        12332: {
            "event": "8k (xc)",
            "mark": "27:04",
            "pr": false
        }
    },
    "last_seen_result": 12345
}
var a = 
{
    "first_name": "hello",
    "last_name": "there",
    "new_results": {
        1111: {
            "event": "shot put",
            "mark": "25m",
            "pr": false
        },
    },
    "last_seen_result": 12345
}
var b = 
{
    "first_name": "Big",
    "last_name": "Chungus",
    "new_results": {},
    "last_seen_result": 0
}
//chrome.storage.sync.clear();
//chrome.storage.sync.set({1:me, 2:a, 3:b});
printStorageData();