'use client';

import { useState } from 'react';
import { Flex, Select, Button, Space, Collapse, Form, Card, Input, InputNumber, Switch, Radio, message, Table, Divider, Row, Col, Popover, Empty, Spin } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import config from "./config.json";


const Inference: React.FC = () => {
    const [spinning, setSpinning] = useState<boolean>(false);
    const [currentModel, setCurrentModel] = useState<string>('llama_7b');
    const [currentHardwares, setCurrentHardwares] = useState<string[]>(['V100', "A10"]);
    const [results, setResults] = useState<object>({});
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [estimateRecColumns, setEstimateRecColumns] = useState<object[]>([]);
    const [configurationColumns, setConfigurationColumns] = useState<object[]>([]);

    const modelConfig = config.models;
    const hardwareConfig = config.hardwares;
    const regionConfig = config.regions;
    const models = Object.keys(modelConfig).map(value => {return { value, label: value }});
    const hardwares = Object.keys(hardwareConfig).map(value => {return { value, label: value }});
    const regions = regionConfig.map(value => {return { value, label: value }});
    const nodeInfosConfig = config.nodeInfos;


    const handleModelChange = (value: string) => {
        form.resetFields();
        setCurrentModel(value);
    };
    const handleHardwareChange = (value: string[]) => {
        setCurrentHardwares(value);
    };
    const handleProfileSubmit = async () => {
        // setSpinning(true);
        // const configs = form.getFieldsValue()
        // const params = {
        //     "ModelDetails":{
        //         "num_layers": configs.num_layers,
        //         "n_head": configs.n_head,
        //         "hidden_dim": configs.hidden_dim,
        //         "vocab_size": configs.vocab_size,
        //         "max_seq_len": configs.max_seq_len,
        //         "mlp_dim": configs.mlp_dim,
        //         "family": configs.family
        //     },
        //     "HardWares": currentHardwares,
        //     "InferenceConfig": {
        //         "batch_size": configs.batch_size,
        //         "seq_len": configs.seq_len,
        //         "output_len": configs.output_len,
        //         "tp": configs.tp,
        //         "pp": configs.pp,
        //         // "use_kv_cache": configs.use_kv_cache,
        //         "optimizations": configs.optimizations.toString(),
        //         "algorithm": configs.algorithm,
        //         "elem_size": configs.elem_size,
        //         "dt": configs.dt
        //     },        
        //     "ModelConfig": { 
        //         "Framework": configs.algorithm,
        //         "FrameworkVersion": configs.FrameworkVersion,
        //         "NearestModelName": currentModel
        //     },
        //     "SLAConfig": { 
        //         "MaxLatencyThresholdsInMilliseconds": configs.MaxLatencyThresholdsInMilliseconds,
        //     },
        //     "ContainerConfig": { 
        //         "EnvironmentVariables": {"env1": 1, "env2": 2},
        //         "ServerlessConfig": {"MemorySizeInGB": 64, "JobDurationInSeconds": 3000}
        //     },
        //     "auto_parallelism": configs.auto_parallelism,
        //     "region": configs.region
        // }
        // const res = await fetch('/api/estimate', {
        //     method: 'POST',
        //     body: JSON.stringify(params)
        // })
    
        // if (res.ok) {
        //     try {
        //         let temp = await res.json();
        //         handleTableColumns(temp);
        //         setResults(temp);
        //         setSpinning(false);
        //         messageApi.success('Profile success!');
        //     } catch (error) {
        //         setResults({});
        //         setSpinning(false);
        //         messageApi.info('There are no results under this configuration!');
        //     }
        // } else {
        //     setResults({});
        //     setSpinning(false);
        //     messageApi.error('Interface error!');
        // }

        // Mock
        let temp = {
            "estimate_rec": [
                {
                    "tokens/s": 1.8297760411319486,
                    "latency(ms)": "546.51 ms",
                    "cpu_cores": 1,
                    "cpu_memory(G)": "10",
                    "gpu_type": "1 * V100",
                    "gpu_memory(G)": "1 * 12.0800",
                    "gpu_tflops": "1 * 0.0121",
                    "tp*pp": "1 * 1"
                },
                {
                    "tokens/s": 2.8690811476043776,
                    "latency(ms)": "348.54 ms",
                    "cpu_cores": 1,
                    "cpu_memory(G)": "10",
                    "gpu_type": "2 * V100",
                    "gpu_memory(G)": "2 * 6.0400",
                    "gpu_tflops": "2 * 0.0062",
                    "tp*pp": "2 * 1"
                },
                {
                    "tokens/s": 4.2122403499585275,
                    "latency(ms)": "237.4 ms",
                    "cpu_cores": 1,
                    "cpu_memory(G)": "10",
                    "gpu_type": "4 * V100",
                    "gpu_memory(G)": "4 * 3.0200",
                    "gpu_tflops": "4 * 0.0032",
                    "tp*pp": "4 * 1"
                },
                {
                    "tokens/s": 3.8874225408663525,
                    "latency(ms)": "257.24 ms",
                    "cpu_cores": 1,
                    "cpu_memory(G)": "10",
                    "gpu_type": "8 * V100",
                    "gpu_memory(G)": "8 * 1.5100",
                    "gpu_tflops": "8 * 0.0017",
                    "tp*pp": "8 * 1"
                },
                {
                    "tokens/s": 1.220046352208271,
                    "latency(ms)": "819.64 ms",
                    "cpu_cores": 1,
                    "cpu_memory(G)": "10",
                    "gpu_type": "1 * A10",
                    "gpu_memory(G)": "1 * 12.0800",
                    "gpu_tflops": "1 * 0.0121",
                    "tp*pp": "1 * 1"
                },
                {
                    "tokens/s": 2.039007318879225,
                    "latency(ms)": "490.43 ms",
                    "cpu_cores": 1,
                    "cpu_memory(G)": "10",
                    "gpu_type": "2 * A10",
                    "gpu_memory(G)": "2 * 6.0400",
                    "gpu_tflops": "2 * 0.0062",
                    "tp*pp": "2 * 1"
                },
                {
                    "tokens/s": 3.132469856217753,
                    "latency(ms)": "319.24 ms",
                    "cpu_cores": 1,
                    "cpu_memory(G)": "10",
                    "gpu_type": "4 * A10",
                    "gpu_memory(G)": "4 * 3.0200",
                    "gpu_tflops": "4 * 0.0032",
                    "tp*pp": "4 * 1"
                },
                {
                    "tokens/s": 3.3351137349693407,
                    "latency(ms)": "299.84 ms",
                    "cpu_cores": 1,
                    "cpu_memory(G)": "10",
                    "gpu_type": "8 * A10",
                    "gpu_memory(G)": "8 * 1.5100",
                    "gpu_tflops": "8 * 0.0017",
                    "tp*pp": "8 * 1"
                }
            ],
            "configuration": [
                {
                    "InstanceId": "ecs.gn6e-c12g1.12xlarge",
                    "MinModelLatency(ms)": 546.51,
                    "MaxThroughPut(token/s)": 1.87,
                    "MaxKiloTokenPerCost(ktoken/¥)": 85.43,
                    "MinCostPerInference(¥)": 0.01199
                },
                {
                    "InstanceId": "ecs.gn6e-c12g1.3xlarge",
                    "MinModelLatency(ms)": 546.51,
                    "MaxThroughPut(token/s)": 1.87,
                    "MaxKiloTokenPerCost(ktoken/¥)": 341.73,
                    "MinCostPerInference(¥)": 0.003
                },
                {
                    "InstanceId": "ecs.gn6e-c12g1.24xlarge",
                    "MinModelLatency(ms)": 546.51,
                    "MaxThroughPut(token/s)": 1.87,
                    "MaxKiloTokenPerCost(ktoken/¥)": 42.71,
                    "MinCostPerInference(¥)": 0.02397
                },
                {
                    "InstanceId": "ecs.gn6v-c10g1.20xlarge",
                    "MinModelLatency(ms)": 546.51,
                    "MaxThroughPut(token/s)": 1.87,
                    "MaxKiloTokenPerCost(ktoken/¥)": 30.71,
                    "MinCostPerInference(¥)": 0.03334
                },
                {
                    "InstanceId": "ecs.gn6v-c8g1.2xlarge",
                    "MinModelLatency(ms)": 546.51,
                    "MaxThroughPut(token/s)": 1.87,
                    "MaxKiloTokenPerCost(ktoken/¥)": 254.93,
                    "MinCostPerInference(¥)": 0.00402
                },
                {
                    "InstanceId": "ecs.gn6v-c8g1.8xlarge",
                    "MinModelLatency(ms)": 546.51,
                    "MaxThroughPut(token/s)": 1.87,
                    "MaxKiloTokenPerCost(ktoken/¥)": 63.73,
                    "MinCostPerInference(¥)": 0.01607
                },
                {
                    "InstanceId": "ecs.gn6e-c12g1.12xlarge",
                    "MinModelLatency(ms)": 348.54,
                    "MaxThroughPut(token/s)": 2.94,
                    "MaxKiloTokenPerCost(ktoken/¥)": 133.95,
                    "MinCostPerInference(¥)": 0.00764
                },
                {
                    "InstanceId": "ecs.gn6e-c12g1.24xlarge",
                    "MinModelLatency(ms)": 348.54,
                    "MaxThroughPut(token/s)": 2.94,
                    "MaxKiloTokenPerCost(ktoken/¥)": 66.98,
                    "MinCostPerInference(¥)": 0.01529
                },
                {
                    "InstanceId": "ecs.gn6v-c10g1.20xlarge",
                    "MinModelLatency(ms)": 348.54,
                    "MaxThroughPut(token/s)": 2.94,
                    "MaxKiloTokenPerCost(ktoken/¥)": 48.15,
                    "MinCostPerInference(¥)": 0.02126
                },
                {
                    "InstanceId": "ecs.gn6v-c8g1.8xlarge",
                    "MinModelLatency(ms)": 348.54,
                    "MaxThroughPut(token/s)": 2.94,
                    "MaxKiloTokenPerCost(ktoken/¥)": 99.93,
                    "MinCostPerInference(¥)": 0.01025
                },
                {
                    "InstanceId": "ecs.gn6e-c12g1.12xlarge",
                    "MinModelLatency(ms)": 237.4,
                    "MaxThroughPut(token/s)": 4.31,
                    "MaxKiloTokenPerCost(ktoken/¥)": 196.66,
                    "MinCostPerInference(¥)": 0.00521
                },
                {
                    "InstanceId": "ecs.gn6e-c12g1.24xlarge",
                    "MinModelLatency(ms)": 237.4,
                    "MaxThroughPut(token/s)": 4.31,
                    "MaxKiloTokenPerCost(ktoken/¥)": 98.33,
                    "MinCostPerInference(¥)": 0.01041
                },
                {
                    "InstanceId": "ecs.gn6v-c10g1.20xlarge",
                    "MinModelLatency(ms)": 237.4,
                    "MaxThroughPut(token/s)": 4.31,
                    "MaxKiloTokenPerCost(ktoken/¥)": 70.7,
                    "MinCostPerInference(¥)": 0.01448
                },
                {
                    "InstanceId": "ecs.gn6v-c8g1.8xlarge",
                    "MinModelLatency(ms)": 237.4,
                    "MaxThroughPut(token/s)": 4.31,
                    "MaxKiloTokenPerCost(ktoken/¥)": 146.71,
                    "MinCostPerInference(¥)": 0.00698
                },
                {
                    "InstanceId": "ecs.gn6e-c12g1.24xlarge",
                    "MinModelLatency(ms)": 257.24,
                    "MaxThroughPut(token/s)": 3.98,
                    "MaxKiloTokenPerCost(ktoken/¥)": 90.75,
                    "MinCostPerInference(¥)": 0.01128
                },
                {
                    "InstanceId": "ecs.gn6v-c10g1.20xlarge",
                    "MinModelLatency(ms)": 257.24,
                    "MaxThroughPut(token/s)": 3.98,
                    "MaxKiloTokenPerCost(ktoken/¥)": 65.25,
                    "MinCostPerInference(¥)": 0.01569
                },
                {
                    "InstanceId": "ecs.gn7i-c8g1.2xlarge",
                    "MinModelLatency(ms)": 819.64,
                    "MaxThroughPut(token/s)": 1.25,
                    "MaxKiloTokenPerCost(ktoken/¥)": 471.81,
                    "MinCostPerInference(¥)": 0.00217
                },
                {
                    "InstanceId": "ecs.gn7i-c32g1.16xlarge",
                    "MinModelLatency(ms)": 819.64,
                    "MaxThroughPut(token/s)": 1.25,
                    "MaxKiloTokenPerCost(ktoken/¥)": 168.98,
                    "MinCostPerInference(¥)": 0.00606
                },
                {
                    "InstanceId": "ecs.gn7i-c16g1.4xlarge",
                    "MinModelLatency(ms)": 819.64,
                    "MaxThroughPut(token/s)": 1.25,
                    "MaxKiloTokenPerCost(ktoken/¥)": 445.6,
                    "MinCostPerInference(¥)": 0.0023
                },
                {
                    "InstanceId": "ecs.gn7i-c32g1.8xlarge",
                    "MinModelLatency(ms)": 819.64,
                    "MaxThroughPut(token/s)": 1.25,
                    "MaxKiloTokenPerCost(ktoken/¥)": 337.95,
                    "MinCostPerInference(¥)": 0.00303
                },
                {
                    "InstanceId": "ecs.gn7i-c32g1.32xlarge",
                    "MinModelLatency(ms)": 819.64,
                    "MaxThroughPut(token/s)": 1.25,
                    "MaxKiloTokenPerCost(ktoken/¥)": 84.49,
                    "MinCostPerInference(¥)": 0.01212
                },
                {
                    "InstanceId": "ecs.gn7i-c32g1.16xlarge",
                    "MinModelLatency(ms)": 490.43,
                    "MaxThroughPut(token/s)": 2.09,
                    "MaxKiloTokenPerCost(ktoken/¥)": 282.41,
                    "MinCostPerInference(¥)": 0.00363
                },
                {
                    "InstanceId": "ecs.gn7i-c32g1.32xlarge",
                    "MinModelLatency(ms)": 490.43,
                    "MaxThroughPut(token/s)": 2.09,
                    "MaxKiloTokenPerCost(ktoken/¥)": 141.2,
                    "MinCostPerInference(¥)": 0.00725
                },
                {
                    "InstanceId": "ecs.gn7i-c32g1.32xlarge",
                    "MinModelLatency(ms)": 319.24,
                    "MaxThroughPut(token/s)": 3.21,
                    "MaxKiloTokenPerCost(ktoken/¥)": 216.92,
                    "MinCostPerInference(¥)": 0.00472
                }
            ]
        }
        handleTableColumns(temp);
        setResults(temp);
    };
    const handleTableColumns = (results) => {
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
                    render: () => <Button type="primary" size='small'> Deploy </Button>,
                }])
                setEstimateRecColumns(estimateRecColumns);
            } else if (resultKey == 'configuration') {
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
                configurationColumns = configurationColumns.concat([{
                    title: 'Action',
                    dataIndex: '',
                    key: 'x',
                    width: 120,
                    align: 'center',
                    render: () => <Button type="primary" size='small'> Deploy </Button>,
                }])
                setConfigurationColumns(configurationColumns);
            }
        });
    }

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
                                defaultValue={ currentModel }
                                style={{ width: 140 }}
                                onChange={ handleModelChange }
                                options={ models }
                            />
                        </Col>
                        <Col span={5}>
                            <Form.Item name="family" label="Family" initialValue={ modelConfig[currentModel].family }>
                                <Input style={{ width: 100 }}/>
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
                            <Form.Item name="seq_len" label="Sequence Length" initialValue={16}>
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
                            <Form.Item name="region" label="Region" initialValue={regions[1].value}>
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
                                defaultValue={ currentHardwares }
                                style={{ minWidth: 400, maxWidth: 500, }}
                                onChange={ handleHardwareChange }
                                options={ hardwares }
                            />
                        </Col>
                        <Col span={3}>
                            <Button type="primary" size="normal" onClick={ handleProfileSubmit }>Profile</Button>
                        </Col>


                        <Col span={24}>
                            <Collapse size="small" items={[{ key: '1', label: 'Config', forceRender: true, children: (
                                    <Space align="start" style={{ width: '100%', overflowX: 'auto', paddingBottom: 6 }}>
                                        <Card size="small" title={ `${currentModel} 模型参数` } >
                                            <Form.Item style={{marginBottom: 10}} name="num_layers" label="Layers" initialValue={ modelConfig[currentModel].num_layers }>
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="n_head" label="Heads" initialValue={ modelConfig[currentModel].n_head }>
                                                <InputNumber/>
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="hidden_dim" label="Hidden Dim Size" initialValue={ modelConfig[currentModel].hidden_dim }>
                                                <InputNumber/>
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="vocab_size" label="Vocabulary Size" initialValue={ modelConfig[currentModel].vocab_size }>
                                                <InputNumber/>
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="max_seq_len" label="Max Sequence Length" initialValue={ modelConfig[currentModel].max_seq_len }>
                                                <InputNumber/>
                                            </Form.Item>
                                            <Form.Item style={{marginBottom: 10}} name="mlp_dim" label="MLP Dim Size" initialValue={ modelConfig[currentModel].mlp_dim }>
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
                                            <Form.Item style={{marginBottom: 10}} name="MaxLatencyThresholdsInMilliseconds" label="Expect Latency (ms)" initialValue={500}>
                                                <InputNumber />
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
                                            Object.keys(hardwareConfig[currentHardwares[0]]).map(key => {
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
                            <Table size="small"
                                // title={() => resultKey}
                                bordered
                                pagination={{ defaultPageSize: 5 }}
                                columns={ resultKey == 'estimate_rec' ? estimateRecColumns : configurationColumns }
                                dataSource={ results[resultKey].map((item: { [x: string]: string; }) => {
                                    if (item['tokens/s']) {
                                        item['tokens/s'] = (Number)(item['tokens/s']).toFixed(2)
                                    }
                                    if (item['latency(ms)']) {
                                        item['latency(ms)'] = item['latency(ms)'].split(' ')[0]
                                    }
                                    return item;
                                }) } />
                        </>
                )) || <Empty imageStyle={{ height: 200 }} /> ) }           
            </main>
        </Spin>
    )
  }


export default Inference;