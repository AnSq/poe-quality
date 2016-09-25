#!/usr/bin/env python

import itertools
import sys
import collections
import time
import argparse


def main():
    parser = argparse.ArgumentParser(description="Finds perfect sets of 40% quality for Path of Exile")
    parser.add_argument("-t", "--timeout", action="store",            default=5, type=float, help="maximum time in seconds to search for solutions", metavar="TIME")
    parser.add_argument("quals",           action="store", nargs="*",            type=int,   help="list of quality values",                          metavar="QUALITY")
    cmdargs = parser.parse_args()

    # print some overview
    print "Total items:   %d" % len(cmdargs.quals)
    print "Total quality: %d" % sum(cmdargs.quals)

    print find_solution(cmdargs.quals, cmdargs.timeout)


def find_solution(quals, timeout):
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
    try:
        solution_tree(quals_c, [], forties_c, solutions, sum(quals)//40, time.time() + timeout)
    except TimeoutException as e:
        print "Time exceeded. Use the --timeout command line option to specify more time."

    if solutions:
        solution = sorted(solutions, key=len)[-1]
        return [forties_map[str(x)] for x in solution]
    else:
        return None


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


def solution_tree(quals_remaining, used, forties_remaining, solutions, max_forties, end_time):
    if time.time() > end_time:
        raise TimeoutException()

    if forties_remaining and quals_remaining and sum(quals_remaining.elements()) >= 40:
        for i in range(len(forties_remaining)):
            if quals_remaining & forties_remaining[i] == forties_remaining[i]:
                new_used = list(used)
                new_used.append(forties_remaining[i])

                if solution_tree(quals_remaining - forties_remaining[i], new_used, forties_remaining[i+1:], solutions, max_forties, end_time):
                    return True
    else:
        solutions.append(used)

    if solutions and len(solutions[-1]) >= max_forties:
        return True

    return False


class TimeoutException (Exception):
    pass


if __name__ == "__main__":
    main()
