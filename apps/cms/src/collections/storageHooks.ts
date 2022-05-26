import path from 'path'
import {nanoid} from 'nanoid'
import {getStorage} from 'firebase-admin/storage'
import {AfterDeleteHook, AfterReadHook, BeforeChangeHook} from 'payload/dist/collections/config/types'

const bucketName = 'macrocketry-staging'
const bucket = getStorage().bucket(bucketName)

export const storageBeforeChange: BeforeChangeHook = async ({data, req, operation, originalDoc}) => {
  const file = req.files.file
  const {ext} = path.parse(file.name)
  const ref = `images/${nanoid()}${ext}`
  await bucket.file(ref).save(req.files.file.data)
  data.ref = ref
  if (operation === 'update' && originalDoc.ref) {
    await bucket.file(originalDoc.ref).delete()
  }
  return data
}

export const storageAfterRead: AfterReadHook = async ({doc, req, query}) => {
  if (doc.ref) doc.url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(doc.ref)}?alt=media`
  return doc
}

export const storageAfterDelete: AfterDeleteHook = async ({req, id, doc}) => {
  console.log(doc)
  if (doc.ref) {
    await bucket.file(doc.ref).delete()
  }
}