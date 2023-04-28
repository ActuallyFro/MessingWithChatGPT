use std::env;
use std::fs;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};

fn handle_client(mut stream: TcpStream, filename: &str) {
    let mut file = fs::File::open(filename).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();
    stream.write(contents.as_bytes()).unwrap();
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = &args[1];
    let listener = TcpListener::bind("127.0.0.1:8070").unwrap();
    println!("Server listening on port 8070...");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                println!("New client connected: {:?}", stream.peer_addr().unwrap());
                handle_client(stream, filename);
            }
            Err(e) => {
                println!("Error: {}", e);
            }
        }
    }
}
