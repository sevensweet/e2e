<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import md5 from 'blueimp-md5'

const endpoint = ref('/v2/wac/e/apiForkk/wac/skipToH5')
const baseUrl = ref('http://localhost:3003')

const form = reactive({
  school_code: '01154',
  account_type: 'STUNO',
  account_no: '20240001',
  cid: 'c1',
  scene_type: 'DEFAULT',
  app_code: 'APP001',
  user_name: 'test_user',
})

const appkey = ref('app_key_1')
const signKey = ref('sign_key_1')
const useRawJson = ref(false)
const rawJson = ref(JSON.stringify(form, null, 2))
const jsonError = ref('')

watch(
  form,
  () => {
    if (!useRawJson.value) {
      rawJson.value = JSON.stringify(form, null, 2)
    }
  },
  { deep: true }
)

const jsonString = computed(() => {
  if (useRawJson.value) {
    return rawJson.value.trim()
  }
  return JSON.stringify(form)
})

const signature = computed(() => {
  if (!appkey.value || !signKey.value || !jsonString.value) {
    return ''
  }
  return md5(`${jsonString.value}${appkey.value}${signKey.value}`)
})

const fullUrl = computed(() => {
  const base = baseUrl.value.trim().replace(/\/+$/, '')
  const path = endpoint.value.trim().startsWith('/') ? endpoint.value.trim() : `/${endpoint.value.trim()}`
  return `${base}${path}`
})

const curlText = computed(() => {
  if (!jsonString.value || !appkey.value) {
    return ''
  }
  const jsonEncoded = encodeURIComponent(jsonString.value)
  const sigEncoded = encodeURIComponent(signature.value)
  const appKeyEncoded = encodeURIComponent(appkey.value)
  return [
    `curl -X POST '${fullUrl.value}' \\`,
    `  -H 'Content-Type: application/x-www-form-urlencoded' \\`,
    `  --data-urlencode 'json=${jsonEncoded}' \\`,
    `  --data-urlencode 'signature=${sigEncoded}' \\`,
    `  --data-urlencode 'appkey=${appKeyEncoded}'`,
  ].join('\n')
})

const nodeText = computed(() => {
  if (!jsonString.value || !appkey.value) {
    return ''
  }
  return [
    "import fetch from 'node-fetch';",
    '',
    `const url = '${fullUrl.value}';`,
    'const params = new URLSearchParams({',
    `  json: ${JSON.stringify(jsonString.value)},`,
    `  signature: ${JSON.stringify(signature.value)},`,
    `  appkey: ${JSON.stringify(appkey.value)},`,
    '});',
    '',
    'const response = await fetch(url, {',
    "  method: 'POST',",
    "  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },",
    '  body: params.toString(),',
    '});',
    '',
    'console.log(response.status, response.headers.get("location"));',
  ].join('\n')
})

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

const copyText = async (value: string) => {
  if (!value) return
  await navigator.clipboard.writeText(value)
}

const submitForm = () => {
  const formEl = document.createElement('form')
  formEl.method = 'POST'
  formEl.action = fullUrl.value
  formEl.target = '_blank'

  const jsonInput = document.createElement('input')
  jsonInput.name = 'json'
  jsonInput.value = jsonString.value
  formEl.appendChild(jsonInput)

  const sigInput = document.createElement('input')
  sigInput.name = 'signature'
  sigInput.value = signature.value
  formEl.appendChild(sigInput)

  const appkeyInput = document.createElement('input')
  appkeyInput.name = 'appkey'
  appkeyInput.value = appkey.value
  formEl.appendChild(appkeyInput)

  document.body.appendChild(formEl)
  formEl.submit()
  document.body.removeChild(formEl)
}
</script>

<template>
  <div class="min-h-screen noise">
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <header class="flex flex-col gap-6">
        <h1 class="font-display text-4xl font-semibold text-ink md:text-5xl">
          WAC SkipToH5 请求生成器
        </h1>
        <p class="max-w-2xl text-lg text-slate-600">
          手动录入参数，实时生成签名与脚本。既能表单提交做手工验证，也能一键复制
          curl/Node 脚本做半自动 E2E。
        </p>
      </header>

      <main class="mt-10 flex flex-col gap-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <section class="rounded-3xl bg-white p-5 shadow-glow sm:p-6">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-xl font-semibold">请求参数</h2>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">必填校验已内置</span>
          </div>

          <div class="mt-6 space-y-4 ">
            <div class="grid grid-cols-1">
              <label class="space-y-2 text-sm text-slate-600 ">
                Base URL
                <input v-model="baseUrl" class="w-full rounded-xl border border-slate-200 px-4 py-2 text-base" />
              </label>
            </div>

            <div class="grid grid-cols-1">
              <label class="space-y-2 text-sm text-slate-600 ">
                Endpoint
                <input v-model="endpoint" class="w-full rounded-xl border border-slate-200 px-4 py-2 text-base" />
              </label>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label class="space-y-2 text-sm text-slate-600">
                school_code
                <input v-model="form.school_code" class="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </label>
              <label class="space-y-2 text-sm text-slate-600">
                scene_type
                <select v-model="form.scene_type" class="w-full rounded-xl border border-slate-200 px-4 py-2">
                  <option>DEFAULT</option>
                  <option>YSK</option>
                  <option>NYSK</option>
                </select>
              </label>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label class="space-y-2 text-sm text-slate-600">
                account_type
                <select v-model="form.account_type" class="w-full rounded-xl border border-slate-200 px-4 py-2">
                  <option>STUNO</option>
                  <option>IDCARD</option>
                </select>
              </label>
               <label class="space-y-2 text-sm text-slate-600">
                account_no
                <input v-model="form.account_no" class="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </label>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label class="space-y-2 text-sm text-slate-600">
                cid
                <input v-model="form.cid" class="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </label>
              <label class="space-y-2 text-sm text-slate-600">
                app_code
                <input v-model="form.app_code" class="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </label>
            </div>

            <div >
              <label class="space-y-2 text-sm text-slate-600 ">
                user_name
                <input v-model="form.user_name" class="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </label>
            </div>

            <div >
              <label class="space-y-2 text-sm text-slate-600">
                appkey
                <input v-model="appkey" class="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </label>
            </div>

            <div >
              <label class="space-y-2 text-sm text-slate-600 ">
                signKey
                <input v-model="signKey" class="w-full rounded-xl border border-slate-200 px-4 py-2" />
              </label>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <label class="inline-flex items-center gap-2 text-sm text-slate-600">
              <input v-model="useRawJson" type="checkbox" class="h-4 w-4 rounded border-slate-300" />
              使用原始 JSON（影响签名）
            </label>
            <span v-if="jsonError" class="rounded-full bg-ember/10 px-3 py-1 text-xs text-ember">
              {{ jsonError }}
            </span>
          </div>

          <label class="mt-4 block text-sm text-slate-600">
            JSON
            <textarea
              v-model="rawJson"
              rows="8"
              class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-sm"
              :readonly="!useRawJson"
            ></textarea>
          </label>

          <div class="mt-6 flex flex-wrap gap-3">
            <button
              class="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              type="button"
              @click="submitForm"
            >
              手工提交（表单）
            </button>
            <button
              class="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-ink transition hover:border-slate-400"
              type="button"
              @click="copyText(signature)"
            >
              复制签名
            </button>
          </div>
        </section>

        <aside class="space-y-6">
          <section class="rounded-3xl bg-white p-5 shadow-glow sm:p-6">
            <div class="flex items-center justify-between">
              <h2 class="font-display text-xl font-semibold">签名与脚本</h2>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                自动生成
              </span>
            </div>

            <div class="mt-4 rounded-2xl bg-slate-950 px-4 py-3 font-mono text-xs text-emerald-200 sm:text-sm">
              {{ signature || '等待参数...' }}
            </div>

            <div class="mt-6 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-display text-base font-semibold">curl</h3>
                <button
                  class="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold text-slate-700"
                  type="button"
                  @click="copyText(curlText)"
                >
                  复制 curl
                </button>
              </div>
              <textarea
                class="h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-xs sm:h-40"
                readonly
                :value="curlText"
              ></textarea>
            </div>

            <div class="mt-6 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-display text-base font-semibold">Node 脚本</h3>
                <button
                  class="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold text-slate-700"
                  type="button"
                  @click="copyText(nodeText)"
                >
                  复制 Node
                </button>
              </div>
              <textarea
                class="h-40 w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-xs sm:h-48"
                readonly
                :value="nodeText"
              ></textarea>
            </div>
          </section>

          <section class="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-5 text-sm text-slate-600 sm:p-6">
            <h3 class="font-display text-base font-semibold text-ink">使用提示</h3>
            <ul class="mt-3 space-y-2">
              <li>签名依赖 JSON 原始字符串，切换“原始 JSON”会影响签名。</li>
              <li>表单提交不会触发 CORS，可用于模拟线上真实跳转。</li>
              <li>curl/Node 脚本用于快速回放线上问题。</li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  </div>
</template>
