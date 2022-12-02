## 数据清洗

> 已安装 python 3.8.10 或 3.9.7

在 `scripts/elleria` 目录创建 `.env` 文件，填入：

```
LEANCLOUD_APPID=Leancloud的AppId
LEANCLOUD_APPKEY=Leancloud的AppKey
WEB3_INFURA_PROJECT_ID=infura的ID
```
使用pip包管理工具安装依赖：

```bash
pip3 install -r requirements.txt
```

运行 py trace_event.py 来同步全量的数据，等待数据同步完成