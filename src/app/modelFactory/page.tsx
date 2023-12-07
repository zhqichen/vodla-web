'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flex, Tabs, Table, Spin, message, Tag, Space, Drawer, Descriptions, Modal, Form, Input, Button, Select } from 'antd';

import { InputNumber } from '../../../node_modules/antd/es/index';


export default function OnlineService() {
    const router = useRouter();

    const [spinning, setSpinning] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [modalTableData, setModalTableData] = useState<object[]>([]);
    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
    const [currentModelDetail, setCurrentModelDetail] = useState<Object>({});
    const [modalDetailData, setModalDetailData] = useState<object[]>([]);
    const [currentDeployRecord, setCurrentDeployRecord] = useState<object>({});
    const [deploymentOpen, setDeploymentOpen] = useState<boolean>(false);
    const [deployForm] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<object[]>([]);
    const [preDeployResult, setPreDeployResult] = useState<[]>([]);
    const [deployData, setDeployData] = useState<object>({});
    const [preTableLoading, setPreTableLoading] = useState<boolean>(true);




    useEffect(() => {
        (async () => {
            setSpinning(true);
            const params = {}
            const res = await fetch('/api/get_model_list')
        
            if (res.ok) {
                try {
                    let temp = await res.json();
                    if (temp.success) {
                        handleModalTableData(temp.data);
                    } else {
                        messageApi.info('模型列表获取接口不可用', [5]);
                    }
                    setSpinning(false);

                    let message = {
                        success: temp?.success,
                        message: new Date().toLocaleString() + ' 调用接口【get_model_list】：' + (temp?.message || '获取模型列表')
                    }
                    sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))


                } catch (error) {
                    handleModalTableData([]);
                    setSpinning(false);
                    messageApi.error('模型列表获取接口出错', [5]);

                    let message = {
                        success: false,
                        message: new Date().toLocaleString() + ' 调用接口【get_model_list】：' + (error || "获取模型列表接口失败")
                    }
                    sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs') || '[]'))]))
                }
            } else {
                handleModalTableData([]);
                setSpinning(false);
                messageApi.error('请求发送失败', [5]);

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_model_list】：' + ("获取模型列表接口失败")
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs') || '[]'))]))
            }
        })();
    }, [])


    const modalTableColumns = [
        { title: 'ID', dataIndex: 'model_id' },
        { title: '名称', dataIndex: 'model_name' },
        { title: '类型', dataIndex: 'model_type' },
        { title: '标签', dataIndex: 'model_tag',
            render: (_, { model_tag }) => ( 
            <span style={{ backgroundColor: '#55acee', borderRadius: '5px', padding: '0 8px' }}>{ model_tag }</span>
        )},
        { title: '来源', dataIndex: 'model_source', width: 120,
            render: (_, { model_source }) => ( 
            <span>{ model_source }</span>
        )},
        { title: '数据集类型', dataIndex: 'dataset_type', width: 100,
            render: (_, { dataset_type }) => ( 
            <span>{ dataset_type == 0 ? 'Text' : 'Other' }</span>
        )},
        { title: '创建时间', dataIndex: 'gmt_create', showSorterTooltip: false,
            sorter: (a, b) => new Date(a.gmt_create) - new Date(b.gmt_create) 
        },
        { title: '修改时间', dataIndex: 'gmt_modified', showSorterTooltip: false,
            sorter: (a, b) => new Date(a.gmt_modified) - new Date(b.gmt_modified) 
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 200,
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => {
                        setIsDetailOpen(true);
                        setCurrentModelDetail(record);
                    }}>详情</a>
                    <a style={{ color: 'gray', cursor: 'not-allowed' }}>编辑</a>
                    <a onClick={() => {
                        // router.push(`/inference?modelName=${record.model_name}`);  
                        location.href = `/inference?modelName=${record.model_name}`      
                    }}>评估</a>
                    <a onClick={() => {
                        deployForm.setFieldValue('service_name', `${record.model_name?.toLowerCase()}`)
                        setCurrentDeployRecord(record);
                        setDeploymentOpen(true)
                        setPreDeployResult([])
                    }
                    }>部署</a>
                </Space>
            ),
        },
    ];

    const preModalTableColumns = [
        { title: '模型名称', dataIndex: 'model_name' },
        { title: 'CPU', dataIndex: 'cpu' },
        { title: 'GPU内存', dataIndex: 'gpu_memory' },
        { title: '延迟(ms)', dataIndex: 'latency' },
        { title: '内存', dataIndex: 'memory' },
        { title: '实例数量', dataIndex: 'num_instance' },
        { title: 'QPS', dataIndex: 'qps', render: (_, { qps }) => ( qps.toFixed(5) )},
        { title: 'Tflops', dataIndex: 'tflops' },
        { title: '吞吐量(token/s)', width: 140, dataIndex: 'throughput', render: (_, { throughput }) => ( throughput.toFixed(2) )},
        { title: '类型', dataIndex: 'type' }
    ]
    
    const handleModalTableData = (records) => {
        let data = [];
        records?.map(record => {
            data.push({
                key: record.model_id,
                model_id: record.model_id,    // 模型ID
                model_name: record.model_name,  // 模型名称
                model_type: record.model_type,  // 模型类型
                model_tag: record.model_tag,  // 标签
                model_source: record.model_source,  // 模型来源
                dataset_type: record.dataset_type,  // 数据集类型
                gmt_create: record.gmt_create,  // 创建时间
                gmt_modified: record.gmt_modified,  // 修改时间
                
                description: record.description,  // 模型描述
                model_size: record.model_size, // 模型大小
                source_url: record.source_url, // 模型下载地址
                current_version_code: record.current_version_code,  // 版本号
                is_public: record.is_public,  // 是否公开
            })
        })

        setModalTableData(data)
    }

    const onChange = (key: string) => {
    };

    const handlePreDeploySubmit = async () => {
        // 校验表单
        deployForm.validateFields().then(async (values) => {

            setPreTableLoading(true);
            setDeployData([]);
            const configs = deployForm.getFieldsValue()
            let params = []
            if (JSON.stringify(currentDeployRecord) === '{}') {
                params = selectedRows.map(row => {
                    return {
                        'service_name': configs.service_name || '',
                        'metrics':  configs.metrics,
                        'expectedLatency':  configs.expectedLatency,
                        'expectedThroughput':  configs.expectedThroughput,
                        'model_id': row.model_id,
                        'user_id': -1
                    }
                })
                
            } else {
                params.push({
                    'service_name': configs.service_name || '',
                    'metrics':  configs.metrics,
                    'expectedLatency':  configs.expectedLatency,
                    'expectedThroughput':  configs.expectedThroughput,
                    'model_id':  currentDeployRecord.model_id,
                    'user_id': -1
                })
            }
    
            const res = await fetch('/api/deploy', {
                method: 'POST',
                body: JSON.stringify({'models': params})
            })
        
            if (res.ok) {
                try {
                    let temp = await res.json();
                    console.log(1111, temp)
                    setDeployData(temp?.return_data);
                    let result = temp?.result;
                    setPreDeployResult(result);
                    setPreTableLoading(false);

                    let message = {
                        success: temp?.success,
                        message: new Date().toLocaleString() + ' 调用接口【deploy】：' + (temp?.message || '评估模型预部署')
                    }
                    sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))

                } catch (error) {
                    setPreTableLoading(false);
                    messageApi.info('预部署接口出错', [5]);

                    let message = {
                        success: false,
                        message: new Date().toLocaleString() + ' 调用接口【deploy】：' + (error || '评估模型预部署接口失败')
                    }
                    sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
                }


            
            } else {
                setPreTableLoading(false);
                messageApi.error('请求发送失败', [5]);

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【deploy】：' + ('评估模型预部署接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }

        }).catch((errorInfo) => {
        });
    }

    const handleDeploySubmit = () => {
        // 校验表单
        deployForm.validateFields().then(async (values) => {

            setDeploymentOpen(false);
            setSpinning(true);
            let params = deployData
    
            const res = await fetch('/api/launch', {
                method: 'POST',
                body: JSON.stringify({'return_data': params})
            })
        
            if (res.ok) {
                try {
                    let temp = await res.json();
                    if (temp.success)  {
                        setSpinning(false);
                        messageApi.success('部署成功', [5]);
                        // router.push(`/onlineService`);
                        location.href = `/onlineService`
                    }


                    let message = {
                        success: temp?.success,
                        message: new Date().toLocaleString() + ' 调用接口【launch】：' + (temp?.message || '评估模型部署')
                    }
                    sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
                } catch (error) {
                    setSpinning(false);
                    setDeploymentOpen(true);
                    messageApi.info('部署接口出错', [5]);

                    let message = {
                        success: false,
                        message: new Date().toLocaleString() + ' 调用接口【launch】：' + (error || '评估模型部署接口失败')
                    }
                    sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
                }
            } else {
                setSpinning(false);
                setDeploymentOpen(true);
                messageApi.error('请求发送失败', [5]);

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【launch】：' + ('评估模型部署接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }

        }).catch((errorInfo) => {
        });
    }

    // 校验模型名称是否存在
    const handleServiceNameValidator = async (rule, value) => {
        let params = {
            'service_name': value,
            'user_id': -1
        }

        const res = await fetch('/api/check_service_name', {
            method: 'POST',
            body: JSON.stringify(params)
        })
    
        if (res.ok) {
            let temp = await res.json();
            if (temp.success) {
                if (!temp.data?.valid) {
                    setPreTableLoading(false);
                    // throw new Error('只能包含小写字母、数字和中划线，不能以中划线开头或结尾')
                } else if (temp.data?.used) {
                    setPreTableLoading(false);
                    throw new Error('名称已存在')
                }
            } else {
                setPreTableLoading(false);
                throw new Error('服务名称查重接口不可用');
            }

            let message = {
                success: temp?.success,
                message: new Date().toLocaleString() + ' 调用接口【check_service_name】：' + (temp?.message || '服务名称检测')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【check_service_name】：' + ('服务名称检测接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))

            setPreTableLoading(false);
            throw new Error('请求发送失败');
        }
    }

    const onSelectChange = (keys, rows) => {
        setCurrentDeployRecord({})
        setSelectedKeys(keys);
        setSelectedRows(rows);
    }
    const hasSelected = selectedRows.length > 0;

    const tabItems = [
        {
            key: '1',
            label: '所有模型',
            children: (
                <>
                    <div style={{ marginBottom: 16 }}>
                        <Button 
                            type="primary" 
                            onClick={() => {
                                setCurrentDeployRecord({})
                                deployForm.setFieldValue('service_name', `${selectedRows[0]['model_name']?.toLowerCase()}`)
                                setDeploymentOpen(true)
                                setPreDeployResult([])
                            }} 
                            disabled={!hasSelected}>
                        部署</Button>
                        <span style={{ marginLeft: 8 }}>
                            {hasSelected ? `已选择 ${selectedKeys.length} 个模型` : ''}
                        </span>
                    </div>
                    <Table
                        bordered
                        size="small"
                        scroll={{ y: 'calc(100vh - 300px)' }}
                        rowKey={ (record) => record.model_id }
                        // pagination={{ defaultPageSize: 5 }}
                        pagination={ false }
                        columns={ modalTableColumns }
                        dataSource={ modalTableData }
                        rowSelection={{
                            selectedKeys,
                            onChange: onSelectChange,
                            // getCheckboxProps: (record) => ({
                            //     disabled: selectedKeys?.length >= 2 && !selectedKeys.includes(record.key),
                            // })
                        }}
                    />
                </>
            ),
        },
        // {
        //     key: '2',
        //     label: 'My Model',
        //     children: ''
        // },
    ];

    const modalDetailItems = [
        { key: '0', label: '模型ID', children: currentModelDetail?.model_id },
        { key: '1', label: '模型名称', children: currentModelDetail?.model_name },
        { key: '2', label: '模型描述', children: currentModelDetail?.description, span: 2 },
        { key: '3', label: '模型类型', children: currentModelDetail?.model_type },
        { key: '5', label: '模型大小', children: currentModelDetail?.model_size + " Bytes" },
        { key: '4', label: '模型标签', children: currentModelDetail?.model_tag },
        { key: '6', label: '版本号', children: currentModelDetail?.current_version_code },
        { key: '9', label: '数据集类型', children: currentModelDetail?.dataset_type == 0 ? 'Text' : 'Other' },
        { key: '10', label: '是否公开', children: currentModelDetail?.is_public ? '是' : '否' },
        { key: '11', label: '创建时间', children: currentModelDetail?.gmt_create },
        { key: '12', label: '修改时间', children: currentModelDetail?.gmt_modified },
        { key: '13', label: '模型来源', children: currentModelDetail?.model_source, span: 2 },
        { key: '14', label: '模型下载地址', children: <a target='_blank' href={ currentModelDetail?.source_url }>{ currentModelDetail?.source_url }</a>, span: 2 },
    ]

    return (
    <>
        <Spin tip="Loading" spinning={spinning} size="large">
            <main>
                {contextHolder}
                <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
                
                <Drawer title="模型详情" width="600" placement="right" onClose={() => setIsDetailOpen(false)} open={isDetailOpen}>
                    <Descriptions column={2} items={modalDetailItems} /><br />
                </Drawer>

                <Modal
                    title="部署参数"
                    centered
                    destroyOnClose
                    maskClosable={false}
                    open={deploymentOpen}
                    onOk={handleDeploySubmit}
                    onCancel={() => setDeploymentOpen(false)}
                    cancelText="取消"
                    okText="部署"
                    width='90%'
                    okButtonProps={{ disabled: deployData.length == 0 }}
                    afterOpenChange={(open) => {
                        if (open) {
                            handlePreDeploySubmit();
                        }
                    }}
                >
                    <Flex gap="small" justify="space-between" gap="60px">
                        <Form
                            preserve={false}
                            form={deployForm}
                            labelCol = {{span: 13}}
                            wrapperCol={{ span: 11 }}
                            labelAlign="left"
                            size='small'
                            style={{ minWidth: '400px' }}
                        >
                            <br />
                            <Form.Item name="service_name" label="服务名称"
                                rules={[
                                    { required: true, message: '请输入服务名称'},
                                    { pattern: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/, message: '只能包含小写字母、数字和中划线，不能以中划线开头或结尾'},
                                    { validator: handleServiceNameValidator }
                                ]}>
                                <Input onChange={ handlePreDeploySubmit }/>
                            </Form.Item>
                            <Form.Item name="metrics" label="指标" initialValue='latency'
                                rules={[{ required: true, message: '请选择指标'}]}
                            >
                                <Select
                                    style={{ width: 180 }}
                                    onChange={ handlePreDeploySubmit }
                                    options={[
                                        {value:'latency', label:'Min Latency'},
                                        {value:'qps', label:'Max QPS'},
                                        {value:'throughput', label:'Max Throughput'},
                                        {value:'cost', label:'Min Cost'}
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item name="expectedLatency" label="期望延迟(ms)" initialValue={300} 
                                rules={[{ required: true, message: '请填写期望延迟'}]}
                            >
                                <InputNumber 
                                onChange={ handlePreDeploySubmit }
                                 style={{ width: 80 }}/>
                            </Form.Item> 
                            <Form.Item name="expectedThroughput" label="期望吞吐量(token/s)" initialValue={20}
                                rules={[{ required: true, message: '请填写期望吞吐量'}]}
                            >
                                <InputNumber 
                                onChange={ handlePreDeploySubmit }
                                 style={{ width: 80 }}/>
                            </Form.Item>
                        </Form>
                        
                        <div style={{ width: '100%' }}>
                            <Spin tip="Loading" spinning={preTableLoading} size="large" style={{ minHeight: '225px' }}>
                                <Flex vertical={ true } style={{ maxHeight: "500px", overflow: "auto"}}>
                                        {preDeployResult?.map( item => (
                                            <Table
                                                bordered
                                                size="small"
                                                scroll={{ y: '200px' }}
                                                // pagination={{ defaultPageSize: 5 }}
                                                pagination={ false }
                                                columns={ preModalTableColumns }
                                                dataSource={ item }
                                                style={{ width: '96%', marginBottom: '16px' }}
                                            />
                                        ))}
                                </Flex>
                            </Spin>
                        </div>

                    </Flex>
                </Modal>
            </main>
        </Spin>


    </>
    )
  }
  