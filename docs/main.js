"use strict";


var worker = new Worker("quality.js");
worker.onmessage = function(e) {
    if (e.data.type === "calculation_complete") {
        document.getElementById("output").value = e.data.output;
    }
};


function calculate() {
    document.getElementById("output").value = "Calculating...";
    var input = document.getElementById("quals").value;
    var timeout = parseFloat(document.getElementById("timeout").value);
    worker.postMessage({type:"calculate", input:input, timeout:timeout});
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
});
