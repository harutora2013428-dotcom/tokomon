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

function renderBox(){

boxGrid.innerHTML = `
<div class="box-card new-card">
    <div class="plus">＋</div>
    <span>新しく作成</span>
</div>
`;

        getFilteredBox().forEach(data => {

        const character = characters.find(c => c.id === data.characterId);

          const fixedTags = getFixedBoxTags(data, character);

        boxGrid.innerHTML += `
<div class="box-card" data-box-id="${data.id}">

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
    
    document.querySelectorAll(".box-card[data-box-id]").forEach(card => {

    card.onclick = () => {

        selectedBoxId = Number(card.dataset.boxId);

        const data = box.find(x => x.id === selectedBoxId);
        const character = characters.find(c => c.id === data.characterId);

        boxMenuName.textContent =
    data.nickname || character.name.replace(/[（(]新月形態[）)]$/, "");

        boxMenuModal.style.display = "block";
document.body.classList.add("modal-open");
    };

});

    document.querySelector(".new-card").onclick = () => {

    document.getElementById("characterSearch").value = "";

    renderCharacterList();

    modal.style.display = "block";
document.body.classList.add("modal-open");

};

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
};

renderCharacterList();

document.getElementById("trainingButton").onclick = () => {

    if (selectedBoxId === null) return;

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
// 左上の戻るボタン
document.querySelector(".back-button").onclick = () => {
    history.back();
};
// 初回表示
renderBox();

// ブラウザでBOX画面に戻ったときに最新データを読み込む
window.addEventListener("pageshow", (event) => {

    if (event.persisted) {

        box = JSON.parse(localStorage.getItem("box")) || [];

        renderBox();

    }

});