import { expect } from 'chai'
import expand from '../src/index'

it('Two plus two', () => {
	expect(2 + 2).to.equal(4)
})

it('Should be [100, 120, 140]', () => {
  expect(expand([100, 120, 140])).to.eql([100, 120, 140])
})

it('Should be [100, 120, 140].2', () => {
  expect(expand([120, 130, 140], 20, { upper: 'hard' })).to.eql([100, 120, 140])
})

it('Should be [100, 120, 140].3', () => {
  expect(expand([100, 130, 140], 20, { upper: 'hard' })).to.eql([100, 120, 140])
})

it('Should be [120, 130, 140] (10)', () => {
  expect(expand([120, 130, 140], 10)).to.eql([120, 130, 140])
})

it('Should be [120, 130, 140] (10).2', () => {
  expect(expand([125, 130, 140], 10, { upper: 'hard' })).to.eql([120, 130, 140])
})

it('Should be [120, 130, 140] (10).3', () => {
  expect(expand([130, 131, 140], 10, { upper: 'hard' })).to.eql([120, 130, 140])
})

it('Should be [10, 120, 130, 140] (10)', () => {
  expect(expand([10, 120, 130, 140], 10, { upper: 'hard' })).to.eql([10, 120, 130, 140])
})

it('Should be [9, 19, 120, 130, 140] (10)', () => {
  expect(expand([9, 11, 135, 138, 140], 10, { upper: 'hard', lower: 'hard' })).to.eql([9, 19, 120, 130, 140])
})

it('Should be [1, 35, 45, 120, 130, 140] (10)', () => {
  expect(expand([1, 39, 41, 135, 138, 140], 10, { upper: 'hard' })).to.eql([1, 35, 45, 120, 130, 140])
})

it('Should be [10, 20, 35, 40]', () => {
	const nums = [10, 20, 30, 40]
	const heights = [10, 15, 5]

	expect(expand(nums, heights, { upper: 'hard', lower: 'hard' })).to.eql([10, 20, 35, 40])
})
