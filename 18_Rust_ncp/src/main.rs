use std::env;
use std::fs;
use std::io::{self, Read, Write};
use std::net::{TcpListener, TcpStream};
use std::thread;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        println!("Usage: ./executable_name [-s/-c] [file_path/ip_address:port] [file_path]");
        return;
    }
    let mode = &args[1];
    match mode.as_str() {
        "-s" => run_server(&args),
        "-c" => run_client(&args),
        _ => {
            println!("Invalid mode specified. Use -s for server mode or -c for client mode.");
            return;
        }
    }
}

fn run_server(args: &[String]) {
    let file_path = &args[2];
    let listener = TcpListener::bind("127.0.0.1:8070").unwrap_or_else(|err| {
        panic!("Failed to bind to port 8070: {}", err);
    });
    println!("Server started on port 8070");
    for stream in listener.incoming() {
        match stream {
            Ok(mut stream) => {
                let file_contents = fs::read_to_string(file_path).unwrap_or_else(|err| {
                    panic!("Failed to read file {}: {}", file_path, err);
                });
                stream.write_all(file_contents.as_bytes()).unwrap_or_else(|err| {
                    panic!("Failed to send file contents to client: {}", err);
                });
                println!("File sent to client successfully");
            }
            Err(err) => {
                println!("Error: {}", err);
            }
        }
    }
}

fn run_client(args: &[String]) {
    let ip_port = &args[2];
    let file_path = &args[3];
    let mut parts = ip_port.split(":");
    let ip = parts.next().unwrap();
    let port = parts.next().unwrap_or("8070");
    let address = format!("{}:{}", ip, port);
    match TcpStream::connect(address) {
        Ok(mut stream) => {
            stream.write_all(file_path.as_bytes()).unwrap_or_else(|err| {
                panic!("Failed to send file path to server: {}", err);
            });
            println!("File path sent to server successfully");
            let mut buffer = Vec::new();
            stream.read_to_end(&mut buffer).unwrap_or_else(|err| {
                panic!("Failed to read file contents from server: {}", err);
            });
            fs::write(file_path, buffer).unwrap_or_else(|err| {
                panic!("Failed to write file {}: {}", file_path, err);
            });
            println!("File downloaded successfully");
        }
        Err(err) => {
            println!("Error: {}", err);
        }
    }
}
