FROM alpine:latest

ENV RESTIC_VERSION=0.9.1 \
    RCLONE_VERSION=1.42

RUN set -x; wget -O /tmp/restic.bz2 https://github.com/restic/restic/releases/download/v${RESTIC_VERSION}/restic_${RESTIC_VERSION}_linux_arm.bz2 && \
    bzip2 -d /tmp/restic.bz2 && \
    mv /tmp/restic /usr/local/bin/restic && \
    chmod +x /usr/local/bin/restic

RUN set -x; wget -O /tmp/rclone.zip https://downloads.rclone.org/v${RCLONE_VERSION}/rclone-v${RCLONE_VERSION}-linux-arm.zip && \
    unzip /tmp/rclone.zip && \
    mv rclone-v${RCLONE_VERSION}-linux-arm/rclone /usr/local/bin/rclone && \
    chmod +x /usr/local/bin/rclone && \
    rm -rf rclone-* /tmp/rclone.zip && \
    mkdir -p /root/.config/rclone && \
    touch /root/.config/rclone/rclone.conf

RUN apk add --no-cache bash ca-certificates postgresql && \
    mkfifo -m 0666 /var/log/cron.log && \
    ln -s /var/log/cron.log /var/log/crond.log

ADD crondwrapper.sh resticbackup.sh /usr/local/bin/

ENTRYPOINT ["crondwrapper.sh"]
