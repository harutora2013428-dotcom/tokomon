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
    ev: 0,
    rank: 0
};

let attackType = "attack";
let defenseType = "defense";

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

const attackRank =
document.getElementById("attackRank");

const defenseRank =
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

const moveButton =
document.getElementById("moveButton");

let selectedMove = null;

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

    searchInput.value = "";

    drawMoveList();

    searchModal.style.display = "flex";

    document.body.style.overflow = "hidden";

}

function addMoveButton(move){

    const card = document.createElement("div");
    card.className = "moveCard";

    card.innerHTML = `
        <div class="moveName">${move.name}</div>

        <div class="moveInfo">

            <span class="attribute attribute-${move.type}">
    ${move.type}
</span>

            <span class="move-kind-tag move-kind-${move.kind}">
    ${move.kind}
</span>

            <span class="move-category-tag move-category-${move.category}">
    ${move.category}
</span>

            <span class="moveTag">威力 ${move.power}</span>

            <span class="moveTag">命中 ${
                move.accuracy === 0 ? "—" : move.accuracy
            }</span>

        </div>

        <div class="moveEffect">
            ${move.effect.trim()}
        </div>
    `;

    card.onclick = ()=>{

        selectedMove = move;

        moveButton.textContent = move.name;

        if(move.category==="物理"){
            attackType="attack";
            defenseType="defense";
        }else{
            attackType="spAttack";
            defenseType="spDefense";
        }

        searchModal.style.display="none";
        document.body.style.overflow="";
        updateScreen();

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

const atkStat =
Math.floor(atkBase * getRankMultiplier(attacker.rank));

const defStat =
Math.floor(defBase * getRankMultiplier(defender.rank));

attackStatValue.textContent = atkStat;

defenseStatValue.textContent = defStat;

    attackEV.textContent =
    attacker.ev;

    defenseEV.textContent =
    defender.ev;

    attackRank.textContent =
    attacker.rank > 0 ?
    "+" + attacker.rank :
    attacker.rank;

    defenseRank.textContent =
    defender.rank > 0 ?
    "+" + defender.rank :
    defender.rank;

}

updateScreen();

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

    // キャラクター選択中
    if(searchList.querySelector(".character-card")){

        const result = characters.filter(character =>
            character.name.includes(keyword)
        );

        drawCharacterList(result);

        return;
    }

    // 技選択中
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
        move.kana.includes(keyword)
    )
);

const otherMoves = moves.filter(move =>
    !specialIds.includes(move.id) &&
    move.category !== "変化" &&
    (
        move.name.includes(keyword) ||
        move.kana.includes(keyword)
    )
);

    const title1 = document.createElement("h3");
    title1.textContent = "★ 覚える技";
    searchList.appendChild(title1);

    specialMoves.forEach(addMoveButton);

    const hr = document.createElement("hr");
    searchList.appendChild(hr);

    const title2 = document.createElement("h3");
    title2.textContent = "その他の技";
    searchList.appendChild(title2);

    otherMoves.forEach(addMoveButton);
    
    if (specialMoves.length === 0 && otherMoves.length === 0) {

    const message = document.createElement("div");
    message.className = "noResult";
    message.textContent = "🔍 該当する技はありませんでした。";

    searchList.appendChild(message);

}

};