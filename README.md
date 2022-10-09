This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

第一步：在本地创建 `.env.local` 文件，填入：

```
NEXT_PUBLIC_ALCHEMY=Alchemy的Key
LEANCLOUD_APPID=Leancloud的AppId
LEANCLOUD_APPKEY=Leancloud的AppKey
```

第二步：

**数据是自己伪造的**

- 运行 node scripts/db.js game 将支持的游戏类别数据存入 leancloud
- 运行 node scripts/db.js cleaning 将清洗后的数据存入 leancloud

第三步：

run the development server

```bash
npm run dev
# or
yarn dev
```

第四步：

输入演示地址 `0xd735e0259a4e48366f517cff39ebec16518b2d1c` 进行查看