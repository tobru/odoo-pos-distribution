#!/usr/bin/env bash

set -x

echo "[$(date)] Starting backup"

# Dump Postgres DB - parameters are read from env vars
pg_dump -Fc > /data/odoo_data.dump

# Backup data with restic
restic backup --hostname posbox /data
restic forget --prune --keep-last 10

echo "[$(date)] Backup ended"
