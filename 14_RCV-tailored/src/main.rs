use std::collections::{HashMap, HashSet};
use std::error::Error;
use std::fs::File;
use std::io::{BufRead, BufReader};

fn main() -> Result<(), Box<dyn Error>> {
    // Open the CSV file and read it line by line
    let file = File::open("votes.csv")?;
    let reader = BufReader::new(file);
    let mut choices = Vec::new();
    for line in reader.lines() {
        let ballot = line?;
        let votes = ballot.split(',').skip(1).map(|s| s.trim().to_string());
        //Not used:  let uuid = votes.next().ok_or("Ballot has no UUID")?;
        let ballot_choices = votes.collect::<Vec<String>>();
        choices.push(ballot_choices);
    }

    // Count the first choice votes
    let mut vote_counts = HashMap::new();
    for ballot in &choices {
        if let Some(choice) = ballot.first() {
            let count = vote_counts.entry(choice.clone()).or_insert(0);
            *count += 1;
        }
    }

    let mut winners = vec![String::new(); choices[0].len()];
    let mut losers = HashSet::new();
    //Not used: let num_ballots = choices.len();

    loop {
        let max_votes = vote_counts.values().max().ok_or("No max vote count found")?;
        let mut top_choices: Vec<_> = vote_counts
            .iter()
            .filter(|(_, count)| **count == *max_votes)
            .map(|(choice, _)| choice.clone())
            .collect();
        top_choices.sort();
        let winner = top_choices.first().ok_or("No winner found")?.clone();
        let winner_index = choices[0].iter().position(|c| *c == winner).ok_or("Winner not found in ballot choices")?;
        winners[winner_index] = winner.clone();

        if winners.iter().filter(|w| w.is_empty()).count() == 1 {
            let loser_index = winners.iter().position(|w| w.is_empty()).unwrap();
            let loser = choices[0][loser_index].clone();
            losers.insert(loser.clone());

            for ballot in &choices {
                let mut new_choice = None;
                for choice in ballot.iter().skip(1) {
                    if new_choice.is_none() && !losers.contains(choice) {
                        new_choice = Some(choice.clone());
                    }
                    if winners.iter().any(|w| *w == *choice) {
                        let count = vote_counts.entry(choice.clone()).or_insert(0);
                        *count += 1;
                        break;
                    }
                }
                if let Some(choice) = new_choice {
                    let count = vote_counts.entry(choice.clone()).or_insert(0);
                    *count += 1;
                }
            }

            if vote_counts.values().all(|count| *count == 0) {
                break;
            }
        } else {
            break;
        }
    }

    for (rank, winner) in winners.iter().enumerate() {
        println!("Rank {}: {}", rank + 1, winner);
    }

    Ok(())
}
