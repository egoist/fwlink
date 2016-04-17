# API documentation

## 账户

### 注册

POST `/api/signup`

|参数|必需|描述|
|---|---|---|
|userData.username|√|用户名|
|userData.password|√|密码|
|userData.email|√|邮箱|

成功返回结果:

```json
{
  "error": null,
  "value": {
    "account": "egoist",
    "password": "xxxxxxx"
  },
  "user": {
    "_id": "57133e608e87d2d7xxxxxxx",
    "username": "egoist",
    "password": "xxxxxx",
    "email": "0x142857@gmail.com",
    "apiKey": "xxxxxxxx-1b05-423f-9b5c-bed1xxxxx",
    "created_at": "2016-04-17T07:42:24.673Z",
    "updated_at": "2016-04-17T07:42:24.673Z"
  }
}
```

验证失败:

```json
{
  "error": {
    "isJoi": true,
    "name": "ValidationError",
    "details": [
      {
        "message": "\"username\" is required",
        "path": "username",
        "type": "any.required",
        "context": {
          "key": "username"
        }
      }
    ],
    "_object": {
      "password": "xxxxxxx",
      "email": "0x142857@gmail.com"
    }
  },
  "value": {
    "password": "xxxxxxx",
    "email": "0x142857@gmail.com"
  }
}
```

用户已存在:

```json
{
  "error": {
    "name": "AuthError",
    "message": "User exists"
  },
  "value": {
    "username": "egoist",
    "password": "xxxxxxxxx",
    "email": "0x142857@gmail.com"
  }
}
```
