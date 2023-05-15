import subprocess
import time

def main():
    # Capture 10 seconds of packets via tcpdump
    cmd = 'tcpdump -w packets.pcap'
    p = subprocess.Popen(cmd, shell=True)
    time.sleep(10)
    p.terminate()

if __name__ == "__main__":
    main()
