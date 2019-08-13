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
        printChanges: function(){
            var printers = this.pos.printers;
            for(var i = 0; i < printers.length; i++){
                var changes = this.computeChanges(printers[i].config.product_categories_ids);
                if ( changes['new'].length > 0 || changes['cancelled'].length > 0){
                    var number = changes.name.split(' ')[1].split('-').pop()
                    changes['order_number'] = Number(number).toString()
                    var order = this.pos.get_order()
                    if (order) {order.set_big_number(true);}
                    var receipt = QWeb.render('OrderChangeReceipt',{changes:changes, widget:this});
                    printers[i].print(receipt);
                }
            }
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
