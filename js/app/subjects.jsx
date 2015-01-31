define(['react', 'lodash', 'RainbowVis-JS', 'utils/bus'], function(React, _, Rainbow, bus){

	var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	var rainbow = new Rainbow();  
	rainbow.setSpectrum('#999999', '#FF0000'); 
	// TODO: set rainbow dynamically (and abstract into its own module!)
	rainbow.setNumberRange(0, 80);

	var Subjects = React.createClass({
		getInitialState: function(){
			return {
				selected: false
			}
		},
		handleSelected: function(word, e){
			if (!this.props.loaded){
				return
			}
			bus.trigger('selected', word)
			this.setState({
				selected: {
					word: word,
					top: e.target.offsetTop + 'px',
					width: e.target.clientWidth + 'px',
				}
			})
		},
		// TODO: this gets called an excessive amount of times!
		handleSubjectsUnmounting: function(e){
			var selectedWithPosition = _.merge(this.state.selected,{position: 'absolute'})
			this.setState({
				selected: selectedWithPosition
			})
		},
		render: function(){
			var results = _.filter(this.props.results, function(result){
				if (this.state.selected){
					return result.word === this.state.selected.word
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
	          				selected={this.state.selected && this.state.selected.word === result.word}
	          				top={!!this.state.selected && this.state.selected.top} 
	          				width={!!this.state.selected && this.state.selected.width}
	          				position={!!this.state.selected && this.state.selected.position}  
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
			this.props.onSelected(this.props.word, e)
			var self = this;
			setTimeout(function(){
				self.setState({ selected: true })
			}, 200)
		},
		render: function(){
			
			function calcColor(count){
				if (!count){
					return '#333'
				}
				return '#' + rainbow.colourAt(count)
			}
			var style = {
				color: calcColor(this.props.count),
				top: this.state.selected ? '10px' : this.props.top,
				width: this.props.width,
				position: !!this.props.position ? this.props.position : 'block',
			} 
			if (this.props.position){
				style = _.merge(style, {transition: 'top .2s ease-in-out'})
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
