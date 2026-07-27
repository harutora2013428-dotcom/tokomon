const items = [

{
id:1,
name:"拘りステッキ",
kana:"こだわりすてっき",
type:"共通",
category:"攻撃",
effect:"同じ技しか出せなくなるが、特攻が1.5倍。"
},

{
id:2,
name:"拘りソード",
kana:"こだわりそーど",
type:"共通",
category:"攻撃",
effect:"同じ技しか出せなくなるが、攻撃が1.5倍。"
},

{
id:3,
name:"拘りスカーフ",
kana:"こだわりすかーふ",
type:"共通",
category:"攻撃",
effect:"同じ技しか出せなくなるが、速度が1.5倍。"
},

{
id:4,
name:"命のお守り",
kana:"いのちのおまもり",
type:"共通",
category:"防御",
effect:"HPが最大の時、死亡するダメージを受けると必ずHP1で耐える。1度使用すると効果がなくなる。"
},

{
id:5,
name:"隠密マント",
kana:"おんみつまんと",
type:"共通",
category:"防御",
effect:"技の追加効果を受けない。"
},

{
id:6,
name:"命の珠",
kana:"いのちのたま",
type:"共通",
category:"攻撃",
effect:"技のダメージが1.3倍になるが、攻撃後に自身のHPが最大HPの1/10だけ減る。"
},

{
id:7,
name:"再生の雫",
kana:"さいせいのしずく",
type:"共通",
category:"防御",
effect:"毎ターンHPが最大HPの1/16ずつ回復する。"
},

{
id:8,
name:"弱点保険",
kana:"じゃくてんほけん",
type:"共通",
category:"防御",
effect:"弱点攻撃を受けると攻撃、特攻が2段階上昇する。1度使用すると効果がなくなる。"
},

{
id:9,
name:"イカサマダイス",
kana:"いかさまだいす",
type:"共通",
category:"攻撃",
effect:"連続攻撃技の攻撃回数が必ず4回以上になる。"
},

{
id:10,
name:"厚底ブーツ",
kana:"あつぞこぶーつ",
type:"共通",
category:"防御",
effect:"罠を足場に仕掛ける技の影響を受けなくなる。"
},

{
id:11,
name:"風船",
kana:"ふうせん",
type:"共通",
category:"防御",
effect:"大地属性の技が当たらなくなる。ただし、攻撃を受けると効果がなくなる。"
},

{
id:12,
name:"ゴツゴツメット",
kana:"ごつごつめっと",
type:"共通",
category:"防御",
effect:"接触技を受けた時、相手の最大HPの1/6のダメージを与える。"
},

{
id:13,
name:"突撃チョッキ",
kana:"とつげきちょっき",
type:"共通",
category:"攻撃",
effect:"特防が1.5倍になるが、変化技を出せなくなる。"
},

{
id:14,
name:"緊急治癒薬",
kana:"きんきゅうちゆやく",
type:"共通",
category:"防御",
effect:"HPが半分以下になった時、自身のHPが最大HPの1/4回復する。1度使用すると効果がなくなる。"
},

{
id:101,
name:"無Z",
kana:"ノーマルぜっと",
type:"共通",
category:"Zクリスタル",
effect:"無属性の技をZ技に変化させる。"
},

{
id:102,
name:"炎Z",
kana:"ほのおぜっと",
type:"共通",
category:"Zクリスタル",
effect:"炎属性の技をZ技に変化させる。"
},

{
id:103,
name:"雷Z",
kana:"かみなりぜっと",
type:"共通",
category:"Zクリスタル",
effect:"雷属性の技をZ技に変化させる。"
},

{
id:104,
name:"水Z",
kana:"みずぜっと",
type:"共通",
category:"Zクリスタル",
effect:"水属性の技をZ技に変化させる。"
},

{
id:105,
name:"風Z",
kana:"かぜぜっと",
type:"共通",
category:"Zクリスタル",
effect:"風属性の技をZ技に変化させる。"
},

{
id:106,
name:"ブラッドZ",
kana:"ぶらっどぜっと",
type:"共通",
category:"Zクリスタル",
effect:"ブラッド属性の技をZ技に変化させる。"
},

{
id:107,
name:"氷Z",
kana:"こおりぜっと",
type:"共通",
category:"Zクリスタル",
effect:"氷属性の技をZ技に変化させる。"
},

{
id:108,
name:"月Z",
kana:"つきぜっと",
type:"共通",
category:"Zクリスタル",
effect:"月属性の技をZ技に変化させる。"
},

{
id:109,
name:"ゴーストZ",
kana:"ごーすとぜっと",
type:"共通",
category:"Zクリスタル",
effect:"ゴースト属性の技をZ技に変化させる。"
},

{
id:110,
name:"聖Z",
kana:"せいぜっと",
type:"共通",
category:"Zクリスタル",
effect:"聖属性の技をZ技に変化させる。"
},

{
id:111,
name:"闇Z",
kana:"やみぜっと",
type:"共通",
category:"Zクリスタル",
effect:"闇属性の技をZ技に変化させる。"
},

{
id:112,
name:"鋼Z",
kana:"はがねぜっと",
type:"共通",
category:"Zクリスタル",
effect:"鋼属性の技をZ技に変化させる。"
},

{
id:113,
name:"毒Z",
kana:"どくぜっと",
type:"共通",
category:"Zクリスタル",
effect:"毒属性の技をZ技に変化させる。"
},

{
id:114,
name:"大地Z",
kana:"だいちぜっと",
type:"共通",
category:"Zクリスタル",
effect:"大地属性の技をZ技に変化させる。"
},

{
id:115,
name:"おとこZ",
kana:"おとこぜっと",
type:"専用",
category:"Zクリスタル",
effect:"おとこ専用。はやぶ三連撃がZ技に変化する。"
}

];