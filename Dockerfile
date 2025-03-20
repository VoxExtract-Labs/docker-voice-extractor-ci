# Base image with essential dependencies
FROM debian:bullseye-slim AS base

# Install required runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl wget unzip supervisor mariadb-server mariadb-client redis-server \
    ffmpeg ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Ensure the MySQL user exists
RUN groupadd -r mysql || true && useradd -r -g mysql mysql || true

# Multi-stage build for Bun
FROM base AS bun-builder
RUN curl -fsSL https://bun.sh/install | bash && ln -s /root/.bun/bin/bun /usr/local/bin/bun

# Multi-stage build for Mailhog
FROM base AS mailhog-builder
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && \
    wget -O /mailhog https://github.com/mailhog/MailHog/releases/download/v1.0.1/MailHog_linux_amd64 && chmod +x /mailhog

# Multi-stage build for MinIO
FROM base AS minio-builder
RUN wget -O /minio https://dl.min.io/server/minio/release/linux-amd64/minio && chmod +x /minio

# Multi-stage build for Python 3.11
FROM base AS python-builder
WORKDIR /tmp

# Install dependencies required for building Python
RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl-dev zlib1g-dev libncurses5-dev \
    libncursesw5-dev libreadline-dev libsqlite3-dev libgdbm-dev \
    libdb5.3-dev libbz2-dev libexpat1-dev liblzma-dev tk-dev \
    uuid-dev libffi-dev gcc make && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Download and build Python 3.11
RUN wget --progress=bar:force:noscroll https://www.python.org/ftp/python/3.11.6/Python-3.11.6.tgz && \
    tar xzf Python-3.11.6.tgz && cd Python-3.11.6 && \
    ./configure --enable-optimizations && make -j$(nproc) && make altinstall && \
    cd .. && rm -rf Python-3.11.6 Python-3.11.6.tgz

# Remove unnecessary build dependencies
RUN apt-get remove -y gcc make && apt-get autoremove -y && apt-get clean

# Final image with only necessary dependencies
FROM base

# Copy Python from builder stage
COPY --from=python-builder /usr/local /usr/local

# Ensure Python is correctly symlinked
RUN ln -sf /usr/local/bin/python3.11 /usr/bin/python && ln -sf /usr/local/bin/pip3.11 /usr/bin/pip

# Copy binaries from multi-stage builds
COPY --from=bun-builder /usr/local/bin/bun /usr/local/bin/bun
COPY --from=mailhog-builder /mailhog /usr/local/bin/mailhog
COPY --from=minio-builder /minio /usr/local/bin/minio

# Copy Supervisor configuration file
COPY config/supervisord.conf /etc/supervisor/supervisord.conf

# Copy the MySQL startup script
COPY config/start-mysql.sh /usr/local/bin/start-mysql.sh
RUN chmod +x /usr/local/bin/start-mysql.sh

# Copy the container entrypoint script
COPY config/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy Redis configuration file
COPY config/redis.conf /etc/redis/redis.conf

# Ensure necessary directories exist before setting ownership
RUN mkdir -p /run/mysqld /var/lib/mysql /var/lib/redis /var/lib/mailhog /minio/data \
    && chown -R mysql:mysql /var/lib/mysql /run/mysqld \
    && chown -R redis:redis /var/lib/redis \
    && chown -R nobody:nogroup /var/lib/mailhog \
    && chown -R nobody:nogroup /minio/data
RUN mkdir -p /var/log/mysql /var/log/redis /var/log/mailhog /var/log/minio \
    && chown -R mysql:mysql /var/log/mysql \
    && chown -R redis:redis /var/log/redis \
    && chown -R nobody:nogroup /var/log/mailhog /var/log/minio

# Set working directory
WORKDIR /workspace

# Copy and install Python dependencies efficiently
COPY ./config/requirements.txt /workspace/requirements.txt
#RUN pip install --no-cache-dir -r /workspace/requirements.txt

# Copy the service check script
COPY config/check-services.sh /usr/local/bin/check-services.sh
RUN chmod +x /usr/local/bin/check-services.sh

# Expose necessary ports
EXPOSE 3306 6379 1025 8025 9000 9001

# Set entrypoint
CMD ["/usr/local/bin/docker-entrypoint.sh"]
