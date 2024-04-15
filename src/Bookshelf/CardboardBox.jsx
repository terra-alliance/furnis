import { Text, Instances, Instance } from "@react-three/drei"

function degToRad(deg) {
  return deg * (Math.PI / 180)
}

export function CardboardBox({
  scale = [1, 1, 1],
  position = [0, 0, 0],
  thickness = 0.004,
  innerAngle = 120,
  outerAngle = 120,
  text,
}) {
  const width = scale[0]
  const height = scale[1]
  const depth = scale[2]
  const textSize = 0.03

  return (
    <>
      <Instances>
        <meshPhongMaterial color='peru' />
        <boxGeometry />
        <Instance
          name='left'
          castShadow
          receiveShadow
          position={[-width / 2 + position[0], position[1], position[2]]}
          scale={[thickness, height, depth + thickness]}
        ></Instance>
        <Instance
          name='right'
          castShadow
          receiveShadow
          position={[width / 2 + position[0], position[1], position[2]]}
          scale={[thickness, height, depth + thickness]}
        ></Instance>
        <Instance
          name='front'
          castShadow
          receiveShadow
          position={[position[0], position[1], depth / 2 + position[2]]}
          scale={[width - thickness, height, thickness]}
        ></Instance>
        <Instance
          name='back'
          castShadow
          receiveShadow
          position={[position[0], position[1], -depth / 2 + position[2]]}
          scale={[width - thickness, height, thickness]}
        ></Instance>
        <InnerFlaps scale={scale} position={position} thickness={thickness} angle={innerAngle} />
        <OuterFlaps scale={scale} position={position} thickness={thickness} angle={outerAngle} />
      </Instances>
      <Text
        anchorX='left'
        anchorY='top'
        maxWidth={width - 0.015}
        position={[
          position[0] - width / 2 + 0.015,
          position[1] + height / 2 - 0.015,
          position[2] + depth / 2 + thickness / 2 + 0.001,
        ]}
        font={"./FuturaStdBook.otf"}
        fontSize={textSize}
        color={0x212121}
        textAlign='left'
      >
        {text}
      </Text>
    </>
  )
}

function InnerFlaps({ scale, position, thickness, angle }) {
  const width = scale[0]
  const height = scale[1]
  const depth = scale[2]
  const gap = 0.015

  return (
    <>
      <group
        rotation={[0, 0, degToRad(angle)]}
        position={[position[0] - width / 2, position[1] + height / 2, position[2]]}
      >
        <Instance
          name='topleft'
          castShadow
          receiveShadow
          position={[depth / 4 - gap / 8, 0, 0]}
          scale={[depth / 2 + thickness - gap / 2, thickness, depth - gap * 2]}
        ></Instance>
      </group>
      <group
        rotation={[0, 0, -degToRad(angle)]}
        position={[position[0] + width / 2, position[1] + height / 2, position[2]]}
      >
        <Instance
          name='topright'
          castShadow
          receiveShadow
          position={[-depth / 4 + gap / 8, 0, 0]}
          scale={[depth / 2 + thickness - gap / 2, thickness, depth - gap * 2]}
        ></Instance>
      </group>
      <group
        rotation={[0, 0, -degToRad(angle)]}
        position={[position[0] - width / 2, position[1] - height / 2, position[2]]}
      >
        <Instance
          name='bottomleft'
          castShadow
          receiveShadow
          position={[depth / 4 - gap / 8, 0, 0]}
          scale={[depth / 2 + thickness - gap / 2, thickness, depth + thickness - gap * 2]}
        ></Instance>
      </group>
      <group
        rotation={[0, 0, degToRad(angle)]}
        position={[position[0] + width / 2, position[1] - height / 2, position[2]]}
      >
        <Instance
          name='bottomright'
          castShadow
          receiveShadow
          position={[-depth / 4 + gap / 8, 0, 0]}
          scale={[depth / 2 + thickness - gap / 2, thickness, depth + thickness - gap * 2]}
        ></Instance>
      </group>
    </>
  )
}

function OuterFlaps({ scale, position, thickness, angle }) {
  const width = scale[0]
  const height = scale[1]
  const depth = scale[2]
  const gap = 0.015

  return (
    <>
      <group
        rotation={[degToRad(angle), 0, 0]}
        position={[position[0], position[1] + height / 2, position[2] + depth / 2]}
      >
        <Instance
          name='topfront'
          castShadow
          receiveShadow
          position={[0, 0, -depth / 4 + gap / 8]}
          scale={[width - gap * 2, thickness, depth / 2 + thickness - gap / 2]}
        ></Instance>
      </group>
      <group
        rotation={[-degToRad(angle), 0, 0]}
        position={[position[0], position[1] + height / 2, position[2] - depth / 2]}
      >
        <Instance
          name='topback'
          castShadow
          receiveShadow
          position={[0, 0, depth / 4 - gap / 8]}
          scale={[width - gap * 2, thickness, depth / 2 + thickness - gap / 2]}
        ></Instance>
      </group>
      <group
        rotation={[-degToRad(angle), 0, 0]}
        position={[position[0], position[1] - height / 2, position[2] + depth / 2]}
      >
        <Instance
          name='topfront'
          castShadow
          receiveShadow
          position={[0, 0, -depth / 4 + gap / 8]}
          scale={[width - gap * 2, thickness, depth / 2 + thickness - gap / 2]}
        ></Instance>
      </group>
      <group
        rotation={[degToRad(angle), 0, 0]}
        position={[position[0], position[1] - height / 2, position[2] - depth / 2]}
      >
        <Instance
          name='topback'
          castShadow
          receiveShadow
          position={[0, 0, depth / 4 - gap / 8]}
          scale={[width - gap * 2, thickness, depth / 2 + thickness - gap / 2]}
        ></Instance>
      </group>
    </>
  )
}
