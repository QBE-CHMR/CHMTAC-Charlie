docker build -f Dockerfile -t my-frontend .
docker run -d --name my-frontend --network mynet -p 3001:3001 my-frontend