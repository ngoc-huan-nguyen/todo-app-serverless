import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const cerfiticate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJUCdKoav/LNjeMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1yMnBvNzZhamJqMWJtNDZoLnVzLmF1dGgwLmNvbTAeFw0yNDA3MDYx
NjI0MTJaFw0zODAzMTUxNjI0MTJaMCwxKjAoBgNVBAMTIWRldi1yMnBvNzZhamJq
MWJtNDZoLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAIcgQ5xA+vSpzs0mXEEBaouu0wbP+culUEqmkNLUm36Gez3Id8MAJfGGViXB
JIr2hcpdC+GTf1q2YYp3js9I4FOyfr2cqCD6UbwetJ2uxF7/WwhhcCPMjampRmPq
Gz+yfT5vxqyL5Ueg2rxOIxE7+wfJSflo+l7u2bPXtFQsLd00jBqIoS7Oq8LoQvix
D9xKZcD0iOtjzZzVFwTA34Vjt7OceejSOS0Dp8na0yPGxYzjJrnJtceKk3iv8oxG
g7gMNedJUQkiknyrGOxr9KMiItCxI7p8pJyUaEwcO2sn1/LzI121k/DaiplfN1DS
8zGmOMt7j0m3NczPx8Yn3oK35HkCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUEYGRqPZAahEMymRPQrNjkzTo/TUwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQAC4NqlvQPq02MmB7XZC6XT6tauLilg9QliJT+oueEJ
2dPMbxnMheSBmhEj5a/Ba341bUSRXS1JcxznnAm5latopm+Q94dWHeALQfcoL46o
NekKNXNbJvMW4JxS3lrzfw8U9+kCLIHv6+br1Kw2ggvFEz262jTjRWWBir0eIwYg
w16YOYB3Xt12yAYkSUWzvYR4dTt2hTLVn6jwRss/QBj8uqlhZLmeZApEgxkEQzyh
4z27gVbTLKPc5mUaXxUGFlP56I30t3+AJI0OQ+aHestnMi/eMBvZJ2TDSh4ec57Z
WZg8dyCd7ikexvDFQmtdJ+/yp3c8SZgeFOhOSzPjoUf2
-----END CERTIFICATE-----`;

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader);
  return jsonwebtoken.verify(token, cerfiticate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
