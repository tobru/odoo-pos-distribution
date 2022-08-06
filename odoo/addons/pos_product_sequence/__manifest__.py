# -*- coding: utf-8 -*-
# Powered by Kanak Infosystems LLP.
# © 2020 Kanak Infosystems LLP. (<https://www.kanakinfosystems.com>)

{
    'name': 'POS Product Sequence',
    'version': '15.0.1.0',
    'summary': 'POS Product Sequence module is used in Odoo POS to display the products position in POS Session according to the sequence or numbers assigned. If you have 5 products in backend and you want to set its sequence from 1 to 5, then same sequence wise product show in POS Session in odoo.',
    'description': """
    Point of Sale Product Sequence
    """,
    'license': 'OPL-1',
    'author': 'Kanak Infosystems LLP.',
    'website': 'https://www.kanakinfosystems.com',
    'images': ['static/description/banner.jpeg'],
    'category': 'Sales/Point of Sale',
    'depends': ['point_of_sale'],
    'data': [
        'views/knk_pos_product_sequence_views.xml',
    ],
    'assets': {
        'point_of_sale.assets': [
            'pos_product_sequence/static/src/js/models.js',
        ],
    },
    'sequence': 1,
    'installable': True,
    'application': False,
    'auto_install': False,
    'price': 10,
    'currency': 'EUR',
    'live_test_url': 'https://youtu.be/pYVNy3A3ieE',
}
