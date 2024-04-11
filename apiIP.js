import axios from 'axios';

const API_URL = 'http://ip-api.com/json/'

export async function getIP(ip) {
    return await axios.get(API_URL + ip + '?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query')
}
