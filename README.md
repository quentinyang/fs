# 前端服务化——部署设计（Frontend Servitization - Deploy）

## Start

```
# 安装依赖
npm install

# 启动服务
# npm start  或者 node bin/www
# 推荐使用nodemon，安装nodemon：npm install -g nodemon
nodemon bin/www
```

## 实现目标
1. 前端可独立上线，与后端程序的上线过程分离开。
1. 支持__`前`__端__`不同环境`__，__`不同版本`__的版本部署。
1. 支持直接上线CDN。
1. 支持不同node(gulp)环境。
1. 提供资源API，协助后端上线。并支持版本回退。
1. 提供操作界面。

## 整体设计

```
|- `feature-abc`
|    \_ `dev`
|        \_ `project-abc`
|            \_ `js`
|                \_ index-HASH.js
|            \_ `css`
|                \_ index-HASH.css
|            \_ `font`
|                \_ index-HASH.eot
|            \_ `manifest`
|                \_ manifest-20160606.json
|            \_ `...`
|    \_ `production`(or `alpha`/`master`)
|        \_ same as `dev`
|- `master`
     \_ `...`
```

## 实现细节

### 后端操作UI


### Gulp-ufa

### 七牛CDN上传

TODO::

### 接口APIs定义

#### 触发部署

- Request URL: `/deploy/publish/:platform/:branch`

 - `platform` - `required`. Values: angejia(app-site, app-bureau, app-crm, app-platform), retrx-mgt
 - `branch` - required. Values: master

- Response

```
{
    id: 527// deploy id
}
```

#### 获取最新Manifest文件内容

- Request URL: `/deploy/manifest/latest/:platform/:deployment/:branch`

 - `platform` - `required`. Values: app-site, app-bureau, app-crm, app-platform, retrx-mgt
 - `deployment` - required. Default value is  `production`. Values: production, dev, alpha, master
 - `branch` - required. Default value is `master`

- Response

```
{
    "js/abc.js": "js/abc-hash#md5.min.js"
}
```

#### 获取部署信息

- Request URL: `/deploy/publish/:deployId`

 - `deployId` - `required`.  deploy id

- Response

```
{
    "id": 527,
    "repository": "git@git.corp.angejia.com:service/angejia.git",
    "deployment": "production",
    "platform": "angejia",
    "branch": "master",
    "version": "",
    "author": 0,
    "created": "2016-08-06T07:54:59.000Z",
    "updated": "2016-08-06T07:57:47.000Z",
    "status": 3,
    "desc": ""
}
```

#### `deploy/repository/create`

#### `deploy/repository/rebuild`

#### 按照`平台` `环境`拉取仓库代码并部署

TODO

#### 上传CDN的API

TODO

## 补充QiNiuCDN上传

```
app-{{ item }}/public/ -r app-{{ item }}

AccessKey=A84iHgfsHI7xfY3HnR56gnEVK_ek6237WNZjIEZ-
SecretKey=dy_feG5YyzdI9voi8HVrjK7GejfbNh0F6m-7QYii
BucketName=angejia-cdn
```

## Change Log
- @2016-08-06  增加部署ID，增加`/deploy/publish/:deployId`信息


## Appendix

- [nodemon](https://github.com/remy/nodemon)