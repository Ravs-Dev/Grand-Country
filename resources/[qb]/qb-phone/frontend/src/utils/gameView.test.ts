import { describe, expect, it, vi } from 'vitest'

import { createGameView, gameViewGeometry } from '@/utils/gameView'

describe('gameViewGeometry', () => {
  it('center-crops a widescreen game view for 3:4 portrait output', () => {
    const geometry = gameViewGeometry(1920, 1080, 540, 720)
    expect(Array.from(geometry.textureCoordinates)).toEqual([
      expect.closeTo(0.29, 2),
      0,
      expect.closeTo(0.71, 2),
      0,
      expect.closeTo(0.29, 2),
      1,
      expect.closeTo(0.71, 2),
      1,
    ])
  })

  it('keeps the full game view for 16:9 landscape output', () => {
    const geometry = gameViewGeometry(1920, 1080, 720, 405)
    expect(Array.from(geometry.textureCoordinates)).toEqual([
      0, 0, 1, 0, 0, 1, 1, 1,
    ])
  })

  it('keeps the full texture when both aspect ratios match', () => {
    const geometry = gameViewGeometry(1600, 900, 800, 450)
    expect(Array.from(geometry.textureCoordinates)).toEqual([
      0, 0, 1, 0, 0, 1, 1, 1,
    ])
  })

  it('widens the phone crop at 0.5x while higher zoom levels crop around the center', () => {
    const wideGeometry = gameViewGeometry(1920, 1080, 540, 720, 0.5)
    expect(Array.from(wideGeometry.textureCoordinates)).toEqual([
      expect.closeTo(0.08, 2),
      0,
      expect.closeTo(0.92, 2),
      0,
      expect.closeTo(0.08, 2),
      1,
      expect.closeTo(0.92, 2),
      1,
    ])
    expect(Array.from(wideGeometry.positions)).toEqual([
      -1, -1, 1, -1, -1, 1, 1, 1,
    ])

    const zoomedGeometry = gameViewGeometry(1920, 1080, 540, 720, 2)
    expect(Array.from(zoomedGeometry.textureCoordinates)).toEqual([
      expect.closeTo(0.39, 2),
      0.25,
      expect.closeTo(0.61, 2),
      0.25,
      expect.closeTo(0.39, 2),
      0.75,
      expect.closeTo(0.61, 2),
      0.75,
    ])
  })
})

describe('createGameView', () => {
  it('recreates graphics resources and resumes after context restoration', () => {
    const gl = {
      ARRAY_BUFFER: 1,
      CLAMP_TO_EDGE: 2,
      COLOR_BUFFER_BIT: 4,
      COMPILE_STATUS: 5,
      DYNAMIC_DRAW: 6,
      FLOAT: 7,
      FRAGMENT_SHADER: 8,
      LINK_STATUS: 9,
      MIRRORED_REPEAT: 10,
      NEAREST: 11,
      REPEAT: 12,
      RGBA: 13,
      STATIC_DRAW: 14,
      TEXTURE_2D: 15,
      TEXTURE_MAG_FILTER: 16,
      TEXTURE_MIN_FILTER: 17,
      TEXTURE_WRAP_S: 18,
      TEXTURE_WRAP_T: 19,
      TRIANGLE_STRIP: 20,
      UNSIGNED_BYTE: 21,
      VERTEX_SHADER: 22,
      attachShader: vi.fn(),
      bindBuffer: vi.fn(),
      bindTexture: vi.fn(),
      bufferData: vi.fn(),
      clear: vi.fn(),
      clearColor: vi.fn(),
      compileShader: vi.fn(),
      createBuffer: vi.fn(() => ({})),
      createProgram: vi.fn(() => ({})),
      createShader: vi.fn(() => ({})),
      createTexture: vi.fn(() => ({})),
      deleteBuffer: vi.fn(),
      deleteProgram: vi.fn(),
      deleteShader: vi.fn(),
      deleteTexture: vi.fn(),
      drawArrays: vi.fn(),
      enableVertexAttribArray: vi.fn(),
      finish: vi.fn(),
      getAttribLocation: vi.fn((_program, name: string) =>
        name === 'a_position' ? 0 : 1,
      ),
      getExtension: vi.fn(() => ({ loseContext: vi.fn() })),
      getProgramInfoLog: vi.fn(() => ''),
      getProgramParameter: vi.fn(() => true),
      getShaderInfoLog: vi.fn(() => ''),
      getShaderParameter: vi.fn(() => true),
      getUniformLocation: vi.fn(() => ({})),
      linkProgram: vi.fn(),
      shaderSource: vi.fn(),
      texImage2D: vi.fn(),
      texParameterf: vi.fn(),
      uniform1i: vi.fn(),
      useProgram: vi.fn(),
      vertexAttribPointer: vi.fn(),
      viewport: vi.fn(),
    }
    const canvas = Object.assign(new EventTarget(), {
      getContext: () => gl,
      height: 0,
      width: 0,
    }) as unknown as HTMLCanvasElement
    const restored = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    vi.spyOn(console, 'info').mockImplementation(() => undefined)
    const view = createGameView(canvas, { onContextRestored: restored })
    view.resize(540, 720, 1920, 1080, 2)

    const lost = new Event('webglcontextlost', { cancelable: true })
    canvas.dispatchEvent(lost)
    expect(lost.defaultPrevented).toBe(true)
    expect(view.isLost()).toBe(true)

    canvas.dispatchEvent(new Event('webglcontextrestored'))
    expect(view.isLost()).toBe(false)
    expect(restored).toHaveBeenCalledOnce()
    expect(gl.createProgram).toHaveBeenCalledTimes(2)
    expect(canvas.width).toBe(540)
    expect(canvas.height).toBe(720)

    view.render()
    expect(gl.drawArrays).toHaveBeenCalledOnce()
    view.dispose()
  })
})
