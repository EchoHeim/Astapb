document.addEventListener('DOMContentLoaded', function () {
	var QRBox	=	document.getElementById('QRBox');
	var MainBox	=	document.getElementById('MainBox');
	var BTCQR	=	'images/BTCQR.png';	// 二维码路径
	var AliPayQR	=	'images/AliPayQR.png';
	var WeChanQR	=	'images/WeChanSQ.png';

	function setBlur(active) {
		var nodes = document.querySelectorAll('#DonateText,#donateBox,#github');
		nodes.forEach(function (el) {
			if (active) {
				el.classList.add('blur');
			} else {
				el.classList.remove('blur');
			}
		});
	}

	function showQR(QR) {
		if (!QRBox || !MainBox) return;
		if (QR) {
			MainBox.style.backgroundImage = 'url(' + QR + ')';
		}
		setBlur(true);
		QRBox.style.display = 'block';
		// 简单模拟 jQuery 的 fadeIn + 回调时机
		setTimeout(function () {
			MainBox.classList.add('showQR');
		}, 300);
	}

	var donateItems = document.querySelectorAll('#donateBox > li');
	donateItems.forEach(function (item) {
		item.addEventListener('click', function () {
			var thisID = item.id;
			if (thisID === 'BTC') {
				showQR(BTCQR);
				// 保持 clipboard.js 的用法不变
				new Clipboard('#BTCBn');
			} else if (thisID === 'AliPay') {
				showQR(AliPayQR);
			} else if (thisID === 'WeChat') {
				showQR(WeChanQR);
			}
		});
	});

	if (MainBox) {
		MainBox.addEventListener('click', function () {
			MainBox.classList.remove('showQR');
			MainBox.classList.add('hideQR');
			setTimeout(function () {
				if (QRBox) {
					QRBox.style.display = 'none';
				}
				MainBox.classList.remove('hideQR');
				setBlur(false);
			}, 600);
		});
	}
});