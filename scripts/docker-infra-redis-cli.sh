#!/usr/bin/env bash

set -e

docker container run \
    --rm \
    --tty \
    --interactive \
    --network showcase--network--default \
    redis:7.4.0-alpine3.20 \
        redis-cli \
            -h showcase--redis \
            -p 6379
