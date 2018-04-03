var block = require('Block');
var Player = require('Player');

cc.Class({
    extends: cc.Component,

    properties: {
        blockLayer:{
            default: null,
            type: cc.Node
        },
        blockList: {
            default: null,
            type: cc.Prefab
        },
        player: {
            default: null,
            type: cc.Node
        },
        leftOrgin: new cc.Vec2(),
        rightOrgin: new cc.Vec2(),
        scroe: 0,
        currBlock: null,
        nextBlock: null,
        falg: true,
        falgs: null,
        tan: 0.55
    },

    onLoad () {
       this.falgs = this.player.getComponent('Player');
    },
    reset () {
        this.blockLayer.removeAllChildren();
        // 加载第一个方块  根据位置
        let blockNode = cc.instantiate(this.blockList);
        this.blockLayer.addChild(blockNode);
        blockNode.opacity = 255;
        var block = blockNode.getComponent('Block');
        blockNode.position = this.blockLayer.parent.convertToNodeSpaceAR(this.leftOrgin);
        
        this.currBlock = block;

        // 下一个方块
        this.nextBlock = block;
        this.player.position = this.node.convertToNodeSpaceAR(this.currBlock.getComponent('Block').getCenterPosition());
        // 添加第二个方块
        this.addBlock();
    },
    addBlock () {
        let block = cc.instantiate(this.blockList);
        this.blockLayer.addChild(block);
        let blockNo = block.getComponent('Block');
        let achdis = Math.random()*200 + 200;
        let distance = this.player.getComponent('Player').disence;
        // 判断方向放置方块
        if(distance > 0){
            block.x = this.nextBlock.node.x + achdis;
            block.y = this.nextBlock.node.y + achdis*this.tan;
        } else {
            block.x = this.nextBlock.node.x - achdis;
            block.y = this.nextBlock.node.y + achdis*this.tan;
        }
        var action = cc.sequence(
            cc.moveTo(0.1, block.x, block.y+50),
            cc.moveTo(0.1, block.x, block.y),
            cc.moveTo(0.1, block.x, block.y+20),
            cc.moveTo(0.1, block.x, block.y)
        );
        block.runAction(action);
        block.opacity = 255;
        this.currBlock = this.nextBlock;
        this.nextBlock = blockNo;

        // 层级是反的。。。
        this.currBlock.node.zIndex = 1;
        this.nextBlock.node.zIndex = 0;
        
        return blockNo;
    },

    touchFun () {
        // 触发事件
        cc.find('Canvas').on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        cc.find('Canvas').on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },
    touchStart () {
        if(!this.falg){return false;}
        this.player.getComponent('Player').readyJumpF(); 
    },
    touchEnd () {
        if(!this.falgs.readyJump){return false;}
        this.falg = false;
        let jumpDistance = this.player.getComponent('Player').jumpDistance;
        let dir = this.player.getComponent('Player').disence;

        if(jumpDistance < 5){jumpDistance = 10;}
        let targetPos = cc.p(this.player.x + jumpDistance*dir, this.player.y + jumpDistance*this.tan);
        let targetWorldPos = this.player.parent.convertToWorldSpaceAR(targetPos);
        let formatPos = this.nextBlock.getComponent('Block').getAnchorLocation(targetWorldPos, dir);
        let formatPosThis = this.currBlock.getComponent('Block').getAnchorLocation(targetWorldPos, dir);

        if (formatPos !== null) {
            this.player.getComponent('Player').onJumpF(formatPos, ()=>{
                this.scroe += 5;
                cc.find('Canvas').getComponent('GameJs').scroe.string = 'scroe：' + this.scroe;
                // 分数增加动画
                this.nextBlock.getComponent('Block').scroeadd(5);
            },0);
        } else if(formatPosThis !== null) {
            this.player.getComponent('Player').onJumpF(targetWorldPos, ()=>{
                console.log('这里分数不变, 原方块移动');
            },1);
        } else {
            this.player.getComponent('Player').onJumpF(targetWorldPos, ()=>{
                cc.find('Canvas/overPlan').getComponent('Overplan').scroe.string = this.scroe;
                cc.find('Canvas').getComponent('GameJs').gameOver();
                this.scroe =0;
            },2);
        }
    },
    updateStage () {
        // 更新场景
        let that = this;
        let moveVector;
        // 获取当前棋子所在坐标
        let playerWorldPos = this.node.convertToWorldSpaceAR(this.player.position);
        if(this.player.getComponent('Player').disence > 0) {
            moveVector = cc.pSub(playerWorldPos,this.leftOrgin);
        }else {
            moveVector = cc.pSub(playerWorldPos,this.rightOrgin);
        }
        let finished = cc.callFunc(function(){
            that.addBlock();
            that.falg = true;
        });
        
        let action = cc.sequence(cc.moveTo(0.5,cc.pSub(this.node.position,moveVector)) ,finished);
        this.node.runAction(action);
    },
    disableTouch() {
        cc.find("Canvas").targetOff(this);
        cc.systemEvent.targetOff(this);
    },
    start () {

    },

    // update (dt) {},
});
