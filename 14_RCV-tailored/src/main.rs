// use std::collections::{HashMap, HashSet};
use std::collections::{HashMap};
use std::error::Error;
use std::fs::File;
use std::io::{BufRead, BufReader};

struct Ballot {
    uuid: String,
    choices: Vec<String>,
}

fn main() -> Result<(), Box<dyn Error>> {
    //IF DESIRED to all labels: let mut skip_first_line = true;

    // Open the CSV file and read it line by line
    let file = File::open("votes.csv")?;
    let reader = BufReader::new(file);
    // let mut choices = Vec::new();

    let mut ballots = Vec::new();

    //Discovered Choices
    let mut discovered_choices = Vec::new();

    // println!("[DEBUG] Total Choices: {}", discovered_choices.len());
    // println!("[DEBUG] Discovered Choices: {:?}", discovered_choices);

    for line in reader.lines() {
        //IF DESIRED to all labels:
        //if skip_first_line {
        //    skip_first_line = false;
        //    continue;
        //}

        let line = line?;
        let mut read_in_ballot = Ballot {
            uuid: String::new(),
            choices: Vec::new(),
        };

        //Read in the UUID, which is the first string up to the first comma
        let mut read_uuid = String::new();
        for c in line.chars() {
            if c == ',' {
                break;
            }
            read_uuid.push(c);
        }
        read_in_ballot.uuid = read_uuid;

        //Read in the choices, which are the strings after the first comma
        let mut read_choice = String::new();
        for c in line.chars().skip(read_in_ballot.uuid.len() + 1) {
            //comma OR end of line
            if c == ',' {
                if !read_choice.is_empty() {
                    read_in_ballot.choices.push(read_choice.clone());

                    if !discovered_choices.contains(&read_choice) {
                        // println!("[DEBUG] Found: {}", read_choice);
                        discovered_choices.push(read_choice.clone());
                    }
                }
                read_choice = String::new();


            } else {
                read_choice.push(c);
            }

            //if last character AND read_choice is not empty, push the last choice into read_in_ballot.choices
            if c == line.chars().last().unwrap() && !read_choice.is_empty() {
                read_in_ballot.choices.push(read_choice.clone());

                // push into `discovered_choices` if NOT duplicate
                if !discovered_choices.contains(&read_choice) {
                    // println!("[DEBUG] Found: {}", read_choice);
                    discovered_choices.push(read_choice.clone());
                }

            }

        }

        // println!("[DEBUG] UUID: {}", read_in_ballot.uuid);
        // println!("[DEBUG] Choices: {:?} <total: {}>", read_in_ballot.choices, read_in_ballot.choices.len());

        ballots.push(read_in_ballot);
    }

    discovered_choices.retain(|x| !x.is_empty());
    discovered_choices.sort();

    println!("[DEBUG] Total Ballots: {}", ballots.len());
    println!("[DEBUG] Total Choices: {}", discovered_choices.len());
    println!("[DEBUG] Discovered Choices: {:?}", discovered_choices);

    let debug_breakout = true;
    loop {

        // // Count the first choice votes
        let mut counter = 0;

        let mut vote_counts = HashMap::new();
        for ballot in &ballots {
            println!("[DEBUG] Ballot #{}", counter);
            println!("[DEBUG] UUID: {}", ballot.uuid);
            println!("[DEBUG] Choice: {}", ballot.choices[0]);

            let count = vote_counts.entry(ballot.choices[0].clone()).or_insert(0);
            *count += 1;

            counter += 1;
            println!("");
        }

        println!("[DEBUG] Vote Counts: {:?}", vote_counts);
        // print the total number of ballots in vote_counts

        let total_ballot_votes = vote_counts.values().sum::<i32>();
        println!("[DEBUG] Total Ballots: {}", total_ballot_votes);

        //Calculate the highest vote count in vote_counts
        let mut largest_ballot_sum = 0;
        let mut largest_ballot_choice = String::new();
        for (key, value) in &vote_counts {
            if value > &largest_ballot_sum {
                largest_ballot_sum = *value;
                largest_ballot_choice = key.clone();
            }
        }
        //debug
        println!("[DEBUG] Largest Ballot Sum: {}", largest_ballot_sum);
        println!("[DEBUG] Largest Ballot Choice: {}", largest_ballot_choice);
        
        // evlauate if largest_ballot_sum > 50% of total_ballot_votes
        if largest_ballot_sum > total_ballot_votes / 2 {
            println!("[DEBUG] Winner: {}", largest_ballot_choice);
        } else {
            println!("[DEBUG] No winner yet");
            println!("[DEBUG] % of vote: {}", largest_ballot_sum as f32 / total_ballot_votes as f32 * 100.0);
        }

        // breakout for now...
        if debug_breakout {
            break;
        }
    }





    // for ballot in &choices {
    //     if let Some(choice) = ballot.first() {
    //         let count = vote_counts.entry(choice.clone()).or_insert(0);
    //         *count += 1;
    //     }
    // }

    // let mut winners = vec![String::new(); choices[0].len()];
    // let mut losers = HashSet::new();
    // //Not used: let num_ballots = choices.len();

    // loop {
    //     let max_votes = vote_counts.values().max().ok_or("No max vote count found")?;
    //     let mut top_choices: Vec<_> = vote_counts
    //         .iter()
    //         .filter(|(_, count)| **count == *max_votes)
    //         .map(|(choice, _)| choice.clone())
    //         .collect();
    //     top_choices.sort();
    //     let winner = top_choices.first().ok_or("No winner found")?.clone();
    //     let winner_index = choices[0].iter().position(|c| *c == winner).ok_or("Winner not found in ballot choices")?;
    //     winners[winner_index] = winner.clone();

    //     if winners.iter().filter(|w| w.is_empty()).count() == 1 {
    //         let loser_index = winners.iter().position(|w| w.is_empty()).unwrap();
    //         let loser = choices[0][loser_index].clone();
    //         losers.insert(loser.clone());

    //         for ballot in &choices {
    //             let mut new_choice = None;
    //             for choice in ballot.iter().skip(1) {
    //                 if new_choice.is_none() && !losers.contains(choice) {
    //                     new_choice = Some(choice.clone());
    //                 }
    //                 if winners.iter().any(|w| *w == *choice) {
    //                     let count = vote_counts.entry(choice.clone()).or_insert(0);
    //                     *count += 1;
    //                     break;
    //                 }
    //             }
    //             if let Some(choice) = new_choice {
    //                 let count = vote_counts.entry(choice.clone()).or_insert(0);
    //                 *count += 1;
    //             }
    //         }

    //         if vote_counts.values().all(|count| *count == 0) {
    //             break;
    //         }
    //     } else {
    //         break;
    //     }
    // }

    // for (rank, winner) in winners.iter().enumerate() {
    //     println!("Rank {}: {}", rank + 1, winner);
    // }

    Ok(())
}
