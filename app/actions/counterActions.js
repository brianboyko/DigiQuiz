'use strict'
import { INCREMENT, DOUBLE, CLEAR } from '../constants/index';

export const incrementCounter = (value) => ({
  type: INCREMENT,
  value
})

export const doubleCounter = () => ({
  type: DOUBLE
})

export const clearCounter = () => ({
  type: CLEAR
})
