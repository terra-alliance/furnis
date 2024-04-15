import { useState, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, useTexture } from "@react-three/drei"
import { Box } from "@react-three/flex"
import { RepeatWrapping } from "three"

function stepFloor(num, step) {
  return Math.floor(num / step) * step
}

export function MaterialSelector({ maxWidth = 280, maps, handleChange }) {
  const width = Math.min(70 * maps.length, stepFloor(maxWidth, 70))
  const materialsArray = []
  for (let i = 0; i < maps.length; i++) {
    materialsArray.push(<Material handleChange={handleChange} map={maps[i]} key={i} />)
  }

  return (
    <>
      <Box marginTop={15} height={30} centerAnchor>
        <Text font={"./FuturaStdBook.otf"} fontSize={30} color='blue'>
          Material:
        </Text>
      </Box>
      <Box height='auto' margin={15} width={width} flexDirection='row' wrap='wrap'>
        {materialsArray}
      </Box>
    </>
  )
}

function Material({ map, handleChange }) {
  const [hovered, setHover] = useState(false)
  const texture = (map) =>
    useTexture({ map: map }, (texture) => {
      texture[0].wrapS = texture[0].wrapT = RepeatWrapping
    })

  const mesh = useRef()
  const { invalidate } = useThree()

  useFrame((state, delta) => {
    if (hovered) {
      invalidate()
      mesh.current.rotation.y += delta
    }
  })

  return (
    <Box width='auto' height='auto' centerAnchor margin={35}>
      <mesh
        ref={mesh}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        castShadow
        receiveShadow
        scale={25}
        onClick={() => handleChange(map)}
      >
        <sphereGeometry />
        <meshPhongMaterial transparent='true' opacity={hovered ? 0.9 : 1} {...texture(map)} />
      </mesh>
    </Box>
  )
}
