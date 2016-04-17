# 链接 API

## 添加链接

POST `/api/link`

|参数|必需|描述|默认值|
|---|---|---|---|
|linkData.url|√|需要转向的网址|-|
|linkData.type|x|短网址类型，`string` 或者 `number`|`string`|
|apiKey|√|API 密钥|-|

成功返回结果:

```json
{
  "error": null,
  "value": {
    "url": "http://sdf.com/sdfdf",
    "type": "string",
    "hash": "mboyx"
  },
  "link": {
    "url": "http://sdf.com/sdfdf",
    "hash": "mboyx",
    "user": {
      "username": "egoist",
      "created_at": "2016-04-17T07:42:24.673Z",
      "updated_at": "2016-04-17T07:42:24.673Z"
    },
    "created_at": "2016-04-17T09:39:38.260Z",
    "updated_at": "2016-04-17T09:39:38.260Z"
  }
}
```
