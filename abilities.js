const abilities = [

{
    id:1,

    name:"おとこオーラ",
    kana:"おとこおーら",
    type:"専用",
    category:"防御",
    effect: `
物理攻撃(接触技)を受けた時のみ発動する。<br>
攻撃者に18の固定ダメージを与える。
`
},

{
    id:2,

    name:"は？どっかいけよ",
    kana:"は？どっかいけよ",
    type:"専用",
    category:"補助",
    effect: `
自身の攻撃が命中した時に発動する。<br>
相手の速度を1段階下げる。
`
},

{
    id:3,

    name:"は？やぶさおとこ",
    kana:"は？やぶさおとこ",
    type:"専用",
    category:"攻撃",
    effect: `
場に出た時に1回だけ発動する。<br>
相手全体へ15の固定ダメージを与える。
`
},

{
    id:4,

    name:"雷の力",
    kana:"かみなりのちから",
    type:"専用",
    category:"攻撃",
    effect:`
雷属性の技が大地属性の相手にも命中する。
`
},

{
    id:5,

    name:"会心の満月",
    kana:"かいしんのまんげつ",
    type:"専用",
    category:"攻撃",
    effect: `
月技が40%の確率で会心になる。
`
},

{
    id:6,

    name:"レインボルト",
    kana:"れいんぼると",
    type:"専用",
    damage: true,
    category:"攻撃",
    effect: `
虹技と雷技の威力が1.2倍になる。
`
},

{
    id: 7,
    name: "ファイアノード",
    kana: "ふぁいあのーど",
    type: "専用",
    category: "防御",
    effect: "弱点のダメージを0.7倍にする。"
},

{
    id:8,

    name:"ブラッドデビル",
    kana:"ぶらっどでびる",
    type:"専用",
    category:"補助",
    effect:`
場に出た時に発動する。<br>
相手全員の攻撃を1段階下げ、出血状態にする。
`
},

{
    id:11,

    name:"絶対的忠誠心",
    kana:"ぜったいてきちゅうせいしん",
    type:"専用",
    category:"攻撃",
    effect:`
東葉が味方にいる場合、自身と東葉の全ての技の威力が1.5倍になる。<br>
ただし、東葉が相手にいる場合、東葉に与えるダメージが半分になる。
`
},

{
    id:13,

    name:"クリスタルブレード",
    kana:"くりすたるぶれーど",
    type:"専用",
    damage: true,
    category:"攻撃",
    effect:`
物理技の威力が1.2倍になり、
40%の確率で相手を出血状態にする。
`
},

{
    id:101,
    name:"悪戯心",
    kana:"いたずらごころ",
    type:"共通",
    category:"補助",
    effect:`
自身が使う変化技の優先度＋1。
`
},

{
    id:102,
    name:"エレキスキン",
    kana:"えれきすきん",
    type:"共通",
    damage: true,
    category:"攻撃",
    effect:`
自身の無属性の技が雷属性になり、威力が1.2倍になる。
`
},

{
    id:103,
    name:"影踏み",
    kana:"かげふみ",
    type:"共通",
    category:"補助",
    effect:`
相手は交代が出来ない。<br>
相手がゴースト属性や特性「影踏み」の場合は無効。<br>
交代技は交代できる。
`
},

{
    id:104,
    name:"加速",
    kana:"かそく",
    type:"共通",
    category:"補助",
    effect:`
毎ターン速度が1段階上がる。
`
},

{
    id:105,
    name:"貫通",
    kana:"かんつう",
    type:"共通",
    category:"攻撃",
    effect:`
相手の特性の影響を受けずに攻撃できる。<br>
ただし、攻撃後に受ける効果は消えない。
`
},

{
    id:106,
    name:"斬れ味",
    kana:"きれあじ",
    type:"共通",
    damage: true,
    category:"攻撃",
    effect:`
物理攻撃の威力が1.3倍になる。
`
},

{
    id:107,
    name:"クリアアーマー",
    kana:"くりああーまー",
    type:"共通",
    category:"防御",
    effect:`
相手の能力ランクを下げる技や特性の効果を受けない。
`
},

{
    id:108,
    name:"激減",
    kana:"げきげん",
    type:"共通",
    category:"防御",
    effect:`
相手の能力変化の影響を受けない。
`
},

{
    id:109,
    name:"再生力",
    kana:"さいせいりょく",
    type:"共通",
    category:"防御",
    effect:`
交代した時、HPが最大HPの1/3回復する。
`
},

{
    id:110,
    name:"持久力",
    kana:"じきゅうりょく",
    type:"共通",
    damage: true,
    category:"防御",
    effect:`
技のダメージを受けると、防御が1段階上がる。
`
},

{
    id:111,
    name:"スカイスキン",
    kana:"すかいすきん",
    type:"共通",
    damage: true,
    category:"攻撃",
    effect:`
自身の無属性の技が風属性になり、威力が1.2倍になる。
`
},

{
    id:112,
    name:"すり抜け",
    kana:"すりぬけ",
    type:"共通",
    category:"補助",
    effect:`
相手のオーロラベール、光の壁、リフレクター、身代わりの効果を受けない。
`
},

{
    id:113,
    name:"貯水",
    kana:"ちょすい",
    type:"共通",
    category:"防御",
    effect:`
水属性の技を受けるとダメージや効果は無くなり、最大HPの1/4回復する。
`
},

{
    id:114,
    name:"テクニシャン",
    kana:"てくにしゃん",
    type:"共通",
    damage: true,
    category:"攻撃",
    effect:`
威力が60以下の技の威力が1.5倍になる。
`
},

{
    id:115,
    name:"棘の鎧",
    kana:"とげのよろい",
    type:"共通",
    category:"防御",
    effect:`
接触技を受けると、相手のHPを最大HPの1/8減らす。
`
},

{
    id:116,
    name:"浮遊",
    kana:"ふゆう",
    type:"共通",
    damage: true,
    category:"防御",
    effect:`
大地属性の技を受けない。
`
},

{
    id:117,
    name:"フリーズスキン",
    kana:"ふりーずすきん",
    type:"共通",
    damage: true,
    category:"攻撃",
    effect:`
自身の無属性の技が氷属性になり、威力が1.2倍になる。
`
},

{
    id:118,
    name:"マジックガード",
    kana:"まじっくがーど",
    type:"共通",
    category:"防御",
    effect:`
技のダメージ以外を受けない。<br>
自滅技などには影響しない。
`
},

{
    id:119,
    name:"マルチアーマー",
    kana:"まるちあーまー",
    type:"共通",
    damage: true,
    category:"防御",
    effect:`
自身の残りHPが最大値の時、受けるダメージが半減される。
`
},

{
    id:120,
    name:"メタルアーマー",
    kana:"めたるあーまー",
    type:"共通",
    category:"防御",
    effect:`
自身への攻撃は会心にならない。
`
}

];