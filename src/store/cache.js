import Cache from 'ttl-cache'
export default new Cache({
  ttl: 300,
  interval: 60
})
