# -*- coding: utf-8 -*-

from odoo import fields, models, api


class ProductProduct(models.Model):
    _inherit = "product.product"
    _order = 'pos_sequence, default_code, name, id'

class ProductTemplate(models.Model):
    _inherit = "product.template"
    _order = 'pos_sequence, name'

    pos_sequence = fields.Integer(string='POS Sequence', help='POS product display base on product sequence number')

    @api.model
    def create(self, vals):
        res = super(ProductTemplate, self).create(vals)
        if res:
            rec = self.search([])
            if rec:
                seq = max(self.search([]).mapped('pos_sequence'))
                if seq:
                    res.pos_sequence = seq + 1;
        return res