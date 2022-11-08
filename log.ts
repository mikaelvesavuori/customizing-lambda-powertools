import { Logger } from '@aws-lambda-powertools/logger';
import { randomUUID } from 'crypto';

// Mocked AWS API Gateway event, see: https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
const event = {
  resource: '/',
  path: '/',
  httpMethod: 'GET',
  headers: {
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9',
    'CloudFront-Viewer-Country': 'SE',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    'X-Amzn-Trace-Id': 'Root=1-5e66d96f-7491f09xmpl79d18acf3d050',
    'X-Forwarded-For': '192.168.0.1',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {},
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    resourceId: '2gxmpl',
    resourcePath: '/',
    httpMethod: 'GET',
    extendedRequestId: 'JJbxmplHYosFVYQ=',
    requestTime: '10/Mar/2020:00:03:59 +0000',
    path: '/prod/',
    accountId: '123456789012',
    protocol: 'HTTP/1.1',
    stage: 'prod',
    domainPrefix: '70ixmpl4fl',
    requestTimeEpoch: 1583798639428,
    requestId: '77375676-xmpl-4b79-853a-f982474efe18',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '192.168.0.1',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      user: null
    },
    domainName: '70ixmpl4fl.execute-api.us-east-2.amazonaws.com',
    apiId: '70ixmpl4fl'
  },
  body: null,
  isBase64Encoded: false
};

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

// Mocked Lambda handler
export const handler = async (event: any, context: any): Promise<void> => {
  // Static metadata
  const metadata = {
    owner: 'MyCompany',
    hostPlatform: 'aws',
    domain: 'CustomerAcquisition',
    system: 'ShowroomActivities',
    service: 'UserSignUp',
    team: 'MyDemoTeam',
    tags: ['typescript', 'backend'],
    dataSensitivity: 'public',
    jurisdiction: 'EU'
  };

  // Dynamic metadata from environment
  const dynamicMetadata = {
    accountId: event.requestContext.accountId,
    region: process.env.AWS_REGION || 'UNKNOWN',
    runtime: process.env.AWS_EXECUTION_ENV || 'UNKNOWN',
    user: event.requestContext.identity.user,
    stage: event.requestContext.stage,
    functionName: process.env.AWS_LAMBDA_FUNCTION_NAME || context.functionName,
    functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION || context.functionVersion,
    functionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || context.memoryLimitInMB,
    correlationId: context.awsRequestId, // This is rudimentary and should also check for ID coming through headers etc!
    timestampRequest: event.requestContext.requestTimeEpoch.toString(),
    resource: event.path, // This case is only valid for HTTP not for EventBridge etc!
    viewerCountry: event.headers['CloudFront-Viewer-Country'] // This may or may not be present
  };

  // Start logger with our custom metadata etc.
  const logger = new Logger({
    serviceName: metadata.service,
    persistentLogAttributes: {
      ...metadata,
      ...dynamicMetadata,
      // Missing fields
      level: 'INFO', // Has to be inferred from actual use
      error: false, // Set dynamically based on actual use
      httpStatusCode: 200, // Set dynamically based on actual use
      id: randomUUID(),
      timestampEpoch: Date.now().toString()
    }
  });

  logger.info('Hello World');
};

// Run
handler(event, context);
