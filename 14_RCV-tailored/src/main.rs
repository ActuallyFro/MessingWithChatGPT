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
    // print CRAB header
    println!("CSV-powered Rustlang Analyzer for Ballots (CRAB)");
    println!("================================================");
    //IF DESIRED to all labels: let mut skip_first_line = true;
    let filename = "votes.csv";
    let file = File::open(filename)?;
    let reader = BufReader::new(file);
    let mut ballots = Vec::new();
    let mut discovered_choices = Vec::new();

    let top_to_bottom_list_limit = 0; //Top 20
    let is_verbose = true;

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


    // Start top_to_bottom_list LIMITED loop
    loop {
        let mut rcv_downselect_loop_counter = 0;
        loop {
            if is_verbose {
                println!("[CRAB] [VERBOSE] [{}] RCV Loop Iteration: {}", top_to_bottom_list_counter, rcv_downselect_loop_counter);
            }

            // let mut counter = 0;
            let mut vote_counts = HashMap::new();
            for ballot in &ballots_rcv_analysis {
                // println!("[CRAB] [VERBOSE] [{}] Ballot #{}", top_to_bottom_list_counter, counter);
                // println!("[CRAB] [VERBOSE] [{}] UUID: {}", top_to_bottom_list_counter, ballot.uuid);
                // println!("[CRAB] [VERBOSE] [{}] Choice: {}", top_to_bottom_list_counter, ballot.choices[0]);

                let count = vote_counts.entry(ballot.choices[0].clone()).or_insert(0);
                *count += 1;

                // counter += 1;
                // println!("");
            }

            if is_verbose {
                println!("[CRAB] [VERBOSE] [{}] Vote Counts: {:?}", top_to_bottom_list_counter, vote_counts);
            }
            // print the total number of ballots in vote_counts

            let total_ballot_votes = vote_counts.values().sum::<i32>();
            // println!("[CRAB] [VERBOSE] [{}] Total Ballots: {}", top_to_bottom_list_counter, total_ballot_votes);

            //Calculate the highest vote count in vote_counts
            let mut largest_ballot_sum = 0;
            let mut largest_ballot_choice = String::new();

            for (key, value) in &vote_counts {
                if value > &largest_ballot_sum {
                    largest_ballot_sum = *value;
                    largest_ballot_choice = key.clone();
                }
            }
            let choice_percent = largest_ballot_sum as f32 / total_ballot_votes as f32 * 100.0;
            //debug
            if is_verbose {
                println!("[CRAB] [VERBOSE] [{}] Largest Choice: {} - @{} ({}%)", top_to_bottom_list_counter, largest_ballot_choice, largest_ballot_sum, choice_percent);
            }

            // evlauate if largest_ballot_sum > 50% of total_ballot_votes
            if largest_ballot_sum > total_ballot_votes / 2 {
                if is_verbose {
                    println!("[CRAB] Winner ({}): {}", top_to_bottom_list_counter+1, largest_ballot_choice);
                }
                //push the winner onto the top_to_bottom_list
                top_to_bottom_list.push(largest_ballot_choice.clone());
                break;

            }
            // else {
            //     println!("[CRAB] [VERBOSE] [{}] No winner yet",top_to_bottom_list_counter);
            // }

            let mut smallest_ballot_sum = 0;
            let mut smallest_ballot_choice = String::new();
            //Determine smallest ballot sum
            for (key, value) in &vote_counts {

                if value < &smallest_ballot_sum || smallest_ballot_sum == 0{
                    smallest_ballot_sum = *value;
                    smallest_ballot_choice = key.clone();
                }
            }
            //debug
            if is_verbose {
                println!("[CRAB] [VERBOSE] [{}] Smallest Choice {} - @{}", top_to_bottom_list_counter, smallest_ballot_choice, smallest_ballot_sum);
            }
            // loop over vote_counts, if the value is equal to smallest_ballot_sum, remove ballot.choices[0]
            for (key, value) in &vote_counts {
                let eval_choice = String::from(key);
                if value == &smallest_ballot_sum {
                    for ballot in &mut ballots_rcv_analysis {
                        if ballot.choices[0] == eval_choice {
                            // println!("[CRAB] [VERBOSE] [{}] Removing: {} from {}", top_to_bottom_list_counter, key, ballot.uuid);
                            ballot.choices.remove(0);
                        }
                    }
                }
            } 

            rcv_downselect_loop_counter += 1;

            if is_verbose {
                println!("[CRAB] [VERBOSE] [{}] ",top_to_bottom_list_counter);
            }

        }

        // Remove 

        top_to_bottom_list_counter += 1;
        if top_to_bottom_list_counter >= top_to_bottom_list_limit && top_to_bottom_list_limit != 0{
            break;
        }

        // break if out of bounds of loop vs. the choices
        if top_to_bottom_list_counter >= discovered_choices.len()+1 {
            break; //top_to_bottom_list_limit
        }

        // re-clone ballots_rcv_analysis = ballots.clone();
        ballots_rcv_analysis = ballots.clone();
        //then loop over each of the winners in `top_to_bottom_list`
        for winner in &top_to_bottom_list {
            // println!("[CRAB] [DEBUG] Removing {} from ballots_rcv_analysis", winner);
            // loop over ballots_rcv_analysis
            for ballot in &mut ballots_rcv_analysis {
                // if ballot.choices[0] == winner
                if ballot.choices[0] == *winner {
                    // remove ballot.choices[0]
                    ballot.choices.remove(0);
                }
            }
        }

    }
    //END top_to_bottom_list LIMITED loop

    println!("[CRAB] top_to_bottom_list: {:?}", top_to_bottom_list);




    Ok(())
}
