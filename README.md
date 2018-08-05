# Odoo PosBox in Docker

Dockerfiles and Docker Compose configuration for running
Odoo PosBox in Docker. It additionally contains 
[pos-addons](https://github.com/it-projects-llc/pos-addons)
for using receipt printers over the network.

## Running on Raspberry Pi

The official Docker images of Odoo are not multi-arch
compatible, the image needs to be rebuilt on arm.

1. Change the `FROM` in the [Dockerfile](https://github.com/odoo/docker/blob/master/11.0/Dockerfile) to
`FROM armhf/debian:stretch` and build it as `local/odoo:11`.
1. Change the `FROM` in [odoo/Dockerfile](odoo/Dockerfile) to
   `local/odoo:11`.

Corresponding issue on GitHub: [Support for ARM64v8 #195](https://github.com/odoo/docker/issues/195).

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
