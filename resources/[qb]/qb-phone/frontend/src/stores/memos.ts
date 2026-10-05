import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { MemoDto, MemoUpdate } from '@/types/memos'
import { isMemoDto } from '@/types/memos'
import { nuiCall, type NuiResponse } from '@/utils/nui'

export const useMemosStore = defineStore('memos', () => {
  const memos = ref<MemoDto[]>([])
  const loading = ref(false)

  function hydrate(items: MemoDto[]): void {
    memos.value = Array.isArray(items) ? items.filter(isMemoDto) : []
  }

  function upsert(memo: MemoDto): void {
    const index = memos.value.findIndex((item) => item.id === memo.id)
    if (index >= 0) memos.value[index] = memo
    else memos.value.unshift(memo)
    memos.value.sort((left, right) => right.updatedAt - left.updatedAt)
  }

  async function load(): Promise<NuiResponse<MemoDto[]>> {
    loading.value = true
    try {
      const response = await nuiCall<MemoDto[]>('memos:list')
      if (response.success && Array.isArray(response.data)) hydrate(response.data)
      return response
    } finally {
      loading.value = false
    }
  }

  async function update(
    id: string,
    changes: MemoUpdate,
  ): Promise<NuiResponse<MemoDto>> {
    const response = await nuiCall<MemoDto>('memos:update', { id, ...changes })
    if (response.success && isMemoDto(response.data)) upsert(response.data)
    return response
  }

  async function deleteMemo(id: string): Promise<NuiResponse<{ id: string }>> {
    const response = await nuiCall<{ id: string }>('memos:delete', { id })
    if (response.success) {
      memos.value = memos.value.filter((memo) => memo.id !== id)
    }
    return response
  }

  return { deleteMemo, hydrate, load, loading, memos, update, upsert }
})
