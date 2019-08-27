FROM odoo:12

USER root

## Dependencies for iotbox
## See also https://github.com/odoo/odoo/blob/master/addons/point_of_sale/tools/posbox/overwrite_before_init/etc/init_posbox_image.sh
RUN set -x; apt-get update \
    && apt-get -y install --no-install-recommends \
      bluez \
      cups \
      cups-ipp-utils \
      dbus \
      gcc \
      git \
      libcups2-dev \
      python3-babel \
      python3-dateutil \
      python3-dbus \
      python3-decorator \
      python3-dev \
      python3-docutils \
      python3-feedparser \
      python3-gi \
      python3-html2text \
      python3-jinja2 \
      python3-ldap3 \
      python3-libsass \
      python3-lxml \
      python3-mako \
      python3-mock \
      python3-netifaces \
      python3-openid \
      python3-passlib \
      python3-pil \
      python3-pip \
      python3-psutil \
      python3-psycopg2 \
      python3-pydot \
      python3-pyparsing \
      python3-pypdf2 \
      python3-pyscard \
      python3-qrcode \
      python3-reportlab \
      python3-requests \
      python3-serial \
      python3-simplejson \
      python3-simplejson \
      python3-tz \
      python3-unittest2 \
      python3-urllib3 \
      python3-vatnumber \
      python3-werkzeug \
      python3-wheel \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /opt/posbox/addons \
    && chown -R odoo.odoo /opt/posbox \
    && mkdir /usr/lib/python3/dist-packages/odoo/addons/hw_drivers/drivers

RUN pip3 install \
      evdev \
      gatt \
      phonenumbers \
      polib \
      pycups \
      pyusb==1.0.0b1 \
      v4l2

# Add odoo.conf which sets addons path
COPY odoo.conf /etc/odoo/odoo.conf

## Get pos-addons for pos_printer_network
RUN git clone --depth=1 -b 12.0 https://github.com/it-projects-llc/pos-addons.git \
    /opt/posbox/addons \
 && git clone --depth=1 -b 12.0 https://github.com/camptocamp/odoo-cloud-platform.git \
    /opt/posbox/cloud-addons

## Apply some patches
COPY patches/*.patch /tmp/
# See https://bugs.launchpad.net/python-v4l2/+bug/1664158
RUN  patch -p0 /usr/local/lib/python3.5/dist-packages/v4l2.py < /tmp/python-v4l2-1664158-fix.patch \
     # Disable Bluetooth in driver, doesn't work in Docker and isn't needed for the PoS use-case
  && patch -p0 /usr/lib/python3/dist-packages/odoo/addons/hw_drivers/controllers/driver.py < /tmp/disable-bluetooth-driver.patch \
     # Start CUPS - IoTBox connects to it and complains if it isn't running
  && patch -p0 /entrypoint.sh < /tmp/start-cups.patch \
     # Strings must be UTF-8 for correct printing
  && patch -p0 /usr/lib/python3/dist-packages/odoo/addons/hw_escpos/escpos/printer.py < /tmp/utf8-to-printer.patch \
     # Disable log messages about disconnected drivers - unneeded and clutters logfile with useless messages
  && patch -p0 /usr/lib/python3/dist-packages/odoo/addons/hw_escpos/controllers/main.py < /tmp/disable-disconnected-logging.patch \
     # Add cashbox networking support
  && patch -p0 /opt/posbox/addons/hw_printer_network/controllers/hw_printer_network_controller.py < /tmp/cashbox-net.patch \
     # Remove fix from https://github.com/odoo/odoo/pull/35368 as this breaks network printing
  && patch -p0 /usr/lib/python3/dist-packages/odoo/addons/hw_escpos/escpos/escpos.py < /tmp/remove_get_printer_status.patch

## Cannot switch to Odoo as CUPS must run as root and CUPS must run - otherwise IoTBox complains
#USER odoo
