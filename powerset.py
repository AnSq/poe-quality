#!/usr/bin/env python

import itertools
import sys


def main():
    #quals = [int(i) for i in raw_input("Qualitites (space separated): ").split()]
    quals = [int(i) for i in sys.argv[1:]]

    # print some overview
    print "Total items:        %d" % len(quals)
    print "Total quality:      %d" % sum(quals)

    num_solutions = {} # currency to solution count map
    solutions = {} # currency to best solution (a list) map
    combinations = 0

    # find solutions
    for i in powerset(quals):
        combinations += 1
        s = sum(i)
        if s % 40 == 0:
            c = s / 40
            if c in solutions:
                num_solutions[c] += 1
                if len(i) > len(solutions[c]): # "best" is defined as the solution having the most items in it, in order to clear more inventory space
                    solutions[c] = i
            else:
                num_solutions[c] = 1
                solutions[c] = i

    # the empty set is a member of the power set, and is counted as a solution. Remove it.
    del num_solutions[0]
    del solutions[0]

    # print more overview
    print "Total solutions:    %d" % sum(num_solutions.values())
    print "Total combinations: %d" % combinations
    print

    # print details table
    if len(solutions) == 0:
        print "No solutions"
    else:
        # column headers
        hq = "Quality"
        hc = "Currency"
        hs = "Solutions"
        hi = "Items"
        hb = "Best Solution"

        # calculate column widths (max of header length and max value length)
        lq = max(len(hq), max([len(str(sum(i))) for i in solutions.values()]))
        lc = max(len(hc), max([len(str(sum(i)/40)) for i in solutions.values()]))
        ls = max(len(hs), max([len(str(i)) for i in num_solutions.values()]))
        li = max(len(hi), max([len(str(len(i))) for i in solutions.values()]))
        lb = max(len(hb), max([len(str(i)) for i in solutions.values()]))

        # print table header
        print "%s | %s | %s || %s | %s" % (hq.ljust(lq), hc.rjust(lc), hs.rjust(ls), hi.rjust(li), hb)
        print "%s-|-%s-|-%s-||-%s-|-%s" % ("-"*lq, "-"*lc, "-"*ls, "-"*li, "-"*lb)

        # fill in table
        for i in solutions:
            s = solutions[i]
            n = num_solutions[i]
            print "%s | %s | %s || %s | %s" % (str(sum(s)).rjust(lq), str(sum(s)/40).rjust(lc), str(n).rjust(ls), str(len(s)).rjust(li), str(s))





# https://docs.python.org/2.7/library/itertools.html#recipes
def powerset(iterable):
    "powerset([1,2,3]) --> () (1,) (2,) (3,) (1,2) (1,3) (2,3) (1,2,3)"
    s = list(iterable)
    return itertools.chain.from_iterable(itertools.combinations(s, r) for r in range(len(s)+1))


if __name__ == "__main__":
    main()
