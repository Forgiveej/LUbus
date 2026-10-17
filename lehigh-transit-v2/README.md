# Lehigh Transit v2 · 理海校园出行导航

面向理海大学的中英文地图与公交导航原型。这个独立版本放在 `lehigh-transit-v2` 分支的 `lehigh-transit-v2/` 目录，入口为 `index.html`，便于与仓库原有网页分别试用和维护。

- 仓库：[Forgiveej/Hackathon](https://github.com/Forgiveej/Hackathon)（Private）
- 新版分支：[lehigh-transit-v2](https://github.com/Forgiveej/Hackathon/tree/lehigh-transit-v2)
- 新版目录：`lehigh-transit-v2/`
- 数据核查日期：2026-10-17；营业时间基于理海官网 Fall 2026 时刻表。

## 可以试什么

- 地图上的悬浮搜索、可收起的左侧功能栏，以及 EN／中文切换。
- 输入建筑、地址或地点名称，查看建议；理海校园地点优先，搜索范围限 Bethlehem 市及理海校区周边。
- 使用浏览器定位显示自己的位置，或手动选择起终点。
- 校园公交、步行和驾车路线；公交方案优先附近站点，并显示步行接驳和实际乘坐路段。
- PE、MC、GC、CC 的当天营业时间，及圆圈 **i** 按钮内的完整一周时间表。
- 选择线路或公交出行方案后，显示该线路的 Passio GO 真实车辆位置；清除选择后停止显示。

## 朋友下载后怎样运行

### 1. 下载正确分支

这是私人仓库，朋友需要先登录有访问权限的 GitHub 账户；没有权限时，由仓库所有者邀请成为协作者。

打开上面的新版分支链接，确认分支是 **lehigh-transit-v2**，点击 **Code → Download ZIP**。解压后，进入里面的 **`lehigh-transit-v2` 子目录**，应当能看到 `index.html`、`maptiler-config.example.js` 等文件。

下载代码不会自动获得作者电脑上的地图 Key。本版本不包含作者的 `maptiler-config.local.js` 或备份文件。

### 2. 配置自己的 MapTiler Key

在 [MapTiler API Keys](https://cloud.maptiler.com/account/keys/) 创建用于本地试用的 Key：

| 设置 | 填写内容 |
| --- | --- |
| Name | 自己容易识别的名称，例如 `Lehigh Transit Local` |
| Description | 本地测试理海校园导航 |
| Allowed user-agent header | 留空 |
| Allowed HTTP Origins | 分别填写 `127.0.0.1` 和 `localhost`，每行一个；不加协议、端口或路径 |

把 `maptiler-config.example.js` **复制一份**，副本命名为 `maptiler-config.local.js`。打开副本，只在 `apiKey` 的引号里填写自己的 Key，保存：

```js
window.MAPTILER_CONFIG = {
  apiKey: "在这里填入你自己的 MapTiler Key"
};
```

这个本地配置文件已列入 Git 忽略规则，不应上传。地图底图和外部地址搜索会使用该 Key 对应账户的额度。域名限制与本地设置详见 [MapTiler 官方 API Key 文档](https://docs.maptiler.com/guides/credentials/api-key/)。

### 3. 启动本地预览

安装 [Python 3](https://www.python.org/downloads/)，然后在 **新版子目录内**打开终端。

macOS／Linux：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Windows（PowerShell／命令提示符）：

```powershell
py -m http.server 8765 --bind 127.0.0.1
```

保持终端运行，在浏览器打开：

**[http://127.0.0.1:8765/](http://127.0.0.1:8765/)**

请通过这个地址访问，不要直接双击 HTML。允许浏览器定位后，点击地图上的定位按钮即可查看自己的位置；不愿授权时也能手动输入起点。保存网页文件后刷新，就能看到本地修改。结束预览时，在终端按 `Ctrl+C`。

## 准备发布为公共网站

下面是发布步骤，**不表示本项目已经部署上线**。仓库可以继续保持 Private；网站是否公开由托管平台的访问设置决定。

### 推荐：Netlify 连接 GitHub

1. 登录 [Netlify](https://app.netlify.com/)，选择 **Add new project → Import an existing project → GitHub**，授权访问 `Forgiveej/Hackathon`。私人仓库需要相应账户和组织权限。
2. 选择仓库，并将生产分支设为 **`lehigh-transit-v2`**。使用下列设置：

   | 设置 | 值 |
   | --- | --- |
   | Base directory | `lehigh-transit-v2` |
   | Build command | `python3 build.py` |
   | Publish directory | `dist` |

3. 确定网站最终域名，例如分配到的 Netlify 域名或自己的域名。在 MapTiler **另建一个生产环境 Key**，Allowed HTTP Origins 只允许该网站实际使用的域名，User-Agent 留空。生产 Key 与本地测试 Key 分开，生产规则中不保留 `localhost`、`127.0.0.1` 或 `?`。
4. 在 Netlify 项目的环境变量设置中添加 **`MAPTILER_API_KEY`**，值为刚创建的生产 Key，并让它在构建期间可用。不要把生产 Key 写入 Git，也不要复制作者当前的本地 Key。
5. 启动部署。`build.py` 会将运行文件复制到 `dist/`，并从环境变量生成 `dist/maptiler-config.local.js`；没有 Key 时会报错，避免生成缺少配置的网站。`dist/` 和本地配置都不提交到 Git。
6. 部署成功后，用平台给出的 **HTTPS** 地址测试地图、地点搜索、定位、路线规划和公交位置。若团队启用了网站访问保护，需要由所有者在 Netlify 调整访问设置后，普通访客才能打开。自定义域名或网站域名变更后，也要更新 MapTiler 的允许来源并重新测试。

以后向这个发布分支推送更新，Netlify 可自动重新构建部署。操作细节见 [Netlify 从仓库部署](https://docs.netlify.com/start/quickstarts/deploy-from-repository/)及[构建目录设置](https://docs.netlify.com/build/configure-builds/overview/)。

### 浏览器 Key 为什么仍然能看到

环境变量让 Key 不进入 Git 源码，但这个网站需要在浏览器中请求地图，因此**部署后的前端 Key 仍能被访客查看**。保护方式是使用独立的生产 Key、限定真实网站域名，并查看 MapTiler 的用量。不要把服务器私密凭证或其他服务的 Secret 放进这类前端配置。MapTiler 对环境隔离和允许来源的说明见[官方文档](https://docs.maptiler.com/guides/credentials/api-key/)。

### 如果选择 GitHub Pages

先检查仓库所属账户的计划及发布权限：GitHub Pages 对私人仓库的支持取决于付费计划，不能因为想发布网页就把当前仓库改为公开。见 [GitHub Pages 可用范围](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。

有相应权限后，可用 GitHub Actions 在 `lehigh-transit-v2` 目录运行 `python3 build.py`，通过仓库 Secret 或环境配置提供独立的生产 `MAPTILER_API_KEY`，再将生成的 `dist/` 作为 Pages 产物发布。还需要配置 Pages 工作流权限、网站访问规则及准确的 MapTiler 允许域名；本版本没有自动替仓库开启 Pages。可参考 [GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 数据与当前能力边界

| 内容 | 来源与说明 |
| --- | --- |
| 校园公交营业时间 | [理海官方 Transit Route Information](https://auxiliaryservices.lehigh.edu/transit-route-information)，Fall 2026；使用美国东部时间，节假日和临时调整以官方为准。 |
| 公交站序、线路轨迹与车辆位置 | [Lehigh Passio GO](https://lehigh.passiogo.com/)；站点及线路是核查后的本地快照，车辆位置来自实时公共接口。 |
| 理海建筑与地点 | [理海官方校园地图](https://www2.lehigh.edu/map)；建筑标记不等于已核实的步行入口。中文别名用于搜索。 |
| 搜索区域 | Census Bethlehem 市界，另保留理海官方校园地点周边范围。 |
| 地图底图与外部地点搜索 | MapTiler；需要自己的有效 Key。 |
| 步行／驾车路线 | [FOSSGIS OSRM 公共服务](https://routing.openstreetmap.de/about.html)，基于 OpenStreetMap；驾车用时不含实时路况。 |

公交位置约每 20 秒刷新，仅查询当前选中的一条线路；页面隐藏时暂停。过期或无法获取的定位不会假装成正在运行的车辆。车辆 GPS 位置**不是到站 ETA**，GPS 上报时间也可能只精确到分钟。公交行程用时是按线路距离估算，**不含等车时间**；当前以校园公交直达方案和步行接驳为主，不提供完整城市公交换乘优化。

OSRM 的公共服务器有低流量使用限制：最多每秒一次请求，不允许重度使用。本版本的限速和缓存只作用于**单个浏览器页面**，不是覆盖全站所有访客的总限速。正式向较多用户开放前，应更换有对应额度的路由服务，或部署自己的路由服务／有全局限流的后端，并保留所需署名。不能把当前客户端限速当成大规模上线保障。[公共服务使用政策](https://routing.openstreetmap.de/about.html)

浏览器定位只在获得权限后使用。地图、搜索、路线和公交功能需要联网；路线查询会将相关起终点发送给对应服务。没有可靠路线时，页面会说明问题，并提供在 Google Maps 中打开的入口。

## 常见问题

- **地图显示 Invalid key／403**：确认 Key 正确、允许来源包含当前访问域名，并通过 `http://127.0.0.1:8765/` 而非 `file://` 打开。上线后检查生产 Key 的域名及账户额度。
- **朋友下载后没有地图**：每位本地测试者需创建自己的 Key，并完成 `maptiler-config.local.js` 配置；ZIP 中不会包含作者的 Key。
- **打不开私人仓库**：登录被邀请的 GitHub 账户，并先接受协作者邀请。
- **定位失败**：在浏览器站点设置中允许定位，使用本地预览地址或 HTTPS；也可手动输入起点。
- **没有显示公交车**：先选择一条线路。无车上报、定位过期和接口故障会分别提示，不代表所有校园线路都停运。
- **端口已被占用**：先关闭之前的预览服务，或改用其他端口，并在浏览器地址里同步更改。
- **Netlify 构建提示缺少 Key**：确认环境变量名称是 `MAPTILER_API_KEY`、构建时可用，然后重新部署。只添加变量不会自动修改已发布的旧文件。

## English quick start

With access to the private repository, download the **lehigh-transit-v2** branch and open its `lehigh-transit-v2/` folder. Copy `maptiler-config.example.js` to `maptiler-config.local.js`, enter your own MapTiler browser key, and allow `127.0.0.1` and `localhost` as origins. Leave the User-Agent restriction empty.

Run `python3 -m http.server 8765 --bind 127.0.0.1` (Windows: `py -m http.server 8765 --bind 127.0.0.1`) from that folder, then open [http://127.0.0.1:8765/](http://127.0.0.1:8765/). For Netlify, use base directory `lehigh-transit-v2`, build command `python3 build.py`, publish directory `dist`, and the build-time environment variable `MAPTILER_API_KEY` with a separate production-domain-restricted key. Frontend keys remain visible in the deployed browser app. Bus positions are live GPS reports, not arrival predictions.
