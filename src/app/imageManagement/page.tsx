'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Tabs, Table, Divider, Drawer } from 'antd';



/**
 * 常量
 */


/**
 * 镜像管理模块
 */
export default function ImageManagement() {
    /**
     * State
     */
    // 基础相关
    const searchParams = useSearchParams();
    const [imageTab, setImageTab] = useState('1');
    // 镜像相关
    const [imageData, setImageData] = useState([]);
    const [isImageDetailOpen, setIsImageDetailOpen] = useState(false);
    const [imageSDKData, setImageSDKData] = useState([]);
    const [imageFrameworkData, setImageFrameworkData] = useState([]);
    // 框架相关
    const [frameworkData, setFrameworkData] = useState([]);
    const [isFrameworkDetailOpen, setIsFrameworkDetailOpen] = useState(false);
    const [frameworkPythonData, setFrameworkPythonData] = useState([]);
    const [frameworkInnerData, setFrameworkInnerData] = useState([]);



    /**
     * Hooks
     */
    useEffect(() => {
        // 刷新保持Tab状态
        let imageTab = searchParams.get('imageTab') || '1';
        setImageTab(imageTab);
        // 获取初始数据
        if (imageTab === '1') getImageList();
        if (imageTab === '2') getFrameworkList();
    }, []);

    /**
     * 内部配置
     */
    // 镜像相关
    // 镜像列表
    const imageColumns = [
        { title: 'namespace', dataIndex: 'namespace' },
        { title: 'tag', dataIndex: 'tag' },
        { title: 'digest', dataIndex: 'digest' },
        { title: 'size', dataIndex: 'size' },
        { title: 'os', dataIndex: 'os' },
        { title: 'description', dataIndex: 'description' },
        { title: 'action', align: 'center', render: (_, record) => (<a onClick={
            () => {
                getImageSDKList(record);
                getImageFrameworkList(record);
            }
        }>detail</a>) },
    ];
    const imageTabImageContent = (
        <Table
            bordered
            size="small"
            scroll={{ y: 'calc(100vh - 260px)' }}
            pagination={ false }
            columns={imageColumns}
            dataSource={imageData} />
    );
    // 镜像SDK详情
    const imageSDKColums = [
        { title: 'sdk_name', dataIndex: 'sdk_name' },
        { title: 'sdk_version', dataIndex: 'sdk_version' },
    ];
    // 镜像框架详情
    const imageFrameworkColums = [
        { title: 'framework_name', dataIndex: 'framework_name' },
        { title: 'framework_version', dataIndex: 'framework_version' },
    ];

    // 框架相关
    // 框架列表
    const frameworkColumns = [
        { title: 'framework_env_id', dataIndex: 'framework_env_id' },
        { title: 'env_name', dataIndex: 'env_name' },
        { title: 'env_type', dataIndex: 'env_type' },
        { title: 'python_version', dataIndex: 'python_version' },
        { title: 'size', dataIndex: 'size' },
        { title: 'tags', dataIndex: 'tags' },
        { title: 'server_path', dataIndex: 'server_path' },
        { title: 'oss_path', dataIndex: 'oss_path' },
        { title: 'action', align: 'center', render: (_, record) => (<a onClick={
            () => {
                getFrameworkPythonList(record);
                getFrameworkInnerList(record);
            }
        }>detail</a>) },
    ];
    const imageTabFrameworkContent = (
        <Table 
            bordered
            size="small"
            scroll={{ y: 'calc(100vh - 260px)' }}
            pagination={ false }
            columns={frameworkColumns}
            dataSource={frameworkData} />
    );
    // 框架Python详情
    const frameworkPythonColums = [
        { title: 'framework_env_id', dataIndex: 'framework_env_id' },
        { title: 'package_name', dataIndex: 'package_name' },
        { title: 'package_version', dataIndex: 'package_version' },
    ];
    // 框架内部详情
    const frameworkInnerColums = [
        { title: 'framework_env_id', dataIndex: 'framework_env_id' },
        { title: 'framework_name', dataIndex: 'framework_name' },
        { title: 'framework_version', dataIndex: 'framework_version' },
    ];

    const imageTabItems = [
        {
            key: '1',
            label: '镜像管理',
            children: imageTabImageContent,
        },
        {
            key: '2',
            label: '框架管理',
            children: imageTabFrameworkContent,
        },
    ];
    

    /**
     * 内部方法
     */
    const onImageTabChange = (key) => {
        setImageTab(key);
        window.history.pushState({page: ""}, "", location.origin + location.pathname + "?imageTab=" + key);
        // 获取初始数据
        if (key === '1') getImageList();
        if (key === '2') getFrameworkList();
    };

    // 镜像相关
    // 获取镜像列表
    const getImageList = async () => {
        const res = await fetch('/api/get_image_list')
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleImageList(temp?.data);
                    }
                } else {
                    // 接口暂时不可用
                }
                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_image_list】：' + (temp?.message || '获取镜像列表')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
                
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_image_list】：' + (error || "获取镜像列表接口失败")
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs') || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_image_list】：' + ("获取镜像列表接口失败")
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs') || '[]'))]))
        }
    }
    const handleImageList = (imageList) => {
        let imageData = [];
        imageData = imageList?.map(image => {
            return { key: image?.namespace, ...image }
        });
        setImageData(imageData);
    }
    // 获取镜像SDK详情
    const getImageSDKList = async (currentImage) => {
        const res = await fetch(`/api/get_image_sdk_list?namespace=${currentImage.namespace}&tag=${currentImage.tag}`);
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleImageSDKList(temp?.data);
                        setIsImageDetailOpen(true)
                    }
                } else {
                    // 接口暂时不可用
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_image_sdk_list】：' + (temp?.message || '获取镜像SDK详情')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_image_sdk_list】：' + (error || '获取镜像SDK详情接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_image_sdk_list】：' + ('获取镜像SDK详情接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }
    const handleImageSDKList = (imageSDKList) => {
        let imageSDKData = [];
        imageSDKList?.forEach(imageSDK => {  
            imageSDKData.push({ key: imageSDK?.image_unique_id, ...imageSDK });
        });
        setImageSDKData(imageSDKData);
    }
    // 获取镜像框架详情
    const getImageFrameworkList = async (currentImage) => {
        const params = {
            "namespace": currentImage.namespace,
            "tag": currentImage.tag,
        }
        const res = await fetch(`/api/get_image_inner_framework_list?namespace=${currentImage.namespace}&tag=${currentImage.tag}`);
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleImageFrameworkList(temp?.data);
                        setIsImageDetailOpen(true)
                    }
                } else {
                    // 接口暂时不可用
                }
                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_image_inner_framework_list】：' + (temp?.message || '获取镜像框架详情')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_image_inner_framework_list】：' + (error || '获取镜像框架详情接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_image_inner_framework_list】：' + ('获取镜像框架详情接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }
    const handleImageFrameworkList = (imageFrameworkList) => {
        let imageFrameworkData = [];
        imageFrameworkList?.forEach(imageFramework => {
            if (imageFramework?.framework_name.trim() !== '' && imageFramework?.framework_version.trim() !== '') {
                imageFrameworkData.push({ key: imageFramework?.image_unique_id, ...imageFramework });
            }
        });
        setImageFrameworkData(imageFrameworkData);
    }

    // 框架相关
    // 获取框架列表
    const getFrameworkList = async () => {
        const res = await fetch('/api/get_framework_env_list')
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleFrameworkList(temp?.data);
                    }
                } else {
                    // 接口暂时不可用
                }
                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_framework_env_list】：' + (temp?.message || '获取框架列表')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_framework_env_list】：' + (error || "获取框架列表接口失败")
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs') || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_framework_env_list】：' + ("获取框架列表接口失败")
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs') || '[]'))]))
        }
    }
    const handleFrameworkList = (frameworkList) => {
        let frameworkData = [];
        frameworkData = frameworkList?.map(framework => {
            return { key: framework?.framework_env_id, ...framework }
        });
        setFrameworkData(frameworkData);
    }
    // 获取框架Python详情
    const getFrameworkPythonList = async (currentFramework) => {
        const res = await fetch(`/api/get_env_python_sitepackage_list?framework_env_id=${currentFramework.framework_env_id}`);
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleFrameworkPythonList(temp?.data);
                        setIsFrameworkDetailOpen(true)
                    }
                } else {
                    // 接口暂时不可用
                }
                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_env_python_sitepackage_list】：' + (temp?.message || '获取框架Python详情')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_env_python_sitepackage_list】：' + (error || '获取框架Python详情接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_env_python_sitepackage_list】：' + ('获取框架Python详情接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }
    const handleFrameworkPythonList = (frameworkPythonList) => {
        let frameworkPythonData = [];
        frameworkPythonList?.forEach(frameworkPython => {  
            frameworkPythonData.push({ key: frameworkPython?.image_unique_id, ...frameworkPython });
        });
        setFrameworkPythonData(frameworkPythonData);
    }
    // 获取框架内部详情
    const getFrameworkInnerList = async (currentFramework) => {
        const res = await fetch(`/api/get_env_inner_framework_list?framework_env_id=${currentFramework.framework_env_id}`);
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        handleFrameworkInnerList(temp?.data);
                        setIsFrameworkDetailOpen(true)
                    }
                } else {
                    // 接口暂时不可用
                }
                
                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_env_inner_framework_list】：' + (temp?.message || '获取框架内部详情')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_env_inner_framework_list】：' + (error || '获取框架内部详情失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_env_inner_framework_list】：' + ('获取框架内部详情失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }
    const handleFrameworkInnerList = (frameworkInnerList) => {
        let frameworkInnerData = [];
        frameworkInnerList?.forEach(frameworkInner => {  
            frameworkInnerData.push({ key: frameworkInner?.framework_env_id, ...frameworkInner });
        });
        setFrameworkInnerData(frameworkInnerData);
    }
    
    return (
      <main>
        <Tabs activeKey={imageTab} items={imageTabItems} onChange={onImageTabChange} />
        <Drawer title="镜像详情" width="800" placement="right" onClose={() => setIsImageDetailOpen(false)} open={isImageDetailOpen}>
            <Divider orientation="left" orientationMargin="0">SDK</Divider>
            <Table size='small' columns={imageSDKColums} dataSource={imageSDKData} />
            <Divider orientation="left" orientationMargin="0">Framework</Divider>
            <Table size='small' olumns={imageFrameworkColums} dataSource={imageFrameworkData} />
        </Drawer>
        <Drawer title="框架详情" width="800" placement="right" onClose={() => setIsFrameworkDetailOpen(false)} open={isFrameworkDetailOpen}>
            <Divider orientation="left" orientationMargin="0">Python</Divider>
            <Table size='small' columns={frameworkPythonColums} dataSource={frameworkPythonData} />
            <Divider orientation="left" orientationMargin="0">Inner</Divider>
            <Table size='small' columns={frameworkInnerColums} dataSource={frameworkInnerData} />
        </Drawer>
      </main>
    )
  }
  