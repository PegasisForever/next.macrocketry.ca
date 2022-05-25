import path from 'path'
import url from 'url'
import {createHash} from 'crypto'
import Downloader from 'nodejs-file-downloader'
import sharp from 'sharp'

export type ProcessedImage = { url: string, blurURL: string, width: number, height: number }

export async function prepareImageFromUrl(imageUrl: string): Promise<ProcessedImage> {
  const parsedPath = path.parse((new url.URL(imageUrl)).pathname)
  const fileName = createHash('md5').update(parsedPath.base).digest('hex') + parsedPath.ext
  const downloader = new Downloader({
    url: imageUrl,
    directory: './public/build',
    fileName,
    skipExistingFileName: true,
  })
  await downloader.download()

  const sharpImage = await sharp(`./public/build/${fileName}`)
  const {width, height} = await sharpImage.metadata()

  if (!width || !height) {
    return {
      url: '',
      blurURL: '',
      width: 0,
      height: 0,
    }
  }

  const blurredImageBuffer = await sharpImage
    .resize(10)
    .flatten({background: '#FFFFFF'})
    .jpeg({mozjpeg: true, quality: 75})
    .toBuffer()

  return {
    url: `/build/${fileName}`,
    blurURL: 'data:image/jpeg;base64,' + blurredImageBuffer.toString('base64'),
    width,
    height,
  }
}