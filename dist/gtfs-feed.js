!function(e){"use strict";var t=[{file:"agency.txt",prop:"agency"},{file:"stops.txt",prop:"stops"},{file:"routes.txt",prop:"routes"},{file:"trips.txt",prop:"trips"},{file:"stop_times.txt",prop:"stop_times"},{file:"calendar.txt",prop:"calendar"},{file:"calendar_dates.txt",prop:"calendar_dates"},{file:"fare_attributes.txt",prop:"fare_attributes"},{file:"fare_rules.txt",prop:"fare_rules"},{file:"shapes.txt",prop:"shapes"},{file:"frequencies.txt",prop:"frequencies"},{file:"transfers.txt",prop:"transfers"},{file:"feed_info.txt",prop:"feed_info"}];Polymer({is:"gtfs-feed",properties:{files:{type:Array,value:[],notify:!1},json:{type:Object,value:Object.create(null),notify:!0},xml:{type:String,value:"",notify:!1}},parseFiles:function(){var e=this,r=0,n=e.files.length;return e.set("json",Object.create(null)),new Promise(function(i,s){try{e.files.forEach(function(o){for(var a="",f=0;f<t.length;++f)o.endsWith(t[f].file)&&(a=t[f].prop);return a?void(e.csv=Papa.parse(o,{download:!0,header:!0,skipEmptyLines:!0,before:function(e,t){},error:function(t,i,o,a){return e.fire("error",t),++r,r===n?s(t):void 0},complete:function(t){return e.set("json."+a,t.data),++r,r===n?i():void 0}})):s("File does not conform to gtfs standard")})}catch(o){return s(o)}})},parseXML:function(){var e=this;return new Promise(function(t,r){try{var n=xmlToJSON.parseString(e.xml);e.set("json",Object.create(null));if(n.RTT&&n.RTT.length>0&&n.RTT[0].AgencyList&&n.RTT[0].AgencyList.length>0&&n.RTT[0].AgencyList[0]&&n.RTT[0].AgencyList[0].Agency)return t(e.set("json.agencyList",n.RTT[0].AgencyList[0].Agency))}catch(i){return r(i)}})},ready:function(){},attached:function(){},detached:function(){}})}(document);