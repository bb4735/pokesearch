// ポケモン名を格納するマップ
let pokemonMap = {};

// ページが読み込まれたときにポケモンのマップを初期化
async function initializePokemonMap() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=1010`);
    if (response.ok) {
        const data = await response.json();
        const requests = data.results.map(async (pokemon) => {
            const speciesResponse = await fetch(pokemon.url);
            if (speciesResponse.ok) {
                const speciesData = await speciesResponse.json();
                const japaneseName = speciesData.names.find(name => name.language.name === "ja").name;
                pokemonMap[japaneseName] = speciesData.name;
            }
        });
        await Promise.all(requests);
    } else {
        console.error("ポケモンリストが取得できません");
    }
}

// 検索ボタンをクリックしたときに呼び出される関数
async function show() {
    const japaneseName = document.getElementById("pokemonInput").value.trim();
    const pokemonName = pokemonMap[japaneseName];

    if (pokemonName) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (response.ok) {
            const data = await response.json();

            const contentDiv = document.getElementById("content");

            // 検索のたびにコンテンツをクリア
            contentDiv.innerHTML = `
                <label for="pokemonInput">ポケモン名:</label>
                <input type="text" id="pokemonInput" placeholder="例: ピカチュウ">
                <button onclick="show()">ポケモンを表示</button>
            `;

            // ポケモンの画像と名前（日本語）を表示
            contentDiv.innerHTML += `
                <p>名前: ${japaneseName}</p>
                <img src="${data.sprites.front_default}" alt="${japaneseName}">
            `;
        } else {
            console.error("ポケモンデータが見つかりません");
        }
    } else {
        console.error("該当するポケモンが見つかりません");
    }
}

// ページロード時にポケモンデータをキャッシュ
document.addEventListener('DOMContentLoaded', initializePokemonMap);
