// ======================
// パーティーメーカー
// ======================

const partyList = document.getElementById("party-list");

// 構築メンバーの表示名を取得
function getPartyMemberDisplayName(member, character) {

    const box = JSON.parse(localStorage.getItem("box")) || [];

    const boxData = member.boxId
        ? box.find(x => x.id === member.boxId)
        : null;

    // ニックネームが設定されている場合は、その名前を優先
    if (boxData?.nickname?.trim()) {
        return boxData.nickname.trim();
    }

    if (member.nickname?.trim()) {
        return member.nickname.trim();
    }

    // 通常のキャラクター名から「(新月形態)」だけを除去
    return character.name.replace(/[（(]新月形態[）)]$/, "");
}

// 構築メンバーの持ち物名を取得
function getPartyMemberItemName(member) {

    const box = JSON.parse(localStorage.getItem("box")) || [];

    const boxData = member.boxId
        ? box.find(x => x.id === member.boxId)
        : null;

    return boxData?.item || member.item || null;
}

// 構築メンバーの属性タグを生成
function getPartyMemberTypeHtml(character) {

    const types = Array.isArray(character.attribute)
        ? character.attribute
        : [character.attribute];

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

if (partyList) {

    // 保存されている構築数を取得
    let partyCount = Number(localStorage.getItem("partyCount")) || 10;

    // 一覧を表示する関数
    function renderPartyList() {

        const parties = [];

        for (let i = 1; i <= partyCount; i++) {

            const save = JSON.parse(
                localStorage.getItem(`party${i}`)
            );

            parties.push({
                id: i,
                name: save?.name?.trim() || `構築${i}`,
                members: save?.members || []
            });

        }

        partyList.innerHTML = parties.map(p => `

            <div class="party-card"
                onclick="location.href='party-edit.html?id=${p.id}'">

                <div class="party-name">
                    ${p.name}
                </div>

                <div class="party-count">
                    ${p.members.filter(member => member !== null).length}/6体
                </div>

                <div class="party-members">
                    ${
                        p.members.filter(member => member)
                            .map(member => {
                                const character = characters.find(
                                    c => c.id === member.characterId
                                );

                                return character
                                    ? getPartyMemberDisplayName(member, character)
                                    : "";
                            })
                            .join("・") || "空き構築"
                    }
                </div>

            </div>

        `).join("");

    }

    // 最初の一覧表示
    renderPartyList();

    // ＋ボタン
    const addPartyButton = document.getElementById("addPartyButton");

    if (addPartyButton) {

        addPartyButton.onclick = () => {

            partyCount++;

            // 新しい構築データを作成
            const newParty = {
                id: partyCount,
                name: "",
                rule: "normal",
                members: [null, null, null, null, null, null]
            };

            localStorage.setItem(
                `party${partyCount}`,
                JSON.stringify(newParty)
            );

            // 構築数を保存
            localStorage.setItem("partyCount", partyCount);

            // 一覧を更新
renderPartyList();

// 追加した構築までスクロール
const newCard = partyList.lastElementChild;

if (newCard) {
    newCard.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

        };

    }

}

// 削除後、構築一覧から戻ったらバトルホームへ
if (partyList) {

    let returningToBattle = false;

    function goToBattleHome() {

        if (returningToBattle) return;

        if (sessionStorage.getItem("partyDeletedGoHome") !== "true") {
            return;
        }

        returningToBattle = true;

        sessionStorage.removeItem("partyDeletedGoHome");

        location.replace("battle.html");
    }

    // スマホの戻るボタン
    window.addEventListener("popstate", goToBattleHome);

    // BFCacheから復元された場合にも対応
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            goToBattleHome();
        }
    });

    // 構築を選び直した場合は通常の戻る動作に戻す
    partyList.addEventListener("click", (event) => {
        if (event.target.closest(".party-card")) {
            sessionStorage.removeItem("partyDeletedGoHome");
        }
    });

}

// ======================
// パーティー編集
// ======================
let selectedMemberIndex = -1;

let editingMemberIndex = -1;

const memberList = document.getElementById("memberList");

if(memberList){

    for(let i=1;i<=6;i++){

        memberList.innerHTML += `

<div class="member-card">

    <div class="member-number">
        ${i}体目
    </div>

    <div class="member-empty">
        ＋ キャラクターを選択
    </div>

</div>

`;

    }

}

// ======================
// Part4 モーダル
// ======================

function openModal(modal){

    document.body.style.overflow = "hidden";

    modal.classList.remove("hidden");

}

function closeModal(modal){

    document.body.style.overflow = "";

    modal.classList.add("hidden");

}

const modal = document.getElementById("partyModal");

const closeModalButton = document.getElementById("closeModal");

if(memberList && modal){

    document.querySelectorAll(".member-card").forEach((card, index)=>{

    card.onclick = () => {

    selectedMemberIndex = index;

    if(partyData.members[index]){

        openMemberMenu(index);

    }else{

        openModal(modal);

    }

};

});

}

if(closeModalButton){

    closeModalButton.onclick = ()=>{

        closeModal(modal);

    };

}

if(modal){

    modal.onclick=e=>{

        if(e.target===modal){

            closeModal(modal);

        }

    };

}

const id = Number(new URLSearchParams(location.search).get("id")) || 1;

// ======================
// 構築メニュー
// ======================

const partyMenuModal =
    document.getElementById("partyMenuModal");

const menuButton =
    document.querySelector(".menu-button");

// メニューを開く
if (menuButton && partyMenuModal) {

    menuButton.onclick = () => {
        openModal(partyMenuModal);
    };

}

// メニューを閉じる
const closePartyMenu =
    document.getElementById("closePartyMenu");

if (closePartyMenu) {

    closePartyMenu.onclick = () => {
        closeModal(partyMenuModal);
    };

}

// 構築削除
const deletePartyButton =
    document.getElementById("deletePartyButton");

if (deletePartyButton) {

    deletePartyButton.onclick = () => {

        const count =
            Number(localStorage.getItem("partyCount")) || 10;

        // 最後の1つは削除できない
        if (count <= 1) {
            alert("最後の構築は削除できません。");
            return;
        }

        if (!confirm(`構築${id}を削除しますか？\nこの操作は取り消せません。`)) {
            return;
        }

        // 後ろの構築を1つずつ繰り上げる
        for (let i = id; i < count; i++) {

            const nextData = localStorage.getItem(`party${i + 1}`);

            if (nextData) {

                const party = JSON.parse(nextData);
                party.id = i;

                localStorage.setItem(
                    `party${i}`,
                    JSON.stringify(party)
                );

            }

        }

        // 最後のデータを削除
        localStorage.removeItem(`party${count}`);

        // 構築数を更新
        localStorage.setItem("partyCount", count - 1);

        // 削除後、一覧から戻ったらバトルホームへ移動する
sessionStorage.setItem("partyDeletedGoHome", "true");

// 構築一覧へ移動
location.replace("party.html");

    };

}

const partySlot = document.getElementById("partySlot");

if (partySlot) {
    partySlot.textContent = `構築${id}`;
}

let partyData = {
    id: id,
    name: "",
    rule: "normal",

    members: [
        null,
        null,
        null,
        null,
        null,
        null
    ]
};

const boxModal = document.getElementById("boxModal");

function openBox(){

    openModal(boxModal);

    createBoxList();

}

const closeBoxModalButton = document.getElementById("closeBoxModal");

if (closeBoxModalButton) {

    closeBoxModalButton.onclick = () => {

        closeModal(boxModal);

    };

}

if (boxModal) {

    boxModal.onclick = (e) => {

        if(e.target === boxModal){

            closeModal(boxModal);

        }

    };

}

// ======================
// 構築BOX：検索・タグ絞り込み
// ======================

const manualTagList = [
    { id: "attacker", name: "アタッカー", symbol: "★" },
    { id: "tank", name: "タンク", symbol: "🟦" },
    { id: "debuffer", name: "デバッファー", symbol: "♠" },
    { id: "supporter", name: "サポーター", symbol: "🩵" },
    { id: "healer", name: "ヒーラー", symbol: "💚" },
    { id: "speed", name: "スピード型", symbol: "⚡" },
    { id: "slow", name: "鈍足型", symbol: "⬛️" },
    { id: "joke", name: "ネタ", symbol: "❔" },
    { id: "romantic", name: "ロマン", symbol: "💎" },
{ id: "setup", name: "積み型", symbol: "⬆︎" },
{ id: "z", name: "Z採用", symbol: "Z" },
{ id: "mixed", name: "両刀", symbol: "⚔️" }];

// 固定タグの判定
function getFixedBoxTags(data, character) {
    const tags = [];

    const currentMoves = Array.isArray(data.moves)
        ? data.moves.filter(move =>
            move !== null && move !== undefined && move !== ""
        )
        : [];

    // ⭕️ 技が4つ未満
    if (currentMoves.length < 4) {
        tags.push("⭕️");
    }

    // 🔺 通常習得できない技を所持
    const normalMoves = [
        ...(character.moves || []),
        ...(character.forms || []).flatMap(form => form.moves || [])
    ].map(move => String(move));

    const hasUnusualMove = currentMoves.some(move =>
        !normalMoves.includes(String(move))
    );

    if (hasUnusualMove) {
        tags.push("🔺");
    }

    // ♾️ ランダム生成
    if (data.randomGenerated === true) {
        tags.push("♾️");
    }

    return tags;
}

let selectedFilterTags = [];

let selectedFixedFilterTags = [];

const boxSearch = document.getElementById("boxSearch");
const boxTagFilterButton = document.getElementById("boxTagFilterButton");
const boxTagFilterModal = document.getElementById("boxTagFilterModal");
const boxTagFilterList = document.getElementById("boxTagFilterList");

const closeBoxTagFilter = document.getElementById("closeBoxTagFilter");
const applyBoxTagFilter = document.getElementById("applyBoxTagFilter");

function getFilteredPartyBox() {

    const box = JSON.parse(localStorage.getItem("box")) || [];
    const keyword = boxSearch.value.trim();

    return box.filter(data => {

        const character = characters.find(
            c => c.id === data.characterId
        );

        if (!character) return false;

        const displayName = data.nickname ||
            character.name.replace(/[（(]新月形態[）)]$/, "");

        const nameMatch =
            displayName.includes(keyword) ||
            character.name.includes(keyword) ||
            (character.kana || "").includes(keyword);

        if (!nameMatch) return false;

        // 手動タグ
const tags = data.tags || [];

const manualMatch = selectedFilterTags.every(
    tagId => tags.includes(tagId)
);

if (!manualMatch) return false;

// 固定タグ
const fixedTags = getFixedBoxTags(data, character);

const fixedMatch = selectedFixedFilterTags.every(
    tag => fixedTags.includes(tag)
);

if (!fixedMatch) return false;

return true;

    });
}

function renderPartyBoxTags() {

    boxTagFilterList.innerHTML = "";

    manualTagList.forEach(tag => {

        const button = document.createElement("button");

        button.className =
            "box-filter-tag" +
            (selectedFilterTags.includes(tag.id) ? " selected" : "");

        const symbol = document.createElement("span");
symbol.className = "box-filter-tag-symbol" +
    (tag.id === "z" ? " z" : "");
symbol.textContent = tag.symbol;

const name = document.createElement("span");
name.textContent = tag.name;

button.append(symbol, " ", name);

        button.onclick = () => {

            if (selectedFilterTags.includes(tag.id)) {

                selectedFilterTags =
                    selectedFilterTags.filter(id => id !== tag.id);

            } else {

                selectedFilterTags.push(tag.id);

            }

            renderPartyBoxTags();

        };

        boxTagFilterList.appendChild(button);

    });

  // 固定タグ
const fixedTagList = [
    { id: "⭕️", name: "技4つ未満" },
    { id: "🔺", name: "通常習得外" },
    { id: "♾️", name: "ランダム生成" }
];

fixedTagList.forEach(tag => {

    const button = document.createElement("button");

    button.className =
        "box-filter-tag" +
        (selectedFixedFilterTags.includes(tag.id) ? " selected" : "");

    button.textContent = `${tag.id} ${tag.name}`;

    button.onclick = () => {

        if (selectedFixedFilterTags.includes(tag.id)) {
            selectedFixedFilterTags =
                selectedFixedFilterTags.filter(id => id !== tag.id);
        } else {
            selectedFixedFilterTags.push(tag.id);
        }

        renderPartyBoxTags();
    };

    boxTagFilterList.appendChild(button);

});

}

// 構築BOXの画面でのみイベントを設定
const boxTagReset = document.getElementById("boxTagReset");

if (
    boxSearch &&
    boxTagFilterButton &&
    boxTagFilterModal &&
    boxTagFilterList &&
    closeBoxTagFilter &&
    applyBoxTagFilter &&
    boxTagReset
) {

    // 名前検索
    boxSearch.addEventListener("input", createBoxList);

    // タグ絞り込みモーダルを開く
    boxTagFilterButton.onclick = () => {

        renderPartyBoxTags();
        boxTagFilterModal.classList.remove("hidden");

    };

    // 閉じる
    closeBoxTagFilter.onclick = () => {

        boxTagFilterModal.classList.add("hidden");

    };

    // 背景を押して閉じる
    boxTagFilterModal.onclick = (e) => {

        if (e.target === boxTagFilterModal) {
            boxTagFilterModal.classList.add("hidden");
        }

    };

    // リセット
    boxTagReset.onclick = () => {

        selectedFilterTags = [];
selectedFixedFilterTags = [];
        boxSearch.value = "";

        renderPartyBoxTags();
        createBoxList();

    };

    // 適用
    applyBoxTagFilter.onclick = () => {

        boxTagFilterModal.classList.add("hidden");
        createBoxList();

    };

    // タグを初期表示
    renderPartyBoxTags();

}

            

function createBoxList(){

    const list = document.getElementById("boxList");

    list.innerHTML = "";

    const box = getFilteredPartyBox();

    if (box.length === 0) {
        list.innerHTML = "<p>該当するキャラクターがいません。</p>";
        return;
    }

    box.forEach(data => {

        const character = characters.find(
            c => c.id === data.characterId
        );

        if (!character) return;

        const displayName = data.nickname ||
            character.name.replace(/[（(]新月形態[）)]$/, "");

        // この個体が現在の構築に登録されているか
        const alreadyAdded = partyData.members.some(member =>
            member &&
            member.boxId != null &&
            String(member.boxId) === String(data.id)
        );

        const card = document.createElement("div");

        card.className = "box-card" +
            (alreadyAdded ? " already-added" : "");

        card.innerHTML = `
            <div class="box-icon">
                <img
                    src="${character.images?.icon || 'images/noimage.png'}"
                    onerror="this.src='images/noimage.png'"
                >
            </div>

            <div class="box-info">
                <h3>${displayName}</h3>
            </div>

            ${data.item ? `
                <div class="box-item-name">
                    持ち物：${data.item}
                </div>
            ` : `
                <div class="box-item-name no-item">
                    持ち物なし
                </div>
            `}

            ${alreadyAdded ? `
                <div class="box-added-label">
                    ✓ 登録済み
                </div>
            ` : `
                <div class="box-add-label">
                    ＋ 追加する
                </div>
            `}
        `;

        if (!alreadyAdded) {
            card.onclick = () => selectCharacter(data.id);
        }

        list.appendChild(card);

    });

}

function selectCharacter(boxId){

    const box = JSON.parse(localStorage.getItem("box")) || [];

    const boxData = box.find(
        x => String(x.id) === String(boxId)
    );

    if (!boxData) return;

    // 既に同じ個体が登録されていないか確認
    const alreadyAdded = partyData.members.some(member =>
        member &&
        member.boxId != null &&
        String(member.boxId) === String(boxData.id)
    );

    if (alreadyAdded) {

        alert("この個体は既に構築に登録されています。");

        createBoxList();

        return;
    }

    if (
        selectedMemberIndex < 0 ||
        selectedMemberIndex >= partyData.members.length
    ) {
        return;
    }

    const character = characters.find(
        c => c.id === boxData.characterId
    );

    if (!character) return;

    // BOXの最新データを構築に反映
    partyData.members[selectedMemberIndex] = {
        characterId: character.id,
        boxId: boxData.id,
        nickname: boxData.nickname || "",
        item: boxData.item || null,
        moves: boxData.moves || [null, null, null, null]
    };

    saveParty();

    // 持ち物アイコンも含めて画面を再描画
    renderParty();

    closeModal(boxModal);

}

function saveParty(){

    localStorage.setItem(
        `party${id}`,
        JSON.stringify(partyData)
    );

}

function loadParty(){

    const save = localStorage.getItem(`party${id}`);

    if(save){

        partyData = JSON.parse(save);

    }
    
    const partyNameInput = document.getElementById("partyName");

if (partyNameInput) {

    partyNameInput.value = partyData.name;

}

if (partyNameInput) {

    partyNameInput.addEventListener("input", () => {

        partyData.name = partyNameInput.value;

        saveParty();

    });

}

}

function renderParty(){

    const cards = document.querySelectorAll(".member-card");

    partyData.members.forEach((member, index)=>{

        if(!member){

            cards[index].innerHTML = `
                <div class="member-number">
                    ${index + 1}体目
                </div>

                <div class="member-empty">
                    ＋ キャラクターを選択
                </div>
            `;

            return;

        }

        const character = characters.find(
            c => c.id === member.characterId
        );

        if(!character) return;

        const typeHtml = getPartyMemberTypeHtml(character);

      const itemName = getPartyMemberItemName(member);

const itemIcon = itemName
    ? `images/items/とこモン${itemName}.png`
    : "";

        cards[index].innerHTML = `
    <div class="member-number">
        ${index + 1}体目
    </div>

    <div class="member-content-row">

        <img
            class="member-icon"
            src="${character.images?.icon || 'images/noimage.png'}"
            onerror="this.style.display='none'"
        >

        <div class="member-text">
            <strong>${getPartyMemberDisplayName(member, character)}</strong>

            <div class="member-types">
                ${typeHtml}
            </div>
        </div>

        ${itemIcon ? `
    <img
        class="member-item-icon"
        src="${itemIcon}"
        onerror="this.style.display='none'"
    >
` : ""}

<div class="member-drag-handle">↕</div>

    </div>
`;

    });

}

const memberMenuModal =
    document.getElementById("memberMenuModal");

function openMemberMenu(index){
  
  editingMemberIndex = index;

    const member = partyData.members[index];

    const character = characters.find(
        c => c.id === member.characterId
    );

    document.getElementById("memberMenuTitle")
    .textContent = getPartyMemberDisplayName(member, character);

    openModal(memberMenuModal);

}

const closeMemberMenuButton =
    document.getElementById("closeMemberMenu");

if (closeMemberMenuButton) {
    closeMemberMenuButton.onclick = () => {
        closeModal(memberMenuModal);
    };
}

const openBoxButton = document.getElementById("openBoxButton");

// ======================
// 新規キャラクター作成
// ======================

const openCharacterCreateButton =
    document.getElementById("openCharacterCreateButton");

const characterCreateModal =
    document.getElementById("characterCreateModal");

const characterCreateList =
    document.getElementById("characterCreateList");

const closeCharacterCreate =
    document.getElementById("closeCharacterCreate");


// キャラクター一覧を生成
function renderCharacterCreateList() {

    if (!characterCreateList) return;

    characterCreateList.innerHTML = "";

    characters.forEach(character => {

        const card = document.createElement("div");

        card.className = "character-create-card";

        const icon = character.images?.icon || "images/noimage.png";

        card.innerHTML = `
            <img
                src="${icon}"
                onerror="this.src='images/noimage.png'"
                alt=""
            >

            <div class="character-create-name">
                ${character.name}
            </div>

            <div class="character-create-types">
                ${getPartyMemberTypeHtml(character)}
            </div>
        `;

        card.onclick = () => {

            if (selectedMemberIndex < 0) return;

            // BOXを使わず直接キャラクターを登録
            partyData.members[selectedMemberIndex] = {

                characterId: character.id,
                boxId: null,
                nickname: "",
                item: null,
                moves: [null, null, null, null]

            };

            saveParty();

            renderParty();

            closeModal(characterCreateModal);

        };

        characterCreateList.appendChild(card);

    });

}


// 新しく作成を開く
if (openCharacterCreateButton && characterCreateModal) {

    openCharacterCreateButton.onclick = () => {

    closeModal(modal);

    renderCharacterCreateList();

    // スクロール位置を最上部に戻す
    characterCreateModal.scrollTop = 0;

    openModal(characterCreateModal);

};

}


// 閉じる
if (closeCharacterCreate && characterCreateModal) {

    closeCharacterCreate.onclick = () => {

        closeModal(characterCreateModal);

    };

}


// 背景タップで閉じる
if (characterCreateModal) {

    characterCreateModal.onclick = (e) => {

        if (e.target === characterCreateModal) {

            closeModal(characterCreateModal);

        }

    };

}

if (openBoxButton) {

    openBoxButton.onclick = () => {

        closeModal(modal);

        openBox();

    };

}

const changeMemberButton =
    document.getElementById("changeMemberButton");

if(changeMemberButton){

    changeMemberButton.onclick = ()=>{

        // 編集している枠を変更対象にする
        selectedMemberIndex = editingMemberIndex;

        closeModal(memberMenuModal);

        openBox();

    };

}

const deleteMemberButton =
    document.getElementById("deleteMemberButton");

if(deleteMemberButton){

    deleteMemberButton.onclick = ()=>{

        partyData.members[editingMemberIndex] = null;

        saveParty();

        renderParty();

        closeModal(memberMenuModal);

    };

}

// ======================
// 育成画面へ移動
// ======================

const trainMemberButton =
    document.getElementById("trainMemberButton");

if (trainMemberButton) {

    trainMemberButton.onclick = () => {

        const member = partyData.members[editingMemberIndex];

        if (!member) return;

        // BOXを取得
        const box = JSON.parse(localStorage.getItem("box")) || [];

        // 既存の育成データを探す
        let boxData = member.boxId
            ? box.find(x => x.id === member.boxId)
            : null;

        // 初回なら育成データを作成
        if (!boxData) {

            boxData = {
                id: Date.now(),
                characterId: member.characterId,
                nickname: member.nickname || "",
                moves: member.moves || [null, null, null, null],
                ability: member.ability || null,
                item: member.item || null,

                crystal: {
                    hp: 0,
                    attack: 0,
                    defense: 0,
                    spAttack: 0,
                    spDefense: 0,
                    speed: 0
                },

                favorite: false,
                tags: []
            };

            box.push(boxData);

            // 構築メンバーにBOXの個体IDを記録
            member.boxId = boxData.id;

            localStorage.setItem("box", JSON.stringify(box));

            saveParty();
        }

        // モーダルを閉じて育成画面へ
closeModal(memberMenuModal);

location.href = `training.html?id=${boxData.id}`;

    };

}

// 構築編集画面でのみ実行
if (memberList) {
    loadParty();
    renderParty();
}

// ブラウザで構築画面に戻ったときに表示を更新
window.addEventListener("pageshow", (event) => {

    if (event.persisted && memberList) {
        renderParty();
    }

});

// =========================
// キャラクターのドラッグ入れ替え
// =========================

let draggingMemberCard = null;

// ↕を押したときだけドラッグ開始
document.addEventListener("pointerdown", event => {

    const handle = event.target.closest(".member-drag-handle");

    if (!handle) return;

    const card = handle.closest(".member-card");

    if (!card) return;

    const index = [...document.querySelectorAll(".member-card")]
        .indexOf(card);

    if (!partyData.members[index]) return;

    event.preventDefault();

    draggingMemberCard = card;

    card.classList.add("member-dragging");

});

// ドラッグ中
document.addEventListener("pointermove", event => {

    if (!draggingMemberCard) return;

    const cards = [
        ...document.querySelectorAll(".member-card")
    ];

    cards.forEach(card => {
        card.classList.remove("member-drag-over");
    });

    const target = cards.find(card => {

        if (card === draggingMemberCard) return false;

        const rect = card.getBoundingClientRect();

        return (
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );

    });

    if (target) {
        target.classList.add("member-drag-over");
    }

});

// ドラッグ終了
document.addEventListener("pointerup", event => {

    if (!draggingMemberCard) return;

    const cards = [
        ...document.querySelectorAll(".member-card")
    ];

    const target = cards.find(card => {

        if (card === draggingMemberCard) return false;

        const rect = card.getBoundingClientRect();

        return (
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );

    });

    if (target) {

        const fromIndex = cards.indexOf(draggingMemberCard);
        const toIndex = cards.indexOf(target);

        const temp = partyData.members[fromIndex];

        partyData.members[fromIndex] =
            partyData.members[toIndex];

        partyData.members[toIndex] = temp;

        saveParty();
        renderParty();

    }

    cards.forEach(card => {
        card.classList.remove(
            "member-dragging",
            "member-drag-over"
        );
    });

    draggingMemberCard = null;

});