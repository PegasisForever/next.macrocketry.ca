import {createContext} from 'react'
import {MotionValue} from 'framer-motion/types/value'
import {SideBarData} from './nav/common'

export const ScrollContext = createContext<MotionValue<number> | undefined>(undefined)

export type PropsWithSideBar<T> = T & { sideBarData: SideBarData }

export const NavContext = createContext<{ sideBarData: SideBarData, prevHrefIndex: number } | undefined>(undefined)
