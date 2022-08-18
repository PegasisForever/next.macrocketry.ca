import {createContext} from 'react'
import {MotionValue} from 'framer-motion/types/value'

export const ScrollContext = createContext<{ bodyHeight: number, scrollY: MotionValue<number> } | undefined>(undefined)