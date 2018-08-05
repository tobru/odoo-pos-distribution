FROM golang:1.10-alpine

RUN set -x; apk add --no-cache git build-base && \
    go get -v -u github.com/sourcegraph/checkup/cmd/checkup && \
    mkdir -p /opt/checkup

WORKDIR /opt/checkup
