import {URL,PANURL} from '../../config.js';
import {getCookieJson} from "../../containers/App.js";
//侧边栏展开与收缩
export var aSide = {
	init: function() {
		var funfold = $('.f-unfold');
		funfold.on('click', this.showSide);
	},
	showSide: function(e) {
		var fnav = $('.f-nav'),
			fnavWidth = fnav.css('width'),
			fsublink = $('.f-sub > a'),
			navStatus = false;
		if (fnavWidth == '200px') { //收缩
			var val = parseInt(fnavWidth) - 140;
			fnav.css('width', val)
			$('.f-page').css('margin-left', val);
			if (!$('.f-curr').parent().hasClass('f-sub')) {
				$('.f-curr').closest('.f-sub').children('a').addClass('f-curr');
			}
			// 选中状态的连接添加到父级，如果没有选中状态，将第一个子节点连接添加到父级
			var placehold = $('.f-placehold');
			if (placehold.length) {
				for (var i = 0, l = placehold.length; i < l; i++) {
					var placeholdn = $(placehold[i]),
						placeholda = placeholdn.parent().children('a'),
						placeholdcurr = placeholdn.find('.f-curr'),
						placeholdsuba = placeholdn.children().children('a');
					if (placeholdcurr.length) {
						placeholda.attr('href', placeholdcurr.attr('href'));
					} else {
						placeholda.attr('href', placeholdsuba.attr('href'));
					}
				}
			}
			fsublink.nextAll('ul').css('display', 'none');
			navStatus = true;
		} else { //展开
			var val = parseInt(fnavWidth) + 140;
			fnav.css('width', val)
			$('.f-page').css('margin-left', val);
			fsublink.nextAll('ul').css('display', 'block');
			if ($('.f-curr').parent().parent().hasClass('f-placehold')) {
				$('.f-sub').children('a').removeClass('f-curr');
			}
			navStatus = false;
		}
		fDrop.init();
		//收缩后开启点击
		if (navStatus) {
			$('.f-placehold').parent().children('a').off('click');
		}
		//判断navStatus状态，true显示提示，false取消绑定
		for (var i = 0, l = fsublink.length; i < l; i++) {
			var $link = $(fsublink[i]);
			if (navStatus) {
				$link.on('mouseover', function() {
					var width = $(this).closest('.f-nav').width(),
						linkH = parseInt($(this).height() / 2),
						tipH = parseInt($('#f-tip').height() / 2),
						top = $(this).offset().top,
						left = $(this).offset().left;
					$('#f-tip').css({
						'display': 'block',
						'left': left + width + 8,
						'top': top + linkH - tipH
					});
					$('.arrow-txt').html($(this).text());
				})

				$link.on('mouseout', function() {
					$('#f-tip').css({
						'display': 'none'
					});
					$('.arrow-txt').html('');
				})
			} else {
				$link.off('mouseover mouseout');

			}
		}

	}
};
//收缩与展开下拉
export var fDrop = {
	init: function() {
		var flink = $('.f-placehold').parent().children('a');
		if (flink.length) {
			for (var i = 0, l = flink.length; i < l; i++) {
				var flinkn = $(flink[i]);
				flinkn.on('click', function(e) {
					var ul = $(this).nextAll('ul');
					if (ul.css('display') != 'none') {
						ul.css('display', 'none');
					} else {
						ul.css('display', 'block')
					}
					return false;
				})
			}
		}
	}
};
$(function(){
	//aSide.init();
	//fDrop.init();
	//Modal ();
});

export function selectie(id, width) {
	var w = width ? width : "100%";
	for (var i = 0, len = id.length; i < len; i++) {
		$(id[i]).chosen({
			disable_search_threshold: 10,
			width: w
		})
	}
};
/*
 封装表单验证,
 string elements表单对象，
 jsong rules验证规则，
 json msg消息提示，
 string url验证后请求地址
 */
var checkStatus = true; //调试开关   true为正常提交，false为测试
export function formCheck(elements, rules, msg, url,model,hid) {
	if (checkStatus) {
		var $submitBtn = $(elements).find('button[type=submit]');
		var $subTxt = $submitBtn.html();
		$submitBtn.removeAttr("disabled");
	}

	var hidre = hid ? '.ignore' : '';
	var v = $(elements).validate({
		onkeyup: false,
		ignore: hidre,
		errorElement: "span",
		errorClass: "wrong",
		rules: rules,
		messages: msg,

		highlight: function(element) {
			var isUsePlug = $(element).closest('.f-resValidate');
			if (isUsePlug.length) {
				$(element).closest('.form-res').addClass('has-error');
			} else {
				$(element).closest('.form-group').addClass('has-error');
			}
		},

		success: function(label) {
			var isUsePlug = label.closest('.f-resValidate');
			if (isUsePlug.length) {
				label.closest('.form-res').removeClass('has-error');
			} else {
				label.closest('.form-group').removeClass('has-error');
			}
			label.remove();
		},

		errorPlacement: function(error, element) {
			var isUsePlug = element.closest('.f-usePlug');
			if (isUsePlug.length) {
				if (!$('.resError').length) {
					error.addClass('resError');
					isUsePlug.append(error);
				}
			} else {
				element.parent().append(error);
			}
		},

		submitHandler: function() {
			if (checkStatus) {
				$submitBtn.html($subTxt + '中...');
				$submitBtn.attr("disabled", true);
			}
			if(elements=="#Nginx_Configure_Form"){
				//生效层级必须选一个
				for(var i=0;i<$('.workGrade').length;i++){
					if(i!=$('.workGrade').length-1){
						if($($('.workGrade')[i]).find('input:checked').length==0){
							if($($('.workGrade')[i]).find('.workGrade_worng').length==0){
								$($('.workGrade')[i]).append('<li class="workGrade_worng" style="color:darkred">至少要选择一个生效层级</li>');
							}
						}else{
							$($('.workGrade')[i]).find('.workGrade_worng').remove();
						}
					}
				}
				//location名称不能相同
				var locationName=[];
				for(var i=0;i<$('input[name^="location[name]"]').length;i++){
					for(var j=0;j<$('input[name^="location[name]"]').length;j++){
						if(j!=i){
							var _locationName=$('input[name^="location[name]"]')[j]
							locationName.push($(_locationName).val());
						}
					}
					var _locationName=$('input[name^="location[name]"]')[i];
					if(locationName.indexOf($(_locationName).val())>-1){
						if($(_locationName).closest('.workGradeLoc').find('.workGrade_worng').length==0){
							$(_locationName).closest('.workGradeLoc').append('<li class="workGrade_worng" style="color:darkred">location名称重复</li>');
						}
					}else{
						$(_locationName).closest('.workGradeLoc').find('.workGrade_worng').remove();
					}
					locationName=[];
				}
				if($('.workGrade_worng').length>0){
					return false;
				}
			}
			var res = JSON.stringify(getSubmitJson(model));
			$.ajax({
				url: URL + url,
				data: res,
				type: 'post',
				success: function (result) {
					var result = JSON.parse(result);
					//成功后跳转
					if (checkStatus) {
						if (elements == '#Channel_add') {
							$('#f-addChannel-modal').modal('hide');
							addOperation('添加Nginx频道'+$(elements).find('input[name="channel"]').val());
							$('.f-page').attr('data-new','1');
							window.location.href='/#/nginxConfig?channel_name=' + $(elements).find('input[name="channel"]').val() + '&newchannelId=' + result.info['_id'];
							return true;
						} else if (elements == '#Channel_copy') {
							$('#f-copyChannel-modal').modal('hide');
							addOperation('拷贝Nginx频道'+$(elements).find('input[name="channel"]').val());
							window.location.href='/#/nginxConfig?_copy_channel_name=' + $(elements).find('input[name="channel"]').val() + '&channelId=' + $('#copy_id').val() + '&newchannelId=' + result.info['_id'];
							return true;
						} else if (elements == '#Nginx_Configure_Form') {
							if (result.info['_id']) {
								addOperation('添加Nginx频道配置'+$('#channel_name').text());
								new ShowDiag({msg: '操作成功...', closetime: 1, refresh: false});
								window.location.href='/#/nginxConfig?channel_id=' + result.info['_id'];
							}else{
								new ShowDiag({msg: '操作成功...', closetime: 1, refresh: false});
								addOperation('修改Nginx频道配置'+$('#channel_name').text());
								return true;
							}
						} else if(elements=='#Channel_edit'){
							addOperation('修改Nginx频道'+$(elements).find('span[name="channel"]').text());
						}else if(elements=='#user_add'){
							addOperation('添加用户'+$(elements).find('input[name="username"]').val());
						}else if(elements=="#userEdit"){
							addOperation('修改用户'+$(elements).find('.account').text());
						}else if(elements=="#resetPwd"){
							addOperation('重置用户'+$('#uname').val()+'的密码');
						}else if(elements=="#personEdit"){
							addOperation('修改个人信息');
						}else if(elements=="#setPwd"){
							addOperation('修改个人密码');
						}
						new ShowDiag({msg: '操作成功...', closetime: 1, refresh: true});
					}
				},
				error: function (result) {
					var result = JSON.parse(result.responseText);
					if ('failed' == result.info.status) {
						new ShowDiag({msg:result.info.warning, closetime: 1, refresh: false});
						$submitBtn.html($subTxt);
						$submitBtn.removeAttr("disabled");
						if (elements == '#user_add'||elements == '#setPwd') {
							$('.error').text(result.info.warning);
						}
					}
				}
			});
		}
	});
	return v;
}
/**
 * 提示信息
 * @param string txt
 * */
export function alertMsg(txt, closeSecond, flag, fmode) {
	if (fmode) {
		$(fmode).modal('hide');
	}

	$("#alertcontent").html(txt);
	$('#alertdiog').modal('show');
	$('#alertdiog').show();
	var secs = closeSecond || 0; //倒计时的秒数
	if (secs > 0) {
		if (!flag) { //关闭不刷新页面
			window.setTimeout("$('#alertdiog').modal('hide')", secs * 1000);
			return false;
		}
		window.setTimeout('window.location.reload(true)', secs * 1000);
	}
}
// alert、conform弹框
export function Modal () {
	window.Modal = function () {
		var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
		var alr = $("#delModal");
		var mask = $('.mask');
		var ahtml = alr.html();
		var _alert = function (options) {
			_public("alert", options);
			return {
				on: function (callback) {
					if (callback && callback instanceof Function) {

						alr.find(".close").click(function () {
							_closed(mask, alr);
						})

						alr.find('.ok').click(function () {
							callback(true);
							_closed(mask, alr);
						});
					}
				}
			};
		};

		var _close = function (options) {
			_closed(mask, alr);
		};

		var _confirm = function (options) {

			_public("confirm", options);
			return {
				on: function (callback) {
					if (callback && callback instanceof Function) {

						alr.find(".close").click(function () {
							_closed(mask, alr);
						})

						alr.find('.ok').click(function () {
							callback(true);
							_closed(mask, alr);
						});


						alr.find('.cancel').click(function () {
							callback(false);
							_closed(mask, alr);
						});


					}
				}
			};
		};

		var _public = function (name, options) {
			//console.log(ahtml);
			alr.html(ahtml);
			mask.css({
				'display': 'block'
			});
			_center(alr);
			var $find = alr.find('.cancel');
			var $findBtn = alr.find('.ok');
			name == "confirm" ? $find.show() : $find.hide();
			options.btnok == '' ? $findBtn.hide() : $findBtn.show();
			_dialog(options);
		}


		var _dialog = function (options) {
			var ops = {
				msg: "提示内容",
				title: "操作提示",
				btnok: "确定",
				btncl: "取消"
			};

			$.extend(ops, options);
			var html = alr.html().replace(reg, function (node, key) {
				return {
					Title: ops.title,
					Message: ops.msg,
					BtnOk: ops.btnok,
					BtnCancel: ops.btncl
				}[key];
			});

			alr.html(html);
		}

		var _center = function (obj) {
			var screenWidth = $(window).width(),
				screenHeight = $(window).height(); //当前浏览器窗口的 宽高
			var scrolltop = $(document).scrollTop(); //获取当前窗口距离页面顶部高度
			var objLeft = (screenWidth - obj.width()) / 2;
			var objTop = (screenHeight - obj.height()) / 10 + scrolltop;
			obj.css({
				left: objLeft + 'px',
				top: objTop + 'px',
				'display': 'block'
			});

			//浏览器窗口大小改变时
			$(window).resize(function () {
				screenWidth = $(window).width();
				screenHeight = $(window).height();
				scrolltop = $(document).scrollTop();
				objLeft = (screenWidth - obj.width()) / 2;
				objTop = (screenHeight - obj.height()) / 10 + scrolltop;
				obj.css({
					left: objLeft + 'px',
					top: objTop + 'px'
				});
			});

			//浏览器有滚动条时的操作、
			$(window).scroll(function () {
				screenWidth = $(window).width();
				screenHeight = $(window).height();
				scrolltop = $(document).scrollTop();
				objLeft = (screenWidth - obj.width()) / 2;
				objTop = (screenHeight - obj.height()) / 10 + scrolltop;
				obj.css({
					left: objLeft + 'px',
					top: objTop + 'px'
				});
			});
		};

		// 隐藏操作
		var _closed = function (obj1, obj2) {
			obj1.fadeOut();
			obj2.fadeOut();
		}

		return {
			alert: _alert,
			confirm: _confirm,
			closed: _close
		}

	}();
}
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt /*, from*/ ) {
		var len = this.length >>> 0;

		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0)
			from += len;

		for (; from < len; from++) {
			if (from in this &&
				this[from] === elt)
				return from;
		}
		return -1;
	};
}
/*
 * msg 必填  提示信息
 * closetime 选填  关闭弹框时间，0表示不关闭，默认为0
 * refresh   选填  true为关闭弹窗刷新，false为不刷新，默认false
 * new ShowDiag({msg:'没有数据...',closetime:0,refresh:false});
 * */
export function ShowDiag(json) {
	this.diag = $('#fdiag');
	this.bg = $('#lbOverlay');
	this.content = $('#lbCenter > span');
	this.lbCenterBox = $('#lbCenter');
	this.msg = json.msg;
	this.closetime = typeof json.closetime == 'undefined' ? 0 : parseInt(json.closetime);
	this.refresh = typeof json.refresh == 'undefined' ? false : json.refresh;
	this.init();
}
ShowDiag.prototype = {
	init: function() {
		var _this = this;
		this.content.text(this.msg);
		this.diag.show(); //显示弹框
		//滚动条滚动监听
		_this.scroll();
		$(window).on('scroll', function() {
			_this.scroll();
		});
		//点击背景关闭弹框
		this.diag.on('click', function() {
			_this.click();
		});
		//如果this.closetime为0，不自动关闭弹框
		if (this.closetime) {
			this.timer(this.closetime);
		}
	},
	click: function() {
		this.timer();
	},
	timer: function(n) {
		var timer, _this = this;
		if (n) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				_this.diag.hide();
				_this.content.text('');
				_this.isrefresh();
			}, n * 1000);
		} else {
			_this.diag.hide();
			_this.content.text('');
			this.isrefresh();
		}
	},
	isrefresh: function() {
		if (this.refresh) {
			window.location.reload(true);
		}
	},
	scroll: function() {
		var sleft = $(window).scrollLeft() + ($(window).width() - this.lbCenterBox.outerWidth()) / 2;
		var sstop = $(window).scrollTop() + ($(window).height() - this.lbCenterBox.outerHeight()) / 8;
		this.lbCenterBox.css({
			left: sleft,
			top: sstop
		});
	}
};


//开始时间和结束时间
export function Datetimepicker_Start_End(element,start,end){
	$(element).find(start).datetimepicker({
		format:'yyyy-mm-dd hh:ii:ss',
		language:  'zh-CN',
		weekStart: 1,
		todayBtn:  1,
		autoclose: true,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
		showMeridian: 1,
		pickerPosition:'bottom-left'
	}).on("changeDate",function(ev){
		$(element).find(end).datetimepicker("setStartDate",  $(element).find(start).find('input').val());
	});
	$(element).find(end).datetimepicker({
		format:'yyyy-mm-dd hh:ii:ss',
		language:  'zh-CN',
		weekStart: 1,
		todayBtn:  1,
		autoclose: true,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
		showMeridian: 1,
		pickerPosition:'bottom-left'
	}).on("changeDate",function(ev){
		$(element).find(start).datetimepicker("setEndDate",  $(element).find(end).find('input').val());
	});
}



/*地图随机假数据*/
export function randomData() {
	return Math.round(Math.random()*1000);
}
export function add0(m) {
	return m < 10 ? '0' + m : m
}
export function defformat(shijianchuo,str){
	var str=!str?"":str;
	//shijianchuo是整数，否则要parseInt转换
	var time = new Date(shijianchuo*1000);
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return String(y)+str+add0(m)+str+add0(d);
}
export function getMinut(shijianchuo,str){
	//shijianchuo是整数，否则要parseInt转换
	var str=!str?"":str;
	var time = new Date(shijianchuo*1000);
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return String(y)+str+add0(m)+str+add0(d)+" "+add0(h)+":"+add0(mm);
}
export function mapOpt(title,legendData,seriesData,rangeType,color,Max){
	var option = {
		color:color,
		title: {
			text: title,
			left: 'center'
		},
		tooltip: {
			trigger: 'item'
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data:legendData
		},
		series:seriesData
	};
	if(!rangeType){
		return option;
	}else{
		var dataRange=rangeType==1?{
			pieces: [
				{gt: 5,color: '#e1022a'},            // (1500, Infinity]
				{gt: 4, lte: 5,color: '#e03a1c'},  // (900, 1500]
				{gt: 3, lte: 4,color: '#e1740e'},  // (310, 1000]
				{gt: 2, lte: 3,color: '#d5a108'},   // (200, 300]
				{gt: 0, lte: 2, color: 'green'},
				{value: 0, color: '#808080'}
			]
		}:{
			min: 0,
			max: Max,
			left: 'left',
			top: 'bottom',
			color: ['#d94e5d','#eac736','#50a3ba','#808080'],
			text: ['高','低'],           // 文本，默认为数值文本
			calculable: true
		};
		option.visualMap=dataRange;
		return option;
	}


	return option;
}
export function historyLineOpt(yAxisName,timeData,legendData,series,color){
	var opt = {
		tooltip: {
			trigger: 'axis',
			position: function (pt) {
				return [pt[0], '10%'];
			}
		},
		legend: {
			data:legendData,
			center:"center"
		},
		dataZoom:  [{
			type: 'inside',
			start: 0,
			end: 20,
			/*startValue: '2017/02/14 00:00',
			endValue:'2017/02/14 08:00'*/
		},
			{

				handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				handleSize: '80%',
				handleStyle: {
					color: '#fff',
					shadowBlur: 3,
					shadowColor: 'rgba(0, 0, 0, 0.6)',
					shadowOffsetX: 2,
					shadowOffsetY: 2
				}
			}],
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: timeData
		},
		yAxis: {
			name:yAxisName,
			type: 'value'
		},
		series:series
	};
	if(!color||!color.length){
		return opt;
	}else{
		opt.color=color;
		return opt;
	}
	return opt;
}
//双轴line
export function towYAxisChartOpt(xData,legendData,color,yAxis,series){
	var option = {
		tooltip : {
			trigger: 'axis'
		},
		color:color,
		xAxis : [
			{
				type : 'category',
				position: 'bottom',
				boundaryGap: false,
				axisLabel : {
					show:true,
					interval: 'auto',    // {number}
					formatter: '{value}'
				},
				data : xData
			}
		],
		dataZoom: [
			{
				show: true,
				realtime: true,
				start: 25,
				end: 45
			},
			{
				type: 'inside',
				realtime: true,
				start: 25,
				end: 45
			}
		],
		yAxis : yAxis,
		series : series
	};

	var leg=Array.isArray(legendData)?{data:legendData}:{...legendData};
	return {...option,legend: leg};
}
//根据起始时间和结束时间，返回对应的时间和时间戳区间(每分钟一个点)
export function getDateRange(start,end){
	var time_list=[],timev=[];
	var startTime=parseInt(new Date(start).getTime()/1000),endTime=parseInt(new Date(end).getTime()/1000),timeDef=endTime-startTime;
	for(var i=0;i<=timeDef/60;i++){
		time_list.push(getMinut(startTime+i*60,"-"));
		var tmpTime=startTime+i*60+59+"";
		timev.push(tmpTime);
		/*if(!timeObj[tmpTime]){
			timeData.push(0);
		}else{
			timeData.push(timeObj[tmpTime]);
		}*/
	}
	return {"time_list":time_list,"timev":timev}
}
export function cookieInfo(thisTime){
	//var cookieData=$.parseJSON(document.cookie);
	var cookieData=getCookieJson();
	var jsonData={"ckt":parseInt(thisTime)+"","username":cookieData.username,"password":$.md5(cookieData.password+parseInt(thisTime))};
	return jsonData;
}