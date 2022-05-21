/**
 * Module for the ResourceController.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

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
      if (firebase.apps.length === 0) {
        initializeApp({
          credential: firebase.credential.cert(firebaseConfig)
        })
      }

      const header = req.headers?.authorization

      if (header !== 'Bearer null' && req.headers?.authorization?.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1]
        await getAuth().verifyIdToken(idToken)
        next()
      } else {
        const error = createError(401)
        next(error)
      }
    } catch (err) {
      let error = err
      if (err.code === 'auth/argument-error' || err.code === 'auth/id-token-expired') {
        error = createError(401)
      }
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
    try {
      const record = await Record.findById(req.params.id)

      if (record.id.length > 0 && record.id !== null) {
        res.status(200).send(record)
      } else {
        next(createError(404, 'The requested resource was not found.'))
      }
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
  }

  /**
   * Patch specific record.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async patchRecord (req, res, next) {
    try {
      const record = await Record.findById(req.params.id)

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

      if (record !== null) {
        await Record.findByIdAndDelete(record)
        res.status(204).send('Record has been deleted!')
      } else {
        next(createError(404, 'The requested resource was not found.'))
      }
    } catch (error) {
      const err = createError(500, 'An unexpected condition was encountered.')
      err.cause = error

      next(err)
    }
  }
}
