import { atom } from "jotai"
import map2 from "../Textures/map2.webp"

const widthAtom = atom(0.6)
const heightAtom = atom(1.8)
const depthAtom = atom(0.3)
const shelvesAtom = atom(4)
const textureAtom = atom(map2)
const animationAtom = atom(false)

export { widthAtom, heightAtom, depthAtom, shelvesAtom, textureAtom, animationAtom }
