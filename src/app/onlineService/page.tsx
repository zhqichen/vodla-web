'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Tabs, Table, Button, Spin, message, Drawer, Form, Input, Select, Radio, InputNumber, Modal, Space, Descriptions, List } from 'antd';
import { LineChartOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Line } from '@ant-design/plots';


import mockData from "@/app/onlineService/data.json";
// import config from "@/app/inference/config.json";

const { TextArea } = Input;

export default function OnlineService() {
    const [spinning, setSpinning] = useState<boolean>(false);
    const [stressSpinning, setStressSpinning] = useState<boolean>(false);
    const [monitorSpinning, setMonitorSpinning] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { confirm } = Modal;
    
    const [serviceTableData, setServiceTableData] = useState<object[]>([]);
    const [isDeployOpen, setIsDeployOpen] = useState<boolean>(false);
    const [deployForm] = Form.useForm();
    const [stressForm] = Form.useForm();
    const [deployMethod, setDeployMethod] = useState<string>('processor');
    const [modelType, setModelType] = useState<string>('customized');
    
    const [stressTableData, setStressTableData] = useState<object[]>([]);
    const [isStressOpen, setIsStressOpen] = useState<boolean>(false);
    
    const [serviceNames, setServiceNames] = useState<string[]>([]);
    
    const [isMonitorOpen, setIsMonitorOpen] = useState<boolean>(false);

    // const modelConfig = config.models;
    // const models = Object.keys(modelConfig).map(value => {return { value, label: value }});

    const [latencyData, setLatencyData] = useState<object[]>([]);
    const [modelLatencyData, setModelLatencyData] = useState<object[]>([]);
    const [inputThroughputData, setInputThroughputData] = useState<object[]>([]);
    const [outputThroughputData, setOutputThroughputData] = useState<object[]>([]);
    const [currentServiceName, setCurrentServiceName] = useState<string>('');
    const [qpsData, setQPSData] = useState<string>('');
    
    const [intervalStamp, setIntervalStamp] = useState(0);
    const countRef = useRef(intervalStamp);
    
    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
    const [currentServiceDetail, setCurrentServiceDetail] = useState<Object>({});
    
    const [isServiceLogOpen, setIsServiceLogOpen] = useState<boolean>(false);
    const [serviceLogSpinning, setServiceLogSpinning] = useState<boolean>(false);
    const [currentServiceLog, setCurrentServiceLog] = useState<string[]>([]);
    const [isServiceMonitorOpen, setIsServiceMonitorOpen] = useState<boolean>(false);
    const [serviceMonitorSpinning, setServiceMonitorSpinning] = useState<boolean>(false);
    
    const [allocatedGpuRatioData, setAllocatedGpuRatioData] = useState<object[]>([]);
    const [realGpuUtilData, setRealGpuUtilData] = useState<object[]>([]);
    const [allocatedGpuMemData, setAllocatedGpuMemData] = useState<object[]>([]);
    const [realGpuMemData, setRealGpuMemData] = useState<object[]>([]);
    const [containerCpuRequestUsageData, setContainerCpuRequestUsageData] = useState<object[]>([]);
    const [containerCpuUsedCoresData, setContainerCpuUsedCoresData] = useState<object[]>([]);
    const [containerMemoryUsageBytesData, setContainerMemoryUsageBytesData] = useState<object[]>([]);
    const [containerMemoryUtilData, setContainerMemoryUtilData] = useState<object[]>([]);
    const [containerSpecMemoryTotalBytesData, setContainerSpecMemoryTotalBytesData] = useState<object[]>([]);

    const [promptType, setPromptType] = useState<number>(1);
    const [dataSetOption, setDataSetOption] = useState<object>({});
    

    // 压测监控配置
    const latencyConfig = {
        data: latencyData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'latency_avg',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Latency'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val} (ms)`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const modelLatencyConfig = {
        data: modelLatencyData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'model_latency_avg',
        seriesField: 'category',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Model Latency'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val} (ms)`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const inputThroughputConfig = {
        data: inputThroughputData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'input_throughput_avg',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Input Throughput'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val} (tokens/s)`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const outputThroughputConfig = {
        data: outputThroughputData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'output_throughput_avg',
        seriesField: 'category',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Output Throughput'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val} (tokens/s)`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const qpsConfig = {
        data: qpsData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'qps',
        seriesField: 'category',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'QPS'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val} (ms)`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };

    // 服务监控配置
    const allocatedGpuRatioConfig = {
        data: allocatedGpuRatioData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'allocated_gpu_ratio',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'All Ocated GPU Ratio'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val} (%)`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const realGpuUtilConfig = {
        data: realGpuUtilData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'real_gpu_util',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Real GPU Util'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val} (%)`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const allocatedGpuMemConfig = {
        data: allocatedGpuMemData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'allocated_gpu_mem',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Allocated GPU Mem'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val} (GB)`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const realGpuMemConfig = {
        data: realGpuMemData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'real_gpu_mem',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Real GPU Mem'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val} (GB)`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const containerCpuRequestUsageConfig = {
        data: containerCpuRequestUsageData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'container_cpu_request_usage',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Container CPU Request Usage'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val}`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const containerCpuUsedCoresConfig = {
        data: containerCpuUsedCoresData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'container_cpu_used_cores',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Container CPU Used Cores'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val}`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const containerMemoryUsageBytesConfig = {
        data: containerMemoryUsageBytesData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'container_memory_usage_bytes',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Container Memory Usage Bytes'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val} (Bytes)`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const containerMemoryUtilConfig = {
        data: containerMemoryUtilData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'container_memory_util',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Container Memory Util'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val}`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };
    const containerSpecMemoryTotalBytesConfig = {
        data: containerSpecMemoryTotalBytesData,
        padding: 'auto',
        autoFit: false,
        width: 320,
        height: 200,
        xField: 'time',
        yField: 'container_spec_memory_total_bytes',
        xAxis: {
            // type: 'time',
            // mask: 'HH:mm:ss',
            tickCount: 5,
            label: {
                formatter: val => val.split(' ')[1]
            },
            title: {
                text: 'Container Spec Memory Total Bytes'
            },
        },
        yAxis: {
            label: {
                formatter: val => `${val} (Bytes)`
            }
        }
        // slider: {
        //     start: 0.1,
        //     end: 0.5,
        // },
    };


    useEffect(() => {
        countRef.current = intervalStamp;
      }, [intervalStamp]);

    useEffect(() => {
        onChange('service');

        return function inner(){
            clearInterval(countRef.current);
        }
    }, []);

    const asyncFetch = async (resource) => {
        setMonitorSpinning(true);
        const res = await fetch(`/api/get_latency?press_name=${resource.press_name}&service_name=${resource.service_name}&user_id=-1`)
    
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp.success) {
                    let latencys = [];
                    let modelLatency = [];
                    let inputThroughput = [];
                    let outputThroughput = [];
                    let qps = [];
    
                    let estimate_latency = temp?.data?.estimate?.expected_latency;
                    let estimate_throughput = temp?.data?.estimate?.expected_throughput;
                    let latency = temp?.data?.expected?.expected_latency;
                    // let in_throughput = temp?.data?.expected?.expected_throughput_in;
                    let out_throughput = temp?.data?.expected?.expected_throughput_out;
                    let expected_qps = temp?.data?.expected?.expected_qps;
    
                    temp?.data?.results.forEach(item => {
                        if (item?.latency_avg) latencys.push(item)
                        if (item?.model_latency_avg) { 
                            item.category = 'Model Latency';
                            modelLatency.push(item)
                            modelLatency.push({
                                'time': item.time,
                                'model_latency_avg': estimate_latency,
                                'category': 'Estimate Latency'
                            })
                            modelLatency.push({
                                'time': item.time,
                                'model_latency_avg': latency,
                                'category': 'Latency'
                            })
                        }
                        if (item?.input_throughput_avg) {
                            item.category = 'Input Throughput';
                            inputThroughput.push(item)
                            // inputThroughput.push({
                            //     'time': item.time,
                            //     'input_throughput_avg': in_throughput,
                            //     'category': 'Expected Input Throughput'
                            // })
                        }
                        if (item?.output_throughput_avg) {
                            item.category = 'Output Throughput';
                            outputThroughput.push(item)
                            outputThroughput.push({
                                'time': item.time,
                                'output_throughput_avg': estimate_throughput,
                                'category': 'Estimate Throughput'
                            })
                            outputThroughput.push({
                                'time': item.time,
                                'output_throughput_avg': out_throughput,
                                'category': 'Expected Output Throughput'
                            })
                        }
                        if (item?.qps) {
                            item.category = 'QPS';
                            qps.push(item)
                            qps.push({
                                'time': item.time,
                                'qps': expected_qps,
                                'category': 'Expected QPS'
                            })
                        }
                    })
                    setLatencyData(latencys)
                    setModelLatencyData(modelLatency)
                    setInputThroughputData(inputThroughput)
                    setOutputThroughputData(outputThroughput)
                    setQPSData(qps)
                    setMonitorSpinning(false);
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_latency】：' + (temp?.message || '获取压测监控')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                setLatencyData([])
                setModelLatencyData([])
                setInputThroughputData([])
                setOutputThroughputData([])
                setQPSData([])
                setMonitorSpinning(false);
                messageApi.info('Interface error!');

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_latency】：' + (error || '获取压测监控接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            setLatencyData([])
            setModelLatencyData([])
            setInputThroughputData([])
            setOutputThroughputData([])
            setQPSData([])
            setMonitorSpinning(false);
            messageApi.error('Interface error!');

            // mock
            // let stressTasks = mockData.Stress;
            // handleStressTableData(stressTasks);
            // setSpinning(false);
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_latency】：' + ('获取压测监控接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }

        // fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
        //   .then((response) => response.json())
        //   .then((json) => setData(json))
        //   .catch((error) => {
        //     console.log('fetch data failed', error);
        // });
    }
        
    // 获取Tab数据
    const getServiceData = async () => {
        const res = await fetch('/api/get_task_list?user_id=-1')

        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp.success) {
                    handleServiceTableData(temp.data.reverse());
                    setSpinning(false);
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_task_list】：' + (temp?.message || '获取服务列表')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))


            } catch (error) {
                handleServiceTableData([])
                setSpinning(false);
                messageApi.info('获取服务列表接口出错', [5]);

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_task_list】：' + (error || '获取服务列表接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            handleServiceTableData([])
            setSpinning(false);
            messageApi.error('请求发送失败', [5]);

            // mock
            // let services = mockData.Services;
            // handleServiceTableData(services);
            // setSpinning(false);
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_task_list】：' + ('获取服务列表接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }

        // mock
        // let services = mockData.Services;
        // handleServiceTableData(services);
        // setSpinning(false);
    }
    const getStressData = async () => {
        const res = await fetch('/api/get_press_list?user_id=-1')
    
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp.success) {
                    handleStressTableData(temp.data.reverse());
                    setSpinning(false);
                }
                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_press_list】：' + (temp?.message || '获取压测任务列表')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                handleStressTableData([])
                setSpinning(false);
                messageApi.info('Interface error!');

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_press_list】：' + (error || '获取压测任务列表接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            handleStressTableData([])
            setSpinning(false);
            messageApi.error('Interface error!');

            // mock
            // let stressTasks = mockData.Stress;
            // handleStressTableData(stressTasks);
            // setSpinning(false);
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_press_list】：' + ('获取压测任务列表接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }

        // mock
        // let stressTasks = mockData.Stress;
        // handleStressTableData(stressTasks);
        // setSpinning(false);
    }

    // 数据处理
    const handleServiceTableData = (services) => {
        let data = [];
        let serviceNames = [];
        services.map(service => {
            // if (service.status == 'running') {
                serviceNames.push(service.service_id)
            // }
            data.push({
                key: service?.service_id,
                serviceName: service?.service_id,
                modelName: service?.model_name,
                currentVersion: service?.version,
                status: service?.status,
                running_time: service?.details?.running_time,
                create_time: service?.create_time,
                update_time: service?.update_time,

                gpuType: service?.resource_config?.gpu_type,
                tpPP: service?.resource_config['tp*pp'],

                // latency: service?.details?.first_bag?.latency,
                // model_latency: service?.details?.first_bag?.model_latency,
                // input_length: service?.details?.first_bag?.input_length,
                // output_length: service?.details?.first_bag?.output_length

            });
        })
        setServiceNames(serviceNames);
        setServiceTableData(data);
    }
    const handleStressTableData = (stressTasks) => {
        let data = [];
        stressTasks.map(str => {
            data.push({
                key: str.payload_id,
                press_name: str.payload_id,
                service_name: str.service_id,
                model_name: str?.details?.model_name,
                status: str.status,
                create_time: str.create_time,
                update_time: str.update_time,
            });
        })
        setStressTableData(data);
    }

    // colums
    const serviceTableColumns = [
        { title: 'Service Name', dataIndex: 'serviceName' },
        { title: 'Model Name', dataIndex: 'modelName' },
        { title: 'Current Version', dataIndex: 'currentVersion' },
        { title: 'Service Status', dataIndex: 'status' },
        { title: 'Running Time', dataIndex: 'running_time' },
        // { title: 'GPU Type', dataIndex: 'gpuType', key: 'gpuType' },
        // { title: 'TP*PP', dataIndex: 'tpPP', key: 'tpPP' },
        {
            title: 'View Log',
            align: 'center',
            render: (_, resource) => (resource.status == 'running' ? 
            <a onClick={() => {
                getServiceLog(resource.serviceName);
                setIsServiceLogOpen(true);
            }}><LineChartOutlined /></a>
            : <a style={{ color: 'gray', cursor: 'not-allowed' }}><LineChartOutlined /></a>),
        },
        {
            title: 'Service Monitor',
            key: 'serviceMonitor',
            align: 'center',
            render: (_, resource) => (resource.status == 'running' ? 
            <a onClick={() => {
                getServiceMonitor(resource);
                setIsServiceMonitorOpen(true);
            }}><LineChartOutlined /></a>
            : <a style={{ color: 'gray', cursor: 'not-allowed' }}><LineChartOutlined /></a>),
        },
        // { title: 'Resource Group', dataIndex: 'resource', key: 'resource' },
        // {
        //     title: 'Resource Occupy',
        //     key: 'resourceOccupy',
        //     render: (_, resource) => <>
        //         <p>{resource.runningInstance} 个实例</p>
        //         <p>{resource.cpu} 核 / 实例</p>
        //         <p>{resource.memory}MB / 实例</p>
        //     </>,
        // },
        { title: 'Create Time', dataIndex: 'create_time', key: 'create_time', showSorterTooltip: false, sorter: (a, b) => new Date(a.create_time) - new Date(b.create_time) },
        { title: 'Update Time', dataIndex: 'update_time', key: 'update_time', showSorterTooltip: false, sorter: (a, b) => new Date(a.update_time) - new Date(b.update_time) },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            width: 200,
            render: (_, resource) => (
                <Space size="middle">
                    <a onClick={() => {
                        setIsDetailOpen(true);
                        setCurrentServiceDetail(resource);
                    }}>Detail</a>
                    { resource.status == 'running' ? 
                        <a onClick={() =>  {
                            setCurrentServiceName(resource.serviceName)
                            stressForm.setFieldValue('press_name', `${resource.serviceName?.toLowerCase()}-`)
                            stressForm.setFieldValue('service_user', resource.serviceName)
                            setIsStressOpen(true)
                        }}>PressTest</a> 
                    : <a style={{ color: 'gray', cursor: 'not-allowed' }}>PressTest</a>
                    }
                    <a onClick={() => {
                        showTaskDelConfirm(resource.serviceName)
                    }}>Delete</a>
                </Space>
            )
        },
    ];
    const stressTableColumns = [
        { title: 'Press Name', dataIndex: 'press_name', key: 'press_name' },
        { title: 'Service Name', dataIndex: 'service_name', key: 'service_name' },
        { title: 'Model Name', dataIndex: 'model_name', key: 'model_name' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Press Monitor',
            key: 'pressMonitor',
            align: 'center',
            render: (_, resource) => (resource.status == 'running' ? 
                <a onClick={() =>  {
                    asyncFetch(resource);
                    setIsMonitorOpen(true);
                }}><LineChartOutlined /></a>
            : <a style={{ color: 'gray', cursor: 'not-allowed' }}><LineChartOutlined /></a>),
        },
        { title: 'Create Time', dataIndex: 'create_time', key: 'create_time', showSorterTooltip: false, sorter: (a, b) => new Date(a.create_time) - new Date(b.create_time) },
        { title: 'Update Time', dataIndex: 'update_time', key: 'update_time', showSorterTooltip: false, sorter: (a, b) => new Date(a.update_time) - new Date(b.update_time) },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, resource) => <a onClick={() => {
                showPressDelConfirm(resource.press_name)
            }}>Delete</a>,
        },
    ];

    // 删除单条服务数据
    const showTaskDelConfirm = (serviceName) => {
        confirm({
          title: 'Do you want to delete this service?',
          icon: <ExclamationCircleFilled />,
          content: '',
          okText: 'OK',
          okType: 'danger',
          cancelText: 'Cancel',
          async onOk() {
            const params = {
                "service_name": serviceName,
                "user_id": -1
            }
            console.log(3333, params)
            const res = await fetch('/api/delete_task', {
                method: 'POST',
                body: JSON.stringify(params)
            })

            if (res.ok) {
                try {
                    let temp = await res.json();
                    setSpinning(false);
                    if (temp.success) {
                        messageApi.success(temp.message ? temp.message :'删除成功!');
                        setSpinning(true);
                        getServiceData();
                    } else {
                        messageApi.error(temp.message ? temp.message : '删除失败');
                    }

                    let message = {
                        success: temp?.success,
                        message: new Date().toLocaleString() + ' 调用接口【delete_task】：' + (temp?.message || '删除单个服务')
                    }
                    sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
                } catch (error) {
                    setSpinning(false);
                    messageApi.info('Interface error!');

                    let message = {
                        success: false,
                        message: new Date().toLocaleString() + ' 调用接口【delete_task】：' + (error || '删除单个服务接口失败')
                    }
                    sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
                }
            } else {
                setSpinning(false);
                messageApi.error('Interface error!');

                // Mock
                // setSpinning(false);
                // getServiceData();
                // messageApi.success('Add success!');

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【delete_task】：' + ('删除单个服务接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
          }
        });
    };

    // 删除单条压测数据
    const showPressDelConfirm = (press_name) => {
        confirm({
          title: 'Do you want to delete this press task?',
          icon: <ExclamationCircleFilled />,
          content: '',
          okText: 'OK',
          okType: 'danger',
          cancelText: 'Cancel',
          async onOk() {
            const params = {
                "press_name": press_name,
                "user_id": -1
            }
            console.log(3333, params)
            const res = await fetch('/api/delete_press', {
                method: 'POST',
                body: JSON.stringify(params)
            })

            if (res.ok) {
                try {
                    let temp = await res.json();
                    setSpinning(false);
                    if (temp.success) {
                        messageApi.success(temp.message ? temp.message : '删除成功');
                        setSpinning(true);
                        getStressData();
                    } else {
                        messageApi.error(temp.message ? temp.message : '删除失败');
                    }

                    let message = {
                        success: temp?.success,
                        message: new Date().toLocaleString() + ' 调用接口【delete_press】：' + (temp?.message || '删除单个压测任务')
                    }
                    sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
                } catch (error) {
                    setSpinning(false);
                    messageApi.info('Interface error!');

                    let message = {
                        success: false,
                        message: new Date().toLocaleString() + ' 调用接口【delete_press】：' + (error || '删除单个压测任务接口失败')
                    }
                    sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
                }
            } else {
                setSpinning(false);
                messageApi.error('Interface error!');

                // Mock
                // setSpinning(false);
                // messageApi.success('Add success!');
                // getStressData();

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【delete_press】：' + ('删除单个压测任务接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
          }
        });
    };

    const getServiceLog = async (serviceName) => {
        setServiceLogSpinning(true);
        const res = await fetch(`/api/dev_log?service_name=${serviceName}&user_id=-1`);

        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp.success) {
                    if (temp.code == 200) {
                        setServiceLogSpinning(false);
                        setCurrentServiceLog(temp.data)
                    } else {
                        messageApi.error(temp.message);
                    }
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【dev_log】：' + (temp?.message || '获取服务日志')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                setServiceLogSpinning(false);
                messageApi.info('Interface error!');

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【dev_log】：' + (error || '获取服务日志接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            setServiceLogSpinning(false);
            messageApi.error('Interface error!');

            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【dev_log】：' + ('获取服务日志接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }

    const getServiceMonitor = async (resource) => {
        setServiceMonitorSpinning(true);
        const res = await fetch(`/api/service_monitor?service_name=${resource.serviceName}&user_id=-1`)
    
        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp.success) {
                    let allocatedGpuRatioData = [];
                    let realGpuUtilData = [];
                    let allocatedGpuMemData = [];
                    let realGpuMemData = [];
                    let containerCpuRequestUsageData = [];
                    let containerCpuUsedCoresData = [];
                    let containerMemoryUsageBytesData = [];
                    let containerMemoryUtilData = [];
                    let containerSpecMemoryTotalBytesData = [];
    
                    temp?.data?.forEach(item => {
                        if (item.allocated_gpu_ratio) allocatedGpuRatioData.push(item)
                        if (item.real_gpu_util) realGpuUtilData.push(item)
                        if (item.allocated_gpu_mem) allocatedGpuMemData.push(item)
                        if (item.real_gpu_mem) realGpuMemData.push(item)
                        if (item.container_cpu_request_usage) containerCpuRequestUsageData.push(item)
                        if (item.container_cpu_used_cores) containerCpuUsedCoresData.push(item)
                        if (item.container_memory_usage_bytes) containerMemoryUsageBytesData.push(item)
                        if (item.container_memory_util) containerMemoryUtilData.push(item)
                        if (item.container_spec_memory_total_bytes) containerSpecMemoryTotalBytesData.push(item)
                    })
                    setAllocatedGpuRatioData(allocatedGpuRatioData)
                    setRealGpuUtilData(realGpuUtilData)
                    setAllocatedGpuMemData(allocatedGpuMemData)
                    setRealGpuMemData(realGpuMemData)
                    setContainerCpuRequestUsageData(containerCpuRequestUsageData)
                    setContainerCpuUsedCoresData(containerCpuUsedCoresData)
                    setContainerMemoryUsageBytesData(containerMemoryUsageBytesData)
                    setContainerMemoryUtilData(containerMemoryUtilData)
                    setContainerSpecMemoryTotalBytesData(containerSpecMemoryTotalBytesData)
    
                    setServiceMonitorSpinning(false);
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【service_monitor】：' + (temp?.message || '获取服务监控')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                setAllocatedGpuRatioData([])
                setRealGpuUtilData([])
                setAllocatedGpuMemData([])
                setRealGpuMemData([])
                setContainerCpuRequestUsageData([])
                setContainerCpuUsedCoresData([])
                setContainerMemoryUsageBytesData([])
                setContainerMemoryUtilData([])
                setContainerSpecMemoryTotalBytesData([])

                setServiceMonitorSpinning(false);
                messageApi.info('Interface error!');

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【service_monitor】：' + (error || '获取服务监控接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            setAllocatedGpuRatioData([])
                setRealGpuUtilData([])
                setAllocatedGpuMemData([])
                setRealGpuMemData([])
                setContainerCpuRequestUsageData([])
                setContainerCpuUsedCoresData([])
                setContainerMemoryUsageBytesData([])
                setContainerMemoryUtilData([])
                setContainerSpecMemoryTotalBytesData([])

            setServiceMonitorSpinning(false);
            messageApi.error('Interface error!');

            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【service_monitor】：' + ('获取服务监控接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))

            // mock
            // let stressTasks = mockData.Stress;
            // handleStressTableData(stressTasks);
            // setSpinning(false);
        }

        // fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
        //   .then((response) => response.json())
        //   .then((json) => setData(json))
        //   .catch((error) => {
        //     console.log('fetch data failed', error);
        // });
    }

    const getDataset = async (value) => {
        const params = {
            service_name: value,
            user_id: -1
        }
        const res = await fetch(`/api/get_dataset?service_name=${value}&user_id=-1`)

        if (res.ok) {
            try {
                let temp = await res.json();
                if (temp?.success) {
                    if (temp?.code === 200) {
                        // 正确获取结果
                        if(temp?.data.length != 0) {
                            setCurrentServiceName(value);
                            setDataSetOption(temp?.data?.map(item => {
                                return {
                                    value: item,
                                    label: item
                                }
                            }))
                        }

                    }
                } else {
                    // 接口暂时不可用
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【get_dataset】：' + (temp?.message || '获取数据集')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                // 处理结果发生错误
                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【get_dataset】：' + (error || '获取数据集接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【get_dataset】：' + ('获取数据集接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    }

    // 执行
    const handleStressTaskSubmit = async () => {
        setStressSpinning(true);
        const configs = stressForm.getFieldsValue()
        const params = {
            "press_name": configs.press_name,
            "service_name": configs.service_user,
            "prompt": {
                type: promptType == 1 ? 'single' : 'dataset',
                data: promptType == 1 ? configs.promptSingle : configs.promptDataset
            },
            "duration": configs.duration,
            "qps": configs.concurrency,
            "rt": configs.rt,
        }

        const res = await fetch('/api/press', {
            method: 'POST',
            body: JSON.stringify(params)
        })

        if (res.ok) {
            try {
                let temp = await res.json();
                setStressSpinning(false);
                if (temp.success) {
                    messageApi.success(temp.message);
                    setIsStressOpen(false);
                    getStressData();
                } else {
                    messageApi.error(temp.message);
                }

                let message = {
                    success: temp?.success,
                    message: new Date().toLocaleString() + ' 调用接口【press】：' + (temp?.message || '启动压测任务')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            } catch (error) {
                setStressSpinning(false);
                messageApi.info('Interface error!');

                let message = {
                    success: false,
                    message: new Date().toLocaleString() + ' 调用接口【press】：' + (error || '启动压测任务接口失败')
                }
                sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
            }
        } else {
            setStressSpinning(false);
            messageApi.error('Interface error!');

            // Mock
            // setStressSpinning(false);
            // messageApi.success('Add success!');
            // setIsStressOpen(false);
            // getStressData();

            let message = {
                success: false,
                message: new Date().toLocaleString() + ' 调用接口【press】：' + ('启动压测任务接口失败')
            }
            sessionStorage.setItem('actionLogs', JSON.stringify([message, ...(JSON.parse(sessionStorage.getItem('actionLogs')  || '[]'))]))
        }
    };

    const tabItems = [
        {
            key: 'service',
            label: 'Inference Service',
            children: (
            <>
                {/* <Button type="primary" onClick={() =>  setIsDeployOpen(true) }>Deploy Service</Button>
                <br /><br /> */}
                <Table
                    size="small"
                    scroll={{ y: 'calc(100vh - 264px)' }}
                    rowKey={ (record) => record.id }
                    pagination={false}
                    // pagination={{ defaultPageSize: 5 }}
                    bordered
                    columns={serviceTableColumns}
                    dataSource={serviceTableData}
                />
            </>
            ),
        },
        {
            key: 'stress',
            label: 'Stress Test',
            children: (
                <>
                    <Button type="primary" onClick={() =>  {
                        setCurrentServiceName('');
                        stressForm.setFieldValue('press_name', '')
                        stressForm.setFieldValue('service_user', '')
                        setIsStressOpen(true)
                    }}>Add Stress Test Task</Button>
                    <br /><br />
                    <Table
                        size="small"
                        scroll={{ y: 'calc(100vh - 300px)' }}
                        rowKey={ (record) => record.id }
                        pagination={false}
                        // pagination={{ defaultPageSize: 5 }}
                        bordered
                        columns={ stressTableColumns }
                        dataSource={ stressTableData }
                    />
                </>
            )
        },
    ];


    const onChange = (key: string) => {
        let stamp = '';
        switch (key) {
            case 'service':
                setSpinning(true);
                getServiceData();
                if (countRef.current) {
                    clearInterval(countRef.current);
                }
                stamp = setInterval(() => {
                    getServiceData();
                }, 10000);
                setIntervalStamp(stamp)
                break;
            case 'stress':
                setSpinning(true);
                getStressData();
                if (countRef.current) {
                    clearInterval(countRef.current);
                }
                stamp = setInterval(() => {
                     getStressData();
                }, 10000);
                setIntervalStamp(stamp)
                break;
            default:
                break;
        }
    };

    const serviceDetailItems = [
        { key: '0', label: 'Service Name', children: currentServiceDetail?.serviceName },
        // { key: '1', label: 'Service Type', children: currentServiceDetail?.serviceType },
        { key: '2', label: 'Current Version', children: currentServiceDetail?.currentVersion },
        { key: '3', label: 'Status', children: currentServiceDetail?.status },
        { key: '4', label: 'Running Time', children: currentServiceDetail?.running_time },
        { key: '5', label: 'Create Time', children: currentServiceDetail?.create_time },
        { key: '6', label: 'Update Time', children: currentServiceDetail?.update_time },
        { key: '7', label: 'GPU Type', children: currentServiceDetail?.gpuType },
        { key: '8', label: 'TP*PP', children: currentServiceDetail?.tpPP },
        // { key: '9', label: 'Latency', children: currentServiceDetail?.latency },
        // { key: '10', label: 'Model Latency', children: currentServiceDetail?.model_latency },
        // { key: '11', label: 'Input Length', children: currentServiceDetail?.input_length },
        // { key: '12', label: 'Output Length', children: currentServiceDetail?.output_length },
    ]

    return (
        <>
            <Spin tip="Loading" spinning={spinning} size="large">
                <main>
                    {contextHolder}
                    <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
                </main>

            </Spin>

            <Drawer title="Modal Detail" width="600" placement="right" onClose={() => setIsDetailOpen(false)} open={isDetailOpen}>
                <Descriptions title="Basic Information" column={2} items={serviceDetailItems} /><br />
                {/* <Descriptions title="Version Information" /> */}
            </Drawer>


            <Drawer title="Add Stress Test Task" width="600" placement="right" onClose={() => { 
                setIsStressOpen(false);
                setPromptType(1); 
                }} open={isStressOpen}>
                <Spin tip="Loading" spinning={stressSpinning} size="large">
                    <Form
                        form={stressForm}
                        labelAlign="left"
                        layout='vertical'
                    >
                        <Form.Item name="press_name" label="Press Name" initialValue={currentServiceName ? `${currentServiceName?.toLowerCase()}-` : '' }>
                            <Input />
                        </Form.Item>
                        <Form.Item name="service_user" label="Subordinated Services" initialValue={currentServiceName}>
                            <Select
                                placeholder="Please select"
                                onSelect={(value) => getDataset(value)}
                                options={serviceNames.map(serviceName => {
                                    return { value: serviceName, label: serviceName }
                                })}
                            />
                        </Form.Item>
                        <Form.Item label="Stress Test Data" style={{ marginBottom: 0 }}>
                            <Form.Item style={{ marginBottom: 12 }}>
                                <Radio.Group defaultValue={1} value={promptType} onChange={ (value) => { 
                                        setPromptType(value.target.value);
                                    }} >
                                    <Radio value={1}>单个数据</Radio>
                                    <Radio value={2} disabled={currentServiceName == ""}>数据集</Radio>
                                    <Radio disabled={true} value={3}>数据地址</Radio>
                                    <Radio disabled={true} value={4}>OSS文件</Radio>
                                    <Radio disabled={true} value={5}>本地上传</Radio>
                                </Radio.Group>
                            </Form.Item>
                            { promptType == 1 ? (
                                <Form.Item name="promptSingle" initialValue="">
                                    <Input />
                                </Form.Item>
                            ) : (
                                <Form.Item name="promptDataset" initialValue="">
                                    <Select
                                        placeholder="Please select"
                                        options={dataSetOption}
                                    />
                                </Form.Item>
                            ) }
                        </Form.Item>
                        <Form.Item name="duration" label="Stress Test Time (s)" initialValue={300}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="concurrency" label="Stress Test QPS Max" initialValue={20}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="rt" label="Stress Test RT Max (ms)" initialValue={20}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" style={{ marginRight: 20 }} onClick={ handleStressTaskSubmit }> Submit </Button>
                            <Button onClick={() => { () => setIsStressOpen(false) }}> Cancel </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Drawer>


            <Drawer title="Service Log" width="1200" placement="right" onClose={() => setIsServiceLogOpen(false)} open={isServiceLogOpen}>
                <Spin tip="Loading" spinning={serviceLogSpinning} size="large">
                    {/* <VirtualList
                        data={currentServiceLog}
                        itemHeight={47}
                        itemKey="log"
                        onScroll={(e) => { 
                            if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
                                setCurrentServiceLog(currentServiceLog.concat(serviceLog.slice(currentServiceLog.length, 20)))
                            }
                        }}
                    >
                        {(item) => (<List.Item>{item}</List.Item>)}
                    </VirtualList> */}
                    <List
                        size="small"
                        bordered
                        dataSource={currentServiceLog}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                </Spin>
            </Drawer>

            <Drawer title="Press Monitor" width="800" placement="right" onClose={() => setIsMonitorOpen(false)} open={isMonitorOpen} style={{ textAlign: 'center' }}>
                <Spin tip="Loading" spinning={monitorSpinning} size="large">
                    <br />
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '10px 20px' }} {...latencyConfig} />), [latencyData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '10px 20px' }} {...modelLatencyConfig} />), [modelLatencyData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '70px 20px 0' }} {...inputThroughputConfig} />), [inputThroughputData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '70px 20px 0' }} {...outputThroughputConfig} />), [outputThroughputData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '70px 20px 0' }} {...qpsConfig} />), [qpsData]) }
                </Spin>
            </Drawer>

            <Drawer title="Service Monitor" width="1200" placement="right" onClose={() => setIsServiceMonitorOpen(false)} open={isServiceMonitorOpen} style={{ textAlign: 'center' }}>
                <Spin tip="Loading" spinning={serviceMonitorSpinning} size="large">
                
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '10px 20px' }} {...allocatedGpuRatioConfig} />), [allocatedGpuRatioData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '10px 20px' }} {...realGpuUtilConfig} />), [realGpuUtilData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '10px 20px' }} {...allocatedGpuMemConfig} />), [allocatedGpuMemData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '10px 20px' }} {...realGpuMemConfig} />), [realGpuMemData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '10px 20px' }} {...containerCpuRequestUsageConfig} />), [containerCpuRequestUsageData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '10px 20px' }} {...containerCpuUsedCoresConfig} />), [containerCpuUsedCoresData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '10px 20px' }} {...containerMemoryUsageBytesConfig} />), [containerMemoryUsageBytesData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '10px 20px' }} {...containerMemoryUtilConfig} />), [containerMemoryUtilData]) }
                    { useMemo(() => (<Line style={{ display: 'inline-block', margin: '10px 20px' }} {...containerSpecMemoryTotalBytesConfig} />), [containerSpecMemoryTotalBytesData]) }
                </Spin>
            </Drawer>

            {/* <Drawer title="Deploy Service" width="800" placement="right" onClose={() => setIsDeployOpen(false)} open={isDeployOpen}>
                <Form
                    form={deployForm}
                    labelCol = {{span: 7}}
                    wrapperCol={{ span: 17 }}
                    labelAlign="left"
                    size='small'
                >
                    <br />
                    <Form.Item name="serviceName" label="Service Name" initialValue="">
                        <Input />
                    </Form.Item>
                    <Form.Item name="deployMethod" label="Deploy Method" initialValue='processor'>
                        <Select
                            onChange={(value) => setDeployMethod(value)}
                            options={[
                                {value:'processor', label:'模型+processor部署服务'},
                                {value:'mirror', label:'镜像部署'}
                            ]}
                        />
                    </Form.Item>
                    
                    { deployMethod == 'processor' ? <>
                        <Form.Item name="modelType" label="Model Type" initialValue='customized'>
                            <Select
                                onChange={(value) => setModelType(value)}
                                options={ [...models, { value: 'customized', label: '自定义processor' }] }
                            />
                        </Form.Item>
                        { modelType == 'customized' ? <>
                            <Form.Item name="processorLanguage" label="Processor Language" initialValue=''>
                                <Select
                                    options={[
                                        {value:'1', label:'1'},
                                        {value:'2', label:'2'}
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item label="Processor Package" style={{ marginBottom: 0 }}>
                                <Form.Item>
                                    <Radio.Group defaultValue={1}>
                                        <Radio value={1}>OSS文件导入</Radio>
                                        <Radio value={2}>本地上传</Radio>
                                        <Radio value={3}>公网下载地址</Radio>
                                    </Radio.Group>
                                </Form.Item> 
                                <Form.Item name="processorPackage" initialValue="">
                                    <Input />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item name="processorMasterFile" label="Processor Master File" initialValue=''>
                                <Input />
                            </Form.Item>
                        </> : <></> }
                        <Form.Item label="Model File" style={{ marginBottom: 0 }}>
                            <Form.Item valuePropName="checked" initialValue={ true }>
                                <Switch />
                            </Form.Item>
                            <Form.Item name="processorPackage" initialValue="">
                                <Input />
                            </Form.Item>
                        </Form.Item>
                        
                    </> : <>
                        <Form.Item name="image" label="Image" initialValue="reg.docker.alibaba-inc.com/zhuzi-z/benchmark:eas-llama-v1031">
                            <TextArea
                                style={{ height: 60, resize: 'none' }}
                            />
                        </Form.Item>
                        <Form.Item name="cmd" label="CMD" initialValue="cd /eas; ENV/bin/python app.py --dtype float16">
                            <TextArea
                                style={{ height: 60, resize: 'none' }}
                            />
                        </Form.Item>
                    </>
                    }
                </Form>
            </Drawer> */}
        </>
    )
  }
  