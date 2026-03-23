# partage-app
Appli de partage

## Pocketbase on fly.io

See https://github.com/pocketbase/pocketbase/discussions/537

## Commands

- build image locally: `docker build . -t pocketbase`
- run image locally: `docker run -it -p 8080:8080 pocketbase`
- run all locally: `docker compose up -d`
- login to fly.io: `flyctl auth login`
- deploy: `flyctl deploy`
- update environment variables: `flyctl secrets import < .env`
- download remote data: `flyctl proxy 10022:22` + `scp -r -P 10022 root@localhost:/pb/pb_data  .`
- register a ssh key: `flyctl ssh issue --agent`

