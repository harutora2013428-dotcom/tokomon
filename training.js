// =========================
// 育成画面
// =========================

// 技の属性タグ
function createTypeBadges(types){

    if(!Array.isArray(types)){
        types = [types];
    }

    return types.map(type =>
        `<span class="attribute attribute-${type}">${type}</span>`
    ).join(" ");
}

// BOXの個体データ
const box = JSON.parse(localStorage.getItem("box")) || [];

let baseStatus = {};
let currentTrainingFormIndex = -1;

// URLから個体IDを取得
const params = new URLSearchParams(location.search);
const boxId = Number(params.get("id"));

// 対象の個体を探す
const data = box.find(x => x.id === boxId);

// =========================
// 育成ポイント・共通設定
// =========================

let trainingPoints = {
    hp: data?.trainingPoints?.hp ?? 0,
    attack: data?.trainingPoints?.attack ?? 0,
    defense: data?.trainingPoints?.defense ?? 0,
    spAttack: data?.trainingPoints?.spAttack ?? 0,
    spDefense: data?.trainingPoints?.spDefense ?? 0,
    speed: data?.trainingPoints?.speed ?? 0
};

const MAX_POINTS = 20;
const MAX_PER_STAT = 8;
const STAT_UP = 5;

// 形態ステータス更新関数の準備
let updateTrainingFormStatus = () => {};

// 個体が見つからない場合
if (!data) {

    document.querySelector(".training-container").innerHTML = `
        <div class="training-card">
            個体が見つかりません。
        </div>
    `;

} else {

    // キャラクター本体を探す
    const character =
        characters.find(c => c.id === data.characterId);

    if (!character) {

        document.querySelector(".training-container").innerHTML = `
            <div class="training-card">
                キャラクターが見つかりません。
            </div>
        `;

    } else {

        // =========================
        // 基本情報
        // =========================

        document.getElementById("trainingName").textContent =
            data.nickname || character.name;

        document.getElementById("trainingImage").src =
            character.images?.self || "images/noimage.png";

const trainingAttribute =
    document.getElementById("trainingAttribute");

const attributes = Array.isArray(character.attribute)
    ? character.attribute
    : [character.attribute];

trainingAttribute.innerHTML = attributes.map(type => {

    if (type === "虹") {
        return `
            <span class="attribute-虹-wrap">
                <span class="attribute attribute-虹">虹</span>
            </span>
        `;
    }

    return `<span class="attribute attribute-${type}">${type}</span>`;

}).join("");
      
        // =========================
        // ステータス
        // =========================

// 現在選択されている形態のステータス
updateTrainingFormStatus = function () {

    const currentForm = currentTrainingFormIndex === -1
        ? character
        : character.forms[currentTrainingFormIndex];

    baseStatus = currentForm.status || {};

    // ステータス更新
    const statusIds = {
        hp: "statusHP",
        attack: "statusAttack",
        defense: "statusDefense",
        spAttack: "statusSpAttack",
        spDefense: "statusSpDefense",
        speed: "statusSpeed"
    };

    Object.entries(statusIds).forEach(([stat, elementId]) => {
        document.getElementById(elementId).textContent =
            (baseStatus[stat] ?? 0)
            + trainingPoints[stat] * STAT_UP;
    });

    // キャラクター名を更新
    document.getElementById("trainingName").textContent =
        currentTrainingFormIndex === -1
            ? (data.nickname || character.name)
            : (currentForm.name || character.name);

    // キャラクター画像を更新
    document.getElementById("trainingImage").src =
        currentForm.images?.self ||
        character.images?.self ||
        "images/noimage.png";

    // ボタンの表示
    const button = document.getElementById("trainingFormButton");

    if (button) {
        button.textContent = "形態変化";
    }
};

// 形態変化ボタン
const trainingFormButton =
    document.getElementById("trainingFormButton");

if (character.forms?.length) {

    trainingFormButton.style.display = "block";

    trainingFormButton.onclick = () => {

        currentTrainingFormIndex++;

        if (currentTrainingFormIndex >= character.forms.length) {
            currentTrainingFormIndex = -1;
        }

        updateTrainingFormStatus();
    };
}

updateTrainingFormStatus();

        


        // =========================
        // 技
        // =========================

        
  const moveSlots =
    document.querySelectorAll(".move-slot");

moveSlots.forEach((slot, index) => {

    const moveData = data.moves?.[index];

    if (!moveData) {
        slot.innerHTML = "技を選択";
        slot.dataset.moveId = "";
        return;
    }

    const move =
        moves.find(m =>
            String(m.id) === String(moveData) ||
            m.name === moveData
        );

    if (!move) {
        slot.innerHTML = "技を選択";
        slot.dataset.moveId = "";
        return;
    }

    slot.innerHTML = `
        <div class="training-move-card">

    <div class="training-move-content">
        <div class="training-move-name">
            ${move.name}
        </div>

        <div class="training-move-info">
            ${createTypeBadges(move.type)}

            <span class="move-category-tag move-category-${move.category}">
                ${move.category}
            </span>
        </div>
    </div>

    <div class="move-actions">
    <button class="move-delete-button" type="button">×</button>
    <div class="move-drag-handle">↕</div>
</div>

</div>
`;

    slot.dataset.moveId = move.id;
});


                // =========================
        // 特性
        // =========================

        const abilityCard = document.getElementById("abilityCard");
        const abilityModal = document.getElementById("abilityModal");
        const abilityList = document.getElementById("abilityList");
        const closeAbilityModal = document.getElementById("closeAbilityModal");

        // このキャラクターが所持している特性だけ取得
        const ownedAbilities = abilities.filter(ability =>
            (character.abilities || []).some(id =>
                String(id) === String(ability.id)
            )
        );

        // 初期特性を設定
        if (ownedAbilities.length > 0) {

            const savedAbility = ownedAbilities.find(ability =>
                ability.name === data.ability
            );

            data.ability = savedAbility
                ? savedAbility.name
                : ownedAbilities[0].name;

            abilityCard.textContent = data.ability;

        } else {

            data.ability = null;
            abilityCard.textContent = "特性なし";

        }

        // 特性一覧を開く
        abilityCard.onclick = () => {

            if (ownedAbilities.length === 0) return;

            abilityList.innerHTML = "";

            ownedAbilities.forEach(ability => {

                const card = document.createElement("div");
                card.className = "moveCard";

                card.innerHTML = `
                    <div class="moveName">
                        ${ability.name}
                    </div>

                    <div class="moveInfo">
                        <span class="move-category-tag move-category-${ability.category}">
                            ${ability.category}
                        </span>
                    </div>

                    <div class="moveEffect">
                        ${ability.effect.trim()}
                    </div>
                `;

                card.onclick = () => {

                    data.ability = ability.name;
                    abilityCard.textContent = ability.name;

                    abilityModal.classList.remove("show");
                    document.body.style.overflow = "";

                };

                abilityList.appendChild(card);

            });

            abilityModal.classList.add("show");
            document.body.style.overflow = "hidden";

        };

        // ×で閉じる
        closeAbilityModal.onclick = () => {
            abilityModal.classList.remove("show");
            document.body.style.overflow = "";
        };

        // 背景をタップして閉じる
        abilityModal.onclick = event => {

            if (event.target === abilityModal) {
                abilityModal.classList.remove("show");
                document.body.style.overflow = "";
            }

        };


                // =========================
        // 持ち物
        // =========================

        const itemCard = document.getElementById("itemCard");
        const itemModal = document.getElementById("itemModal");
        const itemList = document.getElementById("itemList");
        const closeItemModal = document.getElementById("closeItemModal");

        // キャラクターのZ技を取得
        const characterZMove = moves.find(move =>
            String(move.id) === String(character.zMove)
        );

        const zMoveName = characterZMove?.name;

       // キャラクター名から形態名を取り除く
const baseCharacterName = character.name.replace(/\(.*?\)/g, "");

// 使用可能な持ち物を取得
const availableItems = items.filter(item => {

    // 共通持ち物・共通Zクリスタル
    if (item.type === "共通") {
        return true;
    }

    // 専用Zクリスタル
    if (item.type === "専用" && item.category === "Zクリスタル") {
        return item.effect.includes(baseCharacterName + "専用");
    }

    return false;
});

        // 初期状態は持ち物なし
data.item = data.item || null;

itemCard.textContent = data.item || "持ち物なし";

        // 持ち物一覧を開く
        itemCard.onclick = () => {

            itemList.innerHTML = "";

            availableItems.forEach(item => {

                const card = document.createElement("div");
                card.className = "moveCard";

                card.innerHTML = `
                    <div class="moveName">
                        ${item.name}
                    </div>

                    <div class="moveInfo">
                        <span class="move-category-tag move-category-${item.category}">
                            ${item.category}
                        </span>
                    </div>

                    <div class="moveEffect">
                        ${item.effect.trim()}
                    </div>
                `;

                card.onclick = () => {

                    data.item = item.name;
                    itemCard.textContent = item.name;

                    itemModal.classList.remove("show");
                    document.body.style.overflow = "";

                };

                itemList.appendChild(card);

            });

            itemModal.classList.add("show");
            document.body.style.overflow = "hidden";

        };

        // ×で閉じる
        closeItemModal.onclick = () => {
            itemModal.classList.remove("show");
            document.body.style.overflow = "";
        };

        // 背景タップで閉じる
        itemModal.onclick = event => {

            if (event.target === itemModal) {
                itemModal.classList.remove("show");
                document.body.style.overflow = "";
            }

        };

              // =========================
        // テラスタル
        // =========================

        const teraCard = document.getElementById("teraCard");
        const teraModal = document.getElementById("teraModal");
        const teraTypeList = document.getElementById("teraTypeList");
        const closeTeraModal = document.getElementById("closeTeraModal");

        // 選択できる属性
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
      
        // 初期値はキャラクターの1個目の属性
if (!Object.prototype.hasOwnProperty.call(data, "teraType")) {
    data.teraType = attributes[0] || null;
}

        // 表示更新
        function updateTeraCard() {

            const type = data.teraType;

            if (!type) {
                teraCard.textContent = "テラスタイプ：なし";
                return;
            }

            if (type === "虹") {
                teraCard.innerHTML = `
                    テラスタイプ：
                    <span class="attribute-虹-wrap">
                        <span class="attribute attribute-虹">虹</span>
                    </span>
                `;
                return;
            }

            teraCard.innerHTML = `
                テラスタイプ：
                <span class="attribute attribute-${type}">${type}</span>
            `;
        }

        updateTeraCard();

        // 選択画面を開く
        teraCard.onclick = () => {

            teraTypeList.innerHTML = "";

            const options = teraTypes;

            options.forEach(type => {

                const card = document.createElement("div");
                card.className = "moveCard";

                if (type === "なし") {
                    card.textContent = "なし";
                } else if (type === "虹") {
                    card.innerHTML = `
                        <span class="attribute-虹-wrap">
                            <span class="attribute attribute-虹">虹</span>
                        </span>
                    `;
                } else {
                    card.innerHTML = `
                        <span class="attribute attribute-${type}">
                            ${type}
                        </span>
                    `;
                }

                card.onclick = () => {

                    data.teraType = type === "なし" ? null : type;

                    updateTeraCard();

                    teraModal.classList.remove("show");
                    document.body.style.overflow = "";

                };

                teraTypeList.appendChild(card);

            });

            teraModal.classList.add("show");
            document.body.style.overflow = "hidden";

        };

        // ×で閉じる
        closeTeraModal.onclick = () => {
            teraModal.classList.remove("show");
            document.body.style.overflow = "";
        };

        // 背景タップで閉じる
        teraModal.onclick = event => {

            if (event.target === teraModal) {
                teraModal.classList.remove("show");
                document.body.style.overflow = "";
            }

        };

    }
}


// =========================
// 保存
// =========================

document.getElementById("saveTraining").onclick = () => {

    // 能力ポイントを保存
    data.trainingPoints = {
        hp: trainingPoints.hp,
        attack: trainingPoints.attack,
        defense: trainingPoints.defense,
        spAttack: trainingPoints.spAttack,
        spDefense: trainingPoints.spDefense,
        speed: trainingPoints.speed
    };

    // 技の現在の並び順を保存
    data.moves = [...document.querySelectorAll(".move-slot")]
        .map(slot => slot.dataset.moveId || null);

    // BOXを保存
    localStorage.setItem("box", JSON.stringify(box));

    const saveName =
        data.nickname ||
        characters.find(c => c.id === data.characterId)?.name ||
        "キャラクター";

    alert(`${saveName}の育成を保存しました！`);

// 前の画面に戻る
history.back();
};


// 合計使用ポイント
function getUsedPoints() {
    return Object.values(trainingPoints)
        .reduce((sum, value) => sum + value, 0);
}


// 表示更新
function updateTrainingPoints() {

    const used = getUsedPoints();
    const remaining = MAX_POINTS - used;

    document.getElementById("remainingPoints").textContent =
        remaining;

    Object.keys(trainingPoints).forEach(stat => {

        const idMap = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    spAttack: "SpAttack",
    spDefense: "SpDefense",
    speed: "Speed"
};

const id = idMap[stat];

        const pointElement =
            document.getElementById(`point${id}`);

        if (pointElement) {
            pointElement.textContent =
                trainingPoints[stat];
        }

          const statusIds = {
        hp: "statusHP",
        attack: "statusAttack",
        defense: "statusDefense",
        spAttack: "statusSpAttack",
        spDefense: "statusSpDefense",
        speed: "statusSpeed"
    };

    updateTrainingFormStatus();
    });
}


// ＋ボタン
document.querySelectorAll(".plus-button").forEach(button => {

    button.onclick = () => {

        const stat = button.dataset.stat;

        const used = getUsedPoints();

        // ステータス個別上限
        if (trainingPoints[stat] >= MAX_PER_STAT) {
            return;
        }

        // 全体上限
        if (used >= MAX_POINTS) {
            return;
        }

        trainingPoints[stat]++;

        updateTrainingPoints();
    };

});


// −ボタン
document.querySelectorAll(".minus-button").forEach(button => {

    button.onclick = () => {

        const stat = button.dataset.stat;

        // 0なら減らせない
        if (trainingPoints[stat] <= 0) {
            return;
        }

        trainingPoints[stat]--;

        updateTrainingPoints();
    };

});


// 初期表示
updateTrainingPoints();

// =========================
// 技選択モーダル
// =========================

const moveModal = document.getElementById("moveModal");
const closeMoveModal = document.getElementById("closeMoveModal");
const learnedMoves = document.getElementById("learnedMoves");
const otherMovesButton = document.getElementById("otherMovesButton");
const otherMoves = document.getElementById("otherMoves");


// 技一覧を表示
function openMoveModal() {

    learnedMoves.innerHTML = "";

    const moveCharacter =
        characters.find(c => c.id === data.characterId);

    const learnedIds = moveCharacter?.moves || [];

    // 覚える技をIDから取得
    const learned = moves.filter(move =>
    learnedIds.includes(move.id) &&
    move.name !== "悪足掻き" &&
    move.kind !== "奥義" &&
    move.kind !== "Z技"
);

    // 覚える技
    const title = document.createElement("h3");
    title.textContent = "覚える技";
    learnedMoves.appendChild(title);

    learned.forEach(move => {

        const card = document.createElement("div");
        card.className = "moveCard";

        card.innerHTML = `
            <div class="moveName">
                ${move.name}
            </div>

            <div class="moveInfo">
                ${createTypeBadges(move.type)}

                <span class="move-kind-tag move-kind-${move.kind}">
                    ${move.kind}
                </span>

                <span class="move-category-tag move-category-${move.category}">
                    ${move.category}
                </span>

             <span class="moveTag">
    威力 ${move.power === 0 ? "-" : move.power}
</span>

                <span class="moveTag">
                    命中 ${
                        move.accuracy === 0
                            ? "-"
                            : move.accuracy === 101
                            ? "必中"
                            : move.accuracy
                    }
                </span>
            </div>

            <div class="moveEffect">
                ${move.effect.trim()}
            </div>
        `;

        card.onclick = () => {

            if (!selectedMoveSlot) return;

              // 他の技枠に同じ技が入っていないか確認
    const duplicate = [...document.querySelectorAll(".move-slot")]
        .some(slot =>
            slot !== selectedMoveSlot &&
            Number(slot.dataset.moveId) === Number(move.id)
        );

    if (duplicate) {
        alert("この技はすでに選択されています");
        return;
    }

            selectedMoveSlot.innerHTML = `

          <div class="training-move-card">

    <div class="training-move-content">
        <div class="training-move-name">
            ${move.name}
        </div>

        <div class="training-move-info">
            ${createTypeBadges(move.type)}

            <span class="move-category-tag move-category-${move.category}">
                ${move.category}
            </span>
        </div>
    </div>

    <div class="move-actions">
    <button class="move-delete-button" type="button">×</button>
    <div class="move-drag-handle">↕</div>
</div>

</div>
        `;

selectedMoveSlot.dataset.moveId = move.id;
        
            moveModal.classList.remove("show");
            document.body.style.overflow = "";
        };

        learnedMoves.appendChild(card);
    });


    // その他
otherMoves.innerHTML = "";
otherMoves.classList.remove("open");
otherMovesButton.textContent = "▼ その他";

// 覚えない技
const other = moves.filter(move =>
    !learnedIds.includes(move.id) &&
    move.name !== "悪足掻き" &&
    move.kind !== "奥義" &&
    move.kind !== "Z技"
);

other.forEach(move => {

    const card = document.createElement("div");
    card.className = "moveCard";

    card.innerHTML = `
        <div class="moveName">
            ${move.name}
        </div>

        <div class="moveInfo">
            ${createTypeBadges(move.type)}

            <span class="move-kind-tag move-kind-${move.kind}">
                ${move.kind}
            </span>

            <span class="move-category-tag move-category-${move.category}">
                ${move.category}
            </span>

            <span class="moveTag">
    威力 ${move.power === 0 ? "-" : move.power}
</span>

            <span class="moveTag">
                命中 ${
                    move.accuracy === 0
                        ? "-"
                        : move.accuracy === 101
                        ? "必中"
                        : move.accuracy
                }
            </span>
        </div>

        <div class="moveEffect">
            ${move.effect.trim()}
        </div>
    `;

    card.onclick = () => {

        if (!selectedMoveSlot) return;

        const duplicate =
            [...document.querySelectorAll(".move-slot")]
            .some(slot =>
                slot !== selectedMoveSlot &&
                Number(slot.dataset.moveId) === Number(move.id)
            );

        if (duplicate) {
            alert("この技はすでに選択されています");
            return;
        }

        selectedMoveSlot.innerHTML = `
            <div class="training-move-card">

                <div class="training-move-content">
                    <div class="training-move-name">
                        ${move.name}
                    </div>

                    <div class="training-move-info">
                        ${createTypeBadges(move.type)}

                        <span class="move-category-tag move-category-${move.category}">
                            ${move.category}
                        </span>
                    </div>
                </div>

                <div class="move-actions">
                    <button class="move-delete-button" type="button">×</button>
                    <div class="move-drag-handle">↕</div>
                </div>

            </div>
        `;

        selectedMoveSlot.dataset.moveId = move.id;

        moveModal.classList.remove("show");
        document.body.style.overflow = "";
    };

    otherMoves.appendChild(card);
});

    moveModal.classList.add("show");

    // 後ろのページをスクロールさせない
    document.body.style.overflow = "hidden";
}

document.addEventListener("click", event => {

    const button =
        event.target.closest(".move-delete-button");

    if (!button) return;

    // 技枠のクリック処理を完全に止める
    event.preventDefault();
    event.stopImmediatePropagation();

    const slot =
        button.closest(".move-slot");

    if (!slot) return;

    slot.innerHTML = "技を選択";
    slot.dataset.moveId = "";
});

// =========================
// 技のドラッグ入れ替え
// =========================

let draggingSlot = null;

// ↕を押したときだけドラッグ開始
document.addEventListener("pointerdown", event => {

    const handle = event.target.closest(".move-drag-handle");

    if (!handle) return;

    const slot = handle.closest(".move-slot");

    if (!slot) return;
    if (!slot.dataset.moveId) return;

    event.preventDefault();

    draggingSlot = slot;

    slot.classList.add("dragging");
});


// ドラッグ中
document.addEventListener("pointermove", event => {

    if (!draggingSlot) return;

    const slots = [
        ...document.querySelectorAll(".move-slot")
    ];

    const target = slots.find(slot => {

        if (slot === draggingSlot) return false;

        const rect = slot.getBoundingClientRect();

        return (
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );
    });

    slots.forEach(slot => {
        slot.classList.remove("drag-over");
    });

    if (target) {
        target.classList.add("drag-over");
    }
});


// ドラッグ終了
document.addEventListener("pointerup", event => {

    if (!draggingSlot) return;

    const slots = [
        ...document.querySelectorAll(".move-slot")
    ];

    const target = slots.find(slot => {

        if (slot === draggingSlot) return false;

        const rect = slot.getBoundingClientRect();

        return (
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );
    });

    // 技を入れ替える
    if (target) {

        const tempHTML =
            draggingSlot.innerHTML;

        const tempId =
            draggingSlot.dataset.moveId;

        draggingSlot.innerHTML =
            target.innerHTML;

        draggingSlot.dataset.moveId =
            target.dataset.moveId || "";

        target.innerHTML =
            tempHTML;

        target.dataset.moveId =
            tempId || "";
    }

    slots.forEach(slot => {
        slot.classList.remove("dragging");
        slot.classList.remove("drag-over");
    });

    draggingSlot = null;
});


// キャンセル
document.addEventListener("pointercancel", () => {

    if (!draggingSlot) return;

    draggingSlot.classList.remove("dragging");
    draggingSlot.classList.remove("drag-over");

    draggingSlot = null;
});

// 技枠をタップ

let selectedMoveSlot = null;

document.querySelectorAll(".move-slot").forEach(slot => {

    slot.onclick = (event) => {

        // ×ボタンを押した場合はモーダルを開かない
        if (event.target.closest(".move-delete-button")) {
            return;
        }

        // ↕を押した場合もモーダルを開かない
        if (event.target.closest(".move-drag-handle")) {
            return;
        }

        selectedMoveSlot = slot;

        openMoveModal();
    };

});


// その他
otherMovesButton.onclick = () => {

    if (otherMoves.classList.contains("open")) {

        otherMoves.classList.remove("open");
        otherMovesButton.textContent = "▼ その他";

    } else {

        otherMoves.classList.add("open");
        otherMovesButton.textContent = "▲ その他";

    }

};


// ×で閉じる
closeMoveModal.onclick = () => {
    moveModal.classList.remove("show");
    document.body.style.overflow = "";
};


// 背景をタップして閉じる
moveModal.onclick = (event) => {

    if (event.target === moveModal) {
        moveModal.classList.remove("show");
        document.body.style.overflow = "";
    }

}