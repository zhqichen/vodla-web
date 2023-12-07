'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Tabs, Table, Divider, Drawer } from 'antd';



/**
 * 常量
 */


/**
 * 安装包管理模块
 */
export default function PackageManagement() {
    /**
     * State
     */
    // 基础相关
    const searchParams = useSearchParams();
    const [packageTab, setPackageTab] = useState('1');
    // 驱动包相关
    const [driverPackageData, setDriverPackageData] = useState([]);
    const [isDriverPackageDetailOpen, setIsDriverPackageDetailOpen] = useState(false);
    const [driverPackageRequireData, setDriverPackageRequireData] = useState([]);
    // SDK包相关
    const [sdkPackageData, setSDKPackageData] = useState([]);
    const [isSDKPackageDetailOpen, setIsSDKPackageDetailOpen] = useState(false);
    const [sdkPackageRequireData, setSDKPackageRequireData] = useState([]);
    // const [frameworkInnerData, setFrameworkInnerData] = useState([]);
    // 框架包相关
    const [frameworkPackageData, setFrameworkPackageData] = useState([]);
    const [isFrameworkPackageDetailOpen, setIsFrameworkPackageDetailOpen] = useState(false);
    const [frameworkPackageRequireData, setFrameworkPackageRequireData] = useState([]);



    /**
     * Hooks
     */
    useEffect(() => {
        // 刷新保持Tab状态
        let packageTab = searchParams.get('packageTab') || '1';
        setPackageTab(packageTab);
        // 获取初始数据
        if (packageTab === '1') getDriverPackageList();
        if (packageTab === '2') getSDKPackageList();
        if (packageTab === '3') getFrameworkPackageList();
    }, []);

    /**
     * 内部配置
     */
    // 驱动包相关
    // 驱动包列表
    const driverPackageColumns = [
        { title: 'device_id', dataIndex: 'device_id' },
        { title: 'driver_id', dataIndex: 'driver_id' },
        { title: 'file_size', dataIndex: 'file_size' },
        { title: 'name', dataIndex: 'name' },
        { title: 'os', dataIndex: 'os' },
        { title: 'oss_path', dataIndex: 'oss_path' },
        { title: 'release_date', dataIndex: 'release_date' },
        { title: 'server_path', dataIndex: 'server_path' },
        { title: 'vendor_id', dataIndex: 'vendor_id' },
        { title: 'version', dataIndex: 'version' },
        { title: 'action', align: 'center', render: (_, record) => (<a onClick={
            () => {
                getDriverPackageRequireList(record);
            }
        }>detail</a>) },
    ];
    const packageTabDriverContent = (
        <Table 
            bordered
            size="small"
            scroll={{ y: 'calc(100vh - 240px)' }}
            pagination={ false }
            columns={driverPackageColumns} 
            dataSource={driverPackageData} />
    );
    // 驱动包依赖详情
    const driverPackageRequireColums = [
        { title: 'driver_id', dataIndex: 'driver_id' },
        { title: 'max_version', dataIndex: 'max_version' },
        { title: 'min_version', dataIndex: 'min_version' },
        { title: 'requirement_name', dataIndex: 'requirement_name' },
        { title: 'requirement_type', dataIndex: 'requirement_type' },
    ];
    // // 镜像框架详情
    // const imageFrameworkColums = [
    //     { title: 'framework_name', dataIndex: 'framework_name' },
    //     { title: 'framework_version', dataIndex: 'framework_version' },
    // ];

    // SDK包相关
    // SDK包列表
    const sdkPackageColumns = [
        { title: 'sdk_id', dataIndex: 'sdk_id' },
        { title: 'file_size', dataIndex: 'file_size' },
        { title: 'name', dataIndex: 'name' },
        { title: 'version', dataIndex: 'version' },
        { title: 'oss_path', dataIndex: 'oss_path' },
        { title: 'server_path', dataIndex: 'server_path' },
        { title: 'release_date', dataIndex: 'release_date' },
        { title: 'vendor_id', dataIndex: 'vendor_id' },
        { title: 'os', dataIndex: 'os' },
        { title: 'action', align: 'center', render: (_, record) => (<a onClick={
            () => {
                getSDKPackageRequireList(record);
            }
        }>detail</a>) },
    ];
    const packageTabSDKContent = (
        <Table 
            bordered
            size="small"
            scroll={{ y: 'calc(100vh - 240px)' }}
            pagination={ false }
            columns={sdkPackageColumns} 
            dataSource={sdkPackageData} />
    );
    // SDK包依赖详情
    const sdkPackageRequireColums = [
        { title: 'sdk_id', dataIndex: 'sdk_id' },
        { title: 'max_version', dataIndex: 'max_version' },
        { title: 'min_version', dataIndex: 'min_version' },
        { title: 'requirement_name', dataIndex: 'requirement_name' },
        { title: 'requirement_type', dataIndex: 'requirement_type' },
    ];
    // // 框架内部详情
    // const frameworkInnerColums = [
    //     { title: 'framework_env_id', dataIndex: 'framework_env_id' },
    //     { title: 'framework_name', dataIndex: 'framework_name' },
    //     { title: 'framework_version', dataIndex: 'framework_version' },
    // ];

    // 框架包相关
    // 框架包列表
    const frameworkPackageColumns = [
        { title: 'framework_id', dataIndex: 'framework_id' },
        { title: 'name', dataIndex: 'name' },
        { title: 'version', dataIndex: 'version' },
        { title: 'oss_path', dataIndex: 'oss_path' },
        { title: 'server_path', dataIndex: 'server_path' },
        { title: 'file_size', dataIndex: 'file_size' },
        { title: 'release_date', dataIndex: 'release_date' },
        { title: 'os', dataIndex: 'os' },
        { title: 'action', align: 'center', render: (_, record) => (<a onClick={
            () => {
                getFrameworkPackageRequireList(record);
            }
        }>detail</a>) },
    ];
    const packageTabFrameworkContent = (
        <Table 
            bordered
            size="small"
            scroll={{ y: 'calc(100vh - 240px)' }}
            pagination={ false }
            columns={frameworkPackageColumns} 
            dataSource={frameworkPackageData} />
    );
    // 框架包依赖详情
    const frameworkPackageRequireColums = [
        { title: 'framework_id', dataIndex: 'framework_id' },
        { title: 'max_version', dataIndex: 'max_version' },
        { title: 'min_version', dataIndex: 'min_version' },
        { title: 'requirement_name', dataIndex: 'requirement_name' },
        { title: 'requirement_type', dataIndex: 'requirement_type' },
    ];


    const packageTabItems = [
        {
            key: '1',
            label: '驱动包管理',
            children: packageTabDriverContent,
        },
        {
            key: '2',
            label: 'SDK包管理',
            children: packageTabSDKContent,
        },
        {
            key: '3',
            label: '框架包管理',
            children: packageTabFrameworkContent,
        },
    ];
    

    /**
     * 内部方法
     */
    const onPackageTabChange = (key) => {
        setPackageTab(key);
        window.history.pushState({page: ""}, "", location.origin + location.pathname + "?packageTab=" + key);
        // 获取初始数据
        if (key === '1') getDriverPackageList();
        if (key === '2') getSDKPackageList();
        if (key === '3') getFrameworkPackageList();
    };

    // 驱动包相关
    // 获取驱动包列表
    const getDriverPackageList = async () => {
        const res = await fetch('/api/get_driver_list')
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleDriverPackageList(temp?.data);
                    }
                } else {
                    // 接口暂时不可用
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_driver_list】：' + (temp?.message || '获取驱动列表')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_driver_list】：' + (error || '获取驱动列表接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_driver_list】：' + ('获取驱动列表接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }
    const handleDriverPackageList = (driverPackageList) => {
        let driverPackageData = [];
        driverPackageData = driverPackageList?.map(driverPackage => {
            return { 
                // key: driverPackage?.namespace,
                 ...driverPackage }
        });
        setDriverPackageData(driverPackageData);
    }
    // 获取驱动包依赖详情
    const getDriverPackageRequireList = async (currentDriverPackage) => {
        const res = await fetch(`/api/get_driver_requirement_list?driver_id=${currentDriverPackage.driver_id}`);
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleDriverPackageRequireList(temp?.data);
                        setIsDriverPackageDetailOpen(true)
                    }
                } else {
                    // 接口暂时不可用
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_driver_requirement_list】：' + (temp?.message || '获取驱动包依赖详情')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_driver_requirement_list】：' + (error || '获取驱动包依赖详情接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_driver_requirement_list】：' + (error || '获取驱动包依赖详情接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }
    const handleDriverPackageRequireList = (DriverPackageRequireList) => {
        let driverPackageRequireData = [];
        DriverPackageRequireList?.forEach(driverPackageRequire => {  
            driverPackageRequireData.push({ key: driverPackageRequire?.driver_id, ...driverPackageRequire });
        });
        setDriverPackageRequireData(driverPackageRequireData);
    }
    // // 获取镜像框架详情
    // const getImageFrameworkList = async (currentImage) => {
    //     const params = {
    //         "namespace": currentImage.namespace,
    //         "tag": currentImage.tag,
    //     }
    //     const res = await fetch(`/api/get_image_inner_framework_list?namespace=${currentImage.namespace}&tag=${currentImage.tag}`);
    //     if (res.ok) {
    //         try {
    //             let temp = await res.json();
    //             if (temp?.success) {
    //                 if (temp?.code === 200) {
    //                     // 正确获取结果
    //                     handleImageFrameworkList(temp?.data);
    //                     setIsImageDetailOpen(true)
    //                 }
    //             } else {
    //                 // 接口暂时不可用
    //             }

    //         } catch (error) {
    //             // 处理结果发生错误
    //         }
    //     }
    // }
    // const handleImageFrameworkList = (imageFrameworkList) => {
    //     let imageFrameworkData = [];
    //     imageFrameworkList?.forEach(imageFramework => {
    //         if (imageFramework?.framework_name.trim() !== '' && imageFramework?.framework_version.trim() !== '') {
    //             imageFrameworkData.push({ key: imageFramework?.image_unique_id, ...imageFramework });
    //         }
    //     });
    //     setImageFrameworkData(imageFrameworkData);
    // }

    // SDK包相关
    // 获取SDK包列表
    const getSDKPackageList = async () => {
        const res = await fetch('/api/get_sdk_list')
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleSDKPackageList(temp?.data);
                    }
                } else {
                    // 接口暂时不可用
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_sdk_list】：' + (temp?.message || '获取SDK列表')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_sdk_list】：' + (error || '获取SDK列表接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_sdk_list】：' + ('获取SDK列表接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }
    const handleSDKPackageList = (sdkPackageList) => {
        let sdkPackageData = [];
        sdkPackageData = sdkPackageList?.map(sdkPackage => {
            return { key: sdkPackage?.sdk_id, ...sdkPackage }
        });
        setSDKPackageData(sdkPackageData);
    }
    // 获取SDK包依赖详情
    const getSDKPackageRequireList = async (currentSDKPackage) => {
        const res = await fetch(`/api/get_sdk_requirement_list?sdk_id=${currentSDKPackage.sdk_id}`);
        if (res.ok) {           
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleSDKPackageRequireList(temp?.data);
                        setIsSDKPackageDetailOpen(true)
                    }
                } else {
                    // 接口暂时不可用
                }
                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_sdk_requirement_list】：' + (temp?.message || '获取SDK包依赖详情')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_sdk_requirement_list】：' + (error || '获取SDK包依赖详情接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_sdk_requirement_list】：' + ('获取SDK包依赖详情接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }
    const handleSDKPackageRequireList = (sdkPackageRequireList) => {
        let sdkPackageRequireData = [];
        sdkPackageRequireList?.forEach(sdkPackageRequire => {  
            sdkPackageRequireData.push({ key: sdkPackageRequire?.sdk_id, ...sdkPackageRequire });
        });
        setSDKPackageRequireData(sdkPackageRequireData);
    }
    // // 获取框架内部详情
    // const getFrameworkInnerList = async (currentFramework) => {
    //     const res = await fetch(`/api/get_env_inner_framework_list?framework_env_id=${currentFramework.framework_env_id}`);
    //     if (res.ok) {
    //         try {
    //             let temp = await res.json();
    //             if (temp?.success) {
    //                 if (temp?.code === 200) {
    //                     // 正确获取结果
    //                     handleFrameworkInnerList(temp?.data);
    //                     setIsFrameworkDetailOpen(true)
    //                 }
    //             } else {
    //                 // 接口暂时不可用
    //             }

    //         } catch (error) {
    //             // 处理结果发生错误
    //         }
    //     }
    // }
    // const handleFrameworkInnerList = (frameworkInnerList) => {
    //     let frameworkInnerData = [];
    //     frameworkInnerList?.forEach(frameworkInner => {  
    //         frameworkInnerData.push({ key: frameworkInner?.framework_env_id, ...frameworkInner });
    //     });
    //     setFrameworkInnerData(frameworkInnerData);
    // }
    
    // 框架包相关
    // 获取框架包列表
    const getFrameworkPackageList = async () => {
        const res = await fetch('/api/get_framework_list')
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleFrameworkPackageList(temp?.data);
                    }
                } else {
                    // 接口暂时不可用
                }
                
                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_framework_list】：' + (temp?.message || '获取框架列表')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_framework_list】：' + (error || '获取框架列表接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_framework_list】：' + ('获取框架列表接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }
    const handleFrameworkPackageList = (frameworkPackageList) => {
        let frameworkPackageData = [];
        frameworkPackageData = frameworkPackageList?.map(frameworkPackage => {
            return { key: frameworkPackage?.framework_id, ...frameworkPackage }
        });
        setFrameworkPackageData(frameworkPackageData);
    }
    // 获取框架安装包依赖详情
    const getFrameworkPackageRequireList = async (currentFrameworkPackage) => {
        const res = await fetch(`/api/get_framework_requirement_list?framework_id=${currentFrameworkPackage.framework_id}`);
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleFrameworkPackageRequireList(temp?.data);
                        setIsFrameworkPackageDetailOpen(true)
                    }
                } else {
                    // 接口暂时不可用
                }
                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_framework_requirement_list】：' + (temp?.message || '获取框架安装包依赖详情')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_framework_requirement_list】：' + (error || '获取框架安装包依赖详情接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_framework_requirement_list】：' + ('获取框架安装包依赖详情接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }
    const handleFrameworkPackageRequireList = (frameworkPackageRequireList) => {
        let frameworkPackageRequireData = [];
        frameworkPackageRequireList?.forEach(frameworkPackageRequire => {  
            frameworkPackageRequireData.push({ key: frameworkPackageRequire?.framework_requirements_id, ...frameworkPackageRequire });
        });
        setFrameworkPackageRequireData(frameworkPackageRequireData);
    }
    
    
    return (
      <main>
        <Tabs activeKey={packageTab} items={packageTabItems} onChange={onPackageTabChange} />
        {/* 
        <Drawer title="框架详情" width="800" placement="right" onClose={() => setIsFrameworkDetailOpen(false)} open={isFrameworkDetailOpen}>
            <Divider orientation="left" orientationMargin="0">Python</Divider>
            <Table size='small' columns={frameworkPythonColums} dataSource={frameworkPythonData} />
            <Divider orientation="left" orientationMargin="0">Inner</Divider>
            <Table size='small' columns={frameworkInnerColums} dataSource={frameworkInnerData} />
        </Drawer> */}
        <Drawer title="镜像详情" width="800" placement="right" onClose={() => setIsDriverPackageDetailOpen(false)} open={isDriverPackageDetailOpen}>
            <Divider orientation="left" orientationMargin="0">Require</Divider>
            <Table 
                bordered
                size="small"
                scroll={{ y: 'calc(100vh - 360px)' }}
                pagination={ false }  
                columns={driverPackageRequireColums} 
                dataSource={driverPackageRequireData} />
        </Drawer>
        <Drawer title="框架详情" width="800" placement="right" onClose={() => setIsSDKPackageDetailOpen(false)} open={isSDKPackageDetailOpen}>
            <Divider orientation="left" orientationMargin="0">Require</Divider>
            <Table 
                bordered
                size="small"
                scroll={{ y: 'calc(100vh - 360px)' }}
                pagination={ false }  
                columns={sdkPackageRequireColums} 
                dataSource={sdkPackageRequireData} />
        </Drawer>
        <Drawer title="框架详情" width="800" placement="right" onClose={() => setIsFrameworkPackageDetailOpen(false)} open={isFrameworkPackageDetailOpen}>
            <Divider orientation="left" orientationMargin="0">Require</Divider>
            <Table 
                bordered
                size="small"
                scroll={{ y: 'calc(100vh - 360px)' }}
                pagination={ false } 
                columns={frameworkPackageRequireColums} 
                dataSource={frameworkPackageRequireData} />
        </Drawer>
      </main>
    )
  }
  