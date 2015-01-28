// bind this outside functions to be sure to get global scope (web worker scope)
// (if in strict-mode then other functions will have scope of undefined)
var self = this;

define(['es6-promise'], function(promise){
	'use strict'

	var Promise = promise.Promise

	var get = function(path){
		return new Promise(function(resolve, reject){
			var req = new XMLHttpRequest()
			req.onload = function(e){
				var data = JSON.parse(e.target.response);
				resolve(data)
			};
			req.onerror = function(e){
				reject(e.target.response)
			};
			req.open('get', path, true)
			req.send()
		})
	};

	return {
		get: get
	}
})
