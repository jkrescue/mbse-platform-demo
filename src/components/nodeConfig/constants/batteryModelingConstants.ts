// 电池建模仿真配置常量
export const BATTERY_MODELS = [
  { value: 'equivalent-circuit', label: '等效电路模型' },
  { value: 'electrochemical', label: '电化学模型' },
  { value: 'thermal-electrical', label: '热电耦合模型' },
  { value: 'physics-based', label: '物理基础模型' },
];

export const CHEMISTRY_TYPES = [
  { value: 'ncm', label: 'NCM三元' },
  { value: 'lfp', label: 'LFP磷酸铁锂' },
  { value: 'nca', label: 'NCA镍钴铝' },
  { value: 'lmo', label: 'LMO锰酸锂' },
];

export const COOLING_TYPES = [
  { value: 'air', label: '风冷' },
  { value: 'liquid', label: '液冷' },
  { value: 'immersion', label: '浸没式冷却' },
  { value: 'phase-change', label: '相变材料' },
];

export const MODELING_APPROACHES = {
  electricalModel: [
    { value: 'thevenin-1rc', label: 'Thevenin 1RC' },
    { value: 'thevenin-2rc', label: 'Thevenin 2RC' },
    { value: 'pngv', label: 'PNGV模型' },
    { value: 'rint', label: '内阻模型' },
  ],
  thermalModel: [
    { value: '1d-lumped', label: '1D集总参数' },
    { value: '3d-finite-element', label: '3D有限元' },
    { value: 'lumped-thermal', label: '集总热模型' },
  ],
  agingModel: [
    { value: 'calendar-cycle', label: '日历+循环老化' },
    { value: 'sei-growth', label: 'SEI膜增长' },
    { value: 'capacity-fade', label: '容量衰减' },
  ],
};

export const SIMULATION_SCENARIOS = [
  { key: 'charge-profile', label: '充电曲线' },
  { key: 'discharge-profile', label: '放电曲线' },
  { key: 'thermal-cycling', label: '热循环' },
  { key: 'aging-analysis', label: '老化分析' },
  { key: 'abuse-testing', label: '滥用测试' },
  { key: 'pulse-testing', label: '脉冲测试' },
];

export const OUTPUT_FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'mat', label: 'MAT (MATLAB)' },
  { value: 'hdf5', label: 'HDF5' },
  { value: 'json', label: 'JSON' },
];

export const CURRENT_RATES = [
  { value: '0.5C', label: '0.5C' },
  { value: '1C', label: '1C' },
  { value: '2C', label: '2C' },
  { value: '3C', label: '3C' },
  { value: 'custom', label: '自定义' },
];