import {Box, createStyles, Text, Title, useMantineTheme} from '@mantine/core'
import {createContext, Dispatch, forwardRef, PropsWithChildren, RefObject, SetStateAction, useContext, useEffect, useRef, useState} from 'react'
import {useMeasure, useWindowSize} from 'react-use'
import {m, useTransform} from 'framer-motion'
import {useMergedRef} from '@mantine/hooks'
import {ScrollContext} from '../../contexts'
import {MotionValue} from 'framer-motion/types/value'

const LaunchProfileStepContext = createContext<{ minStepHeight: number, setMinStepHeight: Dispatch<SetStateAction<number>> } | undefined>(undefined)

const LaunchProfile = forwardRef<HTMLDivElement | null>(function LaunchProfile(props, ref) {
  const theme = useMantineTheme()
  const [firstRef, {height: firstHeight}] = useMeasure<HTMLDivElement>()
  const [lastRef, {height: lastHeight}] = useMeasure<HTMLDivElement>()
  const [minStepHeight, setMinStepHeight] = useState(0)

  return <LaunchProfileStepContext.Provider value={{minStepHeight, setMinStepHeight}}>
    <Box
      ref={ref}
      style={{
        paddingTop: `calc(50vh - ${firstHeight / 2 + 32}px)`,
        paddingBottom: `calc(50vh - ${lastHeight / 2 + 32}px)`,
      }}
      sx={{
        background: theme.colors.gray[9],
        color: theme.white,
      }}>
      <LaunchProfileStep ref={firstRef} first title={'Ground Handling'}>
        All components have been assembled and the rocket is standing on the launch pad. All the electronics are armed and live telemetry is established.
      </LaunchProfileStep>
      <LaunchProfileStep title={'Ignition'}>
        The ignition signal is sent from the launch control and the propellant has been successfully ignited.
      </LaunchProfileStep>
      <LaunchProfileStep title={'Powered flight'}>
        The rocket experiences up to 10G of acceleration. The avionics keeps tracking the position of the rocket by reading sensor data at over 1000Hz.
        The rocket will reach a maximum velocity of 853ft/s
      </LaunchProfileStep>
      <LaunchProfileStep title={'Coasting'}>
        The motor burns out and the rocket continues to accent until apogee. The avionics acknowledge the burnout and keep tracking the rocket position.
      </LaunchProfileStep>
      <LaunchProfileStep title={'Apogee & Payload Deployment'}>
        The rocket reaches a height of 3km or 10000ft. The avionics sends an electric signal to the payload to start the experiment.
      </LaunchProfileStep>
      <LaunchProfileStep title={'Drogue Decent'}>
        The avionics send large amount of current through the E-match which ignites the black powder ejection system. The drone chute is deployed to slow the rocket down to 27m/s
        or
        88ft/s.
      </LaunchProfileStep>
      <LaunchProfileStep title={'Main Descent'}>
        The main parachute is deployed when the rocket descended to 457m or 1500ft AGL. Further slows the rocket to a constant descent speed of 6m/s or 20ft/s
      </LaunchProfileStep>
      <LaunchProfileStep ref={lastRef} last title={'Touchdown'}>
        The rocket contacts the ground, avionics will send the rocket position over live telemetry and activate its buzzer to help recovery.
      </LaunchProfileStep>
    </Box>
  </LaunchProfileStepContext.Provider>
})

export default LaunchProfile

const stepPadding = 64

const useStyles = createStyles(theme => ({
  launchProfileStep: {
    paddingTop: stepPadding,
    paddingBottom: stepPadding,
    maxWidth: 600,
    scrollSnapAlign: 'center',
  },
}))

const LaunchProfileStep = forwardRef<HTMLDivElement, PropsWithChildren<{ title: string, first?: boolean, last?: boolean }>>(function LaunchProfileStep(props, ref) {
  const {classes} = useStyles()
  const {minStepHeight, setMinStepHeight} = useContext(LaunchProfileStepContext)!
  const {scrollY} = useContext(ScrollContext)!
  const localRef = useRef<HTMLDivElement>(null)
  const [localMeasureRef, {height}] = useMeasure<HTMLDivElement>()
  const {start, end} = useRefScrollProgress(localRef, minStepHeight + stepPadding * 2, scrollY)
  const opacity = useTransform(scrollY, [start, (start + end) / 2, end], [props.first ? 1 : 0, 1, props.last ? 1 : 0])

  useEffect(() => {
    if (height !== 0 && (minStepHeight === 0 || height < minStepHeight)) {
      setMinStepHeight(height)
    }
  }, [height, minStepHeight, setMinStepHeight])

  // @ts-ignore
  const mergedRef = useMergedRef(ref, localRef, localMeasureRef)

  return <m.div ref={mergedRef} className={classes.launchProfileStep} style={{opacity}}>
    <Title order={2} sx={{
      fontWeight: 500,
      fontSize: 40,
    }}>
      {props.title}
    </Title>
    <Text size={'lg'}>
      {props.children}
    </Text>
  </m.div>
})

export function useRefScrollProgress<E extends Element = Element>(ref: RefObject<E>, elementHeight: number, scrollY: MotionValue<number>) {
  const [start, setStart] = useState<number>(0)
  const [end, setEnd] = useState<number>(1)
  const {height: windowHeight} = useWindowSize()

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const absoluteTop = rect.top + scrollY.get()
      const start = absoluteTop - windowHeight / 2 - elementHeight / 2
      const end = start + elementHeight * 2
      setStart(start)
      setEnd(end)
    }
  }, [elementHeight, ref, scrollY, windowHeight])
  return {start, end}
}

