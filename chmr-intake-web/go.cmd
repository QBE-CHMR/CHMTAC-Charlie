docker build -f Dockerfile -t chmr-intake-web .
docker run -d --name chmr-intake-web --network dmznet -p 3000:3000 chmr-intake-web