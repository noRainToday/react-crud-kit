# rollup 配置

## Rollup External 配置详解

### 什么是 External？

external 配置告诉 Rollup 哪些模块应该保持为外部依赖，而不是打包到最终的 bundle 中。这对于库开发特别重要，因为你不希望将用户已经安装的依赖重复打包。

### 为什么需要 External？

1. 减小包体积 ：避免重复打包用户已有的依赖
2. 避免版本冲突 ：让用户使用他们项目中的依赖版本
3. 提高性能 ：减少打包时间和最终包大小
4. 解决警告 ：避免像 'use client' 这样的模块级指令警告

```js
external: ['react', 'react-dom', 'antd']

external: [
  /^react($|\/.*)/,  // 匹配 react 和 react/* 
  /^antd($|\/.*)/    // 匹配 antd 和 antd/*
]

external: [
  'react',
  'react-dom',
  /^antd\/.*/,
  (id) => id.includes('lodash')
]

external: (id) => {
  // 排除所有 node_modules 中的模块
  return id.includes('node_modules');
}

```



# reslove 配置路径

```js
  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@/types': path.resolve(__dirname, 'src/types'),
        '@/utils': path.resolve(__dirname, 'src/utils'),
        '@/components': path.resolve(__dirname, 'src/components'),
      },
    }),
  ]
```

## tsconfig.ts 搭配配置

```json
{
    "compilerOptions": {
		"baseUrl": ".",
        "paths": {
            "@/*": [
                "package/*"
            ],
            "@/components/*": [
                "package/components/*"
            ],
            "@/types/*": [
                "package/types/*"
            ],
            "@/utils/*": [
                "package/utils/*"
            ]
        },
}
}
```

