import {Box, createStyles, Stack, Text, Title} from '@mantine/core'
import {createContext, Dispatch, forwardRef, PropsWithChildren, RefObject, SetStateAction, useContext, useEffect, useRef, useState} from 'react'
import {useMeasure, useWindowSize} from 'react-use'
import {animate, AnimatePresence, AnimationPlaybackControls, m, MotionValue, useTransform} from 'framer-motion'
import {useMergedRef} from '@mantine/hooks'
import {ScrollContext} from '../../contexts'
import Marauder1Title from './Marauder1Title'
import flightProfileBackground from './images/flight_profile_background.svg'
import flightProfileGroundHandling from './images/flight_profile_ground_handling.svg'
import flightProfileIgnition from './images/flight_profile_ignition.svg'
import flightProfilePoweredFlight from './images/flight_profile_powered_flight.svg'
import flightProfileCoasting from './images/flight_profile_coasting.svg'
import flightProfileApogee from './images/flight_profile_apogee.svg'
import flightProfileDrogue from './images/flight_profile_drogue.svg'
import flightProfileMainDescent from './images/flight_profile_main_descent.svg'
import flightProfileTouchdown from './images/flight_profile_touchdown.svg'
import {useMarauder1Styles} from './index.page'


const LaunchProfileStepContext = createContext<{ stepI: number, minStepHeight: number, setMinStepHeight: Dispatch<SetStateAction<number>>, setStepCenterYs: Dispatch<SetStateAction<number[]>> } | undefined>(undefined)

const flightProfileData = [
  {
    image: flightProfileGroundHandling,
    t: 0,
    altitude: 0,
    speed: 0,
  },
  {
    image: flightProfileIgnition,
    t: 0,
    altitude: 0,
    speed: 0,
  },
  {
    image: flightProfilePoweredFlight,
    t: 6,
    altitude: 900,
    speed: 260,
  },
  {
    image: flightProfileCoasting,
    t: 15,
    altitude: 2500,
    speed: 110,
  },
  {
    image: flightProfileApogee,
    t: 30,
    altitude: 3000,
    speed: 0,
  },
  {
    image: flightProfileDrogue,
    t: 31,
    altitude: 2900,
    speed: 27,
  },
  {
    image: flightProfileMainDescent,
    t: 107,
    altitude: 457,
    speed: 6,
  },
  {
    image: flightProfileTouchdown,
    t: 180,
    altitude: 0,
    speed: 0,
  },
]

const stepPadding = 64

const useStyles = createStyles(theme => {
  const stepIndicatorPadding = 16
  const stepIndicatorSize = 8
  const stepIndicatorWidth = stepIndicatorPadding * 2 + stepIndicatorSize
  const imageAndDataPercentageWidth = 60
  const flightDataDisplayWidth = 270


  return {
    launchProfileStep: {
      paddingTop: stepPadding,
      paddingBottom: stepPadding,
      scrollSnapAlign: 'center',
    },
    flightProfileNumberText: {
      fontSize: 32,
    },
    flightProfileNumberSpan: {
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 500,
    },
    stepIndicatorWrapper: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      right: stepIndicatorPadding,

      '& > div': {
        width: stepIndicatorSize,
        height: stepIndicatorSize,
        borderRadius: '100%',
        transition: 'background-color 300ms',
        transitionTimingFunction: 'linear',
      },
    },
    launchProfileStepWrapper: {
      marginLeft: `calc(${imageAndDataPercentageWidth}% - ${stepIndicatorWidth}px)`,
      marginRight: stepIndicatorWidth,
      maxWidth: 700,
    },
    flightDataDisplay: {
      position: 'absolute',
      width: flightDataDisplayWidth,
      top: '50%',
      transform: 'translateY(-50%)',
      right: `calc(${100 - imageAndDataPercentageWidth}% + ${stepIndicatorWidth}px + 32px)`,
    },
    flightImageWrapper: {
      backgroundImage: `url("${flightProfileBackground.src}")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 50%',
      backgroundSize: 'contain',
      position: 'relative',
      flexGrow: 1,
      marginLeft: 32,
      marginBottom: 32,
      width: `calc(100% - ${32 * 2}px - ${100 - imageAndDataPercentageWidth}% - ${stepIndicatorWidth}px - 32px - ${flightDataDisplayWidth}px)`,

      '& > div': {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 50%',
        backgroundSize: 'contain',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  }
})

const FlightProfile = forwardRef<HTMLDivElement | null>(function LaunchProfile(props, ref) {
  const {classes, theme} = useStyles()
  const {classes: mClasses} = useMarauder1Styles()
  const [firstRef, {height: firstHeight}] = useMeasure<HTMLDivElement>()
  const [lastRef, {height: lastHeight}] = useMeasure<HTMLDivElement>()
  const [minStepHeight, setMinStepHeight] = useState(0)
  const [stepCenterYs, setStepCenterYs] = useState<number[]>(flightProfileData.map(() => 0))
  const scrollY = useContext(ScrollContext)!
  const [stepI, setStepI] = useState(0)

  useEffect(() => {
    return scrollY.onChange(y => {
      const list = stepCenterYs.map((center, i) => ({i, center}))
      list.sort((a, b) => Math.abs(a.center - y) - Math.abs(b.center - y))
      setStepI(list[0].i)
    })
  }, [scrollY, stepCenterYs])

  return <LaunchProfileStepContext.Provider value={{stepI, minStepHeight, setMinStepHeight, setStepCenterYs}}>
    <Box
      ref={ref}
      className={mClasses.blackSectionBackground}
      sx={{
        position: 'relative',
      }}>
      <Stack spacing={0} align={'flex-start'} sx={{
        position: 'sticky',
        top: 0,
        left: 0,
        height: '100vh',
      }}>
        <StepIndicator stepCenterYs={stepCenterYs}/>
        <FlightDataDisplay/>
        <Marauder1Title sx={{
          paddingLeft: 64,
          paddingTop: 64,
        }}>
          Flight Profile
        </Marauder1Title>
        <FlightImage/>
      </Stack>

      <Box sx={{
        height: `calc(50vh - ${firstHeight / 2 + stepPadding - 1}px)`,
        marginTop: '-100vh',
      }}/>
      <Box className={classes.launchProfileStepWrapper}>
        <LaunchProfileStep i={0} ref={firstRef} first title={'Ground Handling'}>
          All components have been assembled and the rocket is standing on the launch pad. All the electronics are armed and live telemetry is established.
        </LaunchProfileStep>
        <LaunchProfileStep i={1} title={'Ignition'}>
          The ignition signal is sent from the launch control and the propellant has been successfully ignited.
        </LaunchProfileStep>
        <LaunchProfileStep i={2} title={'Powered Flight'}>
          The rocket experiences up to 10G of acceleration. The avionics keeps tracking the position of the rocket by reading sensor data at over 1000Hz.
          The rocket will reach a maximum velocity of 853ft/s
        </LaunchProfileStep>
        <LaunchProfileStep i={3} title={'Coasting'}>
          The motor burns out and the rocket continues to accent until apogee. The avionics acknowledge the burnout and keep tracking the rocket position.
        </LaunchProfileStep>
        <LaunchProfileStep i={4} title={'Apogee & Payload Deployment'}>
          The rocket reaches a height of 3km or 10000ft. The avionics sends an electric signal to the payload to start the experiment.
        </LaunchProfileStep>
        <LaunchProfileStep i={5} title={'Drogue Decent'}>
          The avionics send large amount of current through the E-match which ignites the black powder ejection system. The drone chute is deployed to slow the rocket down to 27m/s
          or
          88ft/s.
        </LaunchProfileStep>
        <LaunchProfileStep i={6} title={'Main Descent'}>
          The main parachute is deployed when the rocket descended to 457m or 1500ft AGL. Further slows the rocket to a constant descent speed of 6m/s or 20ft/s
        </LaunchProfileStep>
        <LaunchProfileStep i={7} ref={lastRef} last title={'Touchdown'}>
          The rocket contacts the ground, avionics will send the rocket position over live telemetry and activate its buzzer to help recovery.
        </LaunchProfileStep>
      </Box>
      <Box sx={{
        height: `calc(50vh - ${lastHeight / 2 + stepPadding - 1}px)`,
      }}/>
    </Box>
  </LaunchProfileStepContext.Provider>
})

export default FlightProfile

function StepIndicator(props: { stepCenterYs: number[] }) {
  const {classes, theme} = useStyles()
  const {stepI} = useContext(LaunchProfileStepContext)!

  return <Stack spacing={6} className={classes.stepIndicatorWrapper}>
    {props.stepCenterYs.map((_, i) => <Box key={i} sx={{
      backgroundColor: stepI === i ? theme.colors.gray[2] : theme.colors.gray[6],
    }}/>)}
  </Stack>
}

function FlightDataDisplay() {
  const {classes} = useStyles()
  const {stepI} = useContext(LaunchProfileStepContext)!
  const interpolatedT = useInterpolatedValue(flightProfileData[stepI].t)
  const interpolatedAltitude = useInterpolatedValue(flightProfileData[stepI].altitude)
  const interpolatedSpeed = useInterpolatedValue(flightProfileData[stepI].speed)

  return <Box className={classes.flightDataDisplay}>
    <Text className={classes.flightProfileNumberText}>
      T
      <span className={classes.flightProfileNumberSpan}>
        {(stepI === 0 && interpolatedT === 0) ? '-' : '+'}
        {interpolatedT.toFixed(1)}
      </span>
    </Text>
    <Text className={classes.flightProfileNumberText}>
      {'ALT: '}
      <span className={classes.flightProfileNumberSpan}>
        {interpolatedAltitude.toFixed(1)}
      </span>
      m
    </Text>
    <Text className={classes.flightProfileNumberText}>
      {'SPEED: '}
      <span className={classes.flightProfileNumberSpan}>
        {interpolatedSpeed.toFixed(1)}
      </span>
      m/s
    </Text>
  </Box>
}

function FlightImage() {
  const {classes} = useStyles()
  const {stepI} = useContext(LaunchProfileStepContext)!

  return <Box className={classes.flightImageWrapper}>
    <AnimatePresence>
      <m.div
        key={stepI}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        style={{
          backgroundImage: `url("${flightProfileData[stepI].image.src}")`,
        }}/>
    </AnimatePresence>
  </Box>
}

const LaunchProfileStep = forwardRef<HTMLDivElement, PropsWithChildren<{ title: string, i: number, first?: boolean, last?: boolean }>>(function LaunchProfileStep(props, ref) {
  const {classes} = useStyles()
  const {minStepHeight, setMinStepHeight, setStepCenterYs} = useContext(LaunchProfileStepContext)!
  const scrollY = useContext(ScrollContext)!
  const localRef = useRef<HTMLDivElement>(null)
  const [localMeasureRef, {height}] = useMeasure<HTMLDivElement>()
  const points = useRefScrollProgress(localRef, minStepHeight + stepPadding * 2, scrollY)
  const midPoint = points[1]
  const opacity = useTransform(scrollY, points, [props.first ? 1 : 0.2, 1, props.last ? 1 : 0.2])

  useEffect(() => {
    if (height !== 0) {
      setMinStepHeight(minStepHeight => {
        if (minStepHeight === 0 || height < minStepHeight) {
          return height
        }
        return minStepHeight
      })
    }
  }, [height, setMinStepHeight])

  useEffect(() => {
    if (height !== 0) {
      setStepCenterYs(ys => {
        const newYs = [...ys]
        newYs[props.i] = midPoint
        return newYs
      })
    }
  }, [height, midPoint, props.i, setStepCenterYs])

  // @ts-ignore
  const mergedRef = useMergedRef(ref, localRef, localMeasureRef)

  return <m.div ref={mergedRef} className={classes.launchProfileStep} style={{opacity}}>
    <Title order={2} sx={{
      fontWeight: 500,
      fontSize: 40,
    }}>
      {props.title}
    </Title>
    <Text size={'lg'} mt={4}>
      {props.children}
    </Text>
  </m.div>
})

export function useRefScrollProgress<E extends Element = Element>(ref: RefObject<E>, minElementHeight: number, scrollY: MotionValue<number>) {
  const [start, setStart] = useState<number>(0)
  const [end, setEnd] = useState<number>(1)
  const {height: windowHeight} = useWindowSize()

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const absoluteTop = rect.top + scrollY.get()
      const start = absoluteTop - windowHeight / 2 - minElementHeight / 2
      const end = start + minElementHeight + rect.height
      setStart(start)
      setEnd(end)
    }
  }, [minElementHeight, ref, scrollY, windowHeight])
  return [
    start,
    (start + end) / 2,
    end,
  ]
}

function useInterpolatedValue(value: number) {
  const [interpolatedValue, setInterpolatedValue] = useState(value)
  const activeAnimation = useRef<AnimationPlaybackControls>()

  useEffect(() => {
    if (activeAnimation.current) {
      activeAnimation.current.stop()
    }

    activeAnimation.current = animate(interpolatedValue, value, {
      type: 'tween',
      ease: 'linear',
      duration: 1,
      onUpdate: setInterpolatedValue,
    })
  }, [value])

  return interpolatedValue
}