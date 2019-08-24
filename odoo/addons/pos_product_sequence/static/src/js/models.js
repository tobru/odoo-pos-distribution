odoo.define('pos_product_sequence.models', function (require) {
"use strict";

var models = require('point_of_sale.models');
var core = require('web.core');

var QWeb = core.qweb;
var _t = core._t;
var exports = require('point_of_sale.models');

models.load_models({
        model:  'product.product',
        fields: ['display_name', 'list_price', 'standard_price', 'categ_id', 'pos_categ_id', 'taxes_id',
                 'barcode', 'default_code', 'to_weight', 'uom_id', 'description_sale', 'description',
                 'product_tmpl_id','tracking'],
        order:  _.map(['pos_sequence','sequence','default_code','name'], function (name) { return {name: name}; }),
        domain: [['sale_ok','=',true],['available_in_pos','=',true]],
        context: function(self){ return { display_default_code: false }; },
        loaded: function(self, products){
            self.db.add_products(_.map(products, function (product) {
                product.categ = _.findWhere(self.product_categories, {'id': product.categ_id[0]});
                return new exports.Product({}, product);
            }));
        },
    });
return exports;
});