docker build -f Dockerfile -t chmr-report-dispos .
docker run -d --name chmr-report-dispos --network dmznet -p 6000:6000 chmr-report-dispos