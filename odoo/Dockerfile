FROM odoo:12

USER root

COPY addons/ /opt/posbox/extra-addons

RUN set -x; apt-get update \
    && apt-get -y install --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /opt/posbox/pos-addons \
    && chown -R odoo.odoo /opt/posbox

USER odoo

## Get pos-addons for pos_printer_network
RUN set -x; git clone --depth=1 -b 12.0 https://github.com/it-projects-llc/pos-addons.git \
    /opt/posbox/pos-addons

COPY odoo.conf /etc/odoo/odoo.conf
