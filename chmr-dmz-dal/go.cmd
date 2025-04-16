docker build -f Dockerfile -t intake-backend .
docker run -d --name intake-backend --network mynet -p 5000:5000 -e REDIS_URL="redis://my-redis:6379" -v filedata:/usr/server/app/files intake-backend