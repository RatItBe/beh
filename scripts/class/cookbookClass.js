import { cookbookData } from "data/food/cookbookData";

export class CookbookClass {
    static checkLore(player, mainhand) { // itemUse 이벤트에서 실행
        const lore = mainhand.getLore();
        if (lore.length === 0) { // 요리책에 로어가 적혀 있지 않을 경우
            this.setRecipe(player, mainhand, lore);
            return;
        }
        else if (lore[2]?.includes("###")) { // 요리책에 숨겨진 재료가 있을 경우
            this.upgradeRecipe(player, mainhand, lore);
            return;
        }
        else if (lore[1]?.includes("?")) { // 요리책에 결과물이 숨겨진 경우
            this.resultRecipe(player, mainhand, lore);
            return;
        }
        else { // 요리책에 모든 레시피가 작성되어 있는 경우
            player.sendMessage("이미 작성이 완료된 요리책입니다!");
            return;
        }
    }

    static setRecipe(player, mainhand, lore) {
        let recipeData = this.getRecipeData(mainhand); //레시피 데이터를 불러옴
        const randomRecipe = Math.floor(Math.random() * recipeData.length);
        const cookbook = recipeData[randomRecipe]; //레시피 중 하나를 랜덤으로 뽑음
        const randomIngredient = Math.floor(Math.random() * cookbook.ingredient.length);

        const ingredients = cookbook.ingredient.map((ingredient, index) => 
            index === randomIngredient ? ingredient : "###"
        );
        const ingredientString = ingredients.join(", ");
        switch (mainhand.typeId) {
            case "fs:low_cookbook":
                lore.push(`§f${randomRecipe + 1}번째 하급 레시피`);
                lore.push("§f[ 결과물 : ? ]");
                lore.push(`§f[ 재료 : ${ingredientString} ]`);
                break;
            case "fs:middle_cookbook":
                lore.push(`§b${randomRecipe + 1}번째 중급 레시피`);
                lore.push("§b[ 결과물 : ? ]");
                lore.push(`§b[ 재료 : ${ingredientString} ]`);
                break;
            case "fs:high_cookbook":
                lore.push(`§d${randomRecipe + 1}번째 상급 레시피`);
                lore.push("§d[ 결과물 : ? ]");
                lore.push(`§d[ 재료 : ${ingredientString} ]`);
                break;
            case "fs:legendary_cookbook":
                lore.push(`§e${randomRecipe + 1}번째 전설 레시피`);
                lore.push("§e[ 결과물 : ? ]");
                lore.push(`§e[ 재료 : ${ingredientString} ]`);
                break;
        }
        mainhand.setLore(lore);
        player.dimension.playSound("ui.cartography_table.take_result", player.location);
    }

    static upgradeRecipe(player, mainhand, lore) {
        let recipeData = this.getRecipeData(mainhand); //레시피 데이터를 불러옴

        const match = lore[0].match(/\d+/); //로어에서 레시피 번호 추출
        const recipeNum = parseInt(match[0]);
        const cookbook = recipeData.find(r => r.recipeNum === recipeNum); //요리책에 적힌 레시피를 불러옴

        let ingredientLine = lore[2]; //로어에서 재료가 적힌 줄을 불러옴
        let innerText = ingredientLine.replace(/^§.\[ 재료 : /, "").replace("]", "").trim();
        let tokens = innerText.split(",").map(t => t.trim()); //쓸데없는 문자열 제거 및 재료만 배열로 추출

        let hiddenIndexes = [];
        tokens.forEach((t, i) => { //배열에서 숨겨진 재료(###) 위치 찾기
            if (t === "###") hiddenIndexes.push(i);
        });

        let chosen = hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];
        tokens[chosen] = cookbook.ingredient[chosen]; //숨겨진 재료 하나를 랜덤으로 골라 공개함

        //모든 내용을 다시 재조립하고 갱신
        let newLine;
        switch (mainhand.typeId) {
            case "fs:low_cookbook":
                newLine = `§f[ 재료 : ${tokens.join(", ")} ]`;
                break;
            case "fs:middle_cookbook":
                newLine = `§b[ 재료 : ${tokens.join(", ")} ]`;
                break;
            case "fs:high_cookbook":
                newLine = `§d[ 재료 : ${tokens.join(", ")} ]`;
                break;
            case "fs:legendary_cookbook":
                newLine = `§e[ 재료 : ${tokens.join(", ")} ]`;
                break;
        }
        lore[2] = newLine;
        mainhand.setLore(lore);
        player.sendMessage("숨겨진 재료가 공개되었습니다!");
    }

    static resultRecipe(player, mainhand, lore) {
        let recipeData = this.getRecipeData(mainhand); //레시피 데이터를 불러옴

        const match = lore[0].match(/\d+/); //로어에서 레시피 번호 추출
        const recipeNum = parseInt(match[0]);
        const cookbook = recipeData.find(r => r.recipeNum === recipeNum); //요리책에 적힌 레시피를 불러옴

        //모든 내용을 다시 재조립하고 갱신
        let newLine;
        switch (mainhand.typeId) {
            case "fs:low_cookbook":
                newLine = `§f[ 결과물 : ${cookbook.recipeName} ]`;
                break;
            case "fs:middle_cookbook":
                newLine = `§b[ 결과물 : ${cookbook.recipeName} ]`;
                break;
            case "fs:high_cookbook":
                newLine = `§d[ 결과물 : ${cookbook.recipeName} ]`;
                break;
            case "fs:legendary_cookbook":
                newLine = `§e[ 결과물 : ${cookbook.recipeName} ]`;
                break;
        }
        lore[1] = newLine;
        mainhand.setLore(lore);
        player.sendMessage("레시피가 완성되었습니다!")
    }

    static getRecipeData(mainhand) {
        let recipeData;
        switch (mainhand.typeId) {
            case "fs:low_cookbook":
                recipeData = cookbookData.lowCookbook;
                break;
            case "fs:middle_cookbook":
                recipeData = cookbookData.middleCookbook;
                break;
            case "fs:high_cookbook":
                recipeData = cookbookData.highCookbook;
                break;
            case "fs:legendary_cookbook":
                recipeData = cookbookData.legendaryCookbook;
                break;
        }
        return recipeData;
    }
}
