docker build -f Dockerfile -t chmr-dmz-maint .
docker run -d --name chmr-dmz-maint --network dmznet -p 4000:4000 chmr-dmz-maint