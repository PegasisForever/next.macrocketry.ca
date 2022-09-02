import {Box, Stack} from '@mantine/core'
import {memo, ReactNode, useEffect, useState} from 'react'
import Image from 'next/image'
import {Carousel, Embla} from '@mantine/carousel'
import {StaticImageData} from 'next/dist/client/image'
import {useMeasure} from 'react-use'

export default function Gallery({images, title, blur, className}: { images: StaticImageData[], title: ReactNode, blur?: boolean, className?: string }) {
  const [embla, setEmbla] = useState<Embla | null>(null)
  const [imageI, setImageI] = useState(0)

  useEffect(() => {
    if (embla) {
      const progressPerImage = 1 / (images.length - 1)
      const imageCenterProgressPoints = images.map((_, i) => ({
        i,
        progress: progressPerImage * i,
      }))
      const callback = () => {
        const progress = embla.scrollProgress()
        if (progress < 0) {
          setImageI(0)
        } else if (progress > 1) {
          setImageI(images.length - 1)
        } else {
          const i = imageCenterProgressPoints.sort((a, b) => {
            return Math.abs(a.progress - progress) - Math.abs(b.progress - progress)
          })[0].i
          setImageI(i)
        }
      }
      embla.on('scroll', callback)
      return () => embla.off('scroll', callback)
    }
    return () => {
    }
  }, [embla, images])

  return <Stack
    align={'center'}
    className={className}
    sx={[
      {
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
      blur ? {
        backgroundImage: `url("${images[imageI].blurDataURL}")`,
        backgroundSize: '100% 100%',
        transition: 'background 300ms linear',
      } : {},
    ]}>
    {title}
    <Box p={32} sx={{
      width: '100%',
      height: 'calc(100vh - 96px)',
      display: 'flex',
    }}>
      <Carousel getEmblaApi={setEmbla} withIndicators withControls slideGap={'md'} height="100%" sx={{flex: 1}}>
        {images.map(image => <Carousel.Slide key={image.src}>
          <ImageWrapper
            src={image}
          />
        </Carousel.Slide>)}
      </Carousel>
    </Box>
  </Stack>
}

const ImageWrapper = memo<{ src: StaticImageData }>(function ImageWrapper({src: image}) {
  const [ref, {width, height}] = useMeasure<HTMLDivElement>()
  let scaledWidth: string | number = '100%'
  if (width > 0 && height > 0) {
    const containerRatio = width / height
    const imageRatio = image.width / image.height
    if (containerRatio > imageRatio) {
      const imageScale = image.height / height
      scaledWidth = image.width / imageScale
    }
  }

  return <Box ref={ref} sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 8,
  }}>
    <Box style={{
      width: scaledWidth,
    }}>
      <Box
        component={Image}
        src={image}
        placeholder={'blur'}
        layout={'responsive'}
        sx={{
          borderRadius: 8,
        }}
      />
    </Box>
  </Box>
})
