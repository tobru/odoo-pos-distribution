# Odoo Pos Distribution

Dockerfiles, Docker Compose and Kubernetes configuration for running an Odoo based PoS
in container and Kubernets.

## Quickstart

### Docker Compose

1. `docker-compose up`

Continue with "Odoo PoS configuration"

### Kubernetes / K3s

The provided YAML files have been developed and tested with [k3s](https://k3s.io/) on amd64 and arm64.
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

## Odoo Addons

The default addons from Odoo core are not enough for a smooth PoS experience,
therefore a good amount of other PoS addons can be used. This distributions adds
the following addon sources:

* [pos-addons](https://github.com/it-projects-llc/pos-addons):
  * `hw_printer_network` && `pos_printer_network`: Support for network receipt printer
* [odoo-cloud-platform](https://github.com/camptocamp/odoo-cloud-platform):
  * `monitoring_status`: Status endpoint for Odoo
* [CybroAddons](https://github.com/CybroOdoo/CybroAddons):
  * `pos_product_category_filter`: Only show selected product categories on the PoS view

The following addons are delivered in this repository:

* `ip_pos_ticket_order_number`: Custom made module to print a big order number both on
  the receipt and kitchen order
* `pos_product_sequence`: Commercial module to manually order products (default is
  alphabetically). You're not allowed to use this module unless you bought it as
  well. See [POS Product Sequence](https://apps.odoo.com/apps/modules/12.0/pos_product_sequence/)
  on the Odoo app store.

## Hardware and Networking

* Default network assumed: `192.168.233.0/24`
* Printers: 192.168.233.3 and 192.168.233.5
* Printers used in this project: [Epson TM-T20II](https://www.epson.ch/products/sd/pos-printer/epson-tm-t20ii)

More hardware description and a network diagram: tbd.

## Monitoring

There are two kinds of monitoring prepared: The cluster itself and the PoS
application.

### Simple Cluster Healthcheck

Under `contrib/healthchecks-cronjob.yaml` a simple Kubernetes cronjob is
provided which regularly pings [Healthchecks.io](https://healthchecks.io/).

A secret with the ping URL needs to be added before the CronJobs does it's work:

```
kubectl -n posmon create secret generic healthchecks-io --from-literal=HCURL=https://hc-ping.com/MYUUID
```

### Application and network monitoring

Application monitoring is done using Prometheus, Alertmanager and
Blackbox exporter. No application specific exporters are used, so
it's just a base monitoring to answer the question: "Is it up?".

1. Install [prometheus-operator](https://github.com/coreos/prometheus-operator)
   F.e.: `kubectl apply -f https://raw.githubusercontent.com/coreos/prometheus-operator/master/bundle.yaml`
2. Apply manifests: `kubectl apply -f contrib/posmon/`
3. Create secret for extra scrape config:
   `kubectl -n posmon create secret generic additional-scrape-configs --from-file=contrib/pos-blackbox-exporter-scrape.yaml`
4. Create secret for Alertmanager config:
   `kubectl -n posmon create secret generic alertmanager-posmon --from-file=contrib/alertmanager.yaml`

## Backup

Backup is done using [K8up](https://k8up.io/).

1. Install K8up
2. Apply manifests under `contrib/backup`

### Restore

tbd...


```
createdb -T template0 restoretest
pg_restore -d restoretest /data/odoo_data.dump
```

## Notes

* Connection from PoS Tablet to IoT Box is a direct connection, not via Odoo server!
* Support for opening the cashbox via network printer has been patched. The IP is hardcoded
  to 192.168.233.3. See [0c6ecfdd](https://github.com/tobru/posbox-docker/commit/0c6ecfdd470dad07b9f9c26ecc0fd413c6d605b1)
  and [#730](https://github.com/it-projects-llc/pos-addons/issues/730).

## Docker Images

Docker images are automatically built on [Docker Hub](https://cloud.docker.com/repository/docker/tobru/odoo-pos) (for amd64 arch).

* `docker.io/tobru/odoo-pos:latest-iotbox`: IoT Box
* `docker.io/tobru/odoo-pos:latest-pos`: Odoo

## A word on ARM / Raspberry Pi support

TL;DR: It's not easy to run things out of the box on Raspberry Pi.

Images for ARM64 (f.e. Raspberry Pi) are _not_ automatically built as this
is not supported by Docker Hub. They are built manually on a Raspberry Pi
and uploaded to Docker Hub.

* `docker.io/tobru/odoo-pos:latest-iotbox-arm64v7`: IoT Box
* `docker.io/tobru/odoo-pos:latest-pos-arm64v7`: Odoo

As the [upstream Odoo](https://hub.docker.com/_/odoo/) doesn't support
`linux/arm/v7` even the base image needs to be built on the Raspberry Pi:

1. Clone https://github.com/odoo/docker
2. Change `wkhtmltox` to install `raspbian.stretch_armhf.deb`
3. Build with `docker build -t local/odoo:12 .`
4. Patch local Dockerfiles to use this as base image

A good amount of upstream stuff doesn't work on Raspberry Pi as no multiarch
images are provided. F.e. the proposed monitoring stack with Prometheus doesn't
work out of the box and K8up doesn't provide arm binaries (yet).

The Postgres client installed in the Odoo images is version 9.6 (it's based
on Debian Stretch and upstream doesn't provide `armhf` packages).
If you're using a newer Postgres version, the DB management functionality of
Odoo (Backup/Restore) won't work because of version mismatch.

## TODOs

### Distribution

* [ ] Pre-install `monitoring_status` and use for K8s probes
* [ ] Point Blackbox Monitoring to `/monitoring/status`
* [ ] Tweak monitoring rules
* [ ] Mirror important add-ons to this repository
* [ ] Configure `server_wide_modules` (instead of using command line parameters)
  * [ ] Odoo: `base,web,monitoring_status`
  * [ ] Automatically install PoS modules
* [ ] Improve arm builds and overall support (Monitoring, Backup)
* [ ] Support for adding third-party commercial Odoo addons

### PoS Usage

* [ ] Configure default payment option
* [ ] Don't open cash drawer for virtual payment (Twint, SumUp)
* [ ] Possibility to print a kitchen order ticket per position (not summarized)

## Disclaimer

This is a hobby project and is not actively maintained. I don't provide _any_
support! If you feel like contributing something, that's of course appreciated.
Feel free to open a Pull Request.
