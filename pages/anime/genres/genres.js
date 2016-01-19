'use strict'

let Promise = require('bluebird')
let repeatedly = require('../../../lib/utils/repeatedly')
let fs = Promise.promisifyAll(require('fs'))

repeatedly(30 * 60, () => {
	console.log('Updating genre cache...')

	fs.readFileAsync('pages/anime/genres/genres.txt', 'utf8').then(genreText => {
		let genreList = genreText.split('\n')
		let tasks = []

		genreList.forEach(genre => {
			genre = arn.fixGenre(genre)
			let genreSearch = `;${genre};`

			tasks.push(Promise.delay(tasks.length * 1000).then(() => {
				let animeList = []

				return arn.forEach('Anime', anime => {
					if(!anime.watching)
						return

					if(!anime.genres)
						return

					if((';' + anime.genres.map(arn.fixGenre).join(';') + ';').indexOf(genreSearch) === -1)
						return

					animeList.push({
						id: anime.id,
						title: anime.title,
						startDate: anime.startDate,
						watching: anime.watching
					})
				}).then(() => {
					animeList.sort((a, b) => {
						if(a.watching === b.watching) {
							if(!a.startDate)
								return 1

							if(!b.startDate)
								return -1

							return a.startDate > b.startDate ? -1 : 1
						} else if(!a.watching) {
							return 1
						} else if(!b.watching) {
							return -1
						} else {
							return a.watching > b.watching ? -1 : 1
						}
					})

					arn.set('Genres', genre, animeList)

					if(global.gc)
						global.gc()
				})
			}))
		})
	})
})

exports.get = (request, response) => {
	let genre = request.params[0]

	if(!genre) {
		response.render({})
		return
	}

	arn.get('Genres', genre).then(animeList => {
		response.render({
			genre,
			animeList
		})
	}).catch(error => {
		console.error(error, error.stack)
		response.render({})
		return
	})
}