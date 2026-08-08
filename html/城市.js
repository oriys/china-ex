(()=>{
    const 面板 = document.querySelector('#城市面板');
    const 遮罩 = document.querySelector('#城市遮罩');
    const 标题 = document.querySelector('#省份标题');
    const 状态 = document.querySelector('#省份状态');
    const 地图 = document.querySelector('#城市地图');
    const 关闭按钮 = document.querySelector('#关闭城市面板');
    const SVG命名空间 = 'http://www.w3.org/2000/svg';
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

    const 创建SVG元素 = 名称=>document.createElementNS(SVG命名空间,名称);

    const 绘制城市地图 = (省份,城市等级们)=>{
        const 地图数据 = globalThis.城市地图数据?.[省份];
        地图.setAttribute('aria-label',`${省份}城市地图`);
        地图.replaceChildren();

        if(!地图数据) return 0;

        const 地区层 = 创建SVG元素('g');
        const 地名层 = 创建SVG元素('g');
        地区层.setAttribute('class','城市地区');
        地名层.setAttribute('class','城市地名');

        地图数据.regions.forEach(地区=>{
            const 路径 = 创建SVG元素('path');
            const 城市等级 = 城市等级们[地区.name];
            路径.setAttribute('d',地区.d);
            路径.setAttribute('aria-label',`${地区.name}${城市等级 ? `，${状态名称[城市等级]}` : ''}`);
            if(城市等级) 路径.dataset.level = 城市等级;
            地区层.append(路径);

            const 文字 = 创建SVG元素('text');
            const 标签 = 地区.label;
            const 每行字数 = 标签.length > 6 ? Math.ceil(标签.length / 2) : 标签.length;
            const 行们 = 标签.length > 6
                ? [标签.slice(0,每行字数),标签.slice(每行字数)]
                : [标签];
            文字.setAttribute('x',地区.x);
            文字.setAttribute('y',地区.y);
            文字.style.fontSize = `${地区.fontSize}px`;
            行们.forEach((行,序号)=>{
                const 行文字 = 创建SVG元素('tspan');
                行文字.setAttribute('x',地区.x);
                行文字.setAttribute('dy',序号 === 0 && 行们.length > 1 ? '-.42em' : 序号 ? '1em' : '0');
                行文字.textContent = 行;
                文字.append(行文字);
            });
            地名层.append(文字);
        });

        地图.append(地区层,地名层);
        return 地图数据.regions.length;
    };

    const 关闭面板 = ()=>{
        面板.hidden = true;
        遮罩.hidden = true;
        document.body.removeAttribute('data-panel-open');
        上次触发元素?.focus();
    };

    const 打开面板 = 省份元素=>{
        const 省份 = 省份元素.id;
        const 城市等级们 = 城市足迹[省份] || {};
        const 等级 = 省份元素.getAttribute('level');

        上次触发元素 = 省份元素;
        标题.textContent = 省份;
        const 地区数量 = 绘制城市地图(省份,城市等级们);
        状态.textContent = `${状态名称[等级] || '未标记'} · ${地区数量}个地区`;
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
