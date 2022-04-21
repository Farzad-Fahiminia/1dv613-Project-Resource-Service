/**
 * Mongoose model Record.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  artist: {
    type: String,
    required: true
  },
  recordTitle: {
    type: String,
    required: true
  },
  releaseYear: {
    type: String,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    immutable: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true, // ensure virtual fields are serialized
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret.__v
      delete ret._id
    }
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const Record = mongoose.model('Record', schema)
