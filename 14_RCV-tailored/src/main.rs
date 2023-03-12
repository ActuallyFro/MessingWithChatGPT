// CSV-powered Rustlang Analyzer for Ballots
// use std::collections::{HashMap, HashSet};
use std::collections::{HashMap};
use std::error::Error;
use std::fs::File;
use std::io::{BufRead, BufReader};

#[derive(Clone)]
struct Ballot {
    uuid: String,
    choices: Vec<String>,
}

fn main() -> Result<(), Box<dyn Error>> {
    println!("CSV-powered Rustlang Analyzer for Ballots (CRAB)");
    println!("================================================");
    let filename = "votes.csv";
    let file = File::open(filename)?;
    let reader = BufReader::new(file);
    let mut ballots = Vec::new();
    let mut discovered_choices = Vec::new();

    let top_to_bottom_list_limit = 0; //Top 20
    let is_verbose = true;

    for line in reader.lines() {
        let line = line?;
        let mut read_in_ballot = Ballot {
            uuid: String::new(),
            choices: Vec::new(),
        };

        //Read in the UUID:
        let mut read_uuid = String::new();
        for c in line.chars() {
            if c == ',' {
                break;
            }
            read_uuid.push(c);
        }
        read_in_ballot.uuid = read_uuid;

        //Read in the choices && store unique choices in `discovered_choices`
        let mut read_choice = String::new();
        for c in line.chars().skip(read_in_ballot.uuid.len() + 1) {
            if c == ',' {
                if !read_choice.is_empty() {
                    read_in_ballot.choices.push(read_choice.clone());

                    if !discovered_choices.contains(&read_choice) {
                        discovered_choices.push(read_choice.clone());
                    }
                }
                read_choice = String::new();

            } else {
                read_choice.push(c);
            }

            if c == line.chars().last().unwrap() && !read_choice.is_empty() {
                read_in_ballot.choices.push(read_choice.clone());

                if !discovered_choices.contains(&read_choice) {
                    discovered_choices.push(read_choice.clone());
                }

            }

        }

        ballots.push(read_in_ballot);
    }

    discovered_choices.retain(|x| !x.is_empty());
    discovered_choices.sort();

    println!("[CRAB] Total Ballots: {}", ballots.len());
    println!("[CRAB] Total Choices: {}", discovered_choices.len());
    println!("[CRAB] Discovered Choices: {:?}", discovered_choices);

    let mut ballots_rcv_analysis = ballots.clone();

    let mut top_to_bottom_list = Vec::new();
    let mut top_to_bottom_list_counter=0;

    loop {
        let mut rcv_downselect_loop_counter = 0;
        // loop {
            if is_verbose {
                println!("[CRAB] [VERBOSE] [{}] RCV Loop Iteration: {}", top_to_bottom_list_counter, rcv_downselect_loop_counter);
            }

            // let mut counter = 0;
            let mut vote_counts = HashMap::new();
            for ballot in &ballots_rcv_analysis {
                //check if ballot.choices[0] is empty, if so, skip
                if ballot.choices.is_empty() {
                    continue;
                }

                // println!("[CRAB] [VERBOSE] [{}] Ballot #{}", top_to_bottom_list_counter, counter);
                // println!("[CRAB] [VERBOSE] [{}] UUID: {}", top_to_bottom_list_counter, ballot.uuid);
                // println!("[CRAB] [VERBOSE] [{}] Choice: {}", top_to_bottom_list_counter, ballot.choices[0]);

                let count = vote_counts.entry(ballot.choices[0].clone()).or_insert(0);
                *count += 1;
            }

            if is_verbose {
                println!("[CRAB] [VERBOSE] [{}] Vote Counts: {:?}", top_to_bottom_list_counter, vote_counts);
            }

            let total_ballot_votes = vote_counts.values().sum::<i32>();
            let mut largest_ballot_sum = 0;
            let mut largest_ballot_choice = String::new();

            for (key, value) in &vote_counts {
                if value > &largest_ballot_sum {
                    largest_ballot_sum = *value;
                    largest_ballot_choice = key.clone();
                }
            }
            let choice_percent = largest_ballot_sum as f32 / total_ballot_votes as f32 * 100.0;

            if is_verbose {
                println!("[CRAB] [VERBOSE] [{}] Largest Choice: {} - @{} ({}%)", top_to_bottom_list_counter, largest_ballot_choice, largest_ballot_sum, choice_percent);
            }

            if largest_ballot_sum > total_ballot_votes / 2 {
                if is_verbose {
                    println!("[CRAB] Winner ({}): {}", top_to_bottom_list_counter+1, largest_ballot_choice);
                }
                top_to_bottom_list.push(largest_ballot_choice.clone());
                break;
            }

            let mut smallest_ballot_sum = 0;
            let mut smallest_ballot_choice = String::new();
            //Determine smallest ballot sum
            for (key, value) in &vote_counts {

                if value < &smallest_ballot_sum || smallest_ballot_sum == 0{
                    smallest_ballot_sum = *value;
                    smallest_ballot_choice = key.clone();
                }
            }

            if is_verbose {
                println!("[CRAB] [VERBOSE] [{}] Smallest Choice {} - @{}", top_to_bottom_list_counter, smallest_ballot_choice, smallest_ballot_sum);
            }

            // loop over vote_counts, if the value is equal to smallest_ballot_sum, remove ballot.choices[0]
            for (key, value) in &vote_counts {
                let eval_choice = String::from(key);
                if value == &smallest_ballot_sum {
                    for ballot in &mut ballots_rcv_analysis {
                        //check if ballot.choices is empty
                        if ballot.choices.is_empty() {
                            continue;
                        }
                        if ballot.choices[0] == eval_choice {
                            ballot.choices.remove(0);
                        }
                    }
                }
            } 

            rcv_downselect_loop_counter += 1;

            if is_verbose {
                println!("[CRAB] [VERBOSE] [{}] ",top_to_bottom_list_counter);
            }

        // }
        //latest winner pushed to top_to_bottom_list; current ballots in ballots_rcv_analysis 

        top_to_bottom_list_counter += 1;
        if top_to_bottom_list_counter >= top_to_bottom_list_limit && top_to_bottom_list_limit != 0{
            break;
        }

        println!("[CRAB] [DEBUG] top_to_bottom_list_counter {} vs. discovered_choices.len() {}", top_to_bottom_list_counter, discovered_choices.len());
        if top_to_bottom_list_counter >= discovered_choices.len()+1 {
            break;
        }

        println!("[CRAB] [DEBUG] BREAK HERE? Check...");

        //Goal rebuild ballots_rcv_analysis -- having removed the latest winner

        //create temp_ballots_rcv_analysis
        let mut temp_ballots_rcv_analysis = Vec::new();
        let latest_winner = top_to_bottom_list[top_to_bottom_list.len()-1].clone();
        //loop over ballots_rcv_analysis
        for ballot in &ballots_rcv_analysis {
            let mut temp_ballot = ballot.clone();
            temp_ballot.choices.clear();

            if ballot.choices.is_empty() {
                continue;
            }

            for choice in &ballot.choices {
                //if choice == latest_winner, skip
                if choice == &latest_winner {
                    continue;
                }
                //else, add to temp_ballot
                temp_ballot.choices.push(choice.clone());
            }
            //add temp_ballot to temp_ballots_rcv_analysis
            temp_ballots_rcv_analysis.push(temp_ballot);
        }

        ballots_rcv_analysis = temp_ballots_rcv_analysis.clone();

    }
    //END top_to_bottom_list LIMITED loop

    println!("[CRAB] top_to_bottom_list: {:?}", top_to_bottom_list);




    Ok(())
}
