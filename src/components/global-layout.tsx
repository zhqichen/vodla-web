'use client';

import type { MenuProps } from 'antd';

import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { HomeOutlined, InteractionOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content, Sider } = Layout;

const topNav: MenuProps['items'] = ['Sign in', 'Sign up'].map((label, index) => ({
    key: `top${index}`,
    label: `${label}`,
}));

const leftNav: MenuProps['items'] = [
        { icon: HomeOutlined, label: <Link href="/">Home</Link>, flag: 'home' }, 
        { icon: InteractionOutlined, label: <Link href="/inference">Inference Model</Link>, flag: 'inference' },
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
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    
    useEffect(() => {
        setCurrentPage(window.location.pathname.split('/').reverse()[0] || 'home')
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
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}
