import { ApiClient } from '../ApiClient';
import { SecretsManagerClient, GetSecretValueCommandOutput } from '@aws-sdk/client-secrets-manager';
import { SSMClient, GetParameterCommandOutput } from "@aws-sdk/client-ssm"; // ES Modules import
import { mockClient } from 'jest-aws-client-mock';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';


const secretsMock = mockClient(SecretsManagerClient);
const parameterStoreMock = mockClient(SSMClient);
const axiosMock = new MockAdapter(axios);

if(process.env.VERBOSETESTS!='True') {
    global.console.error = jest.fn();
    global.console.time = jest.fn();
    global.console.log = jest.fn();
  }
  
beforeEach(() => {
    secretsMock.mockReset();
    parameterStoreMock.mockReset();
    axiosMock.reset();
});

describe('Init', () => {
    test('Init succeeds', async () => {
        //required env params:
        process.env.MTLS_PRIVATE_KEY_ARN = 'testarn';

        const secretsOutput: GetSecretValueCommandOutput = {
            $metadata: {},
            SecretString: 'test'
        };
        secretsMock.mockImplementation(() => secretsOutput);
        const ssmOutput: GetParameterCommandOutput = {
            $metadata: {},
            Parameter: {
                Value: 'test'
            },
        };
        secretsMock.mockImplementation(() => secretsOutput);
        parameterStoreMock.mockImplementation(() => ssmOutput);

        const apiClient = new ApiClient();
        await apiClient.init();
    });

    test('Error getting secret', async () => {
        //required env params:
        process.env.MTLS_PRIVATE_KEY_ARN = 'testarn';

        const secretsOutput: GetSecretValueCommandOutput = {
            $metadata: {},
        };
        secretsMock.mockImplementation(() => secretsOutput);
        const ssmOutput: GetParameterCommandOutput = {
            $metadata: {},
            Parameter: {
                Value: 'test'
            },
        };
        secretsMock.mockImplementation(() => secretsOutput);
        parameterStoreMock.mockImplementation(() => ssmOutput);

        const apiClient = new ApiClient();
        expect(async () => {
            return await apiClient.init();
        }).rejects.toThrow();
    });

    test('Without secret arn fails', async () => {
        //required env params:
        process.env.MTLS_PRIVATE_KEY_ARN = 'testarn';

        const secretsOutput: GetSecretValueCommandOutput = {
            $metadata: {},
        };
        secretsMock.mockImplementation(() => secretsOutput);
        const ssmOutput: GetParameterCommandOutput = {
            $metadata: {},
            Parameter: {
                Value: 'test'
            },
        };
        secretsMock.mockImplementation(() => secretsOutput);
        parameterStoreMock.mockImplementation(() => ssmOutput);

        const apiClient = new ApiClient();
        expect(async () => {
            return await apiClient.init();
        }).rejects.toThrow();
    });
});

describe('Requests', () => {
    test('Return data', async () => {
        //required env params:
        testSetup();
        const returnData = { users: [{ id: 1, name: "John Smith" }] };
        axiosMock.onPost("/test").reply(200, returnData);
    
        const apiClient = new ApiClient();
        await apiClient.init();
        const data = await apiClient.requestData('/test', { data: 'test '});
        expect(data).toEqual(returnData);
    });

    test('Timeout', async () => {
        //required env params:
        testSetup();
        axiosMock.onPost("/test").timeout();
    
        const apiClient = new ApiClient();
        await apiClient.init();
        expect(async() => {
            await apiClient.requestData('/test', { data: 'test '});
        }).rejects.toThrow();
        let result: any;
        try {
            await apiClient.requestData('/test', { data: 'test '});
        } catch(error) {
            result = error;
        }
        expect(result.message).toBe('Het ophalen van gegevens is misgegaan.');
    });

    test('Network error', async () => {
        //required env params:
        testSetup();
        axiosMock.onPost("/test").networkError();
    
        const apiClient = new ApiClient();
        await apiClient.init();
        expect(async() => {
            await apiClient.requestData('/test', { data: 'test '});
        }).rejects.toThrow();
        let result: any;
        try {
            await apiClient.requestData('/test', { data: 'test '});
        } catch(error) {
            result = error;
        }
        expect(result.message).toBe('Het ophalen van gegevens is misgegaan.');
    });
});

function testSetup() {
    process.env.MTLS_PRIVATE_KEY_ARN = 'testarn';

    const secretsOutput: GetSecretValueCommandOutput = {
        $metadata: {},
        SecretString: 'test'
    };
    secretsMock.mockImplementation(() => secretsOutput);
    const ssmOutput: GetParameterCommandOutput = {
        $metadata: {},
        Parameter: {
            Value: 'test'
        },
    };

    secretsMock.mockImplementation(() => secretsOutput);
    parameterStoreMock.mockImplementation(() => ssmOutput);
}
