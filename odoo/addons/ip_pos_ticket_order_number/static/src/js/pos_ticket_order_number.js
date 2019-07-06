odoo.define('ip_pos_ticket_order_number.pos_ticket_order_number', function (require) {
"use strict";

    var Screens = require('point_of_sale.screens');
    var MultiPrint = require('pos_restaurant.multiprint');
    var Models = require('point_of_sale.models');
    var PopUpWidget=require('point_of_sale.popups');
    var Gui = require('point_of_sale.gui');
    var core = require('web.core');
    var QWeb = core.qweb;
    var _t  = core._t;

    Screens.ReceiptScreenWidget.include({
        get_receipt_render_env: function() {
            var receipt = this._super();
            var number = receipt.order.name.split(' ')[1].split('-').pop()
            receipt['order_number'] = Number(number).toString();
            receipt['big_number'] = receipt.order.big_number;
            return receipt;
        }
    });

    var _super_order = Models.Order.prototype;
    Models.Order = Models.Order.extend({
        initialize: function() {
            _super_order.initialize.apply(this,arguments);
            if (typeof this.big_number === 'undefined') {
                this.big_number = false;
            } 
        },
        computeChanges: function(categories){
            var res = _super_order.computeChanges.apply(this, categories)
            var number = res.name.split(' ')[1].split('-').pop()
            res['order_number'] = Number(number).toString()
            return res

        },
        printChanges: function(){
            var orders = _super_order.printChanges.call(this);
            var order = this.pos.get_order()
            if (order) {
                order.set_big_number(true);
            }
            return orders
        },
        set_big_number: function(val){
            this.big_number = val;
            this.trigger('change',this);
        },
        init_from_JSON: function(json) {
            _super_order.init_from_JSON.apply(this,arguments);
            this.big_number = json.big_number;
        },
        export_as_JSON: function() {
            var json = _super_order.export_as_JSON.apply(this,arguments);
            json.big_number = this.big_number;
            return json;
        },
    });
});
