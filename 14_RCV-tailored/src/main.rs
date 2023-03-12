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

    let debug_breakout = false;
    // clone the ballots vector for the RCV algorithm
    let mut ballots_rcv_analysis = ballots.clone();

    // // List Top-to-Bottom of Winners -- as choices are removed they are pushed onto this vector of strings
    let mut TopToBottomList = Vec::new();

    let mut RCV_Downselect_Loop_Counter = 0;
    loop {
        println!("[DEBUG] RCV Loop Iteration: {}", RCV_Downselect_Loop_Counter);

        // // Count the first choice votes
        let mut counter = 0;

        let mut vote_counts = HashMap::new();
        for ballot in &ballots_rcv_analysis {
            // println!("[DEBUG] Ballot #{}", counter);
            // println!("[DEBUG] UUID: {}", ballot.uuid);
            // println!("[DEBUG] Choice: {}", ballot.choices[0]);

            let count = vote_counts.entry(ballot.choices[0].clone()).or_insert(0);
            *count += 1;

            counter += 1;
            // println!("");
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
            println!("[DEBUG] % of vote: {}", largest_ballot_sum as f32 / total_ballot_votes as f32 * 100.0);
            //push the winner onto the TopToBottomList
            TopToBottomList.push(largest_ballot_choice.clone());
            break;

        } else {
            println!("[DEBUG] No winner yet");
            println!("[DEBUG] % of vote: {}", largest_ballot_sum as f32 / total_ballot_votes as f32 * 100.0);
        }

        let mut smallest_ballot_sum = 0;
        let mut smallest_ballot_choice = String::new();
        //Determine smallest ballot sum
        for (key, value) in &vote_counts {
            println!("[DEBUG] Key: {}", key);

            if value < &smallest_ballot_sum || smallest_ballot_sum == 0{
                println!("[DEBUG] Value: {}", value);
                smallest_ballot_sum = *value;
                smallest_ballot_choice = key.clone();
            }
        }
        //debug
        println!("[DEBUG] Smallest Ballot Sum: {}", smallest_ballot_sum);
        println!("[DEBUG] Smallest Ballot Choice: {}", smallest_ballot_choice);

        // loop over vote_counts, if the value is equal to smallest_ballot_sum, remove ballot.choices[0]
        for (key, value) in &vote_counts {
            // new String variable called eval_choice
            let eval_choice = String::from(key);
            if value == &smallest_ballot_sum {
                for ballot in &mut ballots_rcv_analysis {
                    if ballot.choices[0] == eval_choice {
                        println!("[DEBUG] Removing: {} from {}", key, ballot.uuid);
                        ballot.choices.remove(0);
                    }
                }
            }
        } 

        // // breakout for now...
        // if debug_breakout || RCV_Downselect_Loop_Counter > 15{
        //     break;
        // }
        RCV_Downselect_Loop_Counter += 1;
        println!("[DEBUG] ");

    }


    println!("[DEBUG] TopToBottomList: {:?}", TopToBottomList);




    Ok(())
}
