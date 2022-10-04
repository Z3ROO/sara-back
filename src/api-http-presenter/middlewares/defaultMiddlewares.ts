import express from 'express';

export default [
  {
    method: 'middleware',
    handler: express.json()
  },
  {
    method: 'middleware',
    handler: express.urlencoded({ extended: true })
  }
]
