* Prerequisites: Python 3.8 and above have been installed

1. Download trace_event.py script, .env configuration file and requirements.txt file to local
2. Use the pip package management tool to install dependencies, the command is as follows:  
```pip3 install -r requirements.txt```
3. set .env configuration file  

   * Set the WEB3_INFURA_PROJECT_ID item to your own provider key
      (It is recommended to use the infrua service provider, of course, self-built is nice)
   * Set APP_ID and APP_KEY to leancloud's app_id and app_key
4. Run the script in the directory where the script is located, the command like this:  
`python ./trace_event.py {your_address}`  

`Note: If the operation is normal, the height of the block currently retrieved by the contract will be output on the terminal. As of November 29, 2022,
It takes about 4 hours to generate a full ledger record for an address. You can stop the script running in the middle, and the script will automatically save
The latest block height in leancloud, so that the next time the script is run, it can directly continue to retrieve and generate bills from the last block height.`

* 前提条件: 已安装python 3.8及以上版本

1. 下载trace_event.py脚本、.env配置文件及requirements.txt文件
2. 使用pip包管理工具安装依赖:

```pip3 install -r requirements.txt```

3. 配置.env文件:
  将WEB3_INFURA_PROJECT_ID项右边的值设置为你自己的provider key  
  (推荐使用infrua服务商的，当然自建的也是可以的)  
  将APP_ID和APP_KEY设置为leancloud的app_id和app_key

4. 在脚本所在目录运行脚本:

`python ./trace_event.py {your_address}`  

`说明:  若运行正常会在终端输出合约当前检索的区块的高度，截止2022年11月29日，
若生成一个地址的完整账本记录大约花费4小时。在中途可以停止脚本运行，脚本会自动记录下
最近的区块高度并记录到leancloud中，以便于下次运行脚本可直接从上次的区块高度继续检索并生成账单。`
