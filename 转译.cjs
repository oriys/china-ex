const levelsStyleText = `
#countrys>*[level="5"]{fill:#FF7E7E;}
#countrys>*[level="4"]{fill:#FFB57E;}
#countrys>*[level="3"]{fill:#FFE57E;}
#countrys>*[level="2"]{fill:#A8FFBE;}
#countrys>*[level="1"]{fill:#88AEFF;}
#countrys>*[level="w"]{fill:#edd1ff;}
`;

const replaceSVG = text=>{
    text = text.replace(/ transform="matrix\(1 0 0 1 (\d+)(?:\.\d+)? (\d+)(?:\.\d+)?\)" class="(.+)"/g,' x="$1" y="$2" class="$3"')
    text = text.replace(/<!--.+?-->/g,'')
    text = text.replace(/\n+/g,'\n')
    text = text.replace(/ xml:space="preserve"/g,'')
    text = text.replace(/ style="enable-background:new 0 0 \d+ \d+;?"/g,'')
    text = text.replace(/width="\d+px" height="\d+px"/g,'')
    text = text.replace(/ x="0px" y="0px"/g,'')
    text = text.replace(/ id="图层_1"/g,'')
    text = text.replace(/ version="1.1"/g,'')
    text = text.replace(/ xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/g,'')
    text = text.replace(/<rect y="0" class=".+?" width="2000" height="1210"\/?>/g,'')
    text = text.replace(/'Tensentype-JiaLiDaYuanJF'/g,'字体')

    text = text.replace(/<polygon id="(.+?)" class="(.+?)" points="([^"]+)\s{0,}"\/>/g,(all,id,c,p)=>{
        return `<path id="${id}" class="${c}" d="M${p.trim().replace(/[\n\r]/g,' ').replace(/\s+/g,' ')}z" />`
    });
    // <rect id="法国" x="1" y="10" class="st1" width="100" height="1000"/>
    // <path id="法国" class="st1" d="M1 10h100v1000H1Z" />
    text = text.replace(/<rect id="(.+?)" x="(\d+)" y="(\d+)" class="(.+?)" width="(\d+)" height="(\d+)"\/>/g,(all,id,x,y,c,w,h)=>{
        // console.log(x,y,w,h)
        return `<path id="${id}" class="${c}" d="M${x} ${y}h${w}v${h}H${x}Z" />`
    });
    
    text = text.replace(/<style type="text\/css">/,'<style></style><style>'+levelsStyleText)
    return text;
};
const ver = Math.floor(+new Date()/10000).toString(36);
const replaceVersion = text => text.replace(/\{version\}/g,ver);


const { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, rmSync } = require('fs');



const Less = require('less');

const 省代码们 = {
    北京: '11',
    天津: '12',
    河北: '13',
    山西: '14',
    内蒙古: '15',
    辽宁: '21',
    吉林: '22',
    黑龙江: '23',
    上海: '31',
    江苏: '32',
    浙江: '33',
    安徽: '34',
    福建: '35',
    江西: '36',
    山东: '37',
    河南: '41',
    湖北: '42',
    湖南: '43',
    广东: '44',
    广西: '45',
    海南: '46',
    重庆: '50',
    四川: '51',
    贵州: '52',
    云南: '53',
    西藏: '54',
    陕西: '61',
    甘肃: '62',
    青海: '63',
    宁夏: '64',
    新疆: '65',
    台湾: '71',
    香港: '81',
    澳门: '82'
};

const 省地图模块们 = {
    北京: 'beijing',
    天津: 'tianjin',
    河北: 'hebei',
    山西: 'shanxi',
    内蒙古: 'neimenggu',
    辽宁: 'liaoning',
    吉林: 'jilin',
    黑龙江: 'heilongjiang',
    上海: 'shanghai',
    江苏: 'jiangsu',
    浙江: 'zhejiang',
    安徽: 'anhui',
    福建: 'fujian',
    江西: 'jiangxi',
    山东: 'shandong',
    河南: 'henan',
    湖北: 'hubei',
    湖南: 'hunan',
    广东: 'guangdong',
    广西: 'guangxi',
    海南: 'hainan',
    重庆: 'chongqing',
    四川: 'sichuan',
    贵州: 'guizhou',
    云南: 'yunnan',
    西藏: 'xizang',
    陕西: 'shanxi1',
    甘肃: 'gansu',
    青海: 'qinghai',
    宁夏: 'ningxia',
    新疆: 'xinjiang',
    台湾: 'taiwan',
    香港: 'xianggang',
    澳门: 'aomen'
};

const 解码环 = (文本,偏移,缩放)=>{
    const 环 = [];
    let 上一个经度 = 偏移[0];
    let 上一个纬度 = 偏移[1];

    for(let 序号 = 0;序号 < 文本.length;序号 += 2){
        let 经度 = 文本.charCodeAt(序号) - 64;
        let 纬度 = 文本.charCodeAt(序号 + 1) - 64;
        经度 = (经度 >> 1) ^ (-(经度 & 1));
        纬度 = (纬度 >> 1) ^ (-(纬度 & 1));
        经度 += 上一个经度;
        纬度 += 上一个纬度;
        上一个经度 = 经度;
        上一个纬度 = 纬度;
        环.push([经度 / 缩放,纬度 / 缩放]);
    }

    return 环;
};

const 解码地图 = 地图=>{
    if(!地图.UTF8Encoding) return 地图;
    const 缩放 = 地图.UTF8Scale || 1024;

    地图.features.forEach(地区=>{
        const { geometry } = 地区;
        if(geometry.type === 'Polygon'){
            geometry.coordinates = geometry.coordinates.map((环,序号)=>
                解码环(环,geometry.encodeOffsets[序号],缩放)
            );
            return;
        }

        geometry.coordinates = geometry.coordinates.map((多边形,多边形序号)=>
            多边形.map((环,环序号)=>
                解码环(环,geometry.encodeOffsets[多边形序号][环序号],缩放)
            )
        );
    });
    地图.UTF8Encoding = false;
    return 地图;
};

const 取得环们 = geometry=>geometry.type === 'Polygon'
    ? geometry.coordinates
    : geometry.coordinates.flat();

const 简化标签 = 名称=>名称
    .replace(/(?:特别行政区|自治州|地区|林区|新区|市|区|县|盟)$/,'');

const 生成省城市地图 = 省份=>{
    const 模块名 = 省地图模块们[省份];
    const 地图 = 解码地图(require(`china-map-data/province/${模块名}`));
    const 有轮廓的地区们 = 地图.features.filter(地区=>地区.geometry.coordinates.length);
    const 所有点 = 有轮廓的地区们.flatMap(地区=>取得环们(地区.geometry).flat());
    const 最小经度 = Math.min(...所有点.map(点=>点[0]));
    const 最大经度 = Math.max(...所有点.map(点=>点[0]));
    const 最小纬度 = Math.min(...所有点.map(点=>点[1]));
    const 最大纬度 = Math.max(...所有点.map(点=>点[1]));
    const 经度比例 = Math.cos(((最小纬度 + 最大纬度) / 2) * Math.PI / 180);
    const 投影最小经度 = 最小经度 * 经度比例;
    const 投影最大经度 = 最大经度 * 经度比例;
    const 宽度 = 1000;
    const 高度 = 720;
    const 留白 = 30;
    const 比例 = Math.min(
        (宽度 - 留白 * 2) / (投影最大经度 - 投影最小经度),
        (高度 - 留白 * 2) / (最大纬度 - 最小纬度)
    );
    const 内容宽度 = (投影最大经度 - 投影最小经度) * 比例;
    const 内容高度 = (最大纬度 - 最小纬度) * 比例;
    const 左侧 = (宽度 - 内容宽度) / 2;
    const 顶部 = (高度 - 内容高度) / 2;
    const 变换点 = ([经度,纬度])=>[
        左侧 + (经度 * 经度比例 - 投影最小经度) * 比例,
        顶部 + (最大纬度 - 纬度) * 比例
    ];
    const 格式化 = 数字=>Math.round(数字 * 10) / 10;
    const 基础字号 = 有轮廓的地区们.length > 30 ? 15 : 有轮廓的地区们.length > 20 ? 18 : 有轮廓的地区们.length > 14 ? 21 : 25;

    return {
        regions: 有轮廓的地区们.map(地区=>{
            const 环们 = 取得环们(地区.geometry);
            const 路径 = 环们.map(环=>{
                const 变换后的环 = 环.map(变换点);
                const 简化后的环 = 变换后的环.filter((点,序号)=>{
                    if(序号 === 0 || 序号 === 变换后的环.length - 1) return true;
                    const 上一个点 = 变换后的环[序号 - 1];
                    return Math.hypot(点[0] - 上一个点[0],点[1] - 上一个点[1]) >= .7;
                });
                return 简化后的环.map((点,序号)=>
                    `${序号 ? 'L' : 'M'}${格式化(点[0])},${格式化(点[1])}`
                ).join('') + 'Z';
            }).join('');
            const 中心 = 变换点(地区.properties.cp || 环们[0][0]);
            const 标签 = 简化标签(地区.properties.name);

            return {
                name: 地区.properties.name,
                label: 标签,
                x: 格式化(中心[0]),
                y: 格式化(中心[1]),
                fontSize: Math.max(13,基础字号 - Math.max(0,标签.length - 5)),
                d: 路径
            };
        })
    };
};

const 生成城市地图数据 = 输出目录=>{
    const 城市地图数据 = Object.fromEntries(
        Object.keys(省代码们).map(省份=>[省份,生成省城市地图(省份)])
    );
    writeFileSync(
        `${输出目录}/城市地图数据.js`,
        `globalThis.城市地图数据=${JSON.stringify(城市地图数据)};`,
        'utf8'
    );
};


const reader = async _=>{

    let xml = readFileSync('china-ex.svg','utf8');

    xml = replaceSVG(xml);
    writeFileSync('china-ex-fixed.svg',xml);


    const 输出目录 = 'public/legacy';
    if(existsSync(输出目录)) rmSync(输出目录,{ recursive: true, force: true });
    mkdirSync(输出目录,{ recursive: true });

    let html = readFileSync('html/index.html','utf8');

    html = html.replace(/<!--svg-->/,xml.replace(/^<\?xml version="1.0" encoding="utf-8"\?>\n/,''));
    html = html.replace(/\n\s+viewBox=/,' viewBox=');
    html = html.replace(/\n\s{0,}\n/g,'\n');
    html = html.replace(/\s+"/g,'"');
    html = html.replace(/\s+\/>/g,'/>');
    html = html.replace(/(\d+)\s+([\dvV]+)/g,'$1 $2');

    html = html.replace(/<style[\s\S]+<\/style>/ig,all=>all.replace(/\n\s{0,}/g,''));
    html = replaceVersion(html);
    const { minify } = require('html-minifier');

    const options = {
        includeAutoGeneratedTags: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
        collapseWhitespace: true
    };

    html = minify(html,options);


    writeFileSync(`${输出目录}/index.html`,html,'utf8');
    const cssText = await Less.render(
        readFileSync('html/样式.less','utf8'),
        {
            optimization: 1,
            compress: true,
            yuicompress: false,
        }
    );
    writeFileSync(`${输出目录}/样式.css`,cssText.css,'utf8');
    copyFileSync('html/字体.woff',`${输出目录}/字体.woff`);
    copyFileSync('html/城市.js',`${输出目录}/城市.js`);
    生成城市地图数据(输出目录);
};

reader();
