# Docker

To get Caby running we need three things:

1. The backend service
2. The frontend service
3. A valid [config file](../configuration/main-config.md)

There are a few ways to get the backend and frontend services deployed. If you're not sure which to use we recommend starting with [Docker Compose](#docker-compose).

## Docker Compose

### Prerequisites

Before starting, ensure that you have:

- Docker
- Docker Compose

### Preparation

Let's prepare for the first deployment by creating two files:

```sh
touch config.yaml compose.yaml
```

You now have two files in your working directory:

```
.
├── compose.yaml
└── config.yaml
```

### Determine file storage: `cabynet`

In most cases we want to be able to share the files that Caby manages with other applications. So, we need to mount the files Caby will manage such that it is accessble to other services running in Docker. There is more than one way to do this. For example we could mount a local directory to Caby's backend:

```yaml
  services:
    caby-service:
      volumes:
        - /srv/cabynet-files:/app/cabynet
```

For this step-by-step guide let's assume that we want a global volume that any other container can then mount. Let's create that volume:

```sh
docker volume create cabynet
```

### Prepare Docker Compose file

Let's edit the `compose.yaml` file we created earlier:

```yaml [compose.yaml]
services:
  # backend service
  caby-service:
    image: ghcr.io/caby-io/caby-service:edge
    # keep the backend in a startup loop while we prep the config
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      # everything (files, users, shares, ...) is saved here
      - cabynet:/app/cabynet
      # the main configuration. Caby only needs read access to this
      - ./config.yaml:/app/cabynet/config.yaml:ro

  # frontend service
  caby-web:
    image: ghcr.io/caby-io/caby-web:edge
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      # needs to point to the API's public URL
      PUBLIC_API_BASE: https://caby-api.my-domain.com/v0

volumes:
  cabynet:
    external: true
```

### Prepare Caby's config

For `compose.yaml` reference the [config file](../configuration/main-config.md) page.

### Deploy

Finally, deploy the stack:

```sh
docker compose up
```

## Docker CLI

Run the backend service in the background:

```sh
docker run -d \
  --name caby-service \
  -p 8080:8080 \
  -v "$(pwd)/cabynet:/app/cabynet" \
  -v "$(pwd)/config.yaml:/app/cabynet/config.yaml:ro" \
  --restart unless-stopped \
  ghcr.io/caby-io/caby-service:edge
```

Run the frontend service in the background:

```sh
docker run -d \
  --name caby-web \
  -p 3000:3000 \
  -e PUBLIC_API_BASE=http://localhost:8080/v0 \
  --restart unless-stopped \
  ghcr.io/caby-io/caby-web:edge
```
