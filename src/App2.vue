<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import md5 from 'blueimp-md5'


type FormItem = {
  type: 'input' | 'select' | 'textarea'
  label: string
  key: string
  options?: { label: string; value: string }[]
  componentConfig?: Record<string, unknown>
}

const jsonFormConfig = ref<FormItem[]>([
  { type: 'input', label: 'school_code', key: 'school_code' },
  {
    type: 'select', label: 'scene_type', key: 'scene_type',
    options: [
      { label: 'DEFAULT', value: 'DEFAULT' },
      { label: 'YSK', value: 'YSK' },
      { label: 'NYSK', value: 'NYSK' },
    ]
  },
  {
    type: 'select', label: 'account_type', key: 'account_type', options: [
      { label: '学号', value: 'STUNO' },
      { label: '身份证号', value: 'IDCARD' },
    ]
  },
  { type: 'input', label: 'account_no', key: 'account_no' },
  { type: 'input', label: 'cid', key: 'cid' },
  { type: 'input', label: 'user_name', key: 'user_name' },
  { type: 'input', label: 'app_code', key: 'app_code' },
])

const jsonFormRows = ref<string[][]>([
  ['school_code', 'scene_type'],
  ['account_type', 'account_no'],
  ['cid', 'user_name'],
  ['app_code'],
])

const jsonForm = reactive({
  school_code: '01154',
  scene_type: 'DEFAULT',
  account_type: 'STUNO',
  account_no: '20240001',
  cid: 'c1',
  user_name: 'test_user',
  app_code: 'all',
})


const useRawJson = ref(false)
const rawJson = ref(JSON.stringify(jsonForm, null, 2))
const jsonError = ref('')

watch(
  jsonForm,
  () => {
    if (!useRawJson.value) {
      rawJson.value = JSON.stringify(jsonForm, null, 2)
    }
  },
  { deep: true }
)

const updateJsonError = () => {
  if (!useRawJson.value) {
    jsonError.value = ''
    return
  }
  try {
    JSON.parse(rawJson.value)
    jsonError.value = ''
  } catch {
    jsonError.value = 'JSON 格式错误'
  }
}

watch([rawJson, useRawJson], updateJsonError, { immediate: true })

const onJson = computed(() => {
  if (useRawJson.value) {
    return rawJson.value
  }
  return JSON.stringify(jsonForm, null, 2)
})

const jsonString = computed(() => {
  if (useRawJson.value) {
    if (jsonError.value) {
      return ''
    }
    return rawJson.value.trim()
  }
  return JSON.stringify(jsonForm)
})


const basicformConfig = ref<FormItem[]>([
  { type: 'input', label: '基础路径', key: 'baseUrl' },
  { type: 'input', label: '接口路径', key: 'endPoint' },
  { type: 'input', label: 'appKey', key: 'appKey' },
  { type: 'input', label: 'signKey', key: 'signKey' },
])

const basicFormRows = ref<string[][]>([['baseUrl'], ['endPoint'], ['appKey'], ['signKey']])

const basicForm = reactive({
  baseUrl: 'http://localhost:3003',
  endPoint: '/v2/wac/e/apiForkk/wac/skipToH5',
  appKey: 'app_key_1',
  signKey: 'sign_key_1',
})

const jsonFormConfigMap = computed<Record<string, FormItem>>(() => {
  return Object.fromEntries(jsonFormConfig.value.map((item) => [item.key, item]))
})

const basicFormConfigMap = computed<Record<string, FormItem>>(() => {
  return Object.fromEntries(basicformConfig.value.map((item) => [item.key, item]))
})



const signature = computed(() => {
  if (basicForm?.appKey && basicForm?.signKey && jsonString.value) {
    return md5(`${jsonString.value}${basicForm.appKey}${basicForm.signKey}`)
  }
  return ''
})

const toastMessage = ref('')
let toastTimer: number | undefined

const showToast = (message: string) => {
  toastMessage.value = message
  if (toastTimer) {
    window.clearTimeout(toastTimer)
  }
  toastTimer = window.setTimeout(() => {
    toastMessage.value = ''
  }, 1600)
}


const onCurl = computed(() => {
  if (jsonString.value && basicForm?.appKey) {
    const jsonEncoded = encodeURIComponent(jsonString.value)
    const sigEncoded = encodeURIComponent(signature.value)
    const appKeyEncoded = encodeURIComponent(basicForm.appKey)
    return [
      `curl -X POST '${finalUrl.value}' \\`,
      `  -H 'Content-Type: application/x-www-form-urlencoded' \\`,
      `  --data-urlencode 'json=${jsonEncoded}' \\`,
      `  --data-urlencode 'signature=${sigEncoded}' \\`,
      `  --data-urlencode 'appkey=${appKeyEncoded}'`,
    ].join('\n')
  }
  return ''
})

const rawJsonTextarea = ref<HTMLTextAreaElement | null>(null)
const signatureInput = ref<HTMLInputElement | null>(null)
const curlTextarea = ref<HTMLTextAreaElement | null>(null)

const selectForManualCopy = (el: HTMLInputElement | HTMLTextAreaElement | null) => {
  if (!el) {
    showToast('复制失败，请手动复制')
    return
  }
  el.focus()
  el.select()
  showToast('复制失败，请手动复制已选中内容')
}

const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(onJson.value)
    showToast('已复制 JSON')
  } catch {
    selectForManualCopy(rawJsonTextarea.value)
  }
}

const copySignature = async () => {
  try {
    await navigator.clipboard.writeText(signature.value)
    showToast('已复制签名')
  } catch {
    selectForManualCopy(signatureInput.value)
  }
}

const copyCurl = async () => {
  try {
    await navigator.clipboard.writeText(onCurl.value)
    showToast('已复制 curl')
  } catch {
    selectForManualCopy(curlTextarea.value)
  }
}


const finalUrl = computed(() => {
  if (basicForm?.baseUrl && basicForm?.endPoint) {
    const _baseUrl = basicForm.baseUrl.replace(/\/+$/, '')
    const _endPoint = basicForm.endPoint.replace(/^\/{1,}/, '/')
    return `${_baseUrl}${_endPoint}`
  }
  return 'unvalid-url'
})

const handlePost = () => {
  const formEl = document.createElement('form')
  formEl.method = 'POST'
  formEl.action = finalUrl.value
  formEl.target = '_blank'

  const jsonInput = document.createElement('input')
  jsonInput.name = 'json'
  jsonInput.value = onJson.value
  formEl.appendChild(jsonInput)

  const sigInput = document.createElement('input')
  sigInput.name = 'signature'
  sigInput.value = signature.value
  formEl.appendChild(sigInput)

  const appkeyInput = document.createElement('input')
  appkeyInput.name = 'appkey'
  appkeyInput.value = basicForm.appKey
  formEl.appendChild(appkeyInput)

  document.body.appendChild(formEl)
  formEl.submit()
  document.body.removeChild(formEl)

}


</script>

<template>
  <div class="min-h-screen noise">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <header class="flex flex-col gap-4">
        <h3 class="text-base md:text-lg lg:text-2xl">标准对接单点登录(E2E手动测试)</h3>
        <p></p>
      </header>
      <main class="mt-8 flex flex-col gap-6 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <section class="rounded-3xl shadow-glow bg-white p-4 sm:p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-display text-xl font-semibold">JSON数据</h2>
          </div>
          <form action="" class="space-y-4">
            <div v-for="(row, rowIndex) in jsonFormRows" :key="`json-row-${rowIndex}`"
              class="grid gap-4 sm:grid-cols-2">
              <label v-for="key in row" :key="`json-${key}`" class="space-y-2 text-sm text-slate-600"
                :class="row.length === 1 ? 'sm:col-span-2' : ''">
                {{ jsonFormConfigMap[key]?.label }}
                <input v-if="jsonFormConfigMap[key]?.type === 'input'" type="text"
                  class="w-full rounded-xl border border-slate-200 px-4 py-2 text-base" v-model.trim="jsonForm[key]" />

                <select v-else-if="jsonFormConfigMap[key]?.type === 'select'" v-model="jsonForm[key]"
                  class="w-full rounded-xl border border-slate-200 px-4 py-2">
                  <option v-for="optionItem of jsonFormConfigMap[key]?.options || []"
                    :key="`${key}-${optionItem.value}`" :value="optionItem.value">
                    {{ optionItem.label }}
                  </option>
                </select>
              </label>
            </div>
          </form>


          <div class="mt-8 flex items-center justify-between">
            <h2 class="font-display text-xl font-semibold">JSON生成</h2>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <label class="inline-flex items-center gap-2 text-sm text-slate-600">
              <input v-model="useRawJson" type="checkbox" class="h-4 w-4 rounded border-slate-300" />
              手动输入（影响签名）
            </label>
            <span v-show="jsonError" class="rounded-full bg-ember/10 px-3 py-1 text-xs text-ember">
              {{ jsonError }}
            </span>
          </div>
          <div class="mt-4">
            <div>
              <label class="mb-2 w-full text-sm text-slate-600">json</label>
              <textarea
                ref="rawJsonTextarea"
                v-model="rawJson"
                rows="10"
                class="w-full border rounded-xl border-slate-200 px-4 py-2 text-base"
                :readonly="!useRawJson"
              />
            </div>
          </div>
          <div v-show="!jsonError" class="mt-4">
            <button
              class="rounded-full bg-ink hover:bg-slate-800 cursor-pointer px-4 py-2 text-base font-semibold text-white"
              @click="copyJson">复制</button>
          </div>

          <div class="mt-8 flex items-center justify-between">
            <h2 class="font-display text-xl font-semibold">请求参数</h2>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">必填校验已内置</span>
          </div>
          <form action="" class="mt-4 space-y-4">
            <div v-for="(row, rowIndex) in basicFormRows" :key="`basic-row-${rowIndex}`"
              class="grid gap-4 sm:grid-cols-2">
              <label v-for="key in row" :key="`basic-${key}`" class="space-y-2 text-sm text-slate-600"
                :class="row.length === 1 ? 'sm:col-span-2' : ''">
                {{ basicFormConfigMap[key]?.label }}
                <input v-if="basicFormConfigMap[key]?.type === 'input'" type="text"
                  v-bind="basicFormConfigMap[key]?.componentConfig ?? {}"
                  class="w-full rounded-xl border border-slate-200 px-4 py-2 text-base" v-model.trim="basicForm[key]" />

                <textarea v-else-if="basicFormConfigMap[key]?.type === 'textarea'"
                  v-bind="basicFormConfigMap[key]?.componentConfig ?? {}"
                  class="w-full rounded-xl border border-slate-200 px-4 py-2 text-base" v-model.trim="basicForm[key]" />
              </label>
            </div>
          </form>

          <div class="mt-6">
            <button
              class="rounded-full bg-ink hover:bg-slate-800 cursor-pointer px-4 py-2 text-base font-semibold text-white"
              @click="handlePost">请求</button>
          </div>
        </section>

        <aside class="rounded-3xl shadow-glow bg-white p-4 sm:p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-display text-xl font-semibold">结果</h2>
          </div>
          <div>
            <label class="mb-2 w-full text-sm text-slate-600">签名</label>
            <input
              ref="signatureInput"
              class="w-full border rounded-xl border-slate-200 px-4 py-2 text-base"
              :value="signature"
              disabled
            />
            <div class="flex align-center mt-2">
              <button
                class="rounded-full bg-ink hover:bg-slate-800 cursor-pointer px-4 py-2 text-xs font-semibold text-white"
                @click="copySignature">复制</button>
            </div>
          </div>

          <div class="mt-6">
            <label class="inline-block w-full">curl</label>
            <textarea
              ref="curlTextarea"
              v-bind="{ rows: 10, disabled: true }"
              class="w-full border rounded-xl border-slate-200 px-4 py-2 text-base"
              :value="onCurl"
            />
            <div class="flex align-center mt-2">
              <button
                class="rounded-full bg-ink hover:bg-slate-800 cursor-pointer px-4 py-2 text-xs font-semibold text-white"
                @click="copyCurl">复制</button>
            </div>
          </div>
        </aside>
      </main>

      <div v-if="toastMessage"
        class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink/90 px-4 py-2 text-sm text-white shadow-lg">
        {{ toastMessage }}
      </div>

    </div>

  </div>
</template>

<style lang="">

</style>
