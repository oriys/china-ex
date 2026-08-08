(()=>{
    const 面板 = document.querySelector('#城市面板');
    const 遮罩 = document.querySelector('#城市遮罩');
    const 标题 = document.querySelector('#省份标题');
    const 状态 = document.querySelector('#省份状态');
    const 列表 = document.querySelector('#城市列表');
    const 关闭按钮 = document.querySelector('#关闭城市面板');
    const 状态名称 = {
        5: '居住',
        4: '短居',
        3: '游玩',
        2: '出差',
        1: '路过'
    };
    const 城市足迹 = {
        上海: {
            黄浦区: 3,
            徐汇区: 3,
            长宁区: 3,
            静安区: 3,
            普陀区: 3,
            虹口区: 3,
            杨浦区: 3
        },
        江苏: {
            南京市: 3,
            无锡市: 3,
            常州市: 3,
            苏州市: 3
        },
        浙江: {
            杭州市: 5,
            宁波市: 5,
            嘉兴市: 3,
            湖州市: 3,
            绍兴市: 3,
            舟山市: 3,
            台州市: 3
        },
        福建: {
            福州市: 3,
            厦门市: 3,
            泉州市: 3
        },
        广东: {
            广州市: 3,
            深圳市: 3
        }
    };
    let 上次触发元素 = null;

    const 关闭面板 = ()=>{
        面板.hidden = true;
        遮罩.hidden = true;
        document.body.removeAttribute('data-panel-open');
        上次触发元素?.focus();
    };

    const 打开面板 = 省份元素=>{
        const 省份 = 省份元素.id;
        const 城市们 = globalThis.城市数据?.[省份] || [];
        const 城市等级们 = 城市足迹[省份] || {};
        const 等级 = 省份元素.getAttribute('level');
        const 列数 = Math.min(8,Math.max(2,Math.ceil(Math.sqrt(城市们.length * 1.35))));
        const 移动列数 = Math.min(4,Math.max(2,Math.ceil(Math.sqrt(城市们.length))));

        上次触发元素 = 省份元素;
        标题.textContent = 省份;
        状态.textContent = `${状态名称[等级] || '未标记'} · ${城市们.length}个地区`;
        列表.setAttribute('aria-label',`${省份}城市地图`);
        列表.style.setProperty('--城市列数',列数);
        列表.style.setProperty('--城市移动列数',移动列数);
        列表.replaceChildren(...城市们.map(城市=>{
            const 项目 = document.createElement('li');
            const 名称 = document.createElement('span');
            const 城市等级 = 城市等级们[城市];
            名称.textContent = 城市;
            项目.append(名称);
            if(城市等级){
                项目.dataset.level = 城市等级;
                const 标记 = document.createElement('span');
                标记.className = '城市标记';
                标记.textContent = 状态名称[城市等级];
                项目.append(标记);
            }
            return 项目;
        }));
        面板.hidden = false;
        遮罩.hidden = false;
        document.body.setAttribute('data-panel-open','');
        关闭按钮.focus();
    };

    document.querySelectorAll('#地区 path').forEach(省份元素=>{
        省份元素.setAttribute('tabindex','0');
        省份元素.setAttribute('role','button');
        省份元素.setAttribute('aria-haspopup','dialog');
        省份元素.setAttribute('aria-label',`查看${省份元素.id}的城市`);
        省份元素.addEventListener('click',()=>打开面板(省份元素));
        省份元素.addEventListener('keydown',事件=>{
            if(事件.key !== 'Enter' && 事件.key !== ' ') return;
            事件.preventDefault();
            打开面板(省份元素);
        });
    });

    关闭按钮.addEventListener('click',关闭面板);
    遮罩.addEventListener('click',关闭面板);
    document.addEventListener('keydown',事件=>{
        if(事件.key === 'Escape' && !面板.hidden) 关闭面板();
    });
})();
