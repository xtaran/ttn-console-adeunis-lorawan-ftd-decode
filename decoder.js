// Based on https://www.thethingsnetwork.org/community/leeds-bradford/post/things-coverage-map

function Decoder(bytes, port) {
    function Hex2Bin(n){if(!checkHex(n))return 0; var binstr=""; for (var i=0; i<n.length; i+=2) { binstr += parseInt(n[i]+n[i+1],16).toString(2); } return binstr;}
    function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n);}
    function checkBin(n){return/^[01]{1,64}$/.test(n)}
    function Bin2Dec(n){if(!checkBin(n))return 0;return parseInt(n,2);}
    function Bin2Arr(str){ var a = new Array(str.length); for(var i = 0; i < str.length; i++){ a[i] = (str.toString().substr(i,1) == "1" ? 1 : 0); } return a; }
    function fixNaN(i){ if(isNaN(i)){return 0;}else{return i;}}
    function Str2HexArr(s) {
        var a = new Array(0);
        for (var i = 0; i < s.length; i++) {
            a.push(s[i].toString(16));
        }
        return a;
    }

    var payload = {};
    payload.payload_raw = Str2HexArr(bytes);
    payload.payload_decrypt = payload.payload_raw.join('');
    payload.debug = bytes;

    function parsePayload(payload){
        var str = payload.payload_decrypt;
        var a = Hex2Bin(str);
        var arr = Bin2Arr(a);
        
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
            var lon_d = parseInt(str.substr(i/4,2));
            i += 8;
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
            payload.ranger.lon_dir = (sign == -1 ? "W" : "E");
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

var data;

data = [0x8E, 0x1C, 0x00, 0x00, 0x10, 0x66];
console.log(data);
console.log(Decoder(data));

data = [0xBF, 0x1F, 0x47, 0x22, 0x82, 0x10, 0x00, 0x83, 0x26, 0x10, 0x16, 0x01, 0x01, 0x10, 0x57, 0x26, 0x08];
console.log(data);
console.log(Decoder(data));
