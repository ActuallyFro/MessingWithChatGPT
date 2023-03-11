1. Input: A set of ballots, where each ballot is a ranked list of candidates.

2. Compute the total number of valid ballots n.

3. While there is more than one candidate remaining:

    4. Compute the tally of first-choice votes for each candidate.

    5. If a candidate has more than half of the first-choice votes, they win.

        6. Output the winner.

        7. Exit.

    8. If no candidate has more than half of the first-choice votes:

        9. Eliminate the candidate with the fewest first-choice votes.

        10. Remove all ballots that have the eliminated candidate as their first choice.

        11. For each ballot that has the eliminated candidate as its second choice, add one vote to the tally of the next highest-ranked candidate that is still in the running.

12. Goto step 3.
