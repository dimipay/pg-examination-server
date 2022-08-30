import config from 'config'

export default Buffer.from(config.clientId + ':' + config.clientSecret).toString('base64')
