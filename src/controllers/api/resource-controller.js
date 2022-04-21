/**
 * Module for the ResourceController.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

// import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import createError from 'http-errors'
import { Record } from '../../models/records.js'

/**
 * Encapsulates a controller.
 */
export class ResourceController {
//   /**
//    * Authenticates requests.
//    *
//    * If authentication is successful, `req.user`is populated and the
//    * request is authorized to continue.
//    * If authentication fails, an unauthorized response will be sent.
//    *
//    * @param {object} req - Express request object.
//    * @param {object} res - Express response object.
//    * @param {Function} next - Express next middleware function.
//    */
// authenticateJWT = (req, res, next) => {
//   try {
//     const publicKey = Buffer.from(process.env.ACCESS_TOKEN_SECRET, 'base64')
//     const [authenticationScheme, token] = req.headers.authorization?.split(' ')

//     if (authenticationScheme !== 'Bearer') {
//       next(createError(400, 'The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).'))
//     }

//     const payload = jwt.verify(token, publicKey)
//     req.user = {
//       username: payload.sub,
//       firstName: payload.given_name,
//       lastName: payload.family_name,
//       email: payload.email,
//       id: payload.id
//     }

//     next()
//   } catch (err) {
//     const error = createError(401)
//     error.cause = err
//     next(error)
//   }
// }

/**
 * Get images.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async getAllRecords (req, res, next) {
    try {
      // const records = await Record.find({ userId: req.user.id })
      const records = await Record.find()
      if (records !== null) {
        res.status(200).send(records)
      } else {
        res.status(404)
      }
    } catch (error) {
      console.log(error)
      const err = createError(500, 'An unexpected condition was encountered.')
      err.cause = error

      next(err)
    }
  }

/**
 * Get specific record.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async getRecord (req, res, next) {
    console.log(req.params.id)
    try {
      const record = await Record.findById(req.params.id)
      console.log('Kommer vi in hit?')
      console.log(record.id)
      // if (req.user.id === record[0].userId) {
        if (record.id.length > 0 && record.id !== null) {
          console.log('Kommer vi in i if-statsen?')
          res.status(200).send(record)
        } else {
          next(createError(404, 'The requested resource was not found.'))
        }
      // } else {
      //   next(createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'))
      // }
    } catch (error) {
      const err = createError(500, 'An unexpected condition was encountered.')
      err.cause = error

      next(err)
    }
  }

/**
 * Post record.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async addRecord (req, res, next) {
    console.log('add record')
    try {
      const record = new Record({
        artist: req.body.artist,
        recordTitle: req.body.recordTitle,
        releaseYear: req.body.releaseYear,
        format: req.body.format
      })

      await record.save()
      res.sendStatus(201)
    } catch (error) {
      console.log(error)
    }
  // try {
  //   if (req.body.data === undefined || req.body.contentType === undefined) {
  //     next(createError(400, 'The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).'))
  //   } else {
  //     const response = await fetch(process.env.IMAGE_RESOURCE_URL,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'x-API-Private-Token': process.env.PERSONAL_ACCESS_TOKEN
  //         },
  //         body: JSON.stringify(req.body)
  //       })
  //     const dataJSON = await response.json()

  //     const recordObj = new Image({
  //       recordId: dataJSON.id,
  //       artist: dataJSON.artist,
  //       recordTitle: dataJSON.recordTitle,
  //       recordYear: req.body.recordYear,
  //       userId: req.user.id
  //     })

  //     await recordObj.save()
  //     res.status(201).json(dataJSON)
  //   }
  // } catch (error) {
  //   console.log(error)
  //   const err = createError(500, 'An unexpected condition was encountered.')
  //   err.cause = error

  //   next(err)
  // }
}

// /**
//  * Put specific image.
//  *
//  * @param {object} req - Express request object.
//  * @param {object} res - Express response object.
//  * @param {Function} next - Express next middleware function.
//  */
// async putRecord (req, res, next) {
//   try {
//     if (req.body.data === undefined || req.body.contentType === undefined) {
//       next(createError(400, 'The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).'))
//     } else {
//       const record = await Record.find({ recordId: req.params.id })
//       if (req.user.id === record[0].userId) {
//         if (record !== null) {
//           const recordObj = {
//             contentType: req.body.contentType,
//             description: req.body.description
//           }

//           await fetch(process.env.IMAGE_RESOURCE_URL + '/' + req.params.id,
//             {
//               method: 'PUT',
//               headers: {
//                 'Content-Type': 'application/json',
//                 'x-API-Private-Token': process.env.PERSONAL_ACCESS_TOKEN
//               },
//               body: JSON.stringify(recordObj)
//             })

//           const newRecordData = await Record.findByIdAndUpdate(record, recordObj, { runValidators: true })
//           await newRecordData.save()

//           res.sendStatus(204)
//         } else {
//           next(createError(404, 'The requested resource was not found.'))
//         }
//       } else {
//         next(createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'))
//       }
//     }
//   } catch (error) {
//     const err = createError(500, 'An unexpected condition was encountered.')
//     err.cause = error

//     next(err)
//   }
// }

// /**
//  * Patch specific image.
//  *
//  * @param {object} req - Express request object.
//  * @param {object} res - Express response object.
//  * @param {Function} next - Express next middleware function.
//  */
// async patchRecord (req, res, next) {
//   try {
//     const record = await Record.find({ recordId: req.params.id })
//     if (req.user.id === record[0].userId) {
//       if (record !== null) {
//         const recordObj = {
//           contentType: req.body.contentType,
//           description: req.body.description
//         }

//         await fetch(process.env.IMAGE_RESOURCE_URL + '/' + req.params.id,
//           {
//             method: 'PATCH',
//             headers: {
//               'Content-Type': 'application/json',
//               'x-API-Private-Token': process.env.PERSONAL_ACCESS_TOKEN
//             },
//             body: JSON.stringify(recordObj)
//           })

//         const newRecordData = await Record.findByIdAndUpdate(record, recordObj, { runValidators: true })
//         await newRecordData.save()

//         res.sendStatus(204)
//       } else {
//         next(createError(404, 'The requested resource was not found.'))
//       }
//     } else {
//       next(createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'))
//     }
//   } catch (error) {
//     let err = error
//     if (err.name === 'ValidationError') {
//       err = createError(400)
//     }

//     next(err)
//   }
// }

// /**
//  * Delete specific image.
//  *
//  * @param {object} req - Express request object.
//  * @param {object} res - Express response object.
//  * @param {Function} next - Express next middleware function.
//  */
// async deleteRecord (req, res, next) {
//   try {
//     const record = await Record.find({ recordId: req.params.id })
//     if (req.user.id === record[0].userId) {
//       if (record !== null) {
//         await Record.findByIdAndDelete(record[0])
//         res.status(204).send('Image has been deleted!')
//       } else {
//         next(createError(404, 'The requested resource was not found.'))
//       }
//     } else {
//       next(createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'))
//     }
//   } catch (error) {
//     const err = createError(500, 'An unexpected condition was encountered.')
//     err.cause = error

//     next(err)
//   }
// }
}
