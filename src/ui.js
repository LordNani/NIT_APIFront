// eslint-disable-next-line no-unused-vars
export function effectBuyItem(cartImg, imgToDrag) {
    if (imgToDrag) {
        const imgclone = imgToDrag.clone()
            .offset({
                top: imgToDrag.offset().top,
                left: imgToDrag.offset().left
            })
            .css({
                'opacity': '0.5',
                'position': 'absolute',
                'height': '200px',
                'width': '200px',
                'z-index': '100',
                'border-radius': '15%'
            })
            .appendTo($('body'))
            .animate({
                'top': cartImg.offset().top + 15,
                'left': cartImg.offset().left + 40,
                'width': 0,
                'height': 0
            }, 1000, 'easeInOutExpo');

        imgclone.animate({
            'width': 0,
            'height': 0
        }, function () {
            $(this).detach()
        });
    }
  }
