docker build -t chmr-dmp-postgres .
docker run --name chmr-dmp-postgres -e POSTGRES_PASSWORD=postgres --network dmznet -p 7700:7700 -d chmr-dmp-postgres