'use client';

import type { MenuProps } from 'antd';

import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme, Tag, Button, Modal, Timeline } from 'antd';
import { HomeOutlined, InteractionOutlined, ContainerOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content, Sider } = Layout;


const topNav: MenuProps['items'] = ['1.0.0'].map((label, index) => ({
    key: `top${index}`,
    label: `${label}` != '1.0.0' ? `${label}` : <Tag color="#1677ff">v{label}</Tag>,
}));

const leftNav: MenuProps['items'] = [
    { icon: HomeOutlined, label: <Link href="/">首页</Link>, flag: 'home' }, 
    { icon: InteractionOutlined, label: <Link href="/modelFactory">模型工厂</Link>, flag: 'modelFactory' },
    { icon: InteractionOutlined, label: <Link href="/inference">模型评估</Link>, flag: 'inference' },
    { icon: InteractionOutlined, label: <Link href="/onlineService">在线服务</Link>, flag: 'onlineService' },
    { icon: InteractionOutlined, label: <Link href="/clusterOverview">集群概览</Link>, flag: 'clusterOverview' },
        { icon: InteractionOutlined, label: <Link href="/imageManagement">镜像管理</Link>, flag: 'imageManagement' },
        { icon: InteractionOutlined, label: <Link href="/packageManagement">安装包管理</Link>, flag: 'packageManagement' },
    ].map(
        (item, index) => {
            return {
                key: item.flag,
                icon: React.createElement(item.icon),
                label: item.label,
                
                // children: new Array(4).fill(null).map((_, j) => {
                    //     const subKey = index * 4 + j + 1;
                    //     return {
                        //         key: subKey,
                        //         label: `option${subKey}`,
                        //     };
                        // }),
                    };
                },
                );
                
                
export default function GlobalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [currentPage, setCurrentPage] = useState<string>('home');
    const [isOpenLogModal, setIsOpenLogModal] = useState<boolean>(false);
    const [actionLogs, setActionLogs] = useState<object[]>([]);

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    
    useEffect(() => {
        setCurrentPage(window.location.pathname.split('/').reverse()[1] || 'home')
    }, [])

    return (
        <Layout>
            <Header >
                <Menu theme="dark" selectable={ false } mode="horizontal" items={ topNav } style={{ display: 'flex', justifyContent: 'flex-end' }} />
            </Header>
            <Layout>
                <Sider width={200} style={{ height: 'calc(100vh - 64px)', background: colorBgContainer }}>
                    <Menu
                        mode="inline"
                        key={currentPage}
                        defaultSelectedKeys={[currentPage]}
                        style={{ height: '100%', borderRight: 0 }}
                        items={leftNav}
                    />
                </Sider>
                {/* <Layout style={{ padding: '0 24px 24px' }}> */}
                <Layout style={{ padding: '16px 0px 0px 16px',  }}>
                    {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            // minHeight: 280,
                            height: 'calc(100vh - 104px)',
                            overflowY: 'auto',
                            background: colorBgContainer,
                        }}
                    >
                        {children}
                        <Button 
                        type="primary" 
                        shape="circle" 
                        icon={<ContainerOutlined />} 
                        style={{ position: 'absolute', bottom: '20px', right: '20px'  }}
                        onClick={ () => {
                            setActionLogs(JSON.parse(sessionStorage.getItem('actionLogs')))
                            setIsOpenLogModal(true);
                        } }
                        />
                        
                    </Content>
                </Layout>
            </Layout>
            <Modal
                title="操作日志"
                centered
                open={isOpenLogModal}
                onCancel={() => setIsOpenLogModal(false)}
                footer={null}
                width={1000}
            >
                <br />
                <Timeline style={{ height: '400px', overflow: 'auto', paddingTop: '8px' }}>
                    { actionLogs?.map(log => (
                        <Timeline.Item color={ log?.success ? 'green' : 'red' } >{log?.message}</Timeline.Item>
                    )) }
                </Timeline>
                <br />
            </Modal>          
        </Layout>
    )
}
