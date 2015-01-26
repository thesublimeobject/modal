#*--------------------------------------------------------#
	# That Modal
#*--------------------------------------------------------#

classie = require 'classie'
path = require 'path'

class Modal

	constructor: (trigger, windows, close) ->
		@overlay = null
		@trigger = document.getElementsByClassName(trigger)
		@windows = document.querySelectorAll(windows)
		@close = document.getElementsByClassName(close)

	closest: (el, selector) ->
		matchesFn = undefined
		[
			'matches'
			'webkitMatchesSelector'
			'mozMatchesSelector'
			'msMatchesSelector'
			'oMatchesSelector'
		].some (fn) ->
			if typeof document.body[fn] is "function"
				matchesFn = fn
				return true
			false

		while el isnt null
			parent = el.parentElement
			return parent if parent isnt null and parent[matchesFn](selector)
			el = parent
		null

	appendOverlay: ->
		overlay = document.createElement('div')
		overlay.className = 'md-overlay'
		footer = document.getElementsByClassName('footer')[0]
		footer.insertAdjacentHTML('beforebegin', '<div class="md-overlay"></div>')
		return

	updateOverlay: ->
		@overlay = document.getElementsByClassName('md-overlay')[0]
		return

	mdOpen: (event, target) ->
		event.preventDefault()
		if !classie.has(target, 'md-trigger') and @closest(target, '.md-trigger') isnt null
			target = @closest(target, '.md-trigger')
		data = target.getAttribute 'data-modal'
		modal = document.getElementById(data)
		classie.add(modal, 'md-show')
		if modal.querySelector('iframe') isnt null
			@autoplay(modal)
		classie.add(@overlay, 'overlay-active')
		return

	mdClose: (event) ->
		event.preventDefault()

		if classie.has(@overlay, 'overlay-active')
			classie.remove(@overlay, 'overlay-active')

		[].forEach.call @windows, (el) ->
			if classie.has(el, 'md-show')
				classie.remove(el, 'md-show')

				video = if el.querySelector('iframe') isnt null then el.querySelector('iframe') else false

				if video
					src = video.getAttribute 'src'
					if src.indexOf '?&autoplay'
						srcArray = src.split('?&autoplay')
						src = srcArray[0]
					video.setAttribute 'src', ''
					video.setAttribute 'src', src
			return
		return

	autoplay: (id) ->
		frame = id.querySelector('iframe')
		src = frame.getAttribute 'src'
		w = frame.getAttribute 'width'
		h = frame.getAttribute 'height'
		id.innerHTML = '<iframe width="' + w + '" height="' + h + '" src="' + src + '?&autoplay=1" frameborder="0"></iframe>'
		return

	setModalPosition: ->
		data = @.getAttribute 'data-modal'
		modal = document.getElementById(data)
		h = modal.offsetHeight
		w = modal.offsetWidth
		windowHeight = window.innerHeight
		windowWidth = window.innerWidth

		if h > windowHeight * 0.95
			classie.add(modal, 'md-lg')
			modal.style.top = (windowHeight * 0.025) + window.scrollY + 'px'
			return
		else
			return false

	removeModalStyle: ->
		mdShow = document.getElementsByClassName('md-lg')[0]
		mdShow.style.top = 0
		classie.remove(mdShow, 'md-lg')
		return

	init: ->
		_this = @
		@appendOverlay()
		@updateOverlay()
		[].forEach.call @trigger, (el) ->
			el.addEventListener 'click', ->
				_this.mdOpen.call(_this, event, event.target)
				_this.setModalPosition.call(el)
				return
			return
		[].forEach.call @close, (el) ->
			el.addEventListener 'click', ->
				_this.mdClose.call(_this, event)
				_this.removeModalStyle()
				return
			return
		@overlay.addEventListener 'click', ->
			_this.mdClose.call(_this, event)
			_this.removeModalStyle()
			return
		return


includePaths = ->
	modalPaths = path.join(__dirname, 'styl');
	modalPaths

module.exports = {
	Modal

	includePaths: includePaths()

	with: ->
		paths  = Array.prototype.slice.call(arguments)
		result = [].concat.apply(includePaths(), paths)
		result
}
