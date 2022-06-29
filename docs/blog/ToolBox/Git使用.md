### <center> <font size=34 face="STKaiti"> Git使用 </font>    <!-- {docsify-ignore} -->

# 1. 简介

`Git` 是一个开源的分布式版本控制系统，可以有效、高速地处理从很小到非常大的项目版本管理。也是 `Linus Torvalds` 为了帮助管理 `Linux` 内核开发而开发的一个开放源码的版本控制软件。

`GitHub` 是一个面向开源及私有软件项目的托管平台，因为只支持 `Git` 作为唯一的版本库格式进行托管，故名`GitHub`。

[GitHub官网](https://github.com)

[Git完整命令手册](http://git-scm.com/docs)

[Git教程参考](https://www.runoob.com/git/git-tutorial.html)

# 2. 安装 Git

[git下载地址](http://git-scm.com/downloads)

`Linux` 平台直接命令安装，以 `Ubuntu` 为例

``` bash
sudo apt install git
```

# 3. 配置 Git

`Git` 提供了一个叫做 `git config` 的工具，专门用来配置或读取相应的工作环境变量。

## 3.1 用户信息

配置个人的用户名称和电子邮件地址，每次 `commit` 都会以此作为记录

``` bash
git config --global user.name "your name"
git config --global user.email "your_email@youremail.com"
```

> 如果用了 `--global` 选项，那么更改的配置文件就是位于你用户主目录下的那个，以后你所有的项目都会默认使用这里配置的用户信息。
> 如果要在某个特定的项目中使用其他名字或者电邮，只要去掉 --global 选项重新配置即可，新的设定保存在当前项目的 .git/config 文件里。

## 3.2 代理设置

* 设置代理

``` bash
git config --global http.proxy http://192.168.0.126:7890/
git config --global https.proxy https://192.168.0.126:7890/
```
> 后面是流量代理的 `IP` 和端口。

* 取消代理

``` bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 3.3 查看配置信息

``` bash
git config --list
```

## 3.4 配置远程仓库

以 `Github` 为例作为远程仓库，如果没有，可以在[官网](https://github.com/)注册。

首先在本地创建 `ssh key`，由于本地 `Git` 仓库和 `GitHub` 仓库之间的传输是通过 `SSH` 加密的，所以需要配置验证信息

* 生成 `SSH Key`

``` bash
ssh-keygen -t rsa -C "your_email@youremail.com"
```

`your_email@youremail.com` 是在 `github` 上注册的邮箱，之后会要求确认路径和输入密码，使用默认的一路回车就行 (不设置密码)。成功的话会在用户主目录下生成 `.ssh` 文件夹，进入后打开 `id_rsa.pub` 文件，复制里面的内容。

回到 `github` 网站，登录账户，进入 `Settings`（账户配置），左边选择 `SSH Keys`，点击 `New SSH Key`；`title` 随便填，然后粘贴你电脑上生成的 `key`。

![image](https://user-images.githubusercontent.com/26021085/165877823-7a65309c-252e-4f35-91f9-b2e51af72686.png)

* 验证 `SSH Key`
  
输入以下指令
``` bash
ssh -T git@github.com
```

出现 `You've successfully authenticated, but GitHub does not provide shell access.` 说明配置成功。

# 4. 基本操作

## 4.1 创建仓库

``` bash
git init
```

`Git` 的很多命令都需要在 `Git` 的仓库中运行，所以 `git init` 是使用 `Git` 的第一个命令。在命令执行后，`Git` 仓库会在当前目录下生成一个 `.git` 目录，该目录包含了资源的所有元数据，其他的项目目录保持不变。

也可以指定目录作为 `Git` 仓库

``` bash
git init newrepo
```

初始化后，会在 `newrepo` 目录下会出现一个名为 `.git` 的目录，所有 `Git` 需要的数据和资源都存放在这个目录中。

## 4.2 克隆仓库

我们使用 `git clone` 从现有 `Git` 仓库中拷贝项目。

克隆仓库的命令格式为：

``` bash
git clone <repo>
```

如果我们需要克隆到指定的目录，可以使用以下命令格式：

``` bash
git clone <repo> <directory>
```

> `repo`：`Git` 仓库。 &emsp; `directory`：本地目录。

## 4.3 远程仓库

* 检出仓库
``` bash
git clone https://github.com/Klipper3d/klipper.git
```

* 查看远程仓库
``` bash
git remote -v
```

* 添加远程仓库
``` bash
git remote add [name] [url]
```
> 例如：`git remote add origin git@github.com:EchoHeim/Astapb.git`   &emsp; #连接到远程仓库

* 删除远程仓库
``` bash
git remote rm [name]
```

* 拉取远程仓库
``` bash
git pull [remoteName] [localBranchName]
```

* 推送远程仓库
``` bash
git push [remoteName] [localBranchName]
```

* 修改远程仓库
``` bash
git remote set-url --push[name][newUrl]
```

## 4.3 分支管理

* 创建分支

``` bash
git branch <branchname>
```

* 创建远程分支
``` bash
git push origin <branchname>
```
> 其实是本地分支 `push` 到远程仓库

* 删除分支

``` bash
git branch -d <branchname>
```

> `-d` 选项只能删除已经参与了合并的分支，对于未合并的分支是无法删除的。想强制删除一个分支，可以使用 `-D` 选项

* 删除远程分支

``` bash
git push origin :heads/<branchname>
```
* 切换分支
``` bash
git checkout <branchname>
```
或
``` bash
git switch <branchname>
```

> 当你切换分支的时候，`Git` 会用该分支的最后提交的快照替换你的工作目录的内容，所以多个分支不需要多个目录。

> 也可以使用 `git checkout -b <branchname>` 命令来创建新分支并立即切换到该分支下。

* 合并分支
``` bash
git merge <branchname>
```

> 合并某分支到当前分支

    合并分支时，Git 通常会用 Fast forward 模式，在这种模式下，删除分支后，会丢掉分支信息。
    如果要强制禁用 Fast forward 模式，Git 就会在 merge 时生成一个新的 commit，这样，从分支历史上就可以看出分支信息。

    例如：
    git merge --no-ff -m "merge with no-ff" dev

* 查看分支
``` bash
git branch        # 查看本地分支
git branch -r     # 查看远程分支
git branch -a     # 查看所有分支
```

## 4.4 版本回退

`HEAD` 指向的版本就是当前版本，因此 `Git` 允许我们在版本的历史之间穿梭

``` bash
git reset --hard commit_id
git reset --hard HEAD^^         # ^^表示回到上上个版本。
```

穿梭前，用 `git log` 可以查看提交历史，以便确定要回退到哪个版本。

要重返未来，用 `git reflog` 查看命令历史，以便确定要回到未来的哪个版本。

## 4.4 其他操作

命令        |	说明
:--         | :--
git add	    | 添加文件到暂存区
git status  |	查看仓库当前的状态，显示有变更的文件
git diff    |	比较文件的不同，即暂存区和工作区的差异
git commit  |	提交暂存区到本地仓库
git rm      |	删除工作区文件
git mv      |	移动或重命名工作区文件
git log     |	查看历史提交记录
git blame <file>	| 以列表形式查看指定文件的历史修改记录
git remote  |	远程仓库操作
git fetch   |	从远程获取代码库，把远程仓库更新到本地 `.git` 文件夹，但是没有修改本地仓库文件
git pull    |	下载远程代码并合并
git push    |	上传远程代码并合并

![image](https://user-images.githubusercontent.com/26021085/165892698-58d0e606-f972-4d27-aa20-631112448158.png)

## 4.5 Git 标签

如果项目达到一个重要的阶段，并希望永远记住那个特别的提交快照，你可以使用 `git tag` 给它打上标签。

比如说，我们想为项目发布一个`"1.0"`版本。 我们可以用 `git tag -a v1.0` 命令给最新一次提交打上`（HEAD）"v1.0"`的标签。

`-a` 选项意为"创建一个带注解的标签"。 不加也可以执行的，但它不会记录这标签是啥时候打的，谁打的，也不会让你添加个标签的注解。推荐创建带注解的标签。

* 查看标签注解
``` bash
git log --decorate
```

`-d` 选项表示删除标签。

查看本地标签：`git tag` 

查看远程标签：`git tag -r`

## 4.6 小结

> 本地新建的分支如果不推送到远程，对其他人就是不可见的

从本地推送分支，使用
``` bash
git push origin <branch-name>
```

> 如果推送失败，先用 `git pull` 抓取远程的最新提交

在本地创建和远程分支对应的分支，使用

``` bash
git checkout -b <branch-name> <origin/branch-name>
```

> 本地和远程分支的名称最好一致

建立本地分支和远程分支的关联，使用

``` bash
git branch --set-upstream <branch-name> <origin/branch-name>
```

从远程抓取分支，使用 `git pull`，如果有冲突，要先处理冲突。

# 5. 进阶操作

## 5.1 子模块(submodule)

* 添加子模块
``` bash
git submodule add <url> <path>
```

> 例如我在[LVGL仓库](https://github.com/EchoHeim/LVGL)中移植 `lvgl8.2` 时，在 `git` 主目录下输入以下命令，添加 `lvgl`、`lv_drivers` 作为子模块

``` bash
git submodule add -b release/v8.2 https://github.com/lvgl/lvgl.git lvgl
git submodule add -b release/v8.2 https://github.com/lvgl/lv_drivers.git lv_drivers     # `-b` 表示分支选择
```


* 初始化子模块
> 只在首次检出仓库时运行一次就行
``` bash
git submodule init 
```

* 更新子模块
> 每次更新或切换分支后都需要运行一下
``` bash 
git submodule update
```

* 删除子模块
  
1. `git rm --cached [path]`
2. 编辑 `.gitmodules` 文件，将子模块的相关配置节点删掉
3. 编辑 `.git/config` 文件，将子模块的相关配置节点删掉
4. 手动删除子模块残留的目录

* 子模块使用

克隆项目后，默认子模块目录下无任何内容。需要在项目根目录执行以下命令完成子模块的下载
``` bash
git submodule update --init --recursive
```

或者使用 `recursive` 参数在克隆项目的时候循环克隆 `git` 子项目 
``` bash
git clone --recursive <git_url>
```
## 5.2 忽略文件(.gitignore)

在工程中，并不是所有文件都需要保存到版本库中的，例如 `target` 目录及目录下的文件就可以忽略。在 `Git` 工作区的根目录下创建名称为 `.gitignore` 的文件，写入不需要的文件夹名或文件，`Git` 就会自动忽略这些文件或目录,每个元素占一行即可，如

``` text
  target
  bin
  ● .db
```

> `.gitignore` 只能忽略那些原来没有被 `track` 的文件，如果某些文件已经被纳入了版本管理中，则修改 `.gitignore` 是无效的。

解决方法就是先把本地缓存删除（改变成未track状态），然后再提交:

``` bash
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```

如果文件被 `.gitignore` 忽略了，但是确实想添加该文件，可以用 `-f` 强制添加

``` bash
git add -f App.class
```

另外在提交代码时，如果想忽略某一个文件不提交，即某个文件不被版本控制，也可以通过以下命令实现
``` bash
git update-index --assume-unchanged FILENAME        # 忽略路径+文件名
```

恢复被忽略的文件重新被版本控制
``` bash
git update-index --no-assume-unchanged FILENAME     # 取消忽略  
```

## 5.3 --depth 参数

一般仓库文件不大时，可以用 `git clone` 检出仓库，但有时候，在仓库历史某次 `commit` 时，不小心提交了一个 `1G` 的文件，虽然后面的 `commit` 中把这个文件删除了，但是在 `.git` 文件夹中仍然存储着这个文件，所以如果我们直接克隆这个仓库，会把所有的历史协作记录都 `clone` 下来，这样整个文件会非常大。

其实对于我们直接使用仓库，而不是参与仓库工作的人来说，只要把最近的一次 `commit` 给 `clone` 下来就好了。这就好比一个产品有很多个版本，我们只要 `clone` 最近的一个版本来使用就行了。实现这个功能就需要用到 `git clone --depth=1` 命令

``` bash
git clone --depth 1  git@github.com:EchoHeim/Astapb.git
```

## 5.4 fork仓库更新

* 本地添加上游仓库地址
``` bash
git remote add upstream <upstream_url>    # https://github.com/Klipper3d/klipper.git
```

> 可使用 `git remote -v` 查看是否添加成功

* 本地更新上游仓库
``` bash
git pull upstream master
```

* 同步更新到自己的仓库
``` bash
git push origin master
```

# 6. git 多人协作流程

多人协作的工作模式通常是这样：
首先，可以试图用
``` bash
git push origin <branch-name>
```
推送自己的修改；

如果推送失败，则因为远程分支比你的本地更新，需要先用
``` bash
git pull
```
试图合并；

如果合并有冲突，则解决冲突，并在本地提交；

没有冲突或者解决掉冲突后，再用
``` bash
git push origin <branch-name>
```

推送就能成功！

如果 `git pull` 提示 `no tracking information`，则说明本地分支和远程分支的链接关系没有创建，用命令

``` bash
git branch --set-upstream-to <branch-name> origin/<branch-name>
```

创建连接，然后再重新提交即可。

这就是多人协作的工作模式，一旦熟悉了，就非常简单。

# 6. 问题解决

## 6.1 github个人令牌

使用 `https` 协议，在新建仓库或者 `push` 代码的时候可能会出现以下错误

![image](https://user-images.githubusercontent.com/26021085/165894796-5b4c71ff-27be-4581-b7fe-a260fd031367.png)

``` text
remote: Support for password authentication was removed on August 13, 2021. Please use a personal access token instead.
```

原因按提示说的是从 `2021.08.13` 日起，原来的密码凭证变更为个人访问令牌，就是 `personal access token`

* 生成个人访问令牌

登录 github 网页端，在 Settings（账户配置），左边选择 Developer settings，然后可以看到生成令牌的选项。

![image](https://user-images.githubusercontent.com/26021085/165894900-8c67bc91-3813-4eae-b164-4c85dd652f4c.png)

需要设置 `token` 的有效期，访问权限等，选择要授予此令牌 `token` 的范围或权限。

要使用 `token` 从命令行访问仓库，请选择 `repo`，要使用 `token` 从命令行删除仓库，请选择 `delete_repo`。

其他根据需要进行勾选，完成后点击生成，会得到一串序列码，复制到原来需要输入密码的地方就行了。

![image](https://user-images.githubusercontent.com/26021085/165894951-babc8300-3a96-4c73-9409-86676ed4a435.png)

记得把你的 `token` 保存下来，因为你再次刷新网页的时候，你已经没有办法看到它了。

另外，也可以 把 `token` 直接添加远程仓库链接中，这样就可以避免同一个仓库每次提交代码都要输入 `token` 了

``` bash
git remote set-url origin https://<your_token>@github.com/<USERNAME>/<REPO>.git
```

    <your_token>： 换成你自己得到的 token
    <USERNAME>： 是你自己 github 的用户名  
    <REPO>： 是你的仓库名称  

例如：
``` bash
git remote set-url origin https://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@github.com/EchoHeim/Astapb.git/
```

## 6.2 ssh 连接超时

在 `~/.ssh/config` 文件中增加以下内容，没有就创建一个文件

``` text
Host github.com
  Hostname ssh.github.com
  Port 443
```

## 6.3 本地分支提交远程

如果在本地 `master` 分支创建了一个 `issue` 分支，做了一些修改后，使用 `git push origin master` 提交，但是显示的结果却是 `Everything up-to-date`，这是因为在没有 `track` 远程分支的本地分支中默认提交的是 `master` 分支，而 `master` 分支默认指向了 `origin master` 分支，所以这里要使用 `git push origin issue：master` 就可以把 `issue` 推送到远程的 `master` 分支了。

同样，如果想把本地的某个分支 test 提交到远程仓库，并作为远程仓库的 master 分支，或者作为另外一个名叫 test 的分支，也可以这么做。

``` bash
git push origin test:master           # 提交本地 test 分支作为远程的master分支 
git push origin test:test             # 提交本地 test 分支作为远程的test分支,远程的github就会自动创建一个test分支
```
