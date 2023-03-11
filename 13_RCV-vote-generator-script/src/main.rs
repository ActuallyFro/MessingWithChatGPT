use rand::seq::SliceRandom;
use rand::{thread_rng};
use std::error::Error;
use std::fs::File;
use std::io::prelude::*;
use uuid::Uuid;

fn main() -> Result<(), Box<dyn Error>> {
    // Generate 25 random UUIDs
    let mut rng = thread_rng();
    let uuids: Vec<Uuid> = (0..25).map(|_| Uuid::new_v4()).collect();

    // Generate a randomized list of letters A to J for each ballot
    let choices: Vec<Vec<char>> = (0..25)
        .map(|_| {
            let mut letters: Vec<char> = ('A'..='J').collect();
            letters.shuffle(&mut rng);
            letters
        })
        .collect();

    // Write the ballots to a CSV file
    let mut file = File::create("votes.csv")?;
    writeln!(file, "uuid,A,B,C,D,E,F,G,H,I,J")?;
    for (i, ballot) in choices.iter().enumerate() {
        let uuid = uuids[i].to_string();
        let ballot_str = ballot.iter().map(|c| c.to_string()).collect::<Vec<String>>().join(",");
        writeln!(file, "{},{}", uuid, ballot_str)?;
    }

    Ok(())
}
