FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd --create-home chemezy && \
    mkdir -p /app/data && \
    chown -R chemezy:chemezy /app && \
    chmod +x /app/scripts/docker-entrypoint.sh

USER chemezy

EXPOSE 8000

ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
