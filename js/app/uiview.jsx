define(['react', 'jsx!subjects', 'jsx!articles'], function(React, Subjects, Articles){

	var subjects = function(arr, loaded){
		if (loaded){
			console.log('loaded', loaded)
		}
		React.render(
			<Subjects loaded={loaded} results={arr} />,
			document.getElementById('results')
		)
	}

	var articles = function(arr){
		React.render(
			<Articles articles={arr} />,
			document.getElementById('articles')
		)	
	}

	return {
		subjects: subjects,
		articles: articles
	}
})