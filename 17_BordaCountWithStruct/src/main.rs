struct Ballot {
    uuid: String,
    choices: Vec<String>,
}

fn borda_count(votes: &Vec<Ballot>) -> Vec<usize> {
    let num_candidates = votes[0].choices.len();
    let mut scores = vec![0; num_candidates];

    for vote in votes {
        for (i, candidate) in vote.choices.iter().enumerate() {
            if let Some(index) = vote.choices.iter().position(|c| c == candidate) {
                scores[index] += num_candidates - i - 1;
            }
        }
    }

    scores
}

fn main() {
    let votes = vec![
        Ballot {
            uuid: "001".to_string(),
            choices: vec![
                "B".to_string(),
                "C".to_string(),
                "D".to_string(),
                "A".to_string(),
            ],
        },
        Ballot {
            uuid: "002".to_string(),
            choices: vec![
                "C".to_string(),
                "Z".to_string(),
                "A".to_string(),
                "B".to_string(),
            ],
        },
        Ballot {
            uuid: "003".to_string(),
            choices: vec![
                "D".to_string(),
                "C".to_string(),
                "A".to_string(),
                "B".to_string(),
            ],
        },
    ];

    let scores = borda_count(&votes);
    println!("Scores: {:?}", scores);
}
