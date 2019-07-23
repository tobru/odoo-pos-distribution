# Odoo Pos Distribution

Dockerfiles, Docker Compose and Kubernetes configuration for running an Odoo based PoS
in container and Kubernets.

Additionally it contains  [pos-addons](https://github.com/it-projects-llc/pos-addons)
for using receipt printers over the network.

## Quickstart

### Docker Compose

1. `docker-compose up`

Continue with "Odoo PoS configuration"

### Kubernetes / K3s

The provided YAML files have been developed and tested with [k3s](https://k3s.io/).
Installation will happen in the namespace `pos`.

1. Install [k3s](https://k3s.io/) (any other Kubernetes should work as well)
1. Install [local-path-provisioner](https://github.com/rancher/local-path-provisioner)
1. Apply the deployment YAMLs: `kubectl apply -f deployment/`

Continue with "Odoo PoS configuration"

## Odoo PoS configuration

1. Connect to Odoo and create a new database
   On Kubernetes the Ingress defines the hostnames `pos` and `iotbox`
1. Install Odoo Apps:
  * "Point of Sale"
  * "POS Network Printer"
1. (Enable "Developer mode" under Odoo settings)
1. Configure PoS for IoT Box (see docs/iotbox-config.png)
1. Configure Order Printer (see docs/orderprinter.png)

## Hardware and Networking

* Default network assumed: `192.168.233.0/24`
* Printers: 192.168.233.3 and 192.168.233.5
* Printers used in this project: [Epson TM-T20II](https://www.epson.ch/products/sd/pos-printer/epson-tm-t20ii)

More hardware description and a network diagram: tbd.

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
