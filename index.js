var drag = (function() {

	var addEvents = function(el, types, handler) {
		for(var i = 0; i<types.length; i++) {
			el.addEventListener ? el.addEventListener(types[i], handler, false) : el.attachEvent('on' + types[i], handler)
		}
	}

	var removeEvents = function(el, types, handler) {
		for(var i = 0; i<types.length; i++) {
			el.removeEventListener ? el.removeEventListener(types[i], handler) : el.detachEvent('on' + types[i], handler)
		}
	}

	var stop = function(event) {
		event.preventDefault ? event.preventDefault() : event.returnValue = false
	}

	var location = function(event) {
		if('touches' in event && event.touches.length > 0) {
			return {x:event.touches[0].pageX, y:event.touches[0].pageY}
		}
		if('pageX' in event) {
			return {x:event.pageX, y:event.pageY}
		}
		if('clientX' in event) {
			var d = document.documentElement, b = document.body
			return {
				x:event.clientX + (d && d.scrollLeft || b && b.scrollLeft || 0) - (d && d.clientLeft || b && b.clientLeft || 0),
				y:event.clientY + (d && d.scrollTop || b && b.scrollTop || 0) - (d && d.clientTop || b && b.clientTop || 0)
			}
		}
		return {x:0, y:0}
	}

	var subtract = function(from, amount) {
		return {x:from.x - amount.x, y:from.y - amount.y}
	}

	var gesture = function(el, cb) {
		
		var prev

		var handler = function(event) {
			event = event || window.event
			var target = event.srcElement || event.target
			switch(event.type) {				
				case 'touchstart':
					prev = location(event)
					cb('began', {position:prev, velocity:{x:0, y:0}, target:target})
					break
				case 'mousedown':	
					prev = location(event)
					cb('began', {position:prev, velocity:{x:0, y:0}, target:target})
					addEvents(document, ['mousemove', 'mouseup'], handler)
					break
				case 'touchmove':
				case 'mousemove':
					stop(event)
				 	var next = location(event)
					cb('moved', {position:next, velocity:subtract(next, prev), target:target})
					prev = next
				break
				case 'touchend':
				case 'touchcancel':
				 	var next = location(event)
					cb('ended', {position:next, velocity:subtract(next, prev), target:target})
					prev = next
					break
				case 'mouseup':
					removeEvents(document, ['mousemove', 'mouseup'], handler)
				 	var next = location(event)
					cb('ended', {position:next, velocity:subtract(next, prev), target:target})
					prev = next
				break
			}
		}


		if('ontouchstart' in window) {
			addEvents(el, ['touchstart', 'touchmove', 'touchend', 'touchcancel'], handler)
		}
		else {
			el.ondragstart = function() {return false}
			addEvents(el, ['mousedown'], handler)
		}


		return {
		
			dispose: function() {
				removeEvents(el, ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'mousedown'], handler)
				removeEvents(document, ['mousemove', 'mouseup'], handler)	
			}

		}

	}


  return { createGesture: gesture }

})() 

if(typeof module !== 'undefined') {
  module.exports = drag
}
