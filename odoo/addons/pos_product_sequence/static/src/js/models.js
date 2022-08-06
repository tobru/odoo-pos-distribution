odoo.define('pos_product_sequence.models', function(require) {
    "use strict";

    var models = require('point_of_sale.models');
    var core = require('web.core');

    var QWeb = core.qweb;
    var _t = core._t;
    var PosDB = require('point_of_sale.DB');
    const Registries = require('point_of_sale.Registries');
    const ProductsWidget = require('point_of_sale.ProductsWidget');

    PosDB.include({
        get_product_by_category: function(category_id) {
            var product_ids = this.product_by_category_id[category_id];
            var list = [];
            if (product_ids) {
                for (var i = 0, len = Math.min(product_ids.length, this.limit); i < len; i++) {
                    list.push(this.product_by_id[product_ids[i]]);
                }
            }
            if (list.length) {
                var new_list = _.sortBy(list, function(num) {
                    return num.pos_sequence;
                });
                return new_list;
            }
            return list;
        },
    });

    models.PosModel.prototype.models.some(function(model) {
        if (model.model !== 'product.product') {
            return false;
        }
        // add name and attribute_value_ids to list of fields
        // to fetch for product.product
        ['pos_sequence'].forEach(function(field) {
            if (model.fields.indexOf(field) == -1) {
                model.fields.push(field);
            }
        });
        model['order'] = _.map(['pos_sequence', 'sequence', 'default_code', 'name'], function(name) { return { name: name }; });
        return true; //exit early the iteration of this.models
    });

    const BiProductsTemplateWidget = (ProductsWidget) =>
        class extends ProductsWidget {
            constructor() {
                super(...arguments);
            }

            get productsToDisplay() {
                let list = [];
                if (this.searchWord !== '') {
                    list = this.env.pos.db.search_product_in_category(
                        this.selectedCategoryId,
                        this.searchWord
                    );
                } else {
                    list = this.env.pos.db.get_product_by_category(this.selectedCategoryId);
                }
                return list
            }
        };

    Registries.Component.extend(ProductsWidget, BiProductsTemplateWidget);

    return ProductsWidget;
});