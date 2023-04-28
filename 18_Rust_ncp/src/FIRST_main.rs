use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        println!("Usage: rust-app [mode]");
        println!("  modes:");
        println!("    server [filename]");
        println!("    client [server_ip:port]");
        return;
    }

    let mode = &args[1];

    match mode.as_str() {
        "server" => {
            if args.len() < 3 {
                println!("Usage: rust-app server [filename]");
                return;
            }
            let filename = &args[2];
            let port = env::var("PORT").unwrap_or(String::from("8070"));
            let listener = TcpListener::bind(format!("127.0.0.1:{}", port)).unwrap();

            println!("Server listening on port {}", port);

            for stream in listener.incoming() {
                let mut stream = stream.unwrap();
                let mut file = std::fs::File::open(filename).unwrap();
                let mut buffer = [0; 1024];

                while let Ok(n) = file.read(&mut buffer) {
                    if n == 0 {
                        break;
                    }
                    stream.write_all(&buffer[0..n]).unwrap();
                }
            }
        }
        "client" => {
            if args.len() < 3 {
                println!("Usage: rust-app client [server_ip:port]");
                return;
            }
            let server_addr = &args[2];
            let mut stream = TcpStream::connect(server_addr).unwrap();
            let mut buffer = [0; 1024];

            while let Ok(n) = stream.read(&mut buffer) {
                if n == 0 {
                    break;
                }
                std::io::stdout().write_all(&buffer[0..n]).unwrap();
            }
        }
        _ => {
            println!("Invalid mode: {}", mode);
            println!("Usage: rust-app [mode]");
            println!("  modes:");
            println!("    server [filename]");
            println!("    client [server_ip:port]");
        }
    }
}
