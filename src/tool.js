/*! Eretek Online Araçlar #82 — UPS Yük ve Çalışma Süresi */
ERT.def('82', {
	run: function (v, c) {
		var ratedW = v.w || (v.va && v.pf ? v.va * v.pf : null);
		if (!ratedW) { throw c.fe('w', 'needW'); }
		var load = v.load, pct = load / ratedW, msgs = [], kv = [[c.t('rated'), c.n(ratedW, 0) + ' W'], [c.t('loadP'), c.pct(pct, 0)]], vv = { loadPct: Math.round(pct * 1000) / 10 };
		if (v.va) { var va = load / (v.lpf || 0.9); kv.push([c.t('va'), c.n(va, 0) + ' VA / ' + c.n(v.va, 0) + ' VA (' + c.pct(va / v.va, 0) + ')']); if (va > v.va) { msgs.push(['err', c.t('vaOver')]); } }
		msgs.push(pct > 1 ? ['err', c.t('over')] : (pct > 0.8 ? ['warn', c.t('high')] : ['ok', c.t('ok')]));
		if (v.bv && v.ah) {
			var wh = v.bv * v.ah * (v.strings || 1), eff = (v.eff || 90) / 100, dod = (v.dod || 80) / 100, t = wh * eff * dod / load;
			vv.minutes = Math.round(t * 60 * 10) / 10; vv.wh = wh; var tsec = t * 3600;
			kv.push([c.t('wh'), c.n(wh, 0) + ' Wh'], [c.t('rt'), c.dur(t * 3600)]);
			if (v.need) { msgs.push(t * 60 >= v.need ? ['ok', c.t('needOk', { m: v.need })] : ['err', c.t('needNo', { m: v.need })]); }
			msgs.push(['info', c.t('peukert')]);
			if (pct < 0.25) { msgs.push(['info', c.t('lowLoad')]); }
		}
		msgs.push(['info', c.t('chart')]);
		return { big: vv.minutes !== undefined ? c.t('big', { p: c.pct(pct, 0), t: c.dur(Math.round(vv.minutes * 60 / 10) * 10) }) : c.pct(pct, 0), kv: kv, msgs: msgs, x: { copy: kv.map(function (k) { return k[0] + ': ' + k[1]; }).join('\n') }, v: vv };
	}
});
