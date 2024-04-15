import { Flex } from "@react-three/flex"
import { View, OrthographicCamera } from "@react-three/drei"
import { useAtom, useSetAtom } from "jotai"
import { useThree } from "@react-three/fiber"
import { useState, useEffect } from "react"

import { Slider } from "../Ui/Slider"
import { Button } from "../Ui/Button"
import { MaterialSelector } from "../Ui/MaterialSelector"

import map1 from "../Textures/map1.webp"
import map2 from "../Textures/map2.webp"
import map3 from "../Textures/map3.webp"
import map4 from "../Textures/map4.webp"

import { widthAtom, heightAtom, depthAtom, shelvesAtom, textureAtom, animationAtom } from "./atoms"

export function Menu({ track }) {
  return (
    <View track={track} frames={1}>
      <OrthographicCamera makeDefault position={[0, 0, 100]} />
      <ambientLight />
      <pointLight intensity={1} position={[0, 0, 1000]} />
      <Flex justifyContent='center' alignItems='center'>
        <Inputs />
      </Flex>
    </View>
  )
}

function Inputs() {
  const setTexture = useSetAtom(textureAtom)
  const setAnimation = useSetAtom(animationAtom)

  const { size } = useThree()
  const [menuWidth, setMenuWidth] = useState(size.width)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuWidth(size.width)
    }, 1)
    return () => clearTimeout(timer)
  }, [size])
  const maxWidth = menuWidth * 0.8

  return (
    <>
      <Sliders menuWidth={menuWidth} />
      <MaterialSelector handleChange={setTexture} maps={[map1, map2, map3, map4]} maxWidth={maxWidth} />
      <Button onClick={() => setAnimation(true)} text='Done' />
    </>
  )
}

function Sliders({ menuWidth }) {
  const [width, setWidth] = useAtom(widthAtom)
  const [height, setHeight] = useAtom(heightAtom)
  const [depth, setDepth] = useAtom(depthAtom)
  const [shelves, setShelves] = useAtom(shelvesAtom)
  const maxWidth = menuWidth * 0.8

  return (
    <>
      <Slider
        handleChange={setWidth}
        scale={[maxWidth, 15, 5]}
        text={"Width: " + Math.round(width * 100) + " cm"}
        min={0.2}
        max={1}
        step={0.01}
      />
      <Slider
        handleChange={setHeight}
        scale={[maxWidth, 15, 5]}
        text={"Height: " + Math.round(height * 100) + " cm"}
        min={0.2}
        max={2.6}
        step={0.01}
      />
      <Slider
        handleChange={setDepth}
        scale={[maxWidth, 15, 5]}
        text={"Depth: " + Math.round(depth * 100) + " cm"}
        min={0.1}
        max={0.5}
        step={0.01}
      />
      <Slider
        handleChange={setShelves}
        scale={[maxWidth, 15, 5]}
        text={"Shelves: " + Math.round(shelves)}
        min={1}
        max={7}
        step={1}
      />
    </>
  )
}

export function MenuDiv({ view }) {
  return (
    <div
      style={{
        ...location("right"),
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        zIndex: 1,
      }}
      ref={view}
    ></div>
  )
}

const location = (location) => {
  switch (location) {
    case "top":
      return {
        position: "fixed",
        top: "0%",
        left: "50%",
        transform: "translateX(-50%)",
        height: "min(30%, 400px)",
        width: "100%",
      }
      break
    case "bottom":
      return {
        position: "fixed",
        bottom: "0%",
        left: "50%",
        transform: "translateX(-50%)",
        height: "min(30%, 400px)",
        width: "100%",
      }
      break
    case "left":
      return {
        position: "fixed",
        left: "0%",
        top: "50%",
        transform: "translateY(-50%)",
        height: "100%",
        width: "min(30%, 400px)",
      }
      break
    case "right":
      return {
        position: "fixed",
        right: "0%",
        top: "50%",
        transform: "translateY(-50%)",
        height: "100%",
        width: "min(30%, 400px)",
      }
      break
  }
}
