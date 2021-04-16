import { clone } from 'timm'

function expandLayers(initBoundaries, minHeight = 20) {
	const boundaries = Array.from(initBoundaries)

	let heightIsArray = false

	// HIA
	if (Array.isArray(minHeight)) {
		if (boundaries.length === minHeight.length+1) {
			heightIsArray = true
		}
		else {
			minHeight = 20
		}
	}

	let layers = []

	boundaries.forEach((b, i) => {
		const k = Number(i)
		if (k < boundaries.length - 1) {
			layers.push(boundaries[k+1] - boundaries[k])
		}
	})

	//Find first skinny layer
	let a = layers.findIndex((l, i) => {
		// HIA
		if (heightIsArray) {
			return l < minHeight[i]
		}
		return l < minHeight
	})

	if (a < 0) {//All Good, returning!
		return boundaries
	}


	//set = actual numbers to expand
	let set = [layers[a]]

	//delta = extra space needed per number
	let delta = []

	//Look for adjacent skinny layers
	let j = a+1
	while (j < layers.length) {
		// HIA
		let currentHeight = heightIsArray ? minHeight[j] : minHeight
		if (layers[j] <= currentHeight) {
			set.push(layers[j])
			j++
		}
		else break
	}

	//Find how much room is needed = N
	let N

	// HIA
	if (heightIsArray) {
		//Choose which of the minHeights to use for N
		N = minHeight.slice(a, a+set.length).reduce((a, b) => a + b, 0)
		set.forEach((s, i) => {
			delta[i] = minHeight[a+i] - s
			N -= s
		})
	}
	else {
		N = set.length * minHeight
		set.forEach((s, i) => {
			delta[i] = minHeight - s
			N -= s
		})
	}

	//squares = each term to square and add up. Will add i to each on iteration. Non-end ones get doubled
	//First element always starts as 0
	let squares = Array(delta.length+1).fill(0)

	delta.forEach((d, k) => {
		while (k < delta.length) {
			squares[k+1] -= d
			k++
		}
	})

	//Go through each configuration. Save the best one
	//let configurations = []
	let bestC = {eD: Infinity}
	let i = 0

	//Look for first/last layers
	if (a === 0) {//First Layer. Keep N=0, only move down
		N = 0
	}

	if (a + set.length === layers.length) {//Last Layer. Only move up
		i = N
	}

	while (i <= N) {
		let eD = 0
		squares.forEach((s, k) => {
			if (k === 0 || k === squares.length-1) {//First or last
				eD += Math.pow(s+i, 2)
			}
			else {//Middle
				eD += 2 * ( Math.pow(s+i, 2) )
			}
		})
		if (eD < bestC.eD) {
			bestC = {
				i: i,
				eD: eD
			}
		}
		i++
	}

	//Apply the best configuration to the original set
	const newB = clone(boundaries)
	const newSquares = squares.map((s) => s += bestC.i)

	for (let s of newSquares) {
		newB[a] -= s
		a++
	}

	return expandLayers(newB, minHeight)
}

export default expandLayers
