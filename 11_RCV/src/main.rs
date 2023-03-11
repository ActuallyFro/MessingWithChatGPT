use csv::ReaderBuilder;
use std::collections::{HashMap, HashSet};
use std::error::Error;
use std::fs::File;

#[derive(Debug)]
struct Candidate {
    name: String,
    votes: u32,
    eliminated: bool,
}

fn main() -> Result<(), Box<dyn Error>> {
    // Open CSV file
    let file = File::open("votes.csv")?;

    // Create CSV reader
    let mut reader = ReaderBuilder::new().has_headers(false).from_reader(file);

    // Create map of candidates with initial vote count of 0
    let mut candidate_map = HashMap::new();
    for record in reader.records() {
        let record = record?;
        let uuid = &record[0];
        let candidate_names = &record[1..];

        for candidate_name in candidate_names {
            let candidate = candidate_map.entry(candidate_name.to_owned()).or_insert(Candidate {
                name: candidate_name.to_owned(),
                votes: 0,
                eliminated: false,
            });

            candidate.votes += 1;
        }
    }

    // Convert map to vector of candidates
    let mut candidates: Vec<Candidate> = candidate_map.into_iter().map(|(_, candidate)| candidate).collect();

    // Calculate winner of RCV
    let mut round = 1;
    loop {
        // Eliminate last place candidate
        let mut min_votes = std::u32::MAX;
        let mut min_index = None;
        for (i, candidate) in candidates.iter().enumerate() {
            if !candidate.eliminated && candidate.votes < min_votes {
                min_votes = candidate.votes;
                min_index = Some(i);
            }
        }

        if let Some(min_index) = min_index {
            candidates[min_index].eliminated = true;

            // Redistribute votes from eliminated candidate
            let mut votes: HashMap<usize, HashSet<String>> = HashMap::new();
            for (i, candidate) in candidates.iter().enumerate() {
                if !candidate.eliminated {
                    let candidate_votes = votes.entry(i).or_insert(HashSet::new());

                    for (j, candidate_name) in candidate_names.iter().enumerate() {
                        if candidate.name == *candidate_name {
                            candidate_votes.insert(j + 1);
                            break;
                        }
                    }
                }
            }

            for (i, candidate) in candidates.iter_mut().enumerate() {
                if let Some(candidate_votes) = votes.get(&i) {
                    candidate.votes = candidate_votes.len() as u32;
                } else {
                    candidate.votes = 0;
                }
            }

            // Print list of eliminated candidates
            let eliminated_candidates: Vec<String> = candidates
                .iter()
                .filter(|candidate| candidate.eliminated)
                .map(|candidate| candidate.name.clone())
                .collect();

            println!("Round {}: Eliminated candidates: {:?}", round, eliminated_candidates);

            round += 1;
        } else {
            // One candidate remaining, they win
            let winner = candidates.iter().find(|candidate| !candidate.eliminated).unwrap();
            println!("Winner: {}", winner.name);
            break;
        }
    }

    Ok(())
}
