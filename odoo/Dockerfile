FROM odoo:12

USER root

RUN apt-get update \
    && apt-get -y install --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /opt/posbox/addons \
    && chown -R odoo.odoo /opt/posbox

USER odoo

## Get pos-addons for pos_printer_network
RUN git clone --depth=1 -b 12.0 https://github.com/it-projects-llc/pos-addons.git \
    /opt/posbox/addons

COPY odoo.conf /etc/odoo/odoo.conf
#COPY bootstrap.min.js /usr/lib/python3/dist-packages/odoo/addons/web/static/lib/bootstrap/js/
