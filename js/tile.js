function tile(id){
	this.id = id;
	this.frontColor = '#fcfcfc';
	this.backColor = '#fff';
	this.startAt = 1000;
	this.flipped = false;
	this.backContentImage = null;
	this.flipCompleteCallbacks = null;

	this.setBackContentImage = function(image){
		this.backContentImage = image;
	}

	this.setFrontColor = function(color){
		this.frontColor = color;
	}

	this.setStartAt = function(timer){
		this.startAt = timer;
	}

	this.setFlipMethod = function(flipMethod){
		this.flipMethod = flipMethod;
	}

	this.markSelected = function(){
		this.removeSelection();
		$('#'+this.id).addClass('markSelected');
		//$('#'+this.id).css({'width':"96px", 'height':"96px"});
	}

	this.removeSelection = function(){
		$('.tile').removeClass('markSelected');
		//$('.tile').css({'width':"100px", 'height':"100px"});
	}

	this.getHtml = function(){
		var tileId =  parseInt(this.id.substr('tile'.length))+1;
		return '<div id="' + this.id + '" class="tile ' + this.frontColor + '" tabindex='+tileId+'>' + '</div>';
	}

	this.getFlipped = function(){
		return this.flipped;
	}

	this.getStartAt = function(){
		return this.startAt;
	}

	this.getBackContent = function() {
		return '<img src="' + this.backContentImage + '"/>';
	};

	this.getBackContentImage = function(){
		return this.backContentImage;
	}

	this.onComplete = function(){
		if(this.flipCompleteCallbacks !== null){
			this.flipCompleteCallbacks();
			this.flipCompleteCallbacks = null;
		}
	}

	this.flip = function(){
		$('#'+this.id).flip({
			direction: this.flipMethod,
			color: this.backColor,
			content: this.getBackContent(),
			onEnd: this.onComplete()
		});
		
		this.flipped = true;
	}

	this.revertFlip = function(){
		$('#'+ this.id+ " img").hide();
		$("#"+ this.id).revertFlip();
		
		this.flipped = false;
	}

	this.addFlipCompleteCallback = function(callBack){
		this.flipCompleteCallbacks = callBack;
	}
}