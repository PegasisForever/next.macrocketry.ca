import {Box} from '@mantine/core'
import Image from 'next/image'
import {StaticImageData} from 'next/dist/client/image'

export function ResponsiveImageWrapper({src: image, maxHeight, maxWidth}: { src: StaticImageData, maxHeight: number, maxWidth: number }) {
  let scaledWidth: string | number = '100%'
  if (maxWidth > 0 && maxHeight > 0) {
    const containerRatio = maxWidth / maxHeight
    const imageRatio = image.width / image.height
    if (containerRatio > imageRatio) {
      const imageScale = image.height / maxHeight
      scaledWidth = image.width / imageScale
    }
  }

  return <Box style={{
    width: scaledWidth,
  }}>
    <Image
      src={image}
      sizes={`${scaledWidth}px`}
      placeholder={'blur'}
      layout={'responsive'}
      style={{
        borderRadius: 8,
      }}
      alt={''}
    />
  </Box>
}