use std::net::UdpSocket;

fn main() {
    let socket = UdpSocket::bind("127.0.0.1:3001").expect("Could not bind socket");
    let server_address = "127.0.0.1:3000";

    let message = "ping".as_bytes();
    socket
        .send_to(message, server_address)
        .expect("Could not send data");

    let mut buf = [0; 10];
    let (len, src) = socket
        .recv_from(&mut buf)
        .expect("Could not receive data");

    println!("Received data from {}: {:?}", src, &buf[..len]);
}
