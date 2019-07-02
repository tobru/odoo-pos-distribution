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
            var recipt = this._super();
            var number = recipt.order.name.split(' ')[1].split('-').pop()
            recipt['order_number'] = Number(number).toString();
            return recipt;
        }
    });

    var _super_order = Models.Order.prototype;
    Models.Order = Models.Order.extend({
        computeChanges: function(categories){
            var res = _super_order.computeChanges.apply(this, categories)
            var number = res.name.split(' ')[1].split('-').pop()
            res['order_number'] = Number(number).toString()
            return res
            
        },
        export_for_printing: function(){
            var res = _super_order.export_for_printing.apply(this);
            var number = this.name.split(' ')[1].split('-').pop()
            res['order_number'] = Number(number).toString();
            return res;
        },
    });

});
