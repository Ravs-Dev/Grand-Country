const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texcoord;
  varying vec2 v_texcoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texcoord = a_texcoord;
  }
`

const FRAGMENT_SHADER = `
  varying highp vec2 v_texcoord;
  uniform sampler2D u_texture;
  void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`

export interface GameView {
  readonly canvas: HTMLCanvasElement
  dispose(): void
  isLost(): boolean
  render(): void
  resize(
    width: number,
    height: number,
    sourceWidth?: number,
    sourceHeight?: number,
    zoom?: number,
  ): void
}

export interface GameViewOptions {
  onContextLost?: () => void
  onContextRestored?: () => void
  preserveDrawingBuffer?: boolean
}

export function gameViewGeometry(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  zoom = 1,
): { positions: Float32Array; textureCoordinates: Float32Array } {
  const sourceAspect = sourceWidth / sourceHeight
  const targetAspect = targetWidth / targetHeight
  let left = 0
  let right = 1
  let top = 0
  let bottom = 1

  if (sourceAspect > targetAspect) {
    const visibleWidth = targetAspect / sourceAspect
    left = (1 - visibleWidth) / 2
    right = 1 - left
  } else if (sourceAspect < targetAspect) {
    const visibleHeight = sourceAspect / targetAspect
    top = (1 - visibleHeight) / 2
    bottom = 1 - top
  }

  const normalizedZoom = Math.min(3, Math.max(0.5, zoom))
  const centerX = (left + right) / 2
  const centerY = (top + bottom) / 2
  left = Math.max(0, centerX + (left - centerX) / normalizedZoom)
  right = Math.min(1, centerX + (right - centerX) / normalizedZoom)
  top = Math.max(0, centerY + (top - centerY) / normalizedZoom)
  bottom = Math.min(1, centerY + (bottom - centerY) / normalizedZoom)

  return {
    positions: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    textureCoordinates: new Float32Array([
      left,
      top,
      right,
      top,
      left,
      bottom,
      right,
      bottom,
    ]),
  }
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('game_view_shader_unavailable')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'game_view_shader_failed')
  }
  return shader
}

export function createGameView(
  canvas: HTMLCanvasElement,
  options: GameViewOptions = {},
): GameView {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    desynchronized: true,
    failIfMajorPerformanceCaveat: false,
    preserveDrawingBuffer: options.preserveDrawingBuffer === true,
    stencil: false,
  }) as WebGLRenderingContext | null
  if (!gl) throw new Error('game_view_unavailable')

  let lost = false
  let disposed = false
  let program: WebGLProgram | null = null
  let positionBuffer: WebGLBuffer | null = null
  let texcoordBuffer: WebGLBuffer | null = null
  let texture: WebGLTexture | null = null
  let lastSize: {
    height: number
    sourceHeight: number
    sourceWidth: number
    width: number
    zoom: number
  } | null = null

  const releaseResources = (): void => {
    if (positionBuffer) gl.deleteBuffer(positionBuffer)
    if (texcoordBuffer) gl.deleteBuffer(texcoordBuffer)
    if (texture) gl.deleteTexture(texture)
    if (program) gl.deleteProgram(program)
    positionBuffer = null
    texcoordBuffer = null
    texture = null
    program = null
  }

  const initializeResources = (): void => {
    releaseResources()
    const nextProgram = gl.createProgram()
    if (!nextProgram) throw new Error('game_view_program_unavailable')
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    gl.attachShader(nextProgram, vertexShader)
    gl.attachShader(nextProgram, fragmentShader)
    gl.linkProgram(nextProgram)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    if (!gl.getProgramParameter(nextProgram, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(nextProgram)
      gl.deleteProgram(nextProgram)
      throw new Error(error || 'game_view_program_failed')
    }
    gl.useProgram(nextProgram)

    const positionLocation = gl.getAttribLocation(nextProgram, 'a_position')
    const texcoordLocation = gl.getAttribLocation(nextProgram, 'a_texcoord')
    if (positionLocation < 0 || texcoordLocation < 0) {
      gl.deleteProgram(nextProgram)
      throw new Error('game_view_attributes_unavailable')
    }

    const nextPositionBuffer = gl.createBuffer()
    const nextTexcoordBuffer = gl.createBuffer()
    const nextTexture = gl.createTexture()
    if (!nextPositionBuffer || !nextTexcoordBuffer || !nextTexture) {
      if (nextPositionBuffer) gl.deleteBuffer(nextPositionBuffer)
      if (nextTexcoordBuffer) gl.deleteBuffer(nextTexcoordBuffer)
      if (nextTexture) gl.deleteTexture(nextTexture)
      gl.deleteProgram(nextProgram)
      throw new Error('game_view_resources_unavailable')
    }

    program = nextProgram
    positionBuffer = nextPositionBuffer
    texcoordBuffer = nextTexcoordBuffer
    texture = nextTexture

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.DYNAMIC_DRAW,
    )
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
      gl.STATIC_DRAW,
    )
    gl.enableVertexAttribArray(texcoordLocation)
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0)

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255]),
    )
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    // CitizenFX watches this exact wrap-mode sequence and replaces the seeded pixel with the live
    // game backbuffer. These calls are intentionally not redundant.
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT)
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture'), 0)
    gl.clearColor(0, 0, 0, 1)
  }

  const applySize = (): void => {
    if (!lastSize || !positionBuffer || !texcoordBuffer) return
    const geometry = gameViewGeometry(
      lastSize.sourceWidth,
      lastSize.sourceHeight,
      lastSize.width,
      lastSize.height,
      lastSize.zoom,
    )
    canvas.width = lastSize.width
    canvas.height = lastSize.height
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, geometry.positions, gl.DYNAMIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      geometry.textureCoordinates,
      gl.DYNAMIC_DRAW,
    )
    gl.viewport(0, 0, lastSize.width, lastSize.height)
  }

  const onContextLost = (event: Event) => {
    event.preventDefault()
    lost = true
    console.error('[Camera] Game-view WebGL context lost.')
    options.onContextLost?.()
  }
  const onContextRestored = () => {
    if (disposed) return
    try {
      initializeResources()
      lost = false
      applySize()
      options.onContextRestored?.()
    } catch (error) {
      lost = true
      console.error('[Camera] Could not restore the game-view WebGL context.', error)
    }
  }
  canvas.addEventListener(
    'webglcontextlost',
    onContextLost as EventListener,
    false,
  )
  canvas.addEventListener(
    'webglcontextrestored',
    onContextRestored as EventListener,
    false,
  )
  try {
    initializeResources()
  } catch (error) {
    canvas.removeEventListener(
      'webglcontextlost',
      onContextLost as EventListener,
      false,
    )
    canvas.removeEventListener(
      'webglcontextrestored',
      onContextRestored as EventListener,
      false,
    )
    releaseResources()
    throw error
  }

  return {
    canvas,
    dispose() {
      if (disposed) return
      disposed = true
      canvas.removeEventListener(
        'webglcontextlost',
        onContextLost as EventListener,
        false,
      )
      canvas.removeEventListener(
        'webglcontextrestored',
        onContextRestored as EventListener,
        false,
      )
      if (!lost) releaseResources()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
    isLost: () => lost,
    render() {
      if (disposed || lost || !program) return
      gl.useProgram(program)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      gl.finish()
    },
    resize(
      width: number,
      height: number,
      sourceWidth = window.innerWidth,
      sourceHeight = window.innerHeight,
      zoom = 1,
    ) {
      lastSize = {
        height,
        sourceWidth,
        sourceHeight,
        width,
        zoom,
      }
      if (disposed || lost) return
      applySize()
    },
  }
}
