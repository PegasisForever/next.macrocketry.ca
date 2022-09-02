import {m, MotionValue, useTransform} from 'framer-motion'
import {Box, Text, Title, useMantineTheme} from '@mantine/core'
import {createContext, PropsWithChildren, ReactNode, useContext, useEffect, useRef, useState} from 'react'
import {useBoundingclientrect} from 'rooks'
import {useWindowSize} from 'react-use'
import {ParallaxContainer} from './ParallaxContainer'

export function PCB3DSection(props: { scrollY: MotionValue<number> }) {
  const theme = useMantineTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastProgress = useRef<number>(0)
  const ref = useRef<HTMLDivElement>(null)
  const rect = useBoundingclientrect(ref)
  const containerWidth = rect?.width ?? 0

  const [parallaxStickBottom, setParallaxStickBottom] = useState(false)
  const [absoluteTop, setAbsoluteTop] = useState(0)

  const {height: windowHeight} = useWindowSize()
  const paddingLeft = 8
  const paddingRight = 8
  const imageWidth = containerWidth - paddingLeft - paddingRight
  const imageHeight = 1080 / (1920 / imageWidth)
  const paddingTop = (windowHeight - imageHeight) / 2
  const absoluteBottom = absoluteTop + (rect?.height ?? 0) + paddingTop

  const videoProgress = useTransform(props.scrollY, [absoluteTop, absoluteBottom - windowHeight], [0, 1])
  const textOpacity = useTransform(props.scrollY, [absoluteBottom - windowHeight - 100, absoluteBottom - windowHeight], [0, 0.999])

  useEffect(() => {
    if (rect) {
      const absoluteTop = rect.top + props.scrollY.get() - paddingTop
      setAbsoluteTop(absoluteTop)
    }
  }, [paddingTop, props.scrollY, rect])

  useEffect(() => videoProgress.onChange(p => {
    p = Math.round(p * 26) / 26
    if (videoRef.current && lastProgress.current !== p) {
      videoRef.current.currentTime = p
      lastProgress.current = p
    }
  }), [videoProgress])

  useEffect(() => props.scrollY.onChange(scrollY => {
    setParallaxStickBottom(scrollY + windowHeight > absoluteBottom)
  }), [absoluteBottom, props.scrollY, windowHeight])

  return <ParallaxContainer
    ref={ref}
    stickBottom={parallaxStickBottom}
    sx={{
      height: '130vh',
    }}
    innerSx={{
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom: paddingTop,
    }}
    noneParallax={<Box
      component={m.div}
      style={{
        opacity: textOpacity,
      } as any}
      sx={{
        color: theme.white,
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100vh',
      }}>
      <Box sx={{
        position: 'relative',
        marginLeft: paddingLeft,
        marginRight: paddingRight,
        marginTop: paddingTop,
        height: imageHeight,
      }}>
        <ComponentLabelContext.Provider value={{containerWidth, containerHeight: windowHeight}}>
          <ComponentLabel title={'E22-900M30S'} x={37} y={36} arrowDx={-75} arrowDy={-125} dividerWidth={230}>
            <Text>915Mhz Long Range Radio (LoRa)</Text>
            <Text>30db transmission power</Text>
            <Text>62kbps maximum bandwidth</Text>
          </ComponentLabel>
          <ComponentLabel title={'BMP280'} x={49} y={40} arrowDx={-50} arrowDy={-250} dividerWidth={160}>
            <Text>Pressure sensor</Text>
            <Text>100hz sampling rate</Text>
            <Text>9km maximum altitude</Text>
          </ComponentLabel>
          <ComponentLabel title={'MPU6050'} x={62.2} y={35} arrowDx={50} arrowDy={-150} dividerWidth={270}>
            <Text>6-axis inertial measurement unit (IMU)</Text>
            <Text>1000Hz sampling rate</Text>
            <Text>±16g max acceleration</Text>
          </ComponentLabel>
          <ComponentLabel title={'NEO-7M'} x={64} y={39.5} arrowDx={100} arrowDy={-50} dividerWidth={200}>
            <Text>GNSS receiver</Text>
            <Text>Supports GPS & GLONASS</Text>
            <Text>2m accuracy</Text>
          </ComponentLabel>
          <ComponentLabel title={'Raspberry Pi Zero 2 W'} x={58} y={54} arrowDx={-20} arrowDy={180} dividerWidth={270}>
            <Text>Single Board Computer (SBC)</Text>
            <Text>Running custom control software</Text>
            <Text>4 Cortex-A53 @ 1GHz</Text>
            <Text>Wi-Fi enabled</Text>
          </ComponentLabel>
          <ComponentLabel title={'LM2596'} x={37} y={54} arrowDx={-60} arrowDy={100} dividerWidth={200}>
            <Text>DC-DC switching regulator</Text>
            <Text>7-40V input voltage</Text>
            <Text>80% efficiency</Text>
          </ComponentLabel>
          <ComponentLabel title={<>Parachute E-Match<br/>Connector</>} x={34.3} y={48.5} arrowDx={-120} arrowDy={50} dividerWidth={190}>
            <Text>3A maximum current</Text>
          </ComponentLabel>
          <ComponentLabel title={<>GPIO & I<sup>2</sup>C<br/>Extension</>} x={62} y={48.5} arrowDx={100} arrowDy={150} dividerWidth={190}>
            <Text>TVC capable PWM output</Text>
          </ComponentLabel>
        </ComponentLabelContext.Provider>
      </Box>
    </Box>}
  >
    <video ref={videoRef} width={'100%'} loop muted playsInline>
      <source src={'/videos/3d.mp4'} type={'video/mp4'}/>
    </video>
  </ParallaxContainer>
}

const ComponentLabelContext = createContext<{ containerWidth: number, containerHeight: number } | undefined>(undefined)

function ComponentLabel({dividerWidth, arrowDx, arrowDy, ...props}: PropsWithChildren<{
  x: number,
  y: number,
  title: ReactNode,
  arrowDx: number,
  arrowDy: number,
  dividerWidth: number,
}>) {
  const theme = useMantineTheme()
  const {containerWidth, containerHeight} = useContext(ComponentLabelContext)!
  const dotSize = 8
  const strokeWidth = 2

  const xDirection = arrowDx > 0 ? 'right' : 'left'
  const yDirection = arrowDy > 0 ? 'down' : 'up'
  arrowDx = Math.abs(arrowDx)
  arrowDy = Math.abs(arrowDy)
  if (containerWidth !== 0 && containerHeight !== 0) {
    arrowDx *= Math.max(1, containerWidth / 1100)
    arrowDy *= Math.max(1, containerHeight / 1000)
  }

  const svgWidth = arrowDx + dividerWidth + dotSize / 2
  const svgHeight = arrowDy + dotSize / 2

  return <Box sx={{
    width: 0,
    height: 0,
    position: 'absolute',
    left: `calc(${props.x}% ${xDirection === 'left' ? '+' : '-'} ${dotSize / 2}px)`,
    top: `calc(${props.y}% ${yDirection === 'up' ? '+' : '-'} ${dotSize / 2}px)`,
  }}>
    <Box sx={{
      position: 'absolute',
      [xDirection === 'left' ? 'right' : 'left']: 0,
      [yDirection === 'up' ? 'bottom' : 'top']: 0,
      width: svgWidth,
      height: svgHeight,
    }}>
      <Box component={'svg'} sx={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
      }}>
        <Box
          component={'polyline'}
          points={`${xDirection === 'left' ? 0 : svgWidth},${yDirection === 'up' ? (strokeWidth / 2) : (svgHeight - strokeWidth / 2)} ` +
            `${xDirection === 'left' ? dividerWidth : (svgWidth - dividerWidth)},${yDirection === 'up' ? (strokeWidth / 2) : (svgHeight - strokeWidth / 2)} ` +
            `${xDirection === 'left' ? (dividerWidth + arrowDx) : (dotSize / 2)},${yDirection === 'up' ? arrowDy : (dotSize / 2)}`}
          sx={{
            strokeWidth,
            stroke: theme.colors.gray[6],
            fill: 'transparent',
          }}
        />
        <Box
          component={'circle'}
          cx={xDirection === 'left' ? (arrowDx + dividerWidth) : (dotSize / 2)}
          cy={yDirection === 'up' ? (arrowDy) : (dotSize / 2)}
          r={dotSize / 2}
          sx={{
            fill: theme.white,
          }}
        />
      </Box>
      <Title order={3} sx={{
        position: 'absolute',
        left: xDirection === 'left' ? 0 : (svgWidth - dividerWidth + 4),
        bottom: yDirection === 'up' ? svgHeight : strokeWidth,
        fontWeight: 500,
      }}>
        {props.title}
      </Title>
      <Box sx={{
        position: 'absolute',
        left: xDirection === 'left' ? 0 : (svgWidth - dividerWidth + 4),
        top: yDirection === 'up' ? strokeWidth : svgHeight,
      }}>
        {props.children}
      </Box>
    </Box>
  </Box>
}