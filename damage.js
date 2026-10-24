//共通関数：属性バッジ作成
function createTypeBadges(types) {

    if (!Array.isArray(types)) {
        types = [types];
    }

    return types.map(type => {
        if (type === "虹") {
            return `
                <span class="attribute-虹-wrap">
                    <span class="attribute attribute-虹">虹</span>
                </span>
            `;
        }

        return `<span class="attribute attribute-${type}">${type}</span>`;
    }).join(" ");
}

// ==========================
// 初期設定
// ==========================


const attacker = {
    character: characters[0],
    formIndex: -1,
    ev: 0,
    rank: 0
};

const defender = {
    character: characters[0],
    formIndex: -1,
    hpEV: 0,
    ev: 0,
    rank: 0
};

// 現在の形態のデータを取得
function getCurrentFormData(side) {
    const character = side.character;

    if (
        side.formIndex >= 0 &&
        character.forms &&
        character.forms[side.formIndex]
    ) {
        return {
            ...character,
            ...character.forms[side.formIndex],
            attribute:
    character.forms[side.formIndex].attribute
    || character.attribute,
            forms: character.forms
        };
    }

    return character;
  
  
}

// 技の最終属性を取得
function getEffectiveMoveType(move) {
    if (!move) return [];

  // 第零式・神撃：新月形態ではゴースト属性
if (move.name === "第零式・神撃") {
    const form = getCurrentFormData(attacker);
    const formName = form.name || attacker.character.name;

    if (formName.includes("新月")) {
        return ["ゴースト"];
    }
}

    // 光速・シャドウビーム・零
    if (
        move.name === "光速・シャドウビーム・零" &&
        document.getElementById("voidBeam")?.checked
    ) {
        return ["闇"];
    }

      // テラバースト：テラスタイプに連動
    if (move.name === "テラバースト") {
        return attackerTeraType
            ? [attackerTeraType]
            : (Array.isArray(move.type) ? move.type : [move.type]);
    }

    return Array.isArray(move.type)
        ? move.type
        : [move.type];
}

let attackType = "attack";
let defenseType = "defense";

// テラスタイプ
let attackerTeraType = "";
let defenderTeraType = "";

let battleType = "single";
let damageModifiers = [];

let actualMovePower = 0;

let baseMovePower = 0;

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

      const hitCountLabel =
    document.querySelector('label[for="hitCount"]');

if (hitCountLabel) {
    hitCountLabel.textContent =
        move.name === "ルシフェルフォースラジェーション・零"
            ? "威力"
            : "Lv";
}

        moveButton.textContent = move.name;
        
        
const hitCountBox = document.getElementById("hitCountBox");
const hitCount = document.getElementById("hitCount");


const isMetalShining =
    move.name === "第零式・メタルシャイニングブレード";
const isBrilliantForce =
    move.name === "ブリリアントフォース・改";
const isLuciferForce =
    move.name === "ルシフェルフォースラジェーション・零";

if (
    (move.hits && move.hits[0] !== move.hits[1]) ||
    isBrilliantForce ||
isMetalShining ||
isLuciferForce
) {
    hitCountBox.style.display = "block";
    hitCount.innerHTML = "";

    if (isMetalShining) {
    hitCount.innerHTML = `
        <option value="1">Lv1〜4</option>
        <option value="5">Lv5〜9</option>
        <option value="10">Lv10</option>
    `;
} else if (isLuciferForce) {
    hitCount.innerHTML = "";

    for (let lv = 1; lv <= 10; lv++) {
        const power = 100 + lv * 20;

        const option = document.createElement("option");
        option.value = lv;
        option.textContent = `威力${power}（Lv${lv}）`;

        hitCount.appendChild(option);
    
}
} else {
    const minHits = isBrilliantForce ? 1 : move.hits[0];
    const maxHits = isBrilliantForce ? 10 : move.hits[1];

    for (let i = minHits; i <= maxHits; i++) {
        const label = isBrilliantForce
            ? `Lv${i}（${i}回攻撃）`
            : `${i}回`;

        hitCount.innerHTML +=
            `<option value="${i}">${label}</option>`;
    }
}
} else {
    hitCountBox.style.display = "none";
}



const assistPowerBox = document.getElementById("assistPowerBox");
const assistPower = document.getElementById("assistPower");

      // 鮮血月蝕終焉光線・零

document.getElementById("bleedCountBox").style.display =
    (
        selectedMove?.name === "鮮血月蝕終焉光線・零" ||
        selectedMove?.name === "神乃悪魔・零"
    )
        ? "block"
        : "none";


      // 万物を滅ぼす漆黒の神罰・零
const ruinGodRankBox =
    document.getElementById("ruinGodRankBox");

ruinGodRankBox.style.display =
    selectedMove?.name === "万物を滅ぼす漆黒の神罰・零"
        ? "block"
        : "none";

// 終式・破滅虹血剣
const ruinRainbowBloodSwordBox =
    document.getElementById("ruinRainbowBloodSwordBox");
const ruinRainbowBloodSwordPower =
    document.getElementById("ruinRainbowBloodSwordPower");

const isRuinRainbowBloodSword =
    selectedMove?.name === "終式・破滅虹血剣";

const currentFormName = isRuinRainbowBloodSword
    ? (getCurrentFormData(attacker).name || attacker.character.name)
    : "";

ruinRainbowBloodSwordBox.style.display =
    isRuinRainbowBloodSword &&
    !currentFormName.includes("七色虹翼") &&
    !currentFormName.includes("血剣悪魔")
        ? ""
        : "none";

if (isRuinRainbowBloodSword) {
    ruinRainbowBloodSwordPower.innerHTML = "";

    for (let power = 20; power <= 470; power += 15) {
        const option = document.createElement("option");
        option.value = power;
        option.textContent = power;
        ruinRainbowBloodSwordPower.appendChild(option);
    }

    ruinRainbowBloodSwordPower.value = "20";
}
      
if (
    selectedMove.name === "アシストパワー" ||
    selectedMove.name === "地獄突き" ||
    selectedMove.name === "オーロラプリズム・改"
) {

    assistPowerBox.style.display = "";

    assistPower.innerHTML = "";

    if (selectedMove.name === "オーロラプリズム・改") {

        for (let lv = 1; lv <= 10; lv++) {
            const power = lv * 20;

            const option = document.createElement("option");
            option.value = power;
            option.textContent = `${power}（Lv${lv}）`;

            assistPower.appendChild(option);
        }

    } else {

        for (let power = 20; power <= 620; power += 20) {

            const option = document.createElement("option");
            option.value = power;
            option.textContent = power;

            assistPower.appendChild(option);
        }

    }

} else {

    assistPowerBox.style.display = "none";

}

      // 鮮血月蝕終焉光線・零：出血数の選択肢を生成

const bleedCount = document.getElementById("bleedCount");

bleedCount.innerHTML = "";

for (let i = 0; i <= 16; i++) {
    const power =
        selectedMove.name === "神乃悪魔・零"
            ? 60 + i * 5
            : 140 + i * 20;

    bleedCount.innerHTML +=
        `<option value="${i}">${i}（威力${power}）</option>`;
}

      
// 万物を滅ぼす漆黒の神罰・零：ランク数の選択肢
const ruinGodRank =
    document.getElementById("ruinGodRank");

ruinGodRank.innerHTML = "";

for (let i = 0; i <= 60; i++) {
    const power = 60 + i * 30;

    ruinGodRank.innerHTML +=
        `<option value="${i}">${i}（威力${power}）</option>`;
}

      // 零式・レインヴォイドアビス
const voidAbyssPowerBox =
    document.getElementById("voidAbyssPowerBox");

if (selectedMove.name === "零式・レインヴォイドアビス") {
    voidAbyssPowerBox.style.display = "block";
} else {
    voidAbyssPowerBox.style.display = "none";
    document.getElementById("voidAbyssPower").value = "60";
}

      // ヴォイドフォース・ブラックホール・零
const voidForcePowerBox =
    document.getElementById("voidForcePowerBox");

if (selectedMove.name === "ヴォイドフォース・ブラックホール・零") {
    voidForcePowerBox.style.display = "block";
} else {
    voidForcePowerBox.style.display = "none";
    document.getElementById("voidForcePower").value = "100";
}
      
    // 断罪の仮面
    const judgmentMaskBox = document.getElementById("judgmentMaskBox");

    if (selectedAttackAbility?.name === "断罪の仮面") {
        judgmentMaskBox.style.display = "";
    } else {
        judgmentMaskBox.style.display = "none";
        document.getElementById("judgmentMaskRank").value = "0";
    }


const deathCountBox = document.getElementById("deathCountBox");
const deathCount = document.getElementById("deathCount");

if (
    selectedMove.name === "お墓参り" ||
    selectedMove.name === "アポカリプスヘルブレイク" ||
    selectedMove.name === "滅亡龍嵐波" ||
    selectedMove.name === "第零式・滅亡龍雷光" ||
    selectedMove.name === "カタクリズムヘルブレイク・零"
) {

    deathCountBox.style.display = "";

    deathCount.innerHTML = "";

    for (let i = 0; i <= 11; i++) {

        deathCount.innerHTML += `
            <option value="${i}">${i}体</option>
        `;

    }

} else {

    deathCountBox.style.display = "none";

}

const megisosBox = document.getElementById("megisosBox");
const megisos = document.getElementById("megisos");

if (selectedMove.name === "神乃悪魔") {

    megisosBox.style.display = "";

    megisos.innerHTML = "";

    for (let power = 50; power <= 350; power += 50) {
        megisos.innerHTML += `<option value="${power}">${power}</option>`;
    }

} else {

    megisosBox.style.display = "none";

}

const shingekiBox = document.getElementById("shingekiBox");
const shingekiPower = document.getElementById("shingekiPower");

if (selectedMove.name === "神撃") {

    shingekiBox.style.display = "";

    shingekiPower.innerHTML = "";

    [20, 40, 80, 120, 200].forEach(power => {
        shingekiPower.innerHTML += `
            <option value="${power}">${power}</option>
        `;
    });

} else {

    shingekiBox.style.display = "none";

}

const judgementBox = document.getElementById("judgementBox");
const judgementPower = document.getElementById("judgementPower");

if (selectedMove.name === "終焉を告げる赫き神罰") {

    judgementBox.style.display = "";

    judgementPower.innerHTML = "";

    for (let power = 120; power <= 1020; power += 30) {
        judgementPower.innerHTML += `<option value="${power}">${power}</option>`;
    }

} else {

    judgementBox.style.display = "none";

}

const hexOption =
document.getElementById("hexOption");

const hexBoost =
document.getElementById("hexBoost");

if (selectedMove.name === "祟り目") {

    hexOption.style.display = "block";

} else {

    hexOption.style.display = "none";
    hexBoost.checked = false;

}

      // アクロバットのときだけ表示
const acrobaticsBox = document.getElementById("acrobaticsBox");

acrobaticsBox.style.display =
    selectedMove && selectedMove.name === "アクロバット"
        ? "block"
        : "none";

      // アビスメテオのときだけ表示
const abyssMeteorBox =
    document.getElementById("abyssMeteorBox");

abyssMeteorBox.style.display =
    selectedMove.name === "アビスメテオ"
        ? "block"
        : "none";

if (selectedMove.name !== "アビスメテオ") {
    document.getElementById("abyssMeteor").checked = false;
}

      // 光速・シャドウビーム・零
const voidBeamBox = document.getElementById("voidBeamBox");
const voidBeam = document.getElementById("voidBeam");

if (selectedMove.name === "光速・シャドウビーム・零") {
    voidBeamBox.style.display = "block";
} else {
    voidBeamBox.style.display = "none";
    voidBeam.checked = false;
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

function addNoneItemButton(){

    const card = document.createElement("div");
    card.className = "moveCard";

    card.innerHTML = `
        <div class="moveName">なし</div>
    `;

    card.onclick = () => {

        if(itemSide === "attack"){
            selectedAttackItem = null;
            attackerItemButton.textContent = "持ち物を選択";
        }else{
            selectedDefenseItem = null;
            defenderItemButton.textContent = "持ち物を選択";
        }

        searchModal.style.display = "none";
        document.body.style.overflow = "";

        updateScreen();

    };

    searchList.appendChild(card);

}

function addNoneAbilityButton(){

    const card = document.createElement("div");
    card.className = "moveCard";

    card.innerHTML = `
        <div class="moveName">なし</div>
    `;

    card.onclick = () => {

        if(abilitySide === "attack"){
            selectedAttackAbility = null;
            attackerAbilityButton.textContent = "特性を選択";
        }else{
            selectedDefenseAbility = null;
            defenderAbilityButton.textContent = "特性を選択";
        }

      const judgmentMaskBox =
    document.getElementById("judgmentMaskBox");

judgmentMaskBox.style.display = "none";

document.getElementById("judgmentMaskRank").value = "0";

      document.getElementById("ruinMaskBox").style.display = "none";
document.getElementById("ruinMaskHP").value = "1";

        searchModal.style.display = "none";
        document.body.style.overflow = "";

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

      const judgmentMaskBox =
    document.getElementById("judgmentMaskBox");

judgmentMaskBox.style.display =
    ability.name === "断罪の仮面" ? "" : "none";

// 終式・冥界輪廻
const meikaiRinneBox =
    document.getElementById("meikaiRinneBox");

meikaiRinneBox.style.display =
    ability.name === "終式・冥界輪廻" ? "" : "none";
      
const ruinMaskBox =
    document.getElementById("ruinMaskBox");

ruinMaskBox.style.display =
    ability.name === "破滅の神面" ? "" : "none";

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

    const character = getCurrentFormData(attacker);

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

    const character =
    abilitySide === "attack"
        ? attacker.character
        : defender.character;

const specialIds = character.abilities;

const category =
    abilitySide === "attack"
    ? "攻撃"
    : "防御";

const specialAbilities = abilities.filter(ability =>
    specialIds.includes(ability.id) &&
    (
        ability.category === category ||
ability.name === "ウィークアーマー" ||
(
    ability.name === "血虹悪魔" &&
    abilitySide === "defense"
)
    ) &&
    ability.damage
);

const otherAbilities = abilities.filter(ability =>
    !specialIds.includes(ability.id) &&
    (
    ability.category === category ||
    ability.name === "ウィークアーマー" ||
    (
        ability.name === "血虹悪魔" &&
        abilitySide === "defense"
    )
)&&
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

addNoneAbilityButton();

otherAbilities.forEach(addAbilityButton);

}

function drawCharacterList(list){

    searchList.innerHTML = "";

    list.sort((a,b)=>a.id - b.id);

    searchList.innerHTML = "";

    list.forEach(character=>{

        const card = document.createElement("div");
        card.className = "character-card";

        const types = createTypeBadges(character.attribute);

card.innerHTML = `
    <div class="character-header">
        ${character.name}
    </div>

    <div class="character-body">
        ${types}
    </div>
`;

        card.onclick = ()=>{

            
if (selectMode === "attacker") {
    attacker.character = character;
    attacker.formIndex = -1;

    const formButton =
        document.getElementById("attackerFormButton");

    formButton.textContent =
        character.name.match(/[（(].*?[）)]/)
            ? character.name
            : "通常形態";

    formButton.style.display =
        character.forms && character.forms.length > 0
            ? ""
            : "none";

} else {
    defender.character = character;
    defender.formIndex = -1;

    const formButton =
        document.getElementById("defenderFormButton");

    formButton.textContent =
        character.name.match(/[（(].*?[）)]/)
            ? character.name
            : "通常形態";

    formButton.style.display =
        character.forms && character.forms.length > 0
            ? ""
            : "none";
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

addNoneItemButton();

list.forEach(addItemButton);

}

function updateScreen(){

    attackerCharacterButton.textContent =
    attacker.character.name;

    defenderCharacterButton.textContent =
    defender.character.name;

    const usesDefenseAsAttack =
    selectedMove?.effect?.includes("防御力で計算する") ?? false;

const effectiveAttackType = usesDefenseAsAttack
    ? "defense"
    : attackType;

attackStatName.textContent = usesDefenseAsAttack
    ? "防御（攻撃計算）"
    : attackType === "attack" ? "攻撃" : "特攻";

defenseStatName.textContent =
    defenseType === "defense" ? "防御" : "特防";

const atkForm = getCurrentFormData(attacker);
const defForm = getCurrentFormData(defender);


const atkBase =
    atkForm.status[effectiveAttackType] +
    attacker.ev * 5 -
    (
        usesDefenseAsAttack &&
        selectedAttackAbility?.name === "ウィークアーマー"
            ? 20
            : 0
    );



const defBase =
    defForm.status[defenseType] +
    defender.ev * 5 -
    (selectedDefenseAbility?.name === "ウィークアーマー" ? 20 : 0);


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

hpStatValue.textContent = defForm.status.hp;

hpEV.textContent = defender.hpEV;

hpStatValue.textContent = getMaxHP(defender);

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

    const hp = getMaxHP(defender);
    
    let currentHp = hp;
    
    // ステルスグランド
if(document.getElementById("stealthRock").checked){

    const type =
        getTypeEffectiveness(
            "大地",
            defForm.attribute
        );

    let hazardDamage = Math.floor(hp / 8 * type);

if (selectedDefenseAbility?.name === "鋼のおとこ") {
    hazardDamage = Math.max(0, hazardDamage - 18);
}

currentHp -= hazardDamage;

}

const spikes =
    Number(document.getElementById("spikes").value);

if (
    selectedDefenseAbility?.name !== "浮遊" &&
    selectedDefenseItem?.name !== "風船"
) {
    let spikesDamage = 0;

    if (spikes === 1) {
        spikesDamage = Math.floor(hp / 8);
    } else if (spikes === 2) {
        spikesDamage = Math.floor(hp / 6);
    } else if (spikes === 3) {
        spikesDamage = Math.floor(hp / 4);
    }

    if (selectedDefenseAbility?.name === "鋼のおとこ") {
        spikesDamage = Math.max(0, spikesDamage - 18);
    }

    currentHp -= spikesDamage;
}

    if (maxDamage === 0) {

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

  const attackerFormButton =
    document.getElementById("attackerFormButton");

const defenderFormButton =
    document.getElementById("defenderFormButton");

// この2つのボタンの textContent を更新している
// if 文も含めて、追加した処理を全部削除

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

// は？ださすぎだろ：最大HP1.5倍
function getMaxHP(target){

    const form = getCurrentFormData(target);

    let hp =
        form.status.hp +
        target.hpEV * 5;

    if(
        target === defender &&
        selectedDefenseAbility?.name === "は？ださすぎだろ"
    ){
        hp = Math.floor(hp * 1.5);
    }

    return hp;
}

function calculateDamage(){

  const atkForm = getCurrentFormData(attacker);
const defForm = getCurrentFormData(defender);

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
        
        const defForm = getCurrentFormData(defender);
const hp = getMaxHP(defender);

let currentHp = hp;

// ステルスグランド
if(document.getElementById("stealthRock").checked){

    const type =
        getTypeEffectiveness(
            "大地",
            defForm.attribute
        );

    let hazardDamage = Math.floor(hp / 8 * type);

if (selectedDefenseAbility?.name === "鋼のおとこ") {
    hazardDamage = Math.max(0, hazardDamage - 18);
}

currentHp -= hazardDamage;

}

const spikes =
Number(document.getElementById("spikes").value);

if(
    selectedDefenseAbility?.name !== "浮遊" &&
    selectedDefenseItem?.name !== "風船"
){

    if(spikes === 1){
        currentHp -= Math.max(
    0,
    Math.floor(hp / 8) -
        (selectedDefenseAbility?.name === "鋼のおとこ" ? 18 : 0)
);
    }

    if(spikes === 2){
        currentHp -= Math.max(
    0,
    Math.floor(hp / 6) -
        (selectedDefenseAbility?.name === "鋼のおとこ" ? 18 : 0)
);
    }

    if(spikes === 3){
        currentHp -= Math.max(
    0,
    Math.floor(hp / 4) -
        (selectedDefenseAbility?.name === "鋼のおとこ" ? 18 : 0)
);
    }

}

const multiArmor =
    selectedDefenseAbility?.name === "マルチアーマー" &&
    currentHp === hp;
        
        
        const isPhysical = attackType === "attack";
const isSpecial = attackType === "spAttack";

const usesDefenseAsAttack =
    selectedMove?.effect?.includes("防御力で計算する") ?? false;

const atkForm = getCurrentFormData(attacker);

const effectiveAttackType = usesDefenseAsAttack
    ? "defense"
    : attackType;


let attack =
    atkForm.status[effectiveAttackType] +
    attacker.ev * 5;

if (
    usesDefenseAsAttack &&
    selectedAttackAbility?.name === "ウィークアーマー"
) {
    attack -= 20;
}



// 拘りソード
if (
    selectedAttackItem?.name === "拘りソード" &&
    isPhysical &&
    !usesDefenseAsAttack
){
    attack *= 1.5;
    addModifier("拘りソード", 1.5);
}

// 拘りステッキ
if (
    selectedAttackItem?.name === "拘りステッキ" &&
    isSpecial
){
    attack *= 1.5;
    addModifier("拘りステッキ", 1.5);
}


let defense =
    defForm.status[defenseType] +
    defender.ev * 5 -
    (selectedDefenseAbility?.name === "ウィークアーマー" ? 20 : 0);

        
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
    isSpecial
){
    defense *= 1.5;
addModifier("突撃チョッキ", 0.66);
}

let power;

if (
    selectedMove.name === "万物を滅ぼす漆黒の神罰・零"
) {
    const rankCount = Math.min(
        60,
        Math.max(
            0,
            Number(
                document.getElementById("ruinGodRank").value
            ) || 0
        )
    );

    power = 60 + rankCount * 30;

} else if (
    selectedMove.name === "鮮血月蝕終焉光線・零" ||
    selectedMove.name === "神乃悪魔・零"
) {
    const bleedCount = Math.min(
        16,
        Math.max(
            0,
            Number(document.getElementById("bleedCount").value) || 0
        )
    );

    if (selectedMove.name === "神乃悪魔・零") {
        power = 60 + bleedCount * 5;
    } else {
        power = 140 + bleedCount * 20;
    }

  } else if (
    selectedMove.name === "終式・破滅虹血剣"
) {
    const form = getCurrentFormData(attacker);
    const formName = form.name || attacker.character.name;

    if (formName.includes("七色虹翼")) {
        power = 60;
    } else if (formName.includes("血剣悪魔")) {
        power = 100;
    } else {
        power = Number(
            document.getElementById("ruinRainbowBloodSwordPower").value
        ) || 20;
    }

} else if (

    selectedMove.name === "アシストパワー" ||
    selectedMove.name === "地獄突き" ||
    selectedMove.name === "オーロラプリズム・改"
) {

    power = Number(document.getElementById("assistPower").value);

} else if (
    selectedMove.name === "お墓参り"
) {

    const death =
    Number(document.getElementById("deathCount").value);

    power = 50 + death * 50;


} else if (
    selectedMove.name === "アポカリプスヘルブレイク" ||
    selectedMove.name === "滅亡龍嵐波" ||
    selectedMove.name === "カタクリズムヘルブレイク・零"
) {
    const death =
        Number(document.getElementById("deathCount").value);

    power = 150 + death * 50;

} else if (
    selectedMove.name === "第零式・滅亡龍雷光"
) {
    const death =
        Number(document.getElementById("deathCount").value);

    power = 130 + death * 50;

}
 else if (
    selectedMove.name === "神乃悪魔"
) {

    power = Number(
        document.getElementById("megisos").value
    );
    
    const judgementBox = document.getElementById("judgementBox");
const judgementPower = document.getElementById("judgementPower");

} else if (
    selectedMove.name === "終焉を告げる赫き神罰"
) {

    power = Number(
        document.getElementById("judgementPower").value
    );

} else if (
    selectedMove.name === "神撃"
) {

    power = Number(
        document.getElementById("shingekiPower").value
    );

} else if (
    selectedMove.name === "第零式・神撃"
) {

    const form = getCurrentFormData(attacker);
    const formName = form.name || attacker.character.name;

    const charge = Math.min(
        500,
        Math.max(
            0,
            Math.floor(
                Number(
                    document.getElementById("meikaiRinneCharge").value
                ) || 0
            )
        )
    );

    if (formName.includes("新月")) {
        power = 50;
    } else if (
        formName.includes("月魄") &&
        charge >= 300
    ) {
        power = 300;
    } else {
        power = 200;
    }

} else if (
    selectedMove.name === "零式・レインヴォイドアビス"
) {
    power = Number(
        document.getElementById("voidAbyssPower").value
    );

} else if (
    selectedMove.name === "ヴォイドフォース・ブラックホール・零"
) {
    power = Number(
        document.getElementById("voidForcePower").value
    );

   } else if (
    selectedMove.name === "ルシフェルフォースラジェーション・零"
) {
    const lv = Number(
        document.getElementById("hitCount").value
    ) || 1;

    power = 100 + lv * 20;
   
} else {

    power = selectedMove.power;

}

      baseMovePower = power;
      actualMovePower = power;

      // アクロバット
if (
    selectedMove.name === "アクロバット" &&
    document.getElementById("acrobatics").checked
) {
    power *= 2;
    addModifier("アクロバット", 2);
}

      // アビスメテオ
if (
    selectedMove.name === "アビスメテオ" &&
    document.getElementById("abyssMeteor").checked
) {
    power *= 1.5;
    addModifier("アビスメテオ", 1.5);
}

// 祟り目
if (
    selectedMove.name === "祟り目" &&
    document.getElementById("hexBoost").checked
) {
    power *= 2;
    addModifier("祟り目", 2);
}
        
let moveType = getEffectiveMoveType(selectedMove);

const metalShiningLevel =
    selectedMove.name === "第零式・メタルシャイニングブレード"
        ? Number(document.getElementById("hitCount").value)
        : 0;

if (metalShiningLevel >= 5 && metalShiningLevel <= 9) {
    power = 160;
    moveType = ["聖"];
} else if (metalShiningLevel === 10) {
    power = 120;
    moveType = ["鋼"];
}

baseMovePower = power;
actualMovePower = power;
      
// テクニシャン
if(
    selectedAttackAbility?.name === "テクニシャン" &&
    power <= 60
){
    power *= 1.5;
addModifier("テクニシャン", 1.5);
}

      // 赫虹剣：虹・ブラッド属性の技威力1.1倍
if (
    selectedAttackAbility?.name === "赫虹剣" &&
    (
        moveType.includes("虹") ||
        moveType.includes("ブラッド")
    )
) {
    power *= 1.1;
    addModifier("赫虹剣", 1.1);
}

// クリスタルブレード
if (
    selectedAttackAbility?.name === "クリスタルブレード" &&
    isPhysical
){
    power *= 1.2;
addModifier("クリスタルブレード", 1.2);
}

// 斬れ味
if(
    selectedAttackAbility?.name === "斬れ味" &&
    isPhysical
){
    power *= 1.3;
addModifier("斬れ味", 1.3);
}

      // メタルライトデュアルソード
if (
    selectedAttackAbility?.name === "メタルライトデュアルソード" &&
    isPhysical
) {
    power *= 1.2;
    addModifier("メタルライトデュアルソード", 1.2);
}

//アビスメテオ
if(
    selectedMove.name === "アビスメテオ" &&
    selectedDefenseItem
){

    power *= 1.5;
    addModifier("アビスメテオ", 1.5);

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

        const isTerastal = attackerTeraType !== "";

const hasOriginalStab = moveType.some(type =>
    atkForm.attribute.includes(type)
);

const hasTeraStab =
    isTerastal && moveType.includes(attackerTeraType);

let stab;

if (isTerastal) {
    if (hasOriginalStab && hasTeraStab) {
        stab = 2;
        addModifier("属性一致＋テラスタル一致", 2);
    } else if (hasOriginalStab) {
        stab = 1.5;
        addModifier("属性一致", 1.5);
    } else if (hasTeraStab) {
        stab = 1.5;
        addModifier("テラスタル一致", 1.5);
    } else {
        stab = 1;
    }
} else {
    stab = hasOriginalStab ? 1.5 : 1;

    if (hasOriginalStab) {
        addModifier("属性一致", 1.5);
    }
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


const effectiveDefAttribute = defenderTeraType
    ? [defenderTeraType]
    : defForm.attribute;

let type = getTypeEffectiveness(
    moveType,
    effectiveDefAttribute
);

// 雷の力：大地属性による雷技の無効を無視
if (
    selectedAttackAbility?.name === "雷の力" &&
    moveType.includes("雷") &&
    effectiveDefAttribute.includes("大地") &&
    type === 0
) {
    const otherAttributes =
    effectiveDefAttribute.filter(
        attribute => attribute !== "大地"
    );

    type = otherAttributes.length > 0
        ? getTypeEffectiveness(
            moveType,
            otherAttributes
        )
        : 1;
}


// フリーズドライ（水属性に弱点を突く）
if (
    selectedMove.name === "フリーズドライ" &&
    moveType.includes("氷") &&
    effectiveDefAttribute.includes("水")
) {
    type *= 4;
}


// 弱点追加
let finalType = type;

const moonWeakActive =
    document.getElementById("moonWeak").checked &&
    moveType.includes("月");

const holyWeakActive =
    document.getElementById("holyWeak").checked &&
    moveType.includes("聖");

      const waterWeakActive =
    document.getElementById("waterWeak").checked &&
    moveType.includes("水");

const poisonWeakActive =
    document.getElementById("poisonWeak").checked &&
    moveType.includes("毒");

// 対象属性の技は、相性を最低でも弱点（2倍）にする
if (
    (
        moonWeakActive ||
        holyWeakActive ||
        waterWeakActive ||
        poisonWeakActive
    ) &&
    finalType < 2
) {
    finalType = 2;
}

// 補正表示
if (moonWeakActive) {
    addModifier("月弱点追加", 2);
}

if (holyWeakActive) {
    addModifier("聖弱点追加", 2);
}

      if (waterWeakActive) {
    addModifier("水弱点追加", 2);
}

if (poisonWeakActive) {
    addModifier("毒弱点追加", 2);
}


const isMetalShiningLv10 =
    selectedMove.name === "第零式・メタルシャイニングブレード" &&
    metalShiningLevel === 10;

// Lv10は1発ごとに属性別の相性を表示する
if (!isMetalShiningLv10) {
    if (
        !moonWeakActive &&
        !holyWeakActive &&
        !waterWeakActive &&
        !poisonWeakActive
    ) {
        if (type > 1) {
            addModifier(`弱点（${moveType.join("・")}属性）`, type);
        } else if (type > 0 && type < 1) {
            addModifier(`耐性（${moveType.join("・")}属性）`, type);
        } else if (type === 0) {
            addModifier(`無効（${moveType.join("・")}属性）`, 0);
        }
    }
}




const hitCount =
    selectedMove.name === "第零式・メタルシャイニングブレード"
        ? (metalShiningLevel === 10 ? 2 : 1)
        : selectedMove.name === "ブリリアントフォース・改"
            ? Number(document.getElementById("hitCount").value)
            : selectedMove.hits
                ? (
                    selectedMove.hits[0] === selectedMove.hits[1]
                        ? selectedMove.hits[0]
                        : Number(document.getElementById("hitCount").value)
                )
                : 1;

// 鋼のおとこ：攻撃回数に応じた軽減量を表示
if (selectedDefenseAbility?.name === "鋼のおとこ") {
    modifiers.push({
        name: "鋼のおとこ",
        value: `-${18 * hitCount}`
    });
}

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




let hitDamage =
    power * attackNow / defenseNow / 2;

if (
    selectedMove.name === "第零式・メタルシャイニングブレード" &&
    metalShiningLevel === 10
) {
    // 1発目は鋼、2発目は聖
    const hitType = hit === 1 ? "鋼" : "聖";

    const hitEffectiveness = getTypeEffectiveness(
        [hitType],
        defForm.attribute
    );

  
if (hitEffectiveness > 1) {
    addModifier(`弱点（${hitType}属性）`, hitEffectiveness);
} else if (hitEffectiveness > 0 && hitEffectiveness < 1) {
    addModifier(`耐性（${hitType}属性）`, hitEffectiveness);
} else if (hitEffectiveness === 0) {
    addModifier(`無効（${hitType}属性）`, 0);
}


    const hitStab = atkForm.attribute.includes(hitType)
        ? (isTerastal ? 2 : 1.5)
        : (isTerastal ? 1.5 : 1);

    hitDamage *= hitStab;
    hitDamage *= hitEffectiveness;

    // その属性に耐性がある場合だけ、その攻撃を3倍
    const hasResistance =
        defender.character.resistance?.includes(hitType) ||
        (hitEffectiveness > 0 && hitEffectiveness < 1);

    if (hasResistance) {
        hitDamage *= 3;
        addModifier(`第零式・メタルシャイニングブレード（${hitType}耐性）`, 3);
    }
} else {
    hitDamage *= stab;
    hitDamage *= finalType;
}


      // 風霧空間：風技のダメージ1.3倍
if (
    document.getElementById("battleField").value === "windMist" &&
    moveType.includes("風")
) {
    hitDamage *= 1.3;
    addModifier("風霧空間", 1.3);
}

      // ゲイルカルネージ・改：相手のHPを追加で30減らす
if (selectedMove.name === "ゲイルカルネージ・改") {
    hitDamage += 30;

    if (!modifiers.some(m => m.name === "ゲイルカルネージ・改")) {
        modifiers.push({
            name: "ゲイルカルネージ・改",
            value: "+30"
        });
    }
}

      // シャドウカルネージ：相手のHPを追加で10減らす
if (selectedMove.name === "シャドウカルネージ") {
    hitDamage += 10;

    if (!modifiers.some(m => m.name === "シャドウカルネージ")) {
        modifiers.push({
            name: "シャドウカルネージ",
            value: "+10"
        });
    }
}

// デスオーラ
if (
    moveType.includes("ブラッド") &&
    document.getElementById("deathAura").checked
){
    hitDamage *= 1.33;
    addModifier("デスオーラ", 1.33);
}


if (selectedMove.name === "ヘルファイアブレード") {

    const defForm = getCurrentFormData(defender);

    const hasFireResistance =
        defender.character.resistance?.includes("炎") ||
        getTypeEffectiveness("炎", defForm.attribute) < 1;

    if (hasFireResistance) {
        hitDamage *= 2;
        addModifier("ヘルファイアブレード", 2);
    }

}

      // デスルインブレード・改
if (selectedMove.name === "デスルインブレード・改") {

    const defForm = getCurrentFormData(defender);

    const hasDarkResistance =
        defender.character.resistance?.includes("闇") ||
        getTypeEffectiveness("闇", defForm.attribute) < 1;

    if (hasDarkResistance) {
        hitDamage *= 2;
        addModifier("デスルインブレード・改", 2);
    }

}


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
        ||
        selectedMove.target === "2体"
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

      // レインボーオーラ・改（2倍）
if (
    document.getElementById("rainbowAura2").checked &&
    moveType.includes("虹")
) {
    hitDamage *= 2;
    addModifier("レインボーオーラ・改（2倍）", 2);
}

// レインボーオーラ・改（3倍）
if (
    document.getElementById("rainbowAura3").checked &&
    moveType.includes("虹")
) {
    hitDamage *= 3;
    addModifier("レインボーオーラ・改（3倍）", 3);
}

      
 // 七色光衣・終（虹）：虹技の威力2.5倍
if (
    document.getElementById("rainbowClothingEnd").checked &&
    moveType.includes("虹")
) {
    hitDamage *= 2.5;
    addModifier("七色光衣・終（虹）", 2.5);
}

// 七色光衣・終（血）：ブラッド技の威力2.5倍
if (
    document.getElementById("bloodClothingEnd").checked &&
    moveType.includes("ブラッド")
) {
    hitDamage *= 2.5;
    addModifier("七色光衣・終（血）", 2.5);
}


      // カオストルネード・改（次の技の威力1.2倍）
if (
    document.getElementById("chaosTornadoBoost")?.checked
) {
    hitDamage *= 1.2;
    addModifier("カオストルネード・改", 1.2);
}

      // 鮮血凶風加護・零（技威力2倍）
if (
    document.getElementById("bloodStormBoost")?.checked
) {
    hitDamage *= 2;
    addModifier("鮮血凶風加護・零", 2);
}

      // 破滅の災い・改
if (
    document.getElementById("ruinHoly").checked &&
    moveType.includes("聖")
) {
    hitDamage *= 2.5;
    addModifier("破滅の災い・改", 2.5);
}
      
 // ブラッドムーンルインレイ
if (document.getElementById("bloodMoonRuinRay").checked) {
    hitDamage *= 1.3;
    addModifier("ブラッドムーンルインレイ", 1.3);
}

      
// 暴走（攻撃）
if (document.getElementById("berserkAttack").checked) {
    hitDamage *= 1.2;
    addModifier("暴走（攻撃）", 1.2);
}

// 暴走（防御）
if (document.getElementById("berserkDefense").checked) {
    hitDamage *= 1.2;
    addModifier("暴走（防御）", 1.2);
}
      

// シャドウバースト
if (document.getElementById("shadowBurst").checked) {
    hitDamage *= 2;
    addModifier("シャドウバースト", 2);
}

      // サイクロンバースト・零
if (document.getElementById("cycloneBurst").checked) {
    hitDamage *= 2;
    addModifier("サイクロンバースト・零", 2);
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
    isPhysical
) {
    hitDamage *= 0.5;
addModifier("炎上", 0.5);
}

// 永遠の呪い
if (document.getElementById("eternalCurse").checked) {
    hitDamage *= 0.8;
addModifier("永遠の呪い", 0.8);
}

// 永遠の灯火
if (document.getElementById("eternalFlame").checked) {
    hitDamage *= 1.5;
    addModifier("永遠の灯火", 1.5);
}

//石像
if (document.getElementById("stoneStatue").checked) {
    hitDamage *= 1.5;
    addModifier("石像", 1.5);
}

// 絶対的忠誠心
if (document.getElementById("absoluteLoyalty").checked) {
    hitDamage *= 1.5;
    addModifier("絶対的忠誠心", 1.5);
}

     
 // 断罪の仮面
if (selectedAttackAbility?.name === "断罪の仮面") {
    const rank = Number(
        document.getElementById("judgmentMaskRank").value
    );

    const multiplier = 1 + rank * 0.3;

    console.log("断罪の仮面:", {
        ability: selectedAttackAbility?.name,
        rank,
        multiplier
    });

    if (rank > 0) {
        hitDamage *= multiplier;
        addModifier("断罪の仮面", multiplier);
    }
}

      // 破滅の神面
if (selectedAttackAbility?.name === "破滅の神面") {
    const multiplier = Number(
        document.getElementById("ruinMaskHP").value
    );

    if (multiplier > 1) {
        hitDamage *= multiplier;
        addModifier("破滅の神面", multiplier);
    }
}

      // 終式・冥界輪廻
if (selectedAttackAbility?.name === "終式・冥界輪廻") {
    const charge = Math.min(
        500,
        Math.max(
            0,
            Math.floor(
                Number(
                    document.getElementById("meikaiRinneCharge").value
                ) || 0
            )
        )
    );

    const multiplier =
        charge <= 20 ? 0.2 : charge / 100;

    hitDamage *= multiplier;

    addModifier("終式・冥界輪廻", multiplier);
}

        
        // マルチアーマー
if (
    selectedDefenseAbility?.name === "マルチアーマー" &&
    hpNow === hp
) {
    hitDamage *= 0.5;
}

      // アイアンアーマー
if (
    selectedDefenseAbility?.name === "アイアンアーマー"
) {
    hitDamage *= 0.8;
    addModifier("アイアンアーマー", 0.8);
}

      // アルファストーン
if (
    selectedDefenseAbility?.name === "アルファストーン" &&
    selectedMove.type?.some(type =>
        ["炎", "水", "雷"].includes(type)
    )
) {
    hitDamage *= 0.5;
    addModifier("アルファストーン", 0.5);
}

// オメガストーン
if (
    selectedDefenseAbility?.name === "オメガストーン" &&
    selectedMove.type?.some(type =>
        ["聖", "ブラッド", "ゴースト"].includes(type)
    )
) {
    hitDamage *= 0.5;
    addModifier("オメガストーン", 0.5);
}

      
      // 絶対的忠誠心（南武が持ち、東葉へのダメージを半減）
if (
    selectedAttackAbility?.name === "絶対的忠誠心" &&
    defender.character.name === "東葉"
) {
    hitDamage *= 0.5;
    addModifier("絶対的忠誠心", 0.5);
}

// 血虹悪魔：血剣悪魔形態は被ダメージ1.2倍
const defenderFormName =
    getCurrentFormData(defender).name || defender.character.name;

if (
    selectedDefenseAbility?.name === "血虹悪魔" &&
    defenderFormName.includes("血剣悪魔")
) {
    hitDamage *= 1.2;
    addModifier("血虹悪魔", 1.2);
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

      // 鋼のおとこ：受けるダメージを1ヒットごとに18軽減
if (selectedDefenseAbility?.name === "鋼のおとこ") {
    hitDamage = Math.max(0, hitDamage - 18);
    
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
        isPhysical &&
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

      if (damage <= 0) {
    return {
        hit: Infinity,
        berryUsed: false
    };
}

    const defForm = getCurrentFormData(defender);
const hp = getMaxHP(defender);

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
    isPhysical &&
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
    (
    ability.category === category ||
    ability.name === "ウィークアーマー" ||
    (
        ability.name === "血虹悪魔" &&
        abilitySide === "defense"
    )
)&&
    ability.damage &&
    (
        ability.name.includes(keyword) ||
        ability.kana.includes(keyword) ||
        ability.effect.includes(keyword)
    )
);


const otherAbilities = abilities.filter(ability =>
    !specialIds.includes(ability.id) &&
    (
        (
    ability.category === category ||
    ability.name === "ウィークアーマー" ||
    (
        ability.name === "血虹悪魔" &&
        abilitySide === "defense"
    )
)
    ) &&
    ability.damage &&
    (
        ability.name.includes(keyword) ||
        ability.kana.includes(keyword) ||
        ability.effect.includes(keyword)
    )
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

addNoneItemButton();

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

// フィールド
document.getElementById("battleField").onchange = () => {
    updateScreen();
};

//レインボーオーラ
document.getElementById("rainbowAura").onchange = () => {
    updateScreen();
};

// カオストルネード・改
document.getElementById("chaosTornadoBoost").onchange = () => {
    updateScreen();
};

// 鮮血凶風加護・零
document.getElementById("bloodStormBoost").onchange = () => {
    updateScreen();
};

//レインボーオーラ・ビッグバン
document.getElementById("bigBang").onchange = () => {
    updateScreen();
};

// レインボーオーラ・改（2倍）
document.getElementById("rainbowAura2").onchange = () => {
    updateScreen();
};

// レインボーオーラ・改（3倍）
document.getElementById("rainbowAura3").onchange = () => {
    updateScreen();
};


 // 七色光衣・終：チェック時にダメージを更新
document.getElementById("rainbowClothingEnd").addEventListener("change", () => {
    updateScreen();
});

document.getElementById("bloodClothingEnd").addEventListener("change", () => {
    updateScreen();
});


// 破滅の災い・改
document.getElementById("ruinHoly").onchange = () => {
    updateScreen();
};

 // ブラッドムーンルインレイ
document.getElementById("bloodMoonRuinRay").onchange = () => {
    updateScreen();
};


 // 暴走（攻撃）
document.getElementById("berserkAttack").onchange = () => {
    updateScreen();
};

// 暴走（防御）
document.getElementById("berserkDefense").onchange = () => {
    updateScreen();
};


// シャドウバースト
document.getElementById("shadowBurst").onchange = () => {
    updateScreen();
};

// サイクロンバースト・零
document.getElementById("cycloneBurst").onchange = () => {
    updateScreen();
};

// 零式・レインヴォイドアビス
document.getElementById("voidAbyssPower").onchange = () => {
    updateScreen();
};

// ヴォイドフォース・ブラックホール・零
document.getElementById("voidForcePower").onchange = () => {
    updateScreen();
};

// 万物を滅ぼす漆黒の神罰・零
document.getElementById("ruinGodRank").addEventListener("change", () => {
    updateScreen();
});

//連続技
document.getElementById("hitCount").onchange = () => {
    updateScreen();
};

//能力上昇火力
document.getElementById("assistPower").onchange = updateScreen;

document.getElementById("ruinRainbowBloodSwordPower").onchange =
    updateScreen;

document.getElementById("bleedCount").onchange = updateScreen;

document.getElementById("deathCount").onchange = updateScreen;

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
    attacker.character.name.replace(/[（(].*?[）)]/g, "");

    document.getElementById("detailMove").textContent =
        selectedMove.name;

    document.getElementById("detailAbility").textContent =
        selectedAttackAbility?.name ?? "なし";

    document.getElementById("detailItem").textContent =
        selectedAttackItem?.name ?? "なし";

    document.getElementById("detailAttack").textContent =
        attackStatValue.textContent;

    const attackerAttributes = getCurrentFormData(attacker).attribute;

document.getElementById("detailType").innerHTML =
    createTypeBadges(attackerAttributes) +
    (attackerTeraType
        ? ' <span style="font-weight:bold;">➝</span> ' +
          createTypeBadges([attackerTeraType])
        : "");

    
const detailMoveType =
    document.getElementById("detailMoveType");

if (
    selectedMove.name === "第零式・メタルシャイニングブレード" &&
    Number(document.getElementById("hitCount").value) === 10
) {
    detailMoveType.innerHTML =
        createTypeBadges(["鋼"]) +
        ' <span style="font-weight:bold;">➝</span> ' +
        createTypeBadges(["聖"]);
} else if (
    selectedMove.name === "第零式・メタルシャイニングブレード" &&
    Number(document.getElementById("hitCount").value) >= 5
) {
    detailMoveType.innerHTML = createTypeBadges(["聖"]);
} else {
    detailMoveType.innerHTML =
        createTypeBadges(getEffectiveMoveType(selectedMove));
}

        
        document.getElementById("detailDefender").textContent =
    defender.character.name.replace(/[（(].*?[）)]/g, "");

document.getElementById("detailDefenderAbility").textContent =
    selectedDefenseAbility?.name ?? "なし";

document.getElementById("detailDefenderItem").textContent =
    selectedDefenseItem?.name ?? "なし";

document.getElementById("detailDefenderHP").textContent =
    defender.character.status.hp + defender.hpEV * 5;

document.getElementById("detailDefense").textContent =
    defenseStatValue.textContent;

const defenderAttributes = getCurrentFormData(defender).attribute;

document.getElementById("detailDefenderType").innerHTML =
    createTypeBadges(defenderAttributes) +
    (defenderTeraType
        ? ' <span style="font-weight:bold;">➝</span> ' +
          createTypeBadges([defenderTeraType])
        : "");
    
    const damages = calculateDamage();

  document.getElementById("detailPower").textContent =
    baseMovePower;

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

//永遠の灯火
document.getElementById("eternalFlame").onchange = () => {
    updateScreen();
};

//絶対的忠誠心
document.getElementById("absoluteLoyalty").onchange = () => {
    updateScreen();
};

//祟り目
document.getElementById("hexBoost").onchange = updateScreen;

// アクロバット
document.getElementById("acrobatics").onchange = () => {
    updateScreen();
};

// アビスメテオ
document.getElementById("abyssMeteor").onchange = () => {
    updateScreen();
};

// 光速・シャドウビーム・零
document.getElementById("voidBeam").onchange = () => {
    updateScreen();
};

//デスオーラ
document.getElementById("deathAura").onchange = () => {
    updateScreen();
};

//メギソズ
document.getElementById("megisos").onchange = updateScreen;

//終焉を告げる赫き神罰
document.getElementById("judgementPower").onchange = updateScreen;

//月弱点追加
document.getElementById("moonWeak").onchange = updateScreen;

// 聖弱点追加
document.getElementById("holyWeak").onchange = updateScreen;

// 水弱点追加
document.getElementById("waterWeak").onchange = updateScreen;

// 毒弱点追加
document.getElementById("poisonWeak").onchange = updateScreen;

// 神撃
document.getElementById("shingekiPower").onchange = updateScreen;

//石像
document.getElementById("stoneStatue").onchange = updateScreen;

document.getElementById("meikaiRinneCharge").oninput = () => {
    const charge = Math.min(
        500,
        Math.max(
            0,
            Math.floor(
                Number(
                    document.getElementById("meikaiRinneCharge").value
                ) || 0
            )
        )
    );

    const multiplier = charge <= 20 ? 0.2 : charge / 100;

    document.getElementById("meikaiRinneMultiplier").textContent =
        `ダメージ倍率：${multiplier.toFixed(1)}倍`;

    updateScreen();
};


function changeForm(side) {
    const data = side === "attack" ? attacker : defender;
    const character = data.character;

    if (!character.forms || character.forms.length === 0) {
        return;
    }

    data.formIndex++;

    if (data.formIndex >= character.forms.length) {
        data.formIndex = -1;
    }

    const button = document.getElementById(
        side === "attack"
            ? "attackerFormButton"
            : "defenderFormButton"
    );

    const form = getCurrentFormData(data);

    button.textContent =
    data.formIndex === -1
        ? (
            character.name.match(/[（(].*?[）)]/)
                ? character.name
                : "通常形態"
          )
        : form.name;

    updateScreen();
}

document.getElementById("attackerFormButton").onclick = () => {
    changeForm("attack");
};

document.getElementById("defenderFormButton").onclick = () => {
    changeForm("defense");
};



for (let i = 0; i <= 30; i++) {
    const option = document.createElement("option");

    option.value = i;
    option.textContent = `${i * 30}%`;

    judgmentMaskRank.appendChild(option);
}

judgmentMaskRank.value = "0";

judgmentMaskRank.onchange = updateScreen;

document.getElementById("ruinMaskHP").onchange = updateScreen;

const teraTypes = [
    "おとこ",
    "無",
    "炎",
    "雷",
    "水",
    "風",
    "ブラッド",
    "月",
    "氷",
    "ゴースト",
    "聖",
    "闇",
    "鋼",
    "毒",
    "大地",
    "虹",
    "龍",
    "幻"
];

function selectTeraType(side) {
    const current =
        side === "attacker" ? attackerTeraType : defenderTeraType;

    const modal = document.createElement("div");
    modal.className = "teraModal";

    modal.innerHTML = `
        <div class="teraModalContent">
            <h3>テラスタイプを選択</h3>
            <div class="teraTypeGrid"></div>
            <button class="teraCancel">キャンセル</button>
        </div>
    `;

    const grid = modal.querySelector(".teraTypeGrid");

    const choices = ["なし", ...teraTypes];

    choices.forEach(type => {
    const button = document.createElement("button");
    const value = type === "なし" ? "" : type;

    button.className = "teraTypeOption";

    if (value === "虹") {
        button.innerHTML = `
            <span class="attribute-虹-wrap">
                <span class="attribute attribute-虹">虹</span>
            </span>
        `;
    } else if (value) {
        button.innerHTML =
            `<span class="attribute attribute-${value}">${value}</span>`;
    } else {
        button.textContent = "なし";
        button.classList.add("teraNone");
    }

    if (value === current) {
        button.classList.add("selected");
    }

    button.onclick = () => {
        if (side === "attacker") {
            attackerTeraType = value;
        } else {
            defenderTeraType = value;
        }

        document.getElementById(
            side === "attacker"
                ? "attackerTeraButton"
                : "defenderTeraButton"
        ).textContent = `テラスタイプ：${value || "なし"}`;

        modal.remove();
document.body.style.overflow = "";
        updateScreen();
    };

    grid.appendChild(button);
    });

    modal.querySelector(".teraCancel").onclick = () => {
        modal.remove();
document.body.style.overflow = "";
    };

    modal.onclick = event => {
        if (event.target === modal) modal.remove();
document.body.style.overflow = "";
    };

    document.body.appendChild(modal);
document.body.style.overflow = "hidden";
}

document.getElementById("attackerTeraButton").onclick = function() {
    selectTeraType("attacker");
};

document.getElementById("defenderTeraButton").onclick = function() {
    selectTeraType("defender");
};


document.getElementById("swapSidesButton").addEventListener("click", () => {
    // キャラクターと形態を入れ替え
    [attacker.character, defender.character] =
        [defender.character, attacker.character];

    [attacker.formIndex, defender.formIndex] =
        [defender.formIndex, attacker.formIndex];

    // テラスタイプもキャラクターと一緒に入れ替え
    [attackerTeraType, defenderTeraType] =
        [defenderTeraType, attackerTeraType];

    // 形態変化ボタンの表示を更新
    const attackerFormButton =
        document.getElementById("attackerFormButton");
    const defenderFormButton =
        document.getElementById("defenderFormButton");

    attackerFormButton.style.display =
        attacker.character.forms?.length > 0 ? "" : "none";
    defenderFormButton.style.display =
        defender.character.forms?.length > 0 ? "" : "none";

    attackerFormButton.textContent =
        attacker.formIndex >= 0
            ? (attacker.character.forms[attacker.formIndex].name ||
               attacker.character.name)
            : (attacker.character.name.match(/[（(].*?[）)]/)
                ? attacker.character.name
                : "通常形態");

    defenderFormButton.textContent =
        defender.formIndex >= 0
            ? (defender.character.forms[defender.formIndex].name ||
               defender.character.name)
            : (defender.character.name.match(/[（(].*?[）)]/)
                ? defender.character.name
                : "通常形態");

    // テラスタイプの表示を更新
    document.getElementById("attackerTeraButton").textContent =
        `テラスタイプ：${attackerTeraType || "なし"}`;

    document.getElementById("defenderTeraButton").textContent =
        `テラスタイプ：${defenderTeraType || "なし"}`;

    updateScreen();
});
