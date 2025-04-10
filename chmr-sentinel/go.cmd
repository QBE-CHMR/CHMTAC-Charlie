docker build -f Dockerfile -t chmr-sentinel .
docker run -d --name chmr-sentinel --network dmznet -p 7000:7000 chmr-sentinel