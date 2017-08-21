// Based on https://www.thethingsnetwork.org/community/leeds-bradford/post/things-coverage-map

function Decoder(bytes, port) {
    function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2);}
    function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n);}
    function checkBin(n){return/^[01]{1,64}$/.test(n)}
    function Bin2Dec(n){if(!checkBin(n))return 0;return parseInt(n,2);}
    function Bin2Arr(str){ var a = new Array(str.length); for(var i = 0; i < str.length; i++){ a[i] = (str.toString().substr(i,1) == "1" ? 1 : 0); } return a; }
    function fixNaN(i){ if(isNaN(i)){return 0;}else{return i;}}
    
    var payload = {};
    //payload.payload_raw = Bin2Arr(bytes);
    //payload.payload_base64 = bytes;
    payload.payload_decrypt = bytes.toString();

    function parsePayload(payload){
        var str = payload.payload_decrypt;
        var a = str;
        //var arr = Bin2Arr(a);
        var arr = a;
        
        payload.ranger = { 'status': {
            "temperature": fixNaN(arr[0]),
            "trigger_acc": fixNaN(arr[1]),
            "trigger_button": fixNaN(arr[2]),
            "gps": fixNaN(arr[3]),
            "up_ctr": fixNaN(arr[4]),
            "dn_ctr": fixNaN(arr[5]),
            "battery": fixNaN(arr[6])
        }
        };
        
        // Get temperature
        var i = 8;
        
        if(payload.ranger.status.temperature){
            payload.ranger.T = (Bin2Dec(arr[i++]) ? -1 : 1)*Bin2Dec(a.substr(i,7));
            i += 8;
        }
        
        if(payload.ranger.status.gps){
            // Get latitude
            payload.ranger.gps = str.substr(i/4,16);
            var lat_d = parseInt(str.substr(i/4,2));
            i += 8;
            var lat_m = parseInt(str.substr(i/4,2));
            i += 8;
            var lat_s = (parseInt(str.substr(i/4,3)));
            i += 12;
            var sign = (str.substr(1/4,1)=="1" ? -1 : 1);
            i += 4;
            payload.ranger.lat = sign*(lat_d+(lat_m/60)+(lat_s/60000));
            
            // Get longitude
            var lon_d = parseInt(str.substr(i/4,3));
            i += 12;
            var lon_m = parseInt(str.substr(i/4,2));
            i += 8;
            var lon_s = parseInt(str.substr(i/4,2));
            i += 8;
            payload.ranger.lon_d = lon_d;
            payload.ranger.lon_m = lon_m;
            payload.ranger.lon_s = lon_s;
            if(typeof lon_s!=="number") lon_s = 0;
            if(typeof lon_m!=="number") lon_m = 0;
            if(typeof lon_d!=="number") lon_d = 0;
            sign = (str.substr(i/4,1)=="1" ? -1 : 1);
            i += 4;
            payload.ranger.lon = sign*(lon_d+(lon_m/60)+(lon_s/6000));
            
        }
        if(payload.ranger.status.up_ctr){
            payload.ranger.up = Bin2Dec(Hex2Bin(str.substr(i/4,2)));
            i += 8;
        }
        if(payload.ranger.status.dn_ctr){
            payload.ranger.dn = Bin2Dec(Hex2Bin(str.substr(i/4,2)));
            i += 8;
        }
        if(payload.ranger.status.battery){
            payload.ranger.battery = Bin2Dec(Hex2Bin(str.substr(i/4,4)));
            i += 16;
        }
        
        return payload;
    }
    
    return parsePayload(payload);
}

console.log(Decoder([0x8E, 0x1C, 0x00, 0x00, 0x10, 0x66].toString()));
