#!/usr/bin/env python

import itertools
import sys
import collections


def main():
    #quals = [int(i) for i in raw_input("Qualitites (space separated): ").split()]
    quals = [int(i) for i in sys.argv[1:]]

    # print some overview
    print "Total items:   %d" % len(quals)
    print "Total quality: %d" % sum(quals)

    print find_solution(quals)


def find_solution(quals):
    forties = []
    find_forties(0, [], quals, forties)

    quals_c = collections.Counter(quals)
    forties_c = [collections.Counter(x) for x in forties]

    forties_map = {}
    for f in forties:
        c = str(collections.Counter(f))
        if c not in forties_map:
            forties_map[c] = f

    solutions = []
    solution_tree(quals_c, [], forties_c, solutions, sum(quals)//40)

    solution = sorted(solutions, key=len)[-1]
    return [forties_map[str(x)] for x in solution]


def find_forties(total, used, remaining, forties):
    """find sets of 40 quality by searching a tree with the call stack"""
    if total == 40:
        forties.append(used)
        return
    elif total > 40:
        return
    else:
        for i in range(len(remaining)):
            new_used = list(used)
            new_used.append(remaining[i])
            find_forties(total + remaining[i], new_used, remaining[i+1:], forties)


def solution_tree(quals_remaining, used, forties_remaining, solutions, max_forties):
    if solutions and len(solutions[-1]) >= max_forties:
        return

    if forties_remaining and quals_remaining and sum(quals_remaining.elements()) >= 40:
        for i in range(len(forties_remaining)):
            if quals_remaining & forties_remaining[i] == forties_remaining[i]:
                new_used = list(used)
                new_used.append(forties_remaining[i])
                solution_tree(quals_remaining - forties_remaining[i], new_used, forties_remaining[i+1:], solutions, max_forties)
    else:
        solutions.append(used)


if __name__ == "__main__":
    main()
