use std::io::{Read, Write};
use std::net::TcpStream;

fn main() {
    let mut stream = TcpStream::connect("127.0.0.1:8070").unwrap();
    println!("Connected to server!");

    let mut buffer = [0; 1024];
    let mut contents = String::new();
    loop {
        match stream.read(&mut buffer) {
            Ok(n) if n > 0 => {
                contents.push_str(&String::from_utf8_lossy(&buffer[..n]));
            }
            Ok(_) | Err(_) => break,
        }
    }
    println!("{}", contents);
}
