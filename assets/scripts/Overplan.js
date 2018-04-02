cc.Class({
    extends: cc.Component,

    properties: {
        onceBtn: {
            default: null,
            type: cc.Node
        },
        scroe:{
            default: null,
            type: cc.Label
        }
    },

    onLoad () {
        var that = this;
        this.hide();
        this.onceBtn.on(cc.Node.EventType.TOUCH_END, function(){
            that.hide();
            cc.find('Canvas').getComponent('GameJs').onRestart();
        })
    },

    start () {

    },
    show(){
        // 弹层出现
        this.node.active = true;
    },
    hide () {
        this.node.active = false;
    }
    // update (dt) {},
});
