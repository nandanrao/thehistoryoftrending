define(['react', 'lodash'], function(React, _){

	var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	var Articles = React.createClass({
		render: function(){

			var articles = this.props.articles;

			return (
				<ReactCSSTransitionGroup transitionName="articlesUL">
				<ul className="articles">
				<ReactCSSTransitionGroup transitionName="articles">
					{ _.map(articles, function(article, i) {
	          return <Article
	          				key={article._id}
	          				headline={article.headline}
	          				byline={article.byline}
	          				pubDate={article.pub_date}
	          				body={article.text}
	          				index={i} />
	        }, this)}
				</ReactCSSTransitionGroup>	
				</ul>
				</ReactCSSTransitionGroup>	
			)
		}
	})

	var Article = React.createClass({
		render: function(){
			return (
				<li>
					<h2>{this.props.headline}</h2>
					<p>{this.props.pubDate}</p>
					<p> {this.props.body}</p>
				</li>
			)
		}
	})



	return Articles
})