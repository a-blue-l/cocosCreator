var Stage = require('stage');

cc.Class({
    extends: cc.Component,

    properties: {
        stage: {
            default: null,
            type: cc.Node
        },
        mask: {
            default: null,
            type: cc.Node
        },
        scroe: {
            default: null,
            type: cc.Label
        }
    },

    onLoad () {
        
    },

    start () {
        //  加载第一个方块
        this.stage.getComponent(Stage).reset();
        // 绑定事件
        this.stage.getComponent(Stage).touchFun();
    },
    gameOver(){
        this.stage.getComponent('stage').disableTouch();
        this.mask.getComponent('Overplan').show();
    },
    onRestart() {
        // 重新加载场景
        this.scroe.string = 'scroe：0';
        cc.director.loadScene("game");
    }
    // update (dt) {},
});
