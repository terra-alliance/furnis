import { useState, useEffect, useMemo } from "react"
import { useThree } from "@react-three/fiber"
import { useTexture, OrbitControls, Bounds, Center, useBounds } from "@react-three/drei"
import { useAtomValue, useAtom } from "jotai"
import { BoxGeometry, RepeatWrapping, MeshPhongMaterial } from "three"
import { useSpring, animated, to } from "@react-spring/three"
import { View } from "@react-three/drei"

import { Button } from "../Ui/Button"
import { CardboardBox } from "./CardboardBox"
const AnimatedCardboardBox = animated(CardboardBox)

function degToRad(deg) {
  return deg * (Math.PI / 180)
}

function updateUv(geometry, uValue, vValue) {
  const uvAttribute = geometry.attributes.uv
  for (var i = 0; i < uvAttribute.count; i++) {
    var u = uvAttribute.getX(i)
    var v = uvAttribute.getY(i)
    if (u) u = uValue
    if (v) v = vValue
    uvAttribute.setXY(i, u, v)
    uvAttribute.needsUpdate = true
  }
}

import { widthAtom, heightAtom, depthAtom, shelvesAtom, textureAtom, animationAtom } from "./atoms"
const backThickness = 0.004
const cardboardThickness = 0.004

const backGeometry = new BoxGeometry()
const leftGeometry = new BoxGeometry()
const rightGeometry = new BoxGeometry()
const shelfGeometry = new BoxGeometry()

export function Bookshelf({ track }) {
  return (
    <View track={track}>
      <OrbitControls
        makeDefault
        minDistance={0.5}
        maxDistance={3}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        enablePan={false}
      />
      <Model />
      <ambientLight intensity={0.75} />
      <pointLight position={[-2, -0.5, -2]} intensity={1.5} />
      <spotLight position={[1, 2, 1]} intensity={3} castShadow={true} shadow-mapSize={1024} />
    </View>
  )
}

function Model({ position = [0, 0, 0] }) {
  const width = useAtomValue(widthAtom)
  const height = useAtomValue(heightAtom)
  const depth = useAtomValue(depthAtom)
  const thickness = 0.018
  const shelves = useAtomValue(shelvesAtom)
  const [animation, setAnimation] = useAtom(animationAtom)

  const map = useAtomValue(textureAtom)
  const texture = useTexture({ map: map }, (texture) => (texture[0].wrapS = texture[0].wrapT = RepeatWrapping))
  const material = useMemo(() => new MeshPhongMaterial({ ...texture }))

  const [render, setRender] = useState(false)
  const [cardboardBox, setCardboardBox] = useState(false)
  const [button, setButton] = useState(false)

  useEffect(() => {
    updateUv(backGeometry, width * 1.5, height * 1.5)
  }, [width, height])

  useEffect(() => {
    updateUv(leftGeometry, depth * 1.5, height * 1.5)
  }, [depth, height])

  useEffect(() => {
    updateUv(rightGeometry, depth * 1.5, height * 1.5)
  }, [depth, height])

  useEffect(() => {
    updateUv(shelfGeometry, width * 1.5, depth * 1.5)
  }, [width, depth])

  useEffect(() => {
    setCardboardBox(false)
    setButton(false)
  }, [width, height, depth, shelves, map])

  useEffect(() => {
    if (animation) pack()
    setAnimation(false)
  }, [animation])

  function Refit({ radius }) {
    const api = useBounds()
    useEffect(() => {
      api.refresh().clip().fit()
    }, [radius])
    return null
  }

  const [springs, api] = useSpring(
    () => ({
      backX: 0,
      backZ: 0,
      sideX: 0,
      sideX2: 0,
      sideZ: 0,
      sideRy: 0,
      shelfX: 0,
      shelfX2: 0,
      shelfY: 0,
      shelfY2: 0,
      shelfY3: 0,
      shelfZ: 0,
      shelfRx: 0,
      shelfRy: 0,
      shelfRz: 0,
      boxY: 0,
      innerAngle: 120,
      outerAngle: 120,
    }),
    [width, height, depth, shelves, map]
  )

  const { invalidate } = useThree()

  const pack = () => {
    api.start({
      onChange: () => invalidate(),
      to: [
        {
          backZ: -0.3,
          sideX: 0.3,
          config: { tension: 800, friction: 20 },
        },
        {
          shelfY: -height / shelves + thickness,
          config: { tension: 800, friction: 50 },
        },
        {
          shelfX: thickness,
          shelfY2: height / 2,
          shelfRz: degToRad(90),
          config: { tension: 800, friction: 20 },
        },
        {
          sideX: -width / 2 + (thickness * (shelves + 2)) / 2,
          config: { tension: 800, friction: 50 },
        },
        {
          sideX: -width / 2,
          sideZ: -(thickness * (shelves + 2)) / 2,
          sideRy: degToRad(90),
          shelfRy: degToRad(90),
          shelfZ: thickness,
          backZ: -(thickness * (shelves + 2)) / 2 + depth / 2 - thickness / 2,
          config: { tension: 800, friction: 20 },
        },
        {
          boxY: -3,
          config: { tension: 800, friction: 30 },
          onStart: () => setCardboardBox(true),
        },
        {
          innerAngle: 0,
          config: { tension: 800, friction: 50 },
        },
        {
          outerAngle: 5,
          config: { tension: 800, friction: 100 },
          onStart: () => setButton(true),
        },
      ],
    })
  }

  const gap = 0.1
  const show = () => {
    api.start({
      onChange: () => invalidate(),
      to: [
        {
          outerAngle: 120,
          config: { tension: 800, friction: 50 },
        },
        {
          innerAngle: 120,
          config: { tension: 800, friction: 50 },
        },
        {
          boxY: 0,
          onStart: () => setButton(false),
          onResolve: () => setCardboardBox(false),
          config: { tension: 800, friction: 30 },
        },
        {
          backZ: depth / 2 + backThickness / 2,
          backX: -width - gap - thickness,
          sideZ: 0,
          sideX: -width / 2 + depth / 2 + gap / 2,
          sideX2: width / 2 + depth + gap / 2 + gap + thickness / 2,
          sideRy: degToRad(90),
          onResolve: (r) => setRender(r),
          config: { tension: 800, friction: 30 },
        },
        {
          shelfRx: degToRad(90),
          shelfRy: 0,
          shelfRz: 0,
          shelfX: 0,
          shelfY: 0,
          shelfY2: ((height / shelves - depth - gap) * shelves) / 2,
          shelfY3: height / shelves - depth - gap,
          shelfZ: 0,
          onStart: () => setButton(false),
          onResolve: (r) => setRender(r),
          config: { tension: 800, friction: 30 },
        },
      ],
    })
  }

  const shelvesArray = []
  for (let i = 0; i < shelves + 1; i++) {
    const shelfWidth = i > 0 && i < shelves ? width - thickness : width + thickness
    shelvesArray.push(
      <animated.mesh
        castShadow
        receiveShadow
        position={to(
          [springs.shelfY, springs.shelfY2, springs.shelfX, springs.shelfX2, springs.shelfZ, springs.shelfY3],
          (y, y2, x, x2, z, y3) => [
            position[0] + x * i - (x * shelves) / 2 - z * i + (z * shelves) / 2 + x2 * i,
            position[1] + (height / shelves) * i + y * i + y2 - x * i - y3 * i,
            position[2] - z * i + (z * shelves) / 2,
          ]
        )}
        scale={[shelfWidth, thickness, depth]}
        rotation={to([springs.shelfRx, springs.shelfRy, springs.shelfRz], (rx, ry, rz) => [rx, ry, rz])}
        key={i}
        material={material}
        geometry={shelfGeometry}
      ></animated.mesh>
    )
  }

  const { size } = useThree()
  console.log(size.width)

  const margin = size.width <= 500 ? 0.5 : 1

  return (
    <>
      <Bounds fit clip observe margin={margin}>
        <Refit />
        <Center>
          <animated.mesh
            castShadow
            receiveShadow
            position={to([springs.backX, springs.backZ], (x, z) => [
              position[0] + x,
              position[1] + height / 2,
              position[2] - depth / 2 - backThickness / 2 + z,
            ])}
            scale={[width + thickness, height + thickness, backThickness]}
            material={material}
            geometry={backGeometry}
          ></animated.mesh>
          <animated.mesh
            castShadow
            receiveShadow
            position={to([springs.sideX, springs.sideX2, springs.sideZ], (x, x2, z) => [
              position[0] - width / 2 - x + x2,
              position[1] + height / 2,
              position[2] - z,
            ])}
            scale={[thickness, height - thickness, depth]}
            rotation={to(springs.sideRy, (ry) => [0, ry, 0])}
            material={material}
            geometry={leftGeometry}
          ></animated.mesh>
          <animated.mesh
            castShadow
            receiveShadow
            position={to([springs.sideX, springs.sideX2, springs.sideZ], (x, x2, z) => [
              position[0] + width / 2 + x + x2,
              position[1] + height / 2,
              position[2] + z,
            ])}
            scale={[thickness, height - thickness, depth]}
            rotation={to(springs.sideRy, (ry) => [0, ry, 0])}
            material={material}
            geometry={rightGeometry}
          ></animated.mesh>
          {shelvesArray}
        </Center>
      </Bounds>
      {cardboardBox && (
        <>
          <AnimatedCardboardBox
            position={to(springs.boxY, (y) => [0, 3 + y, 0])}
            scale={[
              Math.max(width, depth) + thickness + cardboardThickness,
              Math.max(width, height) + thickness,
              thickness * (shelves + 3) + backThickness + cardboardThickness,
            ]}
            thickness={cardboardThickness}
            innerAngle={springs.innerAngle}
            outerAngle={springs.outerAngle}
            text={
              "Bookshelf" +
              "\nWidth: " +
              Math.round(width * 100) +
              " cm" +
              "\nHeight: " +
              Math.round(height * 100) +
              " cm" +
              "\nDepth: " +
              Math.round(depth * 100) +
              " cm" +
              "\nShelves: " +
              Math.round(shelves)
            }
          />
        </>
      )}
      {button && (
        <Button
          position={[0, 0, (thickness * (shelves + 3) + backThickness + cardboardThickness) / 2]}
          text='Open'
          fontSize={0.06}
          onClick={show}
        />
      )}
    </>
  )
}
