const axiosInstance = axios.create({
  timeout: 20000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json;charset=utf-8',

  },
  withCredentials: true,
  responseType: 'json'
})


const defaultSignatureUrl = 'https://app.xxx.com/app/oss/policy'

async function upload({ files, signatureURL }) {
  return Array.isArray(files) ? await Promise.all(files.map(file => _uploadFilesToOss(file, signatureURL)))
    : await _uploadFilesToOss(files, signatureURL);
}

async function _uploadFilesToOss(file, signatureURL) {
  if (!(file instanceof File)) {
    return Promise.reject('非文件')
  }
  let { accessid, host, policy, signature } = await authorized.get(signatureURL)
  let formData = new FormData();
  let filename = `${Math.random() + file.name.substr(file.name.lastIndexOf('.'))}`
  formData.append('key', filename) // 文件名
  formData.append('policy', policy)
  formData.append('OSSAccessKeyId', accessid)
  formData.append('success_action_status', '200')
  formData.append('Signature', signature)
  formData.append('file', file);
  await window.fetch(host, { method: 'POST', body: formData });
  return `${host}/${filename}`
}

const sessionFileId = 'oss-authorized-signature';
const expired = 30 * 1000
const authorized = {
  _getKey: function () {
    return storage.localGet(sessionFileId)
  },
  _setKey: function (value) {
    if (!typeof value !== 'string') value = JSON.stringify(value)
    storage.localSet(sessionFileId, value)
  },
  get: async function (signatureURL) {
    let key = this._getKey();
    if (key && key.signature && Date.now() - key.timestamp < expired) {
      return key
    }
    key = (await axiosInstance.post(signatureURL, {})).data;
    key.timestamp = Date.now();
    this._setKey(key)
    return key
  }
}

/*
        1，获取到文件，将文件分片，把分好的片段push到一个数组中
        2，遍历数组，通过formData方法把数组中的数据放到formdata中
        3，发送ajax请求，
        4，如果全部片段发送到服务端了，发送合并请求，把每个片段的名字作为Data传过去
        */
fileUpload.onchange = async function () {
  let file = fileUpload.files[0]
  if (!file) return
  let partSize = file.size / 5
  let cur = 0 //当前传输的大小
  let i = 0 //传了几块数据
  partList = [] //传输总块数
  //获取文件hash名
  let { hash, suffix, filename } = $formdatFileName(file.name)
  //下面做的就是把文件切割好
  while (i < 5) {
    partList.push({
      chunk: file.slice(cur, cur + partSize),
      filename: `${hash}-${i}.${suffix}`
    })
    cur += partSize
    i++
  }
  //遍历文件的每一项，每一项都发送ajax请求
  //formData接收你准备好的数据，使用append方法，传进去，然后把接收到的数据通过ajax发送到后台
  partList = partList.map(item => {
    let formData = new FormData()
    formData.append('chunk', item.chunk)
    formData.append('filename', item.filename)
    return $ajax({
      url: 'http://127.0.0.1:3009/chunk',
      methods: 'post',
      data: formData
    }).then(result => {
      console.log('result', result)
      if (result.code == 0) {
        return Promise.resolve(result)
      }
      return Promise.reject(result)
    })
  })
  //合并
  await Promise.all(partList)
  let result = await $ajax({
    url: 'http://127.0.0.1:3009/merge',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: `filename=${filename}`
  })
  if (result.code === 0) {
    serverImg.src = result.path
  }
}