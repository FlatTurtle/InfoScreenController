var dragSrcEl = null;

function sortfunction(first, second){
	//Compare "a" and "b" in some fashion, and return -1, 0, or 1
	if(first.group < second.group) return -1;
	else if(first.group > second.group) return 1;
	else if(first.order < second.order) return -1;
	else if(first.order > second.order) return 1;
	else return 0;
}

function handleDragStart(e) {
	// Target (this) element is the source node.
	$(this).css('opacity','0.4');

	dragSrcEl = this;

	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
	
	if($(this).hasClass('module')){
		$.each($('.newTurtle'),function(){
			$(this).addClass('active');
		});
	}
}

function handleDragOver(e) {
	console.log($(this).attr('id'));
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}

	e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

	return false;
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
	console.log($(this).hasClass('newTurtle'));
	
	if ($(dragSrcEl).hasClass('module')) {
		// Set the source column's HTML to the HTML of the columnwe dropped on.
		//dragSrcEl.innerHTML = this.innerHTML;
		//dragSrcEl.style.opacity="1";
		//this.appendChild( e.dataTransfer.getData('text/html'));
		//alert('check!');
		
		//determine chosen module
		var alias = $(dragSrcEl).attr('id');
		var pos;
		for(x in modules){
			if(modules[x].alias == alias) pos =x; 
		}
		//determine new position
		var groupSize,position = 0;
		for(x in turtles){
			if(parseInt($(this).attr('id').replace('drop','')) == turtles[x].group) groupSize++;
		}
		// create turtle
		var newTurtle = {
			alias : modules[pos].alias,
			image : modules[pos].image,
			group : parseInt($(this).attr('id').replace('drop','')),
			order : groupSize,
			colspan : 1
		}
		//add to existing turtles
		turtles.push(newTurtle);
		turtles.sort(sortfunction);
		for(x in turtles){
			if(turtles[x] == newTurtle) position = x;
		}
		
		//visualize
		var el = createTurtle(position);
		el.insertBefore($(this));
		//add event listeners
		/*var ell = $(this).get(0);
		ell.addEventListener('dragstart', handleDragStart, false);
		ell.addEventListener('dragend', handleDragEnd, false);
		ell.addEventListener('dragover', handleDragOver, false);
		ell.addEventListener('drop', handleDropTurtle, false);*/
		
		
		//show turtles
		console.log(JSON.stringify(turtles));
		
		$.each($('.turtle'),function(index){
			$(this).attr('id','turtle'+index);
		});
		return true;
	}
	
	//else if(dragSrcEl ==)
	/*else if(dragSrcEl == this && $('#'+dragSrcEl.id).hasClass('drop')){
		dragSrcEl.style.opacity="1";
		dragSrcEl.innerHTML = this.innerHTML;
		this.innerHTML = e.dataTransfer.getData('text/html');
		this.classList.remove('over');
	}*/

	return false;
}

function handleDropTurtle(e) {
	// this/e.target is current target element.
	//alert(this.id);
	if (e.stopPropagation) {
		e.stopPropagation(); // Stops some browsers from redirecting.
	}
	if($(dragSrcEl).hasClass('turtle')){
		var htmlSrc = $(dragSrcEl).html();
		var htmlDest = $(this).html();
		
		var srcPos = parseInt($(dragSrcEl).attr('id').replace('turtle',''));
		var destPos = parseInt($(this).attr('id').replace('turtle',''));
		var temp = turtles[srcPos];
		
		//switch turtles
		turtles[srcPos] = turtles[destPos];
		turtles[destPos] = temp;
		
		//switch visuals
		$(dragSrcEl).html(htmlDest).css('opacity','1');
		$(this).html(htmlSrc);
		console.log(JSON.stringify(turtles));
	}
}

function handleDragEnd(e) {
	// this/e.target is the source node.

	/*[].forEach.call(drags, function(col) {
		col.classList.remove('over');
		col.style.opacity="1";
	});*/
	$.each($('.newTurtle'),function(){
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

function createTurtle(x){
	var el = $('<div><img></img></div>');
	el.attr('id','turtle'+x).css('height','100px').width('width','100px').css('float','left').attr('draggable','true').addClass('turtle');
	el.find('img').attr('src',turtles[x].image).css('height','100%').css('width','100%');
	
	var ell = $(el).get(0);
	ell.addEventListener('dragstart', handleDragStart, false);
	ell.addEventListener('dragend', handleDragEnd, false);
	ell.addEventListener('dragover', handleDragOver, false);
	ell.addEventListener('drop', handleDropTurtle, false)
	
	return el;
	
}
function init() {
	turtles.sort(sortfunction);
	
	//adding possible modules
	for (x in modules) {
		var el = $('<li><img></img></li>');
		el.find('img').attr('src', modules[x].image).attr('class','module').attr('id',modules[x].alias);
		$("#listmodules").append(el);
		//$("#listmodules img:last").attr('src',module.image);
	}
	var colCount = 0;
	//count columns
	for(x in turtles){
		if(colCount < turtles[x].group) colCount = turtles[x].group;
	}
	//adding columns
	for(var i=0;i<colCount;i++){
		var span = 12 / colCount;
		//var inner = $('<div></div>');
		var outer = $('<div></div>');
		outer.attr('class','span'+span).css('height','100%').attr('id','column'+(i+1));
		var column = $('<div></div>');
		column.css('height','600px').css('border','2px dashed #000');
		outer.append(column);
		$('#screen').append(outer);
	}
	
	
	//adding existing turtles to screen in specified column
	for(x in turtles){
		var el = createTurtle(x);
		$('#column'+turtles[x].group).append(el);
	}
	// adding add area for new turtles
	for(var i=0;i<colCount;i++){
		var span = 12 / colCount;
		var inner = $('<div></div>');
		var outer = $('#column'+(i+1));
		inner.attr('draggable','true').css('height','100px').css('width','100px').css('float','left').attr('class','newTurtle').attr('id','drop'+(i+1));
		outer.append(inner);
	}
	
	//defining eventlisteners for modules
	$.each($('.module'),function(){
		var el = $(this).get(0);
		el.addEventListener('dragstart', handleDragStart, false);
		el.addEventListener('dragend', handleDragEnd, false);
	});
	
	//defining eventlisteners for newTurtle
	$.each($('.newTurtle'),function(){
		var el = $(this).get(0);
		el.addEventListener('dragover', handleDragOver, false);
		el.addEventListener('drop', handleDrop, false);
	});
	
	//defining eventlisteners for Turtles
	/*$.each($('.turtle'),function(){
		var el = $(this).get(0);
		el.addEventListener('dragstart', handleDragStart, false);
		el.addEventListener('dragend', handleDragEnd, false);
		el.addEventListener('dragover', handleDragOver, false);
		el.addEventListener('drop', handleDropTurtle, false);
	});*/
}
init();