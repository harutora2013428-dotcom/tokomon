const items = [

{
id:1,
name:"拘りステッキ",
kana:"こだわりすてっき",
type:"共通",
damage: true,
category:"攻撃",
condition:{
    special:true
},
effect:"同じ技しか出せなくなるが、特攻が1.5倍になる。"
},

{
id:2,
name:"拘りソード",
kana:"こだわりそーど",
type:"共通",
damage: true,
category:"攻撃",
condition:{
    physical:true
},
effect:"同じ技しか出せなくなるが、攻撃が1.5倍になる。"
},

{
id:3,
name:"拘りスカーフ",
kana:"こだわりすかーふ",
type:"共通",
category:"攻撃",
effect:"同じ技しか出せなくなるが、速度が1.3倍になる。"
},

{
id:4,
name:"命のお守り",
kana:"いのちのおまもり",
type:"共通",
damage: true,
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
damage: true,
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
condition:{
    multiHit:true
},
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
damage: true,
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
damage: true,
category:"防御",
condition:{
    attackOnly:true
},
effect:"特防が1.5倍になるが、変化技を出せなくなる。"
},

{
id:14,
name:"緊急治癒薬",
kana:"きんきゅうちゆやく",
type:"共通",
damage: true,
category:"防御",
effect:"HPが半分以下になった時、自身のHPが最大HPの1/4回復する。1度使用すると効果がなくなる。"
},

{
id:15,
name:"聖なる結界",
kana:"せいなるけっかい",
type:"共通",
category:"防御",
effect:"状態異常や『混乱』になった時に治る。出血は治らない。1度使用すると効果がなくなる。"
},

{
id:101,
name:"無Z",
kana:"ノーマルぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"無"
},
effect:"無属性の技をZ技に変化させる。"
},

{
id:102,
name:"炎Z",
kana:"ほのおぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"炎"
},
effect:"炎属性の技をZ技に変化させる。"
},

{
id:103,
name:"雷Z",
kana:"かみなりぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"雷"
},
effect:"雷属性の技をZ技に変化させる。"
},

{
id:104,
name:"水Z",
kana:"みずぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"水"
},
effect:"水属性の技をZ技に変化させる。"
},

{
id:105,
name:"風Z",
kana:"かぜぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"風"
},
effect:"風属性の技をZ技に変化させる。"
},

{
id:106,
name:"ブラッドZ",
kana:"ぶらっどぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"ブラッド"
},
effect:"ブラッド属性の技をZ技に変化させる。"
},

{
id:107,
name:"氷Z",
kana:"こおりぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"氷"
},
effect:"氷属性の技をZ技に変化させる。"
},

{
id:108,
name:"月Z",
kana:"つきぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"月"
},
effect:"月属性の技をZ技に変化させる。"
},

{
id:109,
name:"ゴーストZ",
kana:"ごーすとぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"ゴースト"
},
effect:"ゴースト属性の技をZ技に変化させる。"
},

{
id:110,
name:"聖Z",
kana:"せいぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"聖"
},
effect:"聖属性の技をZ技に変化させる。"
},

{
id:111,
name:"闇Z",
kana:"やみぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"闇"
},
effect:"闇属性の技をZ技に変化させる。"
},

{
id:112,
name:"鋼Z",
kana:"はがねぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"鋼"
},
effect:"鋼属性の技をZ技に変化させる。"
},

{
id:113,
name:"毒Z",
kana:"どくぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"毒"
},
effect:"毒属性の技をZ技に変化させる。"
},

{
id:114,
name:"大地Z",
kana:"だいちぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"大地"
},
effect:"大地属性の技をZ技に変化させる。"
},

  {
id:115,
name:"龍Z",
kana:"りゅうぜっと",
type:"共通",
category:"Zクリスタル",
condition:{
    zType:"龍"
},
effect:"龍属性の技をZ技に変化させる。"
},

{
id:151,
name:"おとこZ",
kana:"おとこぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"はやぶ三連撃"
},
effect:"おとこ専用。はやぶ三連撃がZ技に変化する。"
},

{
id:152,
name:"はやぶさZ",
kana:"はやぶさぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"ライジングブレイク"
},
effect:"はやぶさ専用。ライジングブレイクがZ技に変化する。"
},

{
id:153,
name:"こまちZ",
kana:"こまちぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"神速斬突・炎"
},
effect:"こまち専用。神速斬突・炎がZ技に変化する。"
},

{
id:154,
name:"東西Z",
kana:"とうざいぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"レインボルトノヴァ"
},
effect:"東西専用。レインボルトノヴァがZ技に変化する。"
},

{
id:155,
name:"山手Z",
kana:"やまのてぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"炎炎ノ斬撃"
},
effect:"山手専用。炎炎ノ斬撃がZ技に変化する。"
},

{
id:156,
name:"丸ノ内(XV)Z",
kana:"まるのうちえっくすぶいぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"ブラッドムーンルインレイ"
},
effect:"丸ノ内XV専用。ブラッドムーンルインレイがZ技に変化する。"
},

  {
id:157,
name:"半蔵門Z",
kana:"はんぞうもんぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"ライトグレネード"
},
effect:"半蔵門専用。ライトグレネードがZ技に変化する。"
},

{
id:158,
name:"丸ノ内(NI)Z",
kana:"まるのうちえぬあいぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"神乃悪魔"
},
effect:"丸ノ内NI専用。神乃悪魔がZ技に変化する。"
},

  {
    id:159,
    name:"埼京Z",
    kana:"さいきょうぜっと",
    type:"専用",
    category:"Zクリスタル",
    condition:{
        zMove:[
            "ドラゴンウェーブ",
            "ウィンドクロスウェーブ"
        ]
    },
    effect:"埼京専用。ドラゴンウェーブ、ウィンドクロスウェーブがZ技に変化する。"
},

  {
id:160,
name:"スカイライナーZ",
kana:"すかいらいなーぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"シャドウバースト"
},
effect:"スカイライナー専用。シャドウバーストがZ技に変化する。"
},

  {
id:161,
name:"総武Z",
kana:"そうぶぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"毒刃斬撃"
},
effect:"総武専用。毒刃斬撃がZ技に変化する。"
},

{
id:162,
name:"東葉Z",
kana:"とうようぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"要塞のポーション"
},
effect:"東葉専用。要塞のポーションがZ技に変化する。"
},

{
id:163,
name:"南武Z",
kana:"なんぶぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"シャドウソウルオーバー"
},
effect:"南武専用。シャドウソウルオーバーがZ技に変化する。"
},

{
id:164,
name:"かもめZ",
kana:"かもめぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"オーロラビジョン"
},
effect:"かもめ専用。オーロラビジョンがZ技に変化する。"
},

{
id:165,
name:"かがやきZ",
kana:"かがやきぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"オーロラブリザード"
},
effect:"かがやき専用。オーロラブリザードがZ技に変化する。"
},

  {
id:166,
name:"おとこ・ミラーZ",
kana:"おとこみらーぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"はやぶ三連撃・改"
},
effect:"おとこ・ミラー専用。はやぶ三連撃・改がZ技に変化する。"
},

    {
id:167,
name:"はやぶさ・ミラーZ",
kana:"はやぶさみらーぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"シャイニングブレイク・改"
},
effect:"はやぶさ・ミラー専用。シャイニングブレイク・改がZ技に変化する。"
},

    {
id:168,
name:"こまち・ミラーZ",
kana:"こまちみらーぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"零式神速斬突・毒"
},
effect:"こまち・ミラー専用。零式神速斬突・毒がZ技に変化する。"
},

  {
id:169,
name:"東西・ミラーZ",
kana:"とうざいみらーぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"零式・レインヴォイドアビス"
},
effect:"東西・ミラー専用。零式・レインヴォイドアビスがZ技に変化する。"
},

    {
id:171,
name:"丸ノ内XV・ミラーZ",
kana:"まるのうちえっくすぶいみらーぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"旋風破滅光線・零"
},
effect:"丸ノ内XV・ミラー専用。旋風破滅光線・零がZ技に変化する。"
},

    {
id:181,
name:"おとこソウルZ",
kana:"おとこそうるぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"はやぶ三連撃・滅"
},
effect:"おとこソウル専用。はやぶ三連撃・滅がZ技に変化する。"
},

  {
id:184,
name:"東西ソウルZ",
kana:"とうざいそうるぜっと",
type:"専用",
category:"Zクリスタル",
condition:{
    zMove:"終式・破滅虹血剣"
},
effect:"東西ソウル専用。終式・破滅虹血剣がZ技に変化する。"
},
];