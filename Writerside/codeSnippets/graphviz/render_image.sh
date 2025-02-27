#!/bin/bash

# Directories
DOT_SOURCE_DIR="./Writerside/codeSnippets/graphviz"
OUTPUT_DIR="./Writerside/images"
PREFIX="gn-"  # Prefix for generated files

# Ensure the output directory exists
mkdir -p "$OUTPUT_DIR"

# Find and compile all .dot files
for dot_file in "$DOT_SOURCE_DIR"/*.dot; do
    filename=$(basename -- "$dot_file" .dot)
    output_file="$OUTPUT_DIR/$PREFIX$filename.svg"

    # Compile .dot to SVG with transparent background
    if dot -Tsvg -Gbgcolor=transparent "$dot_file" -o "$output_file"; then
        echo "Compiled: $dot_file → $output_file"
    else
        echo "Failed to compile: $dot_file"
        exit 1
    fi
done
