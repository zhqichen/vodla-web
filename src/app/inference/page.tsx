'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Flex, Select, Button, Space, Collapse, Form, Card, Input, InputNumber, Switch, Radio, message, Table, Divider, Row, Col, Popover, Empty, Spin, Modal, Upload } from 'antd';
import { useRouter } from 'next/navigation';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useSearchParams } from "next/navigation";

import config from "./config.json";

const { TextArea } = Input;

const Inference: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams()

    const [spinning, setSpinning] = useState<boolean>(false);
    const [currentModel, setCurrentModel] = useState<string>('');
    const [currentHardwares, setCurrentHardwares] = useState<string[]>(['A10']);
    const [results, setResults] = useState<object>({});
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [estimateRecColumns, setEstimateRecColumns] = useState<object[]>([]);
    const [configurationColumns, setConfigurationColumns] = useState<object[]>([]);
    const [deploymentOpen, setDeploymentOpen] = useState<boolean>(false);
    const [currentDeployRecord, setCurrentDeployRecord] = useState<object>({});
    const [deployForm] = Form.useForm();
    const [deployMethod, setDeployMethod] = useState<string>('processor');
    const [modelType, setModelType] = useState<string>('customized');
    const [selectedEstimateRecKeys, setSelectedEstimateRecKeys] = useState<React.Key[]>([]);
    const [selectedEstimateRecRows, setSelectedEstimateRecRows] = useState<object[]>([]);
    const [models, setModels] = useState<object[]>([]);
    const [modelConfig, setModelConfig] = useState<object>({});

    const [hardwareConfig, setHardwareConfig] = useState<object>({});
    const [hardwares, setHardwares] = useState<object[]>([]);

    const [regions, setRegions] = useState<[]>([]);
    const [currentRegion, setCurrentRegion] = useState<string>('us-east-1');


    // setModels(Object.keys(modelConfig).map(value => {return { value, label: value }}));
    const nodeInfosConfig = config.nodeInfos;

    useEffect(() => {
        // 获取 ModelList
        getModelList();
        getConfig();

        // 获取URL的参数
        // let modelName = GetQueryString('modelName');
        // if (modelName) {
        //     //TODO: 设置参数
        //     setCurrentModel(modelName)
        //     // 手动 Evaluate
        //     handleProfileSubmit();
        // }
    }, []);

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null)
            context = decodeURIComponent(r[2]);
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    }

    const getModelList = async () => {
        let configs = {}
        let models = []
        let currentModel = ''
        let currentModelID = 0
        const res = await fetch('/api/get_model_list')
    
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp.success) {
                    models = temp.data?.map((item) => {
                        let con = JSON.parse(item?.configs || '{}')
                        con['model_id'] = item?.model_id
                        configs[item?.model_name] = con;
                        return  { value: item?.model_name, label: item?.model_name }
                    })
                    let modelName = searchParams.get('modelName') || '';
                    currentModel = modelName || temp.data[0]?.model_name;
                    currentModelID = temp.data[0]?.model_id;
                    setModels(models);
                    setCurrentModel(currentModel);
                    setModelConfig(configs)
                    updateModelConfigs(configs, currentModel);

                    // if (modelName) {
                    //     setTimeout(() => {
                    //         handleProfileSubmit();
                    //     }, 2000);
                    // }
                } else {
                    messageApi.info('模型列表获取接口不可用', [5]);
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_model_list】：' + (temp?.message || '获取模型列表')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                console.log(error)
                messageApi.error('模型列表获取接口出错', [5]);

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_model_list】：' + (error || "获取模型列表接口失败")
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs') || '[]'))]))
            }
        } else {
            messageApi.error('请求发送失败', [5]);

            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_model_list】：' + ("获取模型列表接口失败")
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs') || '[]'))]))
        }
    };

    const getConfig = async () => {
        let res = await fetch('/api/get_hardware_list');
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp.success) {
                    setHardwareConfig(temp.data)
                    setHardwares(Object.keys(temp.data).map(value => {return { value, label: value }}))
                    setCurrentHardwares(Object.keys(temp.data)[0] ? [Object.keys(temp.data)[0]] : [])
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_hardware_list】：' + (temp?.message || '获取硬件列表')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_hardware_list】：' + (error || '获取硬件列表接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_hardware_list】：' + ('获取硬件列表接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        
        }

        res = await fetch('/api/get_region_list');
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp.success) {
                    setRegions(temp?.data?.regions.map(value => {return { value, label: value }}))
                    form.setFieldValue('region', temp?.data?.regions[0])
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_region_list】：' + (temp?.message || '获取地区列表')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch(error) {
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_region_list】：' + (error || '获取地区列表接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_region_list】：' + ('获取地区列表接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }

    const handleModelChange = (value: string) => {
        setCurrentModel(value);
        updateModelConfigs(modelConfig, value);
    };

    const updateModelConfigs = (modelConfig, value) => {
        form.setFieldsValue({
            "family": modelConfig[value]?.family || '',
            "num_layers": modelConfig[value]?.num_layers,
            "n_head": modelConfig[value]?.n_head,
            "hidden_dim": modelConfig[value]?.hidden_dim,
            "vocab_size": modelConfig[value]?.vocab_size,
            "max_seq_len": modelConfig[value]?.max_seq_len,
            "mlp_dim": modelConfig[value]?.mlp_dim
        })
    }

    const handleHardwareChange = (value: string[]) => {
        setCurrentHardwares(value);
    };
    const handleProfileSubmit = async () => {
        setSpinning(true);
        const configs = form.getFieldsValue()
        const params = {
            "ModelDetails":{
                "num_layers": configs.num_layers,
                "n_head": configs.n_head,
                "hidden_dim": configs.hidden_dim,
                "vocab_size": configs.vocab_size,
                "max_seq_len": configs.max_seq_len,
                "mlp_dim": configs.mlp_dim,
                "family": configs.family || 'family'
            },
            "HardWares": currentHardwares,
            "InferenceConfig": {
                "batch_size": configs.batch_size,
                "seq_len": configs.seq_len,
                "output_len": configs.output_len,
                "tp": configs.tp,
                "pp": configs.pp,
                // "use_kv_cache": configs.use_kv_cache,
                "optimizations": configs.optimizations.toString(),
                "algorithm": configs.algorithm,
                "elem_size": configs.elem_size,
                "dt": configs.dt
            },        
            "ModelConfig": { 
                "Framework": configs.algorithm,
                "FrameworkVersion": configs.FrameworkVersion,
                "NearestModelName": currentModel
            },
            "SLAConfig": { 
                "MaxLatencyThresholdsInMilliseconds": configs.MaxLatencyThresholdsInMilliseconds,
            },
            "ContainerConfig": { 
                "EnvironmentVariables": {"env1": 1, "env2": 2},
                "ServerlessConfig": {"MemorySizeInGB": 64, "JobDurationInSeconds": 3000}
            },
            "auto_parallelism": configs.auto_parallelism,
            "region": configs.region,
            "model_id": modelConfig[currentModel]?.model_id
        }
        console.log(params)
        const res = await fetch('/api/estimate', {
            method: 'POST',
            body: JSON.stringify(params)
        })
    
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp.success) {
                    handleTableColumns(temp.data);
                    setResults(temp.data);
                    setSpinning(false);
                    messageApi.success('模型评估成功');
                } else {
                    messageApi.info('模型评估接口不可用', [5]);
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【estimate】：' + (temp?.message || '评估模型')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                setResults({});
                setSpinning(false);
                messageApi.error('模型评估接口出错', [5]);

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【estimate】：' + (error || '评估模型接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            setResults({});
            setSpinning(false);
            messageApi.error('请求发送失败', [5]);

            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【estimate】：' + ('评估模型接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))

            // Mock
            // let temp = mockData;
            // handleTableColumns(temp);
            // setResults(temp);
            // setSpinning(false);
            // messageApi.success('Profile success!');
        }


    };
    const handleTableColumns = (results) => {
        setEstimateRecColumns([]);
        setConfigurationColumns([]);

        let estimateRecColumns: any[] | ((prevState: object[]) => object[]) = [];
        let configurationColumns: any[] | ((prevState: object[]) => object[]) = [];
        let estimateRecColumnsChildrenFirst = {
            title: 'Results',
            children: []
        };
        let estimateRecColumnsChildrenSecond = {
            title: 'Parameters',
            children: []
        };
        // let configurationColumnsChildrenFirst = {
            
        //     title: 'configurationColumnsChildrenFirst',
        //     children: []
        // };
        // let configurationColumnsChildrenSecond = {
            
        //     title: 'configurationColumnsChildrenSecond',
        //     children: []
        // };
        Object.keys(results).forEach(resultKey => {
            if (resultKey == 'estimate_rec') {
                Object.keys(results[resultKey][0]).forEach(item => {
                    if (item == 'tokens/s' || item == 'latency(ms)') {
                        estimateRecColumnsChildrenFirst.children.push({
                                title: item.replace(/_/g, ' ').replace(/\b\w|\s\w/g, fw => { return fw.toUpperCase() }), 
                                dataIndex: item,
                                key: item,
                                showSorterTooltip: false,
                                sorter: (a: { [x: string]: number; }, b: { [x: string]: number; }) => a[item] - b[item]
                        })
                    } else {
                        estimateRecColumnsChildrenSecond.children.push({
                            title: item.replace(/_/g, ' ').replace(/\b\w|\s\w/g, fw => { return fw.toUpperCase() }), 
                            dataIndex: item,
                            key: item,
                            showSorterTooltip: false,
                        })
                    }
                })
                estimateRecColumns.push(estimateRecColumnsChildrenFirst);
                estimateRecColumns.push(estimateRecColumnsChildrenSecond);
                estimateRecColumns = estimateRecColumns.concat([{
                    title: 'Action',
                    dataIndex: '',
                    key: 'x',
                    width: 120,
                    align: 'center',
                    render: (_, record) => <a onClick={() => {
                        setCurrentDeployRecord(record);
                        setDeploymentOpen(true)
                    }
                    }> Deploy </a>,
                }])
                setEstimateRecColumns(estimateRecColumns);

            } else if (resultKey == 'configuration' && results[resultKey].length != 0) {
                Object.keys(results[resultKey][0]).forEach(item => {
                    if (item == 'InstanceId') {
                        configurationColumns.push({
                                title: item, 
                                dataIndex: item, 
                                key: item,
                                render: (_: any, { InstanceId }: any) => (
                                    <>
                                        { InstanceId }&nbsp;&nbsp;
                                        <Popover placement="right" title={InstanceId} content={
                                            <div>
                                                { Object.keys(nodeInfosConfig[InstanceId]).map((item, index) => (
                                                    <p key={ `${item}${index}` }><span style={{ display: 'inline-block', width: '96px' }}>{ item }</span>:&nbsp;&nbsp;&nbsp;&nbsp;{ nodeInfosConfig[InstanceId][item] }</p>
                                                ))
                                                }
                                            </div>
                                        }>
                                            <InfoCircleOutlined />
                                        </Popover>
                                    </>
                                )
                            }
                        ) 
                    } else {
                        configurationColumns.push({ 
                            title: item.replace(/_/g, ' ').replace(/\b\w|\s\w/g, fw => { return fw.toUpperCase() }), 
                            dataIndex: item, 
                            key: item,
                            showSorterTooltip: false,
                            sorter: (a: { [x: string]: number; }, b: { [x: string]: number; }) => a[item] - b[item]
                        }) 
                    }
        
                })
                // configurationColumns = configurationColumns.concat([{
                //     title: 'Action',
                //     dataIndex: '',
                //     key: 'x',
                //     width: 120,
                //     align: 'center',
                //     render: () => <Button type="primary" size='small'> Deploy </Button>,
                 // }])
               setConfigurationColumns(configurationColumns);
            }
        });
    }
    const handleDeploySubmit = async () => {
        setDeploymentOpen(false);

        setSpinning(true);
        const configs = deployForm.getFieldsValue()
        let params = {return_data: []}
        if (JSON.stringify(currentDeployRecord) == '{}') {
            params.return_data = selectedEstimateRecRows.map(row => {
                return {
                    // 'metrics':  configs.metrics,
                    'expectedLatency':  configs.expectedLatency,
                    'service_user': configs.service_user,
                    'expectedThroughput':  configs.expectedThroughput,
                    'cpu_cores':  row['cpu_cores'],
                    'cpu_memory': row['cpu_memory'],
                    'gpu_type': row['gpu_type']?.split("*")[1].trim(),
                    'tflops': row['gpu_tflops'],
                    'tp*pp': row['tp*pp'],
                    'gpu_memory': row['gpu_memory(G)']?.split("*")[1].trim(),
                    'model_id': modelConfig[currentModel]?.model_id,
                    'user_id': -1
                }
            })
            
        } else {
            params.return_data.push({
                // 'metrics':  configs.metrics,
                'expectedLatency':  configs.expectedLatency,
                'service_user': configs.service_user,
                'expectedThroughput':  configs.expectedThroughput,
                'cpu_cores':  currentDeployRecord['cpu_cores'],
                'cpu_memory': currentDeployRecord['cpu_memory'],
                'gpu_type': currentDeployRecord['gpu_type']?.split("*")[1].trim(),
                'tflops': currentDeployRecord['gpu_tflops'],
                'tp*pp': currentDeployRecord['tp*pp'],
                'gpu_memory': currentDeployRecord['gpu_memory(G)']?.split("*")[1].trim(),
                'model_id': modelConfig[currentModel]?.model_id,
                'user_id': -1
            })
        }

        const res = await fetch('/api/launch', {
            method: 'POST',
            body: JSON.stringify({return_data: params.return_data})
        })
    
        if (res.ok) {
            try {
                let temp = await res.json();
                setSpinning(false);
                messageApi.success('部署成功');
                // router.push(`/onlineService`);
                location.href = "/onlineService"

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

            // setSpinning(false);
            // messageApi.success('Deployment submitted!');
            // //TODO: 获取服务 ids 跳转
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【launch】：' + ('评估模型部署接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
        
    }

    const onSelectEstimateRecChange = (keys, rows) => {
        // console.log('selectedRowKeys changed: ', rows);
        setCurrentDeployRecord({})
        setSelectedEstimateRecKeys(keys);
        setSelectedEstimateRecRows(rows);
    }

    const hasEstimateRecSelected = selectedEstimateRecRows.length > 0;

    return (
        <Spin tip="Loading" spinning={spinning} size="large">
            <main style={{ minWidth: 1200}}>
                {contextHolder}

                <Form
                    form={form}
                    colon={false}
                    labelAlign="left"
                    size='small'
                    layout="inline"
                    style={{ marginBottom: 24 }}
                >
                    <Row gutter={[4, 12]}>
                        <Col span={2}>
                            <span style={{ fontWeight: "bold" }}>Models: </span>
                        </Col>
                        <Col span={5}>
                            <span>Name&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Select
                                value={ currentModel }
                                style={{ width: 140 }}
                                onChange={ handleModelChange }
                                options={ models }
                            />
                        </Col>
                        <Col span={5}>
                            <Form.Item name="family" label="Family">
                                <Input style={{ width: 100 }} />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item name="dt" label="Data Type" initialValue="float16">
                                <Input style={{ width: 100 }} />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item name="batch_size" label="Batch Size" initialValue={1}>
                                <InputNumber />
                            </Form.Item>
                        </Col>
                        <Col span={2}></Col>

                        <Col span={2}></Col>
                        <Col span={5}>
                            <Form.Item name="seq_len" label="Input Length" initialValue={16}>
                                <InputNumber />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item name="output_len" label="Output Length" tooltip="0 for max" initialValue={32}>
                                <InputNumber />
                            </Form.Item>
                        </Col>
                        <Col span={5}> 
                            <Form.Item name="elem_size" label="Element Size" initialValue={2}>
                                <InputNumber />
                            </Form.Item>
                        </Col>
                        <Col span={7}></Col>

                        <Col span={2}>
                            <span style={{ fontWeight: "bold" }}>Expect: </span>
                        </Col>
                        <Col span={5}>
                            <Form.Item name="MaxLatencyThresholdsInMilliseconds" label="Expect Latency (ms)" initialValue={500}>
                                <InputNumber />
                            </Form.Item>
                        </Col>
                        <Col span={17}></Col>
                    
                        <Col span={2}>
                            <span style={{ fontWeight: "bold" }}>Framework: </span>
                        </Col>
                        <Col span={10}  >
                            <Form.Item name="algorithm" label="Name" initialValue="pytorch">
                                <Radio.Group>
                                    <Radio value="pytorch">PyTorch</Radio>
                                    <Radio value="AllSpark">AllSpark</Radio>
                                    <Radio value="FT">FT</Radio>
                                    <Radio value="BladeLLM">BladeLLM</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item name="FrameworkVersion" label="Version" initialValue="2.0">
                                <Input style={{ width: 70 }} />
                            </Form.Item>
                        </Col>
                        <Col span={7}></Col>



                        <Col span={2}>
                            <span style={{ fontWeight: "bold" }}>Hardwares: </span>
                        </Col>
                        <Col span={5}>
                            <Form.Item name="region" label="Region" initialValues={currentRegion}>
                                <Select
                                    style={{ width: 160 }}
                                    options={ regions }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={14}>
                            <span>Chip&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Select
                                mode="multiple"
                                allowClear
                                value={ currentHardwares }
                                style={{ minWidth: 400, maxWidth: 500, }}
                                onChange={ handleHardwareChange }
                                options={ hardwares }
                            />
                        </Col>
                        <Col span={3}>
                            <Button type="primary" size="normal" onClick={ handleProfileSubmit }>Evaluate</Button>
                        </Col>


                        <Col span={24}>
                            <Collapse size="small" items={[{ key: '1', label: 'Config', forceRender: true, children: (
                                    <Space align="start" style={{ width: '100%', overflowX: 'auto', paddingBottom: 6 }}>
                                        <Card size="small" title={ `${currentModel} 模型参数` } >
                                            <Form.Item style={{marginBottom: 10}} name="num_layers" label="Layers">
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="n_head" label="Heads">
                                                <InputNumber/>
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="hidden_dim" label="Hidden Dim Size">
                                                <InputNumber/>
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="vocab_size" label="Vocabulary Size">
                                                <InputNumber/>
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="max_seq_len" label="Max Sequence Length">
                                                <InputNumber/>
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="mlp_dim" label="MLP Dim Size">
                                                <InputNumber/>
                                            </Form.Item>
                                        </Card>

                                        <Card size="small" title='运行参数' style={{ height: 278 }}>
                                            <Form.Item style={{marginBottom: 10}} name="tp" label="Tensor Parallelism" initialValue={1}>
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="pp" label="Pipeline Parallelism" initialValue={1}>
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="auto_parallelism" label="Auto Parallelism" valuePropName="checked" initialValue={ true }>
                                                <Switch />
                                            </Form.Item>
                                            {/* <Form.Item style={{marginBottom: 10}} name="use_kv_cache" label="Use KV Cache" valuePropName="checked" initialValue={ true }>
                                                <Switch />
                                            </Form.Item> */}
                                            <Form.Item style={{marginBottom: 10}} name="optimizations" label="Optimizations" initialValue={ ['use_kv_cache', 'use_flash_attn', 'use_flash_decode'] }>
                                                <Select
                                                    mode="multiple"
                                                    allowClear
                                                    style={{ width: 330 }}
                                                    options={[
                                                        {value:'use_kv_cache', label:'use_kv_cache'},
                                                        {value:'use_flash_attn', label:'use_flash_attn'},
                                                        {value:'use_flash_decode', label:'use_flash_decode'}
                                                    ]}
                                                />
                                            </Form.Item>
                                        </Card>
                                    </Space>
                            ) }]} />
                        </Col>

                        <Col span={24}>
                            <Collapse size="small" items={[{ key: '2', label: 'Chip Parameters', children: (
                                <Table
                                    size="small"
                                    // title={() => resultKey}
                                    bordered
                                    pagination={false}
                                    style={{ marginBottom: 20 }}
                                    columns={
                                        currentHardwares.length && hardwareConfig && hardwareConfig[currentHardwares[0]] && Object.keys( hardwareConfig[currentHardwares[0]]).map(key => {
                                                return {
                                                    title: key == 'name' ? 'Chip Name' : key.replace(/_/g, ' ').replace(/\b\w|\s\w/g, fw => {
                                                        return fw.toUpperCase()
                                                    }),
                                                    dataIndex: key, 
                                                    key: key,
                                                    showSorterTooltip: false,
                                                    sorter: key == 'name' ? false : (a: { [x: string]: number; }, b: { [x: string]: number; }) => a[key] - b[key]
                                                }
                                            }
                                        )
                                    }
                                    dataSource={ currentHardwares.map(item => {
                                            hardwareConfig[item] = {'name': item, ...hardwareConfig[item]}
                                            return hardwareConfig[item]
                                        
                                    })}
                                />
                            ) }]} />

                        </Col>
                    </Row>
                </Form>

                <Divider orientation="left" orientationMargin="0">Inference Result</Divider>

                { ((results && JSON.stringify(results) !== "{}") && Object.keys(results).map(resultKey => (
                        <>
                            <Divider orientation="left" style={{ fontSize: '16px' }}>{ resultKey.replace(/_/g, ' ').replace(/\b\w|\s\w/g, fw => { return fw.toUpperCase() })}</Divider>
                            { resultKey == 'estimate_rec' && (
                                <div style={{ marginBottom: 16 }}>
                                <Button 
                                    type="primary" 
                                    onClick={() => {
                                        setCurrentDeployRecord({})
                                        setDeploymentOpen(true)
                                    }} 
                                    disabled={!hasEstimateRecSelected}>
                                    Deploy
                                </Button>
                                <span style={{ marginLeft: 8 }}>
                                    {hasEstimateRecSelected ? `Selected ${selectedEstimateRecKeys.length} items` : ''}
                                </span>
                                </div>
                            ) }
                            <Table size="small"
                                // title={() => resultKey}
                                bordered
                                scroll={{ y: 'calc(100vh - 200px)' }}
                                rowKey={(record) => record['tokens/s']}
                                // pagination={{ defaultPageSize: 5 }}
                                pagination={false}
                                rowSelection={ resultKey == 'estimate_rec' ? {
                                    selectedEstimateRecKeys,
                                    onChange: onSelectEstimateRecChange,
                                    // getCheckboxProps: (record) => ({
                                    //     disabled: selectedEstimateRecKeys?.length >= 2 && !selectedEstimateRecKeys.includes(record.key),
                                    // })
                                } : false }
                                columns={ resultKey == 'estimate_rec' ? estimateRecColumns : configurationColumns }
                                dataSource={ results[resultKey].map((item: { [x: string]: string; }, index) => {
                                    if (item['tokens/s']) {
                                        item['tokens/s'] = (Number)(item['tokens/s']).toFixed(2)
                                    }
                                    if (item['latency(ms)']) {
                                        item['latency(ms)'] = item['latency(ms)'].split(' ')[0]
                                    }
                                    item.key = index
                                    return item;
                                }) } />
                        </>
                )) || <Empty imageStyle={{ height: 200 }} /> ) }


                    <Modal
                        title="Deployment parameters"
                        centered
                        destroyOnClose
                        maskClosable={false}
                        open={deploymentOpen}
                        onOk={handleDeploySubmit}
                        onCancel={() => setDeploymentOpen(false)}
                        width={520}
                    >
                        <Form
                            form={deployForm}
                            labelCol = {{span: 12}}
                            wrapperCol={{ span: 12 }}
                            labelAlign="left"
                            size='small'
                        >
                            <br />
                            {/* <Form.Item name="metrics" label="Metrics" initialValue='latency'>
                                <Select
                                    style={{ width: 180 }}
                                    options={[
                                        {value:'latency', label:'Min Latency'},
                                        {value:'qps', label:'Max QPS'},
                                        {value:'throughput', label:'Max Throughput'},
                                        {value:'cost', label:'Min Cost'}
                                    ]}
                                />
                            </Form.Item> */}

                            <Form.Item name="service_user" label="Service Name" initialValue={currentModel}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="expectedLatency" label="Expected Latency(ms)" initialValue={300}>
                                <InputNumber style={{ width: 80 }}/> 
                            </Form.Item>
                            <Form.Item name="expectedThroughput" label="Expected Throughput(token/s)" initialValue={200}>
                                <InputNumber style={{ width: 80 }}/>
                            </Form.Item>
                        </Form>
                    </Modal>           
            </main>
        </Spin>
    )
  }


export default Inference;