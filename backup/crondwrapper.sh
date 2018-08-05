#!/usr/bin/env bash

echo "${BACKUP_SCHEDULE} resticbackup.sh >> /var/log/cron.log 2>&1" > /etc/crontabs/root

# start cron
default_crontabs_dir=/etc/crontabs
crond -L /var/log/cron.log -c ${CRONTABS_DIR:-$default_crontabs_dir}

# trap SIGINT and SIGTERM signals and gracefully exit
trap "echo \"stopping cron\"; kill \$!; exit" SIGINT SIGTERM

# start "daemon"
while true
do
    cat /var/log/cron.log & wait $!
done
