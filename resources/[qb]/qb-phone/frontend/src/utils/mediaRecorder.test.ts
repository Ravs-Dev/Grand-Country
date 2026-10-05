import { describe, expect, it, vi } from 'vitest'

import {
  bindMediaRecorderError,
  compressWaveformSamples,
  setBoundedMapEntry,
  stopMediaRecorder,
} from '@/utils/mediaRecorder'

class FakeRecorder extends EventTarget {
  state: RecordingState = 'recording'
  stop = vi.fn(() => {
    this.state = 'inactive'
    this.dispatchEvent(new Event('stop'))
  })
}

describe('media recorder lifecycle', () => {
  it('resolves from the recorder stop event', async () => {
    const recorder = new FakeRecorder()

    await stopMediaRecorder(recorder as unknown as MediaRecorder)

    expect(recorder.stop).toHaveBeenCalledOnce()
    expect(recorder.state).toBe('inactive')
  })

  it('runs recorder error cleanup only for the current generation', () => {
    const staleRecorder = new FakeRecorder()
    const currentRecorder = new FakeRecorder()
    const cleanup = vi.fn()
    let generation = 1
    const unbindStale = bindMediaRecorderError(
      staleRecorder as unknown as MediaRecorder,
      () => generation === 1,
      cleanup,
    )

    generation = 2
    staleRecorder.dispatchEvent(new Event('error'))
    expect(cleanup).not.toHaveBeenCalled()
    unbindStale()

    bindMediaRecorderError(
      currentRecorder as unknown as MediaRecorder,
      () => generation === 2,
      cleanup,
    )
    currentRecorder.dispatchEvent(new Event('error'))
    currentRecorder.dispatchEvent(new Event('error'))

    expect(cleanup).toHaveBeenCalledOnce()
  })

  it('keeps pending recording buffers bounded and evicts the oldest', () => {
    const pending = new Map<string, number>()

    setBoundedMapEntry(pending, 'first', 1, 2)
    setBoundedMapEntry(pending, 'second', 2, 2)
    setBoundedMapEntry(pending, 'third', 3, 2)

    expect([...pending.entries()]).toEqual([
      ['second', 2],
      ['third', 3],
    ])
  })

  it('normalizes short recordings to the requested waveform width', () => {
    const waveform = compressWaveformSamples([0.1, 0.45, 0.9], 48)

    expect(waveform).toHaveLength(48)
    expect(waveform.every((sample) => sample >= 0.08 && sample <= 1)).toBe(true)
    expect(waveform).toContain(0.9)
  })

  it('fills silent recordings with a stable minimum level', () => {
    expect(compressWaveformSamples([], 8)).toEqual(Array(8).fill(0.08))
  })
})
