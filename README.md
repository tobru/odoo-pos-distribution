# Odoo PosBox in Docker

Dockerfiles and Docker Compose configuration for running
Odoo PosBox in Docker. It additionally contains 
[pos-addons](https://github.com/it-projects-llc/pos-addons)
for using receipt printers over the network.

## Backup configuration

Example contents of `backup.env`:

```
RESTIC_REPOSITORY=rclone:myremote:posbackup
RESTIC_PASSWORD=extremelysecurepassword
RCLONE_CONFIG_FWUCLOUD_TYPE=webdav
RCLONE_CONFIG_FWUCLOUD_URL=https://nextcloud.example.com/remote.php/webdav/
RCLONE_CONFIG_FWUCLOUD_VENDOR=nextcloud
RCLONE_CONFIG_FWUCLOUD_USER=backupuser
RCLONE_CONFIG_FWUCLOUD_PASS=encryptedpassword
PGDATABASE=odoodbname
```

Restore of DB:

```
createdb -T template0 restoretest
pg_restore -d restoretest /data/odoo_data.dump
```
