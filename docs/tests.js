"use strict";


var timeout = 5;


var inputs = [
    "18 8 8 7 6 6 11 15 10 7 10 7 8 5 7 8 11 6",
    "15 15 12 8 10 7 10 16 6 8 5 7 6 11 13 12 9 16",
    "9 6 9 14 8 9 8 10 7 7 7 7 9 15 13 7 10 16 11 16 5 7 16 18 15"
];


QUnit.module("Utility", function() {
    QUnit.test("sum", function(assert) {
        assert.equal(sum([1, 2, 3, 4, 5, 6, 7, 8, 9]), 45, "numbers");
        assert.equal(sum([2, 4, 6, 8, 10, 12, 14, 16]), 72, "numbers");
        assert.equal(sum([10]), 10, "single number");
        assert.equal(sum([]), 0, "no numbers");
        assert.deepEqual(sum([undefined, null, false]), NaN, "undefined");
        assert.equal(sum([null, false]), 0, "null and false");
        assert.equal(sum([true, true]), 2, "true");
    });


    QUnit.test("sort", function(assert) {
        assert.deepEqual(sort([2,1,3,4,6,5],  1), [1,2,3,4,5,6], "ascending");
        assert.deepEqual(sort([1,2,1,2,1,2],  1), [1,1,1,2,2,2], "ascending");
        assert.deepEqual(sort([3,3,3,3,3,3],  1), [3,3,3,3,3,3], "ascending");
        assert.deepEqual(sort([2,1,3,4,6,5], -1), [6,5,4,3,2,1], "descending");
        assert.deepEqual(sort([1,2,1,2,1,2], -1), [2,2,2,1,1,1], "descending");
        assert.deepEqual(sort([3,3,3,3,3,3], -1), [3,3,3,3,3,3], "descending");
    });


    QUnit.test("parse_input", function(assert) {
        var answers = [
            [18, 8, 8, 7, 6, 6, 11, 15, 10, 7, 10, 7, 8, 5, 7, 8, 11, 6],
            [15, 15, 12, 8, 10, 7, 10, 16, 6, 8, 5, 7, 6, 11, 13, 12, 9, 16],
            [9, 6, 9, 14, 8, 9, 8, 10, 7, 7, 7, 7, 9, 15, 13, 7, 10, 16, 11, 16, 5, 7, 16, 18, 15]
        ];

        assert.deepEqual(parse_input(inputs[0], "entered"), answers[0], "normal input");
        assert.deepEqual(parse_input(inputs[1], "entered"), answers[1], "normal input");
        assert.deepEqual(parse_input(inputs[2], "entered"), answers[2], "normal input");

        assert.deepEqual(parse_input("    \t18 8 8   7 6 \n6 11   15\t 10\t7   10\n 7 \n 8 5 7\n8 11 6\n"),          answers[0], "extra whitespace, including tabs and newlines");
        assert.deepEqual(parse_input("15, 15, 12, 8,10 ,7 , 10  , 16 6 8 5; 7; 6; 11 ;13 ; 12  ; 9 16"),             answers[1], "commas and semicolons");
        assert.deepEqual(parse_input("9a6s9d14f8 9gh8jkl10z7xc7 7abcdef7 9 $$%15 13 7 10'''16\"11 16 5 7 16 18 15"), answers[2], "arbitrary non-digits");
        assert.deepEqual(parse_input("adfa18 8 8 7 6 6 11 15 10 7 10 7 8 5 7 8 11 6asfsa,"),                         answers[0], "arbitrary non-digits at start and end");

        assert.deepEqual(parse_input(inputs[0], "asc"), [5,6,6,6,7,7,7,7,8,8,8,8,10,10,11,11,15,18], "sort ascending");
        assert.deepEqual(parse_input(inputs[1], "asc"), [5,6,6,7,7,8,8,9,10,10,11,12,12,13,15,15,16,16], "sort ascending");
        assert.deepEqual(parse_input(inputs[0], "desc"), [18,15,11,11,10,10,8,8,8,8,7,7,7,7,6,6,6,5], "sort descending");
        assert.deepEqual(parse_input(inputs[1], "desc"), [16,16,15,15,13,12,12,11,10,10,9,8,8,7,7,6,6,5], "sort descending");
    });
});



QUnit.module("Multisets", function() {
    QUnit.test("multiset_create", function(assert) {
        var answers = [
            {5:1, 6:3, 7:4, 8:4, 10:2, 11:2, 15:1, 18:1},
            {5:1, 6:2, 7:2, 8:2, 9:1, 10:2, 11:1, 12:2, 13:1, 15:2, 16:2},
            {5:1, 6:1, 7:6, 8:2, 9:4, 10:2, 11:1, 13:1, 14:1, 15:2, 16:3, 18:1}
        ];

        for (var i = 0; i < inputs.length; i++) {
            assert.deepEqual(multiset_create(parse_input(inputs[i])), answers[i]);
        }
    });


    QUnit.test("multiset_elements", function(assert) {
        var answers = [
            [5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 10, 10, 11, 11, 15, 18],
            [5, 6, 6, 7, 7, 8, 8, 9, 10, 10, 11, 12, 12, 13, 15, 15, 16, 16],
            [5, 6, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 10, 10, 11, 13, 14, 15, 15, 16, 16, 16, 18]
        ];

        for (var i = 0; i < inputs.length; i++) {
            assert.deepEqual(multiset_elements(multiset_create(parse_input(inputs[i]))), answers[i]);
        }
    });


    QUnit.test("multiset_length", function(assert) {
        var answers = [18, 18, 25];

        for (var i = 0; i < inputs.length; i++) {
            assert.deepEqual(multiset_length(multiset_create(parse_input(inputs[i]))), answers[i]);
        }
    });


    QUnit.test("multiset_intersection", function(assert) {
        var sets = [];

        sets.push(multiset_create(parse_input(inputs[0])));
        sets.push(multiset_create(parse_input(inputs[1])));
        sets.push(multiset_create(parse_input(inputs[2])));

        assert.deepEqual(multiset_intersection(sets[0], sets[1]), {5:1, 6:2, 7:2, 8:2, 10:2, 11:1, 15:1});
        assert.deepEqual(multiset_intersection(sets[1], sets[2]), {5:1, 6:1, 7:2, 8:2, 9:1, 10:2, 11:1, 13:1, 15:2, 16:2});
        assert.deepEqual(multiset_intersection(sets[2], sets[0]), {5:1, 6:1, 7:4, 8:2, 10:2, 11:1, 15:1, 18:1});
    });


    QUnit.test("multiset_equals", function(assert) {
        assert.ok(multiset_equals(multiset_create(parse_input(inputs[0])), {5:1, 6:3, 7:4, 8:4, 10:2, 11:2, 15:1, 18:1}), "normal");
        assert.ok(multiset_equals(multiset_create([1, 1, 2, 2, 2, 3, 3]),  multiset_create([2, 1, 1, 3, 2, 3, 2])),       "reordered input list");
        assert.ok(multiset_equals({1:2, 3:4, 5:6, 7:8},                    {5:6, 1:2, 7:8, 3:4}),                         "reordered object literal");
    });


    QUnit.test("multiset_copy", function(assert) {
        for (var i = 0; i < inputs.length; i++) {
            var ms = multiset_create(parse_input(inputs[i]));
            var copy = multiset_copy(ms);
            assert.deepEqual(ms, copy, "same elements");
            assert.notEqual(ms, copy, "different identity");
        }
    });


    QUnit.test("multiset_subtract", function(assert) {
        assert.deepEqual(multiset_subtract({1:2, 3:4, 5:6},      {1:1, 3:2, 5:2}     ), {1:1, 3:2, 5:4},      "normal");
        assert.deepEqual(multiset_subtract({1:2, 3:4, 5:6},      {}                  ), {1:2, 3:4, 5:6},      "normal minus empty set");
        assert.deepEqual(multiset_subtract({},                   {}                  ), {},                   "empty minus empty");
        assert.deepEqual(multiset_subtract({1:2, 3:4, 5:6, 7:8}, {3:1, 7:4}          ), {1:2, 3:3, 5:6, 7:4}, "keys missing from second argument");
        assert.deepEqual(multiset_subtract({1:9, 5:8},           {1:2, 3:4, 5:6, 7:8}), {1:7, 5:2},           "keys missing from first argument");
        assert.deepEqual(multiset_subtract({1:2, 3:4},           {1:5, 3:1}          ), {3:3},                "greater value in second argument");
        assert.deepEqual(multiset_subtract({1:2, 3:4, 5:6},      {1:2}               ), {3:4, 5:6},           "duplicate key:value pair");
        assert.deepEqual(multiset_subtract({1:2, 3:4, 5:6},      {1:2, 3:4, 5:6}     ), {},                   "identical arguments");
    });
});



QUnit.module("Solution finding", function() {
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
            assert.deepEqual(forties_list[i].slice(0,5),                      starts[i], "beginning");
            assert.deepEqual(forties_list[i].slice(forties_list[i].length-5), ends[i],   "ending");
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


    QUnit.skip("solution_tree", function(assert) {
        assert.expect(0);
    });


    QUnit.test("find_solution", function(assert) {
        assert.deepEqual(find_solution(parse_input(inputs[0]), 5), [[18,8,8,6],[8,8,7,6,6,5],[7,11,15,7]]);
        assert.deepEqual(find_solution(parse_input(inputs[1]), 5), [[15,15,10],[12,8,7,6,7],[12,8,6,5,9],[16,11,13]]);
    });
});
