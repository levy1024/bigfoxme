---
title: "Android 开发中令人头疼的各种版本"
published: 2025-06-09
tags:
- Android
category: Android
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## Android 开发中涉及的相关版本
* Android Studio 版本  
* Android Gradle 插件（AGP）版本  
* Gradle 版本  
* Android SDK 版本（Android API 级别）  
* SDK Build Tools 版本  
* JDK 版本  
* NDK 版本  

## 版本兼容性说明
版本兼容性官方说明：https://developer.android.com/build/releases/gradle-plugin?hl=zh-cn  

## 实践记录
用最新的 Android Studio 开发环境打开一个 3 年前的项目，Sync 时出现：
```shell
Your build is currently configured to use incompatible Java 21.0.6 and Gradle 7.4. Cannot sync the project.
We recommend upgrading to Gradle version 8.12.
The minimum compatible Gradle version is 8.5.
The maximum compatible Gradle JVM version is 17.
Possible solutions:
 - Upgrade to Gradle 8.12 and re-sync
 - Upgrade to Gradle 8.5 and re-sync
```

由上述提示可知：Gradle 版本和 Java 版本不兼容。  
解决方法：  
1. 按提示直接升级 Gradle 版本。（也可修改 gradle-wrapper.properties 文件中 gradle 的版本号）  
2. 配置 Gradle JDK 的版本：Settings -> Build, Execution, Deployment -> Build Tools -> Gradle -> Gradle Projects -> Gradle JDK  
根据自己项目的情况选择。  

由于我打开的项目比较老旧，JDK 版本我先考虑用了 1.8。Sync 之后，又出现提示：  
```shell
    Android Gradle plugin requires Java 11 to run. You are currently using Java 1.8.
     Your current JDK is located in C:\Program Files\Java\jdk1.8.0_411\jre
     You can try some of the following options:
      - changing the IDE settings.
      - changing the JAVA_HOME environment variable.
      - changing `org.gradle.java.home` in `gradle.properties`.
    Gradle settings
```

由上述提示可知：Gradle 插件版本和 Java 版本不兼容。  

此时可选择降低 Gradle 插件版本或使用更高的版本的 Java 11, 查了一下，Android Gradle 插件从 6.7 版本开始，它要求至少使用 Java 11。考虑 Gradle 插件版本 6.7 太早了，并考虑项目还要继续开发更新，不是仅仅编译通过就可以，所以选择更新到更高的版本的 Java 11。  
配置 Gradle JDK 的版本为 Java 11 后，Sync 成功。

## 参考
[如何在 Android Studio 中配置 JDK 路径并确保生效](https://juejin.cn/post/7451502116018044947 "如何在 Android Studio 中配置 JDK 路径并确保生效")  
[[官方] Android build 中的 Java 版本](https://developer.android.google.cn/build/jdks?hl=cs "[官方] Android build 中的 Java 版本")

