# KBD Modal
a javascript module for modal windows

## Install
`npm install kbd-modal`

## Usage
```
m = new modal('md-trigger', '[id^="md"]', 'md-close')
m.init()
```

The modal object takes three parameters: (1) the event trigger, a class which should be added to any listening element to trigger the modal, (2) the ID prefix which, is added to the modal window itself, and (3) the class used for the closing function, which should be attached to whatever button is used to close the window itself (although, the modal will also close by just clicking the background overlay).

An example:

```
<div class="modal-item">
	<a href="#" class="md-trigger" data-modal="md-identifier"></a>
</div>
```

```
<div class="md-modal md-effect" id="md-identifier">
	<div class="md-content">
		-- Modal Content --
	</div>
	<div class="md-close"></div>
</div>
```

To include the .scss file in your project, you can use something like the following structure:

```javascript
gulp         = require('gulp')
sass         = require('gulp-sass')
modal		 = require('kbd-modal').includePaths

gulp.task 'sass', ->
	return gulp.src('screen.scss')
		.pipe(sass
			includePaths: ['sass'].concat(modal)
		)
		.pipe(gulp.dest(config.dest))
```
