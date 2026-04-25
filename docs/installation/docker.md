# Docker

To get Caby running we need three things:

1. The backend service
2. The frontend service
3. A valid config file

There are a few ways to get the backend and frontend services deployed. If you're not sure which to use we recommend starting with [Docker Compose](#docker-compose).

## Docker Compose

```yaml [compose.yaml]
services:
  # backend service
  caby-service:
    image: cabynet/caby-service:latest
    # keep the backend in a startup loop while we prep the config
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      # this is where everything: Files, users, shares, will be saved
      - cabynet:/app/cabynet
      # the main configuration. Caby only needs read access to this
      - ./config.yaml:/app/cabynet/config.yaml:ro

  # frontend service
  caby-web:
    image: cabynet/caby-web:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      # needs to point to the API's public URL
      # e.g. https://my-caby-api.domain.com/v0
      PUBLIC_API_BASE: http://localhost:8080/v0

volumes:
  cabynet:
```

## Docker CLI

Run the background service in the background:
```sh
docker run -d \
  --name caby-service \
  -p 8080:8080 \
  -v "$(pwd)/cabynet:/app/cabynet" \
  -v "$(pwd)/config.yaml:/app/cabynet/config.yaml:ro" \
  --restart unless-stopped \
  cabynet/caby-service:latest
```

Run the frontend service in the background:
```sh
docker run -d \
  --name caby-web \
  -p 3000:3000 \
  -e PUBLIC_API_BASE=http://localhost:8080/v0 \
  --restart unless-stopped \
  cabynet/caby-web:latest
```
