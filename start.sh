#!/bin/bash
set -e

export REDIS_PASS=$(aws ssm get-parameter \
  --name "/ut/dev/REDIS_PASS" \
  --query "Parameter.Value" \
  --output text)

docker compose -f docker-compose.yml up -d
