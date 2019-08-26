odoo.define('pos_product_sequence.models', function (require) {
"use strict";

var models = require('point_of_sale.models');
var core = require('web.core');

var QWeb = core.qweb;
var _t = core._t;
var PosDB = require('point_of_sale.DB')
var exports = require('point_of_sale.models');

PosDB.include({
    get_product_by_category: function(category_id){
        var product_ids  = this.product_by_category_id[category_id];
        var list = [];
        if (product_ids) {
            for (var i = 0, len = Math.min(product_ids.length, this.limit); i < len; i++) {
                list.push(this.product_by_id[product_ids[i]]);
            }
        }
        if(list.length){
            var new_list = _.sortBy(list, function(num) { 
                    return num.pos_sequence; 
            });
            return new_list;
        }
        return list;
    },
});

models.load_models({
        model:  'product.product',
        // todo remove list_price in master, it is unused
        fields: ['display_name', 'list_price', 'lst_price', 'standard_price', 'categ_id', 'pos_categ_id', 'taxes_id',
                 'barcode', 'default_code', 'to_weight', 'uom_id', 'description_sale', 'description',
                 'product_tmpl_id','tracking','pos_sequence'],
        order:  _.map(['pos_sequence','sequence','default_code','name'], function (name) { return {name: name}; }),
        domain: [['sale_ok','=',true],['available_in_pos','=',true]],
        context: function(self){ return { display_default_code: false }; },
        loaded: function(self, products){
            var using_company_currency = self.config.currency_id[0] === self.company.currency_id[0];
            var conversion_rate = self.currency.rate / self.company_currency.rate;
            self.db.add_products(_.map(products, function (product) {
                if (!using_company_currency) {
                    product.lst_price = round_pr(product.lst_price * conversion_rate, self.currency.rounding);
                }
                product.categ = _.findWhere(self.product_categories, {'id': product.categ_id[0]});
                return new exports.Product({}, product);
            }));
        },
    });
return exports;

});