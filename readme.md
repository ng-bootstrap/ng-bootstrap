 2209  docker build -t ngbootstrap_b:latest -f dockerfile .
 2210  docker run --rm -it -p 80:80  --name ngb_c ngbootstrap_b:latest /bin/bash

