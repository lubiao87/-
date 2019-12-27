const JiLou = [
  {
    modelName: "工业园机楼", // 机楼名称
    modelId: 1234, // id
    iconLocation: [
      // 综合接入间
      {
        location: ["113.377468854055", "23.114265554063"], // 接入间经纬度
        name: "美林花园远端机房"
      },
      {
        location: ["113.386872581306", "23.1477018208333"], // 接入间经纬度
        name: "棠下荷光路远端机房"
      },
      {
        location: ["113.35224653287395", "23.115129095177218"], // 接入间经纬度
        name: "百合苑接入网机房"
      },
      {
        location: ["113.345509061595", " 23.1469763309438"], // 接入间经纬度
        name: "职业技术师范接入网机房"
      }
    ],
    model5GBBU: [], // 5GBBU
    modelOther: [], // 其它机楼
    modeLocation: ["113.366016977858", "23.1274220838625"], // 机楼经纬度
    modelType: 2 // 类型： 1为接入间 2为机楼 3 楼层
  },
  {
    modelName: "青云机楼",
    modelId: 1234, // id
    iconLocation: [],
    modeLocation: ["113.579681238758", "23.5409091642032"],
    modelType: 2
  },
  {
    modelName: "大岗机楼",
    iconLocation: [
      {
        name: "棠下解困小区远端机房",
        location: ["113.377603832452", "23.1352856125418"]
      }
    ],
    modeLocation: ["113.40083225568", "22.8025218558178"],
    modelType: 2
  },
  {
    modelName: "荔城1机楼",
    iconLocation: [],
    modeLocation: ["113.830949516789", "23.2906952874569"],
    modelType: 2
  },
  {
    modelName: "新街机楼",
    iconLocation: [],
    modeLocation: ["113.191544244205", "23.3772507477905"],
    modelType: 2
  },
  {
    modelName: "大石机楼",
    iconLocation: [],
    modeLocation: ["113.313676378496", "23.0298473509556"],
    modelType: 2
  },
  {
    modelName: "东涌机楼",
    iconLocation: [],
    modeLocation: ["113.449101157069", "22.8884343653125"],
    modelType: 2
  },
  {
    modelName: "金洲机楼",
    iconLocation: [],
    modeLocation: ["113.534880146617", "22.799662636603"],
    modelType: 2
  },
  {
    modelName: "洛溪机楼",
    iconLocation: [],
    modeLocation: ["113.294934554777", "23.0448418380042"],
    modelType: 2
  },
  {
    modelName: "南村机楼",
    iconLocation: [],
    modeLocation: ["113.387651694508", "23.0059124095889"],
    modelType: 2
  },
  {
    modelName: "沙湾机楼",
    iconLocation: [],
    modeLocation: ["113.340020995373", "22.9087718376512"],
    modelType: 2
  },
  {
    modelName: "石基机楼",
    iconLocation: [],
    modeLocation: ["113.43089386113", "22.9555904621901"],
    modelType: 2
  },
  {
    modelName: "石楼机楼",
    iconLocation: [],
    modeLocation: ["113.480928273369", "22.9622116377878"],
    modelType: 2
  },
  {
    modelName: "荔城2机楼",
    iconLocation: [],
    modeLocation: ["113.822395828206", "23.2877681765868"],
    modelType: 2
  },
  {
    modelName: "市桥北城机楼",
    iconLocation: [],
    modeLocation: ["113.353336759648", "22.9525827055048"],
    modelType: 2
  },
  {
    modelName: "市桥东城机楼",
    iconLocation: [],
    modeLocation: ["113.372665332314", "22.9372857286179"],
    modelType: 2
  },
  {
    modelName: "市桥南城机楼",
    iconLocation: [],
    modeLocation: ["113.359637577159", "22.9369643785506"],
    modelType: 2
  },
  {
    modelName: "万顷沙机楼",
    iconLocation: [],
    modeLocation: ["113.544955511234", "22.7108461309779"],
    modelType: 2
  },
  {
    modelName: "钟村机楼",
    iconLocation: [],
    modeLocation: ["113.31459669402", "22.9812953766368"],
    modelType: 2
  },
  {
    modelName: "新华机楼",
    iconLocation: [],
    modeLocation: ["113.207801824893", "23.3801806773837"],
    modelType: 2
  },
  {
    modelName: "江埔机楼",
    iconLocation: [],
    modeLocation: ["113.601800610504", "23.5334753206999"],
    modelType: 2
  },
  {
    modelName: "新都机楼",
    iconLocation: [],
    modeLocation: ["113.196575769013", "23.4031489945134"],
    modelType: 2
  },
  {
    modelName: "横沥2远端机房",
    iconLocation: [],
    modeLocation: ["113.492274447926", "22.7508688141883"],
    modelType: 2
  },
  {
    modelName: "狮岭机楼",
    iconLocation: [],
    modeLocation: ["113.148738899118", "23.4636449292284"],
    modelType: 2
  },
  {
    modelName: "花东机楼",
    iconLocation: [],
    modeLocation: ["113.319910161989", "23.439032781381"],
    modelType: 2
  },
  {
    modelName: "化龙新局远端机房1",
    iconLocation: [],
    modeLocation: ["113.46093 ", "23.03086 "],
    modelType: 2
  },
  {
    modelName: "炭步机楼",
    iconLocation: [],
    modeLocation: ["113.100435432984", "23.3370833760147"],
    modelType: 2
  },
  {
    modelName: "赤坭机楼",
    iconLocation: [
      {
        location: ["113.062194036127", "23.2592018599787"],
        name: "文岗村接入网机房"
      },
      {
        location: ["113.070178532914", "23.4414901309656"],
        name: "瑞岭村接入网机房"
      },
      {
        location: ["113.076640750871", "23.4724360247037"],
        name: "花都碧桂园接入网机房"
      },
      {
        location: ["113.086376629679", "23.4124907730316"],
        name: "培正商学院接入网机房"
      },
      {
        location: ["113.091310831131", "23.370640041006"],
        name: "广州花都珠江轮胎厂远端机房"
      },
      {
        location: ["113.099161093311", "23.3178317695214"],
        name: "茶塘村远端机房"
      }
    ],
    modeLocation: ["113.077061455655", "23.386938013166"],
    modelType: 2
  },
  {
    modelName: "黄阁新局远端机房1",
    iconLocation: [],
    modeLocation: ["113.507626512954", "22.8255037304042"],
    modelType: 2
  },
  {
    modelName: "榄核远端机房1",
    iconLocation: [],
    modeLocation: ["113.333259995406", "22.8396974547342"],
    modelType: 2
  },
  {
    modelName: "福和机楼",
    iconLocation: [],
    modeLocation: ["113.630801660945", "23.3566438046483"],
    modelType: 2
  },
  {
    modelName: "神岗机楼",
    iconLocation: [],
    modeLocation: ["113.528156168142", "23.4925483074673"],
    modelType: 2
  },
  {
    modelName: "温泉机楼",
    iconLocation: [],
    modeLocation: ["113.652419923163", "23.6444805801455"],
    modelType: 2
  },
  {
    modelName: "云星远端机房",
    iconLocation: [],
    modeLocation: ["113.62709612155", "23.6182741658251"],
    modelType: 2
  },
  {
    modelName: "灌村机楼",
    iconLocation: [],
    modeLocation: ["113.706524389246", "23.5838858088288"],
    modelType: 2
  },
  {
    modelName: "东明机楼",
    iconLocation: [],
    modeLocation: ["113.869628278424", "23.8948380945255"],
    modelType: 2
  },
  {
    modelName: "良口机楼",
    iconLocation: [],
    modeLocation: ["113.730354231153", "23.7196950170441"],
    modelType: 2
  },
  {
    modelName: "宁西机楼",
    iconLocation: [],
    modeLocation: ["113.654273909803", "23.2222905572254"],
    modelType: 2
  },
  {
    modelName: "派潭机楼",
    iconLocation: [],
    modeLocation: ["113.776579814962", "23.4907345801742"],
    modelType: 2
  },
  {
    modelName: "三江机楼",
    iconLocation: [],
    modeLocation: ["113.857250075124", "23.1883119651019"],
    modelType: 2
  },
  {
    modelName: "吕田机楼",
    iconLocation: [],
    modeLocation: ["113.945869041863", "23.8119620582121"],
    modelType: 2
  },
  {
    modelName: "沙埔机楼",
    iconLocation: [],
    modeLocation: ["113.656447321824", "23.1613136011562"],
    modelType: 2
  },
  {
    modelName: "石滩机楼",
    iconLocation: [],
    modeLocation: ["113.790509634816", "23.1753139377989"],
    modelType: 2
  },
  {
    modelName: "三江沙庄机楼",
    iconLocation: [],
    modeLocation: ["113.816945026087", "23.1365401375522"],
    modelType: 2
  },
  {
    modelName: "鳌头机楼",
    iconLocation: [],
    modeLocation: ["113.42159626991", "23.6198951926465"],
    modelType: 2
  },
  {
    modelName: "仙村机楼",
    iconLocation: [],
    modeLocation: ["113.712303517451", "23.1794840662287"],
    modelType: 2
  },
  {
    modelName: "鹭江机楼",
    iconLocation: [],
    modeLocation: ["113.300799211289", "23.0974545083542"],
    modelType: 2
  },
  {
    modelName: "五羊机楼",
    iconLocation: [],
    modeLocation: ["113.309214579526", "23.1215709732335"],
    modelType: 2
  },
  {
    modelName: "北京路机楼",
    iconLocation: [],
    modeLocation: ["113.26293700695", "23.1275574748982"],
    modelType: 2
  },
  {
    modelName: "广园机楼",
    iconLocation: [],
    modeLocation: ["113.2588905707", "23.1631942137906"],
    modelType: 2
  },
  {
    modelName: "沙河机楼",
    iconLocation: [],
    modeLocation: ["113.318247631221", "23.1668891037351"],
    modelType: 2
  },
  {
    modelName: "东圃机楼",
    iconLocation: [],
    modeLocation: ["113.397066790398", "23.1262448064755"],
    modelType: 2
  },
  {
    modelName: "槎龙机楼",
    iconLocation: [],
    modeLocation: ["113.220571369841", "23.1754895477239"],
    modelType: 2
  },
  {
    modelName: "石井机楼",
    iconLocation: [],
    modeLocation: ["113.228914359268", "23.2070672776627"],
    modelType: 2
  },
  {
    modelName: "新市机楼",
    iconLocation: [],
    modeLocation: ["113.253088508792", "23.1884384542777"],
    modelType: 2
  },
  {
    modelName: "汇侨机楼",
    iconLocation: [],
    modeLocation: ["113.253549620509", "23.2002157632738"],
    modelType: 2
  },
  {
    modelName: "西华机楼",
    iconLocation: [],
    modeLocation: ["113.244095244852", "23.1339103884079"],
    modelType: 2
  },
  {
    modelName: "观绿机楼",
    iconLocation: [],
    modeLocation: ["113.24818118014", "23.1214301091517"],
    modelType: 2
  },
  {
    modelName: "荔枝湾机楼",
    iconLocation: [],
    modeLocation: ["113.228948766471", "23.1277350411807"],
    modelType: 2
  },
  {
    modelName: "淘金机楼",
    iconLocation: [],
    modeLocation: ["113.279778246568", "23.1469971902575"],
    modelType: 2
  },
  {
    modelName: "花地机楼",
    iconLocation: [],
    modeLocation: ["113.229650379432", "23.0839844338088"],
    modelType: 2
  },
  {
    modelName: "芳村机楼",
    iconLocation: [],
    modeLocation: ["113.232654269309", "23.10085492864"],
    modelType: 2
  },
  {
    modelName: "宝岗机楼",
    iconLocation: [],
    modeLocation: ["113.259682931142", "23.1011571442131"],
    modelType: 2
  },
  {
    modelName: "大沙东机楼",
    iconLocation: [],
    modeLocation: ["113.451864294394", "23.108291882949"],
    modelType: 2
  },
  {
    modelName: "人和机楼",
    iconLocation: [],
    modeLocation: ["113.293783464267", "23.332282780761"],
    modelType: 2
  },
  {
    modelName: "江村机楼",
    iconLocation: [
      {
        location: ["113.225772731228", "23.4053855533015"],
        name: "南航花园接入网机房"
      },
      {
        location: ["113.225710927119", "23.1635179440987"],
        name: "岭南花园接入网机房"
      },
      {
        location: ["113.228370418461", "23.2586382224769"],
        name: "驿迅物流接入网机房"
      }
    ],
    modeLocation: ["113.2266314506", "23.2777316928436"],
    modelType: 2
  },
  {
    modelName: "克山机楼",
    iconLocation: [],
    modeLocation: ["113.241687222271", "23.1507193675631"],
    modelType: 2
  },
  {
    modelName: "新港机楼",
    iconLocation: [],
    modeLocation: ["113.520933824758", "23.0650753873621"],
    modelType: 2
  },
  {
    modelName: "新机场机楼",
    iconLocation: [],
    modeLocation: ["113.296988871003", "23.3760298753955"],
    modelType: 2
  },
  {
    modelName: "广州番禺东涌（德昇）数据中心",
    iconLocation: [],
    modeLocation: ["113.42394", "22.896573"],
    modelType: 2
  },
  {
    modelName: "广州永顺（腾讯定制）数据中心",
    iconLocation: [],
    modeLocation: ["113.532977", "23.214335"],
    modelType: 2
  },
  {
    modelName: "广州南沙云谷（百度定制）数据中心（一期）",
    iconLocation: [],
    modeLocation: ["113.526514", "22.725144"],
    modelType: 2
  },
  {
    modelName: "中国电信广州莲花山数据中心",
    iconLocation: [],
    modeLocation: ["113.483263", "22.985223"],
    modelType: 2
  },
  {
    modelName: "广州番禺化龙（中鼎）数据中心",
    iconLocation: [],
    modeLocation: ["113.467007", "23.02233"],
    modelType: 2
  },
  {
    modelName: "中国电信广州起云数据中心",
    iconLocation: [],
    modeLocation: ["113.42760", "23.16764"],
    modelType: 2
  }
];

export default JiLou;
