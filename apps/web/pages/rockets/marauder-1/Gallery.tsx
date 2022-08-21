import {Box, Stack} from '@mantine/core'
import ImageGallery, {ReactImageGalleryItem} from 'react-image-gallery'
import imageA from './images/a.jpg'
import imageB from './images/b.jpg'
import imageC from './images/c.jpg'
import imageD from './images/d.jpg'
import imageE from './images/e.jpg'
import imageF from './images/f.jpg'
import imageG from './images/g.jpg'
import launchSiteImage from './images/launch_site.jpg'
import {useMarauder1Styles} from './index.page'
import {memo} from 'react'
import Image from 'next/image'

export default function Gallery() {
  const {classes} = useMarauder1Styles()

  return <Stack align={'center'} className={classes.blackSectionBackground}>
    <Box p={32} sx={{
      width: '100%',
      maxWidth: 800,
    }}>
      <ImageGallery
        showPlayButton={false}
        showFullscreenButton={false}
        items={[
          imageA,
          imageB,
          imageC,
          imageD,
          imageE,
          imageF,
          imageG,
          launchSiteImage,
        ].map(img => ({
          original: img.src,
          thumbnail: img.blurDataURL,
          originalWidth: img.width,
          originalHeight: img.height,
        }))}
        renderItem={props => <ImageGalleryItem {...props} />}
        renderThumbInner={props => <ImageGalleryItem isThumbnail {...props} />}
      />
    </Box>
  </Stack>
}


const ImageGalleryItem = memo(function ImageGalleryItem(props: ReactImageGalleryItem & { isThumbnail?: boolean }) {
  const imageData = {
    src: props.original!,
    blurDataURL: props.thumbnail!,
    width: props.originalWidth!,
    height: props.originalHeight!,
  }

  return <Box>
    <Image
      src={imageData}
      placeholder={'blur'}
      layout={'responsive'}
      sizes={props.isThumbnail ? '10vw' : undefined}
    />
  </Box>
})