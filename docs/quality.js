"use strict";


var timed_out;


function sum(arr) {
    return arr.reduce(function(a,b){return a+b}, 0);
}


function multiset_create(arr) {
    var result = {}
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] in result) {
            result[arr[i]] += 1;
        }
        else {
            result[arr[i]] = 1;
        }
    }
    return result;
}


function multiset_elements(ms) {
    var result = [];
    for (var item in ms) {
        for (var i = 0; i < ms[item]; i++) {
            result.push(parseInt(item, 10));
        }
    }
    return result;
}


function multiset_length(ms) {
    var result = 0;
    for (var item in ms) {
        result += ms[item];
    }
    return result;
}


function multiset_intersection(a, b) {
    var result = {};
    for (var i in a) {
        if (i in b) {
            result[i] = Math.min(a[i], b[i]);
        }
    }
    return result;
}


function multiset_equals(a, b) {
    // there are faster and better ways to do this
    return JSON.stringify(a) === JSON.stringify(b);
}


function multiset_copy(a) {
    var result = {}
    for (var i in a) {
        result[i] = a[i];
    }
    return result;
}


function multiset_subtract(a, b) {
    var result = multiset_copy(a);
    for (var i in b) {
        if (i in a) {
            result[i] = a[i] - b[i];
        }
        else {
            result[i] = -b[i];
        }
    }
    return result;
}


function find_solution(quals, timeout) {
    timed_out = 0;
    var end_time = Date.now() + (timeout * 1000);

    var forties = [];
    try {
        find_forties(0, [], quals, forties, end_time);
    }
    catch (e) {
        if (e.message === "Timeout") {
            timed_out = 1;
            return null;
        }
        else {throw e;}
    }

    var quals_ms = multiset_create(quals);

    var forties_ms = []
    for (var i in forties) {
        forties_ms.push(multiset_create(forties[i]));
    }

    var forties_map = {}
    for (var f in forties) {
        var s = JSON.stringify(multiset_create(forties[f]))
        if (!(s in forties_map)) {
            forties_map[s] = forties[f];
        }
    }

    var solutions = [];
    try {
        solution_tree(quals_ms, [], forties_ms, solutions, Math.floor(sum(quals) / 40), end_time);
    }
    catch (e) {
        if (e.message === "Timeout") {timed_out = 2;}
        else {throw e;}
    }

    if (solutions.length) {
        var solution = solutions.sort(function(a,b) {return b.length - a.length})[0];

        var result = [];
        for (var x in solution) {
            result.push(forties_map[JSON.stringify(solution[x])]);
        }
        return result;
    }
    else {
        return null;
    }
}


function find_forties(total, used, remaining, forties, end_time) {
    if (Date.now() > end_time) {
        throw new Error("Timeout");
    }

    if (total === 40) {
        forties.push(used);
        return;
    }
    else if (total > 40) {
        return;
    }
    else {
        for (var i = 0; i < remaining.length; i++) {
            var new_used = used.slice();
            new_used.push(remaining[i]);
            find_forties(total + remaining[i], new_used, remaining.slice(i+1), forties, end_time);
        }
    }
}


function solution_tree(quals_remaining, used, forties_remaining, solutions, max_forties, end_time) {
    if (Date.now() > end_time) {
        if (used.length) {
            solutions.push(used); //keep partial solution
        }
        throw new Error("Timeout");
    }

    if (forties_remaining.length && multiset_length(quals_remaining) && sum(multiset_elements(quals_remaining)) >= 40) {
        for (var i = 0; i < forties_remaining.length; i++) {
            if (multiset_equals(multiset_intersection(quals_remaining, forties_remaining[i]), forties_remaining[i])) {
                var new_used = used.slice();
                new_used.push(forties_remaining[i]);

                if (solution_tree(multiset_subtract(quals_remaining, forties_remaining[i]), new_used, forties_remaining.slice(i+1), solutions, max_forties, end_time)) {
                    return true;
                }
            }
        }
    }
    else {
        solutions.push(used);
    }

    if (solutions.length && (solutions[solutions.length-1].length >= max_forties)) {
        return true;
    }

    return false;
}


function format_output(quals, solution) {
    var result = "";
    result += "Input:\n";
    result += "    Number of Items: " + quals.length + "\n";
    var total = sum(quals);
    result += "    Total Quality:   " + total + "\n";
    result += "    Quality / 40:    " + (total / 40) + "\n";
    result += "\n";

    if (solution && solution.length) {
        result += "Solution:\n";
        var num_items = solution.reduce(function(p,c){return p+c.length}, 0);
        result += "    Number of Items: " + num_items + "\n";
        result += "    Total Quality:   " + (solution.length * 40) + "\n";
        result += "    Currency:        " + solution.length + "\n";
        result += "\n";
        result += "Sets of 40:\n";

        for (var i in solution) {
            result += "    [";
            for (var j in solution[i]) {
                if (solution[i][j].toString().length < 2) {
                    result += " ";
                }
                result += solution[i][j];
                if (j < solution[i].length - 1) {
                    result += ",  ";
                }
            }
            result += "]";
            if (i < solution.length - 1) {
                result += "\n";
            }
        }
    }
    else {
        result += "No solution found";
    }

    if (timed_out) {
        result += "\n\nCalculation exceeded time limit in stage " + timed_out + "\n";
        if (timed_out === 1) {
            result += "Try using fewer items or adding more time"
        }
        else if (timed_out === 2) {
            result += "Adding more time may give a better solution";
        }
    }

    return result;
}


function parse_input(value) {
    return value.trim().replace(/\D+/g, " ").split(" ").map(function(v,i,a){return parseInt(v)});
}


function calculate() {
    document.getElementById("output").value = "";
    var quals = parse_input(document.getElementById("quals").value);
    var timeout = parseFloat(document.getElementById("timeout").value);
    var solution = find_solution(quals, timeout);
    document.getElementById("output").value = format_output(quals, solution);
}


if (typeof attach !== "undefined" && attach) {
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
}
