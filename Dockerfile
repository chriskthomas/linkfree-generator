#| Builder Container
FROM debian:bookworm-slim AS builder
# Copy source files and build script
COPY /src /src
COPY --chmod=0755 build.sh /build.sh
# Build website
RUN set -x \
    && apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests -y php-cli minify ca-certificates \
    && /build.sh

#| Main Container
FROM debian:bookworm-slim
RUN set -x \
    # create nginx user/group first, to be consistent throughout docker variants
    && groupadd --system --gid 101 nginx \
    && useradd --system -g nginx --no-create-home --home-dir /nonexistent --comment "nginx user" --shell /bin/false --uid 101 nginx \
    && apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests -y nginx-core php-fpm \
    # forward request and error logs to docker log collector
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
# Copy nginx config
COPY .docker/nginx-site.conf /etc/nginx/sites-enabled/default
# Copy website files
COPY --from=builder /dist /srv
# Copy entrypoint
COPY .docker/entrypoint.sh /entrypoint.sh
# Good for php-fpm to use SIGQUIT
STOPSIGNAL SIGQUIT
ENTRYPOINT ["sh", "/entrypoint.sh"]
