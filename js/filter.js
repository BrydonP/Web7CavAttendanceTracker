$(document).ready(function(){
    //Button on Index page that grabs pasted data
    $("#import").click(function(){
        clearContent();
        var lines = $("#inputField").val().split(/\n/); //Input Text Box
        var filterType = $("input[name='time']:checked").val();
        var creditMinutes = $("#creditTime").val();
        var texts = [];// Temp 
        for (var i=0; i < lines.length; i++) {
            // only push this line if it contains a non whitespace character
            if (/\S/.test(lines[i])) {
                texts.push($.trim(lines[i]));
            }
        }
        filter(texts, filterType, creditMinutes);
    })//Click END
});


function filter(data, filterType, creditMinutes) {
    var sortedData = [];

    //Select all Line plus next two lines with "7Cav"
    let re7Cav = /7cav/;
    let reTactical = /server|tactical/;
    let min, hour, time, minutesTotal, name;
 
    for(i=0; i < data.length; i++){
        if (re7Cav.test(data[i].toLowerCase()) && !reTactical.test(data[i].toLowerCase())) {
            name = data[i].trim(); //Get and Trim Name
            time = data[i+2].substr(data[i+2].length - 5).trim();//Store just the time in hh:mm format
            dupIndex = sortedData.indexOf(name); //Check for index of duplicate entry

            //Convert Time & Store
            hour = time.substr(0,2);
            min = time.substr(3,4);
            minutesTotal = parseInt(hour)*60 + parseInt(min);

            if(dupIndex > -1){                   // Is Duplicate
                sortedData[dupIndex+1] += minutesTotal; // Add Time
            }else{                               // Is not Duplicate
                sortedData.push(name)            // Store Name
                sortedData.push(minutesTotal)    // Store Total Time in minutes 
            }
        }        
    }

    //Radio Button Decision
    if (filterType == "time") {
        creditResults(sortedData, creditMinutes, filterType);
    }else if(filterType == "absolute") {
        stats(sortedData,null,filterType);
        printTable(sortedData,"sortedData", "Full Attendance", "attendance");
    }else{
        console.log("Error in Button Decision");
    }
}

function creditResults(sortedData, creditMinutes, filterType){
    var creditList = [];
    var noCreditList = [];
    for(i=0;i<sortedData.length;i+=2){
        if(sortedData[i+1] < creditMinutes){
            noCreditList.push(sortedData[i]);
            noCreditList.push(sortedData[i+1]);
        }else{
            creditList.push(sortedData[i])
            creditList.push(sortedData[i+1])
        }
    }
    stats(creditList, noCreditList, filterType);    
    printTable(creditList, "creditListTable", "Credit", "creditList");
    printTable(noCreditList, "noCreditListTable", "No Credit", "noCreditList");
}

function printTable(data, tableID, tableTitle, divName){
    $("#" + divName).html(`<table id=${tableID}>`);
    $("#" + tableID).append(`<tr><th>${tableTitle}</th></tr>`);
    $("#" + tableID).append(`<th>Name</th>`);
    $("#" + tableID).append(`<th>Minutes</th>`);
    for(i=0;i<data.length;i+=2){
        $(`#${tableID}`).append("<tr><td>" + data[i] + "</td><td>" + data[i+1] + "</td></tr>");
    }
    $("#" + divName).append("</table>");
}

function clearContent(){
    $("#creditList").html("");
    $("#noCreditList").html("");
    $("#attendance").html("");
    $("#stats").html("");
}

function stats(creditList, noCreditList, filterType){
    var creditListLength = creditList.length/2;
    var noCreditListLength = 0;;
    if (noCreditList != null) {
        noCreditListLength = noCreditList.length/2;        
    }
    $("#stats").html("<table id=statsTable>");
    $("#statsTable").append("<th>Stats</th>");
    if (filterType=="time") {
        $("#statsTable").append(`<tr><td>Credit: </td><td>${creditListLength}</td></tr>`);
        $("#statsTable").append(`<tr><td>No Credit: </td><td>${noCreditListLength}</td></tr>`);        
    }
    $("#statsTable").append(`<tr><td>Total: </td><td>${creditListLength + noCreditListLength}</td></tr>`);
    $("#stats").append("</table>");
}
