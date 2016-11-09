"use strict";


var solution_info;
var input_info;


function ui_start_calc() {
    document.getElementById("output").value = "";
    document.getElementById("running").style.display = "inline";
    document.getElementById("calculate").disabled = true;
    document.getElementById("stop").disabled = false;
}


function ui_end_calc() {
    document.getElementById("stop").disabled = true;
    setTimeout(function() {
        document.getElementById("running").style.display = "none";
        document.getElementById("calculate").disabled = false;
    }, 1000);
}


function ui_update_info() {
    document.getElementById("output").value = input_info + solution_info;
}


var worker;
function start_worker() {
    worker = new Worker("quality.js");
    worker.onmessage = function(e) {
        if (e.data.type === "input_parsed") {
            input_info = e.data.input_info;
            ui_update_info();
        }
        else if (e.data.type === "partial_solution") {
            //TODO
        }
        else if (e.data.type === "calculation_complete") {
            solution_info = e.data.solution_info;
            ui_update_info();
            ui_end_calc();
        }
        else if (e.data.type === "log") {
            console.log(e.data.message);
        }
    };
}
start_worker();


function calculate() {
    input_info = "";
    solution_info = "Calculating...";

    ui_start_calc();
    ui_update_info();

    var input = document.getElementById("quals").value;
    var timeout = parseFloat(document.getElementById("timeout").value);

    worker.postMessage({type:"start_calculation", input:input, timeout:timeout});
}


function stop() {
    worker.terminate(); // lol
    start_worker();

    solution_info = "No solution found (stopped)";
    ui_update_info();
    ui_end_calc();
}


document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("output").value = "";

    // ctrl-enter to calculate
    document.getElementById("quals").addEventListener("keypress", function(event) {
        if (event.keyCode === 13 && event.ctrlKey) {
            calculate();
        }
    });

    document.getElementById("calculate").addEventListener("click", calculate);

    document.getElementById("stop").addEventListener("click", stop);
});
