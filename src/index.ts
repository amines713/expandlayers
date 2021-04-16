interface Best {
	eD: number;
	i?: number
}

interface Options {
	lower?: 'hard'|'soft';
	upper?: 'hard'|'soft';
	overflow?: 'lower'|'upper';
}

const defaultOptions: Options = {
	lower: 'soft',
	upper: 'soft',
	overflow: 'lower'
}

const computeNewBoundaries = (firstLayer: number, layers: number[], boundaries: number[], delta: number[], set: number[], N: number, options: Options) => {
	//squares = each term to square and add up. Will add i to each on iteration. Non-end ones get doubled
	//First element always starts as 0
	let squares = Array(delta.length + 1).fill(0)

	delta.forEach((d, k) => {
		while (k < delta.length) {
			squares[k + 1] -= d
			k++
		}
	})

	let best: Best = {
		eD: Infinity
	}

	let i = 0

	// Hard upper limit
	if (options.upper === 'hard' && firstLayer + set.length === layers.length) {//Last Layer. Only move up
		i = N
	}

	// Hard lower limit
	if (options.lower === 'hard' && i !== N && firstLayer === 0) {//First Layer. Keep N=0, only move down
		N = 0
	}

	while (i <= N) {
		let eD = 0

		squares.forEach((s, k) => {
			if (k === 0 || k === squares.length - 1) {//First or last
				eD += Math.pow(s + i, 2)
			}
			else {//Middle
				eD += 2 * ( Math.pow(s + i, 2) )
			}
		})
		if (eD < best.eD) {
			best = {
				i: i,
				eD: eD
			}
		}
		i++
	}

	//Apply the best configuration to the original set
	const newBoundaries = [...boundaries]
	const newSquares = squares.map(s => s += best.i)

	for (let s of newSquares) {
		newBoundaries[firstLayer] -= s
		firstLayer++
	}

	return newBoundaries
}

const getInitialBoundaries = (initBoundaries: number[]): number[][] => {
	const boundaries: number[] = [...initBoundaries]
	let layers: number[] = []

	boundaries.forEach((b, i) => {
		if (i < boundaries.length - 1) {
			layers.push(boundaries[i + 1] - boundaries[i])
		}
	})

	return [boundaries, layers]
}

const expandStaticLayers = (initBoundaries: number[], minHeight: number, options: Options): number[] => {
	let [boundaries, layers] = getInitialBoundaries(initBoundaries)

	//Find first skinny layer
	let firstLayer = layers.findIndex((l: number) => l < minHeight)

	if (firstLayer < 0) {//All Good, returning!
		return boundaries
	}

	//set = actual numbers to expand
	let set: number[] = [ layers[firstLayer] ]

	//delta = extra space needed per number
	let delta: number[] = []

	let nextLayer = firstLayer + 1

	while (nextLayer < layers.length) {
		let currentHeight = minHeight

		if (layers[nextLayer] <= currentHeight) {
			set.push(layers[nextLayer])
			nextLayer++
		}
		else {
			break
		}
	}

	//Find how much room is needed = N
	let N: number = set.length * minHeight

	set.forEach((s, i) => {
		delta[i] = minHeight - s
		N -= s
	})

	const newBoundaries = computeNewBoundaries(firstLayer, layers, boundaries, delta, set, N, options)

	return expandStaticLayers(newBoundaries, minHeight, options)
}

const expandArrayLayers = (initBoundaries: number[], minHeight: number[], options: Options): number[] => {
	let [boundaries, layers] = getInitialBoundaries(initBoundaries)

	//Find first skinny layer
	let firstLayer = layers.findIndex((l: number, i: number) => {
		return l < minHeight[i]
	})

	if (firstLayer < 0) {//All Good, returning!
		return boundaries
	}

	//set = actual numbers to expand
	let set: number[] = [ layers[firstLayer] ]

	//delta = extra space needed per number
	let delta: number[] = []

	let nextLayer = firstLayer + 1

	while (nextLayer < layers.length) {
		let currentHeight = minHeight[nextLayer]

		if (layers[nextLayer] <= currentHeight) {
			set.push(layers[nextLayer])
			nextLayer++
		}
		else {
			break
		}
	}

	//Find how much room is needed = N
	let N: number = minHeight.slice(firstLayer, firstLayer + set.length).reduce((a, b) => a + b, 0)

	set.forEach((s, i) => {
		delta[i] = minHeight[firstLayer + i] - s
		N -= s
	})

	const newBoundaries = computeNewBoundaries(firstLayer, layers, boundaries, delta, set, N, options)

	return expandArrayLayers(newBoundaries, minHeight, options)
}

const expandLayers = (initBoundaries: number[], minHeight: number | number[] = 20, options: Options = defaultOptions): number[] => {
	const opts: Options = {
		...defaultOptions,
		...options
	}

	if (minHeight instanceof Array) {
		return expandArrayLayers(initBoundaries, minHeight, opts)
	}
	else {
		return expandStaticLayers(initBoundaries, minHeight, opts)
	}
}

export default expandLayers
