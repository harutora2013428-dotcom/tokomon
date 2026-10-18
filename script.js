// ======================
// とこモンバトル図鑑 Ver.3
// Part1 共通設定・共通関数
// ======================

// 要素取得
const characterList = document.getElementById("character-list");
const detail = document.getElementById("detail");
const abilityDetail = document.getElementById("ability-detail");
const moveDetail = document.getElementById("move-detail");
const search = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");
const sort = document.getElementById("sort");
const itemDetail = document.getElementById("item-detail");

// 全属性
const allTypes = [
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
    "幻",
];


 // 属性バッジ作成
function createTypeBadges(types) {
    if (!Array.isArray(types)) {
        types = [types];
    }

    return types.map(type => {
        if (type === "虹") {
            return `<span class="attribute-虹-wrap"><span class="attribute attribute-虹">虹</span></span>`;
        }

        return `<span class="attribute attribute-${type}">${type}</span>`;
    }).join(" ");
}


// 属性相性取得
function getTypeRate(moveType, defendTypes){

    if(!Array.isArray(defendTypes)){
        defendTypes = [defendTypes];
    }

    return getTypeEffectiveness(moveType, defendTypes);

}

// 弱点・耐性取得
function getTypeRelations(defendTypes){

    const weakness = [];
    const resistance = [];
    const immunity = [];

    allTypes.forEach(type=>{

        const rate = getTypeRate(type, defendTypes);

        if(rate === 4){
            weakness.push(`${type} ×4`);
        }else if(rate === 2){
            weakness.push(`${type} ×2`);
        }else if(rate === 0.5){
            resistance.push(`${type} ×0.5`);
        }else if(rate === 0.25){
            resistance.push(`${type} ×0.25`);
        }else if(rate === 0){
            immunity.push(type);
        }

    });

    // 4倍弱点を一番左にする
    weakness.sort((a, b) => {
        const rateA = Number(a.split("×")[1]);
        const rateB = Number(b.split("×")[1]);
        return rateB - rateA;
    });

    // 0.25倍耐性を一番右にする
    resistance.sort((a, b) => {
        const rateA = Number(a.split("×")[1]);
        const rateB = Number(b.split("×")[1]);
        return rateB - rateA;
    });

    return {
        weakness,
        resistance,
        immunity
    };

}

// URLからID取得
function getCharacterId(){

    const params = new URLSearchParams(location.search);

    return Number(params.get("id"));

}

function getItemId(){

    const params = new URLSearchParams(location.search);

    return Number(params.get("id"));

}

// URLから特性ID取得
function getAbilityId(){

    const params = new URLSearchParams(location.search);

    return Number(params.get("id"));

}

// URLから技ID取得
function getMoveId(){

    const params = new URLSearchParams(location.search);

    return Number(params.get("id"));

}

// ======================
// 一覧ページの状態保存
// ======================

function saveListState(key, state){

    localStorage.setItem(key, JSON.stringify({
        ...state,
        scroll: window.scrollY
    }));

}

function loadListState(key){

    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : null;

}

// ======================
// Part2 キャラクター一覧
// ======================

// 一覧表示
function displayCharacters(list){

    if(!characterList) return;

    characterList.innerHTML = "";

    if(list.length === 0){
        characterList.innerHTML = "<p>キャラクターが見つかりません。</p>";
        return;
    }

    list.forEach(c=>{

        characterList.innerHTML += `
        <div class="character-card">

            <div class="character-header">
                No.${String(c.id).padStart(3,"0")}　${c.name}
            </div>

            <div class="character-body">

                <div class="character-type">
                    ${createTypeBadges(c.attribute)}
                </div>

                <div class="character-stats">

                    <div class="stat-box">
                        <div class="stat-name">HP</div>
                        <div class="stat-value">${c.status.hp}</div>
                    </div>

                    <div class="stat-box">
                        <div class="stat-name">攻撃</div>
                        <div class="stat-value">${c.status.attack}</div>
                    </div>

                    <div class="stat-box">
                        <div class="stat-name">防御</div>
                        <div class="stat-value">${c.status.defense}</div>
                    </div>

                    <div class="stat-box">
                        <div class="stat-name">特攻</div>
                        <div class="stat-value">${c.status.spAttack}</div>
                    </div>

                    <div class="stat-box">
                        <div class="stat-name">特防</div>
                        <div class="stat-value">${c.status.spDefense}</div>
                    </div>

                    <div class="stat-box">
                        <div class="stat-name">速度</div>
                        <div class="stat-value">${c.status.speed}</div>
                    </div>

                </div>

                <button class="detail-button"
    onclick="openCharacter(${c.id})">
                    詳細を見る
                </button>

            </div>

        </div>
        `;

    });

}

function openCharacter(id){

    saveListState("characterList",{
    type: typeFilter ? typeFilter.value : "",
    sort: sort ? sort.value : ""
});

    location.href = `detail.html?id=${id}`;

}

// ======================
// Part3 検索・並び替え
// ======================

function updateCharacters(){

    let list = [...characters];

    // 名前検索
    if(search && search.value.trim() !== ""){
        const keyword = search.value.trim().toLowerCase();

        list = list.filter(c =>
    c.name.toLowerCase().includes(keyword) ||
    c.kana.toLowerCase().includes(keyword)
);
    }

    // 属性検索
    if(typeFilter && typeFilter.value !== ""){
        list = list.filter(c =>
            c.attribute.includes(typeFilter.value)
        );
    }

    // 並び替え
    if(sort){

        switch(sort.value){

    case "name":
        list.sort((a,b)=>a.kana.localeCompare(b.kana,"ja"));
        break;

    case "hp":
        list.sort((a,b)=>b.status.hp-a.status.hp);
        break;

    case "attack":
        list.sort((a,b)=>b.status.attack-a.status.attack);
        break;

    case "defense":
        list.sort((a,b)=>b.status.defense-a.status.defense);
        break;

    case "spAttack":
        list.sort((a,b)=>b.status.spAttack-a.status.spAttack);
        break;

    case "spDefense":
        list.sort((a,b)=>b.status.spDefense-a.status.spDefense);
        break;

    case "speed":
        list.sort((a,b)=>b.status.speed-a.status.speed);
        break;

    default:
        list.sort((a,b)=>a.id-b.id);
}

    }

    displayCharacters(list);

}

// イベント登録
if(search){
    search.addEventListener("input", updateCharacters);
}

if(typeFilter){
    typeFilter.addEventListener("change", updateCharacters);
}

if(sort){
    sort.addEventListener("change", updateCharacters);
}

// 初期表示
if(characterList){

    const state = loadListState("characterList");

    if(state){

        if(typeFilter) typeFilter.value = state.type;

        if(sort) sort.value = state.sort;

    }

    updateCharacters();

    if(state){

        setTimeout(()=>{
            window.scrollTo(0,state.scroll);
        },50);

    }

}

// ======================
// Part4 詳細ページ
// ======================

function displayBasicInfo(c, relation){

return `

<div class="status-title">
    <h2>
    ${c.name.replace(/\((.*?)\)/g, '<span class="form-name">($1)</span>')}
</h2>

    ${
        c.forms && c.forms.length > 0
        ? `
        <button id="formChangeButton"
        class="form-change-button">
        形態変化
        </button>
        `
        : ""
    }
</div>

<p><strong>No.</strong> ${String(c.id).padStart(3,"0")}</p>

<p><strong>属性</strong><br>
${createTypeBadges(c.attribute)}
</p>

<h3>弱点</h3>

<div class="type-list">

${
relation.weakness.length
? relation.weakness.map(w=>{
const parts=w.split(" ");
if (parts[0] === "虹") {
    return `<span class="attribute-虹-wrap"><span class="attribute attribute-虹">${parts[0]} ${parts[1]}</span></span>`;
}

return `<span class="attribute attribute-${parts[0]}">${parts[0]} ${parts[1]}</span>`;
}).join("")
: "なし"
}

</div>

<h3>耐性</h3>

<div class="type-list">

${
relation.resistance.length
? relation.resistance.map(r=>{
const parts=r.split(" ");
if (parts[0] === "虹") {
    return `<span class="attribute-虹-wrap"><span class="attribute attribute-虹">${parts[0]} ${parts[1]}</span></span>`;
}

return `<span class="attribute attribute-${parts[0]}">${parts[0]} ${parts[1]}</span>`;
}).join("")
: "なし"
}

</div>

<h3>無効</h3>

<div class="type-list">

${
relation.immunity.length
? relation.immunity.map(i=>
i === "虹"
    ? `<span class="attribute-虹-wrap"><span class="attribute attribute-虹">${i}</span></span>`
    : `<span class="attribute attribute-${i}">${i}</span>`
).join("")
: "なし"
}

</div>

`;

}



function updateBasicInfo(currentForm, c){

    const info = detail.querySelector(".status-title").parentElement;

    const relation = getTypeRelations(
        currentForm.attribute || c.attribute
    );

    const html = displayBasicInfo(
        {
            ...c,
            name: currentForm.name || c.name,
            attribute: currentForm.attribute || c.attribute,
            forms: c.forms
        },
        relation
    );

    const temp = document.createElement("div");
    temp.innerHTML = html;

    // 属性・No.の表示を更新（タイトルとボタンは残す）
    const oldParagraphs = info.querySelectorAll("p");
    const newParagraphs = temp.querySelectorAll("p");

    oldParagraphs.forEach((p, i) => {
        if(newParagraphs[i]){
            p.replaceWith(newParagraphs[i]);
        }
    });

    // 弱点・耐性・無効を更新
    ["弱点", "耐性", "無効"].forEach(label => {

        const oldHeading = [...info.querySelectorAll("h3")]
            .find(h => h.textContent.trim() === label);

        const newHeading = [...temp.querySelectorAll("h3")]
            .find(h => h.textContent.trim() === label);

        if(oldHeading && newHeading){
            const oldList = oldHeading.nextElementSibling;
            const newList = newHeading.nextElementSibling;

            oldHeading.textContent = label;

            if(oldList && newList){
                oldList.replaceWith(newList);
            }
        }
    });
}



let showBaseStats = false;

function displayStatus(c){
  
    const keys = ["hp","attack","defense","spAttack","spDefense","speed"];

    const names = {
        hp:"HP",
        attack:"攻撃",
        defense:"防御",
        spAttack:"特攻",
        spDefense:"特防",
        speed:"速度"
    };

    // 種族値に変換
    function getValue(key){
        if(showBaseStats){
            return c.status[key] - (key === "hp" ? 75 : 20);
        }

        return c.status[key];
    }

    // 合計
    const total = keys.reduce((sum, key)=>{
        return sum + getValue(key);
    }, 0);

    // 合計順位
    const realTotal =
        c.status.hp +
        c.status.attack +
        c.status.defense +
        c.status.spAttack +
        c.status.spDefense +
        c.status.speed;

    const rank = characters.filter(ch => {

        const otherTotal =
            ch.status.hp +
            ch.status.attack +
            ch.status.defense +
            ch.status.spAttack +
            ch.status.spDefense +
            ch.status.speed;

        return otherTotal > realTotal;

    }).length + 1;

    return `
    <div class="status-section">

        <div class="status-title">
            <h3>ステータス</h3>

            <button id="statusModeButton">
                ${showBaseStats ? "種族値" : "実数値"}
            </button>
        </div>

        <div class="status-list">

        ${keys.map(key=>{

            const value = getValue(key);

            // 実数値：HP330 / その他275
            // 種族値：全て255
            const max = showBaseStats
                ? 255
                : (key === "hp" ? 330 : 275);

            const percent = Math.min(value / max * 100, 100);

            return `
                <div class="status-row">

                    <span>${names[key]}</span>

                    <div class="status-bar">
                        <div class="status-fill"
                             style="width:${percent}%">
                        </div>
                    </div>

                    <b>${value}</b>

                </div>
            `;

        }).join("")}

        <div class="status-row status-total">
            <span>合計</span>
            <b>${total}（${rank}位）</b>
        </div>

        </div>

            </div>
    `;
}

function displayDetail(){

    if(!detail) return;
    
    detail.style.visibility = "hidden";

    const id = getCharacterId();
    
    const index = characters.findIndex(ch => ch.id === id);

    const c = characters.find(ch => ch.id === id);

    if(!c){
        detail.innerHTML = "<p>キャラクターが見つかりません。</p>";
        return;
    }

  let formIndex = -1;

    const relation = getTypeRelations(c.attribute);

  const formKey = `formIndex_${c.id}`;

  const savedFormIndex = sessionStorage.getItem(formKey);

if (savedFormIndex !== null) {
    formIndex = Number(savedFormIndex);
}

    const allMoves = [
    ...c.moves
        .map(id => moves.find(m => m.id === id))
        .filter(Boolean),

    moves.find(m => m.id === c.ultimate),

    moves.find(m => m.id === c.zMove)

].filter(Boolean);

let currentMoveList = [...allMoves];

    detail.innerHTML = `
        ${displayBasicInfo(c, relation)}
        ${displayStatus(c)}
        ${displayAbilities(c)}
        ${displayCharacterMoves(allMoves)}
        
        <div class="move-nav">

<button id="prevCharacter">
← 前のキャラ
</button>

<button id="nextCharacter">
次のキャラ →
</button>

</div>
    `;

  function setupStatusButton() {
    const button = document.getElementById("statusModeButton");

    if (!button) return;

    button.onclick = () => {
        showBaseStats = !showBaseStats;

        const oldStatus = detail.querySelector(".status-section");

        if (!oldStatus) return;

        const currentForm =
    formIndex === -1
        ? c
        : c.forms[formIndex];

oldStatus.outerHTML = displayStatus(currentForm);

        setupStatusButton();
    };
}

  function setupFormChangeButton() {

    const button = document.getElementById("formChangeButton");

    if (!button) return;

    button.onclick = () => {

        if (!c.forms || c.forms.length === 0) return;

        // 通常形態 → 変化形態 → 通常形態
        formIndex++;

        if (formIndex >= c.forms.length) {
            formIndex = -1;
        }

      sessionStorage.setItem(formKey, formIndex);

        // =====================
        // 通常形態
        // =====================

        if (formIndex === -1) {

            const title = detail.querySelector(".status-title h2");

            if (title) {
                title.textContent = c.name;
            }

            const status = detail.querySelector(".status-section");

            if (status) {
                status.outerHTML = displayStatus(c);
            }

            currentMoveList = [...allMoves];

          updateBasicInfo(c, c);
        }

        // =====================
        // 変化形態
        // =====================

        else {

            const currentForm = c.forms[formIndex];

         updateBasicInfo(currentForm, c);

            const title = detail.querySelector(".status-title h2");

            
if (title) {
    const name = currentForm.name || c.name;
    title.innerHTML = name.replace(
        /（(.*?)）|\((.*?)\)/g,
        '<span class="form-name">($1$2)</span>'
    );
}


            const status = detail.querySelector(".status-section");

            if (status) {
                status.outerHTML = displayStatus(currentForm);
            }

            
const formMoves = (currentForm.moves || [])

                .map(idOrName => {

                    if (typeof idOrName === "number") {
                        return moves.find(m => m.id === idOrName);
                    }

                    return moves.find(m => m.name === idOrName);

                })
                .filter(Boolean);

            const formUltimate = moves.find(m => {

                if (typeof currentForm.ultimate === "number") {
                    return m.id === currentForm.ultimate;
                }

                return m.name === currentForm.ultimate;

            });

            const zMove = moves.find(m => m.id === c.zMove);

            currentMoveList = [
                ...formMoves,
                formUltimate,
                zMove
            ].filter(Boolean);

        }

        // =====================
        // ステータスボタン再設定
        // =====================

        setupStatusButton();

        // =====================
        // 技一覧を更新
        // =====================

        updateCharacterMoves();

    };

}

setupStatusButton();
  setupFormChangeButton();

const prevButton = document.getElementById("prevCharacter");
const nextButton = document.getElementById("nextCharacter");

prevButton.onclick = () => {
    const prev = characters[(index - 1 + characters.length) % characters.length];
    location.href = `detail.html?id=${prev.id}`;
};

nextButton.onclick = () => {
    const next = characters[(index + 1) % characters.length];
    location.href = `detail.html?id=${next.id}`;
};

    const moveSearch = document.getElementById("moveSearch");
    const moveTypeFilter = document.getElementById("moveTypeFilter");
    const moveCategoryFilter = document.getElementById("moveCategoryFilter");
    const moveKindFilter = document.getElementById("moveKindFilter");
    const moveSort = document.getElementById("moveSort");

let state = loadListState("characterDetail");

if(state && state.characterId !== id){
    localStorage.removeItem("characterDetail");
    state = null;
}

if(state){

    if(moveTypeFilter) moveTypeFilter.value = state.type;
    if(moveCategoryFilter) moveCategoryFilter.value = state.category;
    if(moveKindFilter) moveKindFilter.value = state.kind;
    if(moveSort) moveSort.value = state.sort;

}

    if(!moveSearch) return;

    function updateCharacterMoves(){

        let filtered = [...currentMoveList];

        const keyword = moveSearch ? moveSearch.value.trim().toLowerCase() : "";

        filtered = filtered.filter(move => {

            const searchOK =
    move.name.toLowerCase().includes(keyword) ||
    move.kana.toLowerCase().includes(keyword) ||
    move.effect.toLowerCase().includes(keyword) ||
                move.type.some(type =>
    type.toLowerCase().includes(keyword)
)
                move.category.toLowerCase().includes(keyword) ||
                move.kind.toLowerCase().includes(keyword);

            const typeOK =
                !moveTypeFilter || moveTypeFilter.value === "" ||
                move.type.includes(moveTypeFilter.value);

            const categoryOK =
                !moveCategoryFilter || moveCategoryFilter.value === "" ||
                move.category === moveCategoryFilter.value;

            const kindOK =
                !moveKindFilter || moveKindFilter.value === "" ||
                move.kind === moveKindFilter.value;

            return searchOK && typeOK && categoryOK && kindOK;

        });

        if(moveSort){

            switch(moveSort.value){

                case "name":
                    filtered.sort((a,b)=>a.name.localeCompare(b.name,"ja"));
                    break;

                case "power":
                    filtered.sort((a,b)=>b.power-a.power);
                    break;

                case "accuracy":
                    filtered.sort((a,b)=>b.accuracy-a.accuracy);
                    break;

                case "pp":
                    filtered.sort((a,b)=>b.pp-a.pp);
                    break;

                default:
                    filtered.sort((a,b)=>a.id-b.id);

            }

        }
        
        const moveList = document.querySelector(".move-list");
        
if(filtered.length === 0){

    moveList.innerHTML = `
        <div class="no-result">
            条件に一致する技は見つかりませんでした。
        </div>
    `;

}else{

    moveList.innerHTML = displayMoves(filtered);

}

    
    saveListState("characterDetail",{

    characterId: getCharacterId(),

    search: moveSearch.value,

    type: moveTypeFilter.value,

    category: moveCategoryFilter.value,

    kind: moveKindFilter.value,

    sort: moveSort.value

});

}

    moveSearch.addEventListener("input", updateCharacterMoves);

    if(moveTypeFilter)
        moveTypeFilter.addEventListener("change", updateCharacterMoves);

    if(moveCategoryFilter)
        moveCategoryFilter.addEventListener("change", updateCharacterMoves);

    if(moveKindFilter)
        moveKindFilter.addEventListener("change", updateCharacterMoves);

    if(moveSort)
        moveSort.addEventListener("change", updateCharacterMoves);
        
        updateCharacterMoves();
        
// 保存していた形態を画面に復元
const savedIndexForRestore = sessionStorage.getItem(formKey);

if (savedIndexForRestore !== null) {
    const savedIndex = Number(savedIndexForRestore);

    if (
        savedIndex >= 0 &&
        c.forms &&
        savedIndex < c.forms.length
    ) {
        formIndex = savedIndex - 1;

        const formButton =
            document.getElementById("formChangeButton");

        if (formButton) {
            formButton.click();
        }
    }
}
      
  requestAnimationFrame(() => {

    if(state){
        window.scrollTo(0, Number(state.scroll));
    }

    detail.style.visibility = "visible";

});

}

function displayAbilities(c){

return `

<h3>特性</h3>

<div class="ability-list">

${c.abilities.map(id=>{

const ability = abilities.find(a=>a.id===id);

if(!ability) return "";

return `

<a href="#"
onclick="openAbility(${ability.id}); return false;"
class="ability-card"> 

<div class="ability-name">${ability.name}</div>

<div class="ability-effect">
${ability.effect}
</div>

</a>

`;

}).join("")}

</div>

`;

}

function displayCharacterMoves(moveList){

return `

<h3>技</h3>

<input
type="text"
id="moveSearch"
placeholder="技名・効果で検索">

<div class="move-filter">

<select id="moveTypeFilter">
<option value="">全ての属性</option>
${allTypes.map(type=>`
<option value="${type}">${type}</option>
`).join("")}
</select>

<select id="moveCategoryFilter">
<option value="">全ての分類</option>
<option value="物理">物理</option>
<option value="特殊">特殊</option>
<option value="変化">変化</option>
</select>

<select id="moveKindFilter">
<option value="">全ての種類</option>
<option value="通常">通常</option>
<option value="奥義">奥義</option>
<option value="Z技">Z技</option>
</select>

<select id="moveSort">
<option value="id">No順</option>
<option value="name">名前順</option>
<option value="power">威力順</option>
<option value="accuracy">命中順</option>
<option value="pp">PP順</option>
</select>

</div>

<div class="move-list">
${displayMoves(moveList)}
</div>

`;

}

function displayMoves(moveList){

    return moveList.map(move=>{


        if(!move) return "";

        return `

<div class="move-item"
     data-name="${move.name.toLowerCase()}"
     data-type="${move.type.join(",")}"
     data-category="${move.category}"
     data-power="${move.power}"
     data-accuracy=${
    move.accuracy === 101
        ? "必中"
        : move.accuracy
}
     data-pp="${move.pp}">

<a href="#"
onclick="openMove(${move.id}); return false;"
class="move-card ${
    move.kind === "奥義"
        ? "ultimate"
        : move.kind === "Z技"
        ? "zmove"
        : ""
}">

<div class="move-header">

<div class="move-info">

<div class="move-top">
<div class="move-kind move-kind-${move.kind}">
    ${move.kind}
</div>
${createTypeBadges(move.type)}
<div class="move-category">${move.category}</div>
</div>

<div class="move-name">${move.name}</div>

</div>

<div class="move-values">
<div>威力 ${move.power === 0 ? "-" : move.power}</div>
<div>
命中 ${
    move.accuracy === 101
        ? "必中"
        : move.accuracy === 0
        ? "-"
        : move.accuracy
}
</div>
<div>PP ${move.pp === 0 ? "-" : move.pp}</div>
</div>

</div>

<div class="move-effect">
${move.effect}
</div>

</a>

</div>

`;

    }).join("");

}

function openMove(id){

    // キャラクター詳細から来た場合
    const moveSearch = document.getElementById("moveSearch");
    const moveTypeFilter = document.getElementById("moveTypeFilter");
    const moveCategoryFilter = document.getElementById("moveCategoryFilter");
    const moveKindFilter = document.getElementById("moveKindFilter");
    const moveSort = document.getElementById("moveSort");

    if(moveTypeFilter){

        saveListState("characterDetail",{

    characterId: getCharacterId(),

    search: moveSearch.value,
    type: moveTypeFilter.value,
    category: moveCategoryFilter.value,
    kind: moveKindFilter.value,
    sort: moveSort.value

});

    }

    // 技一覧から来た場合
    const nameSearch = document.getElementById("nameSearch");
const effectSearch = document.getElementById("effectSearch");
const type = document.getElementById("typeFilter");
const category = document.getElementById("categoryFilter");
const kind = document.getElementById("kindFilter");
const sort = document.getElementById("sort");

if(type){
    saveListState("moveList",{
        nameSearch: nameSearch ? nameSearch.value : "",
        effectSearch: effectSearch ? effectSearch.value : "",
        type: type.value,
        category: category.value,
        kind: kind.value,
        sort: sort.value
    });
}

    location.href = `move.html?id=${id}`;

}

function openAbility(id){

    const moveSearch = document.getElementById("moveSearch");
    const moveTypeFilter = document.getElementById("moveTypeFilter");
    const moveCategoryFilter = document.getElementById("moveCategoryFilter");
    const moveKindFilter = document.getElementById("moveKindFilter");
    const moveSort = document.getElementById("moveSort");

    saveListState("characterDetail",{

    characterId: getCharacterId(),

    search: moveSearch.value,

    type: moveTypeFilter.value,

    category: moveCategoryFilter.value,

    kind: moveKindFilter.value,

    sort: moveSort.value

});

    location.href = `ability.html?id=${id}`;

}

// ======================
// 技一覧ページ
// ======================

const moveListPage = document.getElementById("move-list");

if (moveListPage) {

    const nameSearch = document.getElementById("nameSearch");
    const effectSearch = document.getElementById("effectSearch");
    const typeFilter = document.getElementById("typeFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const kindFilter = document.getElementById("kindFilter");
    const sort = document.getElementById("sort");

    // 保存されていた状態を復元
    const moveListState = loadListState("moveList");

    if(moveListState){

        if(nameSearch)
            nameSearch.value = moveListState.nameSearch || "";

        if(effectSearch)
            effectSearch.value = moveListState.effectSearch || "";

        if(typeFilter)
            typeFilter.value = moveListState.type || "";

        if(categoryFilter)
            categoryFilter.value = moveListState.category || "";

        if(kindFilter)
            kindFilter.value = moveListState.kind || "";

        if(sort)
            sort.value = moveListState.sort || "id";
    }

    function updateMoveList(){

        let list = [...moves];

        // 技名検索
        const nameKeyword = nameSearch
            ? nameSearch.value.trim().toLowerCase()
            : "";

        if(nameKeyword !== ""){
            list = list.filter(move =>
                move.name.toLowerCase().includes(nameKeyword) ||
                move.kana.toLowerCase().includes(nameKeyword)
            );
        }

        // 技効果検索
        const effectKeyword = effectSearch
            ? effectSearch.value.trim().toLowerCase()
            : "";

        if(effectKeyword !== ""){
            list = list.filter(move =>
                move.effect.toLowerCase().includes(effectKeyword)
            );
        }

        // 属性
        if(typeFilter && typeFilter.value !== ""){
            list = list.filter(move =>
                move.type.includes(typeFilter.value)
            );
        }

        // 分類
        if(categoryFilter && categoryFilter.value !== ""){
            list = list.filter(move =>
                move.category === categoryFilter.value
            );
        }

        // 種類
        if(kindFilter && kindFilter.value !== ""){
            list = list.filter(move =>
                move.kind === kindFilter.value
            );
        }

        // 並び替え
        if(sort){

            switch(sort.value){

                case "name":
                    list.sort((a,b) =>
                        a.kana.localeCompare(b.kana,"ja")
                    );
                    break;

                case "power":
                    list.sort((a,b) => b.power - a.power);
                    break;

                case "accuracy":
                    list.sort((a,b) => b.accuracy - a.accuracy);
                    break;

                case "pp":
                    list.sort((a,b) => b.pp - a.pp);
                    break;

                default:
                    list.sort((a,b) => a.id - b.id);
            }
        }

        if(list.length === 0){

            moveListPage.innerHTML = `
                <div class="no-result">
                    条件に一致する技は見つかりませんでした。
                </div>
            `;

        }else{

            moveListPage.innerHTML = displayMoves(list);

        }
    }

    // 検索
    if(nameSearch)
        nameSearch.addEventListener("input", updateMoveList);

    if(effectSearch)
        effectSearch.addEventListener("input", updateMoveList);

    // フィルター
    if(typeFilter)
        typeFilter.addEventListener("change", updateMoveList);

    if(categoryFilter)
        categoryFilter.addEventListener("change", updateMoveList);

    if(kindFilter)
        kindFilter.addEventListener("change", updateMoveList);

    if(sort)
        sort.addEventListener("change", updateMoveList);


    // 一覧を表示
    updateMoveList();


    // 技カードから戻ってきた場合だけ状態を復元
    if(moveListState){

        requestAnimationFrame(() => {

            window.scrollTo({
                top: Number(moveListState.scroll) || 0,
                behavior: "instant"
            });

        });

        // 復元したら保存データを削除
        localStorage.removeItem("moveList");
    }

}

    


// 詳細ページなら表示
if(detail){
    requestAnimationFrame(() => {
        displayDetail();
    });
}

// ======================
// Part5 特性詳細ページ
// ======================

function displayMoveDetail(){

    if(!moveDetail) return;

    const id = getMoveId();
    
    const index = moves.findIndex(move => move.id === id);

    const move = moves.find(m => m.id === id);

    if(!move){

        moveDetail.innerHTML = "<p>技が見つかりません。</p>";

        return;
    }
    
    const users = [];

characters.forEach(c => {

    // 通常形態が覚える技
    if (
        move.kind === "通常" &&
        c.moves.includes(move.id)
    ) {
        users.push({
            character: c,
            formIndex: -1,
            formName: ""
        });
    }

    // 通常形態の奥義
    if (
        move.kind === "奥義" &&
        c.ultimate === move.id
    ) {
        users.push({
            character: c,
            formIndex: -1,
            formName: ""
        });
    }

    
    // Z技
    if (
        move.kind === "Z技" &&
        c.zMove === move.id
    ) {
        users.push({
            character: c,
            formIndex: -1,
            formName: ""
        });

        // 形態ごとにもZ技の習得者として表示
        (c.forms || []).forEach((form, formIndex) => {
            users.push({
                character: c,
                formIndex: formIndex,
                formName: form.name
            });
        });
    }


    // 変化形態が覚える技・奥義
    (c.forms || []).forEach((form, formIndex) => {

        const hasMove =
            move.kind === "通常" &&
            (form.moves || []).some(idOrName =>
                typeof idOrName === "number"
                    ? idOrName === move.id
                    : idOrName === move.name
            );

        const hasUltimate =
            move.kind === "奥義" &&
            (
                typeof form.ultimate === "number"
                    ? form.ultimate === move.id
                    : form.ultimate === move.name
            );

        if (hasMove || hasUltimate) {
            users.push({
                character: c,
                formIndex: formIndex,
                formName: form.name
            });
        }

    });

});

    moveDetail.innerHTML = `
        <div class="card ${
move.kind==="奥義"
? "ultimate-detail"
: move.kind==="Z技"
? "zmove-detail"
: ""
}">

<h2>${move.name}</h2>

<div class="move-tags">

  ${createTypeBadges(move.type)}

    <span class="move-kind-tag move-kind-${move.kind}">
    ${move.kind}
</span>

    <span class="move-category-tag move-category-${move.category}">
    ${move.category}
</span>

</div>

<h3>基本情報</h3>

<div class="move-info-table">

<div class="move-info-row">
<span class="move-info-name">威力</span>
<span class="move-info-value">${move.power===0?"-":move.power}</span>
</div>

<div class="move-info-row">
<span class="move-info-name">命中</span>
<span class="move-info-value">
${
    move.accuracy === 101
        ? "必中"
        : move.accuracy === 0
        ? "-"
        : move.accuracy
}
</span>
</div>

<div class="move-info-row">
<span class="move-info-name">PP</span>
<span class="move-info-value">
    ${move.pp === 0 ? "-" : move.pp}
</span>
</span>
</div>

</div>

<h3>詳細情報</h3>

<div class="move-info-table">

<div class="move-info-row">
<span class="move-info-name">対象</span>
<span class="move-info-value">${move.target}</span>
</div>

<div class="move-info-row">
<span class="move-info-name">優先度</span>
<span class="move-info-value">
${
    move.priority > 0
        ? "+" + move.priority
        : move.priority === 0
        ? "±0"
        : move.priority
}
</span>
</div>

<div class="move-info-row">
<span class="move-info-name">会心率</span>
<span class="move-info-value">${move.critical}%</span>
</div>

<div class="move-info-row">
<span class="move-info-name">接触</span>
<span class="move-info-value">${move.contact?"する":"しない"}</span>
</div>

<div class="move-info-row">
<span class="move-info-name">守る</span>
<span class="move-info-value">${
    move.protect === true
        ? "防がれる"
        : move.protect === false
        ? "貫通"
        : "-"
}</span>
</div>

<div class="move-info-row">
<span class="move-info-name">吸収</span>
<span class="move-info-value">${move.drain===0?"なし":move.drain+"%"}</span>
</div>

</div>
          <hr>

<h3>効果</h3>

<p>${move.effect}</p>

<h3>『${move.name}』を覚えるキャラクター</h3>

<p>${users.length}件</p>

<ul>
${users.map(user => `
<li>
<a
    href="detail.html?id=${user.character.id}"
    onclick="sessionStorage.setItem(
        'formIndex_${user.character.id}',
        '${user.formIndex}'
    )"
>
${user.formName
    ? user.formName
    : user.character.name
} ＞
</a>
</li>
`).join("")}
</ul>

<div class="move-nav">

<button id="prevMove">
← 前の技
</button>

<button id="nextMove">
次の技 →
</button>

</div>

        </div>
    `;
    
    const prevButton = document.getElementById("prevMove");
const nextButton = document.getElementById("nextMove");
    
    prevButton.onclick = () => {
    const prev = moves[(index - 1 + moves.length) % moves.length];
    location.href = `move.html?id=${prev.id}`;
};

nextButton.onclick = () => {
    const next = moves[(index + 1) % moves.length];
    location.href = `move.html?id=${next.id}`;
};
}

function displayAbilityDetail(){

    if(!abilityDetail) return;

    const id = getAbilityId();
    
    const index = abilities.findIndex(a => a.id === id);

    const ability = abilities.find(a => a.id === id);

    if(!ability){
        abilityDetail.innerHTML = "<p>特性が見つかりません。</p>";
        return;
    }
    
    const users = characters.filter(c =>
    c.abilities.includes(ability.id)
);

    abilityDetail.innerHTML = `
        <h2>${ability.name}</h2>

<div class="move-tags">

<span class="ability-type-tag">
${ability.type}特性
</span>

<span class="ability-category-tag">
${ability.category}系
</span>

</div>

        <h3>効果</h3>

<p>
${ability.effect}
</p>
<h3>特性『${ability.name}』を持つキャラクター</h3>

<p>${users.length}件</p>

<ul>
${users.map(c => `
<li>
<a href="detail.html?id=${c.id}">
${c.name} ＞
</a>
</li>
`).join("")}
</ul>

<div class="move-nav">

<button id="prevAbility">
← 前の特性
</button>

<button id="nextAbility">
次の特性 →
</button>

</div>
    `;
    
    const prevButton = document.getElementById("prevAbility");
const nextButton = document.getElementById("nextAbility");

prevButton.onclick = () => {
    const prev = abilities[(index - 1 + abilities.length) % abilities.length];
    location.href = `ability.html?id=${prev.id}`;
};

nextButton.onclick = () => {
    const next = abilities[(index + 1) % abilities.length];
    location.href = `ability.html?id=${next.id}`;
};

}

// 特性詳細ページなら表示
if(abilityDetail){
    displayAbilityDetail();
}

if(moveDetail){
    displayMoveDetail();
}

if(document.getElementById("abilityList")){

const list=document.getElementById("abilityList");
const search=document.getElementById("search");
const type=document.getElementById("typeFilter");
const category=document.getElementById("categoryFilter");

function openAbilityList(id){

    saveListState("abilityList",{
        search: search.value,
        type: type.value,
        category: category.value
    });

    location.href = `ability.html?id=${id}`;
}
function showAbilities(){

let data=[...abilities];

if(search.value){

const keyword = search.value.toLowerCase();

data = data.filter(a =>
    a.name.toLowerCase().includes(keyword) ||
a.kana.toLowerCase().includes(keyword) ||
a.effect.toLowerCase().includes(keyword)
);

}

if(type.value){

data=data.filter(a=>
a.type===type.value
);

}

if(category.value){

data=data.filter(a=>
a.category===category.value
);

}

data.sort((a,b)=>a.kana.localeCompare(b.kana,"ja"));

list.innerHTML=data.length?data.map(a=>`

<div class="move-card">

<div class="move-header">
    <div class="move-info">
        <div class="move-top">
            <div class="move-name">${a.name}</div>
        </div>

        <div class="move-category">
            ${a.type}特性・${a.category}系
        </div>
    </div>
</div>

<div class="move-effect">
    ${a.effect}
</div>

<button onclick="openAbilityList(${a.id})">

詳細
</button>

</div>

`).join(""):`<div class="no-result">該当する特性がありません</div>`;

}

search.addEventListener("input",showAbilities);
type.addEventListener("change",showAbilities);
category.addEventListener("change",showAbilities);

const state = loadListState("abilityList");

if(state){

    search.value = state.search;
    type.value = state.type;
    category.value = state.category;

    if (sort) {
        sort.value = state.sort || "no";
    }
}

showAbilities();

requestAnimationFrame(() => {

    if(state){
        window.scrollTo(0, state.scroll);
    }

});

}

// ======================
// 持ち物一覧ページ
// ======================

if(document.getElementById("itemList")){

const list = document.getElementById("itemList");
const search = document.getElementById("search");
const type = document.getElementById("typeFilter");
const category = document.getElementById("categoryFilter");

function openItemList(id){

    saveListState("itemList",{
    search: search.value,
    type: type.value,
    category: category.value,
    sort: sort ? sort.value : "no"
});

    location.href = `item.html?id=${id}`;

}

function showItems(){

let data = [...items];

if(search.value){

const keyword = search.value.toLowerCase();

data = data.filter(i =>
    i.name.toLowerCase().includes(keyword) ||
i.kana.toLowerCase().includes(keyword) ||
i.effect.toLowerCase().includes(keyword)
);

}

if(type.value){

data = data.filter(i =>
    i.type === type.value
);

}

if(category.value){

data = data.filter(i =>
    i.category === category.value
);

}

const sort = document.getElementById("sortFilter");

if (sort) {
    switch (sort.value) {
        case "name":
            data.sort((a,b)=>a.kana.localeCompare(b.kana,"ja"));
            break;

        default:
            data.sort((a,b)=>a.id-b.id);
    }
}

list.innerHTML = data.length ? data.map(i => `

<div class="move-card">

<div class="move-header">
    <div class="move-info">
        <div class="move-top">
            <div class="move-name">${i.name}</div>
        </div>

        <div class="move-category">
            ${i.type}持ち物・${i.category}
        </div>
    </div>
</div>

<div class="move-effect">
${i.effect}
</div>

<button onclick="openItemList(${i.id})">
詳細
</button>

</div>

`).join("") : `<div class="no-result">該当する持ち物がありません</div>`;

}

search.addEventListener("input", showItems);
type.addEventListener("change", showItems);
category.addEventListener("change", showItems);

const sort = document.getElementById("sortFilter");
if (sort) {
    sort.addEventListener("change", showItems);
}

const state = loadListState("itemList");

if(state){

    search.value = state.search;
    type.value = state.type;
    category.value = state.category;

}

showItems();

requestAnimationFrame(() => {

    if(state){
        window.scrollTo(0, state.scroll);
    }

});

}

function displayItemDetail(){

    if(!itemDetail) return;

    const id = getItemId();
    
    const index = items.findIndex(i => i.id === id);

    const item = items.find(i => i.id === id);

    if(!item){
        itemDetail.innerHTML = "<p>持ち物が見つかりません。</p>";
        return;
    }

    itemDetail.innerHTML = `
<h2>${item.name}</h2>

<div class="move-tags">

<span class="ability-type-tag">
${item.type}持ち物
</span>

<span class="ability-category-tag">
${item.category}
</span>

</div>

<h3>効果</h3>

<p>
${item.effect}
</p>

<div class="move-nav">

<button id="prevItem">
← 前の持ち物
</button>

<button id="nextItem">
次の持ち物 →
</button>

</div>
`;

const prevButton = document.getElementById("prevItem");
const nextButton = document.getElementById("nextItem");

prevButton.onclick = () => {
    const prev = items[(index - 1 + items.length) % items.length];
    location.href = `item.html?id=${prev.id}`;
};

nextButton.onclick = () => {
    const next = items[(index + 1) % items.length];
    location.href = `item.html?id=${next.id}`;
};

}

if(itemDetail){
    displayItemDetail();
}

function generateEVs(){

    const evs = {
        hp:0,
        attack:0,
        defense:0,
        spAttack:0,
        spDefense:0,
        speed:0
    };

    const stats = ["hp","attack","defense","spAttack","spDefense","speed"];

    stats.sort(()=>Math.random()-0.5);

    evs[stats[0]] = 8;
    evs[stats[1]] = 8;
    evs[stats[2]] = 4;

    return evs;

}

function generateMoves(character){

// ランダムに4つ選ぶ
let randomMoves = [...character.moves]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

// 4つの中に攻撃技があるか確認
const hasAttackMove = randomMoves.some(id => {
    const move = moves.find(m => m.id === id);
    return move && move.category !== "変化";
});

// なければ攻撃技を1つ入れる
if (!hasAttackMove) {

    const attackMoves = character.moves.filter(id => {
        const move = moves.find(m => m.id === id);
        return move && move.category !== "変化";
    });

    if (attackMoves.length > 0) {
        randomMoves[0] =
            attackMoves[Math.floor(Math.random() * attackMoves.length)];
    }
}

return randomMoves;

}

function generateAbility(character){

    const randomAbilityId =
        character.abilities[
            Math.floor(Math.random() * character.abilities.length)
        ];

    return abilities.find(a => a.id === randomAbilityId);

}

function generateItem(randomMoves){

    const hasMultiHit = randomMoves.some(id => {
        const move = moves.find(m => m.id === id);
        return move && move.hits > 1;
    });

    const hasStatusMove = randomMoves.some(id => {
        const move = moves.find(m => m.id === id);
        return move && move.category === "変化";
    });

    const hasPhysicalMove = randomMoves.some(id => {
        const move = moves.find(m => m.id === id);
        return move && move.category === "物理";
    });

    const hasSpecialMove = randomMoves.some(id => {
        const move = moves.find(m => m.id === id);
        return move && move.category === "特殊";
    });

    const itemCandidates = items.filter(item => {

        if(!item.condition) return true;

        if(item.condition.multiHit && !hasMultiHit) return false;

        if(item.condition.attackOnly && hasStatusMove) return false;

        if(item.condition.physical && !hasPhysicalMove) return false;

        if(item.condition.special && !hasSpecialMove) return false;

        if(item.condition.zType){
            const ok = randomMoves.some(id => {
                const move = moves.find(m => m.id === id);
                return move &&
                       move.category !== "変化" &&
                       move.type.includes(item.condition.zType);
            });

            if(!ok) return false;
        }

        if(item.condition.zMove){
    const zMoves = Array.isArray(item.condition.zMove)
        ? item.condition.zMove
        : [item.condition.zMove];

    const ok = randomMoves.some(id => {
        const move = moves.find(m => m.id === id);
        return move && zMoves.includes(move.name);
    });

    if(!ok) return false;
}

        return true;
    });

    return itemCandidates[
        Math.floor(Math.random() * itemCandidates.length)
    ];
}

const randomButton = document.getElementById("randomGenerateButton");
const randomResult = document.getElementById("randomResult");

if (randomButton && randomResult) {

    randomButton.addEventListener("click", function () {

    this.style.background = "#b71c1c";
    
    const randomCharacter = characters[
    Math.floor(Math.random() * characters.length)
];

const evs = generateEVs();

const statusHTML = `
<div class="randomStat statHP">
<span>HP</span>
<span>${randomCharacter.status.hp + evs.hp * 5}</span>
<span>(+${evs.hp})</span>
</div>

<div class="randomStat statAtk">
<span>攻撃</span>
<span>${randomCharacter.status.attack + evs.attack * 5}</span>
<span>(+${evs.attack})</span>
</div>

<div class="randomStat statDef">
<span>防御</span>
<span>${randomCharacter.status.defense + evs.defense * 5}</span>
<span>(+${evs.defense})</span>
</div>

<div class="randomStat statSpAtk">
<span>特攻</span>
<span>${randomCharacter.status.spAttack + evs.spAttack * 5}</span>
<span>(+${evs.spAttack})</span>
</div>

<div class="randomStat statSpDef">
<span>特防</span>
<span>${randomCharacter.status.spDefense + evs.spDefense * 5}</span>
<span>(+${evs.spDefense})</span>
</div>

<div class="randomStat statSpe">
<span>速度</span>
<span>${randomCharacter.status.speed + evs.speed * 5}</span>
<span>(+${evs.speed})</span>
</div>
`;

const randomMoves = generateMoves(randomCharacter);

const randomItem = generateItem(randomMoves);

// 特性をランダムで1つ選ぶ
const randomAbility = generateAbility(randomCharacter);

randomResult.innerHTML = `
<div class="card randomCharacterCard">

    <div class="randomNameRow">
        <h2>${randomCharacter.name}</h2>
        <span>No.${String(randomCharacter.id).padStart(3,"0")}</span>
    </div>

    <div>
        ${createTypeBadges(randomCharacter.attribute)}
    </div>

</div>

<div class="randomBuild">

    <div class="buildTop">

        <div class="buildLeft">

            <div class="card miniCard">
                <h3>ステータス</h3>

                <div id="randomStatus">
                    ${statusHTML}
                </div>

            </div>

        </div>

        <div class="buildRight">

            <div class="card miniCard">
                <h3>技</h3>

                ${randomMoves.map(id => {
                    const move = moves.find(m => m.id === id);

                    return `
<div class="randomMoveCard">

    <div class="randomMoveTags">
        ${createTypeBadges(move.type)}
        <span class="move-category">${move.category}</span>
    </div>

    <div class="randomMoveName">
        ${move.name}
    </div>

</div>
`;
                }).join("")}

            </div>

        </div>

    </div>

    <div class="buildBottom">

<div class="card miniCard">

    <div class="randomAbilityName">
        ${randomAbility.name}
    </div>

    <div class="randomAbilityEffect">
        ${randomAbility.effect}
    </div>

</div>

<div class="card miniCard">

    <div class="randomItemName">
        ${randomItem.name}
    </div>

    <div class="randomItemEffect">
        ${randomItem.effect}
    </div>

</div>

    </div>

</div>

</div>
`;

randomResult.style.display = "block";

    setTimeout(() => {
        this.style.background = "#d32f2f";
    }, 100);

});

}