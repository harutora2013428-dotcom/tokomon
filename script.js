// キャラクター一覧を表示する
function displayCharacters(list){

    const characterList = document.getElementById("character-list");

    // character.html以外では何もしない
    if(!characterList) return;

    characterList.innerHTML = "";

    if(list.length === 0){
        characterList.innerHTML = "<p>キャラクターが見つかりません。</p>";
        return;
    }

    list.forEach(c=>{

        characterList.innerHTML += `
        <div class="card">

            <h3>No.${String(c.id).padStart(3,"0")} ${c.name}</h3>

            <p>属性：${c.attribute}</p>

            <button onclick="location.href='detail.html?id=${c.id}'">
                詳細を見る
            </button>

        </div>
        `;

    });

}

// 最初に一覧表示
displayCharacters(characters);

// 検索欄
const search = document.getElementById("search");

if(search){

    search.addEventListener("input", ()=>{

        const text = search.value.toLowerCase();

        const result = characters.filter(c=>
            c.name.toLowerCase().includes(text)
        );

        displayCharacters(result);

    });

}
// ----------------------
// キャラクター詳細ページ
// ----------------------

const detail = document.getElementById("detail");

if(detail){

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const c = characters.find(character => character.id === id);

    if(!c){
        detail.innerHTML = "<p>キャラクターが見つかりません。</p>";
    }else{

        detail.innerHTML = `
        <div class="card">

            <h2>No.${String(c.id).padStart(3,"0")} ${c.name}</h2>

            <h3>基本情報</h3>

<p>
<strong>属性：</strong>
<span class="attribute attribute-${c.attribute}">
${c.attribute}
</span>
</p>
            <p><strong>弱点：</strong>${c.weakness.join("、")}</p>
            <p><strong>耐性：</strong>${c.resistance.join("、")}</p>

            <h3>ステータス</h3>
            
            <div class="status-name">❤️ HP：${c.status.hp}</div>
<div class="status-bar">
<div class="status-fill" style="width:${c.status.hp / 2}%"></div>
</div>


<div class="status-name">⚔️ 攻撃：${c.status.attack}</div>
<div class="status-bar">
<div class="status-fill" style="width:${c.status.attack / 2}%"></div>
</div>


<div class="status-name">🛡️ 防御：${c.status.defense}</div>
<div class="status-bar">
<div class="status-fill" style="width:${c.status.defense / 2}%"></div>
</div>


<div class="status-name">✨ 特攻：${c.status.spAttack}</div>
<div class="status-bar">
<div class="status-fill" style="width:${c.status.spAttack / 2}%"></div>
</div>


<div class="status-name">🔰 特防：${c.status.spDefense}</div>
<div class="status-bar">
<div class="status-fill" style="width:${c.status.spDefense / 2}%"></div>
</div>


<div class="status-name">💨 速度：${c.status.speed}</div>
<div class="status-bar">
<div class="status-fill" style="width:${c.status.speed / 2}%"></div>
</div>

            <h3>特性</h3>
            <ul>
                ${c.abilities.map(a => `<li>${a}</li>`).join("")}
            </ul>

            <h3>技</h3>
            <ul>
                ${c.moves.map(m => `<li>${m}</li>`).join("")}
            </ul>

            <h3>奥義</h3>
            <p>${c.ultimate}</p>

            <h3>専用Z</h3>
            <p>${c.zMove}</p>

        </div>
        `;
    }
}