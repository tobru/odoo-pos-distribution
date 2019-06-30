# Odoo IoT Bock in Docker

Dockerfiles and Docker Compose configuration for running Odoo IoT Box in Docker.

Additionally it contains  [pos-addons](https://github.com/it-projects-llc/pos-addons)
for using receipt printers over the network.

## Quickstart

1. `docker-compose up`
1. Connect to Odoo and create a new database
1. Install Odoo Apps:
  * "Point of Sale"
  * "POS Network Printer"
1. (Enable "Developer mode" under Odoo settings)
1. Configure PoS for IoT Box (see docs/iotbox-config.png)
1. Configure Order Printer (see docs/orderprinter.png)

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

## Notes

* Connection from PoS Tablet to IoT Box is a direct connection, not via Odoo server!
* Support for opening the cashbox via network printer has been patched. The IP is hardcoded
  to 192.168.233.3. See [0c6ecfdd](https://github.com/tobru/posbox-docker/commit/0c6ecfdd470dad07b9f9c26ecc0fd413c6d605b1)
  and [#730](https://github.com/it-projects-llc/pos-addons/issues/730).
