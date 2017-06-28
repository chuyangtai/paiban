//疾病色块
$(function() {
	for(var i = 1; i <= $(this).find("tr").length - 1; i++) {
		var fenxian = $(".fenxian tr").eq(i).find("td").last();
		if(fenxian.text() == "低") {
			fenxian.prev("td").find("div").addClass("danger1");
		}
		if(fenxian.text() == "较低") {
			fenxian.prev("td").find("div").addClass("danger2");
		}
		if(fenxian.text() == "正常") {
			fenxian.prev("td").find("div").addClass("danger3");
		}
		if(fenxian.text() == "较高") {
			fenxian.prev("td").find("div").addClass("danger4");
		}
		if(fenxian.text() == "高") {
			fenxian.prev("td").find("div").addClass("danger5");
		}
	}
});

//表格加圆角
$(function() {
	//风险汇总表格
	$(".contentedge table").each(function() {
		if($(this).find("tr").eq(0).find("th").length >= 1) {
			$(this).find("tr").eq(0).find("th").eq(0).addClass("radius_tl");
			$(this).find("tr").eq(0).find("th").last().addClass("radius_tr");
			$(this).find("tr").eq(0).find("th").css({
				"border-top": "1px solid #39AAA9"
			});
		} else {
			$(this).find("tr").eq(0).find("td").eq(0).addClass("radius_tl");
			$(this).find("tr").eq(0).find("td").last().addClass("radius_tr");
			$(this).find("tr").eq(0).find("td").css({
				"border-top": "1px solid #39AAA9"
			});
		}
		$(this).find("tr").last().find("td").eq(0).addClass("radius_bl");
		$(this).find("tr").last().find("td").last().addClass("radius_br");
		$(this).find("td,th").css({
			"border-right": "1px solid #39AAA9",
			"border-bottom": "1px solid #39AAA9"
		});
		$(this).find("tr").css({
			"border-bottom": "1px solid #39AAA9"
		});
		$(this).find("tr").each(function() {
			$(this).children().eq(0).css({
				"border-left": "1px solid #39AAA9"
			})
		})
	})
})

//显示页面张数
$(function() {
	var allheight = $("body").height();
	var num = Math.ceil(allheight / 1077);
	for(var i = 1; i <= num; i++) {
		var elem = $("<div class='editor'></div>");

		var elemchild = $("<div class='content'></div>");
		if(i <= 4) {
			elem.css({
				'top': 297 * (i - 1) + 'mm'
			})
			elemchild.addClass('page' + i);
		} else {
			elem.css({
				"background-color": "#F4FAFE",
				'top': 297 * (i - 1) + 'mm'
			})
			elemchild.addClass('page');
		}
		$("#fixelem").append(elem);
		elem.prepend(elemchild);
	};
});

//canvas画图
$(function() {
	var c1 = document.getElementById("c1");
	var ctx = c1.getContext("2d");
	var c_width = ctx.canvas.width,
		c_height = ctx.canvas.height,
		pre_height = (ctx.canvas.height - 20) / 5;
	var data1 = {
		xjgs: [{
			name: "中国人群患病概率",
			num: 0.19
		}, {
			name: "您的患病概率",
			num: 0.188
		}]
	}

	function drawcoordinate() {
		ctx.beginPath();
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = "1px";
		ctx.lineTo(1, 1);
		ctx.lineTo(1, c_height - 21);
		ctx.lineTo(c_width, c_height - 21);
		ctx.stroke();
		for(var i = 1; i <= 4; i++) {
			ctx.beginPath();
			ctx.lineTo(0, pre_height * i);
			ctx.lineTo(4, pre_height * i);
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.font = "12px 微软雅黑";
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		ctx.fillText("中国人群患病概率", c_width / 9 * 2.5, c_height - 21 + 4);
		ctx.fillText("您的患病概率", c_width / 9 * 6, c_height - 21 + 4);
	}

	function drawcolumn(data) {
		$.each(data.xjgs, function(i) {
			if(data.xjgs[i].name == "中国人群患病概率") {
				return allnum = data.xjgs[i].num;
			}
			if(data.xjgs[i].name == "您的患病概率") {
				return cutnum = data.xjgs[i].num;
			}
		});

		ctx.beginPath();
		ctx.fillStyle = "#4EAC2E";
		ctx.fillRect(c_width / 9 * 2.5 - 25, 70, 50, c_height - 70 - 22);
		var beishu = cutnum / allnum;
		var h = (c_height - 70 - 21) * beishu;
		ctx.fillStyle = "#EF9F17";
		ctx.fillRect(c_width / 9 * 6 - 25, 70, 50, h);
		ctx.fill();
		ctx.beginPath();
		ctx.font = "16px 微软雅黑";
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		ctx.fillStyle = "#000000";
		ctx.fillText(allnum + "%", c_width / 9 * 2.5, 40);
		ctx.fillText(cutnum + "%", c_width / 9 * 6, 40);
	}
	drawcoordinate();
	drawcolumn(data1);
})