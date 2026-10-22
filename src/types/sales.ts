export interface AdvertisingRecord {
  id: number;
  TV: number;
  Radio: number;
  Newspaper: number;
  Sales: number;
  [key: string]: number;
}

export interface ModelMetric {
  name: string;
  type: 'baseline' | 'linear' | 'regularized' | 'ensemble';
  cvMae: number;
  cvRmse: number;
  cvR2: number;
  testRmse: number;
  testR2: number;
  rank: number;
  description: string;
  badge: string;
}

export interface PredictionResult {
  predictedSales: number;
  lowerBound: number;
  upperBound: number;
  marginalTV: number;
  marginalRadio: number;
  marginalNewspaper: number;
  estimatedRevenue: number;
  totalBudget: number;
  simulatedRoi: number;
  modelUsed: string;
}

export interface ResidualPoint {
  index: number;
  actual: number;
  predicted: number;
  residual: number;
}

export interface ChannelCurvePoint {
  spend: number;
  tvSales: number;
  radioSales: number;
  newspaperSales: number;
}
