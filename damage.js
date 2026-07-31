//共通関数

function createTypeBadges(types){

    if(!Array.isArray(types)){
        types = [types];
    }

    return types.map(type =>
        `<span class="attribute attribute-${type}">${type}</span>`
    ).join(" ");

}

// ==========================
// 初期設定
// ==========================

const attacker = {
    character: characters[0],
    ev: 0,
    rank: 0
};

const defender = {
    character: characters[0],
    hpEV: 0,
    ev: 0,
    rank: 0
};

let attackType = "attack";
let defenseType = "defense";

let battleType = "single";
let damageModifiers = [];

// ==========================
// 要素取得
// ==========================

const attackerCharacterButton =
document.getElementById("attackerCharacterButton");

const defenderCharacterButton =
document.getElementById("defenderCharacterButton");

const attackStatName =
document.getElementById("attackStatName");

const attackStatValue =
document.getElementById("attackStatValue");

const defenseStatName =
document.getElementById("defenseStatName");

const defenseStatValue =
document.getElementById("defenseStatValue");

const attackEV =
document.getElementById("attackEV");

const defenseEV =
document.getElementById("defenseEV");

const attackRankText =
document.getElementById("attackRank");

const defenseRankText =
document.getElementById("defenseRank");

const searchModal =
document.getElementById("searchModal");

const searchInput =
document.getElementById("searchInput");

const searchList =
document.getElementById("searchList");

const closeModal =
document.getElementById("closeModal");

let selectMode = "";

let abilitySide = "";

let itemSide = "";

const moveButton =
document.getElementById("moveButton");

let selectedMove = null;

const categorySelect =
document.getElementById("categorySelect");

const hpStatValue =
document.getElementById("hpStatValue");

const hpEV =
document.getElementById("hpEV");

const hpEVMinus =
document.getElementById("hpEVMinus");

const hpEVPlus =
document.getElementById("hpEVPlus");

const physicalButton =
document.getElementById("physicalButton");

const specialButton =
document.getElementById("specialButton");

// ==========================
// 更新
// ==========================

function openCharacterSelect(mode){

    selectMode = mode;

    searchInput.value = "";

    drawCharacterList(characters);

    searchModal.style.display = "flex";

    document.body.style.overflow = "hidden";
    
}
    
    function openMoveSelect(){
      
selectMode = "move";

    searchInput.value = "";

    drawMoveList();

    searchModal.style.display = "flex";

    document.body.style.overflow = "hidden";

}

  function openAbilitySelect(side){

    abilitySide = side;

    selectMode = "ability";

    searchInput.value = "";

    drawAbilityList();

    searchModal.style.display = "flex";

    document.body.style.overflow = "hidden";

}

  function openItemSelect(side){

    itemSide = side;

    selectMode = "item";

    searchInput.value = "";

    drawItemList();

    searchModal.style.display = "flex";

    document.body.style.overflow = "hidden";

}

function addMoveButton(move){

    const card = document.createElement("div");
    card.className = "moveCard";

    card.innerHTML = `
        <div class="moveName">${move.name}</div>

        <div class="moveInfo">

          ${createTypeBadges(move.type)}

            <span class="move-kind-tag move-kind-${move.kind}">
    ${move.kind}
</span>

            <span class="move-category-tag move-category-${move.category}">
    ${move.category}
</span>

            <span class="moveTag">威力 ${move.power}</span>

            <span class="moveTag">命中 ${
                move.accuracy === 0
    ? "-"
    : move.accuracy === 101
    ? "必中"
    : move.accuracy
            }</span>

        </div>

        <div class="moveEffect">
            ${move.effect.trim()}
        </div>
    `;

    card.onclick = ()=>{
      
      selectedMove = move;

        moveButton.textContent = move.name;
        
        const hitCountBox = document.getElementById("hitCountBox");
const hitCount = document.getElementById("hitCount");

if (move.hits && move.hits[0] !== move.hits[1]) {

    hitCountBox.style.display = "block";

    hitCount.innerHTML = "";

    for (let i = move.hits[0]; i <= move.hits[1]; i++) {
        hitCount.innerHTML += `<option value="${i}">${i}回</option>`;
    }

} else {

    hitCountBox.style.display = "none";

}

const assistPowerBox = document.getElementById("assistPowerBox");
const assistPower = document.getElementById("assistPower");

if (
    selectedMove.name === "アシストパワー" ||
    selectedMove.name === "地獄突き"
) {

    assistPowerBox.style.display = "";

    assistPower.innerHTML = "";

    for (let power = 20; power <= 620; power += 20) {

        const option = document.createElement("option");
        option.value = power;
        option.textContent = power;

        assistPower.appendChild(option);

    }

} else {

    assistPowerBox.style.display = "none";

}

        if(move.category === "不明"){

    categorySelect.style.display = "block";

    attackType = "attack";
    defenseType = "defense";

    physicalButton.classList.add("active");
    specialButton.classList.remove("active");

}else{

    categorySelect.style.display = "none";

    if(move.category === "物理"){
        attackType = "attack";
        defenseType = "defense";
    }else{
        attackType = "spAttack";
        defenseType = "spDefense";
    }

}

        searchModal.style.display="none";
        document.body.style.overflow="";
        updateScreen();

    };

    searchList.appendChild(card);

}

function addAbilityButton(ability){

    const card = document.createElement("div");
    card.className = "moveCard";

    card.innerHTML = `
        <div class="moveName">${ability.name}</div>

        <div class="moveInfo">

            <span class="move-kind-tag">
                ${ability.type}
            </span>

            <span class="move-category-tag">
                ${ability.category}
            </span>

        </div>

        <div class="moveEffect">
            ${ability.effect.trim()}
        </div>
    `;

    card.onclick = () => {

    if(abilitySide === "attack"){
    selectedAttackAbility = ability;
    attackerAbilityButton.textContent = ability.name;
}else{
    selectedDefenseAbility = ability;
    defenderAbilityButton.textContent = ability.name;
}

    searchModal.style.display = "none";
    document.body.style.overflow = "";
    
    updateScreen();

};

    searchList.appendChild(card);

}

function addItemButton(item){

    const card = document.createElement("div");
    card.className = "moveCard";

    card.innerHTML = `
        <div class="moveName">${item.name}</div>

        <div class="moveInfo">

            <span class="move-kind-tag">
                ${item.type}
            </span>

        </div>

        <div class="moveEffect">
            ${item.effect.trim()}
        </div>
    `;

    card.onclick = ()=>{

    if(itemSide === "attack"){
    selectedAttackItem = item;
    attackerItemButton.textContent = item.name;
}else{
    selectedDefenseItem = item;
    defenderItemButton.textContent = item.name;
}

updateScreen();

    searchModal.style.display = "none";

    document.body.style.overflow = "";

};

    searchList.appendChild(card);

}

function drawMoveList(){

    searchList.innerHTML = "";

    const character = attacker.character;

    // 覚える技
    const specialIds = [
        ...character.moves,
        character.ultimate,
        character.zMove
    ];

    const specialMoves = moves.filter(move =>
        specialIds.includes(move.id) &&
        move.category !== "変化"
    );

    const otherMoves = moves.filter(move =>
        move.category !== "変化" &&
        !specialIds.includes(move.id)
    );

    const title1 = document.createElement("h3");
    title1.textContent = "★ 覚える技";
    searchList.appendChild(title1);

    specialMoves.forEach(move=>{
        addMoveButton(move);
    });

    const hr = document.createElement("hr");
    searchList.appendChild(hr);

    const title2 = document.createElement("h3");
    title2.textContent = "その他の技";
    searchList.appendChild(title2);

    otherMoves.forEach(move=>{
        addMoveButton(move);
    });
    
    if (specialMoves.length === 0 && otherMoves.length === 0) {

    const message = document.createElement("div");
    message.className = "noResult";
    message.textContent = "🔍 該当する技はありませんでした。";

    searchList.appendChild(message);

}

}

function drawAbilityList(){

    searchList.innerHTML = "";

    const character = attacker.character;

const specialIds = character.abilities;

const category =
    abilitySide === "attack"
    ? "攻撃"
    : "防御";

const specialAbilities = abilities.filter(ability =>
    specialIds.includes(ability.id) &&
    ability.category === category &&
    ability.damage
);

const otherAbilities = abilities.filter(ability =>
    !specialIds.includes(ability.id) &&
    ability.category === category &&
    ability.damage
);

    const title1 = document.createElement("h3");
    title1.textContent = "★ 持っている特性";
    searchList.appendChild(title1);

    specialAbilities.forEach(addAbilityButton);

    const hr = document.createElement("hr");
    searchList.appendChild(hr);

    const title2 = document.createElement("h3");
    title2.textContent = "その他の特性";
    searchList.appendChild(title2);

    otherAbilities.forEach(addAbilityButton);

}

function drawCharacterList(list){

    searchList.innerHTML = "";

    list.sort((a,b)=>a.name.localeCompare(b.name,"ja"));

    searchList.innerHTML = "";

    list.forEach(character=>{

        const card = document.createElement("div");
        card.className = "character-card";

        const type = character.attribute[0];

        card.innerHTML = `
            <div class="character-header">
                ${character.name}
            </div>

            <div class="character-body">
                <span class="attribute attribute-${type}">
                    ${type}
                </span>
            </div>
        `;

        card.onclick = ()=>{

            if(selectMode==="attacker"){
                attacker.character = character;
            }else{
                defender.character = character;
            }

            searchModal.style.display = "none";
document.body.style.overflow = "";
updateScreen();

        };

        searchList.appendChild(card);

    });

}

function drawItemList(){

    searchList.innerHTML = "";

    const category =
        itemSide === "attack"
        ? "攻撃"
        : "防御";

    const list = items.filter(item =>
    item.category === category &&
    item.damage
);

    const title = document.createElement("h3");
    title.textContent =
        itemSide === "attack"
        ? "攻撃側の持ち物"
        : "防御側の持ち物";

    searchList.appendChild(title);

    list.forEach(addItemButton);

}

function updateScreen(){

    attackerCharacterButton.textContent =
    attacker.character.name;

    defenderCharacterButton.textContent =
    defender.character.name;

    attackStatName.textContent =
    attackType === "attack" ? "攻撃" : "特攻";

    defenseStatName.textContent =
    defenseType === "defense" ? "防御" : "特防";

    const atkBase =
attacker.character.status[attackType] +
attacker.ev * 5;

const defBase =
defender.character.status[defenseType] +
defender.ev * 5;

let criticalAttackRank = attacker.rank;
let criticalDefenseRank = defender.rank;

if(document.getElementById("critical").checked){

    if(criticalAttackRank < 0){
        criticalAttackRank = 0;
    }

    if(criticalDefenseRank > 0){
        criticalDefenseRank = 0;
    }

}

const atkStat =
Math.floor(atkBase * getRankMultiplier(criticalAttackRank));

const defStat =
Math.floor(defBase * getRankMultiplier(criticalDefenseRank));

attackStatValue.textContent = atkStat;

defenseStatValue.textContent = defStat;

hpStatValue.textContent = defender.character.status.hp;

hpEV.textContent = defender.hpEV;

hpStatValue.textContent =
    defender.character.status.hp +
    defender.hpEV * 5;

    attackEV.textContent =
    attacker.ev;

    defenseEV.textContent =
    defender.ev;

    attackRankText.textContent =
attacker.rank > 0 ?
"+" + attacker.rank :
attacker.rank;

defenseRankText.textContent =
defender.rank > 0 ?
"+" + defender.rank :
defender.rank;
    
    const damageValue = calculateDamage();

if(damageValue === null){

}else{

const minDamage = damageValue[0].damage;
const maxDamage = damageValue[15].damage;

    const hp =
    defender.character.status.hp +
    defender.hpEV * 5;
    
    let currentHp = hp;
    
    // ステルスグランド
if(document.getElementById("stealthRock").checked){

    const type =
        getTypeEffectiveness(
            "大地",
            defender.character.attribute
        );

    currentHp -= Math.floor(hp / 8 * type);

}

const spikes =
Number(document.getElementById("spikes").value);

if(
    selectedDefenseAbility?.name !== "浮遊" &&
    selectedDefenseItem?.name !== "風船"
){
  
  if(spikes === 1){
    currentHp -= Math.floor(hp / 8);
}

if(spikes === 2){
    currentHp -= Math.floor(hp / 6);
}

if(spikes === 3){
    currentHp -= Math.floor(hp / 4);
}

}

    if(minDamage === 0){

    document.getElementById("barDamage").textContent = "0～0";
    document.getElementById("barRate").textContent = "(0.0%～0.0%)";
    document.getElementById("barCount").textContent = "ダメージなし";
    document.getElementById("damageBarFill").style.width = "0%";

    return;

}

const minRate =
    (minDamage / hp * 100).toFixed(2);

const maxRate =
    (maxDamage / hp * 100).toFixed(2);
    
    const barRate =
document.getElementById("barRate");

if(currentHp === hp){

    barRate.textContent =
    `(${minRate}%～${maxRate}%)`;

}else{

    barRate.innerHTML =
    `(${minRate}%～${maxRate}%)
    <span style="color:#ff9800;font-weight:bold;">
    HP:${currentHp}
    </span>`;

}

document.getElementById("barDamage").textContent =
`${minDamage}～${maxDamage}`;
    
    let hit = 1;

const minResult = calculateHitCount(minDamage, currentHp);
const maxResult = calculateHitCount(maxDamage, currentHp);

const minHit = minResult.hit;
const maxHit = maxResult.hit;

if(minHit === maxHit){

    document.getElementById("barCount").textContent =
    `確定${minHit}発`;

}else{

    if (maxHit >= 2 && maxHit <= 4) {

const rateValue =
calculateKillRate(currentHp, maxHit);

let rate;

if (rateValue > 0 && rateValue < 0.0001) {

    rate = "<0.01";

} else {

    rate = (
        Math.floor(rateValue * 10000) / 100
    ).toFixed(2);

}

    document.getElementById("barCount").textContent =
   `乱数${maxHit}発 (${rate}%)`

} else {

    let success = 0;

    for(const result of damageValue){

        const hitResult =
        calculateHitCount(result.damage, currentHp);

        if(hitResult.hit === maxHit){
            success++;
        }

    }

    const rate =
(Math.floor(success / damageValue.length * 10000) / 100).toFixed(2);

    document.getElementById("barCount").textContent =
    `乱数${maxHit}発 (${rate}%)`;

}

}

document.getElementById("damageBarFill").style.width =
`${Math.min(maxRate,100)}%`;

const bar =
document.getElementById("damageBarFill");

if(minDamage >= currentHp){
    // 確定1発
    bar.style.background = "#e53935"; // 赤
}else if(maxRate >= 100){
    // 乱数1発
    bar.style.background = "#fb8c00"; // オレンジ
}else if(maxRate >= 50){
    // 2発圏内
    bar.style.background = "#fbc02d"; // 黄
}else{
    // それ以外
    bar.style.background = "#43a047"; // 緑
}

}

}

// ==========================
// 努力値
// ==========================

document.getElementById("attackEVPlus").onclick = () => {
    if (attacker.ev < 8) {
        attacker.ev++;
        updateScreen();
    }
};

document.getElementById("attackEVMinus").onclick = () => {
    if (attacker.ev > 0) {
        attacker.ev--;
        updateScreen();
    }
};

hpEVPlus.onclick = () => {

    if(defender.hpEV < 8){

        defender.hpEV++;

        updateScreen();

    }

};

hpEVMinus.onclick = () => {

    if(defender.hpEV > 0){

        defender.hpEV--;

        updateScreen();

    }

};

document.getElementById("defenseEVPlus").onclick = () => {
    if (defender.ev < 8) {
        defender.ev++;
        updateScreen();
    }
};

document.getElementById("defenseEVMinus").onclick = () => {
    if (defender.ev > 0) {
        defender.ev--;
        updateScreen();
    }
};

// ==========================
// ランク
// ==========================

document.getElementById("attackRankPlus").onclick = () => {
    if (attacker.rank < 6) {
        attacker.rank++;
        updateScreen();
    }
};

document.getElementById("attackRankMinus").onclick = () => {
    if (attacker.rank > -6) {
        attacker.rank--;
        updateScreen();
    }
};

document.getElementById("defenseRankPlus").onclick = () => {
    if (defender.rank < 6) {
        defender.rank++;
        updateScreen();
    }
};

document.getElementById("defenseRankMinus").onclick = () => {
    if (defender.rank > -6) {
        defender.rank--;
        updateScreen();
    }
};

function getRankMultiplier(rank){

    if(rank >= 0){
        return (rank + 2) / 2;
    }

    return 2 / (Math.abs(rank) + 2);

}

function calculateDamage(){

    try{

    if(!selectedMove){
        return null;
    }

    let modifiers = [];

    function addModifier(name, value){

        if(!modifiers.some(m => m.name === name)){
            modifiers.push({
                name,
                value:`×${value}`
            });
        }

    }
        
        const hp =
    defender.character.status.hp +
    defender.hpEV * 5;

let currentHp = hp;

// ステルスグランド
if(document.getElementById("stealthRock").checked){

    const type =
        getTypeEffectiveness(
            "大地",
            defender.character.attribute
        );

    currentHp -= Math.floor(hp / 8 * type);

}

const spikes =
Number(document.getElementById("spikes").value);

if(
    selectedDefenseAbility?.name !== "浮遊" &&
    selectedDefenseItem?.name !== "風船"
){

    if(spikes === 1){
        currentHp -= Math.floor(hp / 8);
    }

    if(spikes === 2){
        currentHp -= Math.floor(hp / 6);
    }

    if(spikes === 3){
        currentHp -= Math.floor(hp / 4);
    }

}

const multiArmor =
    selectedDefenseAbility?.name === "マルチアーマー" &&
    currentHp === hp;
        
        console.log(selectedAttackAbility);
console.log(selectedDefenseAbility);

        console.log(selectedMove);
        
        console.log(selectedMove.type);
        

let attack =
attacker.character.status[attackType] +
attacker.ev * 5;

// 拘りソード
if(
    selectedAttackItem?.name === "拘りソード" &&
    selectedMove.category === "物理"
){
    attack *= 1.5;
addModifier("拘りソード", 1.5);
}

// 拘りステッキ
if(
    selectedAttackItem?.name === "拘りステッキ" &&
    selectedMove.category === "特殊"
){
    attack *= 1.5;
addModifier("拘りステッキ", 1.5);
}

        let defense =
defender.character.status[defenseType] +
defender.ev * 5;
        
        // 壁
if(
    document.getElementById("wall").checked &&
    !document.getElementById("critical").checked
){

    if(battleType === "single"){
        defense *= 2;
        addModifier("壁", 0.5);
    }else{
        defense *= 1.5;
        addModifier("壁", 0.66);
    }

}

        
        // 突撃チョッキ
if(
    selectedDefenseItem?.name === "突撃チョッキ" &&
    selectedMove.category === "特殊"
){
    defense *= 1.5;
addModifier("突撃チョッキ", 0.66);
}

        let power;

if (
    selectedMove.name === "アシストパワー" ||
    selectedMove.name === "地獄突き"
) {

    power = Number(document.getElementById("assistPower").value);

} else {

    power = selectedMove.power;

}
        let moveType = selectedMove.type;

// テクニシャン
if(
    selectedAttackAbility?.name === "テクニシャン" &&
    power <= 60
){
    power *= 1.5;
addModifier("テクニシャン", 1.5);
}

// クリスタルブレード
if (
    selectedAttackAbility?.name === "クリスタルブレード" &&
    selectedMove.category === "物理"
){
    power *= 1.2;
addModifier("クリスタルブレード", 1.2);
}

// 絶対的忠誠心
if (
    selectedAttackAbility?.name === "絶対的忠誠心"
){
    power *= 1.5;
addModifier("絶対的忠誠心", 1.5);
}

// 斬れ味
if(
    selectedAttackAbility?.name === "斬れ味" &&
    selectedMove.category === "物理"
){
    power *= 1.3;
addModifier("斬れ味", 1.3);
}

// エレキスキン
if(
    selectedAttackAbility?.name === "エレキスキン" &&
    moveType.includes("無")
){
    moveType = ["雷"];
    power *= 1.2;
addModifier("エレキスキン", 1.2);
}

// スカイスキン
if(
    selectedAttackAbility?.name === "スカイスキン" &&
  moveType.includes("無")
){
    moveType = ["風"];
    power *= 1.2;
addModifier("スカイスキン", 1.2);
}

// フリーズスキン
if(
    selectedAttackAbility?.name === "フリーズスキン" &&
    moveType.includes("無")
){
    moveType = ["氷"];
    power *= 1.2;
addModifier("フリーズスキン", 1.2);
}

        const stab =
moveType.some(type =>
    attacker.character.attribute.includes(type)
)
? 1.5
: 1;
if (stab > 1) {
    addModifier("属性一致", stab);
}
        
        // 貯水
if(
    selectedDefenseAbility?.name === "貯水" &&
    moveType.includes("水")
){
    return new Array(16).fill(0);
}

// 浮遊
if(
    selectedDefenseAbility?.name === "浮遊" &&
    moveType.includes("大地")
){
    return new Array(16).fill(0);
}

// 風船
if(
    selectedDefenseItem?.name === "風船" &&
    moveType.includes("大地")
){
    return new Array(16).fill(0);
}

const type =
getTypeEffectiveness(
    moveType,
    defender.character.attribute
);

if (type > 1) {
    addModifier("弱点", type);
} else if (type > 0 && type < 1) {
    addModifier("耐性", type);
} else if (type === 0) {
    addModifier("無効", 0);
}

const hitCount =
selectedMove.hits
? (
    selectedMove.hits[0] === selectedMove.hits[1]
    ? selectedMove.hits[0]
    : Number(document.getElementById("hitCount").value)
)
: 1;

        const damages = [];
        
        let totalDamage = 0;
let hpNow = currentHp;
let berryUsed = false;
let sashUsed = false;

        for (let i = 85; i <= 100; i++) {

    let totalDamage = 0;
    let hpNow = currentHp;
    let attackRankNow = attacker.rank;
let defenseRankNow = defender.rank;

if (document.getElementById("critical").checked) {

    if (attackRankNow < 0) {
        attackRankNow = 0;
    }

    if (defenseRankNow > 0) {
        defenseRankNow = 0;
    }

}
    
    let defenseNow = defense;

    for (let hit = 1; hit <= hitCount; hit++) {
      
      const attackNow =
Math.floor(
    attack *
    getRankMultiplier(attackRankNow)
);

const defenseNow =
Math.floor(
    defense *
    getRankMultiplier(defenseRankNow)
);

console.log({
    defense,
    defenseRankNow,
    defenseNow
});

let hitDamage =
power * attackNow / defenseNow / 2;

hitDamage *= stab;
hitDamage *= type;

// 範囲攻撃補正
if(battleType === "double"){

    if(
        selectedMove.target === "相手全体" ||
        selectedMove.target === "自分以外" ||
        selectedMove.target === "2体"
    ){
        hitDamage *= 0.75;
addModifier("範囲攻撃", 0.75);
    }

}else if(battleType === "triple"){

    if(
        selectedMove.target === "相手全体" ||
        selectedMove.target === "自分以外"
    ){
        hitDamage *= 0.75;
addModifier("範囲攻撃", 0.75);
    }

}

// 充電
if(
    document.getElementById("charge").checked &&
    moveType.includes("雷")
){
    hitDamage *= 2;
addModifier("充電", 2);
}

// レインボルト
if(
    selectedAttackAbility?.name === "レインボルト" &&
    (moveType.includes("虹") || moveType.includes("雷"))
){
hitDamage *= 1.2;
addModifier("レインボルト", 1.2);
}

// レインボーオーラ
if(
    document.getElementById("rainbowAura").checked &&
    moveType.includes("虹")
){
    hitDamage *= 2.5;
addModifier("レインボーオーラ", 2.5);
}

// レインボーオーラ・ビッグバン
if(
    document.getElementById("bigBang").checked &&
    moveType.includes("虹")
){
    hitDamage *= 2;
addModifier("レインボーオーラ・ビッグバン", 2);
}

// 守る
if(document.getElementById("protectBreak").checked){
    hitDamage *= 0.25;
addModifier("守る貫通", 0.25);
}

// 会心
if(document.getElementById("critical").checked){
    hitDamage *= 1.5;
addModifier("会心", 1.5);
}

// 命の珠
if(selectedAttackItem?.name === "命の珠"){
    hitDamage *= 1.3;
addModifier("命の珠", 1.3);
}

// 炎上
if (
    document.getElementById("burn").checked &&
    selectedMove.category === "物理"
) {
    hitDamage *= 0.5;
addModifier("炎上", 0.5);
}

// 永遠の呪い
if (document.getElementById("eternalCurse").checked) {
    hitDamage *= 0.8;
addModifier("永遠の呪い", 0.8);
}

        
        // マルチアーマー
if (
    selectedDefenseAbility?.name === "マルチアーマー" &&
    hpNow === hp
) {
    hitDamage *= 0.5;
}


hitDamage = Math.floor(hitDamage * i / 100);
        // ここでマルチアーマー
        // ここで持久力
        // ここで乱数

        // 命のお守り
if (
    selectedDefenseItem?.name === "命のお守り" &&
    !sashUsed &&
    hpNow === hp &&
    hitDamage >= hpNow
) {

    hitDamage = hpNow - 1;
    sashUsed = true;

}

totalDamage += hitDamage;
hpNow -= hitDamage;
        
        // 緊急治癒薬
if (
    selectedDefenseItem?.name === "緊急治癒薬" &&
    !berryUsed &&
    hpNow > 0 &&
    hpNow <= hp / 2
) {

    hpNow += Math.floor(hp / 4);

    if (hpNow > hp) {
        hpNow = hp;
    }

    berryUsed = true;
}
        
//持久力
if (selectedDefenseAbility?.name === "持久力") {

    if (
        selectedMove.category === "物理" &&
        defenseRankNow < 6
    ) {
        defenseRankNow++;
    }
    
}


    }

    damages.push({
    damage: Math.floor(totalDamage),
    hp: hpNow,
    berryUsed,
    sashUsed
});

}

damageModifiers = modifiers;

return damages;

    }catch(e){

console.log(e.stack);
        console.error(e);

        return null;

    }
    
}
    
    function calculateHitCount(damage, currentHp){

    const hp =
        defender.character.status.hp +
        defender.hpEV * 5;

    let hpNow = currentHp;

    let berryUsed = false;
    let sashUsed = false;

    let hit = 0;

    let defenseRankNow = defender.rank;

    while(hpNow > 0){

        hit++;

// 命のお守り
if (
    selectedDefenseItem?.name === "命のお守り" &&
    !sashUsed &&
    hpNow === hp &&
    damage >= hpNow
) {

    damage = hpNow - 1;
    sashUsed = true;

}

        hpNow -= damage;

        // 緊急治癒薬

        if(
            selectedDefenseItem?.name === "緊急治癒薬" &&
            !berryUsed &&
            hpNow > 0 &&
            hpNow <= hp / 2
        ){

            hpNow += Math.floor(hp / 4);

            if(hpNow > hp){
                hpNow = hp;
            }

            berryUsed = true;

        }
        
        // 持久力
if (
    selectedDefenseAbility?.name === "持久力" &&
    selectedMove.category === "物理" &&
    defenseRankNow < 6
) {
    defenseRankNow++;
}

    }

    return {
    hit,
    berryUsed
};

}

function calculateKillRate(currentHp, hitCount){

    const damageValue = calculateDamage();

    let success = 0;
    let total = 0;

function simulate(hpNow, remainHit){
  
  if (remainHit === 0) {

    total++;

    if (hpNow <= 0) {
        success++;
    }

    return;

}

for (const result of damageValue) {

    simulate(
        hpNow - result.damage,
        remainHit - 1
    );

}

 }
 
 simulate(currentHp, hitCount);

return success / total;

}

attackerCharacterButton.onclick = () => {
    openCharacterSelect("attacker");
};

defenderCharacterButton.onclick = () => {
    openCharacterSelect("defender");
};

moveButton.onclick = () => {
    openMoveSelect();
};

closeModal.onclick = () => {
    searchModal.style.display = "none";
    document.body.style.overflow = "";
};

searchInput.oninput = () => {

    const keyword = searchInput.value.trim();

    // キャラクター検索
    if(selectMode === "attacker" || selectMode === "defender"){

        const result = characters.filter(character =>
            character.name.includes(keyword)
        );

        drawCharacterList(result);
        return;
    }

    // 技検索
    if(selectMode === "move"){

        searchList.innerHTML = "";

        const character = attacker.character;

        const specialIds = [
            ...character.moves,
            character.ultimate,
            character.zMove
        ];

        const specialMoves = moves.filter(move =>
            specialIds.includes(move.id) &&
            move.category !== "変化" &&
(
    move.name.includes(keyword) ||
    move.kana.includes(keyword) ||
    move.effect.includes(keyword) ||
    move.type.includes(keyword) ||
    move.category.includes(keyword)
)
        );

        const otherMoves = moves.filter(move =>
            !specialIds.includes(move.id) &&
            move.category !== "変化" &&
(
    move.name.includes(keyword) ||
    move.kana.includes(keyword) ||
    move.effect.includes(keyword) ||
    move.type.includes(keyword) ||
    move.category.includes(keyword)
)
        );

        const title1 = document.createElement("h3");
        title1.textContent = "★ 覚える技";
        searchList.appendChild(title1);

        specialMoves.forEach(addMoveButton);

        searchList.appendChild(document.createElement("hr"));

        const title2 = document.createElement("h3");
        title2.textContent = "その他の技";
        searchList.appendChild(title2);

        otherMoves.forEach(addMoveButton);

        return;
    }

    // 特性検索
    if(selectMode === "ability"){

        searchList.innerHTML = "";

        const character = attacker.character;

        const specialIds = character.abilities;
        
        const category =
    abilitySide === "attack"
    ? "攻撃"
    : "防御";

        const specialAbilities = abilities.filter(ability =>
    specialIds.includes(ability.id) &&
    ability.category === category &&
    ability.damage &&
    (ability.name.includes(keyword) || ability.kana.includes(keyword))
);

const otherAbilities = abilities.filter(ability =>
    !specialIds.includes(ability.id) &&
    ability.category === category &&
    ability.damage &&
    (ability.name.includes(keyword) || ability.kana.includes(keyword))
);

        const title1 = document.createElement("h3");
        title1.textContent = "★ 持っている特性";
        searchList.appendChild(title1);

        specialAbilities.forEach(addAbilityButton);

        searchList.appendChild(document.createElement("hr"));

        const title2 = document.createElement("h3");
        title2.textContent = "その他の特性";
        searchList.appendChild(title2);

        otherAbilities.forEach(addAbilityButton);

    }
    
    // 持ち物検索
if(selectMode === "item"){

    searchList.innerHTML = "";

    const category =
        itemSide === "attack"
        ? "攻撃"
        : "防御";

    const result = items.filter(item =>
    item.category === category &&
    item.damage &&
    (item.name.includes(keyword) || item.kana.includes(keyword))
);

    const title = document.createElement("h3");
    title.textContent =
        itemSide === "attack"
        ? "攻撃側の持ち物"
        : "防御側の持ち物";

    searchList.appendChild(title);

    result.forEach(addItemButton);

    return;
}

};

const attackerAbilityButton =
document.getElementById("attackerAbilityButton");

attackerAbilityButton.onclick = () => {

    openAbilitySelect("attack");

};

const defenderAbilityButton =
document.getElementById("defenderAbilityButton");

defenderAbilityButton.onclick = () => {

    openAbilitySelect("defense");

};

const attackerItemButton =
document.getElementById("attackerItemButton");

const defenderItemButton =
document.getElementById("defenderItemButton");

let selectedAttackItem = null;
let selectedDefenseItem = null;

let selectedAttackAbility = null;
let selectedDefenseAbility = null;

attackerItemButton.onclick = () => {

    openItemSelect("attack");

};

defenderItemButton.onclick = () => {

    openItemSelect("defense");

};

physicalButton.onclick = () => {

    attackType = "attack";
    defenseType = "defense";

    physicalButton.classList.add("active");
    specialButton.classList.remove("active");

    updateScreen();

};

specialButton.onclick = () => {

    attackType = "spAttack";
    defenseType = "spDefense";

    specialButton.classList.add("active");
    physicalButton.classList.remove("active");

    updateScreen();

};

selectedMove = moves.find(move => move.name === "は？");

    if(selectedMove){

    moveButton.textContent = selectedMove.name;

    if(selectedMove.category === "不明"){

        categorySelect.style.display = "block";
        attackType = "attack";
        defenseType = "defense";

    }else{

        categorySelect.style.display = "none";

        if(selectedMove.category === "物理"){
            attackType = "attack";
            defenseType = "defense";
        }else{
            attackType = "spAttack";
            defenseType = "spDefense";
        }

    }

}

updateScreen();

const battleButtons = document.querySelectorAll(".battleButton");

battleButtons.forEach(button => {

    button.addEventListener("click", () => {

        battleButtons.forEach(b => b.classList.remove("active"));

        button.classList.add("active");

        battleType = button.dataset.type;

        updateScreen(); // 再計算
    });
    
});

//会心
document.getElementById("critical").onchange = () => {
    updateScreen()
};

// 壁
document.getElementById("wall").onchange = () => {
    updateScreen();
};

//充電
document.getElementById("charge").onchange = () => {
    updateScreen();
};

//守る貫通
document.getElementById("protectBreak").onchange = () => {
    updateScreen();
};

//ステルスグランド
document.getElementById("stealthRock").onchange = () => {
    updateScreen();
};

// 撒菱
document.getElementById("spikes").onchange = () => {
    updateScreen();
};

//レインボーオーラ
document.getElementById("rainbowAura").onchange = () => {
    updateScreen();
};

//レインボーオーラ・ビッグバン
document.getElementById("bigBang").onchange = () => {
    updateScreen();
};

//連続技
document.getElementById("hitCount").onchange = () => {
    updateScreen();
};

//能力上昇火力
document.getElementById("assistPower").onchange = updateScreen;

const detailModal =
document.getElementById("detailModal");

document.getElementById("detailButton").onclick = ()=>{
  
  document.getElementById("detailDamage").textContent =
    document.getElementById("barDamage").textContent;

document.getElementById("detailRate").textContent =
    document.getElementById("barRate").textContent;

document.getElementById("detailCount").textContent =
    document.getElementById("barCount").textContent;
  
  document.getElementById("modifierList").innerHTML =
damageModifiers.map(m => `
<div class="modifierRow">
    <span class="modifierName">${m.name}</span>
    <span class="modifierValue">${m.value}</span>
</div>
`).join("");

    document.getElementById("detailAttacker").textContent =
        attacker.character.name;

    document.getElementById("detailMove").textContent =
        selectedMove.name;

    document.getElementById("detailAbility").textContent =
        selectedAttackAbility?.name ?? "なし";

    document.getElementById("detailItem").textContent =
        selectedAttackItem?.name ?? "なし";

    document.getElementById("detailAttack").textContent =
        attackStatValue.textContent;

    document.getElementById("detailType").innerHTML =
        createTypeBadges(attacker.character.attribute);

    document.getElementById("detailMoveType").innerHTML =
        createTypeBadges(selectedMove.type);

    document.getElementById("detailPower").textContent =
        selectedMove.power;
        
        document.getElementById("detailDefender").textContent =
    defender.character.name;

document.getElementById("detailDefenderAbility").textContent =
    selectedDefenseAbility?.name ?? "なし";

document.getElementById("detailDefenderItem").textContent =
    selectedDefenseItem?.name ?? "なし";

document.getElementById("detailDefenderHP").textContent =
    defender.character.status.hp + defender.hpEV * 5;

document.getElementById("detailDefense").textContent =
    defenseStatValue.textContent;

document.getElementById("detailDefenderType").innerHTML =
    createTypeBadges(defender.character.attribute);
    
    const damages = calculateDamage();

document.getElementById("randomGrid").innerHTML =
damages.map((d, i) => `
<div class="randomCard">
    <div class="randomRate">×${((85 + i) / 100).toFixed(2)}</div>
    <div class="randomDamage">${d.damage}</div>
</div>
`).join("");

    detailModal.style.display = "flex";
    document.body.style.overflow = "hidden";

};

document.getElementById("closeDetail").onclick = ()=>{

    detailModal.style.display = "none";
    document.body.style.overflow = "";

};

//炎上
document.getElementById("burn").onchange = () => {
    updateScreen();
};

//永遠の呪い
document.getElementById("eternalCurse").onchange = () => {
    updateScreen();
};