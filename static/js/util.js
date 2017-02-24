function isEmpty(str) {
	if(str == null || typeof(str) == 'undefined' || str == 'null' || str == 'undefined') {
		return true;
	}
	if(typeof(str) == 'string' && str.replace(/(^s*)|(s*$)/g, "").length == 0) {
		return true;
	}
	if(typeof(str) == 'number' && str == 0) {
		return true;
	}
	if(str == 'null null' || str == '-：') {
		return true;
	}
	return false;
}

function disableWait(t, obj, waitMessage) {
	var objTag = obj.tagName.toLowerCase();
	if(objTag !== "input" && objTag != "button" && objTag != "span") {
		return;
	}

	var v = objTag !== "input" ? obj.innerText : obj.value;
	var i = setInterval(function() {
		if(t > 0) {
			switch(objTag) {
				case "input":
					obj.value = (--t) + waitMessage;
					break;
				case "button":
					obj.innerText = (--t) + waitMessage;
					break;
				case "span":
					obj.innerText = (--t) + waitMessage;
					break;
				default:
					break;
			}
			obj.disabled = true;
		} else {
			window.clearInterval(i);
			switch(objTag) {
				case "input":
					obj.value = v;
					break;
				case "button":
					obj.innerText = v;
					break;
				case "span":
					obj.innerText = v;
					break;
				default:
					break;
			}
			obj.disabled = false;
			mui(obj).button('reset');
		}
	}, 1000);
}


function postApiData(url,param,callBackFun,async){
	
      if (null == async || "" == async || undefined == async) {
          async = false;
      }
      $.ajax({
          type: "POST",
          url:  url,
          async : async,
          dataType: "json",
          data:param,
          success: callBackFun ,
          error: function(xhr,type,errorThrown){
      		//异常处理；
      		message('请求失败!');
      	}
      });
}
function getApiData(url,callBackFun,async){
	
    if (null == async || "" == async || undefined == async) {
        async = false;
    }

    $.ajax({
        type: "GET",
        url:  url,
        async : async,
        success: callBackFun ,
        error: function(xhr,type,errorThrown){
    		//异常处理；
    		message('请求失败!');
    	}
    });
}

function message(msg) {
	mui.toast(msg, {
		duration : '1500ms',
		type : 'div'
	});
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null
}

function calDays(date,days){
	var nd = new Date(date);
	nd = nd.valueOf();
	nd = nd + days * 24 * 60 * 60 * 1000;
	nd = new Date(nd);
	var y = nd.getFullYear();
	var m = nd.getMonth()+1;
	var d = nd.getDate();
	if(m <= 9) m = "0"+m;
	if(d <= 9) d = "0"+d; 
	var cdate = y+"-"+m+"-"+d;
	return cdate;
}

function getWeekDay(date){
	date = new Date(date);
	weekDate = date.getDay();
	if(weekDate == 0) {
		weekDate = "周日";
	}
	if(weekDate == 1) {
		weekDate = "周一";
	}
	if(weekDate == 2) {
		weekDate = "周二";
	}
	if(weekDate == 3) {
		weekDate = "周三";
	}
	if(weekDate == 4) {
		weekDate = "周四";
	}
	if(weekDate == 5) {
		weekDate = "周五";
	}
	if(weekDate == 6) {
		weekDate = "周六";
	}
	return weekDate;
}

/**
 * 以JSON的形式格式化参数
 */
function serializeJson(formElem){
	var params = $(formElem).serializeArray();
	var list = "{";
	$.each(params, function(i, field){
		var result =  iGetInnerText(field.value);
		list += "'" + field.name + "':'" + result + "',";
	});
	list = list.substring(0,list.length-1);
	list += "}";
	var result = eval('('+ list +')');
	return result;
}

//加密银行卡
function encrptCard(cardInfo){
	var card="";
	postApiData(root + '/main',{
		actionCode:"-128",
		cardList:JSON.stringify(cardInfo)
	},function(data){
		if(data.success){
			card = (data.cardList);
		}
	});
	return card;
}
//加密银行卡
function decrptCard(cardList){
	var card="";
	postApiData(root+'/main',{
		actionCode:"-127",
		cardList:cardList
	},function(data){
		if(data.success){
			card = JSON.parse(data.cardList);
		}
	});
	return card;
}

function serializeList(formElem){
	var params = $(formElem).serializeArray();
	var list = "{";
	$.each(params, function(i, field){
		var result =  iGetInnerText(field.value);
		list += "'" + field.name + "':'" + result + "',";
	});
	list = list.substring(0,list.length-1);
	list += "}";
	return list;
}

function serializeMergeList(formElem){
	var params = $(formElem).serializeArray();
	var list = [];
	var names = "'";
	var types = "'";
	var nums = "'";
	var mobs = "'";
	var index = 0;
	$.each(params, function(i, field){
		var result =  iGetInnerText(field.value);
		if(!isEmpty(result)&&field.name=="passengersName"){
			names += result + ","
		}
		if(!isEmpty(result)&&field.name=="passengersIdType"){
			types += result + ","
		}
		if(!isEmpty(result)&&field.name=="passengersIdNumber"){
			nums += result + ","
		}
		if(!isEmpty(result)&&field.name=="passengersMobile"){
			mobs += result + ","
		}
		if(field.name!="passengersName"&&field.name!="passengersIdType"&&field.name!="passengersIdNumber"&&field.name!="passengersMobile"){
			list[index] = "'" + field.name + "':'" + result + "'";
			index += 1;
		}
	});
	list.push("'passengersName':"+names.substring(0,names.length-1)+"'");
	list.push("'passengersIdType':"+types.substring(0,types.length-1)+"'");
	list.push("'passengersIdNumber':"+nums.substring(0,nums.length-1)+"'");
	list.push("'passengersMobile':"+mobs.substring(0,mobs.length-1)+"'");
	var temp = "{";
	for(var i=0;i<list.length;i++){
		temp += list[i] + ",";
	}
	temp = temp.substring(0,temp.length-1);
	temp += "}";
	return temp;
}

function mergeJson(jsonbject1, jsonbject2) {
	var resultJsonObject={};
	for(var attr in jsonbject1){
		resultJsonObject[attr]=jsonbject1[attr];
	}
	for(var attr in jsonbject2){
		resultJsonObject[attr]=jsonbject2[attr];
	}
	return resultJsonObject;
}

function mergeJson2List(jsonbject1, jsonbject2) {
	var resultJsonObject={};
	for(var attr in jsonbject1){
		resultJsonObject[attr]=jsonbject1[attr]+","+jsonbject2[attr];
	}
	return resultJsonObject;
}

//去空格回车
function iGetInnerText(testStr) {
	var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
	resultStr = testStr.replace(/[ ]/g, "");    //去掉空格
	resultStr = testStr.replace(/[\r\n]/g, ""); //去掉回车换行
	return resultStr;
}

//根据身份证计算年龄
function calculatingAge(usercode){
	var date = new Date();
	var year = date.getFullYear(); 
	var birthday_year = parseInt(usercode.substr(6,4));
	var userage= year - birthday_year;
	return userage;
}

//json转字符串
function json2string(jsonObj){
	var jStr = "{ ";
	for(var item in jsonObj){
		jStr += "'"+item+"':'"+jsonObj[item]+"',";
	}
	jStr = jStr.substr(0, jStr.length-1);
	jStr += " }";
	return jStr;
}

//json列表转字符串
function jsonList2string(jsonObj){
	var jStr = "[ ";
	for(var i=0;i<jsonObj.length;i++){
		jStr += "{"
		for(var item in jsonObj[i]){
			jStr += "'"+item+"':'"+jsonObj[i][item]+"',";
		}
		jStr = jStr.substr(0, jStr.length-1) + "},";
	}
	jStr = jStr.substr(0, jStr.length-1);
	jStr += " ]";
	return jStr;
}




//---------------------------------------------------
//日期格式化
//格式YYYY/yyyy/YY/yy表示年份
//MM/M月份
//W/w星期
//dd/DD/d/D日期
//hh/HH/h/H时间
//mm/m分钟
//ss/SS/s/S秒
//---------------------------------------------------
Date.prototype.pattern=function(fmt){
	var o={
		"M+":this.getMonth()+1,//月份
		"d+":this.getDate(),//日
		"h+":this.getHours()%12==0?12:this.getHours()%12,//小时
		"H+":this.getHours(),//小时
		"m+":this.getMinutes(),//分
		"s+":this.getSeconds(),//秒
		"q+":Math.floor((this.getMonth()+3)/3),//季度
		"S":this.getMilliseconds()//毫秒
	};
	var week={
		"0":"/u65e5",
		"1":"/u4e00",
		"2":"/u4e8c",
		"3":"/u4e09",
		"4":"/u56db",
		"5":"/u4e94",
		"6":"/u516d"
	};
	if(/(y+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1,((RegExp.$1.length>1)?(RegExp.$1.length>2?"/u661f/u671f":"/u5468"):"")+week[this.getDay()+""]);
	}
	for(var k in o){
		if(new RegExp("("+k+")").test(fmt)){
			fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)));
		}
	}
	return fmt;
	}
//+---------------------------------------------------
//|日期计算
//+---------------------------------------------------
Date.prototype.DateAdd=function(strInterval,Number){
var dtTmp=this;
	switch(strInterval){
		case's':return new Date(Date.parse(dtTmp)+(1000*Number));
		case'n':return new Date(Date.parse(dtTmp)+(60000*Number));
		case'h':return new Date(Date.parse(dtTmp)+(3600000*Number));
		case'd':return new Date(Date.parse(dtTmp)+(86400000*Number));
		case'w':return new Date(Date.parse(dtTmp)+((86400000*7)*Number));
		case'q':return new Date(dtTmp.getFullYear(),(dtTmp.getMonth())+Number*3,dtTmp.getDate(),dtTmp.getHours(),dtTmp.getMinutes(),dtTmp.getSeconds());
		case'm':return new Date(dtTmp.getFullYear(),(dtTmp.getMonth())+Number,dtTmp.getDate(),dtTmp.getHours(),dtTmp.getMinutes(),dtTmp.getSeconds());
		case'y':return new Date((dtTmp.getFullYear()+Number),dtTmp.getMonth(),dtTmp.getDate(),dtTmp.getHours(),dtTmp.getMinutes(),dtTmp.getSeconds());
	}
}


/**
* 计算俩个时间之间的相隔的小时数
*/
function getHoursDiff(startTime,endTime) {
	
  if(typeof(startTime)=="string") {
  	startTime=new Date(startTime.replace(/-/,'/'));
  	endTime=new Date(endTime.replace(/-/,'/'));
  }
	console.log(startTime.getTime());
  var res = endTime.getTime()-startTime.getTime();

  return res/(1000*60*60);
}

$(function(){
	
	$(".mui-icon-home").click(function(){
		location.replace("../index.jsp");
	});
	
});