# -*- coding: utf-8 -*-

from odoo import fields, models


class ProductProduct(models.Model):
    _inherit = "product.product"
    _order = 'pos_sequence, default_code, name, id'


class ProductTemplate(models.Model):
    _inherit = "product.template"
    _order = 'pos_sequence, name'

    pos_sequence = fields.Integer(string='POS Sequence', help='POS product display base on product sequence number')
