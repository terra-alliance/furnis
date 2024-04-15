import { Canvas } from "@react-three/fiber"
import { Bookshelf } from "./Bookshelf/Bookshelf"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import useRefs from "react-use-refs"
import { Analytics } from "@vercel/analytics/react"
import { Menu } from "./Bookshelf/Menu"

export function App() {
  const [view1, view2] = useRefs()

  const width = window.innerWidth

  return (
    <>
      <Analytics />
      <div
        ref={view1}
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          userSelect: "none",
        }}
      />
      <div
        ref={view2}
        style={{
          position: "fixed",
          right: "0%",
          height: "100%",
          width: "min(55%, 400px)",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          zIndex: 1,
        }}
      ></div>
      <Canvas onCreated={(state) => (state.gl.autoClear = false)} eventSource={window.root} frameloop='demand' shadows>
        <Bookshelf track={view1} />
        <Menu track={view2} />
      </Canvas>
      <Links />
    </>
  )
}

function Links() {
  return (
    <a
      style={{
        color: "#b9f5ff",
        zIndex: 1,
        fontSize: "60px",
        position: "absolute",
        bottom: "-4px",
        right: "4px",
      }}
      href='https://github.com/Santista1?tab=repositories'
      target='_blank'
      aria-label='Github'
    >
      <FontAwesomeIcon icon={faGithub} />
    </a>
  )
}
