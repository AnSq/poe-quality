"use strict";


var timeout = 5;


var inputs = [
    "18 8 8 7 6 6 11 15 10 7 10 7 8 5 7 8 11 6",
    "15 15 12 8 10 7 10 16 6 8 5 7 6 11 13 12 9 16",
    "9 6 9 14 8 9 8 10 7 7 7 7 9 15 13 7 10 16 11 16 5 7 16 18 15"
];

var strange_inputs = [
    "    \t18 8 8   7 6 \n6 11   15\t 10\t7   10\n 7 \n 8 5 7\n8 11 6\n",
    "15, 15, 12, 8,10 ,7 , 10  , 16 6 8 5; 7; 6; 11 ;13 ; 12  ; 9 16",
    "9a6s9d14f8 9gh8jkl10z7xc7 7abcdef7 9 15 13 7 10 16 11 16 5 7 16 18 15"
];


QUnit.test("sum", function(assert) {
    assert.equal(sum([1, 2, 3, 4, 5, 6, 7, 8, 9]), 45, "numbers");
    assert.equal(sum([2, 4, 6, 8, 10, 12, 14, 16]), 72, "numbers");
    assert.equal(sum([10]), 10, "single number");
    assert.equal(sum([]), 0, "no numbers");
    assert.deepEqual(sum([undefined, null, false]), NaN, "undefined");
    assert.equal(sum([null, false]), 0, "null and false");
    assert.equal(sum([true, true]), 2, "true");
});


QUnit.test("parse_input", function(assert) {
    var answers = [
        [18, 8, 8, 7, 6, 6, 11, 15, 10, 7, 10, 7, 8, 5, 7, 8, 11, 6],
        [15, 15, 12, 8, 10, 7, 10, 16, 6, 8, 5, 7, 6, 11, 13, 12, 9, 16],
        [9, 6, 9, 14, 8, 9, 8, 10, 7, 7, 7, 7, 9, 15, 13, 7, 10, 16, 11, 16, 5, 7, 16, 18, 15]
    ];

    assert.deepEqual(parse_input(inputs[0]), answers[0], "normal input");
    assert.deepEqual(parse_input(inputs[1]), answers[1], "normal input");
    assert.deepEqual(parse_input(inputs[2]), answers[2], "normal input");

    assert.deepEqual(parse_input(strange_inputs[0]), answers[0], "extra whitespace, including tabs and newlines");
    assert.deepEqual(parse_input(strange_inputs[1]), answers[1], "commas and semicolons");
    assert.deepEqual(parse_input(strange_inputs[2]), answers[2], "arbitrary non-digits");
});


QUnit.test("find_forties", function(assert) {
    var lengths = [792, 331, 1795];

    var starts = [
        [[18,8,8,6],[18,8,8,6],[18,8,8,6],[18,8,7,7],[18,8,7,7]],
        [[15,15,10],[15,15,10],[15,12,8,5],[15,12,7,6],[15,12,7,6]],
        [[9,6,9,8,8],[9,6,9,9,7],[9,6,9,9,7],[9,6,9,9,7],[9,6,9,9,7]]
    ]

    var ends = [
        [[10,7,5,7,11],[10,8,5,11,6],[10,5,8,11,6],[7,8,8,11,6],[8,7,8,11,6]],
        [[5,6,13,16],[7,6,11,16],[7,11,13,9],[6,13,12,9],[11,13,16]],
        [[7,10,7,16],[7,11,7,15],[7,18,15],[10,5,7,18],[7,18,15]]
    ]

    var forties_list = [];
    for (var i = 0; i < inputs.length; i++) {
        var quals = parse_input(inputs[i]);
        var forties = [];
        var end_time = Date.now() + (timeout * 1000);
        find_forties(0, [], quals, forties, end_time);
        forties_list.push(forties);
    }

    for (var i = 0; i < forties_list.length; i++) {
        assert.equal(forties_list[i].length, lengths[i], "length");
    }


    for (var i = 0; i < forties_list.length; i++) {
        assert.deepEqual(forties_list[i].slice(0,5), starts[i], "beginning");
        assert.deepEqual(forties_list[i].slice(forties_list[i].length-5), ends[i], "ending");
    }

    for (var i = 0; i < forties_list.length; i++) {
        var okay = true;
        for (var j = 0; j < forties_list[i].length; j++) {
            var s = sum(forties_list[i][j]);
            if (s !== 40) { //this is weird, but only assert when we know it's false, otherwise we'll get thousands of asserts
                assert.equal(s, 40, "sums to 40");
                okay = false;
            }
        }
        assert.ok(okay, "all forties sum to 40"); //assert at the end so we can tell it's doing something
    }
});
