import * as Encoder from './_encoder'
import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'

describe('value/transform/Promise', () => {
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Type.Promise(Type.Number()))
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Encoder.Decode(T0, Promise.resolve(1))
    Assert.IsTrue(R instanceof Promise)
  })
  it('Should encode identity', () => {
    const R = Encoder.Encode(T0, Promise.resolve(1))
    Assert.IsTrue(R instanceof Promise)
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Encoder.Decode(T0, undefined))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T = Type.Transform(Type.Promise(Type.Number()))
    .Decode((value) => 1)
    .Encode((value) => Promise.resolve(1))
  it('Should decode mapped', () => {
    const R = Encoder.Decode(T, Promise.resolve(1))
    Assert.IsEqual(R, 1)
  })
  it('Should encode mapped', async () => {
    // Compare resolved values because each encoder creates a separate promise.
    const compiled = TypeCompiler.Compile(T).Encode(null)
    const interpreted = Value.Encode(T, null)
    Assert.IsTrue(compiled instanceof Promise)
    Assert.IsTrue(interpreted instanceof Promise)
    const values = await Promise.all([compiled, interpreted])
    Assert.IsEqual(values, [1, 1])
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Encoder.Decode(T, null))
  })
})
