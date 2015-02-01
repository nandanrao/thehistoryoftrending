define(['react', 'lodash', 'RainbowVis-JS', 'utils/bus', 'react-tween-state'], function(React, _, Rainbow, bus, tweenState){

	var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	// TODO: set rainbow dynamically (and abstract into its own module!)
	var rainbow = new Rainbow();  
	rainbow.setSpectrum('#999999', '#FF0000'); 
	rainbow.setNumberRange(0, 80);


	var Subjects = React.createClass({
		getInitialState: function(){
			return {
				selected: false
			}
		},
		handleSelected: function(word, e){
			if (!this.props.loaded){
				alert('sorry, wait until everything has loaded before selecting a subject')
				return
			}
			bus.trigger('selected', word)
			this.setState({
				selected: word
			})
		},
		// TODO: this gets called an excessive amount of times AND is totally opaque!
		handleSubjectsUnmounting: function(e){
			if (!this.state.solo){
				this.setState({
					solo: true
				})	
			}
		},
		render: function(){
			var results = _.filter(this.props.results, function(result){
				if (this.state.selected){
					return result.word === this.state.selected
				}
				else {
					return true
				}
			}, this)
				return (
				<ul className="subjects">
					<ReactCSSTransitionGroup transitionName="subjects">
					{ _.map(results, function(result, i) {
	          return <Subject
	          				onUnmount={this.handleSubjectsUnmounting} 
	          				key={result.word}
	          				word={result.word}
	          				selected={this.state.selected}
	          				solo = {this.state.solo}
	          				onSelected={this.handleSelected} 
	          				index={i} 
	          				count={result.count} />
	        }, this)}
					</ReactCSSTransitionGroup>	
				</ul> 
			)
		}
	})

	var Subject = React.createClass({
		mixins: [
			tweenState.Mixin
		],
		getInitialState: function(){
			return {
				selected: false,
				hidden: false,
			}
		},
		componentWillUpdate: function(nextProps){
			var self = this;
			if (nextProps.selected) {
				return
			}
		  if (this.props.index !== nextProps.index){
		  	var interval = Math.random()*200+50;
		  	setTimeout(function(){
		  		self.setState({hidden: true})
		  	}, interval)
		  	setTimeout(function(){
		  		self.setState({hidden: false})
		  	}, interval+150)
		  }
		},
		componentWillUnmount: function(e){
			this.props.onUnmount(e)
		},
		handleClick: function(e){
			var self = this
			this.props.onSelected(this.props.word, e)
			this.tweenState('top', {
						delay: 500,
			      easing: tweenState.easingTypes.easeInOutQuad,
			      duration: 750,
			      beginValue: e.target.offsetTop,
			      endValue: 10,
			      onEnd: function(){ 
			      	bus.trigger('clickAnimationFinished', self.props.word) 
			      }
			    });
		},
		render: function(){
			function calcColor(count){
				return !!count ? '#' + rainbow.colourAt(count) : '#333'
			}
			var style = {
				color: calcColor(this.props.count),
				'margin-top': this.props.solo ? this.getTweeningValue('top') : 0,
				// width: this.props.width,
				// position: ,
			} 
			var hidden = this.state.hidden ? 'hidden' : '';
			return (
				<li className={hidden}
						onClick={this.handleClick} 
						style={style}>
						{ this.props.word }
				</li>
			);
		}
	})

	return Subjects

})
