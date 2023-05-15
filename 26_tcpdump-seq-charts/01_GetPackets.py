import os
from scapy.all import rdpcap

def main():
    # Open the captured file and find the first 5 packets
    packets = rdpcap('packets.pcap')
    first_5_packets = packets[:5]

    # Generate PlantUML sequence diagram code and 
    # Embed the PlantUML sequence in an .adoc file
    with open('diagram.adoc', 'w') as f:
        f.write('== My Diagram\n')
        f.write('[plantuml, my-diagram, png]\n')
        f.write('----\n')
        for packet in first_5_packets:
            # Extract the relevant information from the packets
            # and write them as PlantUML sequence diagram code
            f.write('Alice -> Bob: ' + packet.summary() + '\n')  # Just an example
        f.write('----\n')

    # Use asciidoctor-pdf to render the .adoc file
    os.system('asciidoctor-pdf diagram.adoc')

if __name__ == "__main__":
    main()
