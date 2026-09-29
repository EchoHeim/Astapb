
import platform


def checkPlatformInfo():
    arch = platform.architecture()  # 获取操作系统的位数
    print("arch=", arch)
    machine = platform.machine()  # 计算机类型
    print("machine=", machine)
    node = platform.node()  # 计算机的网络名称
    print("node=", node)
    platformIofo = platform.platform()  # 获取操作系统名称及版本号
    print("platformInfo=", platformIofo)
    processor = platform.processor()  # 计算机处理器信息
    print("processor=", processor)
    system = platform.system()
    print("system=", system)
    version = platform.version()  # 获取操作系统版本号
    print("version=", version)
    uname = platform.uname()  # 包含上面所有的信息汇总
    print("uname=", uname)


if __name__ == '__main__':
    checkPlatformInfo()
