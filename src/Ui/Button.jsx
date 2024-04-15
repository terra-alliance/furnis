import { useState } from "react"
import { Text } from "@react-three/drei"
import { Box } from "@react-three/flex"

export function Button({ position = [0, 0, 0], onClick, text, fontSize = 30 }) {
  const [hovered, setHover] = useState(false)
  const [width, setWidth] = useState(0)
  const radius = fontSize * 0.7

  return (
    <>
      <Box centerAnchor margin={10} height={radius * 2 - 2}>
        <Text
          position={[position[0], position[1], position[2] + 0.01]}
          font={"./FuturaStdBook.otf"}
          fontSize={fontSize}
          color='blue'
          onSync={(text) => setWidth(text.geometry.boundingBox.max.x * 2)}
        >
          {text}
        </Text>
        <mesh
          position={position}
          onClick={() => onClick()}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          rotation={[0, 0, 90 * (Math.PI / 180)]}
        >
          <capsuleGeometry args={[radius, width, 10, 10]} />
          <meshStandardMaterial color='blue' transparent='true' opacity={hovered ? 0.1 : 0.2} depthWrite={false} />
        </mesh>
      </Box>
    </>
  )
}
