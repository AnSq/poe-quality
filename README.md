# PoE Powerset

Calculates perfect sets of 40% quality items for [Path of Exile](https://www.pathofexile.com/).

Items in Path of Exile that have increased [quality](http://pathofexile.gamepedia.com/Quality) can be sold to NPC vendors in groups in exchange for a [currency item](http://pathofexile.gamepedia.com/Quality) that can be used to increase the qualty of another item. Items of the same type (armor, weapons, flasks, gems, or maps) can be sold in sets totalling 40% or more total quality to get the corresponding currency item (armourer's scrap, blacksmith's whetstone, glassblower's bauble, gemcutter's prism, or cartographer's chisel, respectively). Multiples of 40 also work, so 80% total quality will give two currency, 120% will give three, and so on. It doesn't have to be exact though, so 42% will work, but that's just a waste.

This is a small command line Python program that finds perfect multiples of 40% quality from a list of items you give it. It's based on the mathematical concept of a [power set](https://en.wikipedia.org/wiki/Power_set): the set of all subsets of a set. Basically, it goes through all possible combinations of the items and finds which ones add up to multiples of 40. It then reports the "best" solution for each multiple it found. "Best" in this case is defined as the solution that contains the most items, in order to maximize inventory space.

To run it, type `python powerset.py [list of item qualities]` on the command line. For example, `python powerset.py 5 6 8 16 13 2 8 10 8 10 13 7 5 3 6 9 13 8 5 8`. The program will respond with a table that looks something like this:

```
Total items:        20
Total quality:      163
Total solutions:    25692
Total combinations: 1048576

Quality | Currency | Solutions || Items | Best Solution
--------|----------|-----------||-------|----------------------------------------------------------------
     40 |        1 |      2372 ||     8 | (5, 6, 8, 2, 5, 3, 6, 5)
     80 |        2 |     20197 ||    13 | (5, 6, 8, 2, 8, 8, 7, 5, 3, 6, 9, 8, 5)
    120 |        3 |      3122 ||    16 | (5, 6, 8, 16, 13, 2, 8, 10, 8, 10, 7, 5, 3, 6, 8, 5)
    160 |        4 |         1 ||    19 | (5, 6, 8, 16, 13, 2, 8, 10, 8, 10, 13, 7, 5, 6, 9, 13, 8, 5, 8)
```

The top section shows overall statistics, including the total number of solutions for any multiple of 40 (equal to the sum of the "Solutions" column) and the total number of combinations checked (equal to 2 raised to the number of items). The table below shows a breakdown for each multiple of 40. Left of the double bar it shows the total quality for that row, how much currency you'll get for it, and the number of solutions it found that match. The right side of the double bar shows information about the "best" solution it found, including the number of items in the solution and which items those are.

Be aware that the power set operation is exponential in the number of items, meaning that the time it takes to complete doubles every time you add one item. On my computer, it takes a quarter of a second to calculate solutions for 20 items, but it takes four and half minutes to do 30 items. Just don't let your inventory get out of control and you should be fine.
