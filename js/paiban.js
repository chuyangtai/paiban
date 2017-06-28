(function() {
	//title
	$.modify_title = function(paiban) {
			var package_name = paiban.package_name;
			var name = paiban.name;
			//console.log(package_name);
			var sample_num = $.getUrlParam('sampleNumber');
			$('title').text('(' + package_name + ')' + name + '-' + sample_num)
		}
		//获取url中的参数
	$.getUrlParam = function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
			var r = window.location.search.substr(1).match(reg); //匹配目标参数
			if(r != null) return decodeURIComponent(r[2]);
			return null; //返回参数值
		}
		//代理商名字去星号
	$.modify_name = function(paiban) {
			var name = paiban.name;
			if(name.indexOf('*') > -1) {
				paiban.name = name.replace(/\*/g, '');
				console.log(name)
			}
		}
		//基因位点表格，重新排序，H
	$.table_tr = function(table_1, table_2) {
			var trnum_1 = table_1.find('tbody tr').length;
			var trnum_2 = table_2.find('tbody tr').length;
			var max_num = Math.max(trnum_1, trnum_2);
			var pre_num = Math.ceil((trnum_1 + trnum_2) / 2); //向上取整
			var toleft = parseInt((trnum_1 + trnum_2) / 2); //向下取整
			var eletr = [];
			if(trnum_1 > trnum_2) {
				//console.log('trnum_1'+trnum_1)
				//console.log('trnum_2'+trnum_2);
				for(var i = pre_num; i < trnum_1; i++) {
					eletr.push(table_1.find("tbody tr").eq(i));
				}
				table_2.find("tbody").prepend(eletr);
			} else if(trnum_1 < trnum_2) {
				for(var i = 0; i < trnum_2 - toleft; i++) {
					eletr.push(table_2.find("tbody tr").eq(i));
				}
				table_1.find("tbody").append(eletr);
			}
			if((trnum_1 + trnum_2) % 2 != 0 && (trnum_1 + trnum_2) > 1) {
				table_2.append("<tr><td></td><td></td><td></td></tr>")
			} else if((trnum_1 + trnum_2) == 1) {
				table_1.css({
					'width': '100%'
				})
				table_2.remove()
			}

		}
		//自动页码
	$.pagenumber = function(pagenumber) {
			for(var i = 1; i <= pagenumber.length; i++) {
				//console.log(pagenumber.eq(i-1))
				if(i <= 9) {
					pagenumber.eq(i - 1).text('00' + i);

				} else if(i <= 99) {
					pagenumber.eq(i - 1).text('0' + i);
				} else if(i <= 999) {
					pagenumber.eq(i - 1).text(i);
				}

			}
		}
		//目录页码
	$.catalog_page = function(package_id) {
			var cata_tds = $('.cata_table');
			var item_names = $('.item_name');
			$.each(cata_tds, function(i, cata_td) {
				var cata_txt = $(cata_td).text();
				//console.log(cata_txt)
				var cata_td = cata_td;
				$.each(item_names, function(j, item_name) {
					var item_txt = $(item_name).text();
					if(cata_txt == item_txt && package_id == 1 || cata_txt == item_txt && package_id == 3) { //H
						var page_num = $(item_name).siblings('.pagenumber').text();
						$(cata_td).next('td').text(page_num);
					} else if(cata_txt == item_txt && package_id == 2) { //T
						//console.log(package_id)
						var page_num = $(item_name).parent().siblings('.pagenumber').text();
						//console.log(page_num)
						$(cata_td).next('td').text(page_num);
					} else if(cata_txt == item_txt && package_id == 4) {
						if($(cata_td).hasClass('cata_t')) {
							var page_num = $(item_name).parent().siblings('.pagenumber').text();
						} else if($(cata_td).hasClass('cata_h')) {
							var page_num = $(item_name).siblings('.pagenumber_th').text();
							//console.log( $(item_name).text())
						}
						$(cata_td).next('td').text(page_num);
					}
				});
			});
		}
		//标正序去重
	$.removesame = function(tagarray) {
			var tabs = [];
			var tvalues = [];
			for(var i = 0; i <= tagarray.length - 1; i++) {
				if(tabs.indexOf(tagarray[i]) == -1) {
					// 如果不存在，则创建
					tabs.push(tagarray[i]);
					tvalues.push({
						tagname: tagarray[i],
						tvalues: [i]
					});
					//console.log(tagarray[i]);
				} else {
					// 如果已存在，则将下标加入到数组
					for(var j = 0; j <= tvalues.length - 1; j++) {
						if(tvalues[j].tagname == tagarray[i]) tvalues[j].tvalues.push(i);
					}
				}
			}
			//console.log(tvalues)
			return tvalues;
		}
		//大类别标签定位
	$.type_tag = function() {
			$(".result_tag").each(function() {
				$(this).next('.result').find('.result_txt').css({
					'padding-bottom': '90px'
				})
			});
			$(".result_tag_adult").each(function() {
				$(this).next('.result').find('.result_txt').css({
					'padding-bottom': '50px'
				});
				$(this).next('.result').find('.blank30').removeClass('blank30').addClass('blank20')
			})
		}
		//合并高度较小的两个页面,当上一个页面高度小于半页时，将下一页合并到上一页，并加分割线，用于H
	$.merge_page = function() {
			for(var i = 0; i <= $('.result.matuo').length - 1; i++) {
				var other_h = $('.result.matuo').eq(i).find('.pagenumber').outerHeight(true) + $('.result.matuo').eq(i).next().find('.tlt_border').outerHeight(true) + $('.result.matuo').eq(i).next().find('.result_txt').outerHeight(true) - 60; //页码距离底部的距离+间隔线的距离
				var result_h = $('.result.matuo').eq(i).height();
				var my_elem = $('.result.matuo').eq(i).children();
				var next_elem = $('.result.matuo').eq(i).next().children();
				var my_h = $.caculate_h(my_elem);
				var next_h = $.caculate_h(next_elem);
				//console.log(i)
				//console.log(other_h)
				//console.log(next_h);
				//console.log(my_h + next_h - other_h)
				if((my_h + next_h - other_h <= result_h) && my_h != 0 && next_h != 0) {

					$('.result.matuo').eq(i).find('.pagenumber').remove();
					$('.result.matuo').eq(i).find('.pagenumber_th').remove();
					$('.result.matuo').eq(i).next().find('.tlt_border').remove().next('result_txt').remove();
					next_elem.remove();
					next_elem.splice(0, 2); //去掉下一页第一二项和最后一项
					$('.result.matuo').eq(i).append('<div class="separate"><div>');
					$('.result.matuo').eq(i).append(next_elem);
					$('.result.matuo').eq(i).find('.blank20').remove();
					$('.result.matuo').eq(i).next().remove(); //移除第三页
					//i++ //第三页不执行，跳过第三页
				}
			}
		}
		//当内容超过6个图时，放到下一页，仅适用 H报告天赋详情结果解读图表部分，用于T
	$.divide_page = function() {
			$('.graph_model').each(function() {
				var num = $(this).find('.section-assessment').length;
				var elem = [];
				if(num > 6) { //大于6个图把多余的往下移动一页
					for(var i = 6; i <= num; i++) {
						elem.push($(this).find('.section-assessment').eq(i).parent());
					}
					$(this).next('.table_model').find('.tlt_txt').after('<div class="blank20"></div>').after(elem);
				}
				if(num >= 10) { //大于10个图把表格再往下移动一页
					var table_elem = $(this).next('.table_model').find('.table_all');
					$(this).next('.table_model').after('<div class="result"><div class="tlt_border_t"></div><div class="tlt_txt">检测结果概况</div></div>');
					$(this).next('.table_model').next(".result").append(table_elem).append('<div class="pagenumber"></div>');
				}
			})
		}
		//计算 JQ元素数组jq_array中高度之和
	$.caculate_h = function(jq_array) {
		var totle_h = 0;
		$.each(jq_array, function(i, elem) {
			totle_h += $(elem).outerHeight(true);
		});
		return totle_h;
	}

	//画雷达图
	$.drawRadar = function(documentID, dataArr) {
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById(documentID));
			//定义图表option  
			var option = {
				title: {
					text: ''
				},
				textStyle: {
					color: '#333333'
				},
				grid: {
					top: 0,
					right: 0,
					left: 0,
					bottom: 0
				},
				tooltip: {
					show: false // 不显示浮层
				},
				legend: {
					data: [''] // 不显示图例
				},
				radar: {
					shape: 'circle', // 形状
					startAngle: 90, // 开始项的角度90度为第一项,逆时针顺序依次为第二、第三...
					radius: 98, // 半径
					splitNumber: 10,
					splitArea: {
						areaStyle: { //5：2：3

							color: ['#e5e5e5', '#e5e5e5', '#e5e5e5', '#e5e5e5', '#e5e5e5', '#c1e3ff', '#c1e3ff', '#ffffff', '#ffffff', '#ffffff']
						}
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: ['#c2c2c2', '#e5e5e5', '#e5e5e5', '#e5e5e5', '#e5e5e5', '#c2c2c2', '#c1e3ff', '#c2c2c2', '#ffffff', '#ffffff']
						}
					},
					indicator: dataArr.indicator
				},
				series: [{
					name: '我的天赋',
					type: 'radar',
					areaStyle: {
						normal: {
							opacity: 0.35
						}
					},
					lineStyle: {
						normal: {
							opacity: 0.8
						}
					},
					data: [{
						value: dataArr.value,
						name: '我的天赋',
						itemStyle: {
							normal: {
								color: '#48adff',
								borderWidth: 1,
								opacity: 1
							}
						}
					}]
				}]
			};
			//为echarts对象加载数据              
			myChart.setOption(option);
		}
		//雷达图字换行
	$.radiustext = function(eqname, dataArr) {
		var elength = eqname.length;
		var copy = eqname;
		if(elength == 5) {
			copy[1].name = eqname[1].name.substr(0, 4) + '\n' + eqname[1].name.substr(4);
			copy[4].name = eqname[4].name.substr(0, 4) + '\n' + eqname[4].name.substr(4);
		} else if(elength == 3) {
			copy[1].name = eqname[1].name.substr(0, 4) + '\n' + eqname[1].name.substr(4);
			copy[2].name = eqname[2].name.substr(0, 4) + '\n' + eqname[2].name.substr(4);
		} else if(elength == 6) {
			copy[1].name = eqname[1].name.substr(0, 4) + '\n' + eqname[1].name.substr(4);
			copy[2].name = eqname[2].name.substr(0, 4) + '\n' + eqname[2].name.substr(4);
			if(copy[4].name.length > 5) {
				copy[4].name = eqname[4].name.substr(0, 4) + '\n' + eqname[4].name.substr(4);
			}
			if(copy[5].name.length > 5) {
				copy[5].name = eqname[5].name.substr(0, 4) + '\n' + eqname[5].name.substr(4);
			}

		} else if(elength == 7) {
			copy[1].name = eqname[1].name.substr(0, 4) + '\n' + eqname[1].name.substr(4);
			copy[2].name = eqname[2].name.substr(0, 3) + '\n' + eqname[2].name.substr(3);
			copy[5].name = eqname[5].name.substr(0, 4) + '\n' + eqname[5].name.substr(4);
			copy[6].name = eqname[6].name.substr(0, 4) + '\n' + eqname[6].name.substr(4);
		} else if(elength == 8) {
			copy[1].name = eqname[1].name.substr(0, 4) + '\n' + eqname[1].name.substr(4);
			copy[6].name = eqname[6].name.substr(0, 4) + '\n' + eqname[6].name.substr(4);
			copy[2].name = eqname[2].name.substr(0, 3) + '\n' + eqname[2].name.substr(3);
			copy[6].name = eqname[6].name.substr(0, 3) + '\n' + eqname[6].name.substr(3);
			copy[7].name = eqname[7].name.substr(0, 4) + '\n' + eqname[7].name.substr(4);

		}
		dataArr.indicator = [];
		for(var i = 0; i <= elength - 1; i++) {
			dataArr.indicator.push({
				name: copy[i].name,
				max: 100
			});
		}

	};
	//清除换行
	$.removen = function(eqname) {
		for(var i = 0; i <= eqname.length - 1; i++) {
			eqname[i].name = eqname[i].name.replace('\n', '')

		}
	}

	//画正态图
	$.drawzt = function(ctx2, mynum, base) { //百分比，基础百分比
			ctx2.width = 500;
			ctx2.height = 300;
			var arry = [];
			//生成250随机数
			for(var i = -5; i <= 5; i = i + 0.01) {
				arry.push(Math.pow(0.82, i * i) * 4.1);
			}
			mynum = Math.floor(1000 - Number(mynum) * 1002 - Number(base) * 1000);
			//console.log(mynum)
			ctx2.beginPath();
			ctx2.lineWidth = 1;
			ctx2.fillStyle = "#EEEEEE";
			ctx2.lineTo(0, 0);
			for(var x = 0; x < mynum; x++) { //灰色部分
				ctx2.lineTo(x, arry[x] * 100 + 2);
			}
			ctx2.lineTo(mynum, 0); //开始位置num1
			ctx2.fill();
			//279AFC
			ctx2.beginPath();
			ctx2.lineWidth = 1;
			ctx2.fillStyle = "#279AFC";
			ctx2.lineTo(mynum, 0); //开始位置num1
			for(var x = mynum; x < arry.length; x++) {
				ctx2.lineTo(x, arry[x] * 100 + 2);
			}
			ctx2.lineTo(1000, arry[1000]);
			ctx2.lineTo(1000, 0);
			ctx2.fill();
			//坐标
			ctx2.beginPath();
			ctx2.strokeStyle = "#B8B8B8";
			ctx2.lineTo(0, 0);
			ctx2.lineTo(1000, 0);
			ctx2.stroke();
			ctx2.beginPath();
		}
		//画正圈图
	$.drawcircle = function(ctx, text, p1, color, t_color) {
			// 清空画布
			var p = p1;
			if(p1 >= 0.98) {
				p1 = 0.98;
			}
			var c_width = ctx.canvas.width;
			var c_height = ctx.canvas.height;
			ctx.clearRect(0, 0, c_width, c_height);
			//底部圆
			ctx.beginPath();
			ctx.font = "16px Microsoft YaHei";
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.lineWidth = 8;
			ctx.fillStyle = t_color;
			ctx.strokeStyle = color;
			ctx.stroke();
			//圆2
			ctx.beginPath();
			ctx.lineWidth = 1.5;
			ctx.arc(c_width / 2, c_height / 2, 64 * 2, 0, 2 * Math.PI);
			ctx.stroke();
			//圆弧2,p1 为百分比
			ctx.beginPath();
			ctx.lineWidth = 18;
			ctx.strokeStyle = color;
			var start_r = (-p1 / 2 * 360 + 2) * Math.PI / 180;
			var end_r = (p1 / 2 * 360 - 2) * Math.PI / 180;
			ctx.arc(c_width / 2, c_height / 2, 78 * 2, start_r, end_r);
			ctx.stroke();

			//圆弧1,p1 为百分比
			ctx.beginPath();
			ctx.strokeStyle = "#d1d1d1";
			var start_r2 = (p1 / 2 * 360 + 2) * Math.PI / 180;
			var end_r2 = (-p1 / 2 * 360 - 2) * Math.PI / 180;
			ctx.arc(c_width / 2, c_height / 2, 78 * 2, start_r2, end_r2);
			ctx.stroke();
			//指示箭头
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#606060";
			ctx.arc(c_width / 2 + 190, c_height / 2, 1, 0, 2 * Math.PI);
			ctx.lineTo(c_width / 2 + 190, c_height / 2);
			ctx.lineTo(c_width / 2 + 208, c_height / 2 - 20);
			ctx.lineTo(c_width / 2 + 274, c_height / 2 - 20),
				ctx.stroke();
			//数字
			ctx.fillStyle = "#000";
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.font = "32px Microsoft YaHei";
			var p1100 = Number(p * 100).toFixed(0)
			ctx.fillText(p1100 + '%', c_width / 2 + 242, c_height / 2 - 42);
		}
		//计算页数增减空白页
	$.emptypage = function() {
			var page_num = Math.ceil($('html body').height() / 1123);
			var pageelem = [];
			for(var i = 0; i <= page_num - 1; i++) {
				var elem = $('<div class="editor"><div class="content page"></div></div>');
				elem.css({
					'top': i * 1123
				})
				pageelem.push(elem);
			}
			//console.log(page_num)
			$('#fixelem').append(pageelem);
		}
		//内部表格隔行换色
	$.table_color = function() {
		$('.gene').each(function() {
			var table_tr = [];
			for(var i = 0; i <= $(this).find('table').length - 1; i++) {
				var tr_elems = $(this).find('table').eq(i).find('tr');
				for(var j = 0; j <= tr_elems.length - 1; j++) {
					table_tr.push(tr_elems.eq(j));
				}
			}
			for(var k = 0; k <= table_tr.length - 1; k++) {
				if(k % 2 == 0) {
					$(table_tr)[k].addClass('bgcolor3');
				} else {
					$(table_tr)[k].addClass('bgcolor4');
				}
			}
		})
	}

	//T报告模型标签重新排版,在前端展示分别是左上，字从少到多右中，左中，中，其他随意
	$.t_model = function(tag_array) {
			if(tag_array.length >= 6) {
				tag_array.sort(function(a, b) { //从小到大排序
					return a.length - b.length;
				});
				var a = tag_array.slice(0, 1); //中间
				var c = tag_array.slice(1, 4); //左右
				tag_array.sort(function(a, b) { //从小到大排序
					return b.length - a.length;
				});
				var b = tag_array.slice(0, 2);
				//console.log(a)
				//console.log(b)
				//console.log(c)
				newarray = a.concat(b).concat(c);
				return newarray;
			} else {
				tag_array.sort(function(a, b) { //从小到大排序
					return a.length - b.length;
				});
			}

		}
		//修复维生素标签颜色
	$.nutri_color = function() {
		//console.log($('.mark-box .mark-text'))
			$('.mark-box').find('.mark-container_nutri.l2').each(function() {
				if($(this).find('.mark-text').text().indexOf('正常') > -1) {
					$(this).removeClass('l2').addClass('l3');
				}
			});
			$('.tag-group_vita.l2').each(function() {
				if($(this).find('div').text().indexOf('正常') > -1) {
					$(this).removeClass('l2').addClass('l3');
				}
			})
		}
		//修复目录左边单项超出
	$.cata_overflow = function(cata_array) {
			var cataarray = cata_array.children();
			//console.log(cata_array)
			var cata_height = $.caculate_h(cataarray);
			//console.log(cata_height);
			var cata_lasttr = [];
			var elem = $("<table></table>");
			if(cata_height > 905) { //把后三项移到右边
				cata_lasttr = cata_array.find('div:last').find('table tr');
				var last_num = cata_lasttr.length;
				elem.append('<div class="blank20"></div>')
				elem.append(cata_lasttr.eq(last_num - 3)).append(cata_lasttr.eq(last_num - 2)).append(cata_lasttr.eq(last_num - 1));
				cata_array.parent().find('.cata_fr').prepend(elem);
			}
		}
		//成人报告基因位点字数修复
	$.gene_repire = function(gene_col) {
			gene_col.each(function() {
				var h = $(this).find("div").height();
				if(h > 44) {
					$(this).css({
						'line-height': '20px',
						'margin-top': '2px'
					});
				}
			})
		}
		//成人报告位点超出处理,左右最多都是10行，左右都不超过10时不移动
	$.gene_overflow = function() {
		$('.result .result_fl_adult').each(function() {
			var fr_right = $(this).next('.result_fr_adult');
			var elemi = [],
				elemj = [],
				elemk = [],
				elemq = [],
				elemr = [],
				elemj2 = [],
				elemn = [];
			var fr_num = fr_right.find('.list').length; //更新的值
			var fr_num2 = fr_right.find('.list').length; //固定值
			var fl_num = $(this).find('.list').length;
			var parent_tag = $(this).parent('.result').prev('.result_tag_adult'); //若有类标签
			var norisk = fr_right.find('norisk').length;
			if(fl_num > 10) { //左10~20，往右移
				for(var i = 10; i <= $(this).find('.list').length - 1; i++) {
					var elem = $(this).find('.list').eq(i);
					elemi.push(elem);
				}
				elemi.push('<div class="blank10"></div>')
				var il_elem = $('<div class="card"><div class="tc bgcolor1 lh28 page_color1">正常位点</div><div class="paddingbox"><ul class="list-head"><li class="col1">基因位点</li><li class="col2">基因型</li><li class="col3">基因型解释</li></ul></div></div>');
				fr_right.prepend(il_elem)
				fr_right.find('.card:first .list-head').after(elemi);
				fr_right.find('.card:first').after('<div class="blank36"></div>');
				fr_right = $(this).next('.result_fr_adult');
				fr_num = fr_right.find('.list').length;
				//console.log('fr_num：' + fr_num);
				if(fl_num <= 17) { //正常位点<＝17，风险位点>0
					var fr_num_max = 7;
					if(fr_num > fr_num_max) { //当移到右边超过7行,创建下一页
						//console.log($(this))
						jl = fr_right.find('.list').length;
						for(var j = fr_num_max; j <= jl - 1; j++) {
							elemj.push(fr_right.find('.list').eq(j));
						}
						elemj.push('<div class="blank10"></div>')
						var jl_elem = $('<div class="result"><div class="tlt_border_t"></div><div class="tlt_txt">检测结果概况</div><div class="blank30"></div><div class="result_fl_adult"><div class="card risk"><div class="tc bgcolor1 lh28 page_color1">风险位点</div><div class="paddingbox"><ul class="list-head"><li class="col1">基因位点</li><li class="col2">基因型</li><li class="col3">基因型解释</li></ul></div></div></div><div class="pagenumber">024</div></div>');
						jl_elem.find('.paddingbox').append(elemj);
						$(this).parent('.result').after(jl_elem);
						if(fr_num > 24) {
							for(var n = 17; n <= fr_num - 1; n++) {
								elemn.push(jl_elem.find('.list').eq(n));
							}
							var next_elem = $('<div class="result_fr_adult"><div class="card risk"><div class="tc bgcolor1 lh28 page_color1">风险位点</div><div class="paddingbox"><ul class="list-head"><li class="col1">基因位点</li><li class="col2">基因型</li><li class="col3">基因型解释</li></ul></div></div></div>');
							next_elem.find('.paddingbox').append(elemn);
							jl_elem.append(next_elem);
						}
						fr_num = fr_right.find('.list').length;
					}
					if(fr_num2 == 0) { //若风险位点为0
						fr_right.find('.card:first').next('.blank36').after('<div class="card"><div class="tc bgcolor1 lh28 page_color1">风险位点</div><div><div class="risk_gene fs10"><div v-else class="tc norisk">不存在风险位点</div></div><div class="blank10"></div></div></div>');
					}
				} else if(fl_num > 17) {
					fr_num_max = 10;
					if(fr_num > fr_num_max) { //当移到右边超过7行,创建下一页,并且不是无风险位点的情况
						//console.log($(this))
						j = fr_right.find('.list').length;
						for(var j2 = 10; j2 <= fl_num - 11; j2++) {
							elemj.push(fr_right.find('.list').eq(j2));
						}
						//console.log(elemj)
						elemj.push('<div class="blank10"></div>')
						var jl_elem = $('<div class="result"><div class="tlt_border_t"></div><div class="tlt_txt">检测结果概况</div><div class="blank30"></div><div class="result_fl_adult"><div class="card normal"><div class="tc bgcolor1 lh28 page_color1">正常位点</div><div class="paddingbox"><ul class="list-head"><li class="col1">基因位点</li><li class="col2">基因型</li><li class="col3">基因型解释</li></ul></div></div></div><div class="pagenumber">024</div></div>');
						jl_elem.find('.paddingbox').append(elemj);
						$(this).parent('.result').after(jl_elem);
						jl_elem.find('.card.normal').after(fr_right.find('.card.risk'))
						if(fl_num < 21) {
							jl_elem.find('.normal').remove();
							jl_elem.find('.blank36')
						} else {
							jl_elem.find('.card.normal').after('<div class="blank36"></div>');
						}

						if(fl_num < 21 && fr_num > 24) {
							for(var n = 17; n <= fr_num - 1; n++) {
								elemn.push(jl_elem.find('.list').eq(n));
							}
							var next_elem = $('<div class="result_fr_adult"><div class="card risk"><div class="tc bgcolor1 lh28 page_color1">风险位点</div><div class="paddingbox"><ul class="list-head"><li class="col1">基因位点</li><li class="col2">基因型</li><li class="col3">基因型解释</li></ul></div></div></div>');
							if(fr_num2 == 0) { //若风险位点为0
								next_elem.after('<div class="card"><div class="tc bgcolor1 lh28 page_color1">风险位点</div><div><div class="risk_gene fs10"><div v-else class="tc norisk">不存在风险位点</div></div><div class="blank10"></div></div></div>');
							}
							next_elem.find('.paddingbox').append(elemn);
							jl_elem.append(next_elem);
						} else if(fl_num > 20 && fr_num > 22) {
							for(var n = 15; n <= fr_num - 1; n++) {
								elemn.push(jl_elem.find('.list').eq(n));
							}
							var next_elem = $('<div class="result_fr_adult"><div class="card risk"><div class="tc bgcolor1 lh28 page_color1">风险位点</div><div class="paddingbox"><ul class="list-head"><li class="col1">基因位点</li><li class="col2">基因型</li><li class="col3">基因型解释</li></ul></div></div></div>');
							if(fr_num2 == 0) { //若风险位点为0
								next_elem.after('<div class="card"><div class="tc bgcolor1 lh28 page_color1">风险位点</div><div><div class="risk_gene fs10"><div v-else class="tc norisk">不存在风险位点</div></div><div class="blank10"></div></div></div>');
							}
							next_elem.find('.paddingbox').append(elemn);
							jl_elem.append(next_elem);

						}
						fr_num = fr_right.find('.list').length;
					} else if(fr_num == 10 && fr_num2 == 0) { //20项且无风险位点
						var norisk_page = $('<div class="result"><div class="tlt_border_t"></div><div class="tlt_txt">检测结果概况</div><div class="blank30"></div><div class="result_fl_adult"><div class="card"><div class="tc bgcolor1 lh28 page_color1">风险位点</div><div><div class="risk_gene fs10"><div v-else class="tc norisk">不存在风险位点</div></div><div class="blank10"></div></div></div><div class="pagenumber">024</div></div>');
						$(this).parent('.result').after(norisk_page);
					}
				}
				//console.log(fr_right.find('.card').eq(1).find('.list'))
				if(fr_right.find('.card').eq(1).find('.list').length < 1) { //修复到下一页留下标题
					fr_right.find('.card').eq(1).remove();
				}

			} else if(fl_num < 8) { //右边不超过8行,往左移
				if(fr_num > 10) { //右边超过10行，往左移
					var kl = $(this).find('.list').length;
					//console.log(8 - kl);
					for(var k = 0; k <= 8 - kl - 1; k++) {
						//console.log(fr_right.find('.list'))
						elemk.push(fr_right.find('.list').eq(k));
					}
					elemk.push('<div class="blank10"></div>');
					//console.log(elemk)
					var kl_elem = $('<div class="blank36"></div><div class="card"><div class="tc bgcolor1 lh28 page_color1">风险位点</div><div class="paddingbox"><ul class="list-head"><li class="col1">基因位点</li><li class="col2">基因型</li><li class="col3">基因型解释</li></ul></div></div>');
					kl_elem.find('.paddingbox').append(elemk);
					$(this).append(kl_elem);
					if(parent_tag.length == 1) {
						//console.log($(this).find('.blank36'));
						$(this).find('.blank36').remove()
					}
					fr_num = fr_right.find('.list').length;
					if(fr_num > 10) { //右边移动后还超过10行，则创建下一页
						for(var q = 10; q <= fr_num - 1; q++) {
							//console.log(fr_right.find('.list'))
							elemq.push(fr_right.find('.list').eq(q));
						}
						var ql_elem = $('<div class="result"><div class="tlt_border_t"></div><div class="tlt_txt">检测结果概况</div><div class="blank30"></div><div class="result_fl_adult"><div class="card risk"><div class="tc bgcolor1 lh28 page_color1">风险位点</div><div class="paddingbox"><ul class="list-head"><li class="col1">基因位点</li><li class="col2">基因型</li><li class="col3">基因型解释</li></ul></div></div></div><div class="pagenumber">024</div></div>');
						ql_elem.find('.paddingbox').append(elemq);
						$(this).parent('.result').after(ql_elem);
					}
				}
			} else if(fl_num == 8 || fl_num == 9 || fl_num == 10) { //左边8/9,只判断右边
				if(fr_num > 10) { //右边>0移动到下一页
					for(var r = 10; r <= fr_num - 1; r++) {
						//console.log(fr_right.find('.list'))
						elemr.push(fr_right.find('.list').eq(r));
					}
					var rl_elem = $('<div class="result"><div class="tlt_border_t"></div><div class="tlt_txt">检测结果概况</div><div class="blank30"></div><div class="result_fl_adult card"><div class="tc bgcolor1 lh28 page_color1">风险位点</div><div class="paddingbox"><ul class="list-head"><li class="col1">基因位点</li><li class="col2">基因型</li><li class="col3">基因型解释</li></ul></div></div><div class="pagenumber">024</div></div>');
					rl_elem.find('.paddingbox').append(elemr).append('<div class="blank10"></div>');
					//console.log(elemr);
					$(this).parent('.result').after(rl_elem);
				}
			}
			//如果不存在风险位点
		})
	}
	$.catalog_adult = function() {
		$('.catalog_adult').each(function() {
			var cata_fl = $(this).find('.cata_fl').children();
			var totle_h = 0;
			var over_elem = [];
			$.each(cata_fl, function(i, elem) {
				var cata_fl_h = $(cata_fl).eq(i).offset().top - $(cata_fl).eq(0).offset().top + $(cata_fl).eq(i).height();
				//console.log(cata_fl_h)
				if(cata_fl_h >= 930) { //50为margin
					over_elem.push(elem);
				}
			});
			$(this).find('.cata_fr').append(over_elem);
			//console.log(over_elem)
		})

	}
	$.punctuation = function() { //去最后一项顿号
		var arr = []
		var l = $('.punctuation').find('span').last().text().length - 1;
		arr = $('.punctuation').find('span').last().text().substr(0, l);
		$('.punctuation').find('span').last().text(arr)
			//console.log($('.punctuation').find('span').last().text())
	}
	$.adult_gene = function(paiban) { //重复位点加-1，-2，-3
		if(paiban.package_id == 3) {
			$.each(paiban.datas, function(i, data) {
				$.each(data.items, function(j, item) {
					$.each(item.genes.normal, function(i, gene) {
						gene.type = 1;
					});
					var all_genes = item.genes.normal.concat(item.genes.risk); //连接数组
					var all_names = [];
					$.each(all_genes, function(i, gene) {
						all_names.push(gene.name);
					});
					var new_arry = [];

					for(var i = 0; i <= all_names.length - 1; i++) { //得到重复元素
						var targ_name = all_names[i];
						for(var j = 0; j < i; j++) {
							if(targ_name == all_names[j]) {
								new_arry.push(targ_name);
								break;
							}
						}
					}
					$.unique(new_arry);
					//console.log(new_arry);
					for(var j = 0; j <= new_arry.length; j++) { //加标
						var n = 1;
						for(var i = 0; i <= all_genes.length - 1; i++) {
							if(new_arry[j] == all_genes[i].name && j <= new_arry.length - 1) {
								all_genes[i].name = all_genes[i].name + '-' + n;
								n++

							} else if(j == new_arry.length) {
								//console.log(all_genes[i].name)
							}
						}
					}
					//console.log(all_genes);
					var normal = [];
					var risk = [];
					$.each(all_genes, function(j, gene) { //拆分赋值
						if(gene.type == 1) {
							normal.push(gene);
						} else {
							risk.push(gene);
						}
						item.genes.normal = normal;
						item.genes.risk = risk;
					});

				});
			});
		}

	}
	$.detail = function() { //详情的间隔页,结尾间隔页
		var num = $('.detail').prev('.result2').find('.pagenumber').text();
		var num2 = $('.back_blank');
		if(num % 2 != 0) {
			$('.detail').prev('.result2').remove();
		}
		//console.log(num2.prev('.loop').find('.result:last').find('.pagenumber'))
		if(num2.prev('.loop').find('.result:last').find('.pagenumber').text() % 2 == 0) {
			num2.remove();
		}
	}
	$.modify_error = function(paiban) {
		$.each(paiban.datas, function(i, data) {
			//console.log(data.classname)
			if(data.classname == '自身免疫性类') {
				data.classname = "自身免疫类"
			} else if(data.classname == '精神类') {
				data.classname = "精神心理类"
			} else if(data.classname == '代谢性类') {
				data.classname = "代谢类"
			}
		});
	}
	$.remove_empty = function() {
		$('.spacepage').remove()
	}
	//云集
	$.catalog_page_yj = function() {
			var cata_tds = $('.cata_table');
			var item_names = $('.item_name');
			$.each(cata_tds, function(i, cata_td) {
				var cata_txt = $(cata_td).text();
				//console.log(cata_txt)
				var cata_td = cata_td;
				$.each(item_names, function(j, item_name) {
					var item_txt = $(item_name).text();
					var page_num = $(item_name).siblings('.pagenumber');
					//console.log(item_txt)
					if(cata_txt == item_txt&&page_num.length>=1){
						$(cata_td).next('td').text(page_num.text());
					}else if(cata_txt == item_txt){
						var page_num = $(item_name).parent().siblings('.pagenumber');
						$(cata_td).next('td').text(page_num.text());
					}
					
				});
			});
		}
})(jQuery)