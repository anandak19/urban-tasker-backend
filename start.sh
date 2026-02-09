#!/bin/bash
set -e

export $(aws ssm get-parameters-by-path \
  --path "/prod/myapp" \
  --with-decryption \
  --region ap-south-1 \
  --query "Parameters[*].[Name,Value]" \
  --output text | sed 's#.*/##' | awk '{print $1"="$2}')

docker compose -f docker-compose.yml up -d