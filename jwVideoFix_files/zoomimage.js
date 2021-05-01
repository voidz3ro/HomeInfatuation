var Zoomer = function(){
	var zoomer = function(){

		var swapImages = function(img){
					//$('.image').slideDown();
					$('.image').attr('src',img);
				}

				var removeActive = function(){
					$('.thumbnail').removeClass('thumbnail-active');
					$('.video-thumbnail').removeClass('video-thumbnail-active');
				}

				var Thumbnail = function(e,i){
					$(e).click(function(){
						destroyVideo();
						var newImage = $(this).data('zoom');
						var ntitle = $(this).data('title');
						removeActive();
						$(this).addClass('thumbnail-active');
						swapImages(newImage);
						if(ntitle.length < 4){
							$('#main-image-title').hide();
						}
						else {
							$('#main-image-title').show();
						}

						$('#main-image-title').html($(this).data('title'));
					})
				}

				var resizeThumbnail = function(e){
					$(e).height($(e).width());
				}

				var resizeVideoThumbnail = function(e){
					var tch = $(e).parent().width();
					var tcw = tch * 1.6;
					$(e).height(tch);
					$(e).width(tcw);
				}

				var Video = function(e,i){
					resizeVideoThumbnail(e);
					$(e).next().click(function(){
						$('.thumbnail').removeClass('thumbnail-active');
						$('.video-thumbnail').removeClass('video-thumbnail-active');
						$(this).prev().addClass('video-thumbnail-active');
						showVideo($(e).data('video'));
					});
					$(window).resize(function(){
						resizeVideoThumbnail(e);
					})
				}

				this.init = function(){
					$('.thumbnail').each(function(key,val){
						var thumb = Thumbnail($(val),key);
					})	
					$('.video-thumbnail').each(function(key,val){
						var video = Video($(val),key);
					})
					$('.zoomer div:first').find('img').addClass('thumbnail-active');		
				}
			}
			return zoomer;
		}();