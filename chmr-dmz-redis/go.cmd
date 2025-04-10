docker network create --internal dmznet
docker run -p 6379:6379 --name chmr-dmz-redis --rm --network dmznet redis