/**
 * Module for the ResourceController.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

// import jwt from 'jsonwebtoken'
// import fetch from 'node-fetch'
import createError from 'http-errors'
import { Record } from '../../models/records.js'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import firebase from 'firebase-admin'
import firebaseConfig from '../../config/firebase-config.js'

/**
 * Encapsulates a controller.
 */
export class ResourceController {
  /**
   * Authenticates requests.
   *
   * If authentication is successful, `req.user`is populated and the
   * request is authorized to continue.
   * If authentication fails, an unauthorized response will be sent.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authenticate (req, res, next) {
    try {
      // console.log('HELLO AUTH')
      // console.log(req.headers.authorization)
      if (firebase.apps.length === 0) {
        initializeApp({
          credential: firebase.credential.cert(firebaseConfig)
        })
        console.log(req.headers.authorization)
      }

      console.log('!!!!!!!!!!!!!!!')

      const header = req.headers?.authorization

      if (header !== 'Bearer null' && req.headers?.authorization?.startsWith('Bearer ')) {
        console.log('HÄÄÄÄÄR')
        const idToken = req.headers.authorization.split('Bearer ')[1]
        const decodedToken = await getAuth().verifyIdToken(idToken)
        console.log(decodedToken)
        next()
      }
    } catch (err) {
      console.log(err)
      const error = createError(401)
      error.cause = err
      next(error)
    }
  }

  /**
   * Get records.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllRecords (req, res, next) {
    try {
      console.log('GET ALL RECORDS!')
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
    console.log('SPECIFIK SKIVA!')
    try {
      const record = await Record.findById(req.params.id)
      console.log(req.params.id)
      // if (req.user.id === record[0].userId) {
      if (record.id.length > 0 && record.id !== null) {
        res.status(200).send(record)
      } else {
        next(createError(404, 'The requested resource was not found.'))
      }
      // } else {
      //   next(createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'))
      // }
    } catch (error) {
      console.log(error)
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
        format: req.body.format,
        coverURL: req.body.coverURL
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

  /**
   * Patch specific image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async patchRecord (req, res, next) {
    try {
      const record = await Record.findById(req.params.id)
      // console.log(record)
      // if (req.user.id === record[0].userId) {
      if (record !== null) {
        const recordObj = {
          artist: req.body.artist,
          recordTitle: req.body.recordTitle,
          releaseYear: req.body.releaseYear,
          format: req.body.format,
          coverURL: req.body.coverURL
        }

        const newRecordData = await Record.findByIdAndUpdate(record, recordObj, { runValidators: true })
        await newRecordData.save()

        res.sendStatus(204)
      } else {
        next(createError(404, 'The requested resource was not found.'))
      }
      // } else {
      //   next(createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'))
      // }
    } catch (error) {
      let err = error
      if (err.name === 'ValidationError') {
        err = createError(400)
      }

      next(err)
    }
  }

  /**
   * Delete specific record.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteRecord (req, res, next) {
    try {
      const record = await Record.findById(req.params.id)
      // if (req.user.id === record[0].userId) {
      if (record !== null) {
        await Record.findByIdAndDelete(record)
        res.status(204).send('Record has been deleted!')
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
}
