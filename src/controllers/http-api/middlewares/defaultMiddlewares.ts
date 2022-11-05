import express from 'express';
import cors from 'cors';
import process from 'process';


export default [
  {
    method: 'middleware',
    handler: express.json()
  },
  {
    method: 'middleware',
    handler: express.urlencoded({ extended: true })
  },
  {
    method: 'middleware',
    handler: cors({origin:process.env.FRONTEND_URL})
  }
]
