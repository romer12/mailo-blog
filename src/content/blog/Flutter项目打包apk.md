---
title: "Flutter项目打包apk"
description: "Flutter项目打包apk"
publishDate: 2026-02-07
updatedDate: 2026-02-07
category: "Flutter"
tags: ["flutter", "前端", "android"]
author: "止于秋水"
pinned: true
---
# 1.【生成签名】
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

上面的my-release-key.keystore和my-key-alias要记住，
在之后的命令行中填写相关的信息

# 2.【将签名文件保存到 项目目录/android下】

# 3.【在 项目目录/android创建配置文件key.properties】
用于存放签名信息
`key.properties`文件中输入以下代码（就是刚才填写的部分信息）：
```bash
storePassword=123456
keyPassword=123456
keyAlias= my-key-test
storeFile= mykey.keystore
```

# 4.【配置 build.gradle】
打开你的 Flutter 项目中的 android/app/build.gradle 文件
在 android 区域中添加签名配置：
```dart
// 添加以下几行
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')

if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
def rootDirPath = getRootDir().toString() + File.separator

android {
   ...
   // 添加release签名配置
    signingConfigs{
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile rootDirPath + keystoreProperties['storeFile'] ? file(rootDirPath + keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.release
        }
    }
   ...
}
```

# 5.【使用命令打包】
以android为例
使用`flutter build apk --release`将程序打包成apk即可安装使用，打包完成后命令行会显示apk文件所在的路径