#!/bin/bash

# Read the input file
input_file=$1

# Create a temporary file to store the word frequency
tmp_file=$(mktemp)

# Count the frequency of each word in the input file
cat $input_file | tr ' ' '\n' | sort | uniq -c | sort -nr > $tmp_file

# Create the GraphML file
graphml_file=$2

echo '<?xml version="1.0" encoding="UTF-8"?>' > $graphml_file
echo '<graphml xmlns="http://graphml.graphdrawing.org/xmlns"' >> $graphml_file
echo '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' >> $graphml_file
echo '    xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns' >> $graphml_file
echo '        http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">' >> $graphml_file
echo '  <graph id="G" edgedefault="directed">' >> $graphml_file

# Add each node to the GraphML file
while read line; do
  frequency=$(echo $line | awk '{print $1}')
  word=$(echo $line | awk '{print $2}')
  echo "    <node id='$word'>" >> $graphml_file
  echo "      <data key='d0'>$frequency</data>" >> $graphml_file
  echo "    </node>" >> $graphml_file
done < $tmp_file

# Add each edge to the GraphML file
previous_word=""
cat $input_file | tr ' ' '\n' | while read word; do
  if [ ! -z "$previous_word" ]; then
    echo "    <edge source='$previous_word' target='$word'/>" >> $graphml_file
  fi
  previous_word=$word
done

echo '  </graph>' >> $graphml_file
echo '</graphml>' >> $graphml_file

# Clean up the temporary file
rm $tmp_file
