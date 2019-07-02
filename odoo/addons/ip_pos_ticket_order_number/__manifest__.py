# -*- coding: utf-8 -*-
{
    'name': 'POS Tickets Order Number',
    'summary': "POS Tickets Order Number",
    'description': """POS Tickets Order Number""",

    'author': 'iPredict IT Solutions Pvt. Ltd.',
    'website': 'http://ipredictitsolutions.com',
    "support": "ipredictitsolutions@gmail.com",

    'category': 'Point of Sale',
    'version': '12.0.0.1.0',
    'depends': ['pos_restaurant'],

    'data': [
        'views/assets.xml',
    ],
    'qweb': [
        'static/src/xml/pos.xml',
    ],

    'license': "OPL-1",

    'installable': True,
    'application': True,
}
