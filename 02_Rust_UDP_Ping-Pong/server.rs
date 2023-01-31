use std::net::UdpSocket;

fn main() {
    let socket = UdpSocket::bind("127.0.0.1:3000").expect("Could not bind socket");

    loop {
        let mut buf = [0; 10];
        let (len, src) = socket
            .recv_from(&mut buf)
            .expect("Could not receive data");

        println!("Received data from {}: {:?}", src, &buf[..len]);

        socket
            .send_to(&buf[..len], src)
            .expect("Could not send data");
    }
}
