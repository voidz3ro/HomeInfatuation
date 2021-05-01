sitepath = 'https://' + window.location.host + '/';
sitepath_swatch = 'https://cdn.homeinfatuation.com/swatch/250/';

var gallery = false;
var player;
var icondown = false;
var catmenuopen = false;

function catIconPrompt() {
	if ($(this).hasClass('prompt-active')) {
		$(this).removeClass('prompt-active');
	} else {
		$(this).addClass('prompt-active');
		$(this).removeClass('caticon-mask');
	}
}

function destroyVideo() {
	$('.image-wrapper').slideDown();
	if (typeof player !== 'undefined') {
		player.remove();
	}
	$('#video-wrapper').slideUp();
}

function showVideo(video) {
	$('html, body').animate({ scrollTop: 0 }, 'slow', function () {
		$('.image-wrapper').slideUp();
		// player = jwplayer('video-wrapper').setup({
		// 	file: video,
		// 	width: '100%',
		// 	aspectratio: '16:9',
		// 	autostart: 'true',
		// });

		document.querySelector('#video-wrapper').innerHTML = `
        <iframe
            width="100%"
            height="350"
            src="${video}"
            frameborder="0"
            allowfullscreen
        ></iframe>`;
	});
}
// function showVideo(video){
// 	$("html, body").animate({ scrollTop: 0 }, "slow", function(){
// 		$('.image-wrapper').slideUp();
// 		player = jwplayer('video-wrapper').setup({
// 			 playlist: '//jwpsrv.com/feed/'+video+'.rss',
// 		        width: '100%',
// 		        aspectratio: '16:9',
// 		        skin: 'roundster',
// 		        autostart: 'true'
// 		});

// 	});
// }
function showVideoGallery(video) {
	player = jwplayer('gallery-video').setup({
		file: '//www.youtube.com/watch?v=' + video,
		width: '100%',
		aspectratio: '16:9',
		autostart: 'true',
		wmode: 'transparent',
	});
	$('#gallery-video').show();
	player.onReady(function () {
		var vw = $(document).width();
		var vh = vw * 0.55;
		player.resize('100%', vh - 50);
		player.setControls(false);
		$('#gallery-video-wrap').height(vh - 20);
		$('#gallery-video-wrap').show();
		$('#gallery-hero').hide();
		$('.gallery-callout').hide();
		$('#gallery-video').on('click', function () {
			if (player.getState() == 'PLAYING') {
				player.pause(true);
			} else {
				player.play(true);
			}
		});
	});
}

function adjustQty(e, subtract) {
	var nqty;
	var el = $(e.target);
	if (subtract) {
		var tg = $(el).next();
	} else {
		var tg = $(el).prev();
	}
	var qty = parseInt(tg.attr('data-qty'));

	if (subtract && qty != 1) {
		nqty = qty - 1;
	} else if (!subtract) {
		nqty = qty + 1;
	} else {
		nqty = 1;
	}
	tg.html(nqty.toString());
	tg.attr('data-qty', nqty);
	el.parent().parent().parent().attr('data-qty', nqty);
}

function zoomSwatch(ref) {
	$('#swatchModal').foundation('reveal', 'open');
	$('#swatchModal img').attr('src', sitepath_swatch + ref);
	//$('#swatchModal img').attr('src',sitepath+'assets/images/images_xswatches/'+ref)
	//$('#swatchModal img').attr('src','https://www.homeinfatuation.com/assets/images/images_xswatches/'+ref)
}

function selectColor(e) {
	var el = $(e.target).closest('.swatch-wrapper');
	curstate = el.data('selected');
	$('.swatch-wrapper').data('selected', false);
	if (!curstate) {
		var nstylecolor =
			el.data('stylecolor') + ' - click swatch again to zoom';
		var nprodid = el.data('prodid');
		el.parent().parent().parent().attr('data-prodid', nprodid);
		$('.checkmark').hide();
		$(el).find('.checkmark').fadeIn();
		$(el).parent().find('.colorname').html(nstylecolor);
		el.data('selected', true);
	} else {
		var nref = el.data('ref');
		zoomSwatch(nref);
		el.data('selected', true);
	}
}
function resetProductPage() {
	$('.lineitems').attr('data-prodid', '');
	$('.lineitems').attr('data-qty', 1);
	$('.swatch-wrapper').data('selected', false);
	$('.checkmark').hide();
	$('.colorname').html('');
	$('.qtynum').attr('data-qty', 1), $('.qtynum').html('1');
	$('.li-selection').val(0);
}
function closeCartModal() {
	$('#cartModal').foundation('reveal', 'close');
	resetProductPage();
}

function cartAlert(p, q) {
	$('#cartModal').foundation('reveal', 'open');
}

function moneyFormat(val) {
	var m = parseFloat(val);
	var mf = '$' + m.formatMoney(2, ',', '.');
	return mf;
}

Number.prototype.formatMoney = function (
	decPlaces,
	thouSeparator,
	decSeparator,
) {
	var n = this,
		decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces,
		decSeparator = decSeparator == undefined ? '.' : decSeparator,
		thouSeparator = thouSeparator == undefined ? ',' : thouSeparator,
		sign = n < 0 ? '-' : '',
		i = parseInt((n = Math.abs(+n || 0).toFixed(decPlaces))) + '',
		j = (j = i.length) > 3 ? j % 3 : 0;
	return (
		sign +
		(j ? i.substr(0, j) + thouSeparator : '') +
		i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thouSeparator) +
		(decPlaces
			? decSeparator +
			  Math.abs(n - i)
					.toFixed(decPlaces)
					.slice(2)
			: '')
	);
};

function addToOrder(e) {
	var itm = $('#' + e);
	var npid = itm.attr('data-pids');
	if (npid.length == 0) {
		npid = itm.attr('data-prodid');
	}
	var nqty = itm.attr('data-qty');
	if (npid.length < 1) {
		alert(itm.attr('data-alert'));
	} else {
		$.getJSON(
			sitepath + 'inc/cart_add.cfm',
			{ pid: npid, qty: nqty },
			function (data) {
				if (data.response == 'success') {
					$('#cart-sbttl').html(moneyFormat(data.subtotal));
					cartAlert(data.product, data.subtotal);
				} else {
					alert('Network error. Please try again.');
				}
			},
		);
	}
}

function changeSelection(el) {
	var nprodid = $(el).val();
	$(el).parent().parent().parent().attr('data-prodid', nprodid);
}

function showSwatches() {
	$('.swatches').slideToggle();
}

/*Menu inside category navigation */
/*function showCategories(){
	if (icondown == false){
		for(i=0;i<4;i++){
			$('#line'+i).attr('class','line'+i);
		}
		$('#arrow').attr('class','arrow');
		$('#menutext').attr('class','menutext');
		$('#circle').attr('class','circle');
		icondown = true;
	}
	else {
		for(i=0;i<4;i++){
			$('#line'+i).attr('class','line'+i+'-out');
		}
		$('#arrow').attr('class','arrow-out');
		$('#menutext').attr('class','menutext-out');
		$('#circle').attr('class','circle-out');
		icondown = false;
	}

	setTimeout("doShowCategories()", 100);
}
*/
/*
function doShowCategories(){
	if (catmenuopen ==false) {
		$('#cat-nav').slideDown();
		$('#catlist').addClass('catnav2');
		catmenuopen = true;
	}
	else {
		$('#cat-nav').slideUp();
		$('#catlist').removeClass('catnav2');
		catmenuopen = false;
	}
}*/

function setHomePage() {
	var tHeight = $(window).height();
	var fHeight = $('.homepage-footer').height();
	var fTop = tHeight - fHeight - 150;
}

function toTop() {
	$('.galleria').slideUp();
	$('html, body').animate({ scrollTop: 0 }, 'slow', function () {});
}
function toTop2() {
	$('.galleria').slideUp();
	$('html, body').animate({ scrollTop: 0 }, 'slow', function () {});
}

function closeInfoPane() {
	$('.info-pane').slideUp();
}

function additionalInfo() {
	$('.info-pane').slideToggle();
	$('.galleria').slideUp();
}

function showGallery() {
	$('.info-pane').slideUp();
	$('.galleria').slideToggle();
	var tp = $('.galleria-wrapper').offset();
	$('html, body').animate(
		{ scrollTop: $('.galleria-wrapper').offset().top - 30 },
		'slow',
		function () {},
	);
}

function showGalleryItem() {
	$('.gallery-large').slideDown();
	$('html, body').animate({ scrollTop: 150 }, 'slow', function () {});
}
function closeGalleryItem() {
	gallery = false;
	$('#gallery-zoom-wrapper').removeClass('gallery-zoom-wrapper-visible');
	$('#gallery-zoom-wrapper').addClass('gallery-zoom-wrapper-hidden');
	setTimeout(function () {
		$('#gallery-zoom-wrapper').hide();
	}, 1000);
}

$(window).on('scroll', function () {
	if ($(window).scrollTop() > 200) {
		$('#back-to-top').fadeIn();
		$('#menu-icon-wrapper').show();
	} else {
		$('#back-to-top').fadeOut();
		$('#menu-icon-wrapper').hide();
		$('#cat-nav').slideUp();
	}
});
