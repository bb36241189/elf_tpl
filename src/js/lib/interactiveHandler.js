/**
 * Created by Administrator on 2017/10/13 0013.
 */
var pressbtnHandler = function () {

};
pressbtnHandler.prototype = {
    handler : function (triggerClick) {
        $('[s-pressbtn]').each(function (index,ele) {
            var $ele = $(ele);
            $ele.css({
                background : 'url('+$ele.attr('bg')+') no-repeat center',
                backgroundSize : '100% 100%'
            });
            $ele.on('touchstart',function (e){
                $ele.attr('lastTouchStartTimestap',Date.now());
                $ele.css({
                    background : 'url('+$ele.attr('bg-press')+') no-repeat center',
                    backgroundSize : '100% 100%'
                });
            });
            $ele.on('touchend',function (e){
                var timepass = Date.now() - Number($ele.attr('lastTouchStartTimestap'));
                if(timepass < 300 && triggerClick){
                    $ele.trigger('click',e);
                }
                $ele.css({
                    background : 'url('+$ele.attr('bg')+') no-repeat center',
                    backgroundSize : '100% 100%'
                });
            })
        })
    }
};
var interactiveHandlerFactory = {
    pressbtnHandler :  pressbtnHandler
};
module.exports = interactiveHandlerFactory;
