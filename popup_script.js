chrome.storage.local.get(null, displayRunners);

document.getElementById("clear").addEventListener("click", clear);
document.getElementById("select-all").addEventListener("click", selectAll);

function clear(){

    var checkboxes = document.getElementsByTagName("input");
    for (var i = 0; i < checkboxes.length; i++){
        if(checkboxes[i].checked){
            var id = checkboxes[i].parentElement.value + "";
            chrome.storage.local.get(id, function response(data){
                data[id]["pr?"] = false;
                chrome.storage.local.set(data);
                var lineitem = checkboxes[i].parentElement;
                var list = document.getElementById("runnersList");
                list.removeChild(lineitem);
                i--;
            });
        }
    }
    chrome.tabs.reload();
}

function selectAll(){
    var checkboxes = document.getElementsByTagName("input");
    for(var i = 0; i < checkboxes.length; i++)
        checkboxes[i].checked = true;
}

function displayRunners(data){
    var ids = Object.keys(data);
    for(var i = 0; i < ids.length; i++){
        if(isNaN(Number(ids[i])))
            continue;
        if(!data[ids[i]]["pr?"])
            continue;

        var name = data[ids[i]]["name"];
        var list = document.getElementById("runnersList");
        var runner = document.createElement("li");
        runner.setAttribute("value", ids[i]);
        runner.innerHTML = "<input type=\'checkbox\'><a href=\'\'> " + name + "</a>";
        list.appendChild(runner);
        runner.getElementsByTagName("a")[0].addEventListener("click", link);
    }
}

function link(e){
    //var newURL = "http://pa.milesplit.com/athletes/pro/2911907/stats";
    var newURL = "http://milesplit.com/athletes/" + e.target.parentElement.value + "/stats";
    chrome.tabs.update({url:newURL});
}
