cc.Class({
    extends: cc.Component,

    properties: {
        leftOrigin: {
            default: [],
            type: cc.Node
        },
        rightOrigin: {
            default: [],
            type: cc.Node
        },
        centerOrigin: {
            default: [],
            type: cc.Node
        },
        centerAnchor: {
            default: null,
            type: cc.Node
        },
        scroe: {
            default: null, 
            type: cc.Label
        }
    },

    // onLoad () {},

    start () {

    },
    getCenterPosition () 
    {
        // 获取中心点坐标
        return this.centerAnchor.parent.convertToWorldSpaceAR(this.centerAnchor.position);
    },
    getAnchorLocation (worldPos, direction) {
        //求出距离某个点最近
        let localPos = this.node.convertToNodeSpaceAR(worldPos);//获取当前棋子的坐标
        let anchorList = direction>0?this.rightOrigin:this.leftOrigin;  //如果朝右，选择向右数组 反之选择向左数组
        let nearAnchor = anchorList[0];//默认当前数组第一位为最近
        for (var i=1; i<anchorList.length; i++) {
            // 遍历当前节点数组
            if (cc.pDistance(anchorList[i].position, localPos) < cc.pDistance(nearAnchor.position, localPos)) {
                nearAnchor = anchorList[i];//更改目前最近节点
            }
        }
        if(cc.pDistance(nearAnchor.position, localPos)<=50) {
            return nearAnchor.parent.convertToWorldSpaceAR(nearAnchor.position);
        }else{
            return null;
        }
    },
    scroeadd (scroe) {
        // 分数增加
        this.scroe.string = '+'+scroe;
        this.scroe.node.opacity = 255;
        this.scroe.getComponent(cc.Animation).play();
    }
    // update (dt) {},
});
