/**
 * The starting point of the application.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import logger from 'morgan'
import helmet from 'helmet'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
import cors from 'cors'

try {
  await connectDB()

  const app = express()
  app.use(cors())

  // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
  app.use(helmet())

  // Set up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // Parse requests of the content type application/json.
  app.use(express.json({ limit: '500kb' }))

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use(function (err, req, res, next) {
    console.log(err.status)
    err.status = err.status || 500

    if (err.status === 401) {
      return res
        .status(401)
        .json({
          status_code: 401,
          message: 'Access token invalid or not provided.'
        })
    } else if (err.status === 403) {
      return res
        .status(403)
        .json({
          status_code: 403,
          message: 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'
        })
    } else if (err.status === 404) {
      return res
        .status(404)
        .json({
          status_code: 404,
          message: 'The requested resource was not found.'
        })
    }

    if (req.app.get('env') !== 'development') {
      return res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })
    }
  })

  // Starts the HTTP server listening for connections.
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
