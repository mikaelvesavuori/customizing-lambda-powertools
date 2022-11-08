import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';

// Mocked AWS API Gateway context
const context = {
  callbackWaitsForEmptyEventLoop: {},
  succeed: {},
  fail: {},
  done: {},
  functionVersion: '$LATEST',
  functionName: 'somestack-FunctionName',
  memoryLimitInMB: '1024',
  logGroupName: '/aws/lambda/somestack-FunctionName',
  logStreamName: '2022/07/09/[$LATEST]159282acddb84ca0bc0d5f325ea01343',
  clientContext: '',
  identity: '',
  invokedFunctionArn: 'arn:aws:lambda:eu-north-1:123412341234:function:somestack-FunctionName',
  awsRequestId: '6c933bd2-9535-45a8-b09c-84d00b4f50cc',
  getRemainingTimeInMillis: {}
};

export const handler = async (context: any): Promise<void> => {
  // Static metadata
  const metadata = {
    service: 'UserSignUp'
  };

  // Dynamic metadata from environment
  const dynamicMetadata = {
    Region: process.env.AWS_REGION || 'UNKNOWN',
    Runtime: process.env.AWS_EXECUTION_ENV || 'UNKNOWN',
    FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME || context.functionName,
    FunctionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION || context.functionVersion,
    FunctionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || context.memoryLimitInMB,
    LogGroupName: context.logGroupName,
    LogStreamName: context.logStreamName
  };

  const metrics = new Metrics({
    namespace: 'MyNamespace',
    serviceName: metadata.service
  });

  // Add metrics and dimensions as per use case
  metrics.addMetric('Duration', MetricUnits.Milliseconds, 83);
  metrics.addDimension('User', 'Name');

  // Add metadata as per use case
  metrics.addMetadata('User', 'Sam Person');
  metrics.addMetadata('Duration', '83');
  metrics.addMetadata('CorrelationId', '8d5a0ba6-05e0-4c9b-bc7c-9164ea1bdedd');

  // Add standard dynamic metadata
  Object.entries(dynamicMetadata).forEach((metadata: any) => {
    const [key, value] = metadata;
    metrics.addMetadata(key, value);
  });

  // Publish metric
  metrics.publishStoredMetrics();
};

// Run - skip event in this example
handler(context);
