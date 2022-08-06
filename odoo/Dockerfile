FROM odoo:15

USER root

## Get pos-addons for pos_printer_network
#RUN set -x; apt-get update \
#    && apt-get -y install --no-install-recommends git \
#    && rm -rf /var/lib/apt/lists/* \
#    && git clone --depth=1 -b 13.0 https://github.com/it-projects-llc/pos-addons.git \
#      /opt/posbox/pos-addons \
#    && git clone --depth=1 -b 13.0 https://github.com/camptocamp/odoo-cloud-platform.git \
#      /opt/posbox/cloud-addons \
#    && git clone --depth=1 -b 13.0 https://github.com/CybroOdoo/CybroAddons.git \
#      /opt/posbox/cybro-addons

COPY odoo.conf /etc/odoo/odoo.conf
#COPY addons/ /opt/posbox/extra-addons

#RUN chown -R odoo.odoo /opt/posbox

USER odoo
