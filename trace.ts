import { Tracer } from '@aws-lambda-powertools/tracer';
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

export const handler = async (event: any): Promise<void> => {
  // Static metadata
  const metadata = {
    serviceName: 'MyService'
  };

  const startTime = Date.now();

  // Setup tracer and create a nested subsegment
  const tracer = new Tracer(metadata);
  const segment = tracer.getSegment();
  const spanName = 'Call the User service and fetch a response';
  const subsegment = segment.addNewSubsegment(spanName);
  tracer.setSegment(subsegment);
  tracer.addServiceNameAnnotation();

  /**
   * Do something
   */

  const endTime = Date.now();

  // Dynamic metadata from environment
  const dynamicMetadata = {
    name: spanName,
    timestamp: new Date(Date.now()).toISOString(),
    timestampEpoch: Date.now().toString(),
    durationMs: endTime - startTime,
    spanName: spanName,
    spanId: randomUUID(),
    traceId: randomUUID(),
    attributes: {}, // Any extra attributes
    correlationId: event.requestContext.requestId,
    service: metadata.serviceName
  };

  // Add standard dynamic metadata
  Object.entries(dynamicMetadata).forEach((metadata: any) => {
    const [key, value] = metadata;
    tracer.putMetadata(key, value);
  });

  // Finish or close the nested subsegment
  subsegment.close();

  // Reset to main segment
  tracer.setSegment(segment);
};

handler(event);
