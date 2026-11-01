let box = JSON.parse(localStorage.getItem("box")) || [];

let selectedBoxId = null;

const boxMenuModal = document.getElementById("boxMenuModal");
const boxMenuName = document.getElementById("boxMenuName");

function saveBox() {
    localStorage.setItem("box", JSON.stringify(box));
}


// HTML表示用の文字変換
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// BOXで表示する名前
function getBoxDisplayName(data, character) {
    return data.nickname ||
        character.name.replace(/[（(]新月形態[）)]$/, "");
}

// =========================
// 固定タグの自動判定
// =========================

function getFixedBoxTags(data, character) {

    const tags = [];

    const currentMoves = Array.isArray(data.moves)
        ? data.moves.filter(move =>
            move !== null &&
            move !== undefined &&
            move !== ""
        )
        : [];

    // ⭕️ 技が4つ未満
    if (currentMoves.length < 4) {
        tags.push("⭕️");
    }

    // 🔺 通常習得できない技を覚えている
    const normalMoves = [
        ...(character.moves || []),
        ...(character.forms || []).flatMap(form =>
            form.moves || []
        )
    ].map(move => String(move));

    const hasUnusualMove = currentMoves.some(move => {

        return !normalMoves.includes(String(move));

    });

    if (hasUnusualMove) {
        tags.push("🔺");
    }

    // ♾️ ランダム生成から追加された個体
    if (data.randomGenerated === true) {
        tags.push("♾️");
    }

    return tags;
}

// 手動タグの種類
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
{ id: "mixed", name: "両刀", symbol: "⚔️" }
];

const boxGrid = document.getElementById("boxGrid");


// =========================
// BOX範囲入れ替え
// =========================

let boxReorderMode = false;

let rangeStartIndex = null;
let rangeEndIndex = null;

let boxDragState = null;
let suppressReorderClick = false;


// 範囲選択
function handleReorderCardTap(boxId) {

    const index = box.findIndex(data =>
        String(data.id) === String(boxId)
    );

    if (index === -1) return;

    // 最初のカード
    if (rangeStartIndex === null) {

        rangeStartIndex = index;
        rangeEndIndex = null;

    }

    // 最後のカード
    else if (rangeEndIndex === null) {

        rangeEndIndex = index;

    }

    // 選択済みなら、新しい範囲を選択
    else {

        const start = Math.min(
            rangeStartIndex,
            rangeEndIndex
        );

        const end = Math.max(
            rangeStartIndex,
            rangeEndIndex
        );

        if (index >= start && index <= end) {
            return;
        }

        rangeStartIndex = index;
        rangeEndIndex = null;

    }

    renderBox();
}


// =========================
// ドラッグによる範囲交換
// =========================


// =========================
// ドラッグ中のスクロール対応
// =========================

// スクロールできる親要素を取得
function getBoxSwapScrollElement() {

    let element = boxGrid.parentElement;

    while (
        element &&
        element !== document.body &&
        element !== document.documentElement
    ) {

        const style = getComputedStyle(element);

        const canScroll =
            /(auto|scroll)/.test(style.overflowY) &&
            element.scrollHeight > element.clientHeight + 1;

        if (canScroll) {
            return element;
        }

        element = element.parentElement;

    }

    return document.scrollingElement ||
        document.documentElement;
}


// ドラッグ位置にある交換先を更新
function updateBoxSwapDropTarget(state) {

    // 前の表示を解除
    boxGrid.querySelectorAll(".box-swap-drop-target")
        .forEach(card => {
            card.classList.remove("box-swap-drop-target");
        });

    const target = document.elementFromPoint(
        state.lastX,
        state.lastY
    );

    const targetCard = target?.closest(
        ".box-card[data-box-id]"
    );

    if (!targetCard) {
        state.targetStart = null;
        return;
    }

    const targetIndex = Number(
        targetCard.dataset.boxIndex
    );

    // ドラッグ位置に対応する開始位置
    const targetStart =
        targetIndex - state.draggedOffset;

    const sourceStart = state.sourceStart;
    const count = state.count;

    const sourceEnd = sourceStart + count - 1;
    const targetEnd = targetStart + count - 1;

    // BOXの範囲外
    if (
        targetStart < 0 ||
        targetEnd >= box.length
    ) {
        state.targetStart = null;
        return;
    }

    // 交換元と交換先が重なる場合
    const overlaps =
        targetStart <= sourceEnd &&
        targetEnd >= sourceStart;

    if (overlaps) {
        state.targetStart = null;
        return;
    }

    state.targetStart = targetStart;

    targetCard.classList.add("box-swap-drop-target");

}


// =========================
// 自動スクロール
// =========================

function startBoxSwapAutoScroll(state) {

    if (state.scrollFrame) return;

    function scrollLoop() {

        if (boxDragState !== state || !state.moved) {
            state.scrollFrame = null;
            return;
        }

        const scroller = state.scrollElement;

        const isPage =
            scroller === document.scrollingElement ||
            scroller === document.documentElement ||
            scroller === document.body;

        const rect = isPage
            ? {
                top: 0,
                bottom: window.innerHeight
            }
            : scroller.getBoundingClientRect();

        const edgeSize = 70;

        let amount = 0;

        // 上端に近い場合
        if (state.lastY < rect.top + edgeSize) {

            const distance =
                rect.top + edgeSize - state.lastY;

            amount = -Math.min(
                12,
                Math.max(2, Math.ceil(distance / 7))
            );

        }

        // 下端に近い場合
        else if (state.lastY > rect.bottom - edgeSize) {

            const distance =
                state.lastY - (rect.bottom - edgeSize);

            amount = Math.min(
                12,
                Math.max(2, Math.ceil(distance / 7))
            );

        }

        if (amount !== 0) {

            const before = isPage
                ? window.scrollY
                : scroller.scrollTop;

            if (isPage) {
                window.scrollBy(0, amount);
            } else {
                scroller.scrollTop += amount;
            }

            const after = isPage
                ? window.scrollY
                : scroller.scrollTop;

            // スクロールできたら交換先を再判定
            if (before !== after) {
                updateBoxSwapDropTarget(state);
            }

        }

        state.scrollFrame =
            requestAnimationFrame(scrollLoop);

    }

    state.scrollFrame =
        requestAnimationFrame(scrollLoop);

}


// =========================
// ドラッグ開始
// =========================

boxGrid.addEventListener("pointerdown", event => {

    if (!boxReorderMode || rangeEndIndex === null) {
        return;
    }

    const card = event.target.closest(
        ".box-card[data-box-id]"
    );

    if (!card) return;

    if (!card.classList.contains("range-selected")) {
        return;
    }

    const sourceStart = Math.min(
        rangeStartIndex,
        rangeEndIndex
    );

    const sourceEnd = Math.max(
        rangeStartIndex,
        rangeEndIndex
    );

    const draggedIndex = Number(
        card.dataset.boxIndex
    );

    boxDragState = {

        pointerId: event.pointerId,

        sourceStart: sourceStart,

        count: sourceEnd - sourceStart + 1,

        draggedOffset: draggedIndex - sourceStart,

        startX: event.clientX,
        startY: event.clientY,

        lastX: event.clientX,
        lastY: event.clientY,

        moved: false,

        targetStart: null,

        scrollElement: getBoxSwapScrollElement(),

        scrollFrame: null

    };

    card.setPointerCapture(event.pointerId);

    event.preventDefault();

});


// =========================
// ドラッグ中
// =========================

boxGrid.addEventListener("pointermove", event => {

    if (!boxDragState) return;

    if (event.pointerId !== boxDragState.pointerId) {
        return;
    }

    const state = boxDragState;

    state.lastX = event.clientX;
    state.lastY = event.clientY;

    const distance = Math.hypot(
        event.clientX - state.startX,
        event.clientY - state.startY
    );

    if (!state.moved && distance < 8) return;

    state.moved = true;

    event.preventDefault();

    document.body.classList.add("box-swap-dragging");

    // 交換先を更新
    updateBoxSwapDropTarget(state);

    // 自動スクロール開始
    startBoxSwapAutoScroll(state);

});


// =========================
// ドラッグ終了
// =========================

boxGrid.addEventListener("pointerup", event => {

    if (!boxDragState) return;

    if (event.pointerId !== boxDragState.pointerId) {
        return;
    }

    const state = boxDragState;

    boxDragState = null;

    // 自動スクロール停止
    if (state.scrollFrame) {
        cancelAnimationFrame(state.scrollFrame);
    }

    document.body.classList.remove("box-swap-dragging");

    boxGrid.querySelectorAll(".box-swap-drop-target")
        .forEach(card => {
            card.classList.remove("box-swap-drop-target");
        });

    if (!state.moved) return;

    event.preventDefault();

    suppressReorderClick = true;

    setTimeout(() => {
        suppressReorderClick = false;
    }, 150);

    if (state.targetStart === null) return;

    const sourceStart = state.sourceStart;
    const targetStart = state.targetStart;
    const count = state.count;

    if (sourceStart === targetStart) return;

    // 同じ数のキャラクターを交換
    for (let i = 0; i < count; i++) {

        const temp = box[sourceStart + i];

        box[sourceStart + i] = box[targetStart + i];

        box[targetStart + i] = temp;

    }

    saveBox();

    rangeStartIndex = null;
    rangeEndIndex = null;

    renderBox();

});


// =========================
// ドラッグ中断
// =========================

boxGrid.addEventListener("pointercancel", event => {

    if (!boxDragState) return;

    if (event.pointerId !== boxDragState.pointerId) {
        return;
    }

    const state = boxDragState;

    boxDragState = null;

    if (state.scrollFrame) {
        cancelAnimationFrame(state.scrollFrame);
    }

    document.body.classList.remove("box-swap-dragging");

    boxGrid.querySelectorAll(".box-swap-drop-target")
        .forEach(card => {
            card.classList.remove("box-swap-drop-target");
        });

});
    

function renderBox(){

    const rangeReady =
        rangeStartIndex !== null &&
        rangeEndIndex !== null;

    const rangeMin = rangeReady
        ? Math.min(rangeStartIndex, rangeEndIndex)
        : -1;

    const rangeMax = rangeReady
        ? Math.max(rangeStartIndex, rangeEndIndex)
        : -1;

    let hintText = "";

    if (rangeStartIndex === null) {

        hintText = "①交換したい範囲の最初のカードをタップ";

    } else if (rangeEndIndex === null) {

        hintText = "②交換したい範囲の最後のカードをタップ";

    } else {

        const count = rangeMax - rangeMin + 1;

        hintText =
            `${count}体を選択中。カード全体をドラッグして交換。`;

    }

    boxGrid.innerHTML = boxReorderMode
        ? `
            <div class="box-sort-hint">
                ${hintText}
            </div>
        `
        : `
            <div class="box-card new-card">
                <div class="plus">＋</div>
                <span>新しく作成</span>
            </div>
        `;

    // 入れ替えモード中は全員表示
    const displayBox = boxReorderMode
        ? box
        : getFilteredBox();

    displayBox.forEach((data, index) => {

        const character = characters.find(
            c => c.id === data.characterId
        );

        const fixedTags = getFixedBoxTags(data, character);

        const isRangeAnchor =
            boxReorderMode &&
            rangeEndIndex === null &&
            index === rangeStartIndex;

        const isRangeSelected =
            boxReorderMode &&
            rangeReady &&
            index >= rangeMin &&
            index <= rangeMax;

        boxGrid.innerHTML += `
<div class="box-card
    ${isRangeAnchor ? "range-anchor" : ""}
    ${isRangeSelected ? "range-selected" : ""}"
    data-box-id="${data.id}"
    data-box-index="${index}">

${data.favorite ? '<span class="box-favorite-star">⭐</span>' : ""}

<div class="box-fixed-tags">
    ${fixedTags.map(tag => `
        <span class="box-fixed-tag">${tag}</span>
    `).join("")}
</div>

<img src="${character.images?.icon || "images/noimage.png"}">

<div class="box-card-name">
    ${escapeHTML(getBoxDisplayName(data, character))}
</div>

<div class="box-card-tags">
    ${(data.tags || []).map(tagId => {

        const tag = manualTagList.find(t => t.id === tagId);

        if (!tag) return "";

        return `
            <span class="box-tag ${tag.id}">
                ${tag.symbol}
            </span>
        `;

    }).join("")}
</div>

</div>
`;

    });


    // カードのクリック処理
    document.querySelectorAll(".box-card[data-box-id]")
        .forEach(card => {

            card.onclick = () => {

                if (suppressReorderClick) {
                    suppressReorderClick = false;
                    return;
                }

                // 入れ替えモード
                if (boxReorderMode) {

                    handleReorderCardTap(
                        Number(card.dataset.boxId)
                    );

                    return;
                }

                selectedBoxId = Number(card.dataset.boxId);

                const data = box.find(
                    x => x.id === selectedBoxId
                );

                const character = characters.find(
                    c => c.id === data.characterId
                );

                boxMenuName.textContent =
                    data.nickname ||
                    character.name.replace(/[（(]新月形態[）)]$/, "");

                boxMenuModal.style.display = "block";

                document.body.classList.add("modal-open");

            };

        });


    // 新規作成カード
    const newCard = boxGrid.querySelector(".new-card");

    if (newCard) {

        newCard.onclick = () => {

            document.getElementById("characterSearch").value = "";

            renderCharacterList();

            modal.style.display = "block";

            document.body.classList.add("modal-open");

        };

    }

}



 

const modal = document.getElementById("characterModal");

document.getElementById("closeCharacterModal").onclick = () => {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
};

const list = document.getElementById("characterList");


function renderCharacterList(){

    const keyword = document
        .getElementById("characterSearch")
        .value.trim();

    const filteredCharacters = characters.filter(character =>
        character.name.includes(keyword) ||
        (character.kana || "").includes(keyword)
    );

    list.innerHTML = "";

    filteredCharacters.forEach(character => {

        list.innerHTML += `
        <div class="selectItem" data-id="${character.id}">

            <img
                src="${character.images?.icon || "images/noimage.png"}"
                alt="${character.name.replace(/[（(]新月形態[）)]$/, "")}"
            >

            <div class="selectItem-name">
                ${character.name.replace(/[（(]新月形態[）)]$/, "")}
            </div>

        </div>
        `;

    });

    document.querySelectorAll(".selectItem").forEach(item => {

        item.onclick = () => {

            const characterId = Number(item.dataset.id);

            const newCharacter = {

                id: Date.now(),

                characterId,

                nickname: "",

                moves: [],

                ability: null,

                item: null,

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

            box.push(newCharacter);

            saveBox();

            modal.style.display = "none";
document.body.classList.remove("modal-open");

            renderBox();

        };

    });

}

// 検索入力時に一覧を更新
document.getElementById("characterSearch").oninput = () => {
    renderCharacterList();
};

renderCharacterList();


document.getElementById("closeBoxMenu").onclick = () => {
    boxMenuModal.style.display = "none";
    document.body.classList.remove("modal-open");
};

renderCharacterList();

document.getElementById("trainingButton").onclick = () => {

    if (selectedBoxId === null) return;

    // モーダル状態を解除
    boxMenuModal.style.display = "none";
    document.body.classList.remove("modal-open");

    location.href = `training.html?id=${selectedBoxId}`;

};


// 名前変更ボタン
const renameModal = document.getElementById("renameModal");
const renameInput = document.getElementById("renameInput");

document.getElementById("renameButton").onclick = () => {

    const data = box.find(x => x.id === selectedBoxId);

    if (!data) return;

    renameInput.value = data.nickname || "";

    boxMenuModal.style.display = "none";
    renameModal.style.display = "block";

    renameInput.focus();

};

// 保存
document.getElementById("saveRenameButton").onclick = () => {

    const data = box.find(x => x.id === selectedBoxId);

    if (!data) return;

    data.nickname = renameInput.value.trim();

    saveBox();
    renderBox();

    const character = characters.find(
        c => c.id === data.characterId
    );

    boxMenuName.textContent =
        getBoxDisplayName(data, character);

    renameModal.style.display = "none";
    boxMenuModal.style.display = "block";


  data.nickname = renameInput.value.trim().slice(0, 12);
};

// キャンセル
document.getElementById("cancelRenameButton").onclick = () => {

    renameModal.style.display = "none";
    boxMenuModal.style.display = "block";

};

// =========================
// タグ設定
// =========================

const tagModal = document.getElementById("tagModal");
const tagOptions = document.getElementById("tagOptions");

let editingTags = [];

function renderTagOptions() {

    tagOptions.innerHTML = "";

    manualTagList.forEach(tag => {

        const selected = editingTags.includes(tag.id);

        const button = document.createElement("button");

        button.className =
            "tag-option" + (selected ? " selected" : "");

        button.innerHTML = `
    <span class="tag-symbol ${tag.id}">${tag.symbol}</span>
    <span>${tag.name}</span>
`;

        button.onclick = () => {

            if (editingTags.includes(tag.id)) {

                editingTags = editingTags.filter(
                    id => id !== tag.id
                );

            } else {

                if (editingTags.length >= 3) {
                    alert("タグは最大3個までです");
                    return;
                }

                editingTags.push(tag.id);
            }

            renderTagOptions();
        };

        tagOptions.appendChild(button);

    });
}

// タグ付けボタン
document.getElementById("tagButton").onclick = () => {

    const data = box.find(x => x.id === selectedBoxId);

    if (!data) return;

    editingTags = [...(data.tags || [])];

    boxMenuModal.style.display = "none";
    tagModal.style.display = "block";

    renderTagOptions();
};

// 保存
document.getElementById("saveTagButton").onclick = () => {

    const data = box.find(x => x.id === selectedBoxId);

    if (!data) return;

    data.tags = [...editingTags];

    saveBox();
    renderBox();

    tagModal.style.display = "none";

    const character = characters.find(
        c => c.id === data.characterId
    );

    boxMenuName.textContent =
        getBoxDisplayName(data, character);

    boxMenuModal.style.display = "block";
};

// キャンセル
document.getElementById("cancelTagButton").onclick = () => {

    tagModal.style.display = "none";
    boxMenuModal.style.display = "block";

};

// お気に入り切り替え
document.getElementById("favoriteButton").onclick = () => {

    const data = box.find(x => x.id === selectedBoxId);

    if (!data) return;

    data.favorite = !data.favorite;

    saveBox();
    renderBox();

};

// =========================
// 削除の2段階確認
// =========================

const deleteConfirmModal =
    document.getElementById("deleteConfirmModal");

const deleteConfirmName =
    document.getElementById("deleteConfirmName");

const deleteConfirmWarning =
    document.getElementById("deleteConfirmWarning");

// 第1段階：メニューの削除ボタン
document.getElementById("deleteButton").onclick = () => {

    const data = box.find(x => x.id === selectedBoxId);

    if (!data) return;

    const character = characters.find(
        c => c.id === data.characterId
    );

    deleteConfirmName.textContent =
        getBoxDisplayName(data, character);

    // 構築に登録されているか確認
    const partyCount =
        Number(localStorage.getItem("partyCount")) || 10;

    let isRegistered = false;

    for (let i = 1; i <= partyCount; i++) {

        const savedParty = localStorage.getItem(`party${i}`);

        if (!savedParty) continue;

        const party = JSON.parse(savedParty);

        if (!Array.isArray(party.members)) continue;

        if (party.members.some(member =>
            member &&
            member.boxId != null &&
            String(member.boxId) === String(selectedBoxId)
        )) {
            isRegistered = true;
            break;
        }
    }

    // 確認画面の説明を変更
    if (isRegistered) {

        deleteConfirmWarning.innerHTML =
            "このキャラクターは構築に入っています。<br>" +
            "この操作は取り消せません。";

    } else {

        deleteConfirmWarning.innerHTML =
            "このキャラクターをBOXから削除します。<br>" +
            "この操作は取り消せません。";

    }

    boxMenuModal.style.display = "none";
    deleteConfirmModal.style.display = "block";

};

// 第2段階：最終削除
document.getElementById("confirmDeleteButton").onclick = () => {

    if (selectedBoxId === null) return;

    const deletedBoxId = selectedBoxId;

    const index = box.findIndex(
        x => String(x.id) === String(deletedBoxId)
    );

    if (index === -1) return;

        // =========================
    // 構築に登録されているか確認
    // =========================

    const partyCount =
        Number(localStorage.getItem("partyCount")) || 10;

    const registeredParties = [];

    for (let i = 1; i <= partyCount; i++) {

        const savedParty = localStorage.getItem(`party${i}`);

        if (!savedParty) continue;

        const party = JSON.parse(savedParty);

        if (!Array.isArray(party.members)) continue;

        const isRegistered = party.members.some(member =>
            member &&
            member.boxId != null &&
            String(member.boxId) === String(deletedBoxId)
        );

        if (isRegistered) {
            registeredParties.push(
                party.name?.trim() || `構築${i}`
            );
        }

    }

    // 登録されている場合は削除を中止
    if (registeredParties.length > 0) {

        alert(
            "このキャラクターは構築に登録されています。\n\n" +
            registeredParties.join("\n") +
            "\n\n先に構築から外してください。"
        );
    }

    // BOXから削除
    box.splice(index, 1);

    saveBox();
    renderBox();

    deleteConfirmModal.style.display = "none";
    boxMenuModal.style.display = "none";

    selectedBoxId = null;

};

// キャンセル：元のメニューに戻る
document.getElementById("cancelDeleteButton").onclick = () => {

    deleteConfirmModal.style.display = "none";
    boxMenuModal.style.display = "block";

};

// =========================
// BOX検索・絞り込み
// =========================

const boxSearchModal =
    document.getElementById("boxSearchModal");

const boxSearchInput =
    document.getElementById("boxSearchInput");

const favoriteOnly =
    document.getElementById("favoriteOnly");

const boxFilterTags =
    document.getElementById("boxFilterTags");

// 選択中のタグ
let selectedFilterTags = [];

// 選択中の固定タグ
let selectedFixedFilterTags = [];

// 絞り込み結果を取得
function getFilteredBox() {

    const keyword = boxSearchInput.value.trim();

    return box.filter(data => {

        const character = characters.find(
            c => c.id === data.characterId
        );

        if (!character) return false;

        // 名前・ニックネーム検索
        const displayName = getBoxDisplayName(data, character);

        const nameMatch =
            displayName.includes(keyword) ||
            character.name.includes(keyword) ||
            (character.kana || "").includes(keyword);

        if (!nameMatch) return false;

        // お気に入りのみ
        if (favoriteOnly.checked && !data.favorite) {
            return false;
        }

        // 手動タグ絞り込み
const characterTags = data.tags || [];

const tagMatch = selectedFilterTags.every(
    tagId => characterTags.includes(tagId)
);

if (!tagMatch) return false;

// 固定タグ絞り込み
const fixedTags = getFixedBoxTags(data, character);

const fixedTagMatch = selectedFixedFilterTags.every(
    tag => fixedTags.includes(tag)
);

if (!fixedTagMatch) return false;

        return true;
    });
}

// タグ選択ボタンを表示
function renderBoxFilterTags() {

    boxFilterTags.innerHTML = "";

    manualTagList.forEach(tag => {

        const button = document.createElement("button");

        button.className =
            "box-filter-tag" +
            (selectedFilterTags.includes(tag.id) ? " selected" : "");

        button.innerHTML = `
    <span class="tag-symbol ${tag.id}">${tag.symbol}</span>
    ${tag.name}
`;

        button.onclick = () => {

            if (selectedFilterTags.includes(tag.id)) {

                selectedFilterTags =
                    selectedFilterTags.filter(id => id !== tag.id);

            } else {

                selectedFilterTags.push(tag.id);

            }

            renderBoxFilterTags();
            renderBox();

        };

        boxFilterTags.appendChild(button);

    });

  // 固定タグの選択ボタン
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

        renderBoxFilterTags();
        renderBox();

    };

    boxFilterTags.appendChild(button);

});
}

// 右上の検索ボタン
document.querySelector(".search-button").onclick = () => {

    boxSearchModal.style.display = "block";

    document.body.classList.add("modal-open");

    renderBoxFilterTags();

};

// 名前検索
boxSearchInput.oninput = () => {
    renderBox();
};

// お気に入り絞り込み
favoriteOnly.onchange = () => {
    renderBox();
};

// リセット
document.getElementById("resetBoxFilter").onclick = () => {

    boxSearchInput.value = "";
    favoriteOnly.checked = false;
    selectedFilterTags = [];
  selectedFixedFilterTags = [];

    renderBoxFilterTags();
    renderBox();

};

// 閉じる
document.getElementById("closeBoxSearch").onclick = () => {

    boxSearchModal.style.display = "none";

    document.body.classList.remove("modal-open");

};

// =========================
// 入れ替えモード切り替え
// =========================

const boxSortButton = document.getElementById("boxSortButton");

boxSortButton.onclick = () => {

    boxReorderMode = !boxReorderMode;

    // 選択をリセット
    rangeStartIndex = null;
    rangeEndIndex = null;

    boxSortButton.textContent =
        boxReorderMode ? "完了" : "入れ替え";

    // 検索モーダルを閉じる
    boxSearchModal.style.display = "none";

    document.body.classList.remove("modal-open");

    renderBox();

};
// 左上の戻るボタン
document.querySelector(".back-button").onclick = () => {
    history.back();
};
// 初回表示
renderBox();

// ブラウザでBOX画面に戻ったときに最新データを読み込む
window.addEventListener("pageshow", () => {

    box = JSON.parse(localStorage.getItem("box")) || [];

    renderBox();

});