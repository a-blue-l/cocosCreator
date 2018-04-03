cc.Class({
    extends: cc.Component,

    properties: {
        disence: 1,
        readyJump: false,
        isjump: false,
        speed:0,
        jumpDistance: 0,
        power: 600
    },

    // onLoad () {},

    start () {

    },

    readyJumpF () {
        if(!this.readyJump){
            cc.find("rotateAchor/player",this.node).runAction(cc.scaleTo(2,1,0.7));
            this.readyJump = true;
        }
    },
    onJumpF (worpos, cb, type) {
        if(this.isjump){return}
        // 开始起跳
        this.isjump = true;
        let that = this;
        // 首先停止一切行动然后缓慢变形
        cc.find("rotateAchor/player",this.node).stopAllActions();
        var reactFun = cc.scaleTo(0.1, 1, 1);
        let targetPos = this.node.parent.convertToNodeSpaceAR(worpos);//转换为相对位置
        // 跳跃的方式到指定地点
        var jumpPos = cc.jumpTo(0.5, targetPos, 200, 1);
        // 跳跃360度
        var rotatePos = cc.rotateBy(0.5, 360*this.disence);
        // 回调
        let finshied = cc.callFunc(function(){
            that.isjump = false;//是否在跳跃过程中
            that.readyJump = false;//是否准备起跳
            that.speed = 0;
            that.jumpDistance = 0;
            if(type === 0){
                that.disence = Math.random()>0.5?1:-1;
                that.node.parent.getComponent('stage').updateStage();
            } else if(type === 1) {
                that.node.parent.getComponent('stage').falg = true;
            }
            cb();
        })
        cc.find("rotateAchor/player",this.node).runAction(reactFun);
        cc.find("rotateAchor",this.node).runAction(rotatePos);
        this.node.runAction(cc.sequence(jumpPos, finshied));
    },
    update (dt) {
        if (this.readyJump) {
            this.speed += dt * this.power;
            this.jumpDistance += this.speed * dt;
        }
    },
});
