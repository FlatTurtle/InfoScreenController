var dragSrcEl = null;

function handleDragStart(e) {
	// Target (this) element is the source node.
	$(this).css('opacity','0.4');

	dragSrcEl = this;

	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
	
	$.each($('.droparea'),function(){
		$(this).addClass('active');
	});
}

function handleDragOver(e) {
	console.log($(this).attr('id'));
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}

	e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

	return false;
}

function handleDragEnter(e) {
	// this / e.target is the current hover target.
}

function handleDragLeave(e) {
	//this.classList.remove('over'); // this / e.target is previous target element.
}

function handleDrop(e) {
	// this/e.target is current target element.
	//alert(this.id);
	if (e.stopPropagation) {
		e.stopPropagation(); // Stops some browsers from redirecting.
	}

	// Don't do anything if dropping the same column we're dragging.
	console.log($(dragSrcEl).attr('id'));
	console.log($(this).attr('id'));
	console.log($(this).hasClass('droparea'));
	
	if ($(dragSrcEl).attr('id') != $(this).attr('id') && $(this).hasClass('droparea')) {
		// Set the source column's HTML to the HTML of the columnwe dropped on.
		//dragSrcEl.innerHTML = this.innerHTML;
		//dragSrcEl.style.opacity="1";
		//this.appendChild( e.dataTransfer.getData('text/html'));
		alert('check!')
		//this.classList.remove('over');
		//$('#'+this.id).append(e.dataTransfer.getData('text/html'));
		
	}
	/*else if(dragSrcEl == this && $('#'+dragSrcEl.id).hasClass('drop')){
		dragSrcEl.style.opacity="1";
		dragSrcEl.innerHTML = this.innerHTML;
		this.innerHTML = e.dataTransfer.getData('text/html');
		this.classList.remove('over');
	}*/

	return false;
}

function handleDragEnd(e) {
	// this/e.target is the source node.

	/*[].forEach.call(drags, function(col) {
		col.classList.remove('over');
		col.style.opacity="1";
	});*/
	$.each($('.droparea'),function(){
		$(this).removeClass('active');
	});
	$(this).css('opacity','1');
}

var modules = [ {
	alias : 'facebook',
	image : 'img/icon-facebook.svg'
}, {
	alias : 'foursquare',
	image : 'img/icon-foursquare.svg'
}, {
	alias : 'twitter',
	image : 'img/icon-twitter.svg'
}, {
	alias : 'vikingspots',
	image : 'img/icon-vikingspots.svg'
} ];
var turtles = [ {
	alias : 'facebook',
	image : 'img/icon-facebook.svg',
	group : 1,
	order : 0,
	colspan : 1
}, {
	alias : 'facebook',
	image : 'img/icon-facebook.svg',
	group : 2,
	order : 0,
	colspan : 1
} ];
function populate() {
	for (x in modules) {
		var el = $('<li><img></img></li>');
		el.find('img').attr('src', modules[x].image).attr('class','dragarea').attr('id',modules[x].alias);
		$("#listmodules").append(el);
		//$("#listmodules img:last").attr('src',module.image);
	}
	var colCount = 0;
	for(x in turtles){
		if(colCount < turtles[x].group) colCount = turtles[x].group;
	}
	for(var i=0;i<colCount;i++){
		var span = 12 / colCount;
		//var inner = $('<div></div>');
		var outer = $('<div></div>');
		outer.attr('class','span'+span).css('height','100%').attr('id','column'+(i+1));
		//inner.attr('draggable','true').css('height','30%').css('width','30%').css('float','left').attr('class','droparea').attr('id','drop'+(i+1));
		//outer.append(inner);
		
		var column = $('<div></div>');
		column.css('height','70%').css('border','2px dashed #000');
		outer.append(column);
		$('#screen').append(outer);
	}
	for(x in turtles){
		var el = $('<img></img>');
		el.attr('src', turtles[x].image).attr('id','turtle'+x).css('height','30%').css('float','left');
		$('#column'+turtles[x].group).append(el);
	}
	for(var i=0;i<colCount;i++){
		var span = 12 / colCount;
		var inner = $('<div></div>');
		var outer = $('#column'+i);
		inner.attr('draggable','true').css('height','30%').css('width','30%').css('float','left').attr('class','droparea').attr('id','drop'+(i+1));
		outer.append(inner);
	}
	$.each($('.dragarea'),function(){
		var el = document.getElementById($(this).attr('id'));
		el.addEventListener('dragstart', handleDragStart, false);
		//el.addEventListener('dragenter', handleDragEnter, false)
		el.addEventListener('dragover', handleDragOver, false);
		//el.addEventListener('dragleave', handleDragLeave, false);
		el.addEventListener('drop', handleDrop, false);
		el.addEventListener('dragend', handleDragEnd, false);
	});
	
	$.each($('.droparea'),function(){
		var el = document.getElementById($(this).attr('id'));
		el.addEventListener('dragstart', handleDragStart, false);
		//el.addEventListener('dragenter', handleDragEnter, false)
		el.addEventListener('dragover', handleDragOver, false);
		//el.addEventListener('dragleave', handleDragLeave, false);
		el.addEventListener('drop', handleDrop, false);
		el.addEventListener('dragend', handleDragEnd, false);
	});
	
}
populate();