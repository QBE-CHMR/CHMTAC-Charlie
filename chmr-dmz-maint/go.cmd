docker build -f Dockerfile -t chmr-dmz-maint .
docker run -d --name chmr-dmz-maint --network dmznet -p "3001:3000" chmr-dmz-maint