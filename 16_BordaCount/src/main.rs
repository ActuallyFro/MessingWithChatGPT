fn borda_count(votes: &Vec<Vec<usize>>) -> Vec<usize> {
    let num_candidates = votes[0].len();
    let mut scores = vec![0; num_candidates];

    for vote in votes {
        for (i, candidate) in vote.iter().enumerate() {
            scores[*candidate] += num_candidates - i - 1;
        }
    }

    scores
}

fn main() {
    let votes = vec![
        vec![2, 3, 1, 4, 0, 5, 9, 6, 8, 7],
        vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
        vec![0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        vec![5, 4, 3, 2, 1, 0, 9, 8, 7, 6],
    ];

    let scores = borda_count(&votes);
    println!("Scores: {:?}", scores);
}
