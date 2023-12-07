'use client';

import { Card, Descriptions, Flex, Button, Radio } from 'antd';


const clusterOverviewData = [
    {
      key: '1',
      label: 'GPU空闲/总量（卡数）',
      children: '310 / 651',
    },
    {
      key: '2',
      label: 'GPU空闲/总量（tflops）',
      children: '31009901 / 651213141',
    },
    {
      key: '3',
      label: '显存空闲/总量（GB）',
      children: '12 / 24',
    },
    {
      key: '4',
      label: 'CPU空闲/总量（核数）',
      children: '1044 / 1104',
    },
    {
      key: '5',
      label: '内存空闲/总量（GB）',
      children: '3965 / 4092',
    },
];

export default function clusterOverview() {
    return (
      <main>
        <Card title="集群概览" style={{ marginBottom: '16px' }}>
            <Descriptions items={clusterOverviewData} />
        </Card>
      
        <Card title="任务概览" style={{ marginBottom: '16px' }}>
            <Flex gap="small" justify="space-between">
                <Card size="small" 
                    title={ 
                        <Radio.Group defaultValue="a" size="small" buttonStyle="solid" style={{ fontWeight: 'normal' }}>
                            <Radio.Button value="a">过去7天</Radio.Button>
                            <Radio.Button value="b">过去30天</Radio.Button>
                            <Radio.Button value="c">本周</Radio.Button>
                            <Radio.Button value="d">本月</Radio.Button>
                        </Radio.Group> } 
                    extra={
                        <span style={{ fontSize: 12 }}>任务总数 3</span> }
                    style={{ width: '50%' }} >
                    Table1
                </Card>
                <Card size="small" title="运行中的任务" extra={<Button type="primary" size="small" style={{ fontSize: 12 }}>刷新</Button>}  style={{ width: '50%' }}>
                    Table2
                </Card>
            </Flex>
        </Card>

        <Card title="节点列表" extra={<Button type="primary" size="small" style={{ fontSize: 12 }}>添加节点</Button>} style={{ marginBottom: '16px' }}>
            Table3
        </Card>
      </main>
    )
  }
  