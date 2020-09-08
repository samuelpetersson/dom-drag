# dom-drag


### Concept

```javascript
//Create a new gesture.
var gesture = drag.createGesture(element, callback);
```

```javascript
//Dispose and stop gesture.
gesture.dispose();
```

### Examples

```javascript
//Implement the callback to receive state change (began, moved and ended), position and velocity of current event.
drag.createGesture(element, function(state, {position, velocity, target}) {

	switch(state) {
		case 'began':
			//Drag gesture began.
			break
		case 'moved':
			//Drag gesture moved.
			break
		case 'ended':
			//Drag gesture ended.
			break
	}

});
```