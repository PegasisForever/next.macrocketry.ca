import {createContext} from 'react'
import {MotionValue} from 'framer-motion/types/value'

export const ScrollContext = createContext<MotionValue<number> | undefined>(undefined)