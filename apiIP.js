import axios from 'axios';

const API_URL = 'http://ip-api.com/json/'
const API_URL_BATCH = 'http://ip-api.com/batch'

export async function getIP(ip) {
    return await axios.get(API_URL + ip + '?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query')
}

export async function getMultipleIP(ipList) {
    return await axios.post(API_URL_BATCH + '?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query', ipList);
}